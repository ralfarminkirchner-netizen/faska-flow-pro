extends Control

const WORLD_SIZE := Vector2(2250.0, 1510.0)
const PLAYER_RADIUS := 18.0
const WALK_SPEED := 215.0
const RUN_SPEED := 285.0
const DODGE_SPEED := 560.0
const MAX_HP := 6
const MAX_STAMINA := 100.0
const MAG_SIZE := 8
const LEARN_GOAL := 8
const LESSONS := ["WORTART", "LESEN", "SATZ", "KOMPOSITUM", "MATHE", "ENGLISCH"]

const TASKS_WORD := [
	{"prompt": "Welche Wortart ist 'fluestert'?", "answers": ["Verb", "Nomen", "Adjektiv"], "correct": 0, "hint": "Fluestert ist etwas, das jemand tut."},
	{"prompt": "Welches Wort ist ein Nomen?", "answers": ["leise", "Schluessel", "rennt"], "correct": 1, "hint": "Ein Schluessel ist ein Ding."},
	{"prompt": "Welches Wort beschreibt eine Eigenschaft?", "answers": ["dunkel", "Zimmer", "suchen"], "correct": 0, "hint": "Dunkel beschreibt, wie ein Raum ist."},
	{"prompt": "Welche Wortart ist 'unter'?", "answers": ["Praeposition", "Verb", "Artikel"], "correct": 0, "hint": "Unter beschreibt eine Lage."},
	{"prompt": "Welche Wortart ist 'weil'?", "answers": ["Nomen", "Konjunktion", "Adjektiv"], "correct": 1, "hint": "Weil verbindet Saetze und nennt einen Grund."},
]

const TASKS_READING := [
	{"prompt": "Lies: Im roten Salon liegt ein Brief. Wo liegt der Brief?", "answers": ["im Salon", "im Garten", "im Keller"], "correct": 0, "hint": "Der Ort steht direkt nach 'im roten'."},
	{"prompt": "Lies: Lumi findet eine Patrone neben der Tuer. Was findet Lumi?", "answers": ["eine Patrone", "eine Lampe", "ein Sofa"], "correct": 0, "hint": "Das gefundene Ding steht nach 'findet'."},
	{"prompt": "Lies: Der alte Flur knarrt leise. Was knarrt?", "answers": ["der Flur", "die Tuer", "der Hund"], "correct": 0, "hint": "Das Subjekt steht am Satzanfang."},
	{"prompt": "Lies: Nach dem Schuss wird es still. Wann wird es still?", "answers": ["nach dem Schuss", "vor dem Schuss", "am Morgen"], "correct": 0, "hint": "Achte auf die Zeitangabe am Anfang."},
]

const TASKS_SENTENCE := [
	{"prompt": "Was passt? Die Lampe ___ hell.", "answers": ["leuchtet", "Lampe", "heller"], "correct": 0, "hint": "Gesucht ist das Tun-Wort."},
	{"prompt": "Welche Satzstelle ist der Ort? Die Notiz liegt auf dem Tisch.", "answers": ["Die Notiz", "liegt", "auf dem Tisch"], "correct": 2, "hint": "Frage: Wo liegt sie?"},
	{"prompt": "Was ist das Subjekt? Der Waechter oeffnet die Tuer.", "answers": ["Der Waechter", "oeffnet", "die Tuer"], "correct": 0, "hint": "Wer handelt?"},
	{"prompt": "Welches Wort verbindet den Grund? Wir warten, ___ der Flur knarrt.", "answers": ["weil", "dunkel", "unter"], "correct": 0, "hint": "Weil nennt einen Grund."},
]

const TASKS_COMPOUND := [
	{"prompt": "Welches Kompositum ist richtig?", "answers": ["Tuergriff", "griffTuer", "Tuer greift"], "correct": 0, "hint": "Der Griff gehoert zur Tuer."},
	{"prompt": "Bilde ein Wort: Kerze + Licht", "answers": ["Kerzenlicht", "Lichtkerze", "kerzlich"], "correct": 0, "hint": "Das Licht kommt von der Kerze."},
	{"prompt": "Bilde ein Wort: Flur + Tuer", "answers": ["Flurtuer", "Tuerflur", "flurig"], "correct": 0, "hint": "Die Tuer fuehrt zum Flur."},
	{"prompt": "Bilde ein Wort: Nacht + Tisch", "answers": ["Tischnacht", "Nachttisch", "nachtig"], "correct": 1, "hint": "Der kleine Tisch steht neben dem Bett."},
]

const TASKS_MATH := [
	{"prompt": "Du hast 8 Patronen und findest 6. Wie viele sind es?", "answers": ["12", "14", "16"], "correct": 1, "hint": "8 + 6 = 14."},
	{"prompt": "3 Schubladen mit je 4 Hinweisen. Wie viele Hinweise?", "answers": ["7", "12", "14"], "correct": 1, "hint": "3 mal 4."},
	{"prompt": "Ein Code ist 40 + 7. Welche Zahl?", "answers": ["47", "407", "43"], "correct": 0, "hint": "Vierzig plus sieben."},
	{"prompt": "Von 15 Kerzen brennen 9. Wie viele sind aus?", "answers": ["4", "6", "9"], "correct": 1, "hint": "15 minus 9."},
]

const TASKS_ENGLISH := [
	{"prompt": "Was bedeutet 'key'?", "answers": ["Schluessel", "Kerze", "Fenster"], "correct": 0, "hint": "Mit einem key oeffnet man Tueren."},
	{"prompt": "Was bedeutet 'door'?", "answers": ["Tuer", "Tisch", "Buch"], "correct": 0, "hint": "Durch eine door geht man in den naechsten Raum."},
	{"prompt": "Was bedeutet 'dark'?", "answers": ["laut", "dunkel", "schnell"], "correct": 1, "hint": "Dark beschreibt wenig Licht."},
	{"prompt": "Was bedeutet 'clue'?", "answers": ["Hinweis", "Gegner", "Munition"], "correct": 0, "hint": "Ein clue hilft beim Loesen."},
]

class TouchLayer:
	extends Control

	var move_vector := Vector2.ZERO
	var buttons := {
		"shoot": false,
		"dodge": false,
		"use": false,
		"learn": false,
		"subject": false,
	}
	var active_move := -1
	var active_buttons := {}
	var mouse_move_active := false
	var mouse_button := ""

	func _ready() -> void:
		set_anchors_preset(Control.PRESET_FULL_RECT)
		mouse_filter = Control.MOUSE_FILTER_PASS
		queue_redraw()

	func _gui_input(event: InputEvent) -> void:
		if not _should_show():
			return
		if event is InputEventScreenTouch:
			if event.pressed:
				var name := _button_at(event.position)
				if name != "":
					buttons[name] = true
					active_buttons[event.index] = name
					accept_event()
				elif _on_stick(event.position):
					active_move = event.index
					_update_stick(event.position)
					accept_event()
			else:
				if active_move == event.index:
					active_move = -1
					move_vector = Vector2.ZERO
				if active_buttons.has(event.index):
					buttons[active_buttons[event.index]] = false
					active_buttons.erase(event.index)
				queue_redraw()
		elif event is InputEventScreenDrag:
			if event.index == active_move:
				_update_stick(event.position)
				accept_event()
		elif event is InputEventMouseButton:
			if event.button_index != MOUSE_BUTTON_LEFT:
				return
			if event.pressed:
				var picked := _button_at(event.position)
				if picked != "":
					mouse_button = picked
					buttons[picked] = true
					accept_event()
				elif _on_stick(event.position):
					mouse_move_active = true
					_update_stick(event.position)
					accept_event()
			else:
				mouse_move_active = false
				move_vector = Vector2.ZERO
				if mouse_button != "":
					buttons[mouse_button] = false
					mouse_button = ""
				queue_redraw()
		elif event is InputEventMouseMotion and mouse_move_active:
			_update_stick(event.position)
			accept_event()

	func is_down(name: String) -> bool:
		return buttons.has(name) and buttons[name]

	func _stick_center() -> Vector2:
		var screen := get_viewport_rect().size
		return Vector2(94.0, screen.y - 104.0)

	func _button_centers() -> Dictionary:
		var screen := get_viewport_rect().size
		return {
			"learn": Vector2(screen.x - 170.0, screen.y - 190.0),
			"subject": Vector2(screen.x - 82.0, screen.y - 190.0),
			"dodge": Vector2(screen.x - 170.0, screen.y - 128.0),
			"shoot": Vector2(screen.x - 82.0, screen.y - 128.0),
			"use": Vector2(screen.x - 82.0, screen.y - 66.0),
		}

	func _on_stick(pos: Vector2) -> bool:
		return pos.distance_to(_stick_center()) <= 84.0

	func _button_at(pos: Vector2) -> String:
		for name in _button_centers().keys():
			if pos.distance_to(_button_centers()[name]) <= 42.0:
				return name
		return ""

	func _update_stick(pos: Vector2) -> void:
		move_vector = (pos - _stick_center()).limit_length(56.0) / 56.0
		queue_redraw()

	func _draw() -> void:
		if not _should_show():
			return
		var font := get_theme_default_font()
		var center := _stick_center()
		draw_circle(center, 62.0, Color(0.02, 0.04, 0.07, 0.58))
		draw_arc(center, 62.0, 0.0, TAU, 48, Color(0.72, 0.86, 1.0, 0.38), 3.0)
		draw_circle(center + move_vector * 42.0, 27.0, Color(0.26, 0.88, 1.0, 0.88))
		var labels := {
			"shoot": "J\nSHOT",
			"dodge": "K\nDODGE",
			"use": "E\nUSE",
			"learn": "L\nLEARN",
			"subject": "F\nFACH",
		}
		for name in _button_centers().keys():
			var button_center: Vector2 = _button_centers()[name]
			var fill := Color(0.05, 0.08, 0.13, 0.78)
			if is_down(name):
				fill = Color(0.62, 0.18, 0.16, 0.95)
			draw_circle(button_center, 38.0, fill)
			draw_arc(button_center, 38.0, 0.0, TAU, 48, Color(0.92, 0.82, 0.66, 0.7), 2.0)
			draw_string(font, button_center + Vector2(-24.0, -9.0), labels[name], HORIZONTAL_ALIGNMENT_CENTER, 48.0, 10, Color.WHITE)

	func _should_show() -> bool:
		var screen := get_viewport_rect().size
		return screen.x < 980.0 or screen.y > screen.x * 1.15

var player_pos := Vector2(245.0, 1210.0)
var player_velocity := Vector2.ZERO
var facing := Vector2.RIGHT
var camera_pos := Vector2.ZERO
var hp := MAX_HP
var stamina := MAX_STAMINA
var ammo := MAG_SIZE
var reserve_ammo := 18
var silver_keys := 0
var evidence := 0
var score := 0
var panic := 0.0
var reload_timer := 0.0
var shoot_cooldown := 0.0
var dodge_timer := 0.0
var invuln_timer := 0.0
var interact_timer := 0.0
var wave_timer := 0.0
var learn_mode := false
var lesson_index := 0
var quiz_index := 0
var learn_score := 0
var repeat_queue: Array = []
var escaped := false
var message := "Finde Beweise, Schluessel und den Nordausgang."
var message_timer := 3.0
var last_touch := {}

var rooms := []
var walls := []
var doors := []
var pickups := []
var enemies := []
var bullets := []
var barricades := []
var traps := []
var learn_gates := []
var safe_zones := []
var touch: TouchLayer

func _ready() -> void:
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	_build_level()
	touch = TouchLayer.new()
	add_child(touch)
	last_touch = {"shoot": false, "dodge": false, "use": false, "learn": false, "subject": false}
	_update_learn_gates()
	set_process(true)

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_L:
			learn_mode = not learn_mode
			_update_learn_gates()
			_set_message("Learncade aktiv" if learn_mode else "Normalmodus")
		elif event.keycode == KEY_F or event.keycode == KEY_TAB:
			_cycle_lesson()
		elif event.keycode == KEY_R:
			_try_reload()
		elif event.keycode == KEY_E or event.keycode == KEY_C:
			_try_interact()
		elif event.keycode == KEY_J or event.keycode == KEY_Z:
			_try_shoot()
		elif event.keycode == KEY_K or event.keycode == KEY_X or event.keycode == KEY_SPACE:
			_try_dodge()

func _process(delta: float) -> void:
	if escaped:
		queue_redraw()
		return
	_tick_timers(delta)
	_handle_touch_edges()
	_update_player(delta)
	_update_enemies(delta)
	_update_bullets(delta)
	_update_traps(delta)
	_update_pickups()
	_update_doors()
	_update_learn_contacts()
	_update_camera()
	queue_redraw()

func _tick_timers(delta: float) -> void:
	reload_timer = maxf(0.0, reload_timer - delta)
	shoot_cooldown = maxf(0.0, shoot_cooldown - delta)
	dodge_timer = maxf(0.0, dodge_timer - delta)
	invuln_timer = maxf(0.0, invuln_timer - delta)
	interact_timer = maxf(0.0, interact_timer - delta)
	message_timer = maxf(0.0, message_timer - delta)
	panic = maxf(0.0, panic - delta * 5.0)
	if stamina < MAX_STAMINA and dodge_timer <= 0.0:
		stamina = minf(MAX_STAMINA, stamina + delta * 18.0)
	wave_timer += delta
	if wave_timer > 22.0:
		wave_timer = 0.0
		var kind := "stalker" if panic > 42.0 or evidence >= 4 else "crawler"
		_spawn_enemy(_pick_spawn(), kind)
		_set_message("Du hoerst Schritte im Flur.")

func _handle_touch_edges() -> void:
	for name in last_touch.keys():
		var now := touch.is_down(name)
		if now and not last_touch[name]:
			if name == "shoot":
				_try_shoot()
			elif name == "dodge":
				_try_dodge()
			elif name == "use":
				_try_interact()
			elif name == "learn":
				learn_mode = not learn_mode
				_update_learn_gates()
				_set_message("Learncade aktiv" if learn_mode else "Normalmodus")
			elif name == "subject":
				_cycle_lesson()
		last_touch[name] = now

func _update_player(delta: float) -> void:
	var input_vec := Vector2.ZERO
	input_vec.x = float(Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT)) - float(Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT))
	input_vec.y = float(Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN)) - float(Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP))
	if touch.move_vector.length() > 0.08:
		input_vec += touch.move_vector
	input_vec = input_vec.limit_length(1.0)
	if input_vec.length() > 0.05:
		facing = input_vec.normalized()
	var target_speed := RUN_SPEED if Input.is_key_pressed(KEY_SHIFT) and stamina > 8.0 else WALK_SPEED
	if target_speed == RUN_SPEED and input_vec.length() > 0.05:
		stamina = maxf(0.0, stamina - delta * 16.0)
	if dodge_timer > 0.0:
		player_velocity = facing * DODGE_SPEED
	else:
		player_velocity = input_vec * target_speed
	var next_pos := player_pos + player_velocity * delta
	_move_player(next_pos)
	if _in_safe_zone(player_pos):
		panic = maxf(0.0, panic - delta * 12.0)
		if ammo < MAG_SIZE and reserve_ammo > 0 and reload_timer <= 0.0:
			_try_reload()

func _move_player(next_pos: Vector2) -> void:
	var clamped := next_pos.clamp(Vector2(40.0, 40.0), WORLD_SIZE - Vector2(40.0, 40.0))
	if _can_stand(Vector2(clamped.x, player_pos.y)):
		player_pos.x = clamped.x
	if _can_stand(Vector2(player_pos.x, clamped.y)):
		player_pos.y = clamped.y

func _can_stand(pos: Vector2) -> bool:
	var player_rect := Rect2(pos - Vector2(PLAYER_RADIUS, PLAYER_RADIUS), Vector2(PLAYER_RADIUS * 2.0, PLAYER_RADIUS * 2.0))
	for wall in walls:
		if player_rect.intersects(wall):
			return false
	for door in doors:
		if not door["open"] and player_rect.intersects(door["rect"]):
			return false
	for barrier in barricades:
		if barrier["hp"] > 0 and player_rect.intersects(barrier["rect"]):
			return false
	return true

func _try_shoot() -> void:
	if shoot_cooldown > 0.0 or reload_timer > 0.0:
		return
	if ammo <= 0:
		_set_message("Magazin leer")
		_try_reload()
		return
	ammo -= 1
	shoot_cooldown = 0.22
	panic += 4.0
	bullets.append({
		"pos": player_pos + facing * 25.0,
		"vel": facing * 820.0,
		"life": 0.7,
	})
	_set_message("Schuss")

func _try_dodge() -> void:
	if stamina < 24.0 or dodge_timer > 0.0:
		return
	stamina -= 24.0
	dodge_timer = 0.22
	invuln_timer = 0.38
	panic += 1.5
	_set_message("Perfect-Dodge-Fenster")

func _try_reload() -> void:
	if reload_timer > 0.0 or ammo >= MAG_SIZE or reserve_ammo <= 0:
		return
	reload_timer = 1.0 + panic * 0.01
	var needed := MAG_SIZE - ammo
	var taken := mini(needed, reserve_ammo)
	ammo += taken
	reserve_ammo -= taken
	_set_message("Reload")

func _try_interact() -> void:
	if interact_timer > 0.0:
		return
	interact_timer = 0.25
	for door in doors:
		if player_pos.distance_to(door["rect"].get_center()) < 70.0:
			if door["open"]:
				door["open"] = false
				_set_message("Tuer geschlossen")
			elif door["locked"]:
				if silver_keys > 0:
					silver_keys -= 1
					door["locked"] = false
					door["open"] = true
					score += 80
					_set_message("Schluessel benutzt")
				else:
					_set_message("Verschlossen")
			else:
				door["open"] = true
				_set_message("Tuer geoeffnet")
			return
	for barrier in barricades:
		if barrier["hp"] > 0 and player_pos.distance_to(barrier["rect"].get_center()) < 80.0:
			barrier["hp"] = 0
			score += 40
			_set_message("Barrikade geloest")
			return
	if _near_exit():
		if evidence >= 5 and silver_keys >= 1:
			escaped = true
			score += 1200
			_set_message("Ausgang geschafft")
		else:
			_set_message("Du brauchst 5 Beweise und 1 Ausgangsschluessel")

func _update_enemies(delta: float) -> void:
	for enemy in enemies:
		if enemy["hp"] <= 0:
			continue
		enemy["attack"] = maxf(0.0, enemy["attack"] - delta)
		var to_player: Vector2 = player_pos - enemy["pos"]
		var dist: float = to_player.length()
		var speed: float = enemy["speed"]
		var dir := Vector2.ZERO
		if dist < enemy["sense"] or panic > 25.0:
			dir = to_player.normalized()
		else:
			enemy["wander"] += delta
			dir = Vector2(cos(enemy["wander"]), sin(enemy["wander"] * 0.7)).normalized()
		var next_pos: Vector2 = enemy["pos"] + dir * speed * delta
		if _enemy_can_stand(next_pos):
			enemy["pos"] = next_pos
		var hit_range := float(enemy.get("radius", 18.0)) + PLAYER_RADIUS - 3.0
		if dist < hit_range and enemy["attack"] <= 0.0:
			enemy["attack"] = 1.05
			_damage(2 if str(enemy.get("kind", "")) == "stalker" else 1, "Biss")

func _enemy_can_stand(pos: Vector2) -> bool:
	var rect := Rect2(pos - Vector2(16.0, 16.0), Vector2(32.0, 32.0))
	for wall in walls:
		if rect.intersects(wall):
			return false
	for door in doors:
		if not door["open"] and rect.intersects(door["rect"]):
			return false
	return true

func _update_bullets(delta: float) -> void:
	for bullet in bullets:
		if bullet["life"] <= 0.0:
			continue
		bullet["life"] -= delta
		bullet["pos"] += bullet["vel"] * delta
		if _bullet_hits_wall(bullet["pos"]):
			bullet["life"] = 0.0
			continue
		for enemy in enemies:
			if enemy["hp"] > 0 and bullet["pos"].distance_to(enemy["pos"]) < 24.0:
				enemy["hp"] -= 1
				bullet["life"] = 0.0
				panic += 3.0
				score += 40
				if enemy["hp"] <= 0:
					score += 160
					_set_message("Gegner ausgeschaltet")
				break
		for barrier in barricades:
			if barrier["hp"] > 0 and barrier["rect"].has_point(bullet["pos"]):
				barrier["hp"] -= 1
				bullet["life"] = 0.0
				if barrier["hp"] <= 0:
					score += 50
					_set_message("Barrikade gebrochen")
				break
	bullets = bullets.filter(func(b): return b["life"] > 0.0)

func _bullet_hits_wall(pos: Vector2) -> bool:
	for wall in walls:
		if wall.has_point(pos):
			return true
	for door in doors:
		if not door["open"] and door["rect"].has_point(pos):
			return true
	return false

func _update_traps(delta: float) -> void:
	for trap in traps:
		trap["phase"] += delta
		var active := fmod(trap["phase"], 2.6) > 1.25
		trap["active"] = active
		if active and Rect2(trap["pos"] - Vector2(24.0, 24.0), Vector2(48.0, 48.0)).has_point(player_pos):
			_damage(1, "Falle")

func _update_pickups() -> void:
	for pickup in pickups:
		if pickup["taken"]:
			continue
		if player_pos.distance_to(pickup["pos"]) < 34.0:
			pickup["taken"] = true
			var kind: String = pickup["kind"]
			if kind == "ammo":
				reserve_ammo += 8
				score += 40
				_set_message("Munition")
			elif kind == "herb":
				hp = mini(MAX_HP, hp + 2)
				score += 40
				_set_message("Erste Hilfe")
			elif kind == "key":
				silver_keys += 1
				score += 90
				_set_message("Silberschluessel")
			elif kind == "evidence":
				evidence += 1
				score += 150
				_set_message("Beweis %d/5" % evidence)

func _update_doors() -> void:
	for door in doors:
		if door["locked"]:
			continue
		if player_pos.distance_to(door["rect"].get_center()) < 44.0:
			door["hint"] = "E: Tuer"
		else:
			door["hint"] = ""

func _update_learn_contacts() -> void:
	if not learn_mode:
		return
	for gate in learn_gates:
		if gate["cooldown"] > 0.0:
			gate["cooldown"] -= get_process_delta_time()
		if gate["cooldown"] <= 0.0 and player_pos.distance_to(gate["pos"]) < 42.0:
			var task: Dictionary = _current_task()
			var repeated := bool(task.get("repeat", false))
			if int(gate["answer"]) == int(task["correct"]):
				learn_score += 1
				score += 260 if repeated else 200
				reserve_ammo += 4 if repeated else 3
				panic = maxf(0.0, panic - 10.0)
				_remove_repeat(task)
				if learn_score == LEARN_GOAL:
					silver_keys += 1
					score += 500
					_set_message("Lernziel geschafft: Ausgangsschluessel")
				else:
					_set_message("Wiederholung geloest" if repeated else "Richtig: +Munition")
			else:
				panic += 18.0
				_queue_repeat(task)
				_damage(1, "Falsches Siegel")
				_set_message("Aufgabe kommt wieder. Tipp: %s" % str(task.get("hint", "")))
			quiz_index = (quiz_index + 1) % _question_bank().size()
			gate["cooldown"] = 2.0
			_update_learn_gates()

func _damage(amount: int, text: String) -> void:
	if invuln_timer > 0.0:
		score += 35
		_set_message("Perfekt ausgewichen")
		return
	hp -= amount
	panic += 14.0
	invuln_timer = 0.8
	_set_message(text)
	if hp <= 0:
		hp = MAX_HP
		player_pos = Vector2(245.0, 1210.0)
		panic = 0.0
		score = max(0, score - 250)
		_set_message("Safe-Room Neustart")

func _update_camera() -> void:
	var viewport := get_viewport_rect().size
	camera_pos = player_pos - viewport * 0.5
	camera_pos = camera_pos.clamp(Vector2.ZERO, WORLD_SIZE - viewport)

func _build_level() -> void:
	rooms = [
		Rect2(90, 1080, 430, 300),
		Rect2(520, 1070, 430, 310),
		Rect2(950, 1040, 390, 340),
		Rect2(1330, 1030, 420, 350),
		Rect2(1740, 1050, 390, 330),
		Rect2(90, 680, 460, 320),
		Rect2(560, 650, 360, 350),
		Rect2(940, 620, 420, 360),
		Rect2(1370, 635, 390, 340),
		Rect2(1760, 650, 380, 340),
		Rect2(180, 230, 420, 330),
		Rect2(650, 220, 430, 350),
		Rect2(1130, 220, 390, 350),
		Rect2(1570, 210, 450, 360),
	]
	safe_zones = [Rect2(90, 1080, 430, 300), Rect2(1760, 650, 380, 340)]
	_build_walls()
	doors = [
		{"rect": Rect2(500, 1190, 38, 88), "open": false, "locked": false, "hint": ""},
		{"rect": Rect2(930, 1168, 38, 88), "open": false, "locked": true, "hint": ""},
		{"rect": Rect2(1322, 1162, 38, 88), "open": false, "locked": false, "hint": ""},
		{"rect": Rect2(1730, 1162, 38, 88), "open": false, "locked": true, "hint": ""},
		{"rect": Rect2(402, 990, 96, 38), "open": true, "locked": false, "hint": ""},
		{"rect": Rect2(735, 1018, 96, 38), "open": false, "locked": false, "hint": ""},
		{"rect": Rect2(1090, 990, 96, 38), "open": false, "locked": true, "hint": ""},
		{"rect": Rect2(1518, 990, 96, 38), "open": false, "locked": false, "hint": ""},
		{"rect": Rect2(1864, 1000, 96, 38), "open": true, "locked": false, "hint": ""},
		{"rect": Rect2(470, 560, 88, 38), "open": false, "locked": false, "hint": ""},
		{"rect": Rect2(890, 560, 88, 38), "open": false, "locked": true, "hint": ""},
		{"rect": Rect2(1300, 560, 88, 38), "open": false, "locked": false, "hint": ""},
		{"rect": Rect2(1690, 560, 88, 38), "open": false, "locked": true, "hint": ""},
	]
	pickups = [
		{"pos": Vector2(410, 1188), "kind": "ammo", "taken": false},
		{"pos": Vector2(850, 1260), "kind": "herb", "taken": false},
		{"pos": Vector2(1040, 1220), "kind": "evidence", "taken": false},
		{"pos": Vector2(1510, 1210), "kind": "key", "taken": false},
		{"pos": Vector2(1900, 1190), "kind": "evidence", "taken": false},
		{"pos": Vector2(250, 820), "kind": "evidence", "taken": false},
		{"pos": Vector2(750, 820), "kind": "ammo", "taken": false},
		{"pos": Vector2(1220, 790), "kind": "key", "taken": false},
		{"pos": Vector2(1535, 790), "kind": "evidence", "taken": false},
		{"pos": Vector2(1940, 810), "kind": "herb", "taken": false},
		{"pos": Vector2(345, 390), "kind": "key", "taken": false},
		{"pos": Vector2(840, 380), "kind": "evidence", "taken": false},
		{"pos": Vector2(1290, 388), "kind": "ammo", "taken": false},
		{"pos": Vector2(1780, 385), "kind": "evidence", "taken": false},
	]
	barricades = [
		{"rect": Rect2(692, 682, 160, 30), "hp": 3},
		{"rect": Rect2(1465, 906, 150, 30), "hp": 2},
		{"rect": Rect2(1190, 284, 145, 30), "hp": 3},
	]
	traps = [
		{"pos": Vector2(1110, 895), "phase": 0.3, "active": false},
		{"pos": Vector2(1600, 760), "phase": 1.3, "active": false},
		{"pos": Vector2(900, 455), "phase": 0.9, "active": false},
	]
	learn_gates = [
		{"pos": Vector2(760, 900), "answer": 0, "cooldown": 0.0, "label": ""},
		{"pos": Vector2(900, 900), "answer": 1, "cooldown": 0.0, "label": ""},
		{"pos": Vector2(1040, 900), "answer": 2, "cooldown": 0.0, "label": ""},
	]
	enemies = []
	_spawn_enemy(Vector2(1175, 880), "crawler")
	_spawn_enemy(Vector2(1535, 865), "walker")
	_spawn_enemy(Vector2(1950, 1220), "stalker")
	_spawn_enemy(Vector2(795, 410), "walker")

func _build_walls() -> void:
	walls = [
		Rect2(0, 0, WORLD_SIZE.x, 44),
		Rect2(0, WORLD_SIZE.y - 44, WORLD_SIZE.x, 44),
		Rect2(0, 0, 44, WORLD_SIZE.y),
		Rect2(WORLD_SIZE.x - 44, 0, 44, WORLD_SIZE.y),
		Rect2(70, 1040, 2080, 24),
		Rect2(70, 1400, 2080, 24),
		Rect2(70, 1010, 24, 420),
		Rect2(2140, 1010, 24, 420),
		Rect2(70, 600, 2080, 24),
		Rect2(70, 1020, 2080, 24),
		Rect2(70, 600, 24, 440),
		Rect2(2140, 600, 24, 440),
		Rect2(140, 180, 1920, 24),
		Rect2(140, 600, 1920, 24),
		Rect2(140, 180, 24, 440),
		Rect2(2040, 180, 24, 440),
		Rect2(520, 1065, 22, 330),
		Rect2(950, 1035, 22, 350),
		Rect2(1338, 1032, 22, 350),
		Rect2(1755, 1040, 22, 350),
		Rect2(550, 635, 22, 380),
		Rect2(920, 625, 22, 390),
		Rect2(1360, 625, 22, 390),
		Rect2(1760, 625, 22, 390),
		Rect2(610, 205, 22, 395),
		Rect2(1090, 205, 22, 395),
		Rect2(1530, 205, 22, 395),
		Rect2(300, 1210, 120, 28),
		Rect2(1065, 1302, 190, 28),
		Rect2(1450, 1100, 28, 150),
		Rect2(1810, 740, 28, 160),
		Rect2(320, 322, 180, 26),
		Rect2(1660, 310, 250, 26),
	]

func _spawn_enemy(pos: Vector2, kind := "walker") -> void:
	var hp_value := 2
	var speed_value := 74.0 + enemies.size() * 4.0
	var sense_value := 360.0
	var radius_value := 19.0
	var color_value := Color(0.47, 0.09, 0.11)
	if kind == "crawler":
		hp_value = 1
		speed_value = 104.0 + enemies.size() * 3.0
		sense_value = 300.0
		radius_value = 15.0
		color_value = Color(0.55, 0.16, 0.09)
	elif kind == "stalker":
		hp_value = 3
		speed_value = 92.0 + enemies.size() * 3.0
		sense_value = 520.0
		radius_value = 22.0
		color_value = Color(0.35, 0.03, 0.12)
	enemies.append({
		"kind": kind,
		"pos": pos,
		"hp": hp_value,
		"max_hp": hp_value,
		"speed": speed_value,
		"sense": sense_value,
		"radius": radius_value,
		"color": color_value,
		"attack": 0.0,
		"wander": enemies.size() * 1.9,
	})

func _pick_spawn() -> Vector2:
	var spawns := [Vector2(430, 820), Vector2(1890, 790), Vector2(1340, 360), Vector2(1830, 1210)]
	return spawns[int(wave_timer + score) % spawns.size()]

func _in_safe_zone(pos: Vector2) -> bool:
	for zone in safe_zones:
		if zone.has_point(pos):
			return true
	return false

func _near_exit() -> bool:
	return player_pos.distance_to(Vector2(1980, 250)) < 90.0

func _question_bank() -> Array:
	var lesson := str(LESSONS[lesson_index])
	if lesson == "LESEN":
		return TASKS_READING
	if lesson == "SATZ":
		return TASKS_SENTENCE
	if lesson == "KOMPOSITUM":
		return TASKS_COMPOUND
	if lesson == "MATHE":
		return TASKS_MATH
	if lesson == "ENGLISCH":
		return TASKS_ENGLISH
	return TASKS_WORD

func _current_task() -> Dictionary:
	var lesson := str(LESSONS[lesson_index])
	for entry in repeat_queue:
		if str(entry.get("lesson", "")) == lesson:
			return entry["task"]
	var bank := _question_bank()
	var task: Dictionary = bank[quiz_index % bank.size()].duplicate(true)
	task["lesson"] = lesson
	return task

func _task_id(task: Dictionary) -> String:
	return "%s::%s" % [str(task.get("lesson", LESSONS[lesson_index])), str(task.get("prompt", ""))]

func _queue_repeat(task: Dictionary) -> void:
	var copy := task.duplicate(true)
	copy["lesson"] = str(copy.get("lesson", LESSONS[lesson_index]))
	copy["repeat"] = true
	var id := _task_id(copy)
	for entry in repeat_queue:
		var stored: Dictionary = entry["task"]
		if _task_id(stored) == id:
			return
	if repeat_queue.size() >= 8:
		repeat_queue.pop_front()
	repeat_queue.append({"lesson": copy["lesson"], "task": copy})

func _remove_repeat(task: Dictionary) -> void:
	var id := _task_id(task)
	for i in range(repeat_queue.size() - 1, -1, -1):
		var stored: Dictionary = repeat_queue[i]["task"]
		if _task_id(stored) == id:
			repeat_queue.remove_at(i)

func _cycle_lesson() -> void:
	lesson_index = (lesson_index + 1) % LESSONS.size()
	quiz_index = 0
	_update_learn_gates()
	_set_message("Fach: %s" % str(LESSONS[lesson_index]))

func _update_learn_gates() -> void:
	var task: Dictionary = _current_task()
	for gate in learn_gates:
		gate["label"] = task["answers"][gate["answer"]]
		gate["repeat"] = bool(task.get("repeat", false))
	if learn_mode:
		message = task["prompt"]
		message_timer = 4.0

func _set_message(text: String) -> void:
	message = text
	message_timer = 3.0

func _current_goal_pos() -> Vector2:
	if evidence < 5:
		var best := Vector2(1980, 250)
		var best_dist := INF
		for pickup in pickups:
			if pickup["taken"] or pickup["kind"] != "evidence":
				continue
			var dist := player_pos.distance_to(pickup["pos"])
			if dist < best_dist:
				best_dist = dist
				best = pickup["pos"]
		return best
	if silver_keys < 1:
		var best_key := Vector2(1980, 250)
		var best_key_dist := INF
		for pickup in pickups:
			if pickup["taken"] or pickup["kind"] != "key":
				continue
			var dist := player_pos.distance_to(pickup["pos"])
			if dist < best_key_dist:
				best_key_dist = dist
				best_key = pickup["pos"]
		return best_key
	return Vector2(1980, 250)

func _objective_text() -> String:
	if evidence < 5:
		return "Beweis %d/5" % evidence
	if silver_keys < 1:
		return "Ausgangsschluessel"
	return "Nordausgang"

func _draw_objective_arrow(player_screen: Vector2) -> void:
	var dir := (_current_goal_pos() - player_pos).normalized()
	if dir.length() < 0.1:
		return
	var start := player_screen + dir * 38.0
	var end := player_screen + dir * 74.0
	draw_line(start, end, Color(1.0, 0.88, 0.35, 0.82), 4.0)
	draw_colored_polygon([
		end + dir * 14.0,
		end + dir.rotated(2.45) * 12.0,
		end + dir.rotated(-2.45) * 12.0,
	], Color(1.0, 0.88, 0.35, 0.82))

func _draw() -> void:
	var screen := get_viewport_rect().size
	_draw_world(screen)
	_draw_entities(screen)
	_draw_lighting(screen)
	_draw_hud(screen)

func _world_to_screen(pos: Vector2) -> Vector2:
	return pos - camera_pos

func _draw_world(screen: Vector2) -> void:
	draw_rect(Rect2(Vector2.ZERO, screen), Color(0.025, 0.028, 0.035))
	for room in rooms:
		var color := Color(0.16, 0.15, 0.17)
		if _in_safe_zone(room.get_center()):
			color = Color(0.10, 0.18, 0.19)
		draw_rect(Rect2(_world_to_screen(room.position), room.size), color)
		draw_rect(Rect2(_world_to_screen(room.position), room.size), Color(0.45, 0.39, 0.34), false, 3.0)
	for wall in walls:
		draw_rect(Rect2(_world_to_screen(wall.position), wall.size), Color(0.08, 0.075, 0.085))
	for door in doors:
		var color := Color(0.22, 0.15, 0.10)
		if door["locked"]:
			color = Color(0.48, 0.32, 0.08)
		if door["open"]:
			color = Color(0.14, 0.30, 0.18)
		draw_rect(Rect2(_world_to_screen(door["rect"].position), door["rect"].size), color)
	for barrier in barricades:
		if barrier["hp"] > 0:
			draw_rect(Rect2(_world_to_screen(barrier["rect"].position), barrier["rect"].size), Color(0.45, 0.25, 0.12))
	for trap in traps:
		var trap_color := Color(0.8, 0.12, 0.1, 0.85) if trap["active"] else Color(0.25, 0.2, 0.18, 0.8)
		draw_circle(_world_to_screen(trap["pos"]), 24.0, trap_color)
	draw_rect(Rect2(_world_to_screen(Vector2(1905, 205)), Vector2(160, 78)), Color(0.22, 0.16, 0.38))
	draw_string(get_theme_default_font(), _world_to_screen(Vector2(1920, 252)), "EXIT", HORIZONTAL_ALIGNMENT_CENTER, 130.0, 22, Color(1.0, 0.92, 0.55))

func _draw_entities(screen: Vector2) -> void:
	var font := get_theme_default_font()
	for pickup in pickups:
		if pickup["taken"]:
			continue
		var pos := _world_to_screen(pickup["pos"])
		var color := Color(0.85, 0.85, 0.4)
		var label := "AMMO"
		if pickup["kind"] == "herb":
			color = Color(0.18, 0.85, 0.34)
			label = "HP"
		elif pickup["kind"] == "key":
			color = Color(0.80, 0.88, 1.0)
			label = "KEY"
		elif pickup["kind"] == "evidence":
			color = Color(0.68, 0.43, 1.0)
			label = "NOTE"
		draw_circle(pos, 16.0, color)
		draw_string(font, pos + Vector2(-24, -22), label, HORIZONTAL_ALIGNMENT_CENTER, 48.0, 10, Color.WHITE)
	if learn_mode:
		var task: Dictionary = _current_task()
		draw_string(font, Vector2(screen.x * 0.5 - 230, 32), task["prompt"], HORIZONTAL_ALIGNMENT_CENTER, 460.0, 18, Color(1.0, 0.95, 0.72))
		for gate in learn_gates:
			var pos := _world_to_screen(gate["pos"])
			var ring := Color(0.95, 0.52, 1.0) if bool(gate.get("repeat", false)) else Color(0.70, 0.95, 1.0)
			draw_circle(pos, 34.0, Color(0.1, 0.35, 0.75, 0.58))
			draw_arc(pos, 34.0, 0.0, TAU, 40, ring, 3.0)
			draw_string(font, pos + Vector2(-42, 5), gate["label"], HORIZONTAL_ALIGNMENT_CENTER, 84.0, 12, Color.WHITE)
	for bullet in bullets:
		draw_circle(_world_to_screen(bullet["pos"]), 5.0, Color(1.0, 0.88, 0.38))
	for enemy in enemies:
		if enemy["hp"] <= 0:
			continue
		var pos: Vector2 = _world_to_screen(enemy["pos"])
		var radius := float(enemy.get("radius", 19.0))
		draw_circle(pos, radius, enemy.get("color", Color(0.47, 0.09, 0.11)))
		if str(enemy.get("kind", "")) == "stalker":
			draw_arc(pos, radius + 7.0, -0.6, TAU - 0.6, 36, Color(0.96, 0.45, 0.72, 0.65), 2.0)
		draw_circle(pos + Vector2(6, -5), 4.0, Color(1.0, 0.84, 0.65))
		draw_rect(Rect2(pos + Vector2(-18, radius + 7.0), Vector2(36.0 * enemy["hp"] / max(1.0, float(enemy.get("max_hp", 2))), 4.0)), Color(0.78, 0.05, 0.08))
	var p := _world_to_screen(player_pos)
	_draw_objective_arrow(p)
	var flash_end := p + facing * 170.0
	draw_colored_polygon([p + facing.rotated(-0.55) * 24.0, flash_end + facing.rotated(-0.32) * 86.0, flash_end + facing.rotated(0.32) * 86.0, p + facing.rotated(0.55) * 24.0], Color(1.0, 0.88, 0.45, 0.16))
	var player_color := Color(0.95, 0.72, 0.34) if invuln_timer <= 0.0 else Color(0.35, 0.85, 1.0)
	draw_circle(p, PLAYER_RADIUS, player_color)
	draw_line(p, p + facing * 26.0, Color(0.08, 0.10, 0.12), 4.0)

func _draw_lighting(screen: Vector2) -> void:
	var alpha := 0.28 + minf(0.26, panic / 130.0)
	draw_rect(Rect2(Vector2.ZERO, screen), Color(0.0, 0.0, 0.0, alpha))
	var p := _world_to_screen(player_pos)
	draw_circle(p, 140.0, Color(0.85, 0.82, 0.55, 0.10))
	if panic > 35.0:
		draw_rect(Rect2(Vector2.ZERO, screen), Color(0.55, 0.02, 0.02, minf(0.18, panic / 500.0)))

func _draw_hud(screen: Vector2) -> void:
	var font := get_theme_default_font()
	var hud_w := minf(430.0, screen.x - 16.0)
	var text_w := maxf(220.0, hud_w - 34.0)
	draw_rect(Rect2(8, 8, hud_w, 132), Color(0.02, 0.03, 0.05, 0.76))
	draw_string(font, Vector2(20, 28), "FASKA MANSION PRO", HORIZONTAL_ALIGNMENT_LEFT, text_w, 15, Color(1.0, 0.94, 0.78))
	draw_string(font, Vector2(20, 52), "HP %d/%d  Ammo %d/%d  Key %d  Score %d" % [hp, MAX_HP, ammo, reserve_ammo, silver_keys, score], HORIZONTAL_ALIGNMENT_LEFT, text_w, 13, Color.WHITE)
	draw_string(font, Vector2(20, 74), "%s  Mode %s  Fach %s" % [_objective_text(), "Learncade" if learn_mode else "Normal", str(LESSONS[lesson_index])], HORIZONTAL_ALIGNMENT_LEFT, text_w, 13, Color.WHITE)
	draw_string(font, Vector2(20, 96), "Lernziel %d/%d  Fehler-Wdh %d" % [learn_score, LEARN_GOAL, repeat_queue.size()], HORIZONTAL_ALIGNMENT_LEFT, text_w, 13, Color(1.0, 0.92, 0.62))
	draw_rect(Rect2(20, 110, 150, 8), Color(0.16, 0.18, 0.20))
	draw_rect(Rect2(20, 110, 150.0 * stamina / MAX_STAMINA, 8), Color(0.25, 0.75, 0.95))
	draw_rect(Rect2(20, 124, 150, 8), Color(0.16, 0.18, 0.20))
	draw_rect(Rect2(20, 124, 150.0 * minf(100.0, panic) / 100.0, 8), Color(0.92, 0.25, 0.18))
	_draw_minimap(screen)
	if message_timer > 0.0 or learn_mode:
		var panel_y := 58.0 if learn_mode else 12.0
		draw_rect(Rect2(screen.x * 0.5 - 280, panel_y, 560, 44), Color(0.02, 0.03, 0.05, 0.62))
		draw_string(font, Vector2(screen.x * 0.5 - 260, panel_y + 28.0), message, HORIZONTAL_ALIGNMENT_CENTER, 520.0, 16, Color(1.0, 0.94, 0.74))
	if reload_timer > 0.0:
		draw_string(font, Vector2(screen.x * 0.5 - 80, screen.y - 120), "RELOAD", HORIZONTAL_ALIGNMENT_CENTER, 160.0, 22, Color(1.0, 0.86, 0.45))
	if escaped:
		draw_rect(Rect2(Vector2.ZERO, screen), Color(0.0, 0.0, 0.0, 0.72))
		draw_string(font, Vector2(screen.x * 0.5 - 260, screen.y * 0.5 - 18), "AUSGANG GESCHAFFT - SCORE %d" % score, HORIZONTAL_ALIGNMENT_CENTER, 520.0, 26, Color(1.0, 0.92, 0.55))

func _draw_minimap(screen: Vector2) -> void:
	if screen.x < 760.0 or screen.y > screen.x * 1.15:
		return
	var map_size := Vector2(158.0, 106.0)
	var origin := Vector2(screen.x - map_size.x - 22.0, 72.0)
	draw_rect(Rect2(origin - Vector2(8.0, 8.0), map_size + Vector2(16.0, 16.0)), Color(0.02, 0.03, 0.05, 0.62))
	draw_rect(Rect2(origin, map_size), Color(0.09, 0.10, 0.12, 0.8), true)
	for room in rooms:
		var p := origin + Vector2(room.position.x / WORLD_SIZE.x * map_size.x, room.position.y / WORLD_SIZE.y * map_size.y)
		var s := Vector2(room.size.x / WORLD_SIZE.x * map_size.x, room.size.y / WORLD_SIZE.y * map_size.y)
		draw_rect(Rect2(p, s), Color(0.23, 0.22, 0.24, 0.9), true)
	for pickup in pickups:
		if pickup["taken"]:
			continue
		var color := Color(0.68, 0.43, 1.0) if pickup["kind"] == "evidence" else Color(0.85, 0.85, 0.4)
		var p := origin + Vector2(pickup["pos"].x / WORLD_SIZE.x * map_size.x, pickup["pos"].y / WORLD_SIZE.y * map_size.y)
		draw_circle(p, 2.5, color)
	var gp := _current_goal_pos()
	draw_circle(origin + Vector2(gp.x / WORLD_SIZE.x * map_size.x, gp.y / WORLD_SIZE.y * map_size.y), 4.0, Color(1.0, 0.88, 0.35))
	draw_circle(origin + Vector2(player_pos.x / WORLD_SIZE.x * map_size.x, player_pos.y / WORLD_SIZE.y * map_size.y), 3.5, Color(0.25, 0.84, 1.0))
