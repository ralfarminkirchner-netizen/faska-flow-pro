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
const SLIPSTREAM_RANGE := 185.0
const SLIPSTREAM_TRIGGER := 1.35

const LEARN_GOAL := 8
const LESSONS := ["WORTART", "MATHE", "SATZ", "LESEN", "KOMPOSITUM", "ENGLISCH"]

const TASKS_WORD := [
	{"prompt": "Welche Wortart ist 'schnell'?", "answer": "Adjektiv", "options": ["Nomen", "Verb", "Adjektiv"]},
	{"prompt": "Welches Wort ist ein Verb?", "answer": "driften", "options": ["driften", "Kurve", "rot"]},
	{"prompt": "Welche Wortart ist 'unter'?", "answer": "Praeposition", "options": ["Praeposition", "Nomen", "Artikel"]},
	{"prompt": "Welche Wortart ist 'und'?", "answer": "Konjunktion", "options": ["Adjektiv", "Konjunktion", "Verb"]},
	{"prompt": "Welche Wortart ist 'Rennen'?", "answer": "Nomen", "options": ["Verb", "Nomen", "Adjektiv"]},
	{"prompt": "Welche Wortart ist 'der'?", "answer": "Artikel", "options": ["Artikel", "Verb", "Nomen"]},
]

const TASKS_MATH := [
	{"prompt": "Was ist 8 + 9?", "answer": "17", "options": ["16", "17", "18"]},
	{"prompt": "5 x 6 = ?", "answer": "30", "options": ["25", "30", "35"]},
	{"prompt": "24 - 9 = ?", "answer": "15", "options": ["15", "13", "17"]},
	{"prompt": "36 : 6 = ?", "answer": "6", "options": ["4", "7", "6"]},
	{"prompt": "Welche Zahl ist gerade?", "answer": "28", "options": ["17", "28", "31"]},
	{"prompt": "Welche Zahl ist groesser als 50?", "answer": "63", "options": ["49", "63", "38"]},
]

const TASKS_SENTENCE := [
	{"prompt": "Der Kart ___ um die Kurve.", "answer": "driftet", "options": ["schnell", "driftet", "unter"]},
	{"prompt": "Mira nimmt ___ Itembox.", "answer": "eine", "options": ["eine", "einen", "ein"]},
	{"prompt": "Wir bremsen, ___ die Kurve eng ist.", "answer": "weil", "options": ["Auto", "weil", "gelb"]},
	{"prompt": "Setze das Satzzeichen: Das Rennen startet", "answer": ".", "options": ["?", ",", "."]},
	{"prompt": "Welches Wort verbindet zwei Satzteile?", "answer": "und", "options": ["und", "rot", "Strecke"]},
]

const TASKS_READING := [
	{"prompt": "Lies: Der gelbe Kart sammelt eine Box. Was sammelt er?", "answer": "eine Box", "options": ["eine Box", "ein Haus", "einen Baum"]},
	{"prompt": "Lies: Luna bremst vor der engen Kurve. Wann bremst sie?", "answer": "vor der Kurve", "options": ["nach dem Ziel", "vor der Kurve", "im Wasser"]},
	{"prompt": "Lies: Der rote Rival faehrt links vorbei. Wo faehrt er?", "answer": "links", "options": ["rechts", "hinten", "links"]},
	{"prompt": "Lies: Bruno nutzt den Turbo auf der Geraden. Was nutzt Bruno?", "answer": "Turbo", "options": ["Turbo", "Bremse", "Schirm"]},
]

const TASKS_COMPOUND := [
	{"prompt": "Bilde das Kompositum: Renn + Strecke", "answer": "Rennstrecke", "options": ["Rennstrecke", "Streckenrenn", "Rennlicht"]},
	{"prompt": "Bilde das Kompositum: Motor + Haube", "answer": "Motorhaube", "options": ["Haubenmotor", "Motorhaube", "motorisch"]},
	{"prompt": "Bilde das Kompositum: Ziel + Linie", "answer": "Ziellinie", "options": ["Linienziel", "Ziellinie", "zielen"]},
	{"prompt": "Bilde das Kompositum: Reifen + Spur", "answer": "Reifenspur", "options": ["Reifenspur", "Spurenreifen", "spurig"]},
	{"prompt": "Bilde das Kompositum: Turbo + Start", "answer": "Turbostart", "options": ["Startturbo", "Turbostart", "starten"]},
]

const TASKS_ENGLISH := [
	{"prompt": "Was bedeutet 'fast'?", "answer": "schnell", "options": ["langsam", "schnell", "rund"]},
	{"prompt": "Was heisst 'Kurve' auf Englisch?", "answer": "curve", "options": ["coin", "curve", "car"]},
	{"prompt": "Was heisst 'Rennen' auf Englisch?", "answer": "race", "options": ["road", "race", "read"]},
	{"prompt": "Was heisst 'Bremse' auf Englisch?", "answer": "brake", "options": ["boost", "brake", "bridge"]},
	{"prompt": "Was heisst 'links' auf Englisch?", "answer": "left", "options": ["right", "left", "late"]},
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
var touch_button_state := {
	"gas": false,
	"brake": false,
	"drift": false,
	"item": false,
	"learn": false,
	"subject": false
}
var active_touch_buttons := {}
var mouse_touch_active := ""
var mode := "Normal"
var lesson_index := 0
var correct_gates := 0
var mistakes := 0
var repeat_queue: Array = []
var phase := "race"
var lap := 1
var checkpoint := 0
var race_time := 0.0
var best_lap := 0.0
var lap_time := 0.0
var score := 0
var combo := 0
var race_rank := 1
var item_slot := "none"
var question_index := 0
var message := ""
var message_timer := 0.0
var shake := 0.0
var stats := {}

func _ready() -> void:
	rng.seed = 73241
	font = get_theme_default_font()
	mouse_filter = Control.MOUSE_FILTER_PASS
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
		"drift_charge": 0.0,
		"boost": 0.0,
		"shield": 0.0,
		"spin": 0.0,
		"slipstream": 0.0,
		"coins": 0
	}
	rivals.clear()
	for i in range(5):
		rivals.append({"progress": -0.03 * float(i + 1), "speed": 0.21 + float(i) * 0.012, "base_speed": 0.21 + float(i) * 0.012, "lane": -0.8 + float(i % 3) * 0.8, "pos": path[0], "angle": 0.0, "color": Color.from_hsv(0.02 + float(i) * 0.12, 0.75, 0.95), "stun": 0.0, "boost": 0.0})
	item_boxes.clear()
	hazards.clear()
	rockets.clear()
	particles.clear()
	floaters.clear()
	touch_axis = Vector2.ZERO
	touch_pointer = -1
	active_touch_buttons.clear()
	mouse_touch_active = ""
	for button_name in touch_button_state.keys():
		touch_button_state[button_name] = false
	mode = "Normal"
	lesson_index = 0
	correct_gates = 0
	mistakes = 0
	repeat_queue.clear()
	phase = "race"
	lap = 1
	checkpoint = 0
	race_time = 0.0
	best_lap = 0.0
	lap_time = 0.0
	score = 0
	combo = 0
	race_rank = 1
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
	var task := current_task()
	var gate_progress := 0.18 + float((question_index + lesson_index) % 4) * 0.18
	var center := sample_track(gate_progress)
	var normal := track_normal(int(gate_progress * path.size()))
	for i in range(3):
		var lane := -1.0 + float(i)
		learn_gates.append({"pos": center + normal * lane * 92.0, "label": String(task.options[i]), "answer": String(task.answer), "task": task, "active": true})

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
	update_rank()
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
	var throttle := Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP) or touch_axis.y < -0.18 or is_touch_down("gas")
	var brake := Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN) or touch_axis.y > 0.35 or is_touch_down("brake")
	var drifting := Input.is_key_pressed(KEY_SPACE) or is_touch_down("drift")
	if float(player.spin) > 0.0:
		throttle = false
		drifting = false
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
	if int(player.coins) > 0:
		speed += float(mini(10, int(player.coins))) * 6.0 * delta
	speed = clamp(speed, -180.0, MAX_SPEED + (220.0 if float(player.boost) > 0.0 else 0.0))
	var grip := track_grip(Vector2(player.pos))
	var steer_power: float = STEER * (0.35 + min(abs(speed) / MAX_SPEED, 1.0) * 0.85)
	player.angle = float(player.angle) + steer_input * steer_power * delta * (1.35 if drifting else 1.0)
	if drifting and abs(steer_input) > 0.2 and abs(speed) > 260.0:
		player.drift = min(1.0, float(player.drift) + delta * 0.78)
		player.drift_charge = min(1.65, float(player.drift_charge) + delta * (0.68 + abs(steer_input) * 0.28))
		spawn_tire_smoke()
	else:
		var charge := float(player.drift_charge)
		if charge > 0.55:
			var tier := 1
			if charge > 1.24:
				tier = 3
			elif charge > 0.88:
				tier = 2
			var boost_time := 0.95 + float(tier) * 0.42
			player.boost = max(float(player.boost), boost_time)
			stats.drifts += 1
			score += 220 * tier + combo * 25
			combo += tier
			add_text(["", "MINI TURBO", "SUPER TURBO", "ULTRA TURBO"][tier], Vector2(player.pos), Color(0.35, 0.9, 1.0))
		player.drift = max(0.0, float(player.drift) - delta * 2.4)
		player.drift_charge = max(0.0, float(player.drift_charge) - delta * 3.2)
	if grip < 0.65:
		speed *= 1.0 - delta * 0.42
	var dir := Vector2(cos(float(player.angle)), sin(float(player.angle)))
	var slip: Vector2 = Vector2(-dir.y, dir.x) * steer_input * abs(speed) * (0.1 + float(player.drift) * 0.36)
	player.pos = Vector2(player.pos) + (dir * speed + slip) * delta * grip
	player.pos = Vector2(clamp(Vector2(player.pos).x, 40.0, WORLD_W - 40.0), clamp(Vector2(player.pos).y, 40.0, WORLD_H - 40.0))
	player.speed = speed
	player.spin = max(0.0, float(player.spin) - delta)
	update_slipstream(delta)
	player.shield = max(0.0, float(player.shield) - delta)
	update_checkpoint()

func update_slipstream(delta: float) -> void:
	var dir := Vector2(cos(float(player.angle)), sin(float(player.angle)))
	var charging := false
	for rival in rivals:
		var to_rival := Vector2(rival.pos) - Vector2(player.pos)
		var dist := to_rival.length()
		if dist > 28.0 and dist < SLIPSTREAM_RANGE and dir.dot(to_rival.normalized()) > 0.62:
			charging = true
			break
	if charging and abs(float(player.speed)) > 250.0:
		player.slipstream = min(SLIPSTREAM_TRIGGER, float(player.slipstream) + delta)
		if float(player.slipstream) >= SLIPSTREAM_TRIGGER:
			player.boost = max(float(player.boost), 1.15)
			player.slipstream = 0.0
			combo += 1
			score += 180 + combo * 15
			add_text("SLIPSTREAM", Vector2(player.pos), Color(0.62, 0.92, 1.0))
	else:
		player.slipstream = max(0.0, float(player.slipstream) - delta * 0.75)

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
		r.stun = max(0.0, float(r.get("stun", 0.0)) - delta)
		r.boost = max(0.0, float(r.get("boost", 0.0)) - delta)
		var player_total := player_total_progress()
		var rubber := clampf((player_total - float(r.progress)) * 0.018, -0.018, 0.028)
		var current_speed := float(r.get("base_speed", r.speed)) + rubber
		if float(r.get("stun", 0.0)) > 0.0:
			current_speed *= 0.22
		if float(r.get("boost", 0.0)) > 0.0:
			current_speed += 0.035
		r.speed = current_speed
		r.progress = float(r.progress) + current_speed * delta
		var base := sample_track(fposmod(float(r.progress), 1.0))
		var normal := sample_normal(fposmod(float(r.progress), 1.0))
		r.pos = base + normal * float(r.lane) * 76.0
		r.angle = sample_angle(fposmod(float(r.progress), 1.0))
		if Vector2(player.pos).distance_to(Vector2(r.pos)) < 54.0:
			if float(player.shield) > 0.0 or float(player.boost) > 0.0:
				r.stun = max(float(r.stun), 0.55)
				score += 120
				add_text("CHECK", Vector2(r.pos), Color(0.62, 0.92, 1.0))
			else:
				player.speed = float(player.speed) * 0.72
				combo = 0
				shake = 0.7
				add_text("BUMP", Vector2(player.pos), Color(1.0, 0.36, 0.25))
		rivals[i] = r

func player_total_progress() -> float:
	var progress := float(max(0, lap - 1))
	progress += float(checkpoint) / float(path.size())
	var next_cp: Vector2 = path[checkpoint % path.size()]
	var prev_cp: Vector2 = path[(checkpoint - 1 + path.size()) % path.size()]
	var segment := next_cp - prev_cp
	if segment.length_squared() > 1.0:
		var t := clampf((Vector2(player.pos) - prev_cp).dot(segment) / segment.length_squared(), 0.0, 1.0)
		progress += t / float(path.size())
	return progress

func update_rank() -> void:
	var player_progress := player_total_progress()
	var rank := 1
	for rival in rivals:
		if float(rival.progress) > player_progress:
			rank += 1
	race_rank = rank

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
	var options = ["boost", "rocket", "shield", "oil", "coin"]
	if race_rank >= 4:
		options.append("shock")
		options.append("rocket")
	elif race_rank == 1:
		options.append("oil")
		options.append("coin")
	item_slot = options[rng.randi_range(0, options.size() - 1)]
	score += 120
	stats.items = int(stats.items) + 1
	add_text(String(item_slot).to_upper(), Vector2(player.pos), Color(1.0, 0.88, 0.28))

func use_item() -> void:
	if item_slot == "none":
		return
	if item_slot == "boost":
		player.boost = max(float(player.boost), 2.0)
		combo += 1
	elif item_slot == "shield":
		player.shield = 4.0
	elif item_slot == "coin":
		player.coins = mini(10, int(player.coins) + 2)
		score += 160
		add_text("+2 COINS", Vector2(player.pos), Color(1.0, 0.86, 0.25))
	elif item_slot == "shock":
		for i in range(rivals.size()):
			var rival = rivals[i]
			if Vector2(rival.pos).distance_to(Vector2(player.pos)) < 420.0 or float(rival.progress) > player_total_progress():
				rival.stun = max(float(rival.get("stun", 0.0)), 1.15)
				rivals[i] = rival
		score += 480
		shake = 1.2
		spawn_sparks(Vector2(player.pos), Color(0.55, 0.86, 1.0), 26)
		add_text("SHOCK", Vector2(player.pos), Color(0.55, 0.86, 1.0))
	elif item_slot == "oil":
		var back := Vector2(cos(float(player.angle)), sin(float(player.angle))) * -72.0
		hazards.append({"pos": Vector2(player.pos) + back, "life": 14.0, "hits": [], "player_hit": false})
	elif item_slot == "rocket":
		var dir := Vector2(cos(float(player.angle)), sin(float(player.angle)))
		rockets.append({"pos": Vector2(player.pos) + dir * 40.0, "vel": dir * 980.0, "life": 2.4, "target": nearest_rival_ahead()})
		stats.rockets = int(stats.rockets) + 1
	item_slot = "none"

func nearest_rival_ahead() -> int:
	var best := -1
	var best_gap := 999.0
	var player_progress := player_total_progress()
	for i in range(rivals.size()):
		var gap := float(rivals[i].progress) - player_progress
		if gap > -0.04 and gap < best_gap:
			best_gap = gap
			best = i
	return best

func update_rockets(delta: float) -> void:
	for i in range(rockets.size() - 1, -1, -1):
		var rocket = rockets[i]
		var target := int(rocket.get("target", -1))
		if target >= 0 and target < rivals.size():
			var to_target := Vector2(rivals[target].pos) - Vector2(rocket.pos)
			if to_target.length() > 1.0:
				var desired := to_target.normalized() * 1040.0
				rocket.vel = Vector2(rocket.vel).lerp(desired, min(1.0, delta * 3.4))
		rocket.pos = Vector2(rocket.pos) + Vector2(rocket.vel) * delta
		rocket.life = float(rocket.life) - delta
		var hit := false
		for r_i in range(rivals.size()):
			var rival = rivals[r_i]
			if Vector2(rocket.pos).distance_to(Vector2(rival.pos)) < 42.0:
				rival.progress = max(-0.08, float(rival.progress) - 0.035)
				rival.stun = max(float(rival.get("stun", 0.0)), 1.1)
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
		if not bool(hazard.get("player_hit", false)) and Vector2(player.pos).distance_to(Vector2(hazard.pos)) < 42.0 and float(player.shield) <= 0.0:
			player.spin = 0.8
			player.speed = float(player.speed) * 0.45
			combo = 0
			shake = 1.0
			hazard.player_hit = true
		var hits: Array = hazard.get("hits", [])
		for r_i in range(rivals.size()):
			var rival = rivals[r_i]
			if not hits.has(r_i) and Vector2(rival.pos).distance_to(Vector2(hazard.pos)) < 42.0:
				rival.stun = max(float(rival.get("stun", 0.0)), 0.85)
				rivals[r_i] = rival
				score += 130
				hits.append(r_i)
				add_text("OIL HIT", Vector2(rival.pos), Color(0.95, 0.75, 0.18))
		hazard.hits = hits
		if float(hazard.life) <= 0.0:
			hazards.remove_at(i)
		else:
			hazards[i] = hazard

func update_learn_gates() -> void:
	for gate in learn_gates:
		if bool(gate.active) and Vector2(player.pos).distance_to(Vector2(gate.pos)) < 54.0:
			var task: Dictionary = gate.get("task", current_task())
			if String(gate.label) == String(gate.answer):
				var repeated := bool(task.get("repeat", false))
				score += 900 if repeated else 650
				stats.learn = int(stats.learn) + 1
				correct_gates += 1
				player.boost = max(float(player.boost), 1.4)
				_remove_repeat(task)
				add_text("WDH OK" if repeated else "RICHTIG", Vector2(gate.pos), Color(0.35, 1.0, 0.55))
				if correct_gates > 0 and correct_gates % LEARN_GOAL == 0:
					score += 1600
					add_text("LERNZIEL", Vector2(gate.pos) + Vector2(0, -42), Color(1.0, 0.88, 0.24))
			else:
				player.speed = float(player.speed) * 0.45
				combo = 0
				mistakes += 1
				_queue_repeat(task)
				add_text("FALSCH", Vector2(gate.pos), Color(1.0, 0.22, 0.2))
			question_index += 1
			build_learn_gates()
			return

func toggle_learncade() -> void:
	mode = "Learncade" if mode == "Normal" else "Normal"
	if mode == "Learncade":
		message = "Learncade: " + LESSONS[lesson_index] + " - fahre durch die richtige Antwort."
	else:
		message = "Normalmodus aktiv."
	message_timer = 2.4
	if mode == "Learncade":
		build_learn_gates()

func cycle_lesson() -> void:
	lesson_index = (lesson_index + 1) % LESSONS.size()
	question_index = 0
	mode = "Learncade"
	build_learn_gates()
	message = "Fach: " + LESSONS[lesson_index] + " - falsche Tore kommen wieder."
	message_timer = 2.5

func task_bank() -> Array:
	match LESSONS[lesson_index]:
		"MATHE":
			return TASKS_MATH
		"SATZ":
			return TASKS_SENTENCE
		"LESEN":
			return TASKS_READING
		"KOMPOSITUM":
			return TASKS_COMPOUND
		"ENGLISCH":
			return TASKS_ENGLISH
		_:
			return TASKS_WORD

func current_task() -> Dictionary:
	var lesson := String(LESSONS[lesson_index])
	for entry in repeat_queue:
		if String(entry.get("lesson", "")) == lesson:
			var repeated_task: Dictionary = entry["task"]
			return repeated_task
	var bank := task_bank()
	var task: Dictionary = bank[question_index % bank.size()].duplicate(true)
	task["lesson"] = lesson
	return task

func _task_id(task: Dictionary) -> String:
	return "%s::%s" % [String(task.get("lesson", LESSONS[lesson_index])), String(task.get("prompt", ""))]

func _queue_repeat(task: Dictionary) -> void:
	var copy := task.duplicate(true)
	copy["lesson"] = String(task.get("lesson", LESSONS[lesson_index]))
	copy["repeat"] = true
	var id := _task_id(copy)
	for entry in repeat_queue:
		var stored_task: Dictionary = entry["task"]
		if _task_id(stored_task) == id:
			return
	if repeat_queue.size() >= 10:
		repeat_queue.pop_front()
	repeat_queue.append({"lesson": copy["lesson"], "task": copy})

func _remove_repeat(task: Dictionary) -> void:
	var id := _task_id(task)
	for i in range(repeat_queue.size() - 1, -1, -1):
		var stored_task: Dictionary = repeat_queue[i]["task"]
		if _task_id(stored_task) == id:
			repeat_queue.remove_at(i)

func is_touch_down(name: String) -> bool:
	return touch_button_state.has(name) and bool(touch_button_state[name])

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
			KEY_C:
				cycle_lesson()
			KEY_SHIFT, KEY_E, KEY_Q:
				use_item()

func _gui_input(event) -> void:
	if not should_show_touch():
		return
	if event is InputEventScreenTouch:
		if event.pressed:
			handle_touch_press(event.index, event.position)
		else:
			if event.index == touch_pointer:
				touch_pointer = -1
				touch_axis = Vector2.ZERO
			if active_touch_buttons.has(event.index):
				var name := String(active_touch_buttons[event.index])
				touch_button_state[name] = false
				active_touch_buttons.erase(event.index)
	elif event is InputEventScreenDrag:
		if event.index == touch_pointer:
			var origin := touch_stick_center()
			touch_axis = (event.position - origin) / (76.0 * touch_scale())
			if touch_axis.length() > 1.0:
				touch_axis = touch_axis.normalized()
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			handle_touch_press(999, event.position)
		else:
			if touch_pointer == 999:
				touch_pointer = -1
				touch_axis = Vector2.ZERO
			if mouse_touch_active != "":
				touch_button_state[mouse_touch_active] = false
				mouse_touch_active = ""
	elif event is InputEventMouseMotion and touch_pointer == 999:
		var origin := touch_stick_center()
		touch_axis = (event.position - origin) / (76.0 * touch_scale())
		if touch_axis.length() > 1.0:
			touch_axis = touch_axis.normalized()

func handle_touch_press(pointer_id: int, pos: Vector2) -> void:
	if pos.distance_to(touch_stick_center()) <= 92.0 * touch_scale():
		touch_pointer = pointer_id
		var origin := touch_stick_center()
		touch_axis = (pos - origin) / (76.0 * touch_scale())
		if touch_axis.length() > 1.0:
			touch_axis = touch_axis.normalized()
		return
	var rects := touch_button_rects()
	for name in rects.keys():
		var rect: Rect2 = rects[name]
		if rect.has_point(pos):
			touch_button_state[name] = true
			if pointer_id == 999:
				mouse_touch_active = name
			else:
				active_touch_buttons[pointer_id] = name
			if name == "item":
				use_item()
			elif name == "learn":
				toggle_learncade()
			elif name == "subject":
				cycle_lesson()

func should_show_touch() -> bool:
	return size.x <= 1100.0 or size.x < size.y

func touch_scale() -> float:
	if size.y > size.x * 1.15:
		return clampf(size.x / 520.0, 1.04, 1.42)
	return clampf(min(size.x, size.y) / 720.0, 0.72, 1.16)

func touch_stick_center() -> Vector2:
	var s := touch_scale()
	return Vector2(100.0 * s, size.y - 104.0 * s)

func touch_button_centers() -> Dictionary:
	var s := touch_scale()
	return {
		"gas": Vector2(size.x - 92.0 * s, size.y - 188.0 * s),
		"brake": Vector2(size.x - 92.0 * s, size.y - 96.0 * s),
		"drift": Vector2(size.x - 182.0 * s, size.y - 96.0 * s),
		"item": Vector2(size.x - 182.0 * s, size.y - 188.0 * s),
		"subject": Vector2(size.x - 272.0 * s, size.y - 96.0 * s),
		"learn": Vector2(size.x - 272.0 * s, size.y - 188.0 * s),
	}

func touch_button_rects() -> Dictionary:
	var s := touch_scale()
	var rects := {}
	for name in touch_button_centers().keys():
		var center: Vector2 = touch_button_centers()[name]
		rects[name] = Rect2(center - Vector2(36.0, 24.0) * s, Vector2(72.0, 48.0) * s)
	return rects

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
		var task := current_task()
		var panel_w := minf(size.x - 24.0, 720.0)
		draw_rect(Rect2(Vector2(size.x * 0.5 - panel_w * 0.5, 144.0 if should_show_touch() else 12.0), Vector2(panel_w, 32.0)), Color(0.0, 0.0, 0.0, 0.62))
		draw_text_at(Vector2(size.x * 0.5 - panel_w * 0.5 + 12.0, 166.0 if should_show_touch() else 34.0), "%s: %s" % [LESSONS[lesson_index], String(task.prompt)], Color(0.8, 0.95, 1.0), 16)
		for gate in learn_gates:
			var gp := world_to_screen(Vector2(gate.pos))
			draw_circle(gp, 48.0, Color(0.12, 0.28, 0.65, 0.56))
			var border := Color(0.95, 0.52, 1.0) if bool(task.get("repeat", false)) else Color(0.55, 0.82, 1.0)
			draw_arc(gp, 52.0, 0.0, TAU, 34, border, 4.0)
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
		var drift_color := Color(0.22, 0.85, 1.0)
		if float(player.drift_charge) > 1.24:
			drift_color = Color(1.0, 0.42, 0.95)
		elif float(player.drift_charge) > 0.88:
			drift_color = Color(1.0, 0.72, 0.22)
		draw_arc(p, 42.0, 0.0, TAU * minf(1.0, float(player.drift_charge)), 36, drift_color, 4.0)
	if label == "YOU" and float(player.slipstream) > 0.05:
		draw_arc(p, 54.0, -PI * 0.5, -PI * 0.5 + TAU * clampf(float(player.slipstream) / SLIPSTREAM_TRIGGER, 0.0, 1.0), 42, Color(0.62, 0.92, 1.0), 3.0)
	if label == "R":
		for rival in rivals:
			if Vector2(rival.pos).distance_to(pos) < 1.0 and float(rival.get("stun", 0.0)) > 0.0:
				draw_arc(p, 42.0, 0.0, TAU, 28, Color(1.0, 0.88, 0.28), 3.0)
				break

func draw_effects() -> void:
	for rocket in rockets:
		var p := world_to_screen(Vector2(rocket.pos))
		draw_circle(p, 8.0, Color(1.0, 0.45, 0.12))
	for part in particles:
		draw_circle(world_to_screen(Vector2(part.pos)), float(part.size), part.color)

func draw_hud() -> void:
	var compact := should_show_touch()
	var ui := 1.28 if size.y > size.x * 1.15 else 1.0
	var hud_w := minf(size.x - 20.0, 520.0 if compact else 420.0)
	draw_rect(Rect2(Vector2(10, 10), Vector2(hud_w, (148.0 if compact else 142.0) * ui)), Color(0.0, 0.0, 0.0, 0.6))
	draw_text_at(Vector2(20, 31 * ui), "FASKA KART PRO", Color(1.0, 0.9, 0.25), int(18 * ui))
	draw_text_at(Vector2(20, 56 * ui), "P" + str(race_rank) + "/6  Lap " + str(min(lap, TOTAL_LAPS)) + "/" + str(TOTAL_LAPS) + "  CP " + str(checkpoint + 1) + "/" + str(path.size()), Color(0.9, 0.96, 1.0), int(14 * ui))
	draw_bar(Vector2(20, 76 * ui), "SPEED", abs(float(player.speed)), MAX_SPEED + 220.0, Color(0.34, 0.85, 1.0), ui)
	draw_bar(Vector2(20, 98 * ui), "DRIFT", float(player.drift_charge), 1.65, Color(1.0, 0.65, 0.18), ui)
	draw_text_at(Vector2(20, 124 * ui), "Score %d  Combo %d  Mode %s  Time %s" % [score, combo, mode, format_time(race_time)], Color(0.86, 0.92, 1.0), int(13 * ui))
	draw_text_at(Vector2(20, 146 * ui), "Fach %s  Ziel %d/%d  Fehler %d  Wdh %d" % [LESSONS[lesson_index], correct_gates % LEARN_GOAL, LEARN_GOAL, mistakes, repeat_queue.size()], Color(0.72, 0.94, 1.0), int(12 * ui))
	if not compact:
		draw_rect(Rect2(Vector2(size.x - 306, 10), Vector2(292, 106)), Color(0.0, 0.0, 0.0, 0.56))
		draw_text_at(Vector2(size.x - 294, 32), "Item " + String(item_slot).to_upper(), Color(0.94, 0.98, 1.0), 15)
		draw_text_at(Vector2(size.x - 294, 55), "Coins " + str(player.coins) + "  Turbo " + str(stats.drifts), Color(0.94, 0.98, 1.0), 14)
		draw_text_at(Vector2(size.x - 294, 78), "Learn " + str(stats.learn) + "  Rockets " + str(stats.rockets), Color(0.94, 0.98, 1.0), 14)
		draw_text_at(Vector2(size.x - 294, 101), "Drift-Tiers · Slipstream · E/Q Item", Color(0.74, 0.84, 0.96), 12)

func draw_bar(pos: Vector2, label: String, value: float, max_value: float, color: Color, scale_factor: float = 1.0) -> void:
	draw_text_at(pos, label, Color(0.76, 0.84, 0.92), int(12 * scale_factor))
	draw_rect(Rect2(pos + Vector2(72, -10) * scale_factor, Vector2(170, 8) * scale_factor), Color(0.08, 0.08, 0.1))
	draw_rect(Rect2(pos + Vector2(72, -10) * scale_factor, Vector2(170 * clamp(value / max_value, 0.0, 1.0), 8) * scale_factor), color)

func draw_touch_controls() -> void:
	touch_buttons.clear()
	if not should_show_touch():
		return
	var s := touch_scale()
	var origin := touch_stick_center()
	draw_arc(origin, 66.0 * s, 0.0, TAU, 36, Color(0.6, 0.82, 1.0, 0.32), 3.0 * s)
	draw_circle(origin + touch_axis * 44.0 * s, 23.0 * s, Color(0.32, 0.75, 1.0, 0.52))
	var labels := {
		"gas": "GAS",
		"brake": "BRK",
		"drift": "DRF",
		"item": "ITEM",
		"subject": "FACH",
		"learn": "LERN"
	}
	var rects := touch_button_rects()
	for name in rects.keys():
		var rect: Rect2 = rects[name]
		touch_buttons[name] = rect
		var fill := Color(0.02, 0.07, 0.13, 0.72)
		if is_touch_down(name):
			fill = Color(0.16, 0.44, 0.88, 0.9)
		draw_rect(rect, fill)
		draw_rect(rect, Color(0.55, 0.78, 1.0, 0.55), false, 2.0 * s)
		draw_text_at(rect.position + Vector2(8, 31) * s, labels[name], Color(0.94, 0.98, 1.0), max(9, int(12 * s)))

func draw_messages() -> void:
	if message_timer > 0.0:
		var msg_w := minf(size.x - 24.0, 680.0)
		var msg_y := 202.0 if should_show_touch() else (52.0 if mode == "Learncade" else 12.0)
		draw_rect(Rect2(Vector2(size.x * 0.5 - msg_w * 0.5, msg_y), Vector2(msg_w, 30)), Color(0.0, 0.0, 0.0, 0.62))
		draw_text_at(Vector2(size.x * 0.5 - msg_w * 0.5 + 12.0, msg_y + 21.0), message, Color(0.95, 0.98, 1.0), 14)
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
