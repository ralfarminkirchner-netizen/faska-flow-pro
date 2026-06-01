extends Control

const TRACK_LENGTH := 15000.0
const MAX_SPEED := 245.0
const LEARN_GOAL := 8
const LESSONS := ["WORTART", "MATHE", "SATZ", "LESEN", "KOMPOSITUM", "ENGLISCH"]

const QUESTIONS_WORD := [
	{"prompt": "Welche Wortart ist 'schnell'?", "answers": ["Nomen", "Verb", "Adjektiv"], "correct": 2},
	{"prompt": "Welche Wortart ist 'fahren'?", "answers": ["Verb", "Artikel", "Nomen"], "correct": 0},
	{"prompt": "Welche Wortart ist 'das'?", "answers": ["Adjektiv", "Artikel", "Verb"], "correct": 1},
	{"prompt": "Welche Wortart ist 'unter'?", "answers": ["Praeposition", "Nomen", "Verb"], "correct": 0},
	{"prompt": "Welche Wortart ist 'und'?", "answers": ["Artikel", "Konjunktion", "Adjektiv"], "correct": 1},
	{"prompt": "Welche Wortart ist 'Freude'?", "answers": ["Verb", "Adjektiv", "Nomen"], "correct": 2},
	{"prompt": "Welche Wortart ist 'leise'?", "answers": ["Adjektiv", "Verb", "Artikel"], "correct": 0},
]

const QUESTIONS_MATH := [
	{"prompt": "Rechne 8 + 7.", "answers": ["14", "15", "16"], "correct": 1},
	{"prompt": "Rechne 24 - 9.", "answers": ["15", "13", "17"], "correct": 0},
	{"prompt": "Rechne 6 x 4.", "answers": ["20", "28", "24"], "correct": 2},
	{"prompt": "Rechne 36 : 6.", "answers": ["6", "7", "5"], "correct": 0},
	{"prompt": "Welche Zahl ist gerade?", "answers": ["17", "21", "28"], "correct": 2},
	{"prompt": "Welche Zahl ist groesser als 50?", "answers": ["49", "63", "38"], "correct": 1},
]

const QUESTIONS_SENTENCE := [
	{"prompt": "Der Hund ___ im Garten.", "answers": ["bellen", "bellt", "belle"], "correct": 1},
	{"prompt": "Mira liest ___ Buch.", "answers": ["ein", "eine", "einen"], "correct": 0},
	{"prompt": "Wir gehen, ___ es klingelt.", "answers": ["weil", "laut", "unter"], "correct": 0},
	{"prompt": "Die Kinder spielen ___ dem Hof.", "answers": ["schnell", "auf", "und"], "correct": 1},
	{"prompt": "Setze das Satzende: Heute regnet es ___.", "answers": ["?", ".", ","], "correct": 1},
	{"prompt": "Welches Wort verbindet Saetze?", "answers": ["weil", "Tisch", "gruen"], "correct": 0},
]

const QUESTIONS_READING := [
	{"prompt": "Lies: 'Der Ball liegt unter dem Tisch.' Wo ist der Ball?", "answers": ["unter dem Tisch", "auf dem Dach", "im Auto"], "correct": 0},
	{"prompt": "Lies: 'Lina kauft Brot beim Baecker.' Was kauft Lina?", "answers": ["Milch", "Brot", "Schuhe"], "correct": 1},
	{"prompt": "Lies: 'Omar rennt schnell zum Tor.' Wie rennt Omar?", "answers": ["langsam", "leise", "schnell"], "correct": 2},
	{"prompt": "Lies: 'Im Winter faellt Schnee.' Was faellt?", "answers": ["Regen", "Schnee", "Sand"], "correct": 1},
	{"prompt": "Lies: 'Die Katze sitzt neben dem Sofa.' Wo sitzt sie?", "answers": ["neben dem Sofa", "im Wasser", "auf dem Mond"], "correct": 0},
]

const QUESTIONS_COMPOUND := [
	{"prompt": "Bilde das Kompositum: Sonne + Blume.", "answers": ["Sonnenblume", "Blumensonne", "Sonneblumig"], "correct": 0},
	{"prompt": "Bilde das Kompositum: Zahn + Buerste.", "answers": ["Buerstenzahn", "Zahnbuerste", "Zahnig"], "correct": 1},
	{"prompt": "Bilde das Kompositum: Regen + Mantel.", "answers": ["Regentanz", "Mantelregen", "Regenmantel"], "correct": 2},
	{"prompt": "Bilde das Kompositum: Haus + Tuer.", "answers": ["Haustuer", "Tuerhaus", "Haeuslich"], "correct": 0},
	{"prompt": "Bilde das Kompositum: Buch + Laden.", "answers": ["Ladenbuch", "Buchladen", "Buecher"], "correct": 1},
]

const QUESTIONS_ENGLISH := [
	{"prompt": "Was heisst 'Hund' auf Englisch?", "answers": ["dog", "cat", "bird"], "correct": 0},
	{"prompt": "Was heisst 'gelb' auf Englisch?", "answers": ["green", "red", "yellow"], "correct": 2},
	{"prompt": "Was heisst 'lesen' auf Englisch?", "answers": ["jump", "read", "drive"], "correct": 1},
	{"prompt": "Was heisst 'Schule' auf Englisch?", "answers": ["school", "shop", "street"], "correct": 0},
	{"prompt": "Was heisst 'schnell' auf Englisch?", "answers": ["slow", "fast", "small"], "correct": 1},
]

class TouchRallyOverlay:
	extends Control

	var move_vector := Vector2.ZERO
	var buttons := {
		"gas": false,
		"brake": false,
		"boost": false,
		"learn": false,
	}
	var active_move := -1
	var active_buttons := {}
	var mouse_move_active := false
	var mouse_button_name := ""

	func _ready() -> void:
		set_anchors_preset(Control.PRESET_FULL_RECT)
		mouse_filter = Control.MOUSE_FILTER_PASS
		queue_redraw()

	func _gui_input(event: InputEvent) -> void:
		if not _should_show():
			return
		if event is InputEventScreenTouch:
			if event.pressed:
				var picked_button := _button_at(event.position)
				if picked_button != "":
					buttons[picked_button] = true
					active_buttons[event.index] = picked_button
					accept_event()
				elif _is_on_stick(event.position):
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
		elif event is InputEventScreenDrag and event.index == active_move:
			_update_stick(event.position)
			accept_event()
		elif event is InputEventMouseButton:
			if event.button_index != MOUSE_BUTTON_LEFT:
				return
			if event.pressed:
				var picked_mouse_button := _button_at(event.position)
				if picked_mouse_button != "":
					mouse_button_name = picked_mouse_button
					buttons[mouse_button_name] = true
					accept_event()
				elif _is_on_stick(event.position):
					mouse_move_active = true
					_update_stick(event.position)
					accept_event()
			else:
				mouse_move_active = false
				move_vector = Vector2.ZERO
				if mouse_button_name != "":
					buttons[mouse_button_name] = false
					mouse_button_name = ""
				queue_redraw()
		elif event is InputEventMouseMotion and mouse_move_active:
			_update_stick(event.position)
			accept_event()

	func is_down(name: String) -> bool:
		return buttons.has(name) and buttons[name]

	func consume_tap(name: String) -> bool:
		if not is_down(name):
			return false
		buttons[name] = false
		queue_redraw()
		return true

	func _should_show() -> bool:
		var screen := get_viewport_rect().size
		return screen.x <= 1100.0 or screen.x < screen.y

	func _ui_scale() -> float:
		var screen := get_viewport_rect().size
		return clampf(min(screen.x, screen.y) / 720.0, 0.74, 1.18)

	func _stick_center() -> Vector2:
		var screen := get_viewport_rect().size
		var s := _ui_scale()
		return Vector2(96.0 * s, screen.y - 100.0 * s)

	func _button_centers() -> Dictionary:
		var screen := get_viewport_rect().size
		var s := _ui_scale()
		return {
			"gas": Vector2(screen.x - 92.0 * s, screen.y - 154.0 * s),
			"brake": Vector2(screen.x - 92.0 * s, screen.y - 64.0 * s),
			"boost": Vector2(screen.x - 180.0 * s, screen.y - 154.0 * s),
			"learn": Vector2(screen.x - 180.0 * s, screen.y - 64.0 * s),
		}

	func _is_on_stick(pos: Vector2) -> bool:
		return pos.distance_to(_stick_center()) <= 88.0 * _ui_scale()

	func _button_at(pos: Vector2) -> String:
		var radius := 42.0 * _ui_scale()
		for name in _button_centers().keys():
			if pos.distance_to(_button_centers()[name]) <= radius:
				return name
		return ""

	func _update_stick(pos: Vector2) -> void:
		var limit := 56.0 * _ui_scale()
		var raw := pos - _stick_center()
		move_vector = raw.limit_length(limit) / limit
		queue_redraw()

	func _draw() -> void:
		if not _should_show():
			return
		var font := get_theme_default_font()
		var s := _ui_scale()
		var center := _stick_center()
		draw_circle(center, 66.0 * s, Color(0.02, 0.08, 0.13, 0.48))
		draw_arc(center, 66.0 * s, 0.0, TAU, 48, Color(0.65, 0.86, 1.0, 0.48), 3.0 * s)
		draw_circle(center + move_vector * 44.0 * s, 28.0 * s, Color(0.25, 0.85, 1.0, 0.88))
		var labels := {
			"gas": ["GO", "GAS"],
			"brake": ["BRK", "STOP"],
			"boost": ["BST", "BOOST"],
			"learn": ["L", "LERN"],
		}
		for name in _button_centers().keys():
			var button_center: Vector2 = _button_centers()[name]
			var fill := Color(0.04, 0.08, 0.17, 0.74)
			if is_down(name):
				fill = Color(0.18, 0.56, 0.95, 0.92)
			draw_circle(button_center, 40.0 * s, fill)
			draw_arc(button_center, 40.0 * s, 0.0, TAU, 48, Color(0.79, 0.91, 1.0, 0.62), 2.0 * s)
			draw_string(font, button_center + Vector2(-24.0, -8.0) * s, labels[name][0], HORIZONTAL_ALIGNMENT_CENTER, 48.0 * s, max(10, int(14.0 * s)), Color.WHITE)
			draw_string(font, button_center + Vector2(-32.0, 13.0) * s, labels[name][1], HORIZONTAL_ALIGNMENT_CENTER, 64.0 * s, max(7, int(8.0 * s)), Color(0.82, 0.92, 1.0))

var speed := 0.0
var distance := 0.0
var player_lane := 0.0
var drift := 0.0
var grip := 1.0
var boost := 100.0
var damage := 0.0
var score := 0
var combo := 0
var sector := 0
var mode_learn := false
var lesson_index := 0
var correct_gates := 0
var mistakes := 0
var question_index := 0
var repeat_queue: Array = []
var answer_gate_z := 950.0
var answer_gate_armed := true
var opponents: Array = []
var coins: Array = []
var sector_gates: Array = []
var touch_overlay: TouchRallyOverlay
var message := "Godot Rally: Gas, Grip, Rivalen, Sektor-Gates und Learncade-Spuren."
var message_timer := 4.0
var race_over := false
var shake_timer := 0.0

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_PASS
	focus_mode = Control.FOCUS_ALL
	touch_overlay = TouchRallyOverlay.new()
	add_child(touch_overlay)
	grab_focus()
	reset_game()

func reset_game() -> void:
	speed = 0.0
	distance = 0.0
	player_lane = 0.0
	drift = 0.0
	grip = 1.0
	boost = 100.0
	damage = 0.0
	score = 0
	combo = 0
	sector = 0
	mode_learn = false
	lesson_index = 0
	correct_gates = 0
	mistakes = 0
	question_index = 0
	repeat_queue.clear()
	answer_gate_z = 950.0
	answer_gate_armed = true
	race_over = false
	shake_timer = 0.0
	spawn_opponents()
	spawn_coins()
	spawn_sector_gates()
	message = "WASD/Pfeile fahren, Space Boost, L Learncade, R Neustart."
	message_timer = 4.0

func spawn_opponents() -> void:
	opponents.clear()
	var lanes: Array = [-0.62, 0.0, 0.62, -0.28, 0.34]
	for i in range(9):
		opponents.append({
			"z": 820.0 + float(i) * 1320.0,
			"lane": lanes[i % lanes.size()],
			"speed": 118.0 + float((i * 29) % 70),
			"color": Color.html("#ef4444") if i % 3 == 0 else Color.html("#38bdf8"),
			"hit": 0.0,
		})

func spawn_coins() -> void:
	coins.clear()
	var lanes: Array = [-0.72, -0.36, 0.0, 0.36, 0.72]
	for i in range(34):
		coins.append({
			"z": 560.0 + float(i) * 410.0,
			"lane": lanes[(i * 2 + 1) % lanes.size()],
			"taken": false,
		})

func spawn_sector_gates() -> void:
	sector_gates.clear()
	for i in range(1, 6):
		sector_gates.append({"z": float(i) * TRACK_LENGTH / 6.0, "passed": false})

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_R:
			reset_game()
		elif event.keycode == KEY_L:
			toggle_learn_mode()
		elif event.keycode == KEY_C:
			cycle_lesson()

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()
	if race_over:
		queue_redraw()
		return
	if message_timer > 0.0:
		message_timer -= delta
	if shake_timer > 0.0:
		shake_timer -= delta
	if touch_overlay and touch_overlay.consume_tap("learn"):
		toggle_learn_mode()
	update_car(delta)
	update_world(delta)
	check_progress()
	queue_redraw()

func update_car(delta: float) -> void:
	var throttle := 0.0
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		throttle += 1.0
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		throttle -= 1.0
	if touch_overlay:
		throttle += maxf(0.0, -touch_overlay.move_vector.y) * 0.45
		if touch_overlay.is_down("gas"):
			throttle += 1.0
		if touch_overlay.is_down("brake"):
			throttle -= 1.0
	throttle = clampf(throttle, -1.0, 1.0)
	var steer := 0.0
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		steer -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		steer += 1.0
	if touch_overlay:
		steer += touch_overlay.move_vector.x
	steer = clampf(steer, -1.0, 1.0)
	var boosting: bool = (Input.is_key_pressed(KEY_SPACE) or (touch_overlay and touch_overlay.is_down("boost"))) and boost > 1.0 and throttle >= 0.0
	var target_accel: float = 96.0 * throttle
	if boosting:
		target_accel += 145.0
		boost = maxf(0.0, boost - delta * 42.0)
	else:
		boost = minf(100.0, boost + delta * 9.0)
	if throttle < 0.0:
		target_accel -= 115.0
	var drag: float = 18.0 + damage * 0.38
	speed = clampf(speed + target_accel * delta - drag * delta, 0.0, MAX_SPEED + (45.0 if boosting else 0.0))
	var curve: float = road_curve(distance + 380.0)
	var steer_power: float = lerpf(1.1, 0.48, clampf(speed / MAX_SPEED, 0.0, 1.0))
	drift = lerpf(drift, steer - curve * 0.7, delta * 5.2)
	player_lane += drift * steer_power * delta * (0.7 + speed / MAX_SPEED)
	player_lane += curve * delta * speed / 210.0
	player_lane = clampf(player_lane, -1.15, 1.15)
	grip = clampf(1.0 - absf(drift) * 0.35 - maxf(0.0, absf(player_lane) - 0.86) * 0.45, 0.25, 1.0)
	if absf(player_lane) > 0.98:
		speed = maxf(0.0, speed - delta * 45.0)
		damage = minf(100.0, damage + delta * 2.4)
	distance += speed * (3.5 + grip) * delta

func update_world(delta: float) -> void:
	for i in range(opponents.size()):
		var car: Dictionary = opponents[i]
		car["z"] = float(car["z"]) + float(car["speed"]) * delta * 0.8
		while float(car["z"]) < distance - 140.0:
			car["z"] = distance + 1800.0 + float(i * 379 % 1800)
			car["lane"] = [-0.65, -0.28, 0.22, 0.62][i % 4]
			car["hit"] = 0.0
		if float(car["hit"]) > 0.0:
			car["hit"] = maxf(0.0, float(car["hit"]) - delta)
		var dz: float = float(car["z"]) - distance
		if speed > 22.0 and dz > 0.0 and dz < 72.0 and absf(float(car["lane"]) - player_lane) < 0.22:
			damage = minf(100.0, damage + 13.0)
			speed *= 0.68
			boost = maxf(0.0, boost - 12.0)
			combo = 0
			car["hit"] = 0.28
			shake_timer = 0.22
			message = "Kontakt. Linie sauberer fahren."
			message_timer = 1.6
		opponents[i] = car
	for i in range(coins.size()):
		var coin: Dictionary = coins[i]
		var dz_coin: float = float(coin["z"]) - distance
		if not bool(coin["taken"]) and dz_coin > 0.0 and dz_coin < 56.0 and absf(float(coin["lane"]) - player_lane) < 0.18:
			coin["taken"] = true
			combo += 1
			score += 55 * combo
			boost = minf(100.0, boost + 7.0)
			message = "%d Combo" % combo
			message_timer = 1.0
		if float(coin["z"]) < distance - 120.0:
			coin["z"] = distance + 4200.0 + float(i * 137 % 900)
			coin["lane"] = [-0.72, -0.36, 0.0, 0.36, 0.72][i % 5]
			coin["taken"] = false
		coins[i] = coin
	check_sector_gates()
	check_answer_gate()

func check_sector_gates() -> void:
	for i in range(sector_gates.size()):
		var gate: Dictionary = sector_gates[i]
		if not bool(gate["passed"]) and distance >= float(gate["z"]):
			gate["passed"] = true
			sector += 1
			score += 500 + int(speed) * 2
			boost = minf(100.0, boost + 18.0)
			message = "Sektor %d sauber. Boost +18." % sector
			message_timer = 1.7
		sector_gates[i] = gate

func check_answer_gate() -> void:
	if not mode_learn or not answer_gate_armed:
		return
	if distance < answer_gate_z:
		return
	var q: Dictionary = current_question()
	var correct_lane: float = answer_lane(int(q["correct"]))
	var selected: int = lane_to_answer(player_lane)
	answer_gate_armed = false
	if selected == int(q["correct"]):
		var repeated := bool(q.get("repeat", false))
		score += 1150 if repeated else 900
		boost = 100.0
		combo += 1
		correct_gates += 1
		damage = maxf(0.0, damage - 10.0)
		_remove_repeat(q)
		message = "Wiederholung geloest. Turbo frei." if repeated else "Richtig. Voller Boost und Schaden repariert."
		question_index = (question_index + 1) % question_bank().size()
		if correct_gates > 0 and correct_gates % LEARN_GOAL == 0:
			score += 1600
			message = "Lernziel %d erreicht. Bonus und neue Rally-Lektion." % correct_gates
			cycle_lesson()
	else:
		mistakes += 1
		_queue_repeat(q)
		damage = minf(100.0, damage + 12.0)
		speed *= 0.78
		message = "Falsche Spur. Gesucht war: %s" % str(q["answers"][int(q["correct"])])
	shake_timer = 0.16
	message_timer = 2.2
	answer_gate_z = distance + 1180.0
	answer_gate_armed = true
	var lane_hint: float = correct_lane
	lane_hint += 0.0

func lane_to_answer(lane: float) -> int:
	if lane < -0.33:
		return 0
	if lane > 0.33:
		return 2
	return 1

func answer_lane(index: int) -> float:
	if index == 0:
		return -0.62
	if index == 2:
		return 0.62
	return 0.0

func check_progress() -> void:
	if distance >= TRACK_LENGTH:
		race_over = true
		score += maxi(0, int((100.0 - damage) * 20.0)) + int(speed) * 8
		message = "Ziel erreicht. Score %d. R startet neu." % score
		message_timer = 99.0
	if damage >= 100.0:
		race_over = true
		message = "Wagen zerstoert. R startet neu."
		message_timer = 99.0

func road_curve(z: float) -> float:
	return sin(z * 0.0009) * 0.55 + sin(z * 0.0021) * 0.24

func project_point(z_distance: float, lane: float) -> Dictionary:
	var horizon: float = horizon_y()
	var ground: float = ground_y()
	var t: float = clampf(1.0 - z_distance / 1500.0, 0.0, 1.0)
	var curve: float = road_curve(distance + z_distance)
	var y: float = horizon + pow(t, 1.9) * (ground - horizon)
	var near_width := minf(size.x * 0.92, 980.0 if is_mobile_layout() else size.x * 0.88)
	var far_width := maxf(size.x * 0.11, 80.0)
	var road_w: float = lerpf(far_width, near_width, pow(t, 1.25))
	var center: float = size.x * 0.5 + curve * pow(t, 2.0) * minf(size.x * 0.24, 260.0)
	var x: float = center + lane * road_w * 0.38
	var scale: float = lerpf(0.18, 1.0, t)
	return {"x": x, "y": y, "width": road_w, "center": center, "scale": scale}

func _draw() -> void:
	var shake: Vector2 = screen_shake()
	draw_background()
	draw_road(shake)
	draw_world_objects(shake)
	draw_player_car(shake)
	draw_hud()

func screen_shake() -> Vector2:
	if shake_timer <= 0.0:
		return Vector2.ZERO
	return Vector2(sin(distance * 0.15) * 5.0, cos(distance * 0.21) * 3.0)

func draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color.html("#06111f"), true)
	draw_rect(Rect2(Vector2.ZERO, Vector2(size.x, size.y * 0.35)), Color.html("#123c69"), true)
	draw_circle(Vector2(size.x * 0.82, size.y * 0.12), 38.0, Color.html("#fde68a"))
	for i in range(12):
		var hill_x: float = float(i) * size.x / 8.0 - fmod(distance * 0.02, size.x / 8.0)
		draw_rect(Rect2(Vector2(hill_x, size.y * 0.25 + sin(float(i)) * 14.0), Vector2(size.x / 5.0, size.y * 0.16)), Color.html("#14532d"), true)
	draw_rect(Rect2(Vector2(0.0, size.y * 0.35), Vector2(size.x, size.y * 0.65)), Color.html("#0f3f2d"), true)

func draw_road(shake: Vector2) -> void:
	var strips := 42
	for i in range(strips - 1, -1, -1):
		var z0: float = float(i) / float(strips) * 1500.0
		var z1: float = float(i + 1) / float(strips) * 1500.0
		var p0: Dictionary = project_point(z0, 0.0)
		var p1: Dictionary = project_point(z1, 0.0)
		var c0: float = p0["center"]
		var c1: float = p1["center"]
		var w0: float = p0["width"]
		var w1: float = p1["width"]
		var y0: float = p0["y"]
		var y1: float = p1["y"]
		var road_color: Color = Color.html("#334155") if i % 2 == 0 else Color.html("#293548")
		var shoulder_color: Color = Color.html("#b45309") if i % 2 == 0 else Color.html("#facc15")
		var road_poly := PackedVector2Array([
			Vector2(c0 - w0 * 0.5, y0) + shake,
			Vector2(c0 + w0 * 0.5, y0) + shake,
			Vector2(c1 + w1 * 0.5, y1) + shake,
			Vector2(c1 - w1 * 0.5, y1) + shake,
		])
		draw_polygon(road_poly, PackedColorArray([road_color]))
		draw_line(Vector2(c0 - w0 * 0.5, y0) + shake, Vector2(c1 - w1 * 0.5, y1) + shake, shoulder_color, 5.0)
		draw_line(Vector2(c0 + w0 * 0.5, y0) + shake, Vector2(c1 + w1 * 0.5, y1) + shake, shoulder_color, 5.0)
		if i % 3 == 0:
			for lane_mark in [-0.33, 0.33]:
				var x0: float = c0 + lane_mark * w0 * 0.38
				var x1: float = c1 + lane_mark * w1 * 0.38
				draw_line(Vector2(x0, y0) + shake, Vector2(x1, y1) + shake, Color(1.0, 1.0, 1.0, 0.33), 2.0)

func draw_world_objects(shake: Vector2) -> void:
	for gate in sector_gates:
		var item: Dictionary = gate
		var dz: float = float(item["z"]) - distance
		if dz > 0.0 and dz < 1450.0 and not bool(item["passed"]):
			draw_gate(dz, "S%d" % (sector + 1), Color.html("#facc15"), shake)
	if mode_learn and answer_gate_armed:
		draw_answer_gate(answer_gate_z - distance, shake)
	for coin in coins:
		var item_coin: Dictionary = coin
		var dz_coin: float = float(item_coin["z"]) - distance
		if dz_coin > 0.0 and dz_coin < 1400.0 and not bool(item_coin["taken"]):
			draw_coin(dz_coin, float(item_coin["lane"]), shake)
	for opponent in opponents:
		var item_car: Dictionary = opponent
		var dz_car: float = float(item_car["z"]) - distance
		if dz_car > 0.0 and dz_car < 1350.0:
			draw_rival_car(dz_car, float(item_car["lane"]), item_car["color"], float(item_car["hit"]), shake)

func draw_gate(z_distance: float, label: String, color: Color, shake: Vector2) -> void:
	var p: Dictionary = project_point(z_distance, 0.0)
	var y: float = p["y"]
	var center: float = p["center"]
	var width: float = p["width"] * 0.82
	var scale: float = p["scale"]
	draw_line(Vector2(center - width * 0.5, y) + shake, Vector2(center + width * 0.5, y) + shake, color, maxf(2.0, scale * 7.0))
	draw_string(get_theme_default_font(), Vector2(center - 42.0, y - 12.0 * scale) + shake, label, HORIZONTAL_ALIGNMENT_CENTER, 84.0, max(10, int(scale * 19.0)), Color.html("#f8fafc"))

func draw_answer_gate(z_distance: float, shake: Vector2) -> void:
	if z_distance < 0.0 or z_distance > 1450.0:
		return
	var q: Dictionary = current_question()
	var answers: Array = q["answers"]
	for i in range(3):
		var lane: float = answer_lane(i)
		var p: Dictionary = project_point(z_distance, lane)
		var pos := Vector2(float(p["x"]), float(p["y"])) + shake
		var scale: float = p["scale"]
		var rect := Rect2(pos - Vector2(54.0, 24.0) * scale, Vector2(108.0, 48.0) * scale)
		var border := Color.html("#f0abfc") if bool(q.get("repeat", false)) else Color.html("#38bdf8")
		draw_rect(rect, Color(0.04, 0.12, 0.2, 0.84), true)
		draw_rect(rect, border, false, maxf(1.0, 3.0 * scale))
		draw_string(get_theme_default_font(), rect.position + Vector2(4.0, rect.size.y * 0.62), str(answers[i]), HORIZONTAL_ALIGNMENT_CENTER, rect.size.x - 8.0, max(8, int(14.0 * scale)), Color.html("#f8fafc"))

func draw_coin(z_distance: float, lane: float, shake: Vector2) -> void:
	var p: Dictionary = project_point(z_distance, lane)
	var pos := Vector2(float(p["x"]), float(p["y"])) + shake
	var r: float = maxf(3.0, 10.0 * float(p["scale"]))
	draw_circle(pos, r, Color.html("#facc15"))
	draw_circle(pos, r * 0.48, Color.html("#f97316"))

func draw_rival_car(z_distance: float, lane: float, color: Color, hit: float, shake: Vector2) -> void:
	var p: Dictionary = project_point(z_distance, lane)
	var scale: float = float(p["scale"])
	var pos := Vector2(float(p["x"]), float(p["y"])) + shake
	var body_color: Color = Color.html("#f8fafc") if hit > 0.0 else color
	draw_pseudo_car(pos + Vector2(0.0, -36.0 * scale), scale, body_color, false)

func draw_player_car(shake: Vector2) -> void:
	var road_bottom: Dictionary = project_point(0.0, 0.0)
	var car_y: float = ground_y() - (18.0 if is_mobile_layout() else 0.0)
	var car_x: float = float(road_bottom["center"]) + player_lane * float(road_bottom["width"]) * 0.33
	var lean: float = drift * 9.0
	var pos := Vector2(car_x, car_y) + shake
	draw_pseudo_car(pos + Vector2(lean * 0.18, -38.0), 1.18, Color.html("#facc15"), true)
	if Input.is_key_pressed(KEY_SPACE) and boost > 0.0:
		draw_polygon(PackedVector2Array([pos + Vector2(-19.0, 8.0), pos + Vector2(0.0, 52.0), pos + Vector2(19.0, 8.0)]), PackedColorArray([Color(0.32, 0.81, 1.0, 0.65)]))

func draw_pseudo_car(center: Vector2, scale: float, color: Color, player: bool) -> void:
	var front := 48.0 * scale
	var back := 42.0 * scale
	var half_front := 24.0 * scale
	var half_back := 34.0 * scale
	var body := PackedVector2Array([
		center + Vector2(-half_front, -front),
		center + Vector2(half_front, -front),
		center + Vector2(half_back, back * 0.42),
		center + Vector2(half_back * 0.72, back),
		center + Vector2(-half_back * 0.72, back),
		center + Vector2(-half_back, back * 0.42),
	])
	draw_circle(center + Vector2(0.0, back * 0.65), 31.0 * scale, Color(0, 0, 0, 0.24))
	draw_polygon(body, PackedColorArray([color]))
	var outline := PackedVector2Array(body)
	outline.append(body[0])
	draw_polyline(outline, Color(0.02, 0.06, 0.12, 0.82), maxf(1.0, 2.0 * scale), true)
	draw_polygon(PackedVector2Array([
		center + Vector2(-17.0, -30.0) * scale,
		center + Vector2(17.0, -30.0) * scale,
		center + Vector2(22.0, 2.0) * scale,
		center + Vector2(-22.0, 2.0) * scale,
	]), PackedColorArray([Color(0.69, 0.87, 1.0, 0.45)]))
	draw_rect(Rect2(center + Vector2(-37.0, 10.0) * scale, Vector2(12.0, 26.0) * scale), Color.html("#020617"), true)
	draw_rect(Rect2(center + Vector2(25.0, 10.0) * scale, Vector2(12.0, 26.0) * scale), Color.html("#020617"), true)
	if player:
		draw_rect(Rect2(center + Vector2(-18.0, 26.0) * scale, Vector2(36.0, 10.0) * scale), Color.html("#fb923c"), true)

func draw_hud() -> void:
	var font := get_theme_default_font()
	var compact := is_mobile_layout()
	var hud_w := minf(size.x - 24.0, 620.0 if not compact else size.x - 24.0)
	draw_rect(Rect2(12.0, 12.0, hud_w, 104.0 if not compact else 122.0), Color(0.02, 0.05, 0.09, 0.74), true)
	draw_string(font, Vector2(26.0, 38.0), "FASKA RALLY PRO", HORIZONTAL_ALIGNMENT_LEFT, hud_w - 28.0, 22, Color.html("#facc15"))
	draw_string(font, Vector2(26.0, 64.0), "Speed %d  Grip %d%%  Schaden %d%%  Combo %d" % [int(speed), int(grip * 100.0), int(damage), combo], HORIZONTAL_ALIGNMENT_LEFT, hud_w - 28.0, 15, Color.html("#f8fafc"))
	draw_string(font, Vector2(26.0, 88.0), "Mode %s  Fach %s  Ziel %d/%d  Fehler %d  Wdh %d" % ["Lernen" if mode_learn else "Normal", LESSONS[lesson_index], correct_gates % LEARN_GOAL, LEARN_GOAL, mistakes, repeat_queue.size()], HORIZONTAL_ALIGNMENT_LEFT, hud_w - 28.0, 14, Color.html("#cbd5e1"))
	if compact:
		draw_string(font, Vector2(26.0, 111.0), "L/C: Lernen/Fach  R: Neustart", HORIZONTAL_ALIGNMENT_LEFT, hud_w - 28.0, 12, Color.html("#94a3b8"))
	if not compact:
		draw_rect(Rect2(size.x - 296.0, 18.0, 268.0, 70.0), Color(0.02, 0.05, 0.09, 0.72), true)
		draw_string(font, Vector2(size.x - 278.0, 44.0), "%d%% ETAPPE" % int(clampf(distance / TRACK_LENGTH, 0.0, 1.0) * 100.0), HORIZONTAL_ALIGNMENT_LEFT, -1, 22, Color.html("#f8fafc"))
		draw_rect(Rect2(size.x - 278.0, 58.0, 224.0, 10.0), Color.html("#0f172a"), true)
		draw_rect(Rect2(size.x - 278.0, 58.0, 224.0 * clampf(distance / TRACK_LENGTH, 0.0, 1.0), 10.0), Color.html("#22c55e"), true)
	if mode_learn:
		var q: Dictionary = current_question()
		var q_w := minf(size.x - 24.0, 760.0)
		var q_y := 126.0 if compact else 96.0
		draw_rect(Rect2(size.x * 0.5 - q_w * 0.5, q_y, q_w, 38.0), Color(0.02, 0.05, 0.09, 0.76), true)
		draw_string(font, Vector2(size.x * 0.5 - q_w * 0.5 + 12.0, q_y + 25.0), str(q["prompt"]), HORIZONTAL_ALIGNMENT_CENTER, q_w - 24.0, 16, Color.html("#f8fafc"))
	if message_timer > 0.0:
		var msg_y := size.y - (186.0 if compact else 76.0)
		draw_rect(Rect2(16.0, msg_y, minf(size.x - 32.0, 820.0), 30.0), Color(0.02, 0.05, 0.09, 0.76), true)
		draw_string(font, Vector2(30.0, msg_y + 22.0), message, HORIZONTAL_ALIGNMENT_LEFT, minf(size.x - 60.0, 792.0), 15, Color.html("#f8fafc"))
	if not compact:
		draw_string(font, Vector2(size.x * 0.5 - 330.0, size.y - 18.0), "WASD/Pfeile fahren · Space Boost · L Learncade · C Fach · R Neustart", HORIZONTAL_ALIGNMENT_CENTER, 660.0, 12, Color.html("#cbd5e1"))

func toggle_learn_mode() -> void:
	mode_learn = not mode_learn
	answer_gate_z = distance + 820.0
	answer_gate_armed = true
	message = "Learncade: Fahre durch die richtige Antwortspur. C wechselt das Fach." if mode_learn else "Normalmodus: Rally-Etappe mit Rivalen und Sektor-Gates."
	message_timer = 3.0

func cycle_lesson() -> void:
	lesson_index = (lesson_index + 1) % LESSONS.size()
	question_index = 0
	answer_gate_z = distance + 820.0
	answer_gate_armed = true
	message = "Fach: %s. Falsche Aufgaben bleiben als Wdh-Gates erhalten." % LESSONS[lesson_index]
	message_timer = 2.4

func question_bank() -> Array:
	match LESSONS[lesson_index]:
		"MATHE":
			return QUESTIONS_MATH
		"SATZ":
			return QUESTIONS_SENTENCE
		"LESEN":
			return QUESTIONS_READING
		"KOMPOSITUM":
			return QUESTIONS_COMPOUND
		"ENGLISCH":
			return QUESTIONS_ENGLISH
		_:
			return QUESTIONS_WORD

func current_question() -> Dictionary:
	var lesson := String(LESSONS[lesson_index])
	for entry in repeat_queue:
		if String(entry.get("lesson", "")) == lesson:
			var repeated_question: Dictionary = entry["question"]
			return repeated_question
	var bank := question_bank()
	var q: Dictionary = bank[question_index % bank.size()].duplicate(true)
	q["lesson"] = lesson
	return q

func _question_id(q: Dictionary) -> String:
	return "%s::%s" % [String(q.get("lesson", LESSONS[lesson_index])), String(q.get("prompt", ""))]

func _queue_repeat(q: Dictionary) -> void:
	var copy := q.duplicate(true)
	copy["lesson"] = String(q.get("lesson", LESSONS[lesson_index]))
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

func is_mobile_layout() -> bool:
	return size.x < 900.0 or size.y > size.x * 1.15

func horizon_y() -> float:
	if size.y > size.x * 1.15:
		return clampf(size.y * 0.24, 160.0, 290.0)
	if size.x < 900.0:
		return clampf(size.y * 0.28, 150.0, 250.0)
	return size.y * 0.34

func ground_y() -> float:
	if size.y > size.x * 1.15:
		return clampf(size.y * 0.72, 520.0, size.y - 190.0)
	if size.x < 900.0:
		return clampf(size.y * 0.78, 430.0, size.y - 145.0)
	return size.y * 0.86
