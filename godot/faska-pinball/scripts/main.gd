extends Control

const VIEW_W := 1280.0
const VIEW_H := 720.0
const TABLE_X := 330.0
const TABLE_Y := 38.0
const TABLE_W := 620.0
const TABLE_H := 650.0
const LEFT_WALL := TABLE_X + 34.0
const RIGHT_WALL := TABLE_X + TABLE_W - 34.0
const TOP_WALL := TABLE_Y + 34.0
const DRAIN_Y := TABLE_Y + TABLE_H + 20.0
const BALL_R := 12.0
const GRAVITY := 760.0
const MAX_LEARN := 8
const BALL_SAVE_TIME := 8.0
const SKILL_SHOT_TIME := 5.8
const COMBO_WINDOW := 4.2
const MISSION_TIME := 44.0
const TILT_WINDOW := 3.2
const TILT_LIMIT := 3.0
const TILT_LOCK_TIME := 2.8

const LESSONS = ["WORTART", "LESEN", "SATZ", "KOMPOSITUM", "MATHE", "ENGLISCH", "SACHKUNDE"]
const MISSIONS = [
	{"id": "lanes", "label": "Spell LEAR", "goal": 4, "hint": "Triff vier obere Lanes."},
	{"id": "drops", "label": "Dropbank", "goal": 4, "hint": "Raeume FASK ab."},
	{"id": "ramps", "label": "Ramp Run", "goal": 3, "hint": "Triff Rampen oder Orbits."},
	{"id": "learn", "label": "Learncade", "goal": 3, "hint": "Loese drei Lernziele."}
]

const BUMPERS = [
	{"id": "b1", "pos": Vector2(518, 228), "r": 34.0, "value": 260, "color": "#22d3ee"},
	{"id": "b2", "pos": Vector2(640, 162), "r": 38.0, "value": 320, "color": "#facc15"},
	{"id": "b3", "pos": Vector2(762, 228), "r": 34.0, "value": 260, "color": "#fb7185"},
	{"id": "b4", "pos": Vector2(640, 342), "r": 43.0, "value": 420, "color": "#a78bfa"}
]

const LANES = [
	{"id": "lane-l", "label": "L", "rect": Rect2(448, 112, 62, 34), "value": 220},
	{"id": "lane-e", "label": "E", "rect": Rect2(544, 106, 62, 34), "value": 220},
	{"id": "lane-a", "label": "A", "rect": Rect2(674, 106, 62, 34), "value": 220},
	{"id": "lane-r", "label": "R", "rect": Rect2(770, 112, 62, 34), "value": 220},
	{"id": "orbit-l", "label": "2X", "rect": Rect2(392, 330, 54, 90), "value": 520},
	{"id": "orbit-r", "label": "BALL", "rect": Rect2(834, 330, 54, 90), "value": 720}
]

const DROPS = [
	{"id": "drop-f", "label": "F", "rect": Rect2(494, 292, 42, 56), "value": 380},
	{"id": "drop-a", "label": "A", "rect": Rect2(566, 272, 42, 56), "value": 380},
	{"id": "drop-s", "label": "S", "rect": Rect2(672, 272, 42, 56), "value": 380},
	{"id": "drop-k", "label": "K", "rect": Rect2(744, 292, 42, 56), "value": 380}
]

const RAMPS = [
	{"id": "left-ramp", "label": "ORBIT", "rect": Rect2(388, 426, 72, 128), "dir": -1, "value": 650},
	{"id": "right-ramp", "label": "RAMP", "rect": Rect2(820, 426, 72, 128), "dir": 1, "value": 760}
]

const TASKS_WORD = [
	{"prompt": "Welche Wortart ist 'rollt'?", "answer": "Verb", "options": ["Nomen", "Verb", "Adjektiv"]},
	{"prompt": "Welche Wortart ist 'hell'?", "answer": "Adjektiv", "options": ["Adjektiv", "Verb", "Nomen"]},
	{"prompt": "Welches Wort ist ein Nomen?", "answer": "Flipper", "options": ["schnell", "Flipper", "springt"]},
	{"prompt": "Welche Wortart ist 'unter'?", "answer": "Praeposition", "options": ["Nomen", "Verb", "Praeposition"]},
	{"prompt": "Welche Wortart ist 'wir'?", "answer": "Pronomen", "options": ["Pronomen", "Artikel", "Adjektiv"]}
]

const TASKS_READING = [
	{"prompt": "Lies genau: Triff das Rampen-Ziel.", "answer": "Rampen-Ziel", "options": ["Bumper", "Rampen-Ziel", "Drain"]},
	{"prompt": "Welches Wort reimt sich auf Ball?", "answer": "Knall", "options": ["Knall", "Berg", "Tisch"]},
	{"prompt": "Was bedeutet 'Jackpot' im Spiel?", "answer": "Bonus", "options": ["Bonus", "Pause", "Fehler"]},
	{"prompt": "Welches Wort hat zwei Silben?", "answer": "Luna", "options": ["Ball", "Luna", "Tor"]},
	{"prompt": "Welches Wort ist am laengsten?", "answer": "Magnetrampe", "options": ["Tor", "Ball", "Magnetrampe"]}
]

const TASKS_SENTENCE = [
	{"prompt": "Was ist das Subjekt? Der Ball rollt.", "answer": "Der Ball", "options": ["Der Ball", "rollt", "schnell"]},
	{"prompt": "Was ist das Praedikat? Bruno flippert.", "answer": "flippert", "options": ["Bruno", "flippert", "laut"]},
	{"prompt": "Was fehlt? Die Kugel ___ zur Rampe.", "answer": "rollt", "options": ["rollt", "blau", "unter"]},
	{"prompt": "Welcher Satz ist richtig?", "answer": "Luna trifft den Bumper.", "options": ["Trifft Luna Bumper den.", "Luna trifft den Bumper.", "Den Luna trifft Bumper."]},
	{"prompt": "Welches Satzzeichen passt? Wo ist der Ball", "answer": "?", "options": [".", "?", ","]}
]

const TASKS_COMPOUND = [
	{"prompt": "Bilde Flipper + Tisch.", "answer": "Flippertisch", "options": ["Tischflipper", "Flippertisch", "Flippisch"]},
	{"prompt": "Welche Teile hat Magnetlock?", "answer": "Magnet + Lock", "options": ["Magnet + Lock", "Magie + Stock", "Lock + Magnet"]},
	{"prompt": "Was ist das Grundwort von Punktestand?", "answer": "Stand", "options": ["Punkte", "Stand", "stehen"]},
	{"prompt": "Welches Wort ist kein Kompositum?", "answer": "schnell", "options": ["Rampenlicht", "Ballspur", "schnell"]},
	{"prompt": "Was entsteht aus Bonus + Kugel?", "answer": "Bonuskugel", "options": ["Kugelbonus", "Bonuskugel", "Bonung"]}
]

const TASKS_MATH = [
	{"prompt": "9 x 6 = ?", "answer": "54", "options": ["45", "54", "63"]},
	{"prompt": "72 : 8 = ?", "answer": "9", "options": ["8", "9", "12"]},
	{"prompt": "125 + 75 = ?", "answer": "200", "options": ["180", "200", "225"]},
	{"prompt": "Welche Zahl ist gerade?", "answer": "48", "options": ["37", "48", "55"]},
	{"prompt": "Was ist 7 x 8?", "answer": "56", "options": ["48", "56", "64"]}
]

const TASKS_ENGLISH = [
	{"prompt": "Was bedeutet 'ball'?", "answer": "Ball", "options": ["Ball", "Bett", "Buch"]},
	{"prompt": "Was bedeutet 'score'?", "answer": "Punkte", "options": ["Schalter", "Punkte", "Fenster"]},
	{"prompt": "Was bedeutet 'target'?", "answer": "Ziel", "options": ["Zahl", "Ziel", "Zeit"]},
	{"prompt": "Was bedeutet 'bright'?", "answer": "hell", "options": ["hell", "rund", "leer"]},
	{"prompt": "Was bedeutet 'ramp'?", "answer": "Rampe", "options": ["Rampe", "Rand", "Ruhe"]}
]

const TASKS_SCIENCE = [
	{"prompt": "Magnete ziehen ... an.", "answer": "Eisen", "options": ["Holz", "Eisen", "Wasser"]},
	{"prompt": "Was zieht ein Magnet an?", "answer": "Metall", "options": ["Papier", "Metall", "Wolle"]},
	{"prompt": "Warum rollt die Kugel nach unten?", "answer": "Schwerkraft", "options": ["Schwerkraft", "Licht", "Laerm"]},
	{"prompt": "Was bremst Bewegung?", "answer": "Reibung", "options": ["Reibung", "Mond", "Farbe"]},
	{"prompt": "Was speichert Energie?", "answer": "Feder", "options": ["Feder", "Nebel", "Papier"]}
]

var font
var rng := RandomNumberGenerator.new()
var balls := []
var particles := []
var floaters := []
var lit_lanes := {}
var down_drops := {}
var learn_targets := []
var repeat_queue: Array = []
var active_task := {}
var mode := "Normal"
var phase := "run"
var score := 0
var ball_stock := 3
var multiplier := 1
var locked_balls := 0
var jackpot := 10000
var wizard := false
var combo := 0
var max_combo := 0
var combo_timer := 0.0
var mission_index := 0
var mission_progress := 0
var mission_timer := 0.0
var skill_shot_timer := 0.0
var skill_shot_power := 0.0
var ball_save_timer := 0.0
var tilt_meter := 0.0
var tilt_timer := 0.0
var tilt_lock_timer := 0.0
var super_jackpot_lit := false
var learn_correct := 0
var learn_streak := 0
var lesson_index := 0
var question_index := 0
var plunger := 0.0
var left_flip := 0.0
var right_flip := 0.0
var nudge_cd := 0.0
var message := ""
var message_timer := 0.0
var shake := 0.0
var elapsed := 0.0
var key_memory := {}
var touch_buttons := {}
var touch_button_state := {}
var touch_edges := {}

func _ready() -> void:
	rng.seed = 441909
	font = get_theme_default_font()
	mouse_filter = Control.MOUSE_FILTER_PASS
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	reset_game()

func reset_game() -> void:
	balls.clear()
	particles.clear()
	floaters.clear()
	lit_lanes.clear()
	down_drops.clear()
	learn_targets.clear()
	repeat_queue.clear()
	active_task.clear()
	mode = "Normal"
	phase = "run"
	score = 0
	ball_stock = 3
	multiplier = 1
	locked_balls = 0
	jackpot = 10000
	wizard = false
	combo = 0
	max_combo = 0
	combo_timer = 0.0
	mission_index = 0
	mission_progress = 0
	mission_timer = MISSION_TIME
	skill_shot_timer = 0.0
	skill_shot_power = 0.0
	ball_save_timer = 0.0
	tilt_meter = 0.0
	tilt_timer = 0.0
	tilt_lock_timer = 0.0
	super_jackpot_lit = false
	learn_correct = 0
	learn_streak = 0
	lesson_index = 0
	question_index = 0
	plunger = 0.0
	nudge_cd = 0.0
	key_memory.clear()
	touch_buttons.clear()
	touch_button_state.clear()
	touch_edges.clear()
	spawn_ball(true)
	message = "FASKA PINBALL PRO - Space halten und Skill-Shot suchen."
	message_timer = 2.5

func spawn_ball(held := true, offset := 0.0) -> void:
	balls.append({
		"pos": Vector2(RIGHT_WALL - 26.0 + offset, TABLE_Y + TABLE_H - 118.0),
		"vel": Vector2.ZERO,
		"held": held,
		"alive": true,
		"lock_cd": 0.0,
		"target_cd": 0.0,
		"trail": []
	})

func _process(delta: float) -> void:
	elapsed += delta
	if key_once(KEY_R):
		reset_game()
	if phase == "run":
		update_game(delta)
	elif key_once(KEY_ENTER) or key_once(KEY_SPACE) or consume_touch_edge("plunger"):
		reset_game()
	update_timers(delta)
	queue_redraw()

func update_timers(delta: float) -> void:
	message_timer = maxf(0.0, message_timer - delta)
	shake = maxf(0.0, shake - delta)
	nudge_cd = maxf(0.0, nudge_cd - delta)
	combo_timer = maxf(0.0, combo_timer - delta)
	if combo_timer <= 0.0:
		combo = 0
	skill_shot_timer = maxf(0.0, skill_shot_timer - delta)
	ball_save_timer = maxf(0.0, ball_save_timer - delta)
	tilt_timer = maxf(0.0, tilt_timer - delta)
	if tilt_timer <= 0.0:
		tilt_meter = maxf(0.0, tilt_meter - delta * 0.7)
	tilt_lock_timer = maxf(0.0, tilt_lock_timer - delta)
	mission_timer = maxf(0.0, mission_timer - delta)
	if mission_timer <= 0.0:
		fail_mission()

func update_game(delta: float) -> void:
	if key_once(KEY_L) or consume_touch_edge("learn"):
		toggle_mode()
	if key_once(KEY_C) or consume_touch_edge("subject"):
		cycle_subject()
	var flippers_locked := tilt_lock_timer > 0.0
	var left_down := not flippers_locked and (Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT) or bool(touch_button_state.get("left", false)))
	var right_down := not flippers_locked and (Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT) or bool(touch_button_state.get("right", false)))
	left_flip = move_toward(left_flip, 1.0 if left_down else 0.0, delta * 8.5)
	right_flip = move_toward(right_flip, 1.0 if right_down else 0.0, delta * 8.5)
	if (Input.is_key_pressed(KEY_SPACE) or bool(touch_button_state.get("plunger", false))) and has_held_ball():
		plunger = minf(1.0, plunger + delta * 0.82)
	elif plunger > 0.0:
		launch_held_balls()
	if (key_once(KEY_N) or consume_touch_edge("nudge")) and nudge_cd <= 0.0:
		nudge_table()
	for ball in balls:
		update_ball(ball, delta)
	balls = balls.filter(func(ball): return bool(ball.alive))
	if balls.size() == 0:
		ball_stock -= 1
		if ball_stock > 0:
			spawn_ball(true)
			message = "Naechste Kugel."
			message_timer = 1.4
		else:
			phase = "over"
			message = "Alle Kugeln verloren."
			message_timer = 99.0
	update_particles(delta)
	update_floaters(delta)

func has_held_ball() -> bool:
	for ball in balls:
		if bool(ball.held):
			return true
	return false

func launch_held_balls() -> void:
	for ball in balls:
		if bool(ball.held):
			ball.held = false
			ball.vel = Vector2(rng.randf_range(-80.0, -28.0), -850.0 - plunger * 780.0)
			spawn_particles(ball.pos, Color.html("#facc15"), 16, 180.0)
	skill_shot_timer = SKILL_SHOT_TIME
	skill_shot_power = plunger
	ball_save_timer = BALL_SAVE_TIME
	plunger = 0.0

func nudge_table() -> void:
	nudge_cd = 0.9
	shake = 0.16
	tilt_timer = TILT_WINDOW
	tilt_meter += 1.0
	if tilt_meter >= TILT_LIMIT:
		tilt_lock_timer = TILT_LOCK_TIME
		tilt_meter = 0.0
		combo = 0
		score = maxi(0, score - 1200)
		add_floater(Vector2(TABLE_X + TABLE_W * 0.5, 590), "TILT - FLIPPER LOCK", Color.html("#fecaca"))
		message = "Tilt: zu viel geschoben, Flipper kurz gesperrt."
		message_timer = 1.8
	for ball in balls:
		ball.vel += Vector2(rng.randf_range(-165.0, 165.0), -95.0)
	add_floater(Vector2(TABLE_X + TABLE_W * 0.5, 600), "NUDGE", Color.html("#facc15"))

func update_ball(ball: Dictionary, delta: float) -> void:
	ball.lock_cd = maxf(0.0, float(ball.lock_cd) - delta)
	ball.target_cd = maxf(0.0, float(ball.target_cd) - delta)
	if bool(ball.held):
		ball.pos = Vector2(RIGHT_WALL - 26.0, TABLE_Y + TABLE_H - 118.0 + sin(elapsed * 5.0) * 3.0)
		return
	ball.vel += Vector2(0, GRAVITY) * delta
	ball.vel *= 0.998
	ball.pos += Vector2(ball.vel) * delta
	collide_walls(ball)
	collide_bumpers(ball)
	collide_targets(ball)
	collide_learn_targets(ball)
	collide_ramps(ball)
	collide_magnet(ball)
	collide_flippers(ball)
	var trail: Array = ball.trail
	trail.append(Vector2(ball.pos))
	if trail.size() > 12:
		trail.pop_front()
	ball.trail = trail
	if float(ball.pos.y) > DRAIN_Y:
		if ball_save_timer > 0.0:
			ball.pos = Vector2(RIGHT_WALL - 26.0, TABLE_Y + TABLE_H - 118.0)
			ball.vel = Vector2(rng.randf_range(-60.0, 60.0), -780.0)
			ball.trail = []
			spawn_particles(ball.pos, Color.html("#67e8f9"), 22, 240.0)
			add_floater(ball.pos, "BALL SAVE", Color.html("#67e8f9"))
			ball_save_timer = 0.0
		else:
			ball.alive = false
			end_ball_bonus(ball.pos)
			spawn_particles(ball.pos, Color.html("#fecaca"), 18, 220.0)

func collide_walls(ball: Dictionary) -> void:
	var pos: Vector2 = ball.pos
	var vel: Vector2 = ball.vel
	if pos.x - BALL_R < LEFT_WALL:
		pos.x = LEFT_WALL + BALL_R
		vel.x = absf(vel.x) * 0.88
	if pos.x + BALL_R > RIGHT_WALL:
		pos.x = RIGHT_WALL - BALL_R
		vel.x = -absf(vel.x) * 0.88
	if pos.y - BALL_R < TOP_WALL:
		pos.y = TOP_WALL + BALL_R
		vel.y = absf(vel.y) * 0.9
	var lane_x := RIGHT_WALL - 58.0
	if pos.x > lane_x and pos.y > TABLE_Y + 470.0 and vel.x < 0.0:
		pos.x = lane_x
		vel.x = absf(vel.x) * 0.75
	ball.pos = pos
	ball.vel = vel

func collide_bumpers(ball: Dictionary) -> void:
	for bumper in BUMPERS:
		var center: Vector2 = bumper.pos
		var diff: Vector2 = Vector2(ball.pos) - center
		var min_dist := BALL_R + float(bumper.r)
		if diff.length() < min_dist:
			var normal := diff.normalized()
			if normal.length() <= 0.01:
				normal = Vector2.UP
			ball.pos = center + normal * min_dist
			ball.vel = normal * maxf(560.0, Vector2(ball.vel).length() * 1.08)
			add_score(int(bumper.value), Vector2(ball.pos), "BUMPER")
			spawn_particles(center, Color.html(str(bumper.color)), 12, 180.0)
			shake = maxf(shake, 0.08)

func collide_targets(ball: Dictionary) -> void:
	if float(ball.target_cd) > 0.0:
		return
	for lane in LANES:
		var rect: Rect2 = lane.rect
		if rect.grow(BALL_R).has_point(Vector2(ball.pos)):
			lit_lanes[str(lane.id)] = true
			add_score(int(lane.value), rect.get_center(), str(lane.label))
			register_shot("ramp" if str(lane.id).begins_with("orbit") else "lane", rect.get_center(), str(lane.label))
			resolve_skill_shot(rect.get_center(), str(lane.label))
			ball.vel.y = -absf(float(ball.vel.y)) - 120.0
			ball.target_cd = 0.16
			if str(lane.id) == "orbit-r":
				start_multiball()
			if lit_lanes.size() >= 4:
				multiplier = mini(5, multiplier + 1)
				lit_lanes.clear()
				add_floater(rect.get_center(), str(multiplier) + "X", Color.html("#facc15"))
			return
	for drop in DROPS:
		if bool(down_drops.get(str(drop.id), false)):
			continue
		var drect: Rect2 = drop.rect
		if drect.grow(BALL_R).has_point(Vector2(ball.pos)):
			down_drops[str(drop.id)] = true
			add_score(int(drop.value), drect.get_center(), str(drop.label))
			register_shot("drop", drect.get_center(), str(drop.label))
			ball.vel.y = -absf(float(ball.vel.y)) - 160.0
			ball.target_cd = 0.16
			if down_drops.size() >= DROPS.size():
				down_drops.clear()
				jackpot += 4500
				add_floater(Vector2(640, 286), "DROPBANK", Color.html("#facc15"))
			return

func collide_ramps(ball: Dictionary) -> void:
	for ramp in RAMPS:
		var rect: Rect2 = ramp.rect
		if rect.grow(BALL_R).has_point(Vector2(ball.pos)) and float(ball.vel.y) < 0.0:
			ball.vel = Vector2(float(ramp.dir) * 360.0, -720.0)
			add_score(int(ramp.value), rect.get_center(), str(ramp.label))
			register_shot("ramp", rect.get_center(), str(ramp.label))
			spawn_particles(rect.get_center(), Color.html("#67e8f9"), 12, 180.0)
			if super_jackpot_lit:
				add_score(jackpot * 2, rect.get_center(), "SUPER JACKPOT")
				super_jackpot_lit = false
				jackpot += 3500
			elif wizard:
				add_score(jackpot, rect.get_center(), "JACKPOT")
			return

func collide_magnet(ball: Dictionary) -> void:
	var lock_pos := Vector2(640, 282)
	if float(ball.lock_cd) > 0.0:
		return
	if Vector2(ball.pos).distance_to(lock_pos) < 36.0 and Vector2(ball.vel).length() < 920.0:
		locked_balls += 1
		ball.lock_cd = 1.8
		ball.pos = lock_pos
		ball.vel = Vector2(rng.randf_range(-170.0, 170.0), -620.0)
		add_score(900, lock_pos, "LOCK")
		if locked_balls >= 2:
			locked_balls = 0
			start_multiball()

func collide_flippers(ball: Dictionary) -> void:
	var left_a := Vector2(470, 620)
	var left_b := left_a + Vector2(138, lerpf(-22.0, -96.0, left_flip))
	var right_a := Vector2(810, 620)
	var right_b := right_a + Vector2(-138, lerpf(-22.0, -96.0, right_flip))
	collide_flipper_segment(ball, left_a, left_b, true)
	collide_flipper_segment(ball, right_a, right_b, false)

func collide_flipper_segment(ball: Dictionary, a: Vector2, b: Vector2, left := true) -> void:
	var ab := b - a
	var t := clampf((Vector2(ball.pos) - a).dot(ab) / ab.length_squared(), 0.0, 1.0)
	var closest := a + ab * t
	var diff := Vector2(ball.pos) - closest
	if diff.length() < BALL_R + 8.0 and float(ball.vel.y) > -260.0:
		var normal := diff.normalized()
		if normal.length() <= 0.01:
			normal = Vector2.UP
		var power := 1.0 + (left_flip if left else right_flip) * 1.65
		ball.pos = closest + normal * (BALL_R + 8.0)
		ball.vel = Vector2((1.0 if left else -1.0) * 170.0 * power, -620.0 * power)
		spawn_particles(closest, Color.html("#f8fafc"), 6, 120.0)

func start_multiball() -> void:
	if balls.size() >= 4:
		return
	for i in range(2):
		spawn_ball(false, float(i - 1) * 22.0)
		balls[balls.size() - 1].vel = Vector2(rng.randf_range(-260.0, 260.0), -760.0 - float(i) * 80.0)
	wizard = true
	add_floater(Vector2(640, 250), "MULTIBALL", Color.html("#facc15"))
	spawn_particles(Vector2(640, 250), Color.html("#facc15"), 30, 320.0)

func collide_learn_targets(ball: Dictionary) -> void:
	if mode != "Lernen" or float(ball.target_cd) > 0.0:
		return
	for target in learn_targets:
		var rect: Rect2 = target.rect
		if rect.grow(BALL_R).has_point(Vector2(ball.pos)):
			ball.vel.y = -absf(float(ball.vel.y)) - 140.0
			ball.target_cd = 0.18
			if bool(target.correct):
				learn_correct += 1
				learn_streak += 1
				add_score(1200, rect.get_center(), "RICHTIG")
				register_shot("learn", rect.get_center(), "LEARN")
				active_task.clear()
				learn_targets.clear()
				if learn_correct >= MAX_LEARN:
					jackpot += 12000
					message = "Lernziel erreicht - Jackpot steigt."
					message_timer = 1.8
			else:
				learn_streak = 0
				repeat_queue.append(active_task.duplicate(true))
				score = maxi(0, score - 500)
				add_floater(rect.get_center(), "WIEDERHOLUNG", Color.html("#fecaca"))
				active_task.clear()
				learn_targets.clear()
			ensure_learn_targets()
			return

func register_shot(kind: String, pos: Vector2, label: String) -> void:
	combo += 1
	combo_timer = COMBO_WINDOW
	max_combo = maxi(max_combo, combo)
	if combo >= 2:
		var combo_bonus := combo * 140 * multiplier
		score += combo_bonus
		add_floater(pos + Vector2(0, -22), "COMBO " + str(combo) + " +" + str(combo_bonus), Color.html("#67e8f9"))
	if combo >= 5:
		jackpot += 900
	if combo >= 7:
		super_jackpot_lit = true
	advance_mission(kind, pos, label)

func resolve_skill_shot(pos: Vector2, label: String) -> void:
	if skill_shot_timer <= 0.0:
		return
	var power_error := absf(skill_shot_power - 0.72)
	var bonus := 1800
	var grade := "SKILL"
	if power_error < 0.08:
		bonus = 5200
		grade = "PERFECT SKILL"
	elif power_error < 0.18:
		bonus = 3200
		grade = "GREAT SKILL"
	score += bonus * multiplier
	jackpot += bonus
	add_floater(pos, grade + " " + label + " +" + str(bonus * multiplier), Color.html("#facc15"))
	spawn_particles(pos, Color.html("#facc15"), 22, 260.0)
	skill_shot_timer = 0.0

func current_mission() -> Dictionary:
	return MISSIONS[mission_index % MISSIONS.size()]

func advance_mission(kind: String, pos: Vector2, label: String) -> void:
	var mission: Dictionary = current_mission()
	var mission_id := str(mission.id)
	var counts := false
	if mission_id == "lanes":
		counts = kind == "lane"
	elif mission_id == "drops":
		counts = kind == "drop"
	elif mission_id == "ramps":
		counts = kind == "ramp"
	elif mission_id == "learn":
		counts = kind == "learn"
	if not counts:
		return
	mission_progress += 1
	add_floater(pos + Vector2(0, -42), str(mission.label) + " " + str(mission_progress) + "/" + str(mission.goal), Color.html("#c084fc"))
	if mission_progress >= int(mission.goal):
		complete_mission(pos, label)

func complete_mission(pos: Vector2, label: String) -> void:
	var mission: Dictionary = current_mission()
	var reward := (3600 + mission_index * 850) * multiplier
	score += reward
	jackpot += 5200 + mission_index * 600
	super_jackpot_lit = true
	multiplier = mini(6, multiplier + 1)
	spawn_particles(pos, Color.html("#c084fc"), 34, 330.0)
	add_floater(pos, "MISSION " + str(mission.label) + " +" + str(reward), Color.html("#facc15"))
	message = str(mission.label) + " geschafft durch " + label + ". Super-Jackpot ist an."
	message_timer = 2.2
	mission_index = (mission_index + 1) % MISSIONS.size()
	mission_progress = 0
	mission_timer = MISSION_TIME
	if str(current_mission().id) == "learn" and mode != "Lernen":
		mode = "Lernen"
		ensure_learn_targets()

func fail_mission() -> void:
	if phase != "run":
		return
	var mission: Dictionary = current_mission()
	add_floater(Vector2(TABLE_X + TABLE_W * 0.5, 214), "MISSION WECHSEL", Color.html("#fecaca"))
	message = str(mission.label) + " verpasst - neues Ziel: " + str(MISSIONS[(mission_index + 1) % MISSIONS.size()].label)
	message_timer = 1.7
	mission_index = (mission_index + 1) % MISSIONS.size()
	mission_progress = 0
	mission_timer = MISSION_TIME

func end_ball_bonus(pos: Vector2) -> void:
	var bonus := (max_combo * 180 + learn_streak * 320 + locked_balls * 420) * multiplier
	if bonus <= 0:
		return
	score += bonus
	add_floater(pos, "END BONUS +" + str(bonus), Color.html("#facc15"))
	combo = 0
	combo_timer = 0.0
	max_combo = 0

func add_score(value: int, pos: Vector2, label: String) -> void:
	var points := value * multiplier
	score += points
	add_floater(pos, label + " +" + str(points), Color.html("#facc15"))

func toggle_mode() -> void:
	mode = "Lernen" if mode == "Normal" else "Normal"
	active_task.clear()
	learn_targets.clear()
	if mode == "Lernen":
		ensure_learn_targets()
	message = "Modus: " + mode
	message_timer = 1.2

func cycle_subject() -> void:
	lesson_index = (lesson_index + 1) % LESSONS.size()
	active_task.clear()
	learn_targets.clear()
	if mode == "Lernen":
		ensure_learn_targets()
	message = "Fach: " + str(LESSONS[lesson_index])
	message_timer = 1.1

func ensure_learn_targets() -> void:
	if mode != "Lernen" or learn_targets.size() > 0:
		return
	if active_task.size() == 0:
		active_task = next_task()
	var positions = [Rect2(462, 392, 108, 42), Rect2(586, 448, 108, 42), Rect2(710, 392, 108, 42)]
	var options: Array = active_task.options
	for i in range(mini(options.size(), positions.size())):
		learn_targets.append({"label": str(options[i]), "correct": str(options[i]) == str(active_task.answer), "rect": positions[i]})

func next_task() -> Dictionary:
	if repeat_queue.size() > 0:
		return repeat_queue.pop_front()
	var bank := get_bank()
	var task := Dictionary(bank[question_index % bank.size()]).duplicate(true)
	question_index += 1
	return task

func get_bank() -> Array:
	match str(LESSONS[lesson_index]):
		"WORTART":
			return TASKS_WORD
		"LESEN":
			return TASKS_READING
		"SATZ":
			return TASKS_SENTENCE
		"KOMPOSITUM":
			return TASKS_COMPOUND
		"MATHE":
			return TASKS_MATH
		"ENGLISCH":
			return TASKS_ENGLISH
		_:
			return TASKS_SCIENCE

func update_particles(delta: float) -> void:
	for particle in particles:
		particle.life -= delta
		particle.pos += Vector2(particle.vel) * delta
		particle.vel = Vector2(particle.vel) * 0.9
	particles = particles.filter(func(p): return float(p.life) > 0.0)

func update_floaters(delta: float) -> void:
	for floater in floaters:
		floater.life -= delta
		floater.pos.y -= 48.0 * delta
	floaters = floaters.filter(func(f): return float(f.life) > 0.0)

func spawn_particles(pos: Vector2, color: Color, count: int, speed: float) -> void:
	for i in range(count):
		var angle := TAU * float(i) / float(count) + rng.randf_range(-0.25, 0.25)
		var burst := speed * rng.randf_range(0.35, 1.0)
		particles.append({"pos": pos, "vel": Vector2(cos(angle), sin(angle)) * burst, "life": rng.randf_range(0.25, 0.82), "color": color, "size": rng.randf_range(2.0, 6.0)})

func add_floater(pos: Vector2, text: String, color: Color) -> void:
	floaters.append({"pos": pos, "text": text, "color": color, "life": 1.05})

func key_once(code: int) -> bool:
	var id := str(code)
	var pressed := Input.is_key_pressed(code)
	var was := bool(key_memory.get(id, false))
	key_memory[id] = pressed
	return pressed and not was

func consume_touch_edge(action: String) -> bool:
	var edge := bool(touch_edges.get(action, false))
	touch_edges[action] = false
	return edge

func _gui_input(event: InputEvent) -> void:
	if not should_show_touch():
		return
	if event is InputEventScreenTouch:
		if event.pressed:
			var action := button_at(event.position)
			if action != "":
				touch_buttons[event.index] = action
				touch_edges[action] = true
				refresh_touch_buttons()
		else:
			if touch_buttons.has(event.index):
				touch_buttons.erase(event.index)
				refresh_touch_buttons()

func refresh_touch_buttons() -> void:
	touch_button_state.clear()
	for key in touch_buttons.keys():
		touch_button_state[str(touch_buttons[key])] = true

func should_show_touch() -> bool:
	return size.x < 980.0 or size.y > size.x * 1.15

func ui_scale() -> float:
	if size.y > size.x * 1.25:
		return 0.92
	if size.x <= 560.0:
		return 0.9
	return 1.0

func button_layout() -> Array:
	var ui := ui_scale()
	var w := 92.0 * ui
	var h := 58.0 * ui
	var gap := 10.0 * ui
	var y := size.y - (h * 2.0 + gap + 54.0 * ui)
	var left_x := 22.0 * ui
	var right_x := size.x - (w * 3.0 + gap * 2.0 + 18.0 * ui)
	return [
		{"id": "left", "label": "A\nLinks", "rect": Rect2(Vector2(left_x, y + h + gap), Vector2(w, h))},
		{"id": "right", "label": "D\nRechts", "rect": Rect2(Vector2(right_x, y + h + gap), Vector2(w, h))},
		{"id": "plunger", "label": "Space\nStart", "rect": Rect2(Vector2(right_x + w + gap, y + h + gap), Vector2(w, h))},
		{"id": "nudge", "label": "N\nNudge", "rect": Rect2(Vector2(right_x + (w + gap) * 2.0, y + h + gap), Vector2(w, h))},
		{"id": "learn", "label": "L\nLern", "rect": Rect2(Vector2(right_x, y), Vector2(w, h))},
		{"id": "subject", "label": "C\nFach", "rect": Rect2(Vector2(right_x + w + gap, y), Vector2(w, h))}
	]

func button_at(pos: Vector2) -> String:
	for button in button_layout():
		var rect: Rect2 = button.rect
		if rect.has_point(pos):
			return str(button.id)
	return ""

func play_scale() -> float:
	if should_show_touch():
		return minf((size.x - 26.0) / TABLE_W, (size.y - 210.0) / TABLE_H)
	return minf(size.x / VIEW_W, size.y / VIEW_H)

func play_offset() -> Vector2:
	var s := play_scale()
	var top := 12.0 if should_show_touch() else (size.y - VIEW_H * s) * 0.5
	return Vector2((size.x - TABLE_W * s) * 0.5 - TABLE_X * s, top - TABLE_Y * s)

func sp(pos: Vector2) -> Vector2:
	return pos * play_scale() + play_offset()

func sr(rect: Rect2) -> Rect2:
	var s := play_scale()
	return Rect2(rect.position * s + play_offset(), rect.size * s)

func _draw() -> void:
	draw_background()
	draw_table()
	draw_balls()
	draw_particles_and_floaters()
	draw_hud()
	if should_show_touch():
		draw_touch_controls()

func draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color.html("#07111f"), true)
	for i in range(28):
		var x := fmod(float(i) * 83.0 + elapsed * 18.0, size.x + 120.0) - 60.0
		draw_line(Vector2(x, 0), Vector2(x - 120.0, size.y), Color(0.18, 0.32, 0.62, 0.12), 2.0)

func draw_table() -> void:
	var s := play_scale()
	var table := sr(Rect2(TABLE_X, TABLE_Y, TABLE_W, TABLE_H))
	draw_rect(table.grow(8.0 * s), Color.html("#020617"), true)
	draw_rect(table, Color.html("#13213a"), true)
	draw_rect(table, Color(0.78, 0.88, 1.0, 0.26), false, 4.0 * s)
	draw_line(sp(Vector2(LEFT_WALL, TOP_WALL)), sp(Vector2(LEFT_WALL, DRAIN_Y - 80.0)), Color.html("#93c5fd"), 4.0 * s)
	draw_line(sp(Vector2(RIGHT_WALL, TOP_WALL)), sp(Vector2(RIGHT_WALL, DRAIN_Y - 80.0)), Color.html("#93c5fd"), 4.0 * s)
	draw_line(sp(Vector2(LEFT_WALL, TOP_WALL)), sp(Vector2(RIGHT_WALL, TOP_WALL)), Color.html("#93c5fd"), 4.0 * s)
	draw_rect(sr(Rect2(RIGHT_WALL - 70.0, TABLE_Y + 444.0, 44.0, 188.0)), Color(0.02, 0.05, 0.09, 0.45), true)
	for lane in LANES:
		var rect := sr(lane.rect)
		var lit := bool(lit_lanes.get(str(lane.id), false))
		draw_rect(rect, Color.html("#facc15") if lit else Color.html("#334155"), true)
		draw_rect(rect, Color(1, 1, 1, 0.35), false, 2.0 * s)
		draw_string(font, rect.position + Vector2(0, rect.size.y * 0.67), str(lane.label), HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, int(16 * s), Color.html("#f8fafc"))
	for drop in DROPS:
		var rect2 := sr(drop.rect)
		var down := bool(down_drops.get(str(drop.id), false))
		draw_rect(rect2, Color.html("#1e293b") if down else Color.html("#fb7185"), true)
		draw_rect(rect2, Color(1, 1, 1, 0.28), false, 2.0 * s)
		draw_string(font, rect2.position + Vector2(0, rect2.size.y * 0.68), str(drop.label), HORIZONTAL_ALIGNMENT_CENTER, rect2.size.x, int(16 * s), Color.html("#f8fafc"))
	for bumper in BUMPERS:
		var p := sp(bumper.pos)
		draw_circle(p + Vector2(0, 7.0 * s), float(bumper.r) * s, Color(0, 0, 0, 0.28))
		draw_circle(p, float(bumper.r) * s, Color.html(str(bumper.color)))
		draw_circle(p, float(bumper.r) * 0.48 * s, Color(1, 1, 1, 0.24))
	for ramp in RAMPS:
		var r := sr(ramp.rect)
		draw_rect(r, Color(0.34, 0.74, 1.0, 0.16), true)
		draw_rect(r, Color.html("#67e8f9"), false, 3.0 * s)
		draw_string(font, r.position + Vector2(0, r.size.y * 0.54), str(ramp.label), HORIZONTAL_ALIGNMENT_CENTER, r.size.x, int(14 * s), Color.html("#c7d2fe"))
	draw_circle(sp(Vector2(640, 282)), 38.0 * s, Color(0.88, 0.72, 1.0, 0.16))
	draw_arc(sp(Vector2(640, 282)), 38.0 * s, 0, TAU, 40, Color.html("#c084fc"), 3.0 * s)
	draw_flippers()
	draw_learn_targets()

func draw_flippers() -> void:
	var s := play_scale()
	var left_a := Vector2(470, 620)
	var left_b := left_a + Vector2(138, lerpf(-22.0, -96.0, left_flip))
	var right_a := Vector2(810, 620)
	var right_b := right_a + Vector2(-138, lerpf(-22.0, -96.0, right_flip))
	draw_line(sp(left_a), sp(left_b), Color.html("#facc15"), 15.0 * s)
	draw_line(sp(right_a), sp(right_b), Color.html("#facc15"), 15.0 * s)
	draw_circle(sp(left_a), 11.0 * s, Color.html("#f8fafc"))
	draw_circle(sp(right_a), 11.0 * s, Color.html("#f8fafc"))
	if plunger > 0.0:
		var bar := sr(Rect2(RIGHT_WALL - 24.0, TABLE_Y + 574.0 - plunger * 118.0, 14.0, plunger * 118.0))
		draw_rect(bar, Color.html("#facc15"), true)

func draw_learn_targets() -> void:
	if mode != "Lernen":
		return
	var s := play_scale()
	for target in learn_targets:
		var rect := sr(target.rect)
		draw_rect(rect, Color(0.92, 0.96, 1.0, 0.92), true)
		draw_rect(rect, Color(0.38, 0.67, 1.0, 0.8), false, 3.0 * s)
		draw_string(font, rect.position + Vector2(0, rect.size.y * 0.66), str(target.label), HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, int(15 * s), Color.html("#0f172a"))

func draw_balls() -> void:
	var s := play_scale()
	for ball in balls:
		var trail: Array = ball.trail
		for i in range(trail.size()):
			var alpha := float(i) / float(maxi(1, trail.size())) * 0.28
			draw_circle(sp(trail[i]), BALL_R * s * 0.55, Color(0.72, 0.88, 1.0, alpha))
		draw_circle(sp(ball.pos) + Vector2(0, 5.0 * s), BALL_R * 1.05 * s, Color(0, 0, 0, 0.34))
		draw_circle(sp(ball.pos), BALL_R * s, Color.html("#e5e7eb"))
		draw_circle(sp(ball.pos) + Vector2(-4.0 * s, -4.0 * s), 4.0 * s, Color.html("#ffffff"))

func draw_particles_and_floaters() -> void:
	var s := play_scale()
	for particle in particles:
		var c: Color = particle.color
		c.a = clampf(float(particle.life) / 0.82, 0.0, 1.0)
		draw_circle(sp(particle.pos), float(particle.size) * s, c)
	for floater in floaters:
		var c2: Color = floater.color
		c2.a = clampf(float(floater.life), 0.0, 1.0)
		draw_string(font, sp(floater.pos) + Vector2(-82.0 * s, 0), str(floater.text), HORIZONTAL_ALIGNMENT_CENTER, 164.0 * s, int(18 * s), c2)

func draw_hud() -> void:
	var compact := should_show_touch()
	var panel := Rect2(14, 12, minf(size.x - 28.0, 450.0 if compact else 560.0), 136.0)
	draw_rect(panel, Color(0.02, 0.05, 0.09, 0.78), true)
	draw_rect(panel, Color(0.78, 0.88, 1.0, 0.22), false, 2.0)
	draw_string(font, panel.position + Vector2(14, 25), "FASKA PINBALL PRO", HORIZONTAL_ALIGNMENT_LEFT, panel.size.x - 24.0, 20 if compact else 24, Color.html("#f8fafc"))
	draw_string(font, panel.position + Vector2(14, 52), "Score " + str(score) + "   Ball " + str(ball_stock) + "   " + str(multiplier) + "X   Jackpot " + str(jackpot), HORIZONTAL_ALIGNMENT_LEFT, panel.size.x - 24.0, 15, Color.html("#cbd5e1"))
	draw_string(font, panel.position + Vector2(14, 75), mode + " | " + str(LESSONS[lesson_index]) + " | Richtig " + str(learn_correct) + "/" + str(MAX_LEARN), HORIZONTAL_ALIGNMENT_LEFT, panel.size.x - 24.0, 13, Color.html("#fef3c7"))
	var mission: Dictionary = current_mission()
	draw_string(font, panel.position + Vector2(14, 98), "Mission " + str(mission.label) + " " + str(mission_progress) + "/" + str(mission.goal) + "  " + str(int(mission_timer)) + "s", HORIZONTAL_ALIGNMENT_LEFT, panel.size.x - 24.0, 13, Color.html("#ddd6fe"))
	var state := "Combo " + str(combo) + "  Max " + str(max_combo)
	if skill_shot_timer > 0.0:
		state += "  Skill-Shot " + str(int(skill_shot_timer)) + "s"
	if ball_save_timer > 0.0:
		state += "  Save " + str(int(ball_save_timer)) + "s"
	if super_jackpot_lit:
		state += "  SUPER"
	if tilt_lock_timer > 0.0:
		state += "  TILT LOCK"
	elif tilt_meter > 0.0:
		state += "  Tilt " + str(int(tilt_meter)) + "/" + str(int(TILT_LIMIT))
	draw_string(font, panel.position + Vector2(14, 121), state, HORIZONTAL_ALIGNMENT_LEFT, panel.size.x - 24.0, 12, Color.html("#bfdbfe"))
	if mode == "Lernen" and active_task.size() > 0:
		var qrect := Rect2(size.x * 0.5 - minf(430.0, size.x - 24.0) * 0.5, 156.0 if not compact else 150.0, minf(430.0, size.x - 24.0), 54.0)
		draw_rect(qrect, Color(0.92, 0.96, 1.0, 0.92), true)
		draw_rect(qrect, Color(0.38, 0.67, 1.0, 0.72), false, 2.0)
		draw_string(font, qrect.position + Vector2(12, 23), str(active_task.prompt), HORIZONTAL_ALIGNMENT_LEFT, qrect.size.x - 24.0, 17, Color.html("#0f172a"))
		draw_string(font, qrect.position + Vector2(12, 43), "Triff das richtige Learncade-Target.", HORIZONTAL_ALIGNMENT_LEFT, qrect.size.x - 24.0, 12, Color.html("#334155"))
	if message_timer > 0.0:
		var mrect := Rect2(size.x * 0.5 - 260.0, size.y - (182.0 if compact else 58.0), 520.0, 34.0)
		draw_rect(mrect, Color(0.02, 0.05, 0.09, 0.72), true)
		draw_string(font, mrect.position + Vector2(0, 23), message, HORIZONTAL_ALIGNMENT_CENTER, mrect.size.x, 15, Color.html("#f8fafc"))
	if phase == "over":
		draw_rect(Rect2(Vector2.ZERO, size), Color(0, 0, 0, 0.55), true)
		draw_string(font, Vector2(0, size.y * 0.45), "GAME OVER", HORIZONTAL_ALIGNMENT_CENTER, size.x, 46, Color.html("#f8fafc"))

func draw_touch_controls() -> void:
	for button in button_layout():
		var rect: Rect2 = button.rect
		var id := str(button.id)
		var active := bool(touch_button_state.get(id, false))
		draw_rect(rect, Color(0.02, 0.05, 0.09, 0.68), true)
		draw_rect(rect, Color.html("#facc15") if active else Color(0.78, 0.88, 1.0, 0.56), false, 3.0)
		var lines := str(button.label).split("\n")
		for i in range(lines.size()):
			draw_string(font, rect.position + Vector2(0, 23.0 + float(i) * 20.0), lines[i], HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, 15, Color.html("#f8fafc"))
