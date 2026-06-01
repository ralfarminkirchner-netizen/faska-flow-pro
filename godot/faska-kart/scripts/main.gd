extends Control

const WORLD_W := 2600.0
const WORLD_H := 1700.0
const TRACK_WIDTH := 290.0
const MAX_SPEED := 720.0
const ACCEL := 520.0
const BRAKE := 650.0
const DRAG := 130.0
const STEER := 2.75
const TOTAL_LAPS := 3

const LEARN_TASKS = [
	{"prompt": "Welche Wortart ist 'schnell'?", "answer": "Adjektiv", "options": ["Nomen", "Verb", "Adjektiv"]},
	{"prompt": "Was ist 8 + 9?", "answer": "17", "options": ["16", "17", "18"]},
	{"prompt": "Was bedeutet 'fast'?", "answer": "schnell", "options": ["langsam", "schnell", "rund"]},
	{"prompt": "Welches Wort ist ein Verb?", "answer": "driften", "options": ["driften", "Kurve", "rot"]},
	{"prompt": "5 x 6 = ?", "answer": "30", "options": ["25", "30", "35"]},
	{"prompt": "Bilde das Kompositum: Renn + Strecke", "answer": "Rennstrecke", "options": ["Rennstrecke", "Streckenrenn", "Rennlicht"]}
]

var font
var rng := RandomNumberGenerator.new()
var path := []
var player := {}
var rivals := []
var item_boxes := []
var hazards := []
var rockets := []
var particles := []
var floaters := []
var learn_gates := []
var camera := Vector2.ZERO
var touch_axis := Vector2.ZERO
var touch_pointer := -1
var touch_buttons := {}
var mode := "Normal"
var phase := "race"
var lap := 1
var checkpoint := 0
var race_time := 0.0
var best_lap := 0.0
var lap_time := 0.0
var score := 0
var combo := 0
var item_slot := "none"
var question_index := 0
var message := ""
var message_timer := 0.0
var shake := 0.0
var stats := {}

func _ready() -> void:
	rng.seed = 73241
	font = get_theme_default_font()
	mouse_filter = Control.MOUSE_FILTER_STOP
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	reset_game()

func reset_game() -> void:
	build_path()
	player = {
		"pos": path[0] + Vector2(-24, 20),
		"angle": track_angle(0),
		"speed": 0.0,
		"drift": 0.0,
		"boost": 0.0,
		"shield": 0.0,
		"spin": 0.0,
		"coins": 0
	}
	rivals.clear()
	for i in range(5):
		rivals.append({"progress": -0.03 * float(i + 1), "speed": 0.21 + float(i) * 0.012, "lane": -0.8 + float(i % 3) * 0.8, "pos": path[0], "angle": 0.0, "color": Color.from_hsv(0.02 + float(i) * 0.12, 0.75, 0.95)})
	item_boxes.clear()
	hazards.clear()
	rockets.clear()
	particles.clear()
	floaters.clear()
	touch_axis = Vector2.ZERO
	touch_pointer = -1
	mode = "Normal"
	phase = "race"
	lap = 1
	checkpoint = 0
	race_time = 0.0
	best_lap = 0.0
	lap_time = 0.0
	score = 0
	combo = 0
	item_slot = "none"
	question_index = 0
	stats = {"drifts": 0, "items": 0, "learn": 0, "rockets": 0, "coins": 0, "laps": 0}
	build_item_boxes()
	build_learn_gates()
	message = "FASKA KART - Godot 4"
	message_timer = 2.4
	shake = 0.0

func build_path() -> void:
	path = [
		Vector2(520, 1120), Vector2(790, 790), Vector2(1150, 500), Vector2(1650, 390),
		Vector2(2130, 570), Vector2(2290, 920), Vector2(2090, 1280), Vector2(1570, 1390),
		Vector2(1030, 1330), Vector2(620, 1390), Vector2(300, 1280), Vector2(280, 930)
	]

func build_item_boxes() -> void:
	for i in range(path.size()):
		if i % 2 == 0:
			var p := sample_track((float(i) + 0.45) / float(path.size()))
			item_boxes.append({"pos": p + track_normal(i) * 48.0, "ready": true, "timer": 0.0})
			item_boxes.append({"pos": p - track_normal(i) * 48.0, "ready": true, "timer": 0.0})

func build_learn_gates() -> void:
	learn_gates.clear()
	var task = LEARN_TASKS[question_index % LEARN_TASKS.size()]
	var gate_progress := 0.18 + float(question_index % 4) * 0.18
	var center := sample_track(gate_progress)
	var normal := track_normal(int(gate_progress * path.size()))
	for i in range(3):
		var lane := -1.0 + float(i)
		learn_gates.append({"pos": center + normal * lane * 92.0, "label": String(task.options[i]), "answer": String(task.answer), "active": true})

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()
	if phase == "race":
		update_race(delta)
	update_effects(delta)
	queue_redraw()

func update_race(delta: float) -> void:
	race_time += delta
	lap_time += delta
	update_player(delta)
	update_rivals(delta)
	update_items(delta)
	update_rockets(delta)
	update_hazards(delta)
	if mode == "Learncade":
		update_learn_gates()
	camera = (Vector2(player.pos) - size * 0.5).clamp(Vector2.ZERO, Vector2(max(0.0, WORLD_W - size.x), max(0.0, WORLD_H - size.y)))
	if lap > TOTAL_LAPS:
		phase = "finish"
		score += 2500
		message = "Finish! Zeit " + format_time(race_time)
		message_timer = 99.0

func update_player(delta: float) -> void:
	var steer_input := 0.0
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		steer_input -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		steer_input += 1.0
	if abs(touch_axis.x) > 0.08:
		steer_input += touch_axis.x
	steer_input = clamp(steer_input, -1.0, 1.0)
	var throttle := Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP) or touch_axis.y < -0.18
	var brake := Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN)
	var drifting := Input.is_key_pressed(KEY_SPACE)
	var speed: float = float(player.speed)
	if throttle:
		speed += ACCEL * delta
	elif brake:
		speed -= BRAKE * delta
	else:
		speed -= sign(speed) * DRAG * delta
	if float(player.boost) > 0.0:
		speed += 620.0 * delta
		player.boost = max(0.0, float(player.boost) - delta)
	speed = clamp(speed, -180.0, MAX_SPEED + (220.0 if float(player.boost) > 0.0 else 0.0))
	var grip := track_grip(Vector2(player.pos))
	var steer_power: float = STEER * (0.35 + min(abs(speed) / MAX_SPEED, 1.0) * 0.85)
	player.angle = float(player.angle) + steer_input * steer_power * delta * (1.35 if drifting else 1.0)
	if drifting and abs(steer_input) > 0.2 and abs(speed) > 260.0:
		player.drift = min(1.0, float(player.drift) + delta * 0.72)
		spawn_tire_smoke()
	else:
		if float(player.drift) > 0.68:
			player.boost = max(float(player.boost), 1.25)
			stats.drifts += 1
			score += 280
			add_text("MINI TURBO", Vector2(player.pos), Color(0.35, 0.9, 1.0))
		player.drift = max(0.0, float(player.drift) - delta * 2.4)
	if grip < 0.65:
		speed *= 1.0 - delta * 0.42
	var dir := Vector2(cos(float(player.angle)), sin(float(player.angle)))
	var slip: Vector2 = Vector2(-dir.y, dir.x) * steer_input * abs(speed) * (0.1 + float(player.drift) * 0.36)
	player.pos = Vector2(player.pos) + (dir * speed + slip) * delta * grip
	player.pos = Vector2(clamp(Vector2(player.pos).x, 40.0, WORLD_W - 40.0), clamp(Vector2(player.pos).y, 40.0, WORLD_H - 40.0))
	player.speed = speed
	player.spin = max(0.0, float(player.spin) - delta)
	player.shield = max(0.0, float(player.shield) - delta)
	update_checkpoint()

func update_checkpoint() -> void:
	var target: Vector2 = path[checkpoint % path.size()]
	if Vector2(player.pos).distance_to(target) < 145.0:
		checkpoint += 1
		combo += 1
		score += 90 + combo * 10
		if checkpoint >= path.size():
			checkpoint = 0
			lap += 1
			stats.laps += 1
			if best_lap <= 0.0 or lap_time < best_lap:
				best_lap = lap_time
			lap_time = 0.0
			add_text("LAP " + str(lap), Vector2(player.pos), Color(1.0, 0.86, 0.25))

func update_rivals(delta: float) -> void:
	for i in range(rivals.size()):
		var r = rivals[i]
		r.progress = fposmod(float(r.progress) + float(r.speed) * delta, 1.0)
		var base := sample_track(float(r.progress))
		var normal := sample_normal(float(r.progress))
		r.pos = base + normal * float(r.lane) * 76.0
		r.angle = sample_angle(float(r.progress))
		if Vector2(player.pos).distance_to(Vector2(r.pos)) < 54.0:
			player.speed = float(player.speed) * 0.72
			shake = 0.7
			add_text("BUMP", Vector2(player.pos), Color(1.0, 0.36, 0.25))
		rivals[i] = r

func update_items(delta: float) -> void:
	for i in range(item_boxes.size()):
		var box = item_boxes[i]
		if not bool(box.ready):
			box.timer = float(box.timer) - delta
			if float(box.timer) <= 0.0:
				box.ready = true
		elif Vector2(player.pos).distance_to(Vector2(box.pos)) < 44.0:
			box.ready = false
			box.timer = 9.0
			give_item()
		item_boxes[i] = box

func give_item() -> void:
	var options = ["boost", "rocket", "shield", "oil"]
	item_slot = options[rng.randi_range(0, options.size() - 1)]
	score += 120
	stats.items = int(stats.items) + 1
	add_text(String(item_slot).to_upper(), Vector2(player.pos), Color(1.0, 0.88, 0.28))

func use_item() -> void:
	if item_slot == "none":
		return
	if item_slot == "boost":
		player.boost = max(float(player.boost), 2.0)
	elif item_slot == "shield":
		player.shield = 4.0
	elif item_slot == "oil":
		var back := Vector2(cos(float(player.angle)), sin(float(player.angle))) * -72.0
		hazards.append({"pos": Vector2(player.pos) + back, "life": 14.0})
	elif item_slot == "rocket":
		var dir := Vector2(cos(float(player.angle)), sin(float(player.angle)))
		rockets.append({"pos": Vector2(player.pos) + dir * 40.0, "vel": dir * 980.0, "life": 1.8})
		stats.rockets = int(stats.rockets) + 1
	item_slot = "none"

func update_rockets(delta: float) -> void:
	for i in range(rockets.size() - 1, -1, -1):
		var rocket = rockets[i]
		rocket.pos = Vector2(rocket.pos) + Vector2(rocket.vel) * delta
		rocket.life = float(rocket.life) - delta
		var hit := false
		for r_i in range(rivals.size()):
			var rival = rivals[r_i]
			if Vector2(rocket.pos).distance_to(Vector2(rival.pos)) < 42.0:
				rival.progress = fposmod(float(rival.progress) - 0.035, 1.0)
				rivals[r_i] = rival
				score += 360
				add_text("ROCKET HIT", Vector2(rival.pos), Color(1.0, 0.55, 0.18))
				spawn_sparks(Vector2(rival.pos), Color(1.0, 0.5, 0.12), 16)
				hit = true
		if hit or float(rocket.life) <= 0.0:
			rockets.remove_at(i)
		else:
			rockets[i] = rocket

func update_hazards(delta: float) -> void:
	for i in range(hazards.size() - 1, -1, -1):
		var hazard = hazards[i]
		hazard.life = float(hazard.life) - delta
		if Vector2(player.pos).distance_to(Vector2(hazard.pos)) < 42.0 and float(player.shield) <= 0.0:
			player.spin = 0.8
			player.speed = float(player.speed) * 0.45
			shake = 1.0
		if float(hazard.life) <= 0.0:
			hazards.remove_at(i)
		else:
			hazards[i] = hazard

func update_learn_gates() -> void:
	for gate in learn_gates:
		if bool(gate.active) and Vector2(player.pos).distance_to(Vector2(gate.pos)) < 54.0:
			if String(gate.label) == String(gate.answer):
				score += 650
				stats.learn = int(stats.learn) + 1
				player.boost = max(float(player.boost), 1.4)
				add_text("RICHTIG", Vector2(gate.pos), Color(0.35, 1.0, 0.55))
			else:
				player.speed = float(player.speed) * 0.45
				combo = 0
				add_text("FALSCH", Vector2(gate.pos), Color(1.0, 0.22, 0.2))
			question_index += 1
			build_learn_gates()
			return

func toggle_learncade() -> void:
	mode = "Learncade" if mode == "Normal" else "Normal"
	message = "Learncade: fahre durch die richtige Antwort." if mode == "Learncade" else "Normalmodus aktiv."
	message_timer = 2.4
	if mode == "Learncade":
		build_learn_gates()

func track_grip(pos: Vector2) -> float:
	var d: float = distance_to_track(pos)
	if d < TRACK_WIDTH * 0.5:
		return 1.0
	if d < TRACK_WIDTH * 0.72:
		return 0.74
	return 0.48

func distance_to_track(pos: Vector2) -> float:
	var best := 999999.0
	for i in range(path.size()):
		var a: Vector2 = path[i]
		var b: Vector2 = path[(i + 1) % path.size()]
		var ab := b - a
		var t: float = clamp((pos - a).dot(ab) / max(1.0, ab.length_squared()), 0.0, 1.0)
		var closest: Vector2 = a + ab * t
		best = min(best, closest.distance_to(pos))
	return best

func sample_track(progress: float) -> Vector2:
	var total := float(path.size())
	var f := fposmod(progress, 1.0) * total
	var i := int(floor(f)) % path.size()
	var t: float = f - floor(f)
	return path[i].lerp(path[(i + 1) % path.size()], t)

func sample_angle(progress: float) -> float:
	var total := float(path.size())
	var i := int(floor(fposmod(progress, 1.0) * total)) % path.size()
	return track_angle(i)

func sample_normal(progress: float) -> Vector2:
	var total := float(path.size())
	var i := int(floor(fposmod(progress, 1.0) * total)) % path.size()
	return track_normal(i)

func track_angle(index: int) -> float:
	var a: Vector2 = path[index % path.size()]
	var b: Vector2 = path[(index + 1) % path.size()]
	return (b - a).angle()

func track_normal(index: int) -> Vector2:
	var angle := track_angle(index)
	return Vector2(-sin(angle), cos(angle))

func _unhandled_input(event) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		match event.keycode:
			KEY_R:
				reset_game()
			KEY_L:
				toggle_learncade()
			KEY_SHIFT, KEY_E, KEY_Q:
				use_item()

func _gui_input(event) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			handle_touch_press(event.index, event.position)
		else:
			if event.index == touch_pointer:
				touch_pointer = -1
				touch_axis = Vector2.ZERO
	elif event is InputEventScreenDrag:
		if event.index == touch_pointer:
			var origin := Vector2(100, size.y - 100)
			touch_axis = (event.position - origin) / 76.0
			if touch_axis.length() > 1.0:
				touch_axis = touch_axis.normalized()
	elif event is InputEventMouseButton and event.pressed:
		handle_touch_press(999, event.position)

func handle_touch_press(pointer_id: int, pos: Vector2) -> void:
	if pos.x < size.x * 0.42 and pos.y > size.y * 0.56:
		touch_pointer = pointer_id
		var origin := Vector2(100, size.y - 100)
		touch_axis = (pos - origin) / 76.0
		if touch_axis.length() > 1.0:
			touch_axis = touch_axis.normalized()
		return
	for name in touch_buttons.keys():
		if touch_buttons[name].has_point(pos):
			if name == "item":
				use_item()
			elif name == "learn":
				toggle_learncade()

func world_to_screen(pos: Vector2) -> Vector2:
	var offset := Vector2.ZERO
	if shake > 0.0:
		offset = Vector2(rng.randf_range(-shake, shake), rng.randf_range(-shake, shake)) * 7.0
	return pos - camera + offset

func _draw() -> void:
	draw_background()
	draw_track()
	draw_objects()
	draw_karts()
	draw_effects()
	draw_hud()
	draw_touch_controls()
	draw_messages()

func draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color(0.045, 0.12, 0.09))
	for i in range(30):
		var x := fmod(float(i) * 96.0 - fmod(camera.x, 96.0), size.x + 100.0) - 50.0
		draw_line(Vector2(x, 0), Vector2(x - 80, size.y), Color(0.08, 0.2, 0.13, 0.22), 1.0)

func draw_track() -> void:
	var pts := PackedVector2Array()
	for p in path:
		pts.append(world_to_screen(p))
	pts.append(world_to_screen(path[0]))
	draw_polyline(pts, Color(0.22, 0.22, 0.24), TRACK_WIDTH)
	draw_polyline(pts, Color(0.58, 0.34, 0.2), TRACK_WIDTH + 24.0)
	draw_polyline(pts, Color(0.26, 0.27, 0.3), TRACK_WIDTH - 24.0)
	draw_polyline(pts, Color(0.95, 0.85, 0.32, 0.82), 5.0)
	for i in range(path.size()):
		var p := world_to_screen(path[i])
		draw_circle(p, 13.0, Color(0.95, 0.85, 0.32))
		if i == checkpoint:
			draw_arc(p, 38.0, 0.0, TAU, 32, Color(0.2, 0.85, 1.0), 4.0)

func draw_objects() -> void:
	for box in item_boxes:
		if bool(box.ready):
			var p := world_to_screen(Vector2(box.pos))
			draw_rect(Rect2(p - Vector2(18, 18), Vector2(36, 36)), Color(0.25, 0.55, 1.0, 0.75))
			draw_rect(Rect2(p - Vector2(18, 18), Vector2(36, 36)), Color.WHITE, false, 2.0)
			draw_text_at(p + Vector2(-5, 6), "?")
	for hazard in hazards:
		var hp := world_to_screen(Vector2(hazard.pos))
		draw_circle(hp, 31.0, Color(0.02, 0.02, 0.025, 0.82))
		draw_arc(hp, 31.0, 0.0, TAU, 28, Color(0.95, 0.75, 0.18, 0.6), 2.0)
	if mode == "Learncade":
		var task = LEARN_TASKS[question_index % LEARN_TASKS.size()]
		draw_text_at(Vector2(size.x * 0.34, 34), String(task.prompt), Color(0.8, 0.95, 1.0), 16)
		for gate in learn_gates:
			var gp := world_to_screen(Vector2(gate.pos))
			draw_circle(gp, 48.0, Color(0.12, 0.28, 0.65, 0.56))
			draw_arc(gp, 52.0, 0.0, TAU, 34, Color(0.55, 0.82, 1.0), 4.0)
			draw_text_at(gp + Vector2(-32, 5), String(gate.label), Color.WHITE, 13)

func draw_karts() -> void:
	for rival in rivals:
		draw_car(Vector2(rival.pos), float(rival.angle), rival.color, "R")
	draw_car(Vector2(player.pos), float(player.angle), Color(1.0, 0.86, 0.16), "YOU")

func draw_car(pos: Vector2, angle: float, color: Color, label: String) -> void:
	var p := world_to_screen(pos)
	var dir := Vector2(cos(angle), sin(angle))
	var side := dir.orthogonal()
	var pts := PackedVector2Array([p + dir * 30.0, p - dir * 28.0 + side * 18.0, p - dir * 20.0 - side * 18.0])
	draw_colored_polygon(pts, color)
	draw_polyline(PackedVector2Array([pts[0], pts[1], pts[2], pts[0]]), Color.WHITE, 2.0)
	draw_text_at(p + Vector2(-16, -24), label, Color.WHITE, 11)
	if label == "YOU" and float(player.drift) > 0.05:
		draw_arc(p, 42.0, 0.0, TAU * float(player.drift), 36, Color(0.22, 0.85, 1.0), 4.0)

func draw_effects() -> void:
	for rocket in rockets:
		var p := world_to_screen(Vector2(rocket.pos))
		draw_circle(p, 8.0, Color(1.0, 0.45, 0.12))
	for part in particles:
		draw_circle(world_to_screen(Vector2(part.pos)), float(part.size), part.color)

func draw_hud() -> void:
	draw_rect(Rect2(Vector2(10, 10), Vector2(340, 124)), Color(0.0, 0.0, 0.0, 0.6))
	draw_text_at(Vector2(20, 31), "FASKA KART - GODOT 4", Color(1.0, 0.9, 0.25), 18)
	draw_text_at(Vector2(20, 56), "Lap " + str(min(lap, TOTAL_LAPS)) + "/" + str(TOTAL_LAPS) + "  CP " + str(checkpoint + 1) + "/" + str(path.size()), Color(0.9, 0.96, 1.0), 14)
	draw_bar(Vector2(20, 76), "SPEED", abs(float(player.speed)), MAX_SPEED + 220.0, Color(0.34, 0.85, 1.0))
	draw_bar(Vector2(20, 98), "DRIFT", float(player.drift), 1.0, Color(1.0, 0.65, 0.18))
	draw_text_at(Vector2(20, 124), "Score " + str(score) + "  Mode " + mode + "  Time " + format_time(race_time), Color(0.86, 0.92, 1.0), 13)
	draw_rect(Rect2(Vector2(size.x - 270, 10), Vector2(256, 86)), Color(0.0, 0.0, 0.0, 0.56))
	draw_text_at(Vector2(size.x - 258, 32), "Item " + String(item_slot).to_upper(), Color(0.94, 0.98, 1.0), 15)
	draw_text_at(Vector2(size.x - 258, 55), "Coins " + str(player.coins) + "  Mini " + str(stats.drifts), Color(0.94, 0.98, 1.0), 14)
	draw_text_at(Vector2(size.x - 258, 78), "Learn " + str(stats.learn) + "  Rockets " + str(stats.rockets), Color(0.94, 0.98, 1.0), 14)

func draw_bar(pos: Vector2, label: String, value: float, max_value: float, color: Color) -> void:
	draw_text_at(pos, label, Color(0.76, 0.84, 0.92), 12)
	draw_rect(Rect2(pos + Vector2(72, -10), Vector2(170, 8)), Color(0.08, 0.08, 0.1))
	draw_rect(Rect2(pos + Vector2(72, -10), Vector2(170 * clamp(value / max_value, 0.0, 1.0), 8)), color)

func draw_touch_controls() -> void:
	touch_buttons.clear()
	var origin := Vector2(100, size.y - 100)
	draw_arc(origin, 66.0, 0.0, TAU, 36, Color(0.6, 0.82, 1.0, 0.32), 3.0)
	draw_circle(origin + touch_axis * 44.0, 23.0, Color(0.32, 0.75, 1.0, 0.42))
	var buttons = [
		["item", "ITEM", Vector2(size.x - 96, size.y - 96)],
		["learn", "LERN", Vector2(size.x - 182, size.y - 96)]
	]
	for item in buttons:
		var rect := Rect2(item[2] - Vector2(36, 24), Vector2(72, 48))
		touch_buttons[item[0]] = rect
		draw_rect(rect, Color(0.02, 0.07, 0.13, 0.72))
		draw_rect(rect, Color(0.55, 0.78, 1.0, 0.55), false, 2.0)
		draw_text_at(rect.position + Vector2(10, 31), item[1], Color(0.94, 0.98, 1.0), 12)

func draw_messages() -> void:
	if message_timer > 0.0:
		draw_rect(Rect2(Vector2(size.x * 0.32, 12), Vector2(size.x * 0.36, 30)), Color(0.0, 0.0, 0.0, 0.62))
		draw_text_at(Vector2(size.x * 0.33, 33), message, Color(0.95, 0.98, 1.0), 14)
	for text in floaters:
		draw_text_at(world_to_screen(Vector2(text.pos)), String(text.text), text.color, 16)
	if phase == "finish":
		draw_rect(Rect2(Vector2(size.x * 0.26, size.y * 0.38), Vector2(size.x * 0.48, 110)), Color(0.0, 0.0, 0.0, 0.78))
		draw_text_at(Vector2(size.x * 0.39, size.y * 0.44), "FINISH", Color(1.0, 0.9, 0.24), 30)
		draw_text_at(Vector2(size.x * 0.35, size.y * 0.49), "Score " + str(score) + " - R fuer Neustart", Color(0.9, 0.96, 1.0), 16)

func update_effects(delta: float) -> void:
	message_timer = max(0.0, message_timer - delta)
	shake = max(0.0, shake - delta * 7.0)
	for i in range(particles.size() - 1, -1, -1):
		var p = particles[i]
		p.life = float(p.life) - delta
		p.pos = Vector2(p.pos) + Vector2(p.vel) * delta
		p.size = max(0.0, float(p.size) - delta * 8.0)
		p.color.a = clamp(float(p.life), 0.0, 1.0)
		if float(p.life) <= 0.0:
			particles.remove_at(i)
		else:
			particles[i] = p
	for i in range(floaters.size() - 1, -1, -1):
		var f = floaters[i]
		f.life = float(f.life) - delta
		f.pos = Vector2(f.pos) + Vector2(0, -34) * delta
		f.color.a = clamp(float(f.life), 0.0, 1.0)
		if float(f.life) <= 0.0:
			floaters.remove_at(i)
		else:
			floaters[i] = f

func spawn_tire_smoke() -> void:
	if rng.randf() > 0.42:
		return
	var back := Vector2(cos(float(player.angle)), sin(float(player.angle))) * -30.0
	particles.append({"pos": Vector2(player.pos) + back, "vel": Vector2(rng.randf_range(-45, 45), rng.randf_range(-45, 45)), "life": 0.45, "size": 6.0, "color": Color(0.85, 0.9, 0.95, 0.45)})

func spawn_sparks(pos: Vector2, color: Color, count := 9) -> void:
	for i in range(count):
		particles.append({"pos": pos, "vel": Vector2(rng.randf_range(-150, 150), rng.randf_range(-150, 150)), "life": rng.randf_range(0.22, 0.7), "size": rng.randf_range(2.0, 5.5), "color": color})

func add_text(text: String, pos: Vector2, color: Color) -> void:
	floaters.append({"text": text, "pos": pos, "life": 1.25, "color": color})

func draw_text_at(pos: Vector2, text: String, color: Color = Color.WHITE, font_size: int = 14) -> void:
	draw_string(font, pos, text, HORIZONTAL_ALIGNMENT_LEFT, -1.0, font_size, color)

func format_time(time: float) -> String:
	var minutes := int(time) / 60
	var seconds := int(time) % 60
	var centis := int(time * 100.0) % 100
	return str(minutes) + ":" + str(seconds).pad_zeros(2) + "." + str(centis).pad_zeros(2)
