extends Control

const WORLD_W := 5200.0
const WORLD_H := 760.0
const FLOOR_Y := 650.0
const PLAYER_W := 38.0
const PLAYER_H := 54.0
const GRAVITY := 1880.0
const MOVE_SPEED := 330.0
const JUMP_SPEED := -690.0
const DASH_SPEED := 760.0
const MAX_HP := 120.0
const MAX_ENERGY := 100.0
const LEARN_GOAL := 9
const COMBO_WINDOW := 4.8
const MAX_COMBO_MULTIPLIER := 4.0
const STOMP_BOUNCE := -535.0

const LESSONS = ["WORTART", "LESEN", "SATZ", "KOMPOSITUM", "MATHE", "ENGLISCH", "SACHKUNDE"]

const TASKS_WORD = [
	{"prompt": "Welche Wortart ist 'mutig'?", "answer": "Adjektiv", "options": ["Nomen", "Adjektiv", "Verb"]},
	{"prompt": "Welches Wort ist ein Verb?", "answer": "bauen", "options": ["Metall", "bauen", "klein"]},
	{"prompt": "Welche Wortart ist 'unter'?", "answer": "Praeposition", "options": ["Artikel", "Praeposition", "Nomen"]},
	{"prompt": "Welches Wort ist ein Nomen?", "answer": "Roboter", "options": ["Roboter", "rollen", "schnell"]},
	{"prompt": "Welche Wortart ist 'und'?", "answer": "Konjunktion", "options": ["Konjunktion", "Verb", "Adjektiv"]}
]

const TASKS_READING = [
	{"prompt": "Was nutzt du an blauen Ankern?", "answer": "Grapple", "options": ["Grapple", "Kiste", "Wolke"]},
	{"prompt": "Was bedeutet 'reparieren'?", "answer": "wieder ganz machen", "options": ["springen", "wieder ganz machen", "verstecken"]},
	{"prompt": "Welches Wort passt: Der Motor ___ laut.", "answer": "brummt", "options": ["brummt", "liest", "schlaeft"]},
	{"prompt": "Welches Wort reimt sich auf 'Kabel'?", "answer": "Gabel", "options": ["Gabel", "Mond", "Tor"]},
	{"prompt": "Welches Wort passt zum Hinweis: fliegen ohne Fluegel", "answer": "Hover", "options": ["Hover", "Hammer", "Reifen"]}
]

const TASKS_SENTENCE = [
	{"prompt": "Wo steht das Verb? 'Faska repariert den Bot.'", "answer": "repariert", "options": ["Faska", "repariert", "Bot"]},
	{"prompt": "Welcher Satz ist richtig?", "answer": "Der Bot sammelt Bolts.", "options": ["Der Bot sammelt Bolts.", "Sammelt der Bolts Bot.", "Bot der Bolts sammelt."]},
	{"prompt": "Was fehlt? 'Die Tuer ___ auf.'", "answer": "geht", "options": ["geht", "blau", "unter"]},
	{"prompt": "Welche Satzart ist: 'Oeffne das Tor!'", "answer": "Aufforderung", "options": ["Frage", "Aufforderung", "Aussage"]},
	{"prompt": "Was ist das Subjekt? 'Der kleine Bot rollt.'", "answer": "Der kleine Bot", "options": ["rollt", "kleine", "Der kleine Bot"]}
]

const TASKS_COMPOUND = [
	{"prompt": "Bilde das Kompositum: Werkzeug + Kiste", "answer": "Werkzeugkiste", "options": ["Kistenwerk", "Werkzeugkiste", "Zeugkiste"]},
	{"prompt": "Welche Teile hat 'Raketenrucksack'?", "answer": "Raketen + Rucksack", "options": ["Raketen + Rucksack", "Raten + Sack", "Ruck + Sack"]},
	{"prompt": "Welches Wort besteht aus zwei Nomen?", "answer": "Stromtor", "options": ["Stromtor", "hell", "laufen"]},
	{"prompt": "Was passt zusammen?", "answer": "Gadget + Labor", "options": ["Gadget + Labor", "schnell + und", "rot + rennt"]},
	{"prompt": "Welches Kompositum passt zum Spiel?", "answer": "Blasterstrahl", "options": ["Blasterstrahl", "Strahlblau", "lautgehen"]}
]

const TASKS_MATH = [
	{"prompt": "8 + 7 = ?", "answer": "15", "options": ["13", "15", "17"]},
	{"prompt": "6 x 4 = ?", "answer": "24", "options": ["20", "22", "24"]},
	{"prompt": "42 : 6 = ?", "answer": "7", "options": ["6", "7", "8"]},
	{"prompt": "90 - 35 = ?", "answer": "55", "options": ["45", "55", "65"]},
	{"prompt": "Welche Zahl ist gerade?", "answer": "32", "options": ["21", "32", "43"]}
]

const TASKS_ENGLISH = [
	{"prompt": "Was bedeutet 'tool'?", "answer": "Werkzeug", "options": ["Werkzeug", "Wolke", "Tuer"]},
	{"prompt": "Was bedeutet 'rocket'?", "answer": "Rakete", "options": ["Rakete", "Roboter", "Regen"]},
	{"prompt": "Was bedeutet 'jump'?", "answer": "springen", "options": ["springen", "lesen", "malen"]},
	{"prompt": "Was bedeutet 'shield'?", "answer": "Schild", "options": ["Schild", "Schule", "Schraube"]},
	{"prompt": "Was bedeutet 'repair'?", "answer": "reparieren", "options": ["reparieren", "rennen", "rufen"]}
]

const TASKS_SCIENCE = [
	{"prompt": "Was leitet Strom gut?", "answer": "Metall", "options": ["Metall", "Holz", "Papier"]},
	{"prompt": "Was speichert Energie?", "answer": "Akku", "options": ["Akku", "Stein", "Feder"]},
	{"prompt": "Was bremst Bewegung?", "answer": "Reibung", "options": ["Reibung", "Licht", "Klang"]},
	{"prompt": "Wodurch entstehen Schatten?", "answer": "Licht wird blockiert", "options": ["Licht wird blockiert", "Wasser kocht", "Metall rostet"]},
	{"prompt": "Was misst ein Thermometer?", "answer": "Temperatur", "options": ["Temperatur", "Gewicht", "Laenge"]}
]

const PLATFORM_DEFS = [
	{"x": 0.0, "y": FLOOR_Y, "w": 650.0, "h": 110.0, "kind": "solid"},
	{"x": 760.0, "y": 580.0, "w": 260.0, "h": 34.0, "kind": "solid"},
	{"x": 1140.0, "y": 500.0, "w": 280.0, "h": 34.0, "kind": "solid"},
	{"x": 1540.0, "y": 410.0, "w": 250.0, "h": 34.0, "kind": "boost"},
	{"x": 1940.0, "y": 546.0, "w": 330.0, "h": 34.0, "kind": "ice"},
	{"x": 2420.0, "y": 470.0, "w": 280.0, "h": 34.0, "kind": "solid"},
	{"x": 2860.0, "y": 382.0, "w": 260.0, "h": 34.0, "kind": "solid"},
	{"x": 3280.0, "y": 510.0, "w": 350.0, "h": 34.0, "kind": "boost"},
	{"x": 3840.0, "y": 432.0, "w": 310.0, "h": 34.0, "kind": "solid"},
	{"x": 4330.0, "y": 600.0, "w": 870.0, "h": 120.0, "kind": "solid"},
	{"x": 650.0, "y": FLOOR_Y + 8.0, "w": 130.0, "h": 70.0, "kind": "acid"},
	{"x": 1790.0, "y": FLOOR_Y + 8.0, "w": 150.0, "h": 70.0, "kind": "acid"},
	{"x": 3120.0, "y": FLOOR_Y + 8.0, "w": 160.0, "h": 70.0, "kind": "acid"},
	{"x": 4150.0, "y": FLOOR_Y + 8.0, "w": 180.0, "h": 70.0, "kind": "acid"}
]

const ANCHOR_DEFS = [
	Vector2(990, 265), Vector2(1600, 230), Vector2(2290, 290), Vector2(3010, 210), Vector2(3690, 270), Vector2(4310, 310)
]

const BOLT_DEFS = [
	Vector2(820, 522), Vector2(910, 522), Vector2(1205, 444), Vector2(1345, 444), Vector2(1620, 352),
	Vector2(2020, 488), Vector2(2170, 488), Vector2(2500, 414), Vector2(2630, 414), Vector2(2935, 324),
	Vector2(3370, 454), Vector2(3530, 454), Vector2(3955, 374), Vector2(4525, 540), Vector2(4705, 540)
]

const CRATE_DEFS = [
	{"pos": Vector2(440, FLOOR_Y - 46), "kind": "ammo"},
	{"pos": Vector2(880, 532), "kind": "bolts"},
	{"pos": Vector2(1315, 452), "kind": "energy"},
	{"pos": Vector2(1660, 362), "kind": "bolts"},
	{"pos": Vector2(2110, 498), "kind": "ammo"},
	{"pos": Vector2(2605, 422), "kind": "bolts"},
	{"pos": Vector2(3490, 462), "kind": "energy"},
	{"pos": Vector2(4000, 384), "kind": "ammo"},
	{"pos": Vector2(4640, 550), "kind": "bolts"}
]

const STATION_DEFS = [
	{"id": "blaster", "label": "BLASTER+", "x": 575.0, "y": FLOOR_Y - 76.0, "cost": 5},
	{"id": "hover", "label": "HOVER+", "x": 1580.0, "y": 348.0, "cost": 9},
	{"id": "grapple", "label": "GRAPPLE+", "x": 2460.0, "y": 405.0, "cost": 11},
	{"id": "dash", "label": "DASH+", "x": 3030.0, "y": 320.0, "cost": 13}
]

const ENEMY_DEFS = [
	{"x": 1235.0, "y": 462.0, "min": 1140.0, "max": 1410.0, "kind": "drone"},
	{"x": 2060.0, "y": 508.0, "min": 1940.0, "max": 2250.0, "kind": "roller"},
	{"x": 2540.0, "y": 432.0, "min": 2420.0, "max": 2680.0, "kind": "drone"},
	{"x": 3410.0, "y": 472.0, "min": 3290.0, "max": 3610.0, "kind": "roller"},
	{"x": 3980.0, "y": 394.0, "min": 3860.0, "max": 4120.0, "kind": "turret"},
	{"x": 4760.0, "y": 552.0, "min": 4470.0, "max": 5060.0, "kind": "boss"}
]

const TERMINAL_POS = [Vector2(960, 520), Vector2(2590, 410), Vector2(3920, 374)]

var font
var rng := RandomNumberGenerator.new()
var player := {}
var camera := Vector2.ZERO
var platforms := []
var bolts := []
var crates := []
var stations := []
var enemies := []
var shots := []
var particles := []
var floaters := []
var terminals := []
var touch_axis := Vector2.ZERO
var touch_pointer := -1
var touch_buttons := {}
var touch_button_state := {}
var active_touch_buttons := {}
var mode := "Normal"
var phase := "run"
var score := 0
var combo := 0
var combo_timer := 0.0
var run_clock := 0.0
var message := ""
var message_timer := 0.0
var shake := 0.0
var question_index := 0
var lesson_index := 0
var repeat_queue: Array = []
var stats := {}

func _ready() -> void:
	rng.seed = 424244
	font = get_theme_default_font()
	mouse_filter = Control.MOUSE_FILTER_PASS
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	reset_game()

func reset_game() -> void:
	player = {
		"pos": Vector2(115, FLOOR_Y - PLAYER_H * 0.5),
		"vel": Vector2.ZERO,
		"facing": 1,
		"hp": MAX_HP,
		"energy": MAX_ENERGY,
		"ammo": 10,
		"bolts": 0,
		"on_ground": false,
		"coyote": 0.0,
		"jump_buffer": 0.0,
		"double_jump": true,
		"dash_cd": 0.0,
		"dash": 0.0,
		"attack": 0.0,
		"attack_cd": 0.0,
		"shot_cd": 0.0,
		"hurt_cd": 0.0,
		"hover": 0.0,
		"grapple": 0.0,
		"grapple_target": Vector2.ZERO,
		"overcharge": 0.0,
		"melee_chain": 0,
		"melee_chain_timer": 0.0,
		"upgrades": {"blaster": false, "hover": false, "dash": false, "grapple": false}
	}
	camera = Vector2.ZERO
	score = 0
	combo = 0
	combo_timer = 0.0
	run_clock = 0.0
	phase = "run"
	mode = "Normal"
	message = "Sammle Bolts, kaufe Gadgets und erreiche das Sternentor."
	message_timer = 3.0
	question_index = 0
	lesson_index = 0
	repeat_queue.clear()
	platforms = PLATFORM_DEFS.duplicate(true)
	bolts.clear()
	for i in range(BOLT_DEFS.size()):
		bolts.append({"pos": BOLT_DEFS[i], "taken": false})
	crates = CRATE_DEFS.duplicate(true)
	for crate in crates:
		crate["open"] = false
	stations = STATION_DEFS.duplicate(true)
	for station in stations:
		station["bought"] = false
	enemies = ENEMY_DEFS.duplicate(true)
	for i in range(enemies.size()):
		var hp := 3.0
		if String(enemies[i].kind) == "turret":
			hp = 4.0
		elif String(enemies[i].kind) == "boss":
			hp = 28.0
		enemies[i]["hp"] = hp
		enemies[i]["max_hp"] = hp
		enemies[i]["dir"] = -1 if i % 2 == 0 else 1
		enemies[i]["shot"] = 0.8 + float(i) * 0.18
		enemies[i]["phase"] = 1
		enemies[i]["charge"] = 0.0
		enemies[i]["charge_dir"] = -1
		enemies[i]["summon"] = 3.6
		enemies[i]["hurt"] = 0.0
	shots.clear()
	particles.clear()
	floaters.clear()
	touch_buttons.clear()
	touch_axis = Vector2.ZERO
	touch_pointer = -1
	touch_button_state = {"jump": false, "dash": false, "atk": false, "shot": false, "hook": false, "interact": false}
	active_touch_buttons.clear()
	stats = {"kills": 0, "crates": 0, "upgrades": 0, "learn": 0, "wrong": 0, "trials": 0}
	build_terminals()

func build_terminals() -> void:
	terminals.clear()
	var task: Dictionary = current_task()
	for i in range(3):
		terminals.append({"pos": TERMINAL_POS[i], "label": String(task.options[i]), "answer": String(task.answer), "task": task, "repeat": bool(task.get("repeat", false))})

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()
	if phase == "run":
		update_game(delta)
	update_effects(delta)
	queue_redraw()

func update_game(delta: float) -> void:
	run_clock += delta
	update_player(delta)
	update_enemies(delta)
	update_shots(delta)
	update_pickups(delta)
	update_terminals()
	if Vector2(player.pos).x > WORLD_W - 150.0 and boss_defeated():
		phase = "win"
		message = "Sternentor offen - Gadget Quest geschafft!"
		message_timer = 99.0
	camera = (Vector2(player.pos) - size * 0.5).clamp(Vector2.ZERO, Vector2(max(0.0, WORLD_W - size.x), max(0.0, WORLD_H - size.y)))

func update_player(delta: float) -> void:
	var axis := 0.0
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		axis -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		axis += 1.0
	if abs(touch_axis.x) > 0.15:
		axis += touch_axis.x
	axis = clamp(axis, -1.0, 1.0)
	if abs(axis) > 0.05:
		player.facing = 1 if axis > 0.0 else -1
	player.energy = min(MAX_ENERGY, float(player.energy) + delta * 18.0)
	player.jump_buffer = max(0.0, float(player.jump_buffer) - delta)
	player.coyote = max(0.0, float(player.coyote) - delta)
	player.dash_cd = max(0.0, float(player.dash_cd) - delta)
	player.attack = max(0.0, float(player.attack) - delta)
	player.attack_cd = max(0.0, float(player.attack_cd) - delta)
	player.shot_cd = max(0.0, float(player.shot_cd) - delta)
	player.hurt_cd = max(0.0, float(player.hurt_cd) - delta)
	player.hover = max(0.0, float(player.hover) - delta)
	player.grapple = max(0.0, float(player.grapple) - delta)
	player.overcharge = max(0.0, float(player.overcharge) - delta)
	player.melee_chain_timer = max(0.0, float(player.melee_chain_timer) - delta)
	if float(player.melee_chain_timer) <= 0.0:
		player.melee_chain = 0
	if touch_button_state.get("dash", false):
		start_dash()
	if touch_button_state.get("atk", false):
		start_attack()
	if touch_button_state.get("shot", false):
		fire_blaster()
	if float(player.dash) > 0.0:
		player.vel = Vector2(float(player.facing) * DASH_SPEED, 0.0)
		player.dash = max(0.0, float(player.dash) - delta)
	elif float(player.grapple) > 0.0:
		var to_target: Vector2 = Vector2(player.grapple_target) - Vector2(player.pos)
		player.vel = to_target.normalized() * 760.0
		if to_target.length() < 34.0:
			player.grapple = 0.0
	else:
		var desired_x: float = axis * MOVE_SPEED
		if bool(player.upgrades.dash):
			desired_x *= 1.08
		player.vel = Vector2(lerp(float(Vector2(player.vel).x), desired_x, min(1.0, delta * 9.0)), Vector2(player.vel).y)
		var holding_jump: bool = Input.is_key_pressed(KEY_SPACE) or Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP) or bool(touch_button_state.get("jump", false))
		if bool(player.upgrades.hover) and holding_jump and not bool(player.on_ground) and float(player.energy) > 0.0 and Vector2(player.vel).y > -120.0:
			player.vel = Vector2(Vector2(player.vel).x, min(Vector2(player.vel).y + GRAVITY * delta * 0.18, 115.0))
			player.energy = max(0.0, float(player.energy) - delta * 24.0)
			player.hover = 0.18
		else:
			player.vel = Vector2(Vector2(player.vel).x, Vector2(player.vel).y + GRAVITY * delta)
	apply_movement(delta)
	if float(player.jump_buffer) > 0.0:
		consume_jump()

func apply_movement(delta: float) -> void:
	player.on_ground = false
	var pos := Vector2(player.pos)
	var vel := Vector2(player.vel)
	pos.x += vel.x * delta
	var rect := player_rect_at(pos)
	for platform in platforms:
		if String(platform.kind) == "acid":
			continue
		var p_rect := platform_rect(platform)
		if rect.intersects(p_rect):
			if vel.x > 0.0:
				pos.x = p_rect.position.x - PLAYER_W * 0.5
			elif vel.x < 0.0:
				pos.x = p_rect.position.x + p_rect.size.x + PLAYER_W * 0.5
			vel.x = 0.0
			rect = player_rect_at(pos)
	pos.y += vel.y * delta
	rect = player_rect_at(pos)
	for platform in platforms:
		var p_rect := platform_rect(platform)
		if String(platform.kind) == "acid":
			if rect.intersects(p_rect):
				damage_player(18.0, "Saeure")
				pos = checkpoint_position()
				vel = Vector2.ZERO
			continue
		if rect.intersects(p_rect):
			if vel.y > 0.0:
				pos.y = p_rect.position.y - PLAYER_H * 0.5
				vel.y = 0.0
				player.on_ground = true
				player.coyote = 0.12
				player.double_jump = true
				if String(platform.kind) == "boost":
					vel.y = -820.0
					player.on_ground = false
					add_text("BOOST", pos, Color(0.95, 0.82, 0.25))
			elif vel.y < 0.0:
				pos.y = p_rect.position.y + p_rect.size.y + PLAYER_H * 0.5
				vel.y = 0.0
			rect = player_rect_at(pos)
	pos.x = clamp(pos.x, PLAYER_W * 0.5, WORLD_W - PLAYER_W * 0.5)
	if pos.y > WORLD_H + 80.0:
		damage_player(22.0, "Sturz")
		pos = checkpoint_position()
		vel = Vector2.ZERO
	player.pos = pos
	player.vel = vel

func checkpoint_position() -> Vector2:
	var x: float = max(115.0, Vector2(player.pos).x - 360.0)
	return Vector2(x, FLOOR_Y - PLAYER_H * 0.5)

func start_jump() -> void:
	player.jump_buffer = 0.13

func consume_jump() -> void:
	if bool(player.on_ground) or float(player.coyote) > 0.0:
		player.vel = Vector2(Vector2(player.vel).x, JUMP_SPEED)
		player.on_ground = false
		player.coyote = 0.0
		player.jump_buffer = 0.0
		add_text("JUMP", Vector2(player.pos), Color(0.5, 0.9, 1.0))
	elif bool(player.double_jump):
		player.vel = Vector2(Vector2(player.vel).x, JUMP_SPEED * 0.88)
		player.double_jump = false
		player.jump_buffer = 0.0
		spawn_sparks(Vector2(player.pos), Color(0.45, 0.75, 1.0), 12)

func start_dash() -> void:
	if not bool(player.upgrades.dash) and Vector2(player.pos).x > 2900.0:
		return
	if float(player.dash_cd) > 0.0 or float(player.energy) < 18.0:
		return
	player.dash_cd = 0.42
	player.dash = 0.17
	player.energy = max(0.0, float(player.energy) - 18.0)
	add_text("DASH", Vector2(player.pos), Color(0.95, 0.82, 0.25))

func start_attack() -> void:
	if float(player.attack_cd) > 0.0:
		return
	player.attack_cd = 0.34
	player.attack = 0.16
	player.melee_chain = min(3, int(player.melee_chain) + 1)
	player.melee_chain_timer = 0.58
	var chain := int(player.melee_chain)
	var attack_width := 78.0 + float(chain) * 12.0
	var hit_x := Vector2(player.pos).x + (12.0 if int(player.facing) > 0 else -12.0 - attack_width)
	var hit_rect := Rect2(Vector2(hit_x, Vector2(player.pos).y - 36.0), Vector2(attack_width, 68.0))
	var wrench_damage := 1.7 + float(chain) * 0.35
	if float(player.overcharge) > 0.0:
		wrench_damage *= 1.25
	for i in range(enemies.size() - 1, -1, -1):
		if enemy_rect(enemies[i]).intersects(hit_rect):
			hit_enemy(i, wrench_damage, "wrench")
	for i in range(crates.size() - 1, -1, -1):
		if not bool(crates[i].open) and crate_rect(crates[i]).intersects(hit_rect):
			open_crate(i)

func fire_blaster() -> void:
	if not bool(player.upgrades.blaster) and int(player.ammo) <= 0:
		return
	if float(player.shot_cd) > 0.0 or int(player.ammo) <= 0:
		return
	player.shot_cd = 0.24 if bool(player.upgrades.blaster) else 0.38
	player.ammo = max(0, int(player.ammo) - 1)
	var dir := Vector2(float(player.facing), 0.0)
	var shot_damage := 1.4 if bool(player.upgrades.blaster) else 1.0
	if float(player.overcharge) > 0.0:
		shot_damage *= 1.35
	shots.append({"pos": Vector2(player.pos) + Vector2(float(player.facing) * 28.0, -8.0), "vel": dir * 820.0, "life": 1.2, "from_player": true, "damage": shot_damage, "radius": 6.0, "color": Color(0.98, 0.78, 0.22)})

func start_grapple() -> void:
	if not bool(player.upgrades.grapple):
		add_text("Grapple fehlt", Vector2(player.pos), Color(1.0, 0.35, 0.2))
		return
	var best := Vector2.ZERO
	var best_dist := 99999.0
	for anchor in ANCHOR_DEFS:
		var d := Vector2(player.pos).distance_to(anchor)
		if d < best_dist and d < 460.0 and anchor.y < Vector2(player.pos).y + 50.0:
			best = anchor
			best_dist = d
	if best_dist < 99999.0 and float(player.energy) >= 20.0:
		player.grapple_target = best
		player.grapple = 0.42
		player.energy = max(0.0, float(player.energy) - 20.0)
		add_text("HOOK", Vector2(player.pos), Color(0.7, 0.55, 1.0))
	else:
		add_text("Kein Anker", Vector2(player.pos), Color(0.8, 0.86, 1.0))

func interact() -> void:
	var p := Vector2(player.pos)
	for station in stations:
		if bool(station.bought):
			continue
		if p.distance_to(Vector2(float(station.x), float(station.y))) < 86.0:
			var cost := int(station.cost)
			if int(player.bolts) >= cost:
				player.bolts -= cost
				station.bought = true
				player.upgrades[String(station.id)] = true
				stats.upgrades += 1
				add_combo(2)
				award_score(650, p, "UPGRADE")
				add_text(String(station.label), p, Color(0.95, 0.82, 0.25))
			else:
				add_text("Noch " + str(cost - int(player.bolts)) + " Bolts", p, Color(1.0, 0.6, 0.25))
			return
	if mode == "Learncade":
		for terminal in terminals:
			if p.distance_to(Vector2(terminal.pos)) < 78.0:
				resolve_terminal(terminal)
				return

func update_enemies(delta: float) -> void:
	for i in range(enemies.size() - 1, -1, -1):
		var e = enemies[i]
		e.hurt = max(0.0, float(e.hurt) - delta)
		e.charge = max(0.0, float(e.get("charge", 0.0)) - delta)
		e.summon = max(0.0, float(e.get("summon", 2.0)) - delta)
		var kind := String(e.kind)
		if kind == "turret":
			e.shot = float(e.shot) - delta
			if float(e.shot) <= 0.0 and abs(Vector2(player.pos).x - float(e.x)) < 700.0:
				e.shot = 1.15
				fire_enemy_shot(e)
		elif kind == "boss":
			var ratio: float = clamp(float(e.hp) / float(e.max_hp), 0.0, 1.0)
			e.phase = 3 if ratio < 0.34 else (2 if ratio < 0.68 else 1)
			e.shot = float(e.shot) - delta
			if float(e.charge) > 0.0:
				e.x = float(e.x) + float(e.charge_dir) * (250.0 + float(e.phase) * 70.0) * delta
			else:
				var chase_dir: float = sign(Vector2(player.pos).x - float(e.x))
				e.x = float(e.x) + chase_dir * (28.0 + float(e.phase) * 14.0) * delta + sin(run_clock * 2.1) * 24.0 * delta
			e.x = clamp(float(e.x), float(e.min), float(e.max))
			if float(e.shot) <= 0.0:
				e.shot = 1.12 if int(e.phase) == 1 else (0.88 if int(e.phase) == 2 else 0.68)
				fire_boss_pattern(e, int(e.phase))
				if int(e.phase) >= 3:
					e.charge = 0.36
					e.charge_dir = -1 if Vector2(player.pos).x < float(e.x) else 1
					add_text("BOSS DASH", Vector2(float(e.x), float(e.y)), Color(1.0, 0.44, 0.16))
			if int(e.phase) >= 2 and float(e.summon) <= 0.0:
				e.summon = 4.6 if int(e.phase) == 2 else 3.5
				spawn_boss_minion(Vector2(float(e.x), float(e.y)))
		else:
			e.x = float(e.x) + float(e.dir) * (120.0 if kind == "drone" else 155.0) * delta
			if float(e.x) < float(e.min) or float(e.x) > float(e.max):
				e.dir = -int(e.dir)
			if kind == "drone":
				e.y = float(e.y) + sin(Time.get_ticks_msec() * 0.004 + float(i)) * 20.0 * delta
		if enemy_rect(e).intersects(player_rect()):
			if can_stomp_enemy(e):
				player.vel = Vector2(Vector2(player.vel).x, STOMP_BOUNCE)
				player.energy = min(MAX_ENERGY, float(player.energy) + 12.0)
				add_combo(1)
				hit_enemy(i, 2.2 if kind != "boss" else 1.4, "stomp")
				continue
			elif float(player.dash) > 0.0:
				player.vel = Vector2(Vector2(player.vel).x * -0.25, -260.0)
				add_combo(1)
				hit_enemy(i, 1.45 if kind != "boss" else 1.1, "dash")
				continue
			damage_player(10.0 if kind != "boss" else 18.0, "Bot")
		enemies[i] = e

func fire_enemy_shot(e) -> void:
	var start := Vector2(float(e.x), float(e.y) - 26.0)
	var dir := (Vector2(player.pos) - start).normalized()
	shots.append({"pos": start, "vel": dir * 420.0, "life": 2.2, "from_player": false, "damage": 9.0, "radius": 6.0, "color": Color(1.0, 0.25, 0.2)})

func fire_boss_pattern(e, boss_phase: int) -> void:
	var start := Vector2(float(e.x), float(e.y) - 34.0)
	var dir := (Vector2(player.pos) - start).normalized()
	var angles := [-0.18, 0.0, 0.18] if boss_phase >= 2 else [0.0]
	for angle in angles:
		shots.append({"pos": start, "vel": dir.rotated(angle) * (430.0 + float(boss_phase) * 35.0), "life": 2.3, "from_player": false, "damage": 9.0 + float(boss_phase), "radius": 7.0, "color": Color(1.0, 0.22, 0.16)})
	if boss_phase >= 3:
		for j in range(3):
			var drop_x: float = clamp(Vector2(player.pos).x + float(j - 1) * 82.0, float(e.min), float(e.max))
			shots.append({"pos": Vector2(drop_x, float(e.y) - 135.0 - float(j) * 20.0), "vel": Vector2(rng.randf_range(-55.0, 55.0), 520.0), "life": 1.45, "from_player": false, "damage": 12.0, "radius": 10.0, "color": Color(1.0, 0.58, 0.18)})
	add_text("PHASE " + str(boss_phase), start, Color(1.0, 0.62, 0.18))

func spawn_boss_minion(pos: Vector2) -> void:
	var side := -1 if rng.randf() < 0.5 else 1
	var spawn_x: float = clamp(pos.x + float(side) * rng.randf_range(95.0, 180.0), 4400.0, WORLD_W - 120.0)
	var minion := {
		"x": spawn_x,
		"y": FLOOR_Y - 46.0,
		"min": max(4330.0, spawn_x - 180.0),
		"max": min(WORLD_W - 90.0, spawn_x + 180.0),
		"kind": "roller",
		"hp": 2.0,
		"max_hp": 2.0,
		"dir": side,
		"shot": 1.2,
		"phase": 1,
		"charge": 0.0,
		"charge_dir": side,
		"summon": 9.0,
		"hurt": 0.0
	}
	enemies.append(minion)
	add_text("BOT DROP", pos, Color(1.0, 0.58, 0.18))

func update_shots(delta: float) -> void:
	for i in range(shots.size() - 1, -1, -1):
		var s = shots[i]
		s.pos = Vector2(s.pos) + Vector2(s.vel) * delta
		s.life = float(s.life) - delta
		var remove := false
		if bool(s.from_player):
			for e_i in range(enemies.size() - 1, -1, -1):
				if enemy_rect(enemies[e_i]).has_point(Vector2(s.pos)):
					hit_enemy(e_i, float(s.damage), "blaster")
					remove = true
					break
		else:
			if player_rect().has_point(Vector2(s.pos)):
				damage_player(float(s.damage), "Laser")
				remove = true
		if float(s.life) <= 0.0 or Vector2(s.pos).x < -40.0 or Vector2(s.pos).x > WORLD_W + 40.0 or Vector2(s.pos).y > WORLD_H + 80.0:
			remove = true
		if remove:
			shots.remove_at(i)
		else:
			shots[i] = s

func hit_enemy(index: int, damage: float, source: String) -> void:
	if index < 0 or index >= enemies.size():
		return
	var e = enemies[index]
	if source == "wrench" and float(player.overcharge) > 0.0:
		damage *= 1.6
	e.hp = float(e.hp) - damage
	e.hurt = 0.18
	spawn_sparks(Vector2(float(e.x), float(e.y)), Color(1.0, 0.35, 0.15), 8)
	if float(e.hp) <= 0.0:
		var points := 220
		if String(e.kind) == "boss":
			points = 2400
			add_text("BOSSBOT DOWN", Vector2(e.x, e.y), Color(0.95, 0.82, 0.25))
		add_combo(1 if String(e.kind) != "boss" else 4)
		award_score(points, Vector2(float(e.x), float(e.y)), "KILL")
		stats.kills += 1
		drop_bolts(Vector2(float(e.x), float(e.y)), 4 if String(e.kind) != "boss" else 12)
		enemies.remove_at(index)
	else:
		enemies[index] = e

func update_pickups(_delta: float) -> void:
	var p := Vector2(player.pos)
	for bolt in bolts:
		if bool(bolt.taken):
			continue
		if p.distance_to(Vector2(bolt.pos)) < 42.0:
			bolt.taken = true
			player.bolts += 1
			award_score(70, p, "+Bolt")

func drop_bolts(pos: Vector2, amount: int) -> void:
	for i in range(amount):
		bolts.append({"pos": pos + Vector2(rng.randf_range(-36, 36), rng.randf_range(-44, -8)), "taken": false})

func open_crate(index: int) -> void:
	if index < 0 or index >= crates.size():
		return
	crates[index].open = true
	stats.crates += 1
	add_combo(1)
	award_score(140, Vector2(crates[index].pos), "CRATE")
	var kind := String(crates[index].kind)
	if kind == "ammo":
		player.ammo = min(24, int(player.ammo) + 5)
		add_text("+Ammo", Vector2(crates[index].pos), Color(0.98, 0.78, 0.22))
	elif kind == "energy":
		player.energy = MAX_ENERGY
		player.overcharge = 5.0
		add_text("OVERCHARGE", Vector2(crates[index].pos), Color(0.35, 0.95, 1.0))
	else:
		player.bolts += 3
		add_text("+3 Bolts", Vector2(crates[index].pos), Color(0.95, 0.82, 0.25))
	spawn_sparks(Vector2(crates[index].pos), Color(0.95, 0.6, 0.2), 12)

func update_terminals() -> void:
	if mode != "Learncade":
		return
	for terminal in terminals:
		if Vector2(player.pos).distance_to(Vector2(terminal.pos)) < 44.0:
			resolve_terminal(terminal)
			return

func resolve_terminal(terminal) -> void:
	var task: Dictionary = terminal.task
	if String(terminal.label) == String(terminal.answer):
		stats.learn += 1
		add_combo(2)
		award_score(650, Vector2(terminal.pos), "LEARN")
		player.energy = MAX_ENERGY
		player.ammo = min(24, int(player.ammo) + 3)
		if bool(terminal.repeat):
			remove_repeat(task)
		if int(stats.learn) == LEARN_GOAL:
			player.overcharge = 10.0
			add_text("MASTER OVERCHARGE", Vector2(player.pos), Color(0.35, 0.95, 1.0))
		else:
			add_text("RICHTIG", Vector2(terminal.pos), Color(0.35, 1.0, 0.55))
	else:
		stats.wrong += 1
		queue_repeat(task)
		damage_player(8.0, "Falsches Terminal")
		add_text("FALSCH - kommt wieder", Vector2(terminal.pos), Color(1.0, 0.25, 0.2))
	if repeat_queue.size() == 0 or not bool(task.get("repeat", false)):
		question_index = (question_index + 1) % question_bank().size()
	build_terminals()

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
	message = "Learncade: beruehre das richtige Terminal." if mode == "Learncade" else "Normalmodus aktiv."
	message_timer = 2.4
	if mode == "Learncade":
		build_terminals()

func cycle_lesson() -> void:
	lesson_index = (lesson_index + 1) % LESSONS.size()
	question_index = 0
	repeat_queue.clear()
	message = "Fach: " + String(LESSONS[lesson_index])
	message_timer = 1.8
	if mode == "Learncade":
		build_terminals()

func damage_player(amount: float, reason: String) -> void:
	if float(player.hurt_cd) > 0.0:
		return
	player.hp = max(0.0, float(player.hp) - amount)
	player.hurt_cd = 0.75
	combo = 0
	combo_timer = 0.0
	shake = 0.8
	add_text(reason + " -" + str(int(amount)), Vector2(player.pos), Color(1.0, 0.24, 0.18))
	if float(player.hp) <= 0.0:
		phase = "over"
		message = "Quest gescheitert - R fuer Neustart"
		message_timer = 99.0

func boss_defeated() -> bool:
	for e in enemies:
		if String(e.kind) == "boss":
			return false
	return true

func can_stomp_enemy(e) -> bool:
	if Vector2(player.vel).y < 130.0:
		return false
	var p_rect := player_rect()
	var e_rect := enemy_rect(e)
	return p_rect.position.y + p_rect.size.y * 0.72 < e_rect.position.y + e_rect.size.y * 0.38

func add_combo(amount: int) -> void:
	combo = min(99, combo + amount)
	combo_timer = COMBO_WINDOW

func combo_multiplier() -> float:
	return min(MAX_COMBO_MULTIPLIER, 1.0 + floor(float(combo) / 4.0) * 0.5)

func award_score(base: int, pos: Vector2 = Vector2.ZERO, label := "") -> void:
	var gained := int(round(float(base) * combo_multiplier()))
	score += gained
	if label != "":
		add_text(label + " +" + str(gained), pos, Color(0.95, 0.82, 0.25))

func _unhandled_input(event) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		match event.keycode:
			KEY_R:
				reset_game()
			KEY_SPACE, KEY_W, KEY_UP:
				start_jump()
			KEY_SHIFT, KEY_X:
				start_dash()
			KEY_J:
				start_attack()
			KEY_K:
				fire_blaster()
			KEY_G:
				start_grapple()
			KEY_E:
				interact()
			KEY_L:
				toggle_learncade()
			KEY_C, KEY_TAB:
				cycle_lesson()

func _gui_input(event) -> void:
	if event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_LEFT:
			start_attack()
		elif event.button_index == MOUSE_BUTTON_RIGHT:
			fire_blaster()
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
	if name == "jump":
		start_jump()
	elif name == "dash":
		start_dash()
	elif name == "atk":
		start_attack()
	elif name == "shot":
		fire_blaster()
	elif name == "hook":
		start_grapple()
	elif name == "interact":
		interact()
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
	shake = max(0.0, shake - delta * 6.5)
	if combo_timer > 0.0:
		combo_timer = max(0.0, combo_timer - delta)
	elif combo > 0:
		combo = 0
	for i in range(floaters.size() - 1, -1, -1):
		var f = floaters[i]
		f.life = float(f.life) - delta
		f.pos = Vector2(f.pos) + Vector2(0.0, -42.0) * delta
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

func player_rect() -> Rect2:
	return player_rect_at(Vector2(player.pos))

func player_rect_at(pos: Vector2) -> Rect2:
	return Rect2(pos - Vector2(PLAYER_W * 0.5, PLAYER_H * 0.5), Vector2(PLAYER_W, PLAYER_H))

func platform_rect(platform) -> Rect2:
	return Rect2(Vector2(float(platform.x), float(platform.y)), Vector2(float(platform.w), float(platform.h)))

func crate_rect(crate) -> Rect2:
	return Rect2(Vector2(crate.pos) - Vector2(23, 46), Vector2(46, 46))

func enemy_rect(enemy) -> Rect2:
	var size_vec := Vector2(42, 42)
	if String(enemy.kind) == "boss":
		size_vec = Vector2(82, 74)
	return Rect2(Vector2(float(enemy.x), float(enemy.y)) - size_vec * 0.5, size_vec)

func world_to_screen(pos: Vector2) -> Vector2:
	var offset := Vector2.ZERO
	if shake > 0.0:
		offset = Vector2(rng.randf_range(-shake, shake), rng.randf_range(-shake, shake)) * 7.0
	return pos - camera + offset

func _draw() -> void:
	draw_background()
	draw_world()
	draw_pickups()
	draw_terminals()
	draw_crates()
	draw_stations()
	draw_anchors()
	draw_enemies()
	draw_shots()
	draw_player()
	draw_particles()
	draw_hud()
	draw_touch_controls()
	draw_messages()

func draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color(0.035, 0.045, 0.075))
	for i in range(18):
		var x := fmod(float(i) * 130.0 - fmod(camera.x * 0.35, 130.0), size.x + 150.0) - 70.0
		draw_rect(Rect2(Vector2(x, 80 + float(i % 5) * 42.0), Vector2(72, 12)), Color(0.08, 0.13, 0.2, 0.55))
	for i in range(10):
		var sx := fmod(float(i) * 250.0 - fmod(camera.x * 0.18, 250.0), size.x + 260.0) - 120.0
		draw_circle(Vector2(sx, 120 + float(i % 3) * 86.0), 24.0, Color(0.08, 0.14, 0.23, 0.45))

func draw_world() -> void:
	for platform in platforms:
		var rect := Rect2(world_to_screen(Vector2(float(platform.x), float(platform.y))), Vector2(float(platform.w), float(platform.h)))
		var kind := String(platform.kind)
		var fill := Color(0.12, 0.17, 0.24)
		var edge := Color(0.42, 0.62, 0.82)
		if kind == "acid":
			fill = Color(0.13, 0.55, 0.28, 0.9)
			edge = Color(0.42, 1.0, 0.62)
		elif kind == "boost":
			fill = Color(0.20, 0.17, 0.08)
			edge = Color(1.0, 0.78, 0.20)
		elif kind == "ice":
			fill = Color(0.11, 0.24, 0.30)
			edge = Color(0.5, 0.9, 1.0)
		draw_rect(rect, fill)
		draw_rect(rect, Color(edge, 0.65), false, 2.0)
	var portal := Rect2(world_to_screen(Vector2(WORLD_W - 92, FLOOR_Y - 118)), Vector2(58, 118))
	draw_rect(portal, Color(0.12, 0.1, 0.26, 0.78))
	draw_arc(portal.get_center(), 64.0, 0.0, TAU, 46, Color(0.7, 0.55, 1.0), 4.0)
	draw_text_at(portal.position + Vector2(-32, -12), "STERNTOR", Color(0.88, 0.9, 1.0), 12)

func draw_pickups() -> void:
	for bolt in bolts:
		if bool(bolt.taken):
			continue
		var p := world_to_screen(Vector2(bolt.pos))
		draw_circle(p, 10.0, Color(0.95, 0.78, 0.25))
		draw_arc(p, 15.0, 0.0, TAU, 24, Color(1.0, 0.95, 0.5), 2.0)

func draw_terminals() -> void:
	if mode != "Learncade":
		return
	var task: Dictionary = current_task()
	draw_rect(Rect2(Vector2(size.x * 0.25, 14), Vector2(size.x * 0.5, 42)), Color(0.0, 0.0, 0.0, 0.58))
	draw_text_at(Vector2(size.x * 0.27, 40), String(task.prompt), Color(0.82, 0.94, 1.0), 16)
	for terminal in terminals:
		var p := world_to_screen(Vector2(terminal.pos))
		var ring := Color(0.36, 0.86, 1.0)
		if bool(terminal.repeat):
			ring = Color(1.0, 0.56, 0.95)
		draw_rect(Rect2(p - Vector2(58, 34), Vector2(116, 68)), Color(0.06, 0.12, 0.2, 0.82))
		draw_rect(Rect2(p - Vector2(58, 34), Vector2(116, 68)), ring, false, 3.0)
		draw_text_at(p + Vector2(-46, 5), String(terminal.label), Color(0.92, 0.98, 1.0), 13)

func draw_crates() -> void:
	for crate in crates:
		if bool(crate.open):
			continue
		var rect := Rect2(world_to_screen(Vector2(crate.pos) - Vector2(23, 46)), Vector2(46, 46))
		draw_rect(rect, Color(0.45, 0.24, 0.12))
		draw_rect(rect, Color(0.95, 0.72, 0.28), false, 2.0)
		draw_line(rect.position, rect.position + rect.size, Color(0.95, 0.72, 0.28), 2.0)

func draw_stations() -> void:
	for station in stations:
		var p := world_to_screen(Vector2(float(station.x), float(station.y)))
		var color := Color(0.95, 0.78, 0.24) if not bool(station.bought) else Color(0.3, 1.0, 0.62)
		draw_rect(Rect2(p - Vector2(44, 48), Vector2(88, 72)), Color(0.05, 0.08, 0.12, 0.86))
		draw_rect(Rect2(p - Vector2(44, 48), Vector2(88, 72)), color, false, 3.0)
		draw_text_at(p + Vector2(-34, -10), String(station.label), Color(0.96, 0.98, 1.0), 12)
		draw_text_at(p + Vector2(-18, 12), "B" + str(station.cost), color, 12)

func draw_anchors() -> void:
	for anchor in ANCHOR_DEFS:
		var p := world_to_screen(anchor)
		draw_circle(p, 13.0, Color(0.3, 0.84, 1.0, 0.22))
		draw_arc(p, 19.0, 0.0, TAU, 24, Color(0.42, 0.86, 1.0, 0.85), 2.0)
		if bool(player.upgrades.grapple):
			draw_line(p, p + Vector2(0, 35), Color(0.42, 0.86, 1.0, 0.35), 2.0)

func draw_enemies() -> void:
	for e in enemies:
		var rect := Rect2(world_to_screen(enemy_rect(e).position), enemy_rect(e).size)
		var kind := String(e.kind)
		var color := Color(0.95, 0.22, 0.18)
		if kind == "drone":
			color = Color(0.95, 0.48, 0.15)
		elif kind == "turret":
			color = Color(0.62, 0.5, 1.0)
		elif kind == "boss":
			color = Color(0.9, 0.1, 0.18)
		if float(e.hurt) > 0.0:
			color = Color(1.0, 1.0, 1.0)
		if kind == "boss":
			draw_rect(rect, Color(color, 0.9))
			draw_arc(rect.get_center(), 58.0, 0.0, TAU, 40, Color(1.0, 0.55, 0.12), 3.0)
			draw_text_at(rect.position + Vector2(13, -8), "PHASE " + str(e.get("phase", 1)), Color(1.0, 0.72, 0.24), 12)
			if float(e.get("charge", 0.0)) > 0.0:
				draw_line(rect.get_center() + Vector2(-48, 0), rect.get_center() + Vector2(48, 0), Color(1.0, 0.76, 0.12), 5.0)
		elif kind == "turret":
			draw_regular_polygon(rect.get_center(), 25.0, 3, color, -PI * 0.5)
		else:
			draw_regular_polygon(rect.get_center(), 22.0, 5 if kind == "drone" else 4, color, Time.get_ticks_msec() * 0.004)
		var ratio: float = clamp(float(e.hp) / float(e.max_hp), 0.0, 1.0)
		draw_rect(Rect2(rect.position + Vector2(0, rect.size.y + 7), Vector2(rect.size.x, 5)), Color(0.08, 0.02, 0.03))
		draw_rect(Rect2(rect.position + Vector2(0, rect.size.y + 7), Vector2(rect.size.x * ratio, 5)), Color(1.0, 0.08, 0.14))

func draw_shots() -> void:
	for shot in shots:
		var p := world_to_screen(Vector2(shot.pos))
		var radius := float(shot.get("radius", 6.0))
		draw_circle(p, radius, shot.color)
		draw_line(p - Vector2(shot.vel).normalized() * 16.0, p, shot.color, 3.0)

func draw_player() -> void:
	var p := world_to_screen(Vector2(player.pos))
	var rect := Rect2(p - Vector2(PLAYER_W * 0.5, PLAYER_H * 0.5), Vector2(PLAYER_W, PLAYER_H))
	var color := Color(0.32, 0.78, 1.0) if float(player.overcharge) <= 0.0 else Color(0.35, 1.0, 0.82)
	draw_rect(rect, color)
	draw_rect(rect, Color.WHITE, false, 2.0)
	var eye_x := p.x + float(player.facing) * 11.0
	draw_circle(Vector2(eye_x, p.y - 12.0), 4.0, Color(0.02, 0.05, 0.08))
	if float(player.hover) > 0.0:
		draw_arc(p + Vector2(0, 30), 28.0, 0.0, PI, 24, Color(0.35, 0.9, 1.0, 0.7), 4.0)
	if float(player.attack) > 0.0:
		var start := p + Vector2(float(player.facing) * 16.0, -8.0)
		draw_line(start, start + Vector2(float(player.facing) * 52.0, -18.0), Color(0.95, 0.9, 1.0), 6.0)
	if float(player.grapple) > 0.0:
		draw_line(p, world_to_screen(Vector2(player.grapple_target)), Color(0.58, 0.82, 1.0), 3.0)

func draw_particles() -> void:
	for part in particles:
		draw_circle(world_to_screen(Vector2(part.pos)), float(part.size), part.color)

func draw_hud() -> void:
	var hud_w: float = min(420.0, size.x - 20.0)
	draw_rect(Rect2(Vector2(10, 10), Vector2(hud_w, 174)), Color(0.0, 0.0, 0.0, 0.62))
	draw_text_at(Vector2(20, 31), "FASKA GADGET QUEST PRO", Color(0.55, 0.9, 1.0), 18)
	draw_bar(Vector2(20, 52), "HP", float(player.hp), MAX_HP, Color(0.25, 1.0, 0.55))
	draw_bar(Vector2(20, 74), "ENERGY", float(player.energy), MAX_ENERGY, Color(0.35, 0.82, 1.0))
	draw_text_at(Vector2(20, 108), "Score " + str(score) + " Combo " + str(combo) + " x" + str(combo_multiplier()) + " Mode " + mode, Color(0.86, 0.94, 1.0), 13)
	draw_text_at(Vector2(20, 130), "Bolts " + str(player.bolts) + " Ammo " + str(player.ammo) + " Lernen " + str(stats.learn) + "/" + str(LEARN_GOAL), Color(0.94, 0.88, 0.55), 13)
	draw_text_at(Vector2(20, 150), "Fach " + String(LESSONS[lesson_index]) + " Wdh " + str(repeat_queue.size()), Color(0.78, 0.92, 1.0), 12)
	draw_text_at(Vector2(20, 170), objective_text(), Color(0.96, 0.98, 1.0), 12)
	if size.x > 760.0 and size.y <= size.x * 1.15:
		draw_rect(Rect2(Vector2(size.x - 310, 10), Vector2(296, 136)), Color(0.0, 0.0, 0.0, 0.55))
		draw_text_at(Vector2(size.x - 298, 32), "Upgrades", Color(0.95, 0.98, 1.0), 15)
		draw_text_at(Vector2(size.x - 298, 55), "BL " + yesno(player.upgrades.blaster) + "  HV " + yesno(player.upgrades.hover), Color(0.94, 0.98, 1.0), 13)
		draw_text_at(Vector2(size.x - 298, 76), "GR " + yesno(player.upgrades.grapple) + "  DA " + yesno(player.upgrades.dash), Color(0.94, 0.98, 1.0), 13)
		draw_text_at(Vector2(size.x - 298, 98), "Stomp/Dash zaehlen offensiv", Color(0.95, 0.78, 0.35), 13)
		draw_text_at(Vector2(size.x - 298, 120), "Bossbot hat 3 Phasen", Color(0.95, 0.78, 0.35), 13)

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
		["jump", "JMP", Vector2(size.x - 58, size.y - 172)],
		["dash", "DASH", Vector2(size.x - 128, size.y - 132)],
		["atk", "WRN", Vector2(size.x - 58, size.y - 102)],
		["shot", "SHOT", Vector2(size.x - 128, size.y - 62)],
		["hook", "HOOK", Vector2(size.x - 198, size.y - 102)],
		["interact", "E", Vector2(size.x - 198, size.y - 62)],
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
		var box := Rect2(Vector2(size.x * 0.30, 14), Vector2(size.x * 0.40, 31))
		if mode == "Learncade":
			box.position.y = 62
		draw_rect(box, Color(0.0, 0.0, 0.0, 0.64))
		draw_text_at(box.position + Vector2(10, 22), message, Color(0.95, 0.98, 1.0), 14)
	for f in floaters:
		draw_text_at(world_to_screen(Vector2(f.pos)), String(f.text), f.color, 16)
	if phase == "over":
		draw_rect(Rect2(Vector2(size.x * 0.25, size.y * 0.38), Vector2(size.x * 0.5, 116)), Color(0.0, 0.0, 0.0, 0.78))
		draw_text_at(Vector2(size.x * 0.36, size.y * 0.44), "QUEST FAILED", Color(1.0, 0.24, 0.2), 28)
		draw_text_at(Vector2(size.x * 0.34, size.y * 0.49), "Score " + str(score) + " - R fuer Neustart", Color(0.9, 0.96, 1.0), 16)
	elif phase == "win":
		draw_rect(Rect2(Vector2(size.x * 0.22, size.y * 0.36), Vector2(size.x * 0.56, 132)), Color(0.0, 0.0, 0.0, 0.78))
		draw_text_at(Vector2(size.x * 0.34, size.y * 0.43), "STERNTOR OFFEN", Color(0.35, 1.0, 0.82), 30)
		draw_text_at(Vector2(size.x * 0.32, size.y * 0.49), "Score " + str(score) + " - R fuer neue Runde", Color(0.9, 0.96, 1.0), 16)

func yesno(value) -> String:
	return "ON" if bool(value) else "--"

func objective_text() -> String:
	if mode == "Learncade":
		return "Lernziel: richtiges Terminal beruehren - " + String(LESSONS[lesson_index])
	if not bool(player.upgrades.blaster):
		return "Ziel: 5 Bolts sammeln und BLASTER+ kaufen."
	if not bool(player.upgrades.hover):
		return "Ziel: Hoverboots kaufen und Luftwege oeffnen."
	if not bool(player.upgrades.grapple):
		return "Ziel: Grapple-Anker erreichen und GRAPPLE+ kaufen."
	if not bool(player.upgrades.dash):
		return "Ziel: DASH+ kaufen, dann Boss-Arena."
	if not boss_defeated():
		return "Ziel: Bossbot - Stomp, Dash, Blaster, Wrench."
	return "Ziel: Sternentor rechts betreten."

func spawn_sparks(pos: Vector2, color: Color, count := 9) -> void:
	for i in range(count):
		particles.append({"pos": pos, "vel": Vector2(rng.randf_range(-120, 120), rng.randf_range(-160, 40)), "life": rng.randf_range(0.25, 0.72), "size": rng.randf_range(2.0, 5.0), "color": color})

func add_text(text: String, pos: Vector2, color: Color) -> void:
	floaters.append({"text": text, "pos": pos, "life": 1.25, "color": color})

func draw_regular_polygon(center: Vector2, radius: float, sides: int, color: Color, rotation := 0.0) -> void:
	var pts := PackedVector2Array()
	for i in range(sides):
		var a := rotation + float(i) / float(sides) * TAU
		pts.append(center + Vector2(cos(a), sin(a)) * radius)
	draw_colored_polygon(pts, color)
	pts.append(pts[0])
	draw_polyline(pts, Color.WHITE, 1.5)

func draw_text_at(pos: Vector2, text: String, color: Color = Color.WHITE, font_size: int = 14) -> void:
	draw_string(font, pos, text, HORIZONTAL_ALIGNMENT_LEFT, -1.0, font_size, color)
