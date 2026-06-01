extends Control

const WORLD_SIZE := Vector2(2250.0, 1510.0)
const PLAYER_RADIUS := 18.0
const WALK_SPEED := 215.0
const RUN_SPEED := 285.0
const DODGE_SPEED := 560.0
const MAX_HP := 6
const MAX_STAMINA := 100.0
const MAG_SIZE := 8

const LEARN_TASKS := [
	{"prompt": "Welche Wortart ist 'fluestert'?", "answers": ["Verb", "Nomen", "Adjektiv"], "correct": 0},
	{"prompt": "Welches Wort ist ein Nomen?", "answers": ["leise", "Schluessel", "rennt"], "correct": 1},
	{"prompt": "Was passt in den Satz: Die Lampe ___ hell.", "answers": ["leuchtet", "Lampe", "heller"], "correct": 0},
	{"prompt": "Welches Wort beschreibt eine Eigenschaft?", "answers": ["dunkel", "Zimmer", "suchen"], "correct": 0},
	{"prompt": "Welches Kompositum ist richtig?", "answers": ["Tuergriff", "griffTuer", "Tuer greift"], "correct": 0},
]

class TouchLayer:
	extends Control

	var move_vector := Vector2.ZERO
	var buttons := {
		"shoot": false,
		"dodge": false,
		"use": false,
		"learn": false,
	}
	var active_move := -1
	var active_buttons := {}
	var mouse_move_active := false
	var mouse_button := ""

	func _ready() -> void:
		set_anchors_preset(Control.PRESET_FULL_RECT)
		mouse_filter = Control.MOUSE_FILTER_STOP
		queue_redraw()

	func _gui_input(event: InputEvent) -> void:
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
			"shoot": Vector2(screen.x - 92.0, screen.y - 138.0),
			"dodge": Vector2(screen.x - 176.0, screen.y - 88.0),
			"use": Vector2(screen.x - 92.0, screen.y - 56.0),
			"learn": Vector2(screen.x - 256.0, screen.y - 58.0),
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
		}
		for name in _button_centers().keys():
			var button_center: Vector2 = _button_centers()[name]
			var fill := Color(0.05, 0.08, 0.13, 0.78)
			if is_down(name):
				fill = Color(0.62, 0.18, 0.16, 0.95)
			draw_circle(button_center, 38.0, fill)
			draw_arc(button_center, 38.0, 0.0, TAU, 48, Color(0.92, 0.82, 0.66, 0.7), 2.0)
			draw_string(font, button_center + Vector2(-24.0, -9.0), labels[name], HORIZONTAL_ALIGNMENT_CENTER, 48.0, 10, Color.WHITE)

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
var quiz_index := 0
var learn_score := 0
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
	last_touch = {"shoot": false, "dodge": false, "use": false, "learn": false}
	_update_learn_gates()
	set_process(true)

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_L:
			learn_mode = not learn_mode
			_update_learn_gates()
			_set_message("Learncade aktiv" if learn_mode else "Normalmodus")
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
		_spawn_enemy(_pick_spawn())
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
		if dist < 34.0 and enemy["attack"] <= 0.0:
			enemy["attack"] = 1.05
			_damage(1, "Biss")

func _enemy_can_stand(pos: Vector2) -> bool:
	var rect := Rect2(pos - Vector2(14.0, 14.0), Vector2(28.0, 28.0))
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
			var task: Dictionary = LEARN_TASKS[quiz_index % LEARN_TASKS.size()]
			if gate["answer"] == task["correct"]:
				learn_score += 1
				score += 200
				reserve_ammo += 3
				_set_message("Richtig: +Munition")
			else:
				panic += 18.0
				_damage(1, "Falsches Siegel")
			quiz_index += 1
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
	_spawn_enemy(Vector2(1175, 880))
	_spawn_enemy(Vector2(1535, 865))
	_spawn_enemy(Vector2(1950, 1220))
	_spawn_enemy(Vector2(795, 410))

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

func _spawn_enemy(pos: Vector2) -> void:
	enemies.append({
		"pos": pos,
		"hp": 2,
		"speed": 74.0 + enemies.size() * 4.0,
		"sense": 360.0,
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

func _update_learn_gates() -> void:
	var task: Dictionary = LEARN_TASKS[quiz_index % LEARN_TASKS.size()]
	for gate in learn_gates:
		gate["label"] = task["answers"][gate["answer"]]
	if learn_mode:
		message = task["prompt"]
		message_timer = 4.0

func _set_message(text: String) -> void:
	message = text
	message_timer = 3.0

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
		var task: Dictionary = LEARN_TASKS[quiz_index % LEARN_TASKS.size()]
		draw_string(font, Vector2(screen.x * 0.5 - 230, 32), task["prompt"], HORIZONTAL_ALIGNMENT_CENTER, 460.0, 18, Color(1.0, 0.95, 0.72))
		for gate in learn_gates:
			var pos := _world_to_screen(gate["pos"])
			draw_circle(pos, 34.0, Color(0.1, 0.35, 0.75, 0.58))
			draw_arc(pos, 34.0, 0.0, TAU, 40, Color(0.70, 0.95, 1.0), 3.0)
			draw_string(font, pos + Vector2(-42, 5), gate["label"], HORIZONTAL_ALIGNMENT_CENTER, 84.0, 12, Color.WHITE)
	for bullet in bullets:
		draw_circle(_world_to_screen(bullet["pos"]), 5.0, Color(1.0, 0.88, 0.38))
	for enemy in enemies:
		if enemy["hp"] <= 0:
			continue
		var pos: Vector2 = _world_to_screen(enemy["pos"])
		draw_circle(pos, 19.0, Color(0.47, 0.09, 0.11))
		draw_circle(pos + Vector2(6, -5), 4.0, Color(1.0, 0.84, 0.65))
		draw_rect(Rect2(pos + Vector2(-18, 24), Vector2(36.0 * enemy["hp"] / 2.0, 4.0)), Color(0.78, 0.05, 0.08))
	var p := _world_to_screen(player_pos)
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
	draw_rect(Rect2(8, 8, 388, 114), Color(0.02, 0.03, 0.05, 0.76))
	draw_string(font, Vector2(20, 28), "FASKA MANSION - GODOT 4", HORIZONTAL_ALIGNMENT_LEFT, 360.0, 15, Color(1.0, 0.94, 0.78))
	draw_string(font, Vector2(20, 52), "HP %d/%d  Ammo %d/%d  Key %d  Score %d" % [hp, MAX_HP, ammo, reserve_ammo, silver_keys, score], HORIZONTAL_ALIGNMENT_LEFT, 360.0, 13, Color.WHITE)
	draw_string(font, Vector2(20, 74), "Evidence %d/5  Learn %d  Mode %s" % [evidence, learn_score, "Learncade" if learn_mode else "Normal"], HORIZONTAL_ALIGNMENT_LEFT, 360.0, 13, Color.WHITE)
	draw_rect(Rect2(20, 88, 150, 8), Color(0.16, 0.18, 0.20))
	draw_rect(Rect2(20, 88, 150.0 * stamina / MAX_STAMINA, 8), Color(0.25, 0.75, 0.95))
	draw_rect(Rect2(20, 104, 150, 8), Color(0.16, 0.18, 0.20))
	draw_rect(Rect2(20, 104, 150.0 * minf(100.0, panic) / 100.0, 8), Color(0.92, 0.25, 0.18))
	if message_timer > 0.0 or learn_mode:
		var panel_y := 58.0 if learn_mode else 12.0
		draw_rect(Rect2(screen.x * 0.5 - 280, panel_y, 560, 44), Color(0.02, 0.03, 0.05, 0.62))
		draw_string(font, Vector2(screen.x * 0.5 - 260, panel_y + 28.0), message, HORIZONTAL_ALIGNMENT_CENTER, 520.0, 16, Color(1.0, 0.94, 0.74))
	if reload_timer > 0.0:
		draw_string(font, Vector2(screen.x * 0.5 - 80, screen.y - 120), "RELOAD", HORIZONTAL_ALIGNMENT_CENTER, 160.0, 22, Color(1.0, 0.86, 0.45))
	if escaped:
		draw_rect(Rect2(Vector2.ZERO, screen), Color(0.0, 0.0, 0.0, 0.72))
		draw_string(font, Vector2(screen.x * 0.5 - 260, screen.y * 0.5 - 18), "AUSGANG GESCHAFFT - SCORE %d" % score, HORIZONTAL_ALIGNMENT_CENTER, 520.0, 26, Color(1.0, 0.92, 0.55))
