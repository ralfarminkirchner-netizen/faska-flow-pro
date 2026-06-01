extends Control

const LEVEL_ROWS := [
	"1111111111111111",
	"1......1.......1",
	"1.22...1..3....1",
	"1.2....1..3..T.1",
	"1......1.......1",
	"1..111....111..1",
	"1..............1",
	"1....2....2....1",
	"111..2.11.2..111",
	"1....2....2....1",
	"1..............1",
	"1..111....111..1",
	"1.......1......1",
	"1.T..3..1..2...1",
	"1......E.......1",
	"1111111111111111",
]
const MAP_W := 16
const MAP_H := 16
const FOV := 1.0471975512
const RAY_COUNT := 192
const MAX_DIST := 14.0
const LEARN_GOAL := 7
const LESSONS := ["WORTART", "MATHE", "SATZ", "LESEN", "KOMPOSITUM", "ENGLISCH"]

const QUESTIONS_WORD := [
	{"prompt": "Welche Wortart ist 'finster'?", "answers": ["Nomen", "Verb", "Adjektiv"], "correct": 2, "hint": "Finster beschreibt, wie etwas ist."},
	{"prompt": "Welche Wortart ist 'rennen'?", "answers": ["Verb", "Artikel", "Nomen"], "correct": 0, "hint": "Rennen ist etwas, das man tun kann."},
	{"prompt": "Welche Wortart ist 'ein'?", "answers": ["Adjektiv", "Artikel", "Verb"], "correct": 1, "hint": "Ein steht vor einem Nomen."},
	{"prompt": "Welche Wortart ist 'Munition'?", "answers": ["Nomen", "Verb", "Artikel"], "correct": 0, "hint": "Munition ist ein Ding."},
	{"prompt": "Welche Wortart ist 'schnell'?", "answers": ["Verb", "Adjektiv", "Nomen"], "correct": 1, "hint": "Schnell beschreibt eine Art."},
	{"prompt": "Welche Wortart ist 'unter'?", "answers": ["Praeposition", "Nomen", "Verb"], "correct": 0, "hint": "Unter beschreibt eine Lage."},
	{"prompt": "Welche Wortart ist 'und'?", "answers": ["Artikel", "Konjunktion", "Adjektiv"], "correct": 1, "hint": "Und verbindet Woerter oder Saetze."},
]

const QUESTIONS_MATH := [
	{"prompt": "Reaktorcode: 8 + 7", "answers": ["14", "15", "16"], "correct": 1, "hint": "Von 8 sieben weiter."},
	{"prompt": "Welche Zahl ist durch 3 teilbar?", "answers": ["20", "21", "22"], "correct": 1, "hint": "2 + 1 ergibt 3."},
	{"prompt": "Was ist 6 x 4?", "answers": ["20", "24", "28"], "correct": 1, "hint": "Vier Sechser."},
	{"prompt": "Welche Zahl fehlt? 40 - ? = 25", "answers": ["12", "15", "18"], "correct": 1, "hint": "Von 40 zu 25 sind es 15."},
	{"prompt": "Was ist die Haelfte von 54?", "answers": ["26", "27", "28"], "correct": 1, "hint": "27 + 27 = 54."},
]

const QUESTIONS_SENTENCE := [
	{"prompt": "Was ist das Subjekt? Der Scout oeffnet die Tuer.", "answers": ["Der Scout", "oeffnet", "die Tuer"], "correct": 0, "hint": "Wer oeffnet?"},
	{"prompt": "Was ist das Praedikat? Lumi sammelt Munition.", "answers": ["Lumi", "sammelt", "Munition"], "correct": 1, "hint": "Was tut Lumi?"},
	{"prompt": "Welches Wort passt? Der Gang ist ___.", "answers": ["dunkel", "rennt", "der"], "correct": 0, "hint": "Gesucht ist eine Eigenschaft."},
	{"prompt": "Welche Satzstelle ist ein Objekt? Wir finden den Schluessel.", "answers": ["Wir", "finden", "den Schluessel"], "correct": 2, "hint": "Was finden wir?"},
	{"prompt": "Welche Satzstelle ist ein Ort? Gegner warten im Korridor.", "answers": ["Gegner", "warten", "im Korridor"], "correct": 2, "hint": "Wo warten sie?"},
	{"prompt": "Welches Wort verbindet den Grund? Wir warten, ___ die Tuer klemmt.", "answers": ["weil", "schnell", "unter"], "correct": 0, "hint": "Weil nennt einen Grund."},
]

const QUESTIONS_READING := [
	{"prompt": "Lies: Der blaue Gang fuehrt zum Ausgang. Wohin fuehrt er?", "answers": ["zum Ausgang", "zum Wald", "ins Wasser"], "correct": 0, "hint": "Der Zielort steht am Satzende."},
	{"prompt": "Lies: Lumi findet Munition neben der Tuer. Was findet Lumi?", "answers": ["Armor", "Munition", "einen Apfel"], "correct": 1, "hint": "Das gesuchte Ding steht direkt nach findet."},
	{"prompt": "Lies: Der Imp wartet hinter der roten Wand. Wo wartet er?", "answers": ["hinter der Wand", "auf dem Dach", "im Taxi"], "correct": 0, "hint": "Achte auf die Ortsangabe."},
	{"prompt": "Lies: Der Scout oeffnet die gelbe Schleuse. Was oeffnet er?", "answers": ["die Schleuse", "die Kiste", "das Fenster"], "correct": 0, "hint": "Das Objekt steht nach oeffnet."},
	{"prompt": "Lies: Nach dem Schuss blinkt der Reaktor. Wann blinkt er?", "answers": ["vorher", "nach dem Schuss", "nie"], "correct": 1, "hint": "Die Zeitangabe steht am Anfang."},
]

const QUESTIONS_COMPOUND := [
	{"prompt": "Bilde das Kompositum: Reaktor + Raum", "answers": ["Reaktorraum", "Raumreaktor", "reaktiv"], "correct": 0, "hint": "Der Raum gehoert zum Reaktor."},
	{"prompt": "Bilde das Kompositum: Laser + Strahl", "answers": ["Strahllaser", "Laserstrahl", "lasern"], "correct": 1, "hint": "Ein Strahl aus Laserlicht."},
	{"prompt": "Bilde das Kompositum: Schutz + Schild", "answers": ["Schildschutz", "Schutzschild", "schuetzen"], "correct": 1, "hint": "Ein Schild zum Schutz."},
	{"prompt": "Bilde das Kompositum: Tuer + Code", "answers": ["Tuercode", "Codetuer", "codieren"], "correct": 0, "hint": "Der Code oeffnet die Tuer."},
	{"prompt": "Bilde das Kompositum: Monster + Raum", "answers": ["Raummonster", "Monsterraum", "monsterhaft"], "correct": 1, "hint": "Ein Raum mit Monstern."},
]

const QUESTIONS_ENGLISH := [
	{"prompt": "Was heisst 'Schluessel' auf Englisch?", "answers": ["key", "door", "wall"], "correct": 0, "hint": "Key oeffnet Tueren."},
	{"prompt": "Was heisst 'Munition'?", "answers": ["ammo", "armor", "exit"], "correct": 0, "hint": "Ammo steht auch im HUD."},
	{"prompt": "Was heisst 'Ausgang'?", "answers": ["enemy", "exit", "health"], "correct": 1, "hint": "Exit ist der Ausgang."},
	{"prompt": "Was heisst 'schnell'?", "answers": ["fast", "dark", "full"], "correct": 0, "hint": "Fast bedeutet schnell."},
	{"prompt": "Was heisst 'Ruestung'?", "answers": ["armor", "ammo", "angle"], "correct": 0, "hint": "Armor schuetzt dich."},
]

class TouchDoomOverlay:
	extends Control

	var move_vector := Vector2.ZERO
	var look_x := 0.0
	var fire_down := false
	var grenade_down := false
	var dash_down := false
	var learn_down := false
	var subject_down := false
	var _move_touch := -1
	var _look_touch := -1
	var _button_touches := {}
	var _last_look_x := 0.0

	func _ready() -> void:
		mouse_filter = Control.MOUSE_FILTER_PASS
		set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)

	func _process(_delta: float) -> void:
		look_x = lerpf(look_x, 0.0, 0.24)
		queue_redraw()

	func _gui_input(event: InputEvent) -> void:
		if not _should_show():
			return
		if event is InputEventScreenTouch:
			if event.pressed:
				if event.position.x < size.x * 0.44:
					_move_touch = event.index
					_update_move(event.position)
				else:
					var action := _button_at(event.position)
					if action != "":
						_button_touches[event.index] = action
						_refresh_buttons()
					else:
						_look_touch = event.index
						_last_look_x = event.position.x
			else:
				if event.index == _move_touch:
					_move_touch = -1
					move_vector = Vector2.ZERO
				if event.index == _look_touch:
					_look_touch = -1
					look_x = 0.0
				if _button_touches.has(event.index):
					_button_touches.erase(event.index)
					_refresh_buttons()
		elif event is InputEventScreenDrag:
			if event.index == _move_touch:
				_update_move(event.position)
			elif event.index == _look_touch:
				look_x = clampf((event.position.x - _last_look_x) / 28.0, -1.0, 1.0)
				_last_look_x = event.position.x

	func _update_move(pos: Vector2) -> void:
		var center := _stick_center()
		move_vector = (pos - center) / 100.0
		if move_vector.length() > 1.0:
			move_vector = move_vector.normalized()
		if move_vector.length() < 0.14:
			move_vector = Vector2.ZERO

	func _refresh_buttons() -> void:
		fire_down = false
		grenade_down = false
		dash_down = false
		learn_down = false
		subject_down = false
		for key in _button_touches.keys():
			var action: String = str(_button_touches[key])
			if action == "fire":
				fire_down = true
			elif action == "grenade":
				grenade_down = true
			elif action == "dash":
				dash_down = true
			elif action == "learn":
				learn_down = true
			elif action == "subject":
				subject_down = true

	func _button_at(pos: Vector2) -> String:
		for button in _buttons():
			var rect: Rect2 = button["rect"]
			if rect.has_point(pos):
				return str(button["action"])
		return ""

	func _stick_center() -> Vector2:
		return Vector2(126.0, size.y - 210.0)

	func _buttons() -> Array:
		var w := 104.0
		var h := 74.0
		var gap := 12.0
		var x := size.x - (w * 2.0 + gap + 24.0)
		var y := size.y - (h * 3.0 + gap * 2.0 + 112.0)
		return [
			{"action": "learn", "label": "L\nLern", "rect": Rect2(Vector2(x, y), Vector2(w, h))},
			{"action": "subject", "label": "C\nFach", "rect": Rect2(Vector2(x + w + gap, y), Vector2(w, h))},
			{"action": "fire", "label": "J\nFeuer", "rect": Rect2(Vector2(x, y + h + gap), Vector2(w, h))},
			{"action": "grenade", "label": "K\nGranate", "rect": Rect2(Vector2(x + w + gap, y + h + gap), Vector2(w, h))},
			{"action": "dash", "label": "S\nDash", "rect": Rect2(Vector2(x + w + gap, y + (h + gap) * 2.0), Vector2(w, h))},
		]

	func _draw() -> void:
		if _should_show():
			_draw_stick()
			_draw_buttons()

	func _should_show() -> bool:
		return size.x < 980.0 or size.y > size.x * 1.2

	func _draw_stick() -> void:
		var center := _stick_center()
		draw_circle(center, 104.0, Color(0.02, 0.05, 0.09, 0.5))
		draw_arc(center, 104.0, 0.0, TAU, 36, Color(0.78, 0.88, 1.0, 0.52), 5.0)
		draw_circle(center + move_vector * 58.0, 38.0, Color(0.93, 0.96, 1.0, 0.78))

	func _draw_buttons() -> void:
		var font := get_theme_default_font()
		for button in _buttons():
			var rect: Rect2 = button["rect"]
			var action := str(button["action"])
			var active := (action == "fire" and fire_down) or (action == "grenade" and grenade_down) or (action == "dash" and dash_down) or (action == "learn" and learn_down) or (action == "subject" and subject_down)
			draw_rect(rect, Color(0.02, 0.05, 0.09, 0.66), true)
			draw_rect(rect, Color.html("#facc15") if active else Color(0.78, 0.88, 1.0, 0.55), false, 4.0)
			var lines := str(button["label"]).split("\n")
			for i in range(lines.size()):
				draw_string(font, rect.position + Vector2(0.0, 28.0 + float(i) * 23.0), lines[i], HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, 20, Color.html("#f8fafc"))

var player_pos := Vector2(2.55, 6.55)
var player_angle := 0.08
var hp := 100
var armor := 25
var ammo := 36
var grenades := 3
var reactor_keys := 0
var score := 0
var combo := 0
var exit_open := false
var mode_learn := true
var lesson_index := 0
var question_index := 0
var learn_hits := 0
var mistakes := 0
var repeat_queue: Array = []
var shot_timer := 0.0
var hurt_timer := 0.0
var dash_timer := 0.0
var dash_cooldown := 0.0
var message := "Godot Raycaster: Reaktorschluessel sammeln, Gegner stoppen, Ausgang oeffnen."
var message_timer := 4.0
var game_over := false
var won := false
var enemies: Array = []
var pickups: Array = []
var terminals: Array = []
var blasts: Array = []
var ray_depths: Array = []
var touch_overlay: TouchDoomOverlay
var last_touch_fire := false
var last_touch_grenade := false
var last_touch_dash := false
var last_touch_learn := false
var last_touch_subject := false

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_PASS
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	touch_overlay = TouchDoomOverlay.new()
	add_child(touch_overlay)
	reset_game()

func reset_game() -> void:
	player_pos = Vector2(2.55, 6.55)
	player_angle = 0.08
	hp = 100
	armor = 25
	ammo = 36
	grenades = 3
	reactor_keys = 0
	score = 0
	combo = 0
	exit_open = false
	mode_learn = true
	lesson_index = 0
	question_index = 0
	learn_hits = 0
	mistakes = 0
	repeat_queue.clear()
	shot_timer = 0.0
	hurt_timer = 0.0
	dash_timer = 0.0
	dash_cooldown = 0.0
	game_over = false
	won = false
	ray_depths.clear()
	spawn_enemies()
	spawn_pickups()
	setup_terminals()
	blasts.clear()
	message = "Doom Pro: Reaktorjagd, Gegnerdruck, Ressourcen und Learncade-Terminals."
	message_timer = 5.0

func spawn_enemies() -> void:
	enemies.clear()
	var starts: Array = [
		Vector2(6.5, 2.4), Vector2(12.7, 2.7), Vector2(12.4, 6.5),
		Vector2(8.8, 7.4), Vector2(2.8, 10.5), Vector2(10.6, 10.6),
		Vector2(13.3, 13.2),
	]
	for i in range(starts.size()):
		enemies.append({
			"pos": starts[i],
			"hp": 30 + int(i % 3 == 0) * 25,
			"kind": "brute" if i % 3 == 0 else "imp",
			"cooldown": 0.6 + float(i) * 0.11,
			"hit": 0.0,
		})

func spawn_pickups() -> void:
	pickups.clear()
	var data: Array = [
		{"pos": Vector2(4.3, 2.4), "type": "ammo"},
		{"pos": Vector2(11.4, 3.3), "type": "armor"},
		{"pos": Vector2(3.2, 6.3), "type": "health"},
		{"pos": Vector2(7.2, 7.4), "type": "key"},
		{"pos": Vector2(12.7, 8.3), "type": "ammo"},
		{"pos": Vector2(3.5, 12.6), "type": "grenade"},
		{"pos": Vector2(10.2, 13.4), "type": "key"},
		{"pos": Vector2(13.4, 11.5), "type": "health"},
	]
	for item in data:
		var pickup: Dictionary = item
		pickup["taken"] = false
		pickups.append(pickup)

func setup_terminals() -> void:
	terminals.clear()
	var q: Dictionary = current_question()
	var answers: Array = q["answers"]
	var positions: Array = [Vector2(13.5, 3.5), Vector2(2.5, 13.5), Vector2(6.5, 13.5)]
	for i in range(answers.size()):
		terminals.append({"pos": positions[i], "label": answers[i], "index": i, "armed": true, "repeat": bool(q.get("repeat", false))})

func question_bank() -> Array:
	var bank: Array = QUESTIONS_WORD
	var lesson := str(LESSONS[lesson_index])
	if lesson == "MATHE":
		bank = QUESTIONS_MATH
	elif lesson == "SATZ":
		bank = QUESTIONS_SENTENCE
	elif lesson == "LESEN":
		bank = QUESTIONS_READING
	elif lesson == "KOMPOSITUM":
		bank = QUESTIONS_COMPOUND
	elif lesson == "ENGLISCH":
		bank = QUESTIONS_ENGLISH
	return bank

func current_question() -> Dictionary:
	var lesson := str(LESSONS[lesson_index])
	for entry in repeat_queue:
		if str(entry.get("lesson", "")) == lesson:
			var repeated_question: Dictionary = entry["question"]
			return repeated_question
	var bank := question_bank()
	var q: Dictionary = bank[question_index % bank.size()].duplicate(true)
	q["lesson"] = lesson
	return q

func _question_id(q: Dictionary) -> String:
	return "%s::%s" % [str(q.get("lesson", LESSONS[lesson_index])), str(q.get("prompt", ""))]

func _queue_repeat(q: Dictionary) -> void:
	var copy := q.duplicate(true)
	copy["lesson"] = str(q.get("lesson", LESSONS[lesson_index]))
	copy["repeat"] = true
	var id := _question_id(copy)
	for entry in repeat_queue:
		var stored_question: Dictionary = entry["question"]
		if _question_id(stored_question) == id:
			return
	if repeat_queue.size() >= 10:
		repeat_queue.pop_front()
	repeat_queue.append({"lesson": copy["lesson"], "question": copy})

func _remove_repeat(q: Dictionary) -> void:
	var id := _question_id(q)
	for i in range(repeat_queue.size() - 1, -1, -1):
		var stored_question: Dictionary = repeat_queue[i]["question"]
		if _question_id(stored_question) == id:
			repeat_queue.remove_at(i)

func cycle_lesson() -> void:
	lesson_index = (lesson_index + 1) % LESSONS.size()
	question_index = 0
	setup_terminals()
	message = "Fach: %s. Terminals neu synchronisiert." % str(LESSONS[lesson_index])
	message_timer = 2.0

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_R:
			reset_game()
		elif event.keycode == KEY_L:
			mode_learn = not mode_learn
			setup_terminals()
			message = "Learncade: richtige Terminals geben Reaktorzugang und Ressourcen." if mode_learn else "Normalmodus: Reaktorjagd."
			message_timer = 3.0
		elif event.keycode == KEY_C:
			cycle_lesson()
		elif event.keycode == KEY_J or event.keycode == KEY_SPACE:
			fire_weapon()
		elif event.keycode == KEY_K:
			throw_grenade()
		elif event.keycode == KEY_SHIFT:
			try_dash()

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()
	if game_over or won:
		queue_redraw()
		return
	if message_timer > 0.0:
		message_timer -= delta
	if shot_timer > 0.0:
		shot_timer -= delta
	if hurt_timer > 0.0:
		hurt_timer -= delta
	if dash_timer > 0.0:
		dash_timer -= delta
	if dash_cooldown > 0.0:
		dash_cooldown -= delta
	update_touch_actions()
	update_player(delta)
	update_enemies(delta)
	update_pickups()
	update_blasts(delta)
	update_exit()
	queue_redraw()

func update_touch_actions() -> void:
	if touch_overlay == null:
		return
	if touch_overlay.fire_down and not last_touch_fire:
		fire_weapon()
	if touch_overlay.grenade_down and not last_touch_grenade:
		throw_grenade()
	if touch_overlay.dash_down and not last_touch_dash:
		try_dash()
	if touch_overlay.learn_down and not last_touch_learn:
		mode_learn = not mode_learn
		setup_terminals()
		message = "Learncade aktiv." if mode_learn else "Normalmodus aktiv."
		message_timer = 1.8
	if touch_overlay.subject_down and not last_touch_subject:
		cycle_lesson()
	last_touch_fire = touch_overlay.fire_down
	last_touch_grenade = touch_overlay.grenade_down
	last_touch_dash = touch_overlay.dash_down
	last_touch_learn = touch_overlay.learn_down
	last_touch_subject = touch_overlay.subject_down

func update_player(delta: float) -> void:
	var turn := 0.0
	if Input.is_key_pressed(KEY_LEFT) or Input.is_key_pressed(KEY_Q):
		turn -= 1.0
	if Input.is_key_pressed(KEY_RIGHT) or Input.is_key_pressed(KEY_E):
		turn += 1.0
	if touch_overlay != null:
		turn += touch_overlay.look_x
	player_angle = wrap_angle(player_angle + turn * delta * 2.35)
	var forward := 0.0
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		forward += 1.0
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		forward -= 1.0
	var strafe := 0.0
	if Input.is_key_pressed(KEY_A):
		strafe -= 1.0
	if Input.is_key_pressed(KEY_D):
		strafe += 1.0
	if touch_overlay != null and touch_overlay.move_vector.length() > 0.05:
		strafe = touch_overlay.move_vector.x
		forward = -touch_overlay.move_vector.y
	var dir := Vector2(cos(player_angle), sin(player_angle)) * forward
	dir += Vector2(cos(player_angle + PI * 0.5), sin(player_angle + PI * 0.5)) * strafe
	if dir.length() > 1.0:
		dir = dir.normalized()
	var speed: float = 2.55 if dash_timer <= 0.0 else 5.2
	move_player(dir * speed * delta)

func try_dash() -> void:
	if dash_cooldown > 0.0:
		return
	dash_timer = 0.22
	dash_cooldown = 0.82

func move_player(delta_pos: Vector2) -> void:
	var next_x := Vector2(player_pos.x + delta_pos.x, player_pos.y)
	if can_stand(next_x):
		player_pos.x = next_x.x
	var next_y := Vector2(player_pos.x, player_pos.y + delta_pos.y)
	if can_stand(next_y):
		player_pos.y = next_y.y

func update_enemies(delta: float) -> void:
	for i in range(enemies.size()):
		var enemy: Dictionary = enemies[i]
		var pos: Vector2 = enemy["pos"]
		var to_player: Vector2 = player_pos - pos
		var dist: float = to_player.length()
		if float(enemy["hit"]) > 0.0:
			enemy["hit"] = maxf(0.0, float(enemy["hit"]) - delta)
		enemy["cooldown"] = maxf(0.0, float(enemy["cooldown"]) - delta)
		if dist < 8.0 and has_line_of_sight(pos, player_pos):
			if dist > 0.85:
				var move: Vector2 = to_player.normalized() * delta * (0.72 if str(enemy["kind"]) == "brute" else 1.05)
				var next: Vector2 = pos + move
				if can_stand(next):
					enemy["pos"] = next
			elif float(enemy["cooldown"]) <= 0.0:
				damage_player(16 if str(enemy["kind"]) == "brute" else 9)
				enemy["cooldown"] = 1.05
		enemies[i] = enemy

func update_pickups() -> void:
	for i in range(pickups.size()):
		var pickup: Dictionary = pickups[i]
		if bool(pickup["taken"]):
			continue
		var pos: Vector2 = pickup["pos"]
		if player_pos.distance_to(pos) > 0.48:
			continue
		pickup["taken"] = true
		var kind: String = str(pickup["type"])
		if kind == "health":
			hp = mini(100, hp + 28)
			message = "Medkit."
		elif kind == "armor":
			armor = mini(100, armor + 35)
			message = "Armor."
		elif kind == "ammo":
			ammo += 16
			message = "Ammo +16."
		elif kind == "grenade":
			grenades += 2
			message = "Granaten +2."
		elif kind == "key":
			reactor_keys += 1
			score += 350
			message = "Reaktorschluessel %d/2." % reactor_keys
		message_timer = 1.5
		pickups[i] = pickup

func update_blasts(delta: float) -> void:
	for i in range(blasts.size() - 1, -1, -1):
		var blast: Dictionary = blasts[i]
		blast["time"] = float(blast["time"]) - delta
		if float(blast["time"]) <= 0.0:
			blasts.remove_at(i)
		else:
			blasts[i] = blast

func fire_weapon() -> void:
	if shot_timer > 0.0 or ammo <= 0:
		return
	ammo -= 1
	shot_timer = 0.18
	var hit_index := -1
	var hit_dist := 999.0
	for i in range(enemies.size()):
		var enemy: Dictionary = enemies[i]
		var pos: Vector2 = enemy["pos"]
		var to_enemy: Vector2 = pos - player_pos
		var dist: float = to_enemy.length()
		var diff: float = absf(angle_delta(player_angle, atan2(to_enemy.y, to_enemy.x)))
		if diff < 0.095 and dist < hit_dist and has_line_of_sight(player_pos, pos):
			hit_index = i
			hit_dist = dist
	if hit_index >= 0:
		var target: Dictionary = enemies[hit_index]
		target["hp"] = int(target["hp"]) - (28 if hit_dist < 3.2 else 19)
		target["hit"] = 0.16
		combo += 1
		score += 80 * combo
		blasts.append({"pos": target["pos"], "time": 0.14, "radius": 0.3})
		if int(target["hp"]) <= 0:
			enemies.remove_at(hit_index)
			message = "%d Combo" % combo
		else:
			enemies[hit_index] = target
			message = "Treffer."
	else:
		combo = 0
		message = "Daneben."
	if mode_learn:
		check_terminal_shot()
	message_timer = 1.0

func throw_grenade() -> void:
	if grenades <= 0 or shot_timer > 0.0:
		return
	grenades -= 1
	shot_timer = 0.45
	var center: Vector2 = player_pos + Vector2(cos(player_angle), sin(player_angle)) * 2.6
	if is_wall_at(center):
		center = player_pos + Vector2(cos(player_angle), sin(player_angle)) * 1.2
	blasts.append({"pos": center, "time": 0.32, "radius": 0.85})
	for i in range(enemies.size() - 1, -1, -1):
		var enemy: Dictionary = enemies[i]
		var dist: float = center.distance_to(enemy["pos"])
		if dist < 1.65 and has_line_of_sight(player_pos, enemy["pos"]):
			enemy["hp"] = int(enemy["hp"]) - int(46.0 * (1.0 - dist / 1.8))
			enemy["hit"] = 0.25
			if int(enemy["hp"]) <= 0:
				enemies.remove_at(i)
				score += 260
			else:
				enemies[i] = enemy
	message = "Granate."
	message_timer = 1.2

func check_terminal_shot() -> void:
	var q: Dictionary = current_question()
	for i in range(terminals.size()):
		var terminal: Dictionary = terminals[i]
		if not bool(terminal["armed"]):
			continue
		var pos: Vector2 = terminal["pos"]
		var to_terminal: Vector2 = pos - player_pos
		var dist: float = to_terminal.length()
		var diff: float = absf(angle_delta(player_angle, atan2(to_terminal.y, to_terminal.x)))
		if diff > 0.12 or dist > 9.0 or not has_line_of_sight(player_pos, pos):
			continue
		terminal["armed"] = false
		terminals[i] = terminal
		if int(terminal["index"]) == int(q["correct"]):
			var repeated := bool(q.get("repeat", false))
			learn_hits += 1
			if learn_hits % 2 == 1:
				reactor_keys = mini(2, reactor_keys + 1)
			ammo += 12
			armor = mini(100, armor + 8)
			score += 900 if repeated else 700
			_remove_repeat(q)
			if repeated:
				message = "Wiederholung geloest: %s (%d/%d)." % [str(terminal["label"]), learn_hits, LEARN_GOAL]
			else:
				message = "Richtig: %s (%d/%d). Reaktorzugang stabilisiert." % [str(terminal["label"]), learn_hits, LEARN_GOAL]
			question_index = (question_index + 1) % question_bank().size()
			setup_terminals()
		else:
			mistakes += 1
			_queue_repeat(q)
			damage_player(12)
			message = "Falsches Terminal. Aufgabe kommt wieder. Tipp: %s" % str(q["hint"])
		message_timer = 2.0
		break

func update_exit() -> void:
	exit_open = (reactor_keys >= 2 or (mode_learn and learn_hits >= LEARN_GOAL)) and enemies.size() <= 3
	if exit_open and player_pos.distance_to(Vector2(7.5, 14.5)) < 0.58:
		won = true
		score += 1600
		message = "Ausgang erreicht. Score %d. R startet neu." % score
		message_timer = 99.0

func damage_player(amount: int) -> void:
	if hurt_timer > 0.0:
		return
	hurt_timer = 0.45
	var armor_absorb: int = mini(armor, int(ceil(float(amount) * 0.45)))
	armor -= armor_absorb
	hp -= amount - armor_absorb
	message = "Treffer."
	message_timer = 1.1
	if hp <= 0:
		game_over = true
		message = "Game Over. R startet neu."
		message_timer = 99.0

func can_stand(pos: Vector2) -> bool:
	var radius := 0.18
	var samples: Array = [
		pos + Vector2(-radius, -radius),
		pos + Vector2(radius, -radius),
		pos + Vector2(-radius, radius),
		pos + Vector2(radius, radius),
	]
	for sample in samples:
		if is_wall_at(sample):
			return false
	return true

func has_line_of_sight(from_pos: Vector2, to_pos: Vector2) -> bool:
	var delta: Vector2 = to_pos - from_pos
	var length: float = delta.length()
	if length <= 0.05:
		return true
	var dir: Vector2 = delta / length
	var steps: int = int(length / 0.08)
	for i in range(1, steps):
		var pos: Vector2 = from_pos + dir * float(i) * 0.08
		if is_wall_at(pos):
			return false
	return true

func is_wall_at(pos: Vector2) -> bool:
	var x: int = int(floor(pos.x))
	var y: int = int(floor(pos.y))
	if x < 0 or y < 0 or x >= MAP_W or y >= MAP_H:
		return true
	var tile: String = get_tile(x, y)
	if tile == "E":
		return not exit_open
	return tile == "1" or tile == "2" or tile == "3"

func get_tile(x: int, y: int) -> String:
	var row: String = String(LEVEL_ROWS[y])
	return row.substr(x, 1)

func wrap_angle(value: float) -> float:
	return atan2(sin(value), cos(value))

func angle_delta(a: float, b: float) -> float:
	return atan2(sin(b - a), cos(b - a))

func cast_ray(angle: float) -> Dictionary:
	var dir := Vector2(cos(angle), sin(angle))
	var dist := 0.04
	var hit_tile := "1"
	while dist < MAX_DIST:
		var pos: Vector2 = player_pos + dir * dist
		var x: int = int(floor(pos.x))
		var y: int = int(floor(pos.y))
		if x < 0 or y < 0 or x >= MAP_W or y >= MAP_H:
			hit_tile = "1"
			break
		var tile: String = get_tile(x, y)
		if tile == "E" and not exit_open:
			hit_tile = "E"
			break
		if tile == "1" or tile == "2" or tile == "3":
			hit_tile = tile
			break
		dist += 0.035
	return {"dist": dist, "tile": hit_tile}

func _draw() -> void:
	draw_view()
	draw_sprites()
	draw_weapon()
	draw_hud()

func draw_view() -> void:
	ray_depths.clear()
	draw_rect(Rect2(Vector2.ZERO, size), Color.html("#07111f"), true)
	draw_rect(Rect2(Vector2.ZERO, Vector2(size.x, size.y * 0.52)), Color.html("#101827"), true)
	draw_rect(Rect2(Vector2(0.0, size.y * 0.52), Vector2(size.x, size.y * 0.48)), Color.html("#23150f"), true)
	var strip_w: float = size.x / float(RAY_COUNT)
	for col in range(RAY_COUNT):
		var camera_x: float = (float(col) / float(RAY_COUNT) - 0.5)
		var ray_angle: float = player_angle + camera_x * FOV
		var hit: Dictionary = cast_ray(ray_angle)
		var raw_dist: float = float(hit["dist"])
		var corrected: float = maxf(0.05, raw_dist * cos(ray_angle - player_angle))
		ray_depths.append(corrected)
		var wall_h: float = minf(size.y * 1.32, size.y / corrected * 0.86)
		var y: float = size.y * 0.52 - wall_h * 0.5
		var shade: float = clampf(1.0 - corrected / MAX_DIST, 0.12, 1.0)
		var color: Color = wall_color(str(hit["tile"])).darkened(1.0 - shade)
		draw_rect(Rect2(Vector2(float(col) * strip_w, y), Vector2(ceil(strip_w) + 1.0, wall_h)), color, true)
		if col % 9 == 0:
			draw_line(Vector2(float(col) * strip_w, y), Vector2(float(col) * strip_w, y + wall_h), Color(0.0, 0.0, 0.0, 0.18), 1.0)

func wall_color(tile: String) -> Color:
	if tile == "2":
		return Color.html("#7f1d1d")
	if tile == "3":
		return Color.html("#1d4ed8")
	if tile == "E":
		return Color.html("#facc15")
	return Color.html("#475569")

func draw_sprites() -> void:
	var sprites: Array = []
	for pickup in pickups:
		var item: Dictionary = pickup
		if not bool(item["taken"]):
			sprites.append({"pos": item["pos"], "kind": str(item["type"]), "dist": player_pos.distance_to(item["pos"]), "enemy": false})
	if mode_learn:
		for terminal in terminals:
			var term: Dictionary = terminal
			if bool(term["armed"]):
				sprites.append({"pos": term["pos"], "kind": "terminal", "label": str(term["label"]), "repeat": bool(term.get("repeat", false)), "dist": player_pos.distance_to(term["pos"]), "enemy": false})
	for enemy in enemies:
		var foe: Dictionary = enemy
		sprites.append({"pos": foe["pos"], "kind": str(foe["kind"]), "hp": int(foe["hp"]), "hit": float(foe["hit"]), "dist": player_pos.distance_to(foe["pos"]), "enemy": true})
	for blast in blasts:
		var boom: Dictionary = blast
		sprites.append({"pos": boom["pos"], "kind": "blast", "dist": player_pos.distance_to(boom["pos"]), "enemy": false, "radius": float(boom["radius"])})
	sprites.sort_custom(func(a, b): return float(a["dist"]) > float(b["dist"]))
	for sprite in sprites:
		draw_sprite(sprite)

func draw_sprite(sprite: Dictionary) -> void:
	var pos: Vector2 = sprite["pos"]
	var to_sprite: Vector2 = pos - player_pos
	var dist: float = maxf(0.05, to_sprite.length())
	var diff: float = angle_delta(player_angle, atan2(to_sprite.y, to_sprite.x))
	if absf(diff) > FOV * 0.62:
		return
	var screen_x: float = size.x * 0.5 + diff / (FOV * 0.5) * size.x * 0.5
	var column: int = clampi(int(screen_x / size.x * float(RAY_COUNT)), 0, RAY_COUNT - 1)
	if ray_depths.size() > column and dist > float(ray_depths[column]) + 0.18:
		return
	var scale: float = minf(3.0, 1.2 / dist)
	var sprite_h: float = size.y * 0.68 * scale
	var base_y: float = size.y * 0.55 + sprite_h * 0.34
	var kind: String = str(sprite["kind"])
	if kind == "blast":
		var r: float = size.y * 0.16 * scale * float(sprite["radius"])
		draw_circle(Vector2(screen_x, base_y - sprite_h * 0.32), r, Color(1.0, 0.44, 0.05, 0.55))
		draw_circle(Vector2(screen_x, base_y - sprite_h * 0.32), r * 0.52, Color(1.0, 0.9, 0.25, 0.72))
		return
	if bool(sprite["enemy"]):
		var color: Color = Color.html("#ef4444") if kind == "imp" else Color.html("#7f1d1d")
		if float(sprite["hit"]) > 0.0:
			color = Color.html("#f8fafc")
		var rect := Rect2(Vector2(screen_x - sprite_h * 0.18, base_y - sprite_h), Vector2(sprite_h * 0.36, sprite_h))
		draw_rect(rect, color, true)
		draw_rect(Rect2(rect.position + Vector2(rect.size.x * 0.2, rect.size.y * 0.24), Vector2(rect.size.x * 0.18, rect.size.y * 0.12)), Color.html("#020617"), true)
		draw_rect(Rect2(rect.position + Vector2(rect.size.x * 0.62, rect.size.y * 0.24), Vector2(rect.size.x * 0.18, rect.size.y * 0.12)), Color.html("#020617"), true)
		return
	var icon_color: Color = pickup_color(kind)
	var item_size: float = clampf(sprite_h * 0.2, 10.0, 36.0)
	var center := Vector2(screen_x, base_y - sprite_h * 0.42)
	if kind == "terminal":
		var rect_term := Rect2(center - Vector2(item_size * 1.25, item_size * 0.75), Vector2(item_size * 2.5, item_size * 1.5))
		draw_rect(rect_term, Color(0.05, 0.2, 0.33, 0.88), true)
		var border := Color.html("#f0abfc") if bool(sprite.get("repeat", false)) else Color.html("#38bdf8")
		draw_rect(rect_term, border, false, 2.0)
		draw_string(get_theme_default_font(), rect_term.position + Vector2(3.0, rect_term.size.y * 0.64), str(sprite["label"]), HORIZONTAL_ALIGNMENT_CENTER, rect_term.size.x - 6.0, max(8, int(item_size * 0.42)), Color.html("#f8fafc"))
	else:
		draw_rect(Rect2(center - Vector2(item_size * 0.5, item_size * 0.5), Vector2(item_size, item_size)), icon_color, true)

func pickup_color(kind: String) -> Color:
	if kind == "health":
		return Color.html("#22c55e")
	if kind == "armor":
		return Color.html("#38bdf8")
	if kind == "ammo":
		return Color.html("#facc15")
	if kind == "grenade":
		return Color.html("#a855f7")
	if kind == "key":
		return Color.html("#fb923c")
	return Color.html("#f8fafc")

func draw_weapon() -> void:
	var recoil: float = 18.0 if shot_timer > 0.08 else 0.0
	var center_x: float = size.x * 0.52
	var base_y: float = size.y + recoil
	draw_rect(Rect2(Vector2(center_x - 74.0, base_y - 136.0), Vector2(148.0, 118.0)), Color.html("#1f2937"), true)
	draw_rect(Rect2(Vector2(center_x - 46.0, base_y - 174.0), Vector2(92.0, 78.0)), Color.html("#334155"), true)
	draw_rect(Rect2(Vector2(center_x - 16.0, base_y - 210.0), Vector2(32.0, 60.0)), Color.html("#64748b"), true)
	if shot_timer > 0.08:
		draw_circle(Vector2(center_x, base_y - 225.0), 34.0, Color(1.0, 0.84, 0.16, 0.72))
		draw_circle(Vector2(center_x, base_y - 225.0), 17.0, Color(1.0, 0.2, 0.04, 0.9))

func draw_hud() -> void:
	var font := get_theme_default_font()
	draw_rect(Rect2(12.0, 12.0, 386.0, 94.0), Color(0.02, 0.05, 0.09, 0.78), true)
	draw_string(font, Vector2(25.0, 40.0), "FASKA DOOM PRO", HORIZONTAL_ALIGNMENT_LEFT, -1, 22, Color.html("#facc15"))
	draw_string(font, Vector2(25.0, 66.0), "HP %d  Armor %d  Ammo %d  Grenades %d" % [hp, armor, ammo, grenades], HORIZONTAL_ALIGNMENT_LEFT, -1, 15, Color.html("#f8fafc"))
	draw_string(font, Vector2(25.0, 89.0), "Keys %d/2  Enemies %d  Score %d" % [reactor_keys, enemies.size(), score], HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.html("#cbd5e1"))
	draw_string(font, Vector2(25.0, 110.0), "Mode %s  Fach %s  Lernziel %d/%d  Fehler %d  Wdh %d" % ["Learncade" if mode_learn else "Normal", str(LESSONS[lesson_index]), learn_hits, LEARN_GOAL, mistakes, repeat_queue.size()], HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color.html("#fde68a"))
	if mode_learn:
		var q: Dictionary = current_question()
		draw_rect(Rect2(size.x * 0.5 - 305.0, 24.0, 610.0, 35.0), Color(0.02, 0.05, 0.09, 0.78), true)
		draw_string(font, Vector2(size.x * 0.5 - 285.0, 48.0), str(q["prompt"]), HORIZONTAL_ALIGNMENT_CENTER, 570.0, 17, Color.html("#f8fafc"))
	if exit_open:
		draw_rect(Rect2(size.x - 250.0, 24.0, 220.0, 42.0), Color(0.45, 0.34, 0.03, 0.82), true)
		draw_string(font, Vector2(size.x - 235.0, 52.0), "EXIT OFFEN", HORIZONTAL_ALIGNMENT_CENTER, 190.0, 20, Color.html("#facc15"))
	if message_timer > 0.0:
		draw_rect(Rect2(12.0, size.y - 44.0, minf(size.x - 24.0, 850.0), 30.0), Color(0.02, 0.05, 0.09, 0.78), true)
		draw_string(font, Vector2(26.0, size.y - 22.0), message, HORIZONTAL_ALIGNMENT_LEFT, minf(size.x - 52.0, 820.0), 15, Color.html("#f8fafc"))
	draw_crosshair()
	draw_minimap()

func draw_crosshair() -> void:
	var c := Vector2(size.x * 0.5, size.y * 0.5)
	draw_line(c + Vector2(-13.0, 0.0), c + Vector2(-4.0, 0.0), Color.html("#f8fafc"), 2.0)
	draw_line(c + Vector2(4.0, 0.0), c + Vector2(13.0, 0.0), Color.html("#f8fafc"), 2.0)
	draw_line(c + Vector2(0.0, -13.0), c + Vector2(0.0, -4.0), Color.html("#f8fafc"), 2.0)
	draw_line(c + Vector2(0.0, 4.0), c + Vector2(0.0, 13.0), Color.html("#f8fafc"), 2.0)

func draw_minimap() -> void:
	var scale := 6.4
	var origin := Vector2(size.x - 128.0, size.y - 128.0)
	draw_rect(Rect2(origin - Vector2(6.0, 6.0), Vector2(114.0, 114.0)), Color(0.02, 0.05, 0.09, 0.66), true)
	for y in range(MAP_H):
		for x in range(MAP_W):
			var tile: String = get_tile(x, y)
			if tile == "1" or tile == "2" or tile == "3" or (tile == "E" and not exit_open):
				draw_rect(Rect2(origin + Vector2(float(x) * scale, float(y) * scale), Vector2(scale, scale)), wall_color(tile), true)
	for enemy in enemies:
		var foe: Dictionary = enemy
		draw_rect(Rect2(origin + foe["pos"] * scale - Vector2(2.0, 2.0), Vector2(4.0, 4.0)), Color.html("#ef4444"), true)
	draw_circle(origin + player_pos * scale, 3.5, Color.html("#facc15"))
	draw_line(origin + player_pos * scale, origin + (player_pos + Vector2(cos(player_angle), sin(player_angle)) * 0.8) * scale, Color.html("#facc15"), 1.5)
