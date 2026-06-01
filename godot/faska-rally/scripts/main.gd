extends Control

const TRACK_LENGTH := 15000.0
const MAX_SPEED := 245.0
const QUESTIONS := [
	{"prompt": "Welche Wortart ist 'schnell'?", "answers": ["Nomen", "Verb", "Adjektiv"], "correct": 2},
	{"prompt": "Welche Wortart ist 'fahren'?", "answers": ["Verb", "Artikel", "Nomen"], "correct": 0},
	{"prompt": "Welche Wortart ist 'das'?", "answers": ["Adjektiv", "Artikel", "Verb"], "correct": 1},
]

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
var question_index := 0
var answer_gate_z := 950.0
var answer_gate_armed := true
var opponents: Array = []
var coins: Array = []
var sector_gates: Array = []
var message := "Godot Rally: Gas, Grip, Rivalen, Sektor-Gates und Learncade-Spuren."
var message_timer := 4.0
var race_over := false
var shake_timer := 0.0

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_STOP
	focus_mode = Control.FOCUS_ALL
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
	question_index = 0
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
			mode_learn = not mode_learn
			answer_gate_z = distance + 820.0
			answer_gate_armed = true
			message = "Learncade: Fahre durch die richtige Antwortspur." if mode_learn else "Normalmodus: Rally-Etappe mit Rivalen und Gates."
			message_timer = 3.0

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
	var steer := 0.0
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		steer -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		steer += 1.0
	var boosting: bool = Input.is_key_pressed(KEY_SPACE) and boost > 1.0 and throttle >= 0.0
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
	var q: Dictionary = QUESTIONS[question_index]
	var correct_lane: float = answer_lane(int(q["correct"]))
	var selected: int = lane_to_answer(player_lane)
	answer_gate_armed = false
	if selected == int(q["correct"]):
		score += 900
		boost = 100.0
		damage = maxf(0.0, damage - 10.0)
		message = "Richtig. Voller Boost und Schaden repariert."
		question_index = (question_index + 1) % QUESTIONS.size()
	else:
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
	var horizon: float = size.y * 0.34
	var ground: float = size.y * 0.86
	var t: float = clampf(1.0 - z_distance / 1500.0, 0.0, 1.0)
	var curve: float = road_curve(distance + z_distance)
	var y: float = horizon + pow(t, 1.9) * (ground - horizon)
	var road_w: float = lerpf(size.x * 0.12, size.x * 0.88, pow(t, 1.25))
	var center: float = size.x * 0.5 + curve * pow(t, 2.0) * size.x * 0.26
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
	var q: Dictionary = QUESTIONS[question_index]
	var answers: Array = q["answers"]
	for i in range(3):
		var lane: float = answer_lane(i)
		var p: Dictionary = project_point(z_distance, lane)
		var pos := Vector2(float(p["x"]), float(p["y"])) + shake
		var scale: float = p["scale"]
		var rect := Rect2(pos - Vector2(42.0, 22.0) * scale, Vector2(84.0, 44.0) * scale)
		draw_rect(rect, Color(0.05, 0.2, 0.33, 0.82), true)
		draw_rect(rect, Color.html("#38bdf8"), false, maxf(1.0, 3.0 * scale))
		draw_string(get_theme_default_font(), rect.position + Vector2(3.0, rect.size.y * 0.62), str(answers[i]), HORIZONTAL_ALIGNMENT_CENTER, rect.size.x - 6.0, max(8, int(15.0 * scale)), Color.html("#f8fafc"))

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
	var car_w: float = 50.0 * scale
	var car_h: float = 78.0 * scale
	var body_color: Color = Color.html("#f8fafc") if hit > 0.0 else color
	var rect := Rect2(pos - Vector2(car_w * 0.5, car_h), Vector2(car_w, car_h))
	draw_rect(rect, body_color, true)
	draw_rect(Rect2(rect.position + Vector2(car_w * 0.2, car_h * 0.16), Vector2(car_w * 0.6, car_h * 0.28)), Color.html("#0f172a"), true)
	draw_rect(Rect2(rect.position + Vector2(car_w * 0.1, car_h * 0.72), Vector2(car_w * 0.18, car_h * 0.18)), Color.html("#020617"), true)
	draw_rect(Rect2(rect.position + Vector2(car_w * 0.72, car_h * 0.72), Vector2(car_w * 0.18, car_h * 0.18)), Color.html("#020617"), true)

func draw_player_car(shake: Vector2) -> void:
	var road_bottom: Dictionary = project_point(0.0, 0.0)
	var car_y: float = size.y * 0.81
	var car_x: float = float(road_bottom["center"]) + player_lane * float(road_bottom["width"]) * 0.33
	var lean: float = drift * 9.0
	var pos := Vector2(car_x, car_y) + shake
	var body := Rect2(pos - Vector2(34.0, 84.0), Vector2(68.0, 92.0))
	draw_rect(body, Color.html("#facc15"), true)
	draw_rect(Rect2(body.position + Vector2(13.0 + lean, 12.0), Vector2(42.0, 28.0)), Color.html("#0f172a"), true)
	draw_rect(Rect2(body.position + Vector2(7.0, 62.0), Vector2(15.0, 23.0)), Color.html("#020617"), true)
	draw_rect(Rect2(body.position + Vector2(46.0, 62.0), Vector2(15.0, 23.0)), Color.html("#020617"), true)
	draw_rect(Rect2(body.position + Vector2(18.0, 72.0), Vector2(32.0, 10.0)), Color.html("#fb923c"), true)
	if Input.is_key_pressed(KEY_SPACE) and boost > 0.0:
		draw_polygon(PackedVector2Array([pos + Vector2(-19.0, 8.0), pos + Vector2(0.0, 52.0), pos + Vector2(19.0, 8.0)]), PackedColorArray([Color(0.32, 0.81, 1.0, 0.65)]))

func draw_hud() -> void:
	var font := get_theme_default_font()
	draw_rect(Rect2(16.0, 14.0, 388.0, 91.0), Color(0.02, 0.05, 0.09, 0.74), true)
	draw_string(font, Vector2(28.0, 40.0), "FASKA RALLY - GODOT 4", HORIZONTAL_ALIGNMENT_LEFT, -1, 22, Color.html("#facc15"))
	draw_string(font, Vector2(28.0, 65.0), "Speed %d  Grip %d%%  Schaden %d%%" % [int(speed), int(grip * 100.0), int(damage)], HORIZONTAL_ALIGNMENT_LEFT, -1, 15, Color.html("#f8fafc"))
	draw_string(font, Vector2(28.0, 88.0), "Sektor %d/5  Boost %d  Score %d" % [sector, int(boost), score], HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.html("#cbd5e1"))
	draw_rect(Rect2(size.x - 296.0, 18.0, 268.0, 70.0), Color(0.02, 0.05, 0.09, 0.72), true)
	draw_string(font, Vector2(size.x - 278.0, 44.0), "%d%% ETAPPE" % int(clampf(distance / TRACK_LENGTH, 0.0, 1.0) * 100.0), HORIZONTAL_ALIGNMENT_LEFT, -1, 22, Color.html("#f8fafc"))
	draw_rect(Rect2(size.x - 278.0, 58.0, 224.0, 10.0), Color.html("#0f172a"), true)
	draw_rect(Rect2(size.x - 278.0, 58.0, 224.0 * clampf(distance / TRACK_LENGTH, 0.0, 1.0), 10.0), Color.html("#22c55e"), true)
	if mode_learn:
		var q: Dictionary = QUESTIONS[question_index]
		draw_rect(Rect2(size.x * 0.5 - 300.0, 96.0, 600.0, 34.0), Color(0.02, 0.05, 0.09, 0.76), true)
		draw_string(font, Vector2(size.x * 0.5 - 280.0, 119.0), str(q["prompt"]), HORIZONTAL_ALIGNMENT_CENTER, 560.0, 17, Color.html("#f8fafc"))
	if message_timer > 0.0:
		draw_rect(Rect2(16.0, size.y - 44.0, minf(size.x - 32.0, 820.0), 30.0), Color(0.02, 0.05, 0.09, 0.76), true)
		draw_string(font, Vector2(30.0, size.y - 22.0), message, HORIZONTAL_ALIGNMENT_LEFT, minf(size.x - 60.0, 792.0), 15, Color.html("#f8fafc"))
	draw_string(font, Vector2(size.x * 0.5 - 250.0, size.y - 18.0), "WASD/Pfeile fahren · Space Boost · L Learncade · R Neustart", HORIZONTAL_ALIGNMENT_CENTER, 500.0, 12, Color.html("#cbd5e1"))
