extends Control

const VIEW_SIZE := Vector2(1280.0, 1280.0)
const WORLD_SIZE := Vector2(2800.0, 1900.0)
const MAX_DAMAGE := 6
const LESSONS := ["WORTART", "SATZ", "ORT", "MATHE", "ENGLISCH"]
const ROAD_SPACING_X := 320.0
const ROAD_SPACING_Y := 235.0
const ROAD_OFFSET_Y := 250.0
const ROAD_HALF_WIDTH := 34.0

const WORD_TASKS := [
	{"word": "Hund", "kind": "Nomen", "role": "WER", "place": "Park", "sentence": "Der __ bellt laut.", "clue": "ein Tier im Park"},
	{"word": "Schule", "kind": "Nomen", "role": "WER", "place": "Schule", "sentence": "Die __ beginnt um acht.", "clue": "ein Ort zum Lernen"},
	{"word": "Bibliothek", "kind": "Nomen", "role": "WER", "place": "Bibliothek", "sentence": "Die __ ist heute offen.", "clue": "ein Ort mit vielen Buechern"},
	{"word": "rennt", "kind": "Verb", "role": "TUT", "place": "Park", "sentence": "Lina __ zum Tor.", "clue": "schnell laufen"},
	{"word": "liest", "kind": "Verb", "role": "TUT", "place": "Bibliothek", "sentence": "Omar __ ein Buch.", "clue": "mit den Augen ein Wort erkennen"},
	{"word": "rechnet", "kind": "Verb", "role": "TUT", "place": "Schule", "sentence": "Mira __ die Aufgabe.", "clue": "Mathe machen"},
	{"word": "gelb", "kind": "Adjektiv", "role": "WIE", "place": "Bahnhof", "sentence": "Das __ Taxi hupt.", "clue": "eine Farbe"},
	{"word": "schnell", "kind": "Adjektiv", "role": "WIE", "place": "Bahnhof", "sentence": "Das Taxi faehrt __.", "clue": "nicht langsam"},
	{"word": "leise", "kind": "Adjektiv", "role": "WIE", "place": "Bibliothek", "sentence": "Im Lesesaal ist es __.", "clue": "nicht laut"},
	{"word": "unter", "kind": "Praeposition", "role": "WO", "place": "Park", "sentence": "Der Ball liegt __ der Bank.", "clue": "wo etwas liegt"},
	{"word": "neben", "kind": "Praeposition", "role": "WO", "place": "Schule", "sentence": "Die Tasche steht __ dem Stuhl.", "clue": "an der Seite"},
	{"word": "weil", "kind": "Konjunktion", "role": "BIND", "place": "Schule", "sentence": "Wir lernen, __ es hilft.", "clue": "verbindet einen Grund"},
	{"word": "und", "kind": "Konjunktion", "role": "BIND", "place": "Park", "sentence": "Luna __ Bruno fahren mit.", "clue": "verbindet zwei Dinge"},
]

const MATH_TASKS := [
	{"word": "8 + 7", "answer": "15", "clue": "Plusaufgabe"},
	{"word": "24 - 9", "answer": "15", "clue": "Minusaufgabe"},
	{"word": "6 x 4", "answer": "24", "clue": "Malaufgabe"},
	{"word": "36 : 6", "answer": "6", "clue": "Geteiltaufgabe"},
	{"word": "11 + 9", "answer": "20", "clue": "Plusaufgabe"},
	{"word": "5 x 5", "answer": "25", "clue": "Malaufgabe"},
	{"word": "40 - 23", "answer": "17", "clue": "Minusaufgabe"},
]

const ENGLISH_TASKS := [
	{"word": "Apfel", "answer": "apple", "clue": "Obst"},
	{"word": "Schule", "answer": "school", "clue": "Ort zum Lernen"},
	{"word": "rennen", "answer": "run", "clue": "schnell laufen"},
	{"word": "gelb", "answer": "yellow", "clue": "Farbe"},
	{"word": "Haus", "answer": "house", "clue": "Gebaeude"},
	{"word": "lesen", "answer": "read", "clue": "Wort erkennen"},
]

class TouchDriveOverlay:
	extends Control

	var move_vector := Vector2.ZERO
	var buttons := {
		"gas": false,
		"brake": false,
		"drift": false,
		"boost": false,
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
		elif event is InputEventScreenDrag:
			if event.index == active_move:
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

	func _should_show() -> bool:
		var screen := get_viewport_rect().size
		return screen.x <= 1100.0 or screen.x < screen.y

	func _stick_center() -> Vector2:
		var screen := get_viewport_rect().size
		return Vector2(112.0, screen.y - 116.0)

	func _button_centers() -> Dictionary:
		var screen := get_viewport_rect().size
		return {
			"gas": Vector2(screen.x - 96.0, screen.y - 150.0),
			"brake": Vector2(screen.x - 96.0, screen.y - 58.0),
			"drift": Vector2(screen.x - 188.0, screen.y - 58.0),
			"boost": Vector2(screen.x - 188.0, screen.y - 150.0),
		}

	func _is_on_stick(pos: Vector2) -> bool:
		return pos.distance_to(_stick_center()) <= 92.0

	func _button_at(pos: Vector2) -> String:
		for name in _button_centers().keys():
			if pos.distance_to(_button_centers()[name]) <= 44.0:
				return name
		return ""

	func _update_stick(pos: Vector2) -> void:
		var raw := pos - _stick_center()
		move_vector = raw.limit_length(58.0) / 58.0
		queue_redraw()

	func _draw() -> void:
		if not _should_show():
			return
		var font := get_theme_default_font()
		var center := _stick_center()
		draw_circle(center, 66.0, Color(0.02, 0.08, 0.13, 0.48))
		draw_arc(center, 66.0, 0.0, TAU, 48, Color(0.65, 0.86, 1.0, 0.48), 3.0)
		draw_circle(center + move_vector * 44.0, 28.0, Color(0.25, 0.85, 1.0, 0.88))
		var labels := {
			"gas": ["GO", "GAS"],
			"brake": ["BRK", "STOP"],
			"drift": ["DRF", "DRIFT"],
			"boost": ["BST", "BOOST"],
		}
		for name in _button_centers().keys():
			var button_center: Vector2 = _button_centers()[name]
			var fill := Color(0.04, 0.08, 0.17, 0.74)
			if is_down(name):
				fill = Color(0.18, 0.56, 0.95, 0.92)
			draw_circle(button_center, 40.0, fill)
			draw_arc(button_center, 40.0, 0.0, TAU, 48, Color(0.79, 0.91, 1.0, 0.62), 2.0)
			draw_string(font, button_center + Vector2(-24.0, -8.0), labels[name][0], HORIZONTAL_ALIGNMENT_CENTER, 48.0, 14, Color.WHITE)
			draw_string(font, button_center + Vector2(-32.0, 13.0), labels[name][1], HORIZONTAL_ALIGNMENT_CENTER, 64.0, 8, Color(0.82, 0.92, 1.0))

var car_pos := Vector2(360.0, 960.0)
var car_angle := -0.2
var velocity := Vector2.ZERO
var boost := 100.0
var drift := 0.0
var fare_timer := 66.0
var score := 0
var streak := 0
var near_miss_chain := 0
var near_miss_total := 0
var combo_timer := 0.0
var damage := 0
var deliveries := 0
var learn_hits := 0
var mistakes := 0
var mode_learn := false
var lesson_index := 0
var passenger_onboard := false
var current_task: Dictionary = {}
var passenger_pos := Vector2.ZERO
var destination: Dictionary = {}
var repeat_queue := []
var traffic := []
var pickups := []
var route_gates := []
var message := "FASKA Taxi: Fahrgaeste aufnehmen, driften, sauber abliefern."
var message_timer := 4.0
var camera := Vector2.ZERO
var crash_cooldown := 0.0
var offroad_timer := 0.0
var elapsed := 0.0
var touch_overlay: TouchDriveOverlay

func _ready() -> void:
	randomize()
	mouse_filter = Control.MOUSE_FILTER_STOP
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	touch_overlay = TouchDriveOverlay.new()
	add_child(touch_overlay)
	reset_game()

func reset_game() -> void:
	car_pos = Vector2(360.0, 960.0)
	car_angle = -0.2
	velocity = Vector2.ZERO
	boost = 100.0
	drift = 0.0
	score = 0
	streak = 0
	near_miss_chain = 0
	near_miss_total = 0
	combo_timer = 0.0
	damage = 0
	crash_cooldown = 0.0
	offroad_timer = 0.0
	deliveries = 0
	learn_hits = 0
	mistakes = 0
	passenger_onboard = false
	route_gates.clear()
	spawn_passenger()
	spawn_traffic()
	spawn_pickups()
	message = "Normal: Fahrgast aufnehmen und schnell zum Ziel bringen. L startet Learncade."
	message_timer = 4.0

func spawn_passenger() -> void:
	current_task = _next_task()
	passenger_onboard = false
	passenger_pos = random_road_point(190.0)
	destination = _destination_for_task(current_task)
	build_route_gates(passenger_pos)
	fare_timer = 66.0

func _next_task() -> Dictionary:
	var lesson: String = String(LESSONS[lesson_index]) if mode_learn else "NORMAL"
	if mode_learn:
		for i in range(repeat_queue.size()):
			var item: Dictionary = repeat_queue[i]
			if item.get("lesson", "") == lesson:
				repeat_queue.remove_at(i)
				var repeated: Dictionary = item["task"].duplicate(true)
				repeated["repeat"] = true
				return repeated
	var pool := _task_pool_for_lesson()
	var task: Dictionary = pool[int(randi() % pool.size())].duplicate(true)
	task["repeat"] = false
	return task

func _task_pool_for_lesson() -> Array:
	if not mode_learn:
		return WORD_TASKS
	match LESSONS[lesson_index]:
		"MATHE":
			return MATH_TASKS
		"ENGLISCH":
			return ENGLISH_TASKS
		_:
			return WORD_TASKS

func normal_destinations() -> Array:
	return [
		{"label": "Bahnhof", "pos": Vector2(320.0, 250.0), "color": Color.html("#38bdf8")},
		{"label": "Schule", "pos": Vector2(2240.0, 250.0), "color": Color.html("#facc15")},
		{"label": "Bibliothek", "pos": Vector2(320.0, 1660.0), "color": Color.html("#a78bfa")},
		{"label": "Park", "pos": Vector2(2240.0, 1425.0), "color": Color.html("#22c55e")},
	]

func word_kind_destinations() -> Array:
	return [
		{"label": "Nomen", "pos": Vector2(320.0, 250.0), "color": Color.html("#38bdf8")},
		{"label": "Verb", "pos": Vector2(2240.0, 250.0), "color": Color.html("#facc15")},
		{"label": "Adjektiv", "pos": Vector2(320.0, 1660.0), "color": Color.html("#a78bfa")},
		{"label": "Praeposition", "pos": Vector2(2240.0, 1425.0), "color": Color.html("#22c55e")},
		{"label": "Konjunktion", "pos": Vector2(1280.0, 955.0), "color": Color.html("#fb923c")},
	]

func sentence_destinations() -> Array:
	return [
		{"label": "Wer/Was", "role": "WER", "pos": Vector2(320.0, 250.0), "color": Color.html("#38bdf8")},
		{"label": "Tut was", "role": "TUT", "pos": Vector2(2240.0, 250.0), "color": Color.html("#facc15")},
		{"label": "Wie/Wo", "role": "WIE", "pos": Vector2(320.0, 1660.0), "color": Color.html("#a78bfa")},
		{"label": "Lagewort", "role": "WO", "pos": Vector2(2240.0, 1425.0), "color": Color.html("#22c55e")},
		{"label": "Bindewort", "role": "BIND", "pos": Vector2(1280.0, 955.0), "color": Color.html("#fb923c")},
	]

func reading_destinations() -> Array:
	return normal_destinations()

func math_destinations() -> Array:
	return [
		{"label": "6", "pos": Vector2(320.0, 250.0), "color": Color.html("#38bdf8")},
		{"label": "15", "pos": Vector2(2240.0, 250.0), "color": Color.html("#facc15")},
		{"label": "17", "pos": Vector2(320.0, 1660.0), "color": Color.html("#a78bfa")},
		{"label": "20", "pos": Vector2(2240.0, 1425.0), "color": Color.html("#22c55e")},
		{"label": "24", "pos": Vector2(1280.0, 955.0), "color": Color.html("#fb923c")},
		{"label": "25", "pos": Vector2(1280.0, 250.0), "color": Color.html("#f472b6")},
	]

func english_destinations() -> Array:
	return [
		{"label": "apple", "pos": Vector2(320.0, 250.0), "color": Color.html("#38bdf8")},
		{"label": "school", "pos": Vector2(2240.0, 250.0), "color": Color.html("#facc15")},
		{"label": "run", "pos": Vector2(320.0, 1660.0), "color": Color.html("#a78bfa")},
		{"label": "yellow", "pos": Vector2(2240.0, 1425.0), "color": Color.html("#22c55e")},
		{"label": "house", "pos": Vector2(1280.0, 955.0), "color": Color.html("#fb923c")},
		{"label": "read", "pos": Vector2(1280.0, 250.0), "color": Color.html("#f472b6")},
	]

func active_destinations() -> Array:
	if not mode_learn:
		return normal_destinations()
	match LESSONS[lesson_index]:
		"WORTART":
			return word_kind_destinations()
		"SATZ":
			return sentence_destinations()
		"MATHE":
			return math_destinations()
		"ENGLISCH":
			return english_destinations()
		_:
			return reading_destinations()

func _destination_for_task(task: Dictionary) -> Dictionary:
	if not mode_learn:
		var destinations := normal_destinations()
		return destinations[int(randi() % destinations.size())]
	match LESSONS[lesson_index]:
		"WORTART":
			return _destination_by_label(word_kind_destinations(), task["kind"])
		"SATZ":
			return _destination_by_role(sentence_destinations(), task["role"])
		"MATHE":
			return _destination_by_label(math_destinations(), task["answer"])
		"ENGLISCH":
			return _destination_by_label(english_destinations(), task["answer"])
		_:
			return _destination_by_label(reading_destinations(), task["place"])

func _destination_by_label(destinations: Array, label: String) -> Dictionary:
	for dest in destinations:
		if dest["label"] == label:
			return dest
	return destinations[0]

func _destination_by_role(destinations: Array, role: String) -> Dictionary:
	for dest in destinations:
		if dest.has("role") and dest["role"] == role:
			return dest
	return destinations[0]

func spawn_traffic() -> void:
	traffic.clear()
	for i in range(22):
		var lane_y := ROAD_OFFSET_Y + float(i % 7) * ROAD_SPACING_Y
		var traffic_pos := Vector2(250.0 + randf() * (WORLD_SIZE.x - 500.0), lane_y)
		if traffic_pos.distance_to(car_pos) < 260.0:
			traffic_pos.x = fmod(traffic_pos.x + 680.0, WORLD_SIZE.x - 180.0) + 90.0
		traffic.append({
			"pos": traffic_pos,
			"dir": Vector2(1.0 if i % 2 == 0 else -1.0, 0.0),
			"speed": 76.0 + float(i % 5) * 20.0,
			"color": Color.html("#ef4444") if i % 3 == 0 else Color.html("#60a5fa"),
			"hit_cooldown": 0.0,
			"near_cooldown": 0.0,
		})

func spawn_pickups() -> void:
	pickups.clear()
	for i in range(18):
		pickups.append({
			"pos": random_road_point(180.0),
			"kind": "boost" if i % 2 == 0 else "coin",
			"collected": false,
		})

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_R:
			reset_game()
		elif event.keycode == KEY_L:
			mode_learn = not mode_learn
			spawn_passenger()
			message = _mode_message()
			message_timer = 3.0
		elif event.keycode == KEY_C:
			lesson_index = (lesson_index + 1) % LESSONS.size()
			if mode_learn:
				spawn_passenger()
			message = "Learncade-Fach: %s" % LESSONS[lesson_index]
			message_timer = 2.6

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()
	elapsed += delta
	combo_timer = maxf(0.0, combo_timer - delta)
	if combo_timer <= 0.0:
		near_miss_chain = 0
	update_car(delta)
	update_world(delta)
	update_objectives(delta)
	update_camera()
	message_timer = maxf(0.0, message_timer - delta)
	queue_redraw()

func update_car(delta: float) -> void:
	var throttle := 0.0
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		throttle += 1.0
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		throttle -= 0.55
	if touch_overlay:
		throttle += maxf(0.0, -touch_overlay.move_vector.y)
		throttle -= maxf(0.0, touch_overlay.move_vector.y) * 0.55
		if touch_overlay.is_down("gas"):
			throttle += 1.0
		if touch_overlay.is_down("brake"):
			throttle -= 0.72
	throttle = clampf(throttle, -0.85, 1.25)

	var steer := 0.0
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		steer -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		steer += 1.0
	if touch_overlay:
		steer += touch_overlay.move_vector.x
	steer = clampf(steer, -1.0, 1.0)

	var forward := Vector2(cos(car_angle), sin(car_angle))
	var speed := velocity.length()
	var handbrake := Input.is_key_pressed(KEY_SPACE) or (touch_overlay and touch_overlay.is_down("drift"))
	var boosting := (Input.is_key_pressed(KEY_SHIFT) or (touch_overlay and touch_overlay.is_down("boost"))) and boost > 2.0
	var grip := 4.2 if not handbrake else 1.24
	car_angle += steer * clampf(speed / 260.0, 0.16, 1.0) * (2.65 if handbrake else 1.72) * delta
	velocity += forward * throttle * (560.0 if boosting else 380.0) * delta
	velocity = velocity.move_toward(forward * velocity.dot(forward), grip * 200.0 * delta)
	velocity *= 0.992 if absf(throttle) > 0.01 else 0.975
	if speed > 540.0:
		velocity = velocity.normalized() * 540.0
	if boosting:
		boost = max(0.0, boost - 34.0 * delta)
	else:
		boost = min(100.0, boost + 10.5 * delta + drift * 0.08 * delta)
	drift = absf(steer) * maxf(0.0, velocity.length() - 175.0) if handbrake else maxf(0.0, drift - 125.0 * delta)
	car_pos += velocity * delta
	car_pos.x = clampf(car_pos.x, 80.0, WORLD_SIZE.x - 80.0)
	car_pos.y = clampf(car_pos.y, 90.0, WORLD_SIZE.y - 90.0)
	apply_road_rules(delta)

func apply_road_rules(delta: float) -> void:
	if is_on_road(car_pos):
		offroad_timer = maxf(0.0, offroad_timer - delta * 2.0)
		return
	offroad_timer += delta
	velocity *= 0.948
	boost = maxf(0.0, boost - 7.0 * delta)
	if offroad_timer > 1.1 and velocity.length() > 150.0:
		damage = min(MAX_DAMAGE - 1, damage + 1)
		offroad_timer = 0.0
		_set_message("Bordstein! Die schnellste Linie bleibt auf der Strasse.")

func update_world(delta: float) -> void:
	crash_cooldown = maxf(0.0, crash_cooldown - delta)
	for i in range(traffic.size()):
		var traffic_car = traffic[i]
		traffic_car["pos"] += traffic_car["dir"] * traffic_car["speed"] * delta
		traffic_car["hit_cooldown"] = maxf(0.0, traffic_car["hit_cooldown"] - delta)
		traffic_car["near_cooldown"] = maxf(0.0, traffic_car["near_cooldown"] - delta)
		if traffic_car["pos"].x < 90.0:
			traffic_car["pos"].x = WORLD_SIZE.x - 90.0
		elif traffic_car["pos"].x > WORLD_SIZE.x - 90.0:
			traffic_car["pos"].x = 90.0
		var player_is_driving := velocity.length() > 45.0
		var traffic_distance := Vector2(traffic_car["pos"]).distance_to(car_pos)
		if player_is_driving and traffic_distance < 56.0 and traffic_car["hit_cooldown"] <= 0.0 and crash_cooldown <= 0.0:
			var away := (car_pos - Vector2(traffic_car["pos"])).normalized()
			velocity += away * 160.0
			damage += 1
			streak = 0
			near_miss_chain = 0
			combo_timer = 0.0
			traffic_car["hit_cooldown"] = 1.0
			crash_cooldown = 0.75
			_set_message("Crash! Linie suchen, nicht nur Gas geben.")
		elif velocity.length() > 280.0 and traffic_distance > 58.0 and traffic_distance < 105.0 and traffic_car["near_cooldown"] <= 0.0:
			near_miss_chain += 1
			near_miss_total += 1
			combo_timer = 3.4
			boost = minf(100.0, boost + 8.0 + float(mini(near_miss_chain, 6)))
			score += 45 + near_miss_chain * 18
			traffic_car["near_cooldown"] = 1.3
			_set_message("Near Miss x%d - Boost geladen." % near_miss_chain)
		traffic[i] = traffic_car
	for i in range(pickups.size()):
		var pickup = pickups[i]
		if pickup["collected"]:
			continue
		if Vector2(pickup["pos"]).distance_to(car_pos) < 44.0:
			pickup["collected"] = true
			if pickup["kind"] == "boost":
				boost = min(100.0, boost + 34.0)
				_set_message("Turbo aufgefuellt.")
			else:
				score += 50
				_set_message("Muenze +50.")
		pickups[i] = pickup
	update_route_gates()
	if damage >= MAX_DAMAGE:
		score = max(0, score - 220)
		damage = 0
		velocity *= 0.25
		_set_message("Taxi repariert. Score-Strafe, aber weiter geht es.")

func update_objectives(delta: float) -> void:
	fare_timer -= delta
	if fare_timer <= 0.0:
		streak = 0
		score = max(0, score - 120)
		mistakes += 1 if mode_learn else 0
		_queue_repeat_current()
		_set_message("Zu spaet. Neuer Fahrgast wartet.")
		spawn_passenger()
		return
	if not passenger_onboard and passenger_pos.distance_to(car_pos) < 58.0:
		passenger_onboard = true
		if mode_learn:
			route_gates.clear()
		else:
			build_route_gates(Vector2(destination["pos"]))
		_set_message("An Bord: %s" % current_task["word"])
	if passenger_onboard:
		for dest in active_destinations():
			if Vector2(dest["pos"]).distance_to(car_pos) < 78.0:
				if dest["label"] == destination["label"]:
					_finish_delivery()
				else:
					_wrong_delivery(dest)
				return

func _finish_delivery() -> void:
	var time_bonus := int(maxf(0.0, fare_timer) * 4.0)
	var drift_bonus := int(minf(250.0, drift))
	var grade := delivery_grade()
	score += 260 + time_bonus + drift_bonus + streak * 80 + grade_bonus_for(grade)
	streak += 1
	deliveries += 1
	if mode_learn:
		learn_hits += 1
		if current_task.get("repeat", false):
			score += 120
		_set_message("%s-Rang: %s -> %s. Lernserie %d." % [grade, current_task["word"], destination["label"], learn_hits])
	else:
		_set_message("%s-Rang: %s abgeliefert nach %s. Serie x%d." % [grade, current_task["word"], destination["label"], streak])
	spawn_passenger()

func _wrong_delivery(dest: Dictionary) -> void:
	score = max(0, score - 95)
	streak = 0
	mistakes += 1
	_queue_repeat_current()
	damage = min(MAX_DAMAGE - 1, damage + 1)
	fare_timer = maxf(14.0, fare_timer - 8.0)
	_set_message("Falsch: %s gehoert nicht zu %s. Weiterfahren!" % [current_task["word"], dest["label"]])

func update_camera() -> void:
	var target := car_pos - VIEW_SIZE * 0.5
	target.x = clampf(target.x, 0.0, WORLD_SIZE.x - VIEW_SIZE.x)
	target.y = clampf(target.y, 0.0, WORLD_SIZE.y - VIEW_SIZE.y)
	camera = camera.lerp(target, 0.16)

func delivery_grade() -> String:
	if fare_timer > 46.0 and damage <= 1 and near_miss_chain >= 2:
		return "S"
	if fare_timer > 34.0 and damage <= 2:
		return "A"
	if fare_timer > 20.0:
		return "B"
	return "C"

func grade_bonus_for(grade: String) -> int:
	match grade:
		"S":
			return 420
		"A":
			return 260
		"B":
			return 130
		_:
			return 0

func nearest_horizontal_road_y(y: float) -> float:
	return ROAD_OFFSET_Y + round((y - ROAD_OFFSET_Y) / ROAD_SPACING_Y) * ROAD_SPACING_Y

func nearest_vertical_road_x(x: float) -> float:
	return round(x / ROAD_SPACING_X) * ROAD_SPACING_X

func is_on_road(point: Vector2) -> bool:
	var dx := absf(point.x - nearest_vertical_road_x(point.x))
	var dy := absf(point.y - nearest_horizontal_road_y(point.y))
	return dx <= ROAD_HALF_WIDTH or dy <= ROAD_HALF_WIDTH

func random_road_point(margin: float) -> Vector2:
	var use_horizontal := randf() > 0.42
	if use_horizontal:
		var lanes_y := int(floor((WORLD_SIZE.y - margin - ROAD_OFFSET_Y) / ROAD_SPACING_Y))
		var y := ROAD_OFFSET_Y + float(randi() % maxi(1, lanes_y + 1)) * ROAD_SPACING_Y
		return Vector2(randf_range(margin, WORLD_SIZE.x - margin), clampf(y, margin, WORLD_SIZE.y - margin))
	var lanes_x := int(floor((WORLD_SIZE.x - margin) / ROAD_SPACING_X))
	var x := float(randi() % maxi(1, lanes_x + 1)) * ROAD_SPACING_X
	return Vector2(clampf(x, margin, WORLD_SIZE.x - margin), randf_range(margin, WORLD_SIZE.y - margin))

func build_route_gates(target: Vector2) -> void:
	route_gates.clear()
	var start := car_pos
	var diff := target - start
	var distance := diff.length()
	if distance < 240.0:
		return
	var count := clampi(int(distance / 420.0), 2, 5)
	var dir := diff.normalized()
	var side := Vector2(-dir.y, dir.x)
	for i in range(count):
		var t := float(i + 1) / float(count + 1)
		var jitter := side * randf_range(-95.0, 95.0)
		var gate_pos := snap_to_near_road(start.lerp(target, t) + jitter)
		route_gates.append({
			"pos": gate_pos,
			"taken": false,
			"label": "FLOW" if i % 2 == 0 else "+ZEIT",
			"kind": "time" if i % 2 == 1 else "flow",
		})

func snap_to_near_road(point: Vector2) -> Vector2:
	var x := nearest_vertical_road_x(point.x)
	var y := nearest_horizontal_road_y(point.y)
	var dx := absf(point.x - x)
	var dy := absf(point.y - y)
	if dx < dy:
		return Vector2(clampf(x, 90.0, WORLD_SIZE.x - 90.0), clampf(point.y, 120.0, WORLD_SIZE.y - 120.0))
	return Vector2(clampf(point.x, 90.0, WORLD_SIZE.x - 90.0), clampf(y, 120.0, WORLD_SIZE.y - 120.0))

func update_route_gates() -> void:
	for i in range(route_gates.size()):
		var gate = route_gates[i]
		if bool(gate["taken"]):
			continue
		if Vector2(gate["pos"]).distance_to(car_pos) < 62.0:
			gate["taken"] = true
			if gate["kind"] == "time":
				fare_timer = minf(76.0, fare_timer + 5.5)
				score += 85
				_set_message("Route-Gate: +Zeit.")
			else:
				score += 110 + streak * 18
				boost = minf(100.0, boost + 12.0)
				_set_message("Flow-Gate: Linie gehalten.")
			route_gates[i] = gate

func world_to_screen(point: Vector2) -> Vector2:
	return point - camera

func _draw() -> void:
	draw_city()
	draw_destinations()
	draw_route_gates()
	draw_pickups()
	draw_passenger()
	draw_traffic()
	draw_route_arrow()
	draw_taxi()
	draw_hud()
	draw_minimap()

func draw_city() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color.html("#07111f"), true)
	var block := 160.0
	var block_start_x := -fmod(camera.x, block) - block
	var block_start_y := -fmod(camera.y, block) - block
	for y in range(int(size.y / block) + 4):
		for x in range(int(size.x / block) + 4):
			var top_left := Vector2(block_start_x + float(x) * block, block_start_y + float(y) * block)
			var tone := Color.html("#123b42") if (x + y) % 2 == 0 else Color.html("#102f37")
			draw_rect(Rect2(top_left + Vector2(22, 22), Vector2(block - 44, block - 44)), tone, true)
	var horizontal_start := ROAD_OFFSET_Y - fmod(camera.y - ROAD_OFFSET_Y, ROAD_SPACING_Y) - ROAD_SPACING_Y
	for y in range(int(size.y / ROAD_SPACING_Y) + 4):
		var road_y := horizontal_start + float(y) * ROAD_SPACING_Y
		draw_rect(Rect2(0.0, road_y - 25.0, size.x, 50.0), Color.html("#2a2f36"), true)
		var dash_start := -fmod(camera.x, 96.0) - 96.0
		for x in range(int(size.x / 96.0) + 4):
			draw_rect(Rect2(dash_start + float(x) * 96.0 - 18.0, road_y - 3.0, 36.0, 6.0), Color.html("#facc15"), true)
	var vertical_start := -fmod(camera.x, ROAD_SPACING_X) - ROAD_SPACING_X
	for x in range(int(size.x / ROAD_SPACING_X) + 4):
		var road_x := vertical_start + float(x) * ROAD_SPACING_X
		draw_rect(Rect2(road_x - 25.0, 0.0, 50.0, size.y), Color.html("#2f343c"), true)

func draw_destinations() -> void:
	var font := get_theme_default_font()
	for dest in active_destinations():
		var p := world_to_screen(dest["pos"])
		var c: Color = dest["color"]
		var active: bool = passenger_onboard and String(dest["label"]) == String(destination["label"]) and not mode_learn
		draw_circle(p, 75.0, Color(c.r, c.g, c.b, 0.16 if not active else 0.28))
		draw_arc(p, 75.0, 0.0, TAU, 48, c, 5.0 if not active else 8.0)
		draw_rect(Rect2(p + Vector2(-76, -90), Vector2(152, 30)), Color.html("#020617"), true)
		draw_string(font, p + Vector2(-66, -68), dest["label"], HORIZONTAL_ALIGNMENT_CENTER, 132.0, 16, Color.html("#f8fafc"))

func draw_pickups() -> void:
	for pickup in pickups:
		if pickup["collected"]:
			continue
		var p := world_to_screen(pickup["pos"])
		var color := Color.html("#22c55e") if pickup["kind"] == "boost" else Color.html("#facc15")
		draw_rect(Rect2(p - Vector2(10, 10), Vector2(20, 20)), color, true)
		draw_rect(Rect2(p - Vector2(4, 4), Vector2(8, 8)), Color.html("#f8fafc"), true)

func draw_route_gates() -> void:
	var font := get_theme_default_font()
	for gate in route_gates:
		if bool(gate["taken"]):
			continue
		var p := world_to_screen(gate["pos"])
		var color := Color.html("#67e8f9") if gate["kind"] == "flow" else Color.html("#facc15")
		draw_circle(p, 34.0, Color(color.r, color.g, color.b, 0.14))
		draw_arc(p, 34.0, elapsed_angle(), elapsed_angle() + PI * 1.45, 32, color, 4.0)
		draw_string(font, p + Vector2(-40, 6), String(gate["label"]), HORIZONTAL_ALIGNMENT_CENTER, 80.0, 11, Color.html("#f8fafc"))

func draw_passenger() -> void:
	if current_task.is_empty() or passenger_onboard:
		return
	var font := get_theme_default_font()
	var p := world_to_screen(passenger_pos)
	draw_circle(p, 34.0, Color.html("#f97316"))
	draw_rect(Rect2(p + Vector2(-68, -62), Vector2(136, 27)), Color.html("#020617"), true)
	var label: String = String(current_task["word"])
	if current_task.get("repeat", false):
		label = "Wdh: %s" % label
	draw_string(font, p + Vector2(-58, -42), label, HORIZONTAL_ALIGNMENT_CENTER, 116.0, 17, Color.html("#f8fafc"))

func draw_traffic() -> void:
	for traffic_car in traffic:
		var p := world_to_screen(traffic_car["pos"])
		draw_rotated_car(p, 0.0 if Vector2(traffic_car["dir"]).x > 0 else PI, traffic_car["color"], false)

func draw_route_arrow() -> void:
	if current_task.is_empty():
		return
	if mode_learn and passenger_onboard:
		return
	var target := passenger_pos if not passenger_onboard else Vector2(destination["pos"])
	var p := world_to_screen(car_pos)
	var target_screen := world_to_screen(target)
	var direction := (target_screen - p).normalized()
	if direction.length() < 0.1:
		return
	var arrow_tip := p + direction * 92.0
	var side := Vector2(-direction.y, direction.x)
	var color := Color.html("#facc15") if not passenger_onboard else Color.html("#22c55e")
	draw_line(p + direction * 42.0, arrow_tip, color, 5.0)
	draw_polygon(PackedVector2Array([arrow_tip, arrow_tip - direction * 18.0 + side * 10.0, arrow_tip - direction * 18.0 - side * 10.0]), PackedColorArray([color]))

func draw_taxi() -> void:
	var p := world_to_screen(car_pos)
	draw_circle(p + Vector2(0, 20), 34.0, Color(0, 0, 0, 0.28))
	draw_rotated_car(p, car_angle, Color.html("#facc15"), true)
	if drift > 80.0:
		var back := p - Vector2(cos(car_angle), sin(car_angle)) * 38.0
		draw_line(back + Vector2(-12, -12), back + Vector2(-54, -22), Color(1, 1, 1, 0.32), 5.0)
		draw_line(back + Vector2(12, 12), back + Vector2(-52, 20), Color(1, 1, 1, 0.25), 4.0)

func draw_rotated_car(center: Vector2, angle: float, color: Color, taxi: bool) -> void:
	var forward := Vector2(cos(angle), sin(angle))
	var side := Vector2(-forward.y, forward.x)
	var body := PackedVector2Array([
		center + forward * 36.0 + side * 20.0,
		center + forward * 36.0 - side * 20.0,
		center - forward * 36.0 - side * 20.0,
		center - forward * 36.0 + side * 20.0,
	])
	draw_polygon(body, PackedColorArray([color]))
	draw_line(body[0], body[1], Color.html("#020617"), 4.0)
	draw_line(body[2], body[3], Color.html("#020617"), 4.0)
	draw_polygon(PackedVector2Array([
		center + forward * 12.0 + side * 13.0,
		center + forward * 12.0 - side * 13.0,
		center - forward * 12.0 - side * 10.0,
		center - forward * 12.0 + side * 10.0,
	]), PackedColorArray([Color(1, 1, 1, 0.32)]))
	if taxi:
		draw_rect(Rect2(center - Vector2(18, 32), Vector2(36, 10)), Color.html("#020617"), true)
		draw_string(get_theme_default_font(), center + Vector2(-14, -23), "TAXI", HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color.html("#f8fafc"))

func draw_hud() -> void:
	var font := get_theme_default_font()
	draw_rect(Rect2(12, 12, 610, 158), Color(0.02, 0.05, 0.09, 0.80), true)
	draw_string(font, Vector2(26, 38), "FASKA TAXI RUSH PRO", HORIZONTAL_ALIGNMENT_LEFT, -1, 22, Color.html("#facc15"))
	draw_string(font, Vector2(26, 66), "Score %d  Serie x%d  Schaden %d/%d  Zeit %ds" % [score, streak, damage, MAX_DAMAGE, int(fare_timer)], HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color.html("#f8fafc"))
	draw_string(font, Vector2(26, 92), "Mode %s  Fach %s  Lernziel %d  Fehler %d  Wdh %d" % ["Learncade" if mode_learn else "Normal", LESSONS[lesson_index], learn_hits, mistakes, repeat_queue.size()], HORIZONTAL_ALIGNMENT_LEFT, -1, 15, Color.html("#cbd5e1"))
	draw_string(font, Vector2(26, 118), "Near Miss x%d  Gesamt %d  Mission: %s" % [near_miss_chain, near_miss_total, mission_text()], HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.html("#bae6fd"))
	draw_string(font, Vector2(26, 146), _objective_text(), HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.html("#fde68a"))
	draw_rect(Rect2(646, 22, 210, 14), Color.html("#111827"), true)
	draw_rect(Rect2(646, 22, 210.0 * boost / 100.0, 14), Color.html("#22c55e"), true)
	draw_string(font, Vector2(646, 58), "WASD/Pfeile  Space Drift  Shift Boost", HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.html("#cbd5e1"))
	draw_string(font, Vector2(646, 82), "L Learncade  C Fach  R Neustart", HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.html("#94a3b8"))
	if message_timer > 0.0:
		draw_rect(Rect2(12.0, size.y - 46.0, min(size.x - 24.0, 860.0), 32.0), Color(0.02, 0.05, 0.09, 0.78), true)
		draw_string(font, Vector2(24.0, size.y - 23.0), message, HORIZONTAL_ALIGNMENT_LEFT, -1, 15, Color.html("#f8fafc"))

func draw_minimap() -> void:
	var rect := Rect2(size.x - 178.0, 86.0, 154.0, 108.0)
	if size.x < 720.0:
		return
	draw_rect(rect, Color(0.02, 0.05, 0.09, 0.76), true)
	draw_rect(rect, Color(0.45, 0.62, 0.82, 0.42), false, 1.5)
	for dest in active_destinations():
		var dp := _map_point(Vector2(dest["pos"]), rect)
		var dc: Color = dest["color"]
		draw_circle(dp, 3.5, dc)
	if not passenger_onboard and not current_task.is_empty():
		draw_circle(_map_point(passenger_pos, rect), 4.5, Color.html("#f97316"))
	if not current_task.is_empty():
		draw_circle(_map_point(Vector2(destination["pos"]), rect), 5.5, Color.html("#22c55e"))
	draw_circle(_map_point(car_pos, rect), 4.5, Color.html("#facc15"))

func _map_point(point: Vector2, rect: Rect2) -> Vector2:
	return rect.position + Vector2(
		clampf(point.x / WORLD_SIZE.x, 0.0, 1.0) * rect.size.x,
		clampf(point.y / WORLD_SIZE.y, 0.0, 1.0) * rect.size.y
	)

func elapsed_angle() -> float:
	return fmod(elapsed * 3.2, TAU)

func _objective_text() -> String:
	if current_task.is_empty():
		return "Neuer Auftrag wird geladen."
	if not mode_learn:
		if passenger_onboard:
			return "Bring %s nach %s." % [current_task["word"], destination["label"]]
		return "Hol den Wort-Fahrgast: %s." % current_task["word"]
	match LESSONS[lesson_index]:
		"WORTART":
			return "Welche Wortart ist '%s'?" % current_task["word"]
		"SATZ":
			return "Satz: %s  Wohin gehoert '%s'?" % [current_task["sentence"], current_task["word"]]
		"MATHE":
			return "Rechne: %s. Fahre zum Ergebnis." % current_task["word"]
		"ENGLISCH":
			return "Englisch: Was heisst '%s'?" % current_task["word"]
		_:
			return "Lies: %s. Fahre zum passenden Ort." % current_task["clue"]

func _mode_message() -> String:
	if mode_learn:
		return "Learncade: Wortarten, Satzstellen, Lese-Orte, Mathe und Englisch. C wechselt das Fach."
	return "Normal: Tempo, Drift, Verkehr und schnelle Ablieferungen."

func mission_text() -> String:
	if mode_learn:
		return "%d/5 richtige Lernfahrten, max. 2 Fehler" % learn_hits
	return "%d/3 Fahrten, %d/6 Near-Misses" % [deliveries, near_miss_total]

func _set_message(text: String) -> void:
	message = text
	message_timer = 2.3

func _queue_repeat_current() -> void:
	if not mode_learn or current_task.is_empty():
		return
	var lesson: String = String(LESSONS[lesson_index])
	for item in repeat_queue:
		if item.get("lesson", "") == lesson and String(item["task"].get("word", "")) == String(current_task.get("word", "")):
			return
	if repeat_queue.size() >= 8:
		repeat_queue.pop_front()
	var task := current_task.duplicate(true)
	task["repeat"] = true
	repeat_queue.append({"lesson": lesson, "task": task})
