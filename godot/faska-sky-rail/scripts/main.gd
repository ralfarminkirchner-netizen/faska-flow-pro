extends Control

const MAX_HP := 140.0
const MAX_SHIELD := 100.0
const MAX_HEAT := 100.0
const MOVE_SPEED := 1.65
const RAIL_SPEED := 0.48
const RETICLE_R := 54.0
const LEARN_GOAL := 9
const COMBO_WINDOW := 3.8
const ROLL_COOLDOWN := 2.2
const OPERATION_TIME := 42.0
const OVERHEAT_LIMIT := 96.0

const LESSONS = ["WORTART", "LESEN", "SATZ", "KOMPOSITUM", "MATHE", "ENGLISCH", "SACHKUNDE"]
const OPERATIONS = [
	{"id": "rings", "label": "Apex-Route", "goal": 3, "hint": "Fliege durch Ringe."},
	{"id": "locks", "label": "Lock-on-Jagd", "goal": 4, "hint": "Triff Gegner mit Salven."},
	{"id": "ace", "label": "Ace-Hunter", "goal": 2, "hint": "Schalte Ace-Jets aus."},
	{"id": "learn", "label": "Learncade-Korridor", "goal": 3, "hint": "Nimm richtige Gates."},
	{"id": "survive", "label": "Schildlauf", "goal": 4, "hint": "Nutze Supply, Roll oder Nova."}
]

const TASKS_WORD = [
	{"prompt": "Welche Wortart ist 'fliegt'?", "answer": "Verb", "options": ["Nomen", "Verb", "Adjektiv"]},
	{"prompt": "Welches Wort ist ein Adjektiv?", "answer": "schnell", "options": ["Raum", "schnell", "fliegen"]},
	{"prompt": "Welches Wort ist ein Nomen?", "answer": "Rakete", "options": ["Rakete", "hell", "schwebt"]},
	{"prompt": "Welche Wortart ist 'durch'?", "answer": "Praeposition", "options": ["Verb", "Praeposition", "Artikel"]},
	{"prompt": "Welche Wortart verbindet Saetze?", "answer": "Konjunktion", "options": ["Konjunktion", "Nomen", "Adjektiv"]}
]

const TASKS_READING = [
	{"prompt": "Was bedeutet 'ausweichen'?", "answer": "nicht getroffen werden", "options": ["nicht getroffen werden", "einschlafen", "malen"]},
	{"prompt": "Welches Wort passt: Der Jet ___ durch Wolken.", "answer": "fliegt", "options": ["fliegt", "liest", "kocht"]},
	{"prompt": "Was ist ein Wingman?", "answer": "Begleitflieger", "options": ["Begleitflieger", "Bodenrad", "Buchseite"]},
	{"prompt": "Welches Wort reimt sich auf 'Stern'?", "answer": "fern", "options": ["fern", "Topf", "Licht"]},
	{"prompt": "Was passt zu 'Apex-Ring'?", "answer": "durchfliegen", "options": ["durchfliegen", "vergraben", "trinken"]}
]

const TASKS_SENTENCE = [
	{"prompt": "Wo steht das Verb? 'Der Pilot startet.'", "answer": "startet", "options": ["Der Pilot", "startet", "Pilot"]},
	{"prompt": "Welcher Satz ist richtig?", "answer": "Die Rakete fliegt schnell.", "options": ["Die Rakete fliegt schnell.", "Rakete die schnell fliegt.", "Schnell die fliegt Rakete."]},
	{"prompt": "Was fehlt? 'Das Schiff ___ nach links.'", "answer": "rollt", "options": ["rollt", "blau", "unter"]},
	{"prompt": "Welche Satzart ist: 'Weiche aus!'", "answer": "Aufforderung", "options": ["Aussage", "Frage", "Aufforderung"]},
	{"prompt": "Was ist das Subjekt? 'Der Wingman trifft.'", "answer": "Der Wingman", "options": ["trifft", "Der Wingman", "Wing"]}
]

const TASKS_COMPOUND = [
	{"prompt": "Bilde: Himmel + Tor", "answer": "Himmelstor", "options": ["Himmelstor", "Torhimmel", "helltor"]},
	{"prompt": "Welche Teile hat 'Raketenstart'?", "answer": "Raketen + Start", "options": ["Raketen + Start", "Raten + Art", "Start + Himmel"]},
	{"prompt": "Welches Kompositum passt?", "answer": "Schildgenerator", "options": ["Schildgenerator", "Generatorlaut", "schnellSchild"]},
	{"prompt": "Was passt zusammen?", "answer": "Laser + Strahl", "options": ["Laser + Strahl", "und + Flug", "rot + leise"]},
	{"prompt": "Welches Wort besteht aus zwei Nomen?", "answer": "Wolkenpfad", "options": ["Wolkenpfad", "schwebt", "schnell"]}
]

const TASKS_MATH = [
	{"prompt": "15 + 27 = ?", "answer": "42", "options": ["32", "42", "52"]},
	{"prompt": "6 x 7 = ?", "answer": "42", "options": ["36", "42", "49"]},
	{"prompt": "84 : 7 = ?", "answer": "12", "options": ["10", "12", "14"]},
	{"prompt": "90 - 46 = ?", "answer": "44", "options": ["34", "44", "54"]},
	{"prompt": "Welche Zahl ist gerade?", "answer": "48", "options": ["35", "48", "71"]}
]

const TASKS_ENGLISH = [
	{"prompt": "Was bedeutet 'sky'?", "answer": "Himmel", "options": ["Himmel", "Stein", "Tasche"]},
	{"prompt": "Was bedeutet 'wing'?", "answer": "Fluegel", "options": ["Fluegel", "Wolke", "Lampe"]},
	{"prompt": "Was bedeutet 'shield'?", "answer": "Schild", "options": ["Schiff", "Schild", "Schule"]},
	{"prompt": "Was bedeutet 'target'?", "answer": "Ziel", "options": ["Ziel", "Zeit", "Zelt"]},
	{"prompt": "Was bedeutet 'cloud'?", "answer": "Wolke", "options": ["Wolke", "Klinge", "Fluss"]}
]

const TASKS_SCIENCE = [
	{"prompt": "Ein Planet kreist um ...", "answer": "eine Sonne", "options": ["eine Sonne", "eine Kerze", "ein Buch"]},
	{"prompt": "Womit atmen Menschen?", "answer": "Lunge", "options": ["Lunge", "Lenker", "Leiter"]},
	{"prompt": "Was ist Auftrieb?", "answer": "Kraft nach oben", "options": ["Kraft nach oben", "leiser Ton", "kalter Stein"]},
	{"prompt": "Was schuetzt vor Treffern?", "answer": "Schild", "options": ["Schild", "Sand", "Tinte"]},
	{"prompt": "Was erzeugt Schub?", "answer": "Antrieb", "options": ["Antrieb", "Bremse", "Schatten"]}
]

var font
var rng := RandomNumberGenerator.new()
var stars := []
var player := {}
var targets := []
var shots := []
var missiles := []
var particles := []
var floaters := []
var gates := []
var touch_axis := Vector2.ZERO
var touch_pointer := -1
var touch_buttons := {}
var touch_button_state := {}
var active_touch_buttons := {}
var mode := "Normal"
var phase := "run"
var score := 0
var wave := 1
var wave_kills := 0
var combo := 0
var max_combo := 0
var combo_timer := 0.0
var operation_index := 0
var operation_progress := 0
var operation_timer := 0.0
var medals := 0
var roll_cd := 0.0
var near_misses := 0
var perfect_locks := 0
var spawn_timer := 0.0
var distance := 0.0
var boss := {}
var message := ""
var message_timer := 0.0
var shake := 0.0
var question_index := 0
var lesson_index := 0
var repeat_queue: Array = []
var stats := {}

func _ready() -> void:
	rng.seed = 905121
	font = get_theme_default_font()
	mouse_filter = Control.MOUSE_FILTER_PASS
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	build_stars()
	reset_game()

func build_stars() -> void:
	stars.clear()
	for i in range(170):
		stars.append({"x": rng.randf_range(-1.3, 1.3), "y": rng.randf_range(-0.85, 0.85), "z": rng.randf_range(0.18, 2.2), "size": rng.randf_range(0.7, 2.3)})

func reset_game() -> void:
	player = {
		"x": 0.0,
		"y": 0.28,
		"hp": MAX_HP,
		"shield": MAX_SHIELD,
		"heat": 0.0,
		"charge": 0.0,
		"charging": false,
		"cooldown": 0.0,
		"nova": 1,
		"wing": 0.0,
		"evade": 0.0,
		"invuln": 0.0
	}
	targets.clear()
	shots.clear()
	missiles.clear()
	particles.clear()
	floaters.clear()
	gates.clear()
	touch_buttons.clear()
	touch_button_state = {"fire": false, "lock": false, "nova": false, "wing": false, "roll": false, "learn": false, "subject": false}
	active_touch_buttons.clear()
	touch_axis = Vector2.ZERO
	touch_pointer = -1
	mode = "Normal"
	phase = "run"
	score = 0
	wave = 1
	wave_kills = 0
	combo = 0
	max_combo = 0
	combo_timer = 0.0
	operation_index = 0
	operation_progress = 0
	operation_timer = OPERATION_TIME
	medals = 0
	roll_cd = 0.0
	near_misses = 0
	perfect_locks = 0
	spawn_timer = 0.4
	distance = 0.0
	boss.clear()
	message = "FASKA SKY RAIL PRO"
	message_timer = 2.6
	shake = 0.0
	question_index = 0
	lesson_index = 0
	repeat_queue.clear()
	stats = {"targets": 0, "locks": 0, "wing": 0, "rings": 0, "supplies": 0, "evades": 0, "learn": 0, "wrong": 0, "boss_phases": 0, "aces": 0, "guardians": 0, "operations": 0}
	build_gates()

func build_gates() -> void:
	gates.clear()
	var task: Dictionary = current_task()
	for i in range(3):
		gates.append({"x": -0.52 + float(i) * 0.52, "y": 0.42, "z": 2.2 + float(i) * 0.04, "label": String(task.options[i]), "answer": String(task.answer), "task": task, "repeat": bool(task.get("repeat", false))})

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()
	if phase == "run":
		update_game(delta)
	update_effects(delta)
	queue_redraw()

func update_game(delta: float) -> void:
	update_input(delta)
	distance += delta * RAIL_SPEED
	player.shield = min(MAX_SHIELD, float(player.shield) + delta * 7.0)
	player.cooldown = max(0.0, float(player.cooldown) - delta)
	player.heat = max(0.0, float(player.heat) - delta * 18.0)
	player.wing = max(0.0, float(player.wing) - delta)
	player.evade = max(0.0, float(player.evade) - delta)
	player.invuln = max(0.0, float(player.invuln) - delta)
	roll_cd = max(0.0, roll_cd - delta)
	combo_timer = max(0.0, combo_timer - delta)
	if combo_timer <= 0.0:
		combo = 0
	operation_timer = max(0.0, operation_timer - delta)
	if operation_timer <= 0.0:
		fail_operation()
	if bool(player.charging):
		player.charge = min(1.0, float(player.charge) + delta * 0.65)
	update_stars(delta)
	update_spawns(delta)
	update_targets(delta)
	update_shots(delta)
	update_missiles(delta)
	update_gates(delta)
	if not boss.is_empty():
		update_boss(delta)
	if float(player.hp) <= 0.0:
		phase = "over"
		message = "SKY RAIL DOWN - R fuer Neustart"
		message_timer = 99.0

func update_input(delta: float) -> void:
	var axis := Vector2.ZERO
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		axis.x -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		axis.x += 1.0
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		axis.y -= 1.0
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		axis.y += 1.0
	if touch_axis.length() > 0.08:
		axis += touch_axis
	if axis.length() > 1.0:
		axis = axis.normalized()
	player.x = clamp(float(player.x) + axis.x * MOVE_SPEED * delta, -0.86, 0.86)
	player.y = clamp(float(player.y) + axis.y * MOVE_SPEED * delta, -0.56, 0.62)
	if bool(touch_button_state.get("fire", false)):
		fire_pulse()
	if bool(touch_button_state.get("lock", false)):
		player.charging = true
	else:
		if bool(player.charging):
			release_lock()
		player.charging = false
	if bool(touch_button_state.get("roll", false)):
		activate_barrel_roll(axis.x)

func update_stars(delta: float) -> void:
	for star in stars:
		star.z = float(star.z) - delta * 0.55
		if float(star.z) <= 0.08:
			star.z = rng.randf_range(1.7, 2.4)
			star.x = rng.randf_range(-1.3, 1.3)
			star.y = rng.randf_range(-0.85, 0.85)

func update_spawns(delta: float) -> void:
	if not boss.is_empty():
		return
	spawn_timer -= delta
	if spawn_timer > 0.0:
		return
	spawn_timer = max(0.34, 1.18 - float(wave) * 0.055)
	var roll: float = rng.randf()
	if wave % 4 == 0 and wave_kills >= 8:
		spawn_boss()
	elif roll < 0.16:
		spawn_target("ring")
	elif roll < 0.28:
		spawn_target("supply")
	elif roll < 0.43:
		spawn_target("mine")
	elif roll < 0.54 and wave >= 3:
		spawn_target("ace")
	elif roll < 0.66 and wave >= 4:
		spawn_target("guardian")
	elif roll < 0.78 and wave >= 2:
		spawn_target("turret")
	else:
		spawn_target("drone")

func spawn_target(kind: String) -> void:
	var lanes := [-0.54, 0.0, 0.54]
	var lane: float = lanes[rng.randi_range(0, 2)]
	var y: float = rng.randf_range(-0.32, 0.42)
	var hp: float = 2.0
	var color := Color(1.0, 0.25, 0.18)
	if kind == "turret":
		hp = 3.2
		color = Color(0.65, 0.48, 1.0)
	elif kind == "ace":
		hp = 4.4
		color = Color(1.0, 0.32, 0.42)
	elif kind == "guardian":
		hp = 5.2
		color = Color(0.25, 0.95, 0.78)
	elif kind == "mine":
		hp = 1.0
		color = Color(1.0, 0.62, 0.12)
	elif kind == "supply":
		hp = 1.0
		color = Color(0.25, 1.0, 0.62)
	elif kind == "ring":
		hp = 1.0
		color = Color(0.35, 0.86, 1.0)
	targets.append({"kind": kind, "x": lane + rng.randf_range(-0.13, 0.13), "y": y, "z": 2.15, "hp": hp, "max_hp": hp, "phase": rng.randf_range(0.0, TAU), "shot": rng.randf_range(0.7, 1.5), "color": color})

func spawn_boss() -> void:
	boss = {"x": 0.0, "y": -0.12, "z": 1.25, "hp": 80.0 + float(wave) * 12.0, "max_hp": 80.0 + float(wave) * 12.0, "phase": 0.0, "shot": 0.8, "phase_no": 1}
	message = "BOSS: STURMTRAEGER"
	message_timer = 2.4

func update_targets(delta: float) -> void:
	var player_pos: Vector2 = Vector2(float(player.x), float(player.y))
	for i in range(targets.size() - 1, -1, -1):
		var t = targets[i]
		t.z = float(t.z) - delta * (0.62 if String(t.kind) == "ace" else (0.58 if String(t.kind) != "ring" else 0.66))
		t.phase = float(t.phase) + delta
		if String(t.kind) == "drone":
			t.x = float(t.x) + sin(float(t.phase) * 2.5) * delta * 0.12
		elif String(t.kind) == "ace":
			t.x = float(t.x) + sin(float(t.phase) * 3.6) * delta * 0.32
			t.y = float(t.y) + cos(float(t.phase) * 2.2) * delta * 0.15
			t.shot = float(t.shot) - delta
			if float(t.shot) <= 0.0 and float(t.z) < 1.55:
				t.shot = rng.randf_range(0.75, 1.25)
				fire_enemy_shot(Vector2(float(t.x), float(t.y)), rng.randf_range(-0.16, 0.16))
		elif String(t.kind) == "mine":
			t.y = float(t.y) + sin(float(t.phase) * 4.0) * delta * 0.11
		elif String(t.kind) == "guardian":
			t.x = float(t.x) + sin(float(t.phase) * 1.4) * delta * 0.08
			t.shot = float(t.shot) - delta
			if float(t.shot) <= 0.0 and float(t.z) < 1.4:
				t.shot = rng.randf_range(1.0, 1.55)
				fire_enemy_shot(Vector2(float(t.x), float(t.y)), 0.0)
		elif String(t.kind) == "turret":
			t.shot = float(t.shot) - delta
			if float(t.shot) <= 0.0 and float(t.z) < 1.45:
				t.shot = rng.randf_range(1.1, 1.8)
				fire_enemy_shot(Vector2(float(t.x), float(t.y)), 0.0)
		if float(t.z) <= 0.16:
			var d := player_pos.distance_to(Vector2(float(t.x), float(t.y)))
			if String(t.kind) == "ring" and d < 0.28:
				stats.rings += 1
				score += 210
				register_action("rings", player_screen(), "APEX")
				add_text("APEX", player_screen(), Color(0.35, 0.86, 1.0))
			elif String(t.kind) == "supply" and d < 0.25:
				stats.supplies += 1
				player.shield = MAX_SHIELD
				player.nova = min(3, int(player.nova) + 1)
				register_action("survive", player_screen(), "SUPPLY")
				add_text("SUPPLY", player_screen(), Color(0.35, 1.0, 0.62))
			elif d < 0.22 and String(t.kind) != "ring" and String(t.kind) != "supply":
				damage_player(16.0 if String(t.kind) != "mine" else 22.0, "Kollision")
			targets.remove_at(i)
		else:
			targets[i] = t
	if wave_kills >= 10 and boss.is_empty():
		wave += 1
		wave_kills = 0
		score += 500 + wave * 80
		message = "Welle " + str(wave)
		message_timer = 1.6

func update_boss(delta: float) -> void:
	boss.phase = float(boss.phase) + delta
	boss.x = sin(float(boss.phase) * 0.8) * 0.34
	boss.y = -0.16 + sin(float(boss.phase) * 1.3) * 0.12
	boss.shot = float(boss.shot) - delta
	if float(boss.shot) <= 0.0:
		boss.shot = max(0.28, 1.05 - float(boss.phase_no) * 0.16)
		for n in range(int(boss.phase_no) + 1):
			fire_enemy_shot(Vector2(float(boss.x), float(boss.y)), (float(n) - float(boss.phase_no) * 0.5) * 0.18)
	if float(boss.hp) <= float(boss.max_hp) * 0.5 and int(boss.phase_no) == 1:
		boss.phase_no = 2
		stats.boss_phases += 1
		player.nova = min(3, int(player.nova) + 1)
		message = "Bossphase 2"
		message_timer = 1.8
	if float(boss.hp) <= 0.0:
		stats.boss_phases += 1
		score += 3200
		wave += 1
		wave_kills = 0
		add_text("BOSS DOWN", project(Vector2(float(boss.x), float(boss.y)), float(boss.z)), Color(1.0, 0.85, 0.28))
		boss.clear()

func fire_pulse() -> void:
	if float(player.cooldown) > 0.0 or float(player.heat) > OVERHEAT_LIMIT:
		return
	player.cooldown = 0.12
	player.heat = min(MAX_HEAT, float(player.heat) + 7.0)
	shots.append({"pos": player_screen(), "vel": Vector2(0, -760), "life": 0.45, "color": Color(0.35, 0.85, 1.0)})
	var idx := nearest_target_under_reticle(RETICLE_R)
	if idx >= 0:
		hit_target(idx, 1.0, "pulse")
	elif not boss.is_empty() and project(Vector2(float(boss.x), float(boss.y)), float(boss.z)).distance_to(reticle_pos()) < RETICLE_R + 35.0:
		hit_boss(1.0)

func release_lock() -> void:
	var charge: float = float(player.charge)
	player.charge = 0.0
	if charge < 0.16 or float(player.heat) > OVERHEAT_LIMIT:
		return
	var count := 1
	if charge > 0.86:
		count = 5
	elif charge > 0.48:
		count = 3
	player.heat = min(MAX_HEAT, float(player.heat) + 12.0 + count * 5.0)
	var hits := locked_targets(count)
	if charge > 0.86 and hits.size() >= 3:
		perfect_locks += 1
		score += 450
		add_text("PERFECT LOCK", reticle_pos(), Color(1.0, 0.72, 0.22))
	for hit in hits:
		missiles.append({"from": player_screen(), "to": hit.pos, "life": 0.28, "max": 0.28, "kind": hit.kind, "index": hit.index})
	if hits.is_empty() and not boss.is_empty():
		missiles.append({"from": player_screen(), "to": project(Vector2(float(boss.x), float(boss.y)), float(boss.z)), "life": 0.28, "max": 0.28, "kind": "boss", "index": -1})

func nearest_target_under_reticle(radius: float) -> int:
	var best := -1
	var best_dist := radius
	var r := reticle_pos()
	for i in range(targets.size()):
		var sp := project(Vector2(float(targets[i].x), float(targets[i].y)), float(targets[i].z))
		var d := sp.distance_to(r)
		if d < best_dist and String(targets[i].kind) != "ring" and String(targets[i].kind) != "supply":
			best_dist = d
			best = i
	return best

func locked_targets(count: int) -> Array:
	var found: Array = []
	var r: Vector2 = reticle_pos()
	for i in range(targets.size()):
		var kind := String(targets[i].kind)
		if kind == "ring" or kind == "supply":
			continue
		var sp := project(Vector2(float(targets[i].x), float(targets[i].y)), float(targets[i].z))
		var d := sp.distance_to(r)
		if d < 180.0:
			found.append({"index": i, "pos": sp, "dist": d, "kind": "target"})
	found.sort_custom(func(a, b): return float(a.dist) < float(b.dist))
	return found.slice(0, count)

func hit_target(index: int, damage: float, source: String) -> void:
	if index < 0 or index >= targets.size():
		return
	var t = targets[index]
	var kind := String(t.kind)
	if kind == "guardian" and source == "pulse":
		damage *= 0.42
	if source == "lock":
		damage *= 2.2
	t.hp = float(t.hp) - damage
	if float(t.hp) <= 0.0:
		var pos := project(Vector2(float(t.x), float(t.y)), float(t.z))
		var points := 180
		if kind == "turret":
			points = 260
		elif kind == "mine":
			points = 140
		elif kind == "ace":
			points = 420
			stats.aces += 1
			register_action("ace", pos, "ACE")
		elif kind == "guardian":
			points = 480
			stats.guardians += 1
		register_combo(pos, kind.to_upper())
		score += points + combo * 22
		stats.targets += 1
		wave_kills += 1
		spawn_sparks(pos, t.color, 12)
		add_text("+" + str(points), pos, Color(1.0, 0.86, 0.28))
		targets.remove_at(index)
	else:
		targets[index] = t

func hit_boss(damage: float) -> void:
	if boss.is_empty():
		return
	boss.hp = float(boss.hp) - damage
	spawn_sparks(project(Vector2(float(boss.x), float(boss.y)), float(boss.z)), Color(1.0, 0.25, 0.18), 8)

func update_shots(delta: float) -> void:
	for i in range(shots.size() - 1, -1, -1):
		var s = shots[i]
		s.pos = Vector2(s.pos) + Vector2(s.vel) * delta
		s.life = float(s.life) - delta
		if float(s.life) <= 0.0:
			shots.remove_at(i)
		else:
			shots[i] = s

func update_missiles(delta: float) -> void:
	for i in range(missiles.size() - 1, -1, -1):
		var m = missiles[i]
		m.life = float(m.life) - delta
		if float(m.life) <= 0.0:
			if String(m.kind) == "boss":
				hit_boss(4.0)
			else:
				stats.locks += 1
				register_action("locks", Vector2(m.to), "LOCK")
				hit_target(int(m.index), 1.0, "lock")
			spawn_sparks(Vector2(m.to), Color(1.0, 0.72, 0.22), 14)
			missiles.remove_at(i)
		else:
			missiles[i] = m

func fire_enemy_shot(origin: Vector2, spread: float) -> void:
	var to_player: Vector2 = Vector2(float(player.x), float(player.y)) - origin
	var dir := to_player.normalized().rotated(spread)
	targets.append({"kind": "bolt", "x": origin.x, "y": origin.y, "z": 1.1, "hp": 1.0, "max_hp": 1.0, "phase": 0.0, "shot": 0.0, "vel": dir * 0.55, "color": Color(1.0, 0.18, 0.16)})

func update_gates(delta: float) -> void:
	if mode != "Learncade":
		return
	for i in range(gates.size() - 1, -1, -1):
		var g = gates[i]
		g.z = float(g.z) - delta * 0.52
		if float(g.z) <= 0.14:
			var d := Vector2(float(player.x), float(player.y)).distance_to(Vector2(float(g.x), float(g.y)))
			if d < 0.27:
				resolve_gate(g)
				build_gates()
				return
			gates.remove_at(i)
		else:
			gates[i] = g
	if gates.is_empty():
		build_gates()

func resolve_gate(g) -> void:
	var task: Dictionary = g.task
	if String(g.label) == String(g.answer):
		stats.learn += 1
		score += 700
		player.shield = MAX_SHIELD
		register_action("learn", player_screen(), "LEARN")
		if bool(g.repeat):
			remove_repeat(task)
		if int(stats.learn) == LEARN_GOAL:
			player.nova = min(3, int(player.nova) + 1)
			add_text("LERN-SALVE", player_screen(), Color(0.55, 0.95, 1.0))
		else:
			add_text("RICHTIG", player_screen(), Color(0.35, 1.0, 0.55))
	else:
		stats.wrong += 1
		queue_repeat(task)
		damage_player(10.0, "Falsches Gate")
		add_text("FALSCH - kommt wieder", player_screen(), Color(1.0, 0.25, 0.2))
	if repeat_queue.size() == 0 or not bool(task.get("repeat", false)):
		question_index = (question_index + 1) % question_bank().size()

func register_combo(pos: Vector2, label: String) -> void:
	combo += 1
	combo_timer = COMBO_WINDOW
	max_combo = maxi(max_combo, combo)
	if combo >= 3:
		var bonus := combo * 70
		score += bonus
		add_text(label + " COMBO " + str(combo) + " +" + str(bonus), pos + Vector2(0, -22), Color(0.35, 0.86, 1.0))
	if combo >= 8:
		player.nova = min(3, int(player.nova) + 1)
		combo = 0
		add_text("NOVA BONUS", pos, Color(0.75, 0.55, 1.0))

func current_operation() -> Dictionary:
	return OPERATIONS[operation_index % OPERATIONS.size()]

func register_action(kind: String, pos: Vector2, label: String) -> void:
	advance_operation(kind, pos, label)

func advance_operation(kind: String, pos: Vector2, label: String) -> void:
	var operation: Dictionary = current_operation()
	var operation_id := String(operation.id)
	if kind != operation_id:
		return
	operation_progress += 1
	add_text(String(operation.label) + " " + str(operation_progress) + "/" + str(operation.goal), pos + Vector2(0, -42), Color(0.85, 0.75, 1.0))
	if operation_progress >= int(operation.goal):
		complete_operation(pos, label)

func complete_operation(pos: Vector2, label: String) -> void:
	var operation: Dictionary = current_operation()
	var reward := 1200 + operation_index * 280 + wave * 90
	score += reward
	medals += 1
	stats.operations += 1
	player.nova = min(3, int(player.nova) + 1)
	player.shield = MAX_SHIELD
	spawn_sparks(pos, Color(0.85, 0.75, 1.0), 28)
	add_text("MISSION " + String(operation.label) + " +" + str(reward), pos, Color(1.0, 0.86, 0.28))
	message = String(operation.label) + " erledigt durch " + label + "."
	message_timer = 2.0
	operation_index = (operation_index + 1) % OPERATIONS.size()
	operation_progress = 0
	operation_timer = OPERATION_TIME
	if String(current_operation().id) == "learn" and mode != "Learncade":
		mode = "Learncade"
		build_gates()

func fail_operation() -> void:
	if phase != "run":
		return
	var operation: Dictionary = current_operation()
	message = String(operation.label) + " verpasst - neuer Einsatz: " + String(OPERATIONS[(operation_index + 1) % OPERATIONS.size()].label)
	message_timer = 1.8
	operation_index = (operation_index + 1) % OPERATIONS.size()
	operation_progress = 0
	operation_timer = OPERATION_TIME
	if mode == "Learncade":
		build_gates()

func activate_nova() -> void:
	if int(player.nova) <= 0:
		return
	player.nova -= 1
	stats.evades += 1
	register_action("survive", player_screen(), "NOVA")
	player.invuln = 1.1
	player.shield = MAX_SHIELD
	for i in range(targets.size() - 1, -1, -1):
		if float(targets[i].z) < 1.45 and String(targets[i].kind) != "ring" and String(targets[i].kind) != "supply":
			hit_target(i, 99.0, "nova")
	if not boss.is_empty():
		hit_boss(8.0)
	add_text("NOVA", reticle_pos(), Color(0.75, 0.55, 1.0))

func activate_wingman() -> void:
	player.wing = 7.0
	stats.wing += 1
	message = "Wingman aktiv"
	message_timer = 1.8

func activate_barrel_roll(axis_x: float) -> void:
	if roll_cd > 0.0:
		return
	roll_cd = ROLL_COOLDOWN
	player.invuln = max(float(player.invuln), 0.58)
	player.evade = max(float(player.evade), 0.72)
	player.heat = max(0.0, float(player.heat) - 18.0)
	var direction := axis_x
	if absf(direction) < 0.1:
		direction = -1.0 if float(player.x) > 0.0 else 1.0
	player.x = clamp(float(player.x) + sign(direction) * 0.24, -0.86, 0.86)
	stats.evades += 1
	near_misses += 1
	score += 160 + near_misses * 12
	register_action("survive", player_screen(), "ROLL")
	add_text("BARREL ROLL", player_screen(), Color(0.55, 0.9, 1.0))

func damage_player(amount: float, reason: String) -> void:
	if float(player.invuln) > 0.0:
		stats.evades += 1
		add_text("PERFECT EVADE", player_screen(), Color(0.55, 0.9, 1.0))
		return
	var shield_hit: float = min(float(player.shield), amount)
	player.shield = max(0.0, float(player.shield) - shield_hit)
	player.hp = max(0.0, float(player.hp) - max(0.0, amount - shield_hit))
	combo = 0
	shake = 0.8
	add_text(reason + " -" + str(int(amount)), player_screen(), Color(1.0, 0.25, 0.18))

func question_bank() -> Array:
	match String(LESSONS[lesson_index]):
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
		"SACHKUNDE":
			return TASKS_SCIENCE
	return TASKS_WORD

func current_task() -> Dictionary:
	if repeat_queue.size() > 0:
		var repeated: Dictionary = repeat_queue[0].duplicate(true)
		repeated["repeat"] = true
		return repeated
	var bank := question_bank()
	var task: Dictionary = bank[question_index % bank.size()].duplicate(true)
	task["repeat"] = false
	return task

func task_id(task: Dictionary) -> String:
	return String(task.prompt) + "::" + String(task.answer)

func queue_repeat(task: Dictionary) -> void:
	var id := task_id(task)
	for item in repeat_queue:
		if task_id(item) == id:
			return
	var copy: Dictionary = task.duplicate(true)
	copy["repeat"] = true
	repeat_queue.append(copy)

func remove_repeat(task: Dictionary) -> void:
	var id := task_id(task)
	for i in range(repeat_queue.size() - 1, -1, -1):
		if task_id(repeat_queue[i]) == id:
			repeat_queue.remove_at(i)

func toggle_learncade() -> void:
	mode = "Learncade" if mode == "Normal" else "Normal"
	message = "Learncade: fliege durchs richtige Gate." if mode == "Learncade" else "Normalmodus aktiv."
	message_timer = 2.2
	if mode == "Learncade":
		build_gates()

func cycle_lesson() -> void:
	lesson_index = (lesson_index + 1) % LESSONS.size()
	question_index = 0
	repeat_queue.clear()
	message = "Fach: " + String(LESSONS[lesson_index])
	message_timer = 1.7
	if mode == "Learncade":
		build_gates()

func _unhandled_input(event) -> void:
	if event is InputEventKey and not event.echo:
		if event.pressed:
			match event.keycode:
				KEY_R:
					reset_game()
				KEY_J:
					fire_pulse()
				KEY_SPACE, KEY_K:
					player.charging = true
				KEY_N:
					activate_nova()
				KEY_E:
					activate_wingman()
				KEY_Q, KEY_SHIFT:
					activate_barrel_roll(0.0)
				KEY_L:
					toggle_learncade()
				KEY_C, KEY_TAB:
					cycle_lesson()
		else:
			if event.keycode == KEY_SPACE or event.keycode == KEY_K:
				if bool(player.charging):
					release_lock()
				player.charging = false

func _gui_input(event) -> void:
	if event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_LEFT:
			fire_pulse()
		elif event.button_index == MOUSE_BUTTON_RIGHT:
			player.charging = true
	elif event is InputEventMouseButton and not event.pressed:
		if event.button_index == MOUSE_BUTTON_RIGHT and bool(player.charging):
			release_lock()
			player.charging = false
	elif event is InputEventScreenTouch:
		if event.pressed:
			handle_touch_press(event.index, event.position)
		else:
			if event.index == touch_pointer:
				touch_pointer = -1
				touch_axis = Vector2.ZERO
			if active_touch_buttons.has(event.index):
				var button_name: String = active_touch_buttons[event.index]
				touch_button_state[button_name] = false
				if button_name == "lock":
					release_lock()
					player.charging = false
				active_touch_buttons.erase(event.index)
	elif event is InputEventScreenDrag:
		if event.index == touch_pointer:
			var origin := joystick_origin()
			touch_axis = (event.position - origin) / 76.0
			if touch_axis.length() > 1.0:
				touch_axis = touch_axis.normalized()

func handle_touch_press(pointer_id: int, pos: Vector2) -> void:
	if not should_show_touch_controls():
		return
	for name in touch_buttons.keys():
		if touch_buttons[name].has_point(pos):
			active_touch_buttons[pointer_id] = name
			touch_button_state[name] = true
			handle_touch_action(name)
			return
	if pos.x < size.x * 0.44 and pos.y > size.y * 0.54:
		touch_pointer = pointer_id
		var origin := joystick_origin()
		touch_axis = (pos - origin) / 76.0
		if touch_axis.length() > 1.0:
			touch_axis = touch_axis.normalized()

func handle_touch_action(name: String) -> void:
	if name == "fire":
		fire_pulse()
	elif name == "lock":
		player.charging = true
	elif name == "nova":
		activate_nova()
	elif name == "wing":
		activate_wingman()
	elif name == "roll":
		activate_barrel_roll(0.0)
	elif name == "learn":
		toggle_learncade()
	elif name == "subject":
		cycle_lesson()

func joystick_origin() -> Vector2:
	return Vector2(78, size.y - 84)

func should_show_touch_controls() -> bool:
	return size.x < 820.0 or size.y > size.x * 1.12

func update_effects(delta: float) -> void:
	message_timer = max(0.0, message_timer - delta)
	shake = max(0.0, shake - delta * 6.0)
	for i in range(floaters.size() - 1, -1, -1):
		var f = floaters[i]
		f.life = float(f.life) - delta
		f.pos = Vector2(f.pos) + Vector2(0, -40) * delta
		f.color.a = clamp(float(f.life), 0.0, 1.0)
		if float(f.life) <= 0.0:
			floaters.remove_at(i)
		else:
			floaters[i] = f
	for i in range(particles.size() - 1, -1, -1):
		var p = particles[i]
		p.life = float(p.life) - delta
		p.pos = Vector2(p.pos) + Vector2(p.vel) * delta
		p.color.a = clamp(float(p.life), 0.0, 1.0)
		if float(p.life) <= 0.0:
			particles.remove_at(i)
		else:
			particles[i] = p

func project(pos: Vector2, z: float) -> Vector2:
	var scale: float = 1.0 / max(0.22, z * 0.78 + 0.22)
	var offset := Vector2.ZERO
	if shake > 0.0:
		offset = Vector2(rng.randf_range(-shake, shake), rng.randf_range(-shake, shake)) * 7.0
	return Vector2(size.x * 0.5 + pos.x * size.x * 0.38 * scale, size.y * 0.52 + pos.y * size.y * 0.34 * scale) + offset

func reticle_pos() -> Vector2:
	return project(Vector2(float(player.x), float(player.y)), 0.42)

func player_screen() -> Vector2:
	return project(Vector2(float(player.x), float(player.y)), 0.36)

func _draw() -> void:
	draw_background()
	draw_gates()
	draw_targets()
	draw_boss()
	draw_projectiles()
	draw_player()
	draw_particles()
	draw_hud()
	draw_touch_controls()
	draw_messages()

func draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color(0.012, 0.018, 0.042))
	for star in stars:
		var p := project(Vector2(float(star.x), float(star.y)), float(star.z))
		var alpha: float = clamp(1.6 - float(star.z) * 0.55, 0.22, 1.0)
		draw_circle(p, float(star.size) * (2.2 - float(star.z) * 0.5), Color(0.72, 0.9, 1.0, alpha))
	for lane in [-0.55, 0.0, 0.55]:
		draw_line(project(Vector2(lane, -0.75), 2.2), project(Vector2(lane, 0.75), 0.22), Color(0.18, 0.42, 0.72, 0.34), 2.0)
	draw_arc(Vector2(size.x * 0.5, size.y * 0.52), min(size.x, size.y) * 0.36, 0.0, TAU, 80, Color(0.12, 0.32, 0.55, 0.28), 2.0)

func draw_gates() -> void:
	if mode != "Learncade":
		return
	var task: Dictionary = current_task()
	draw_rect(Rect2(Vector2(size.x * 0.25, 14), Vector2(size.x * 0.5, 42)), Color(0.0, 0.0, 0.0, 0.58))
	draw_text_at(Vector2(size.x * 0.27, 40), String(task.prompt), Color(0.82, 0.94, 1.0), 16)
	for gate in gates:
		var p := project(Vector2(float(gate.x), float(gate.y)), float(gate.z))
		var s: float = 110.0 / max(0.45, float(gate.z))
		var ring := Color(0.35, 0.86, 1.0)
		if bool(gate.repeat):
			ring = Color(1.0, 0.58, 0.95)
		draw_rect(Rect2(p - Vector2(s * 0.52, s * 0.32), Vector2(s, s * 0.64)), Color(0.04, 0.1, 0.18, 0.72))
		draw_rect(Rect2(p - Vector2(s * 0.52, s * 0.32), Vector2(s, s * 0.64)), ring, false, 3.0)
		draw_text_at(p + Vector2(-s * 0.38, 4), String(gate.label), Color(0.92, 0.98, 1.0), 13)

func draw_targets() -> void:
	var sorted := targets.duplicate()
	sorted.sort_custom(func(a, b): return float(a.z) > float(b.z))
	for t in sorted:
		var p := project(Vector2(float(t.x), float(t.y)), float(t.z))
		var s: float = 32.0 / max(0.34, float(t.z))
		var kind := String(t.kind)
		if kind == "ring":
			draw_arc(p, s * 1.1, 0.0, TAU, 36, Color(0.35, 0.86, 1.0), 4.0)
			draw_arc(p, s * 0.62, 0.0, TAU, 36, Color(0.35, 0.86, 1.0, 0.4), 2.0)
		elif kind == "supply":
			draw_rect(Rect2(p - Vector2(s, s * 0.7), Vector2(s * 2, s * 1.4)), Color(0.1, 0.55, 0.25, 0.86))
			draw_rect(Rect2(p - Vector2(s, s * 0.7), Vector2(s * 2, s * 1.4)), Color(0.35, 1.0, 0.62), false, 3.0)
		elif kind == "mine":
			draw_regular_polygon(p, s, 8, Color(1.0, 0.62, 0.12), float(t.phase))
			draw_arc(p, s * 1.4, 0.0, TAU, 24, Color(1.0, 0.62, 0.12, 0.35), 2.0)
		elif kind == "turret":
			draw_regular_polygon(p, s, 3, Color(0.65, 0.48, 1.0), -PI * 0.5 + float(t.phase))
		elif kind == "ace":
			draw_regular_polygon(p, s * 1.12, 4, Color(1.0, 0.32, 0.42), PI * 0.25 + float(t.phase) * 0.4)
			draw_arc(p, s * 1.55, -0.8, 0.8, 18, Color(1.0, 0.62, 0.70, 0.55), 2.0)
		elif kind == "guardian":
			draw_regular_polygon(p, s * 1.08, 6, Color(0.25, 0.95, 0.78), float(t.phase) * 0.35)
			draw_arc(p, s * 1.62, 0.0, TAU, 34, Color(0.40, 1.0, 0.82, 0.48), 3.0)
		elif kind == "bolt":
			draw_circle(p, s * 0.35, Color(1.0, 0.18, 0.16))
		else:
			draw_regular_polygon(p, s, 5, Color(1.0, 0.25, 0.18), float(t.phase))
		if kind != "ring" and kind != "supply" and kind != "bolt":
			var ratio: float = clamp(float(t.hp) / float(t.max_hp), 0.0, 1.0)
			draw_rect(Rect2(p + Vector2(-s, s + 5), Vector2(s * 2, 5)), Color(0.08, 0.02, 0.03))
			draw_rect(Rect2(p + Vector2(-s, s + 5), Vector2(s * 2 * ratio, 5)), Color(1.0, 0.08, 0.14))

func draw_boss() -> void:
	if boss.is_empty():
		return
	var p := project(Vector2(float(boss.x), float(boss.y)), float(boss.z))
	var s := 88.0
	draw_circle(p, s * 0.9, Color(0.18, 0.02, 0.05, 0.82))
	draw_regular_polygon(p, s * 0.62, 8, Color(0.95, 0.1, 0.16), float(boss.phase))
	draw_arc(p, s * 0.92, 0.0, TAU, 56, Color(1.0, 0.72, 0.18), 4.0)
	var ratio: float = clamp(float(boss.hp) / float(boss.max_hp), 0.0, 1.0)
	draw_rect(Rect2(Vector2(size.x * 0.29, size.y - 54), Vector2(size.x * 0.42, 10)), Color(0.08, 0.02, 0.03))
	draw_rect(Rect2(Vector2(size.x * 0.29, size.y - 54), Vector2(size.x * 0.42 * ratio, 10)), Color(1.0, 0.1, 0.16))
	draw_text_at(Vector2(size.x * 0.43, size.y - 62), "STURMTRAEGER", Color(1.0, 0.76, 0.25), 13)

func draw_projectiles() -> void:
	for shot in shots:
		var p := Vector2(shot.pos)
		draw_circle(p, 5.0, shot.color)
		draw_line(p + Vector2(0, 18), p, shot.color, 3.0)
	for missile in missiles:
		var t: float = 1.0 - float(missile.life) / float(missile.max)
		var p := Vector2(missile.from).lerp(Vector2(missile.to), t)
		draw_circle(p, 7.0, Color(1.0, 0.72, 0.22))
		draw_line(Vector2(missile.from), p, Color(1.0, 0.72, 0.22, 0.35), 2.0)

func draw_player() -> void:
	var p := player_screen()
	var side := Vector2(32, 18)
	draw_colored_polygon(PackedVector2Array([p + Vector2(0, -30), p + Vector2(-side.x, side.y), p + Vector2(0, 8), p + Vector2(side.x, side.y)]), Color(0.35, 0.82, 1.0))
	draw_polyline(PackedVector2Array([p + Vector2(0, -30), p + Vector2(-side.x, side.y), p + Vector2(0, 8), p + Vector2(side.x, side.y), p + Vector2(0, -30)]), Color.WHITE, 2.0)
	if float(player.invuln) > 0.0:
		draw_arc(p, 48.0, 0.0, TAU, 40, Color(0.72, 0.55, 1.0, 0.65), 4.0)
	var r := reticle_pos()
	var charge_col := Color(0.35, 0.86, 1.0) if not bool(player.charging) else Color(1.0, 0.72, 0.22)
	draw_arc(r, RETICLE_R, 0.0, TAU, 48, Color(charge_col, 0.7), 2.0)
	draw_line(r + Vector2(-12, 0), r + Vector2(12, 0), charge_col, 2.0)
	draw_line(r + Vector2(0, -12), r + Vector2(0, 12), charge_col, 2.0)
	if bool(player.charging):
		draw_arc(r, RETICLE_R + 8.0, -PI * 0.5, -PI * 0.5 + TAU * float(player.charge), 48, Color(1.0, 0.72, 0.22), 4.0)

func draw_particles() -> void:
	for part in particles:
		draw_circle(Vector2(part.pos), float(part.size), part.color)

func draw_hud() -> void:
	var hud_w: float = min(405.0, size.x - 20.0)
	draw_rect(Rect2(Vector2(10, 10), Vector2(hud_w, 176)), Color(0.0, 0.0, 0.0, 0.64))
	draw_text_at(Vector2(20, 31), "FASKA SKY RAIL PRO", Color(0.55, 0.9, 1.0), 18)
	draw_bar(Vector2(20, 52), "HP", float(player.hp), MAX_HP, Color(0.25, 1.0, 0.55))
	draw_bar(Vector2(20, 74), "SHIELD", float(player.shield), MAX_SHIELD, Color(0.35, 0.82, 1.0))
	draw_bar(Vector2(20, 96), "HEAT", float(player.heat), MAX_HEAT, Color(1.0, 0.48, 0.22))
	draw_text_at(Vector2(20, 128), "Score " + str(score) + " Combo " + str(combo) + "/" + str(max_combo) + " Mode " + mode, Color(0.86, 0.94, 1.0), 13)
	var operation: Dictionary = current_operation()
	draw_text_at(Vector2(20, 148), "Operation " + String(operation.label) + " " + str(operation_progress) + "/" + str(operation.goal) + " " + str(int(operation_timer)) + "s  Medaillen " + str(medals), Color(0.82, 0.76, 1.0), 12)
	draw_text_at(Vector2(20, 168), "Fach " + String(LESSONS[lesson_index]) + " Lernen " + str(stats.learn) + "/" + str(LEARN_GOAL) + " Wdh " + str(repeat_queue.size()) + " Roll " + str(int(roll_cd * 10.0) / 10.0), Color(0.78, 0.92, 1.0), 12)
	if size.x > 760.0 and size.y <= size.x * 1.15:
		draw_rect(Rect2(Vector2(size.x - 304, 10), Vector2(290, 136)), Color(0.0, 0.0, 0.0, 0.55))
		draw_text_at(Vector2(size.x - 292, 32), "Wave " + str(wave) + "  Targets " + str(stats.targets), Color(0.94, 0.98, 1.0), 14)
		draw_text_at(Vector2(size.x - 292, 55), "Locks " + str(stats.locks) + "  Rings " + str(stats.rings), Color(0.94, 0.98, 1.0), 14)
		draw_text_at(Vector2(size.x - 292, 78), "Nova " + str(player.nova) + "  Supplies " + str(stats.supplies), Color(0.94, 0.98, 1.0), 14)
		draw_text_at(Vector2(size.x - 292, 101), "Ace " + str(stats.aces) + "  Guardian " + str(stats.guardians), Color(0.94, 0.98, 1.0), 14)
		draw_text_at(Vector2(size.x - 292, 124), "Boss: jede 4. Welle", Color(0.95, 0.78, 0.35), 13)

func draw_bar(pos: Vector2, label: String, value: float, max_value: float, color: Color) -> void:
	draw_text_at(pos, label, Color(0.76, 0.82, 0.9), 12)
	draw_rect(Rect2(pos + Vector2(82, -10), Vector2(184, 8)), Color(0.07, 0.08, 0.12))
	draw_rect(Rect2(pos + Vector2(82, -10), Vector2(184.0 * clamp(value / max_value, 0.0, 1.0), 8)), color)

func draw_touch_controls() -> void:
	touch_buttons.clear()
	if not should_show_touch_controls():
		return
	var origin := joystick_origin()
	draw_arc(origin, 66, 0.0, TAU, 36, Color(0.6, 0.75, 1.0, 0.3), 3.0)
	draw_circle(origin + touch_axis * 44.0, 23.0, Color(0.33, 0.62, 1.0, 0.4))
	var buttons = [
		["fire", "FIRE", Vector2(size.x - 58, size.y - 172)],
		["lock", "LOCK", Vector2(size.x - 128, size.y - 132)],
		["nova", "NOVA", Vector2(size.x - 58, size.y - 102)],
		["wing", "WING", Vector2(size.x - 128, size.y - 62)],
		["roll", "ROLL", Vector2(size.x - 198, size.y - 102)],
		["learn", "LERN", Vector2(size.x - 58, size.y - 242)],
		["subject", "FACH", Vector2(size.x - 128, size.y - 242)]
	]
	for item in buttons:
		var rect := Rect2(item[2] - Vector2(31, 22), Vector2(62, 44))
		touch_buttons[item[0]] = rect
		var pressed := bool(touch_button_state.get(item[0], false))
		draw_rect(rect, Color(0.12, 0.18, 0.32, 0.86) if pressed else Color(0.03, 0.05, 0.09, 0.72))
		draw_rect(rect, Color(0.65, 0.76, 1.0, 0.62), false, 2.0)
		draw_text_at(rect.position + Vector2(8, 29), item[1], Color(0.94, 0.97, 1.0), 11)

func draw_messages() -> void:
	if message_timer > 0.0:
		var box := Rect2(Vector2(size.x * 0.31, 14), Vector2(size.x * 0.38, 31))
		if mode == "Learncade":
			box.position.y = 62
		draw_rect(box, Color(0.0, 0.0, 0.0, 0.64))
		draw_text_at(box.position + Vector2(10, 22), message, Color(0.95, 0.98, 1.0), 14)
	for f in floaters:
		draw_text_at(Vector2(f.pos), String(f.text), f.color, 16)
	if phase == "over":
		draw_rect(Rect2(Vector2(size.x * 0.25, size.y * 0.38), Vector2(size.x * 0.5, 116)), Color(0.0, 0.0, 0.0, 0.78))
		draw_text_at(Vector2(size.x * 0.36, size.y * 0.44), "SKY RAIL DOWN", Color(1.0, 0.24, 0.2), 28)
		draw_text_at(Vector2(size.x * 0.35, size.y * 0.49), "Score " + str(score) + " - R fuer Neustart", Color(0.9, 0.96, 1.0), 16)

func spawn_sparks(pos: Vector2, color: Color, count := 9) -> void:
	for i in range(count):
		particles.append({"pos": pos, "vel": Vector2(rng.randf_range(-145, 145), rng.randf_range(-145, 145)), "life": rng.randf_range(0.22, 0.62), "size": rng.randf_range(2.0, 5.0), "color": color})

func add_text(text: String, pos: Vector2, color: Color) -> void:
	floaters.append({"text": text, "pos": pos, "life": 1.15, "color": color})

func draw_regular_polygon(center: Vector2, radius: float, sides: int, color: Color, rotation := 0.0) -> void:
	var pts := PackedVector2Array()
	for i in range(sides):
		var a := rotation + float(i) / float(sides) * TAU
		pts.append(center + Vector2(cos(a), sin(a)) * radius)
	draw_colored_polygon(pts, color)
	pts.append(pts[0])
	draw_polyline(pts, Color.WHITE, 1.4)

func draw_text_at(pos: Vector2, text: String, color: Color = Color.WHITE, font_size: int = 14) -> void:
	draw_string(font, pos, text, HORIZONTAL_ALIGNMENT_LEFT, -1.0, font_size, color)
