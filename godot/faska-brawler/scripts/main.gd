extends Control

const VIEW_W := 1280.0
const VIEW_H := 720.0
const WORLD_W := 3800.0
const FLOOR_TOP := 300.0
const FLOOR_BOTTOM := 660.0
const MAX_HP := 160.0
const MAX_STAMINA := 100.0
const MAX_SUPER := 100.0
const MOVE_SPEED := 285.0
const ROLL_SPEED := 620.0
const LEARN_GOAL := 10
const STYLE_WINDOW := 5.6

const LESSONS = ["WORTART", "LESEN", "SATZ", "KOMPOSITUM", "MATHE", "ENGLISCH", "SACHKUNDE"]
const LANES = [340.0, 430.0, 520.0, 610.0]

const WEAPONS = {
	"pipe": {"label": "Rohr", "damage": 14.0, "range": 22.0, "durability": 10, "color": "#94a3b8"},
	"bat": {"label": "Schlaeger", "damage": 22.0, "range": 34.0, "durability": 8, "color": "#f59e0b"},
	"chain": {"label": "Kette", "damage": 10.0, "range": 56.0, "durability": 12, "color": "#cbd5e1"}
}

const ENEMY_PROFILES = {
	"grunt": {"hp": 54.0, "speed": 118.0, "damage": 8.0, "range": 42.0, "score": 120, "color": "#fb7185"},
	"kicker": {"hp": 72.0, "speed": 106.0, "damage": 11.0, "range": 58.0, "score": 170, "color": "#38bdf8"},
	"brute": {"hp": 148.0, "speed": 72.0, "damage": 18.0, "range": 68.0, "score": 320, "color": "#f97316"},
	"knife": {"hp": 62.0, "speed": 138.0, "damage": 10.0, "range": 48.0, "score": 210, "color": "#facc15"},
	"shield": {"hp": 92.0, "speed": 88.0, "damage": 13.0, "range": 52.0, "score": 280, "color": "#60a5fa"},
	"duelist": {"hp": 88.0, "speed": 148.0, "damage": 14.0, "range": 58.0, "score": 340, "color": "#f472b6"},
	"thrower": {"hp": 66.0, "speed": 82.0, "damage": 9.0, "range": 210.0, "score": 240, "color": "#22c55e"},
	"medic": {"hp": 84.0, "speed": 78.0, "damage": 6.0, "range": 44.0, "score": 260, "color": "#f0abfc"},
	"boss": {"hp": 780.0, "speed": 80.0, "damage": 22.0, "range": 78.0, "score": 1800, "color": "#a78bfa"}
}

const PROP_DEFS = [
	{"kind": "crate", "x": 380.0, "y": 596.0, "hp": 38.0, "drop": "food"},
	{"kind": "barrel", "x": 720.0, "y": 402.0, "hp": 52.0, "drop": "weapon:pipe"},
	{"kind": "sign", "x": 1040.0, "y": 560.0, "hp": 40.0, "drop": "coin"},
	{"kind": "crate", "x": 1470.0, "y": 455.0, "hp": 44.0, "drop": "weapon:bat"},
	{"kind": "barrel", "x": 1940.0, "y": 620.0, "hp": 56.0, "drop": "energy"},
	{"kind": "crate", "x": 2360.0, "y": 375.0, "hp": 44.0, "drop": "coin"},
	{"kind": "sign", "x": 2790.0, "y": 525.0, "hp": 46.0, "drop": "weapon:chain"},
	{"kind": "crate", "x": 3240.0, "y": 610.0, "hp": 50.0, "drop": "food"}
]

const TASKS_WORD = [
	{"prompt": "Welche Wortart ist 'mutig'?", "answer": "Adjektiv", "options": ["Nomen", "Adjektiv", "Verb"]},
	{"prompt": "Welches Wort ist ein Verb?", "answer": "springen", "options": ["springen", "Arena", "leise"]},
	{"prompt": "Welche Wortart ist 'unter'?", "answer": "Praeposition", "options": ["Artikel", "Praeposition", "Nomen"]},
	{"prompt": "Welches Wort ist ein Nomen?", "answer": "Gasse", "options": ["Gasse", "rollen", "schnell"]},
	{"prompt": "Welche Wortart ist 'weil'?", "answer": "Konjunktion", "options": ["Verb", "Konjunktion", "Adjektiv"]},
	{"prompt": "Welche Wortart ist 'wir'?", "answer": "Pronomen", "options": ["Pronomen", "Artikel", "Nomen"]},
	{"prompt": "Welche Wortart ist 'heute'?", "answer": "Adverb", "options": ["Verb", "Adverb", "Nomen"]}
]

const TASKS_READING = [
	{"prompt": "Lies genau: Gehe zum blauen Tor.", "answer": "blaues Tor", "options": ["roter Turm", "blaues Tor", "gelber Ball"]},
	{"prompt": "Welches Wort beginnt wie 'Schlag'?", "answer": "Schule", "options": ["Tor", "Schule", "Kamm"]},
	{"prompt": "Welches Wort reimt sich auf 'Hieb'?", "answer": "lieb", "options": ["lieb", "laut", "hoch"]},
	{"prompt": "Welches Wort hat zwei Silben?", "answer": "Luna", "options": ["Block", "Luna", "Tor"]},
	{"prompt": "Was bedeutet 'weichen'?", "answer": "zur Seite gehen", "options": ["zur Seite gehen", "lauter werden", "essen"]},
	{"prompt": "Welche Anweisung passt? Bleib oben.", "answer": "oben", "options": ["unten", "rechts", "oben"]},
	{"prompt": "Welches Wort ist am laengsten?", "answer": "Superangriff", "options": ["Jab", "Superangriff", "Tor"]}
]

const TASKS_SENTENCE = [
	{"prompt": "Was ist das Subjekt? Luna blockt den Schlag.", "answer": "Luna", "options": ["Luna", "blockt", "den Schlag"]},
	{"prompt": "Was ist das Praedikat? Bruno springt hoch.", "answer": "springt", "options": ["Bruno", "springt", "hoch"]},
	{"prompt": "Was fehlt? Der Held ___ aus.", "answer": "weicht", "options": ["weicht", "blau", "die"]},
	{"prompt": "Welcher Satz ist richtig?", "answer": "Der Kaempfer steht auf.", "options": ["Steht der auf Kaempfer.", "Der Kaempfer steht auf.", "Kaempfer der auf steht."]},
	{"prompt": "Welches Satzzeichen passt? Wo ist das Tor", "answer": "?", "options": [".", "?", ","]},
	{"prompt": "Was ist das Objekt? Roni trifft den Kristall.", "answer": "den Kristall", "options": ["Roni", "trifft", "den Kristall"]},
	{"prompt": "Welche Stelle nennt die Zeit? Nach dem Gong beginnt die Runde.", "answer": "Nach dem Gong", "options": ["Nach dem Gong", "beginnt", "die Runde"]}
]

const TASKS_COMPOUND = [
	{"prompt": "Welche Teile hat Kampfarena?", "answer": "Kampf + Arena", "options": ["Kampf + Arena", "Kamm + Arena", "Kampf + Arm"]},
	{"prompt": "Bilde Schild + Block.", "answer": "Schildblock", "options": ["Blockschild", "Schildblock", "Schildblick"]},
	{"prompt": "Was ist das Grundwort von Trefferanzeige?", "answer": "Anzeige", "options": ["Treffer", "Anzeige", "zeigen"]},
	{"prompt": "Welches Wort ist kein Kompositum?", "answer": "schnell", "options": ["Schwertgriff", "Arenator", "schnell"]},
	{"prompt": "Welche Verbindung passt?", "answer": "Gegnerdruck", "options": ["Gegnerdruck", "Druckgegner", "Gegendruck"]},
	{"prompt": "Was entsteht aus Stadt + Tor?", "answer": "Stadttor", "options": ["Torstadt", "Stadttor", "Stadtung"]},
	{"prompt": "Welche Teile hat Lernspiel?", "answer": "Lern + Spiel", "options": ["Lern + Spiel", "leer + Spiel", "Lern + Speer"]}
]

const TASKS_MATH = [
	{"prompt": "8 + 7 = ?", "answer": "15", "options": ["13", "15", "17"]},
	{"prompt": "6 x 4 = ?", "answer": "24", "options": ["20", "24", "28"]},
	{"prompt": "42 : 6 = ?", "answer": "7", "options": ["6", "7", "8"]},
	{"prompt": "90 - 35 = ?", "answer": "55", "options": ["45", "55", "65"]},
	{"prompt": "Welche Zahl ist gerade?", "answer": "32", "options": ["21", "32", "43"]},
	{"prompt": "Welche Zahl fehlt? 7 x ? = 56", "answer": "8", "options": ["6", "8", "9"]},
	{"prompt": "Was ist groesser als 3/4?", "answer": "5/6", "options": ["1/2", "2/3", "5/6"]}
]

const TASKS_ENGLISH = [
	{"prompt": "Was heisst 'shield'?", "answer": "Schild", "options": ["Schwert", "Schild", "Schule"]},
	{"prompt": "Was heisst 'jump'?", "answer": "springen", "options": ["springen", "lesen", "malen"]},
	{"prompt": "Was heisst 'strong'?", "answer": "stark", "options": ["langsam", "stark", "kurz"]},
	{"prompt": "Was bedeutet 'hit'?", "answer": "Treffer", "options": ["Treffer", "Fehler", "Tor"]},
	{"prompt": "Was bedeutet 'street'?", "answer": "Strasse", "options": ["Stern", "Strasse", "Stuhl"]},
	{"prompt": "Was bedeutet 'guard'?", "answer": "blocken", "options": ["springen", "blocken", "fallen"]},
	{"prompt": "Was bedeutet 'reward'?", "answer": "Belohnung", "options": ["Belohnung", "Regel", "Regen"]}
]

const TASKS_SCIENCE = [
	{"prompt": "Was brauchen Muskeln fuer Bewegung?", "answer": "Energie", "options": ["Energie", "Glas", "Sand"]},
	{"prompt": "Welches Organ pumpt Blut?", "answer": "Herz", "options": ["Herz", "Magen", "Auge"]},
	{"prompt": "Was schuetzt den Kopf?", "answer": "Schaedel", "options": ["Schaedel", "Zehe", "Lunge"]},
	{"prompt": "Welche Richtung zeigt ein Kompass?", "answer": "Norden", "options": ["Norden", "unten", "laut"]},
	{"prompt": "Was ist Reibung?", "answer": "Widerstand bei Bewegung", "options": ["Widerstand bei Bewegung", "ein Tier", "ein Licht"]},
	{"prompt": "Was braucht Feuer?", "answer": "Sauerstoff", "options": ["Sauerstoff", "Schnee", "Stein"]},
	{"prompt": "Was misst ein Thermometer?", "answer": "Temperatur", "options": ["Temperatur", "Gewicht", "Tempo"]}
]

var font
var rng := RandomNumberGenerator.new()
var player := {}
var enemies := []
var props := []
var pickups := []
var projectiles := []
var particles := []
var floaters := []
var learn_gates := []
var repeat_queue: Array = []
var active_task := {}
var touch_axis := Vector2.ZERO
var touch_pointer := -1
var touch_buttons := {}
var touch_button_state := {}
var touch_edges := {}
var key_memory := {}
var camera_x := 0.0
var mode := "Normal"
var phase := "run"
var wave := 0
var score := 0
var combo := 0
var combo_timer := 0.0
var style_points := 0
var style_timer := 0.0
var best_style_rank := "D"
var wave_damage_taken := 0.0
var lesson_index := 0
var question_index := 0
var learn_correct := 0
var learn_streak := 0
var best_learn_streak := 0
var elapsed := 0.0
var shake := 0.0
var message := ""
var message_timer := 0.0
var mission_notice := ""
var mission_timer := 0.0
var stats := {}

func _ready() -> void:
	rng.seed = 640231
	font = get_theme_default_font()
	mouse_filter = Control.MOUSE_FILTER_PASS
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	reset_game()

func reset_game() -> void:
	player = {
		"pos": Vector2(180.0, 520.0),
		"vel": Vector2.ZERO,
		"facing": 1,
		"hp": MAX_HP,
		"stamina": MAX_STAMINA,
		"super": 0.0,
		"guard": false,
		"parry": 0.0,
		"roll": 0.0,
		"attack_cd": 0.0,
		"attack_timer": 0.0,
		"attack_kind": "",
		"invuln": 0.0,
		"hurt": 0.0,
		"weapon": "",
		"weapon_durability": 0,
		"step": 0.0
	}
	enemies.clear()
	props.clear()
	for i in range(PROP_DEFS.size()):
		var prop = PROP_DEFS[i].duplicate(true)
		prop["id"] = i
		prop["max_hp"] = prop.hp
		prop["broken"] = false
		prop["hit"] = 0.0
		props.append(prop)
	pickups.clear()
	projectiles.clear()
	particles.clear()
	floaters.clear()
	learn_gates.clear()
	repeat_queue.clear()
	touch_axis = Vector2.ZERO
	touch_pointer = -1
	touch_buttons.clear()
	touch_button_state.clear()
	touch_edges.clear()
	key_memory.clear()
	camera_x = 0.0
	mode = "Normal"
	phase = "run"
	wave = 0
	score = 0
	combo = 0
	combo_timer = 0.0
	style_points = 0
	style_timer = 0.0
	best_style_rank = "D"
	wave_damage_taken = 0.0
	lesson_index = 0
	question_index = 0
	learn_correct = 0
	learn_streak = 0
	best_learn_streak = 0
	active_task.clear()
	stats = {"kills": 0, "parries": 0, "throws": 0, "supers": 0, "props": 0, "weapons": 0, "wrong": 0, "perfect": 0}
	message = "FASKA BRAWLER PRO - Raeume die Strasse frei."
	message_timer = 2.5
	mission_notice = ""
	mission_timer = 0.0
	shake = 0.0
	spawn_wave()

func _process(delta: float) -> void:
	elapsed += delta
	if key_once(KEY_R):
		reset_game()
	if phase == "run":
		update_run(delta)
	else:
		if key_once(KEY_ENTER) or key_once(KEY_SPACE) or consume_touch_edge("punch"):
			reset_game()
	update_timers(delta)
	update_camera()
	queue_redraw()

func update_run(delta: float) -> void:
	if key_once(KEY_L) or consume_touch_edge("learn"):
		toggle_mode()
	if key_once(KEY_C) or consume_touch_edge("subject"):
		cycle_subject()
	update_player(delta)
	update_enemies(delta)
	update_projectiles(delta)
	update_pickups(delta)
	update_particles(delta)
	update_floaters(delta)
	if mode == "Lernen":
		ensure_learn_gates()
		check_learn_answers()
	if enemies.size() == 0:
		if wave > 0:
			award_wave_clear()
		spawn_wave()
	if player.hp <= 0.0:
		phase = "over"
		message = "K.O. - Enter oder Touch startet neu"
		message_timer = 99.0

func update_timers(delta: float) -> void:
	message_timer = maxf(0.0, message_timer - delta)
	mission_timer = maxf(0.0, mission_timer - delta)
	shake = maxf(0.0, shake - delta)
	combo_timer = maxf(0.0, combo_timer - delta)
	if combo_timer <= 0.0:
		combo = 0
	style_timer = maxf(0.0, style_timer - delta)
	if style_timer <= 0.0:
		style_points = 0

func update_player(delta: float) -> void:
	var axis := read_move_axis()
	var guard_pressed := Input.is_key_pressed(KEY_G) or bool(touch_button_state.get("guard", false))
	var guard_just := key_once(KEY_G) or consume_touch_edge("guard")
	if guard_just and player.stamina > 8.0:
		player.parry = 0.18
	player.parry = maxf(0.0, player.parry - delta)
	player.guard = guard_pressed and player.stamina > 3.0 and player.roll <= 0.0
	if player.guard:
		player.stamina = maxf(0.0, player.stamina - 12.0 * delta)
	else:
		player.stamina = minf(MAX_STAMINA, player.stamina + 24.0 * delta)
	player.attack_cd = maxf(0.0, player.attack_cd - delta)
	player.attack_timer = maxf(0.0, player.attack_timer - delta)
	player.invuln = maxf(0.0, player.invuln - delta)
	player.hurt = maxf(0.0, player.hurt - delta)
	if key_once(KEY_SPACE) or consume_touch_edge("roll"):
		start_roll(axis)
	if player.roll > 0.0:
		player.roll = maxf(0.0, player.roll - delta)
		player.pos.x += float(player.facing) * ROLL_SPEED * delta
	else:
		var speed := MOVE_SPEED
		if player.guard:
			speed *= 0.45
		player.pos += axis * speed * delta
	if absf(axis.x) > 0.15 and player.roll <= 0.0:
		player.facing = 1 if axis.x > 0.0 else -1
	if axis.length() > 0.05:
		player.step += delta * (8.0 + axis.length() * 7.0)
	player.pos.x = clampf(player.pos.x, 80.0, WORLD_W - 80.0)
	player.pos.y = clampf(player.pos.y, FLOOR_TOP + 28.0, FLOOR_BOTTOM - 26.0)
	if key_once(KEY_J) or consume_touch_edge("punch"):
		start_attack("punch")
	if key_once(KEY_K) or consume_touch_edge("kick"):
		start_attack("kick")
	if key_once(KEY_U) or consume_touch_edge("grab"):
		start_attack("grab")
	if key_once(KEY_O) or consume_touch_edge("launch"):
		start_attack("launch")
	if key_once(KEY_I) or consume_touch_edge("super"):
		start_attack("super")

func read_move_axis() -> Vector2:
	var axis := Vector2.ZERO
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		axis.x -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		axis.x += 1.0
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		axis.y -= 1.0
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		axis.y += 1.0
	axis += touch_axis
	if axis.length() > 1.0:
		axis = axis.normalized()
	return axis

func start_roll(axis: Vector2) -> void:
	if player.roll > 0.0 or player.stamina < 24.0:
		return
	if absf(axis.x) > 0.15:
		player.facing = 1 if axis.x > 0.0 else -1
	player.roll = 0.28
	player.invuln = 0.36
	player.stamina -= 24.0
	spawn_particles(player.pos + Vector2(-float(player.facing) * 22.0, 16.0), Color.html("#93c5fd"), 8, 130.0)

func start_attack(kind: String) -> void:
	if player.attack_cd > 0.0 or player.hurt > 0.0:
		return
	var damage := 18.0
	var range := 80.0
	var lane := 54.0
	var cost := 8.0
	var cooldown := 0.26
	var knock := 36.0
	if kind == "kick":
		damage = 28.0
		range = 104.0
		lane = 64.0
		cost = 14.0
		cooldown = 0.42
		knock = 58.0
	elif kind == "grab":
		damage = 38.0
		range = 55.0
		lane = 48.0
		cost = 18.0
		cooldown = 0.58
		knock = 116.0
	elif kind == "launch":
		damage = 26.0
		range = 78.0
		lane = 70.0
		cost = 20.0
		cooldown = 0.52
		knock = 38.0
	elif kind == "super":
		if player.super < MAX_SUPER:
			message = "Supermeter nicht voll."
			message_timer = 0.8
			return
		damage = 92.0
		range = 185.0
		lane = 120.0
		cost = 0.0
		cooldown = 0.78
		knock = 170.0
		player.super = 0.0
		stats.supers += 1
		shake = 0.24
		spawn_particles(player.pos, Color.html("#facc15"), 28, 310.0)
	if player.stamina < cost:
		message = "Zu wenig Ausdauer."
		message_timer = 0.7
		return
	player.stamina -= cost
	player.attack_cd = cooldown
	player.attack_timer = minf(0.24, cooldown)
	player.attack_kind = kind
	if player.weapon != "" and kind != "super":
		var weapon = WEAPONS[player.weapon]
		damage += float(weapon.damage)
		range += float(weapon.range)
		player.weapon_durability -= 1
		stats.weapons += 1
		if player.weapon_durability <= 0:
			add_floater(player.pos + Vector2(0, -88), "Waffe kaputt", Color.html("#fca5a5"))
			player.weapon = ""
	hit_targets(kind, damage, range, lane, knock)

func hit_targets(kind: String, damage: float, range: float, lane: float, knock: float) -> void:
	var hit_any := false
	for enemy in enemies:
		if bool(enemy.get("dead", false)):
			continue
		var dx: float = float(enemy.pos.x - player.pos.x)
		var dy: float = absf(float(enemy.pos.y - player.pos.y))
		var in_front: bool = sign(dx) == int(player.facing) or absf(dx) < 34.0 or kind == "super"
		if absf(dx) <= range and dy <= lane and in_front:
			hit_any = true
			var effective_damage := damage
			if enemy.type == "shield" and kind not in ["grab", "launch", "super"]:
				effective_damage *= 0.36
				add_floater(enemy.pos + Vector2(0, -70), "Schild!", Color.html("#bfdbfe"))
			if float(enemy.get("air", 0.0)) > 0.0 and kind != "launch":
				effective_damage *= 1.18
				score += 75
				award_style(34, "AIR")
			enemy.hp -= effective_damage
			enemy.stun = 0.24 if kind != "grab" else 0.55
			if kind == "launch":
				enemy.stun = 0.62
				enemy.air = 0.72
				award_style(28, "LAUNCH")
				add_floater(enemy.pos + Vector2(0, -72), "LAUNCH", Color.html("#fde68a"))
			enemy.hit = 0.18
			enemy.pos.x = clampf(enemy.pos.x + float(player.facing) * knock, 70.0, WORLD_W - 70.0)
			enemy.pos.y = clampf(enemy.pos.y + rng.randf_range(-18.0, 18.0), FLOOR_TOP + 30.0, FLOOR_BOTTOM - 25.0)
			player.super = minf(MAX_SUPER, player.super + effective_damage * 0.18)
			score += 18
			combo += 1
			combo_timer = 2.1
			award_style(8 + mini(combo, 12), "")
			if combo % 6 == 0:
				add_floater(enemy.pos + Vector2(0, -60), str(combo) + " COMBO", Color.html("#facc15"))
			if kind == "grab":
				stats.throws += 1
				award_style(24, "THROW")
			spawn_particles(enemy.pos + Vector2(0.0, -28.0), Color.html("#fde68a"), 10, 190.0)
			if enemy.hp <= 0.0:
				defeat_enemy(enemy)
	for prop in props:
		if bool(prop.broken):
			continue
		var pdx: float = float(prop.x - player.pos.x)
		var pdy: float = absf(float(prop.y - player.pos.y))
		var prop_front: bool = sign(pdx) == int(player.facing) or absf(pdx) < 44.0 or kind == "super"
		if absf(pdx) <= range and pdy <= lane and prop_front:
			hit_any = true
			prop.hp -= damage
			prop.hit = 0.18
			spawn_particles(Vector2(prop.x, prop.y - 20.0), Color.html("#fdba74"), 8, 150.0)
			if prop.hp <= 0.0:
				break_prop(prop)
	if hit_any:
		score += 22
	else:
		combo = 0
		style_points = max(0, style_points - 12)

func award_style(points: int, label: String) -> void:
	style_points = mini(220, style_points + points)
	style_timer = STYLE_WINDOW
	var rank := style_rank()
	if style_rank_value(rank) > style_rank_value(best_style_rank):
		best_style_rank = rank
		if rank in ["A", "S"]:
			add_floater(player.pos + Vector2(0, -106), "STYLE " + rank, Color.html("#facc15"))
	if label != "":
		add_floater(player.pos + Vector2(0, -92), label, Color.html("#fde68a"))

func style_rank() -> String:
	if style_points >= 160:
		return "S"
	if style_points >= 110:
		return "A"
	if style_points >= 68:
		return "B"
	if style_points >= 32:
		return "C"
	return "D"

func style_rank_value(rank: String) -> int:
	match rank:
		"S":
			return 4
		"A":
			return 3
		"B":
			return 2
		"C":
			return 1
		_:
			return 0

func defeat_enemy(enemy: Dictionary) -> void:
	enemy.dead = true
	score += int(enemy.score)
	stats.kills += 1
	add_floater(enemy.pos + Vector2(0, -62), "+" + str(int(enemy.score)), Color.html("#bbf7d0"))
	spawn_particles(enemy.pos, Color.html(str(enemy.color)), 16, 220.0)
	if rng.randf() < 0.34 or enemy.type == "boss":
		var kind := "food"
		if enemy.type == "thrower":
			kind = "energy"
		elif enemy.type == "boss":
			kind = "super"
		spawn_pickup(enemy.pos, kind)
	cleanup_enemies()

func break_prop(prop: Dictionary) -> void:
	prop.broken = true
	score += 90
	stats.props += 1
	add_floater(Vector2(prop.x, prop.y - 52.0), "Krach +90", Color.html("#fef3c7"))
	spawn_drop_from_prop(prop)

func spawn_drop_from_prop(prop: Dictionary) -> void:
	var drop := str(prop.drop)
	if drop.begins_with("weapon:"):
		spawn_pickup(Vector2(prop.x, prop.y), drop)
	else:
		spawn_pickup(Vector2(prop.x, prop.y), drop)

func spawn_pickup(pos: Vector2, kind: String) -> void:
	pickups.append({"pos": pos, "kind": kind, "life": 13.0, "bob": rng.randf() * TAU})

func update_enemies(delta: float) -> void:
	for enemy in enemies:
		if bool(enemy.get("dead", false)):
			continue
		enemy.stun = maxf(0.0, enemy.stun - delta)
		enemy.hit = maxf(0.0, enemy.hit - delta)
		enemy.air = maxf(0.0, float(enemy.get("air", 0.0)) - delta)
		enemy.attack_cd = maxf(0.0, enemy.attack_cd - delta)
		enemy.special_cd = maxf(0.0, enemy.special_cd - delta)
		if enemy.stun > 0.0:
			continue
		var dx: float = float(player.pos.x - enemy.pos.x)
		var dy: float = float(player.pos.y - enemy.pos.y)
		enemy.facing = 1 if dx > 0.0 else -1
		if enemy.type == "medic":
			medic_support(enemy, delta)
		if enemy.type == "thrower" and absf(dx) > 145.0 and enemy.special_cd <= 0.0:
			throw_bottle(enemy)
			continue
		var target_dist := float(ENEMY_PROFILES[enemy.type].range) * 0.78
		if absf(dx) > target_dist:
			enemy.pos.x += sign(dx) * enemy.speed * delta
		if absf(dy) > 18.0:
			enemy.pos.y += sign(dy) * enemy.speed * 0.72 * delta
		enemy.pos.x = clampf(enemy.pos.x, 70.0, WORLD_W - 70.0)
		enemy.pos.y = clampf(enemy.pos.y, FLOOR_TOP + 26.0, FLOOR_BOTTOM - 24.0)
		if absf(dx) <= float(ENEMY_PROFILES[enemy.type].range) and absf(dy) <= 48.0 and enemy.attack_cd <= 0.0:
			enemy_attack(enemy)
	cleanup_enemies()

func medic_support(medic: Dictionary, delta: float) -> void:
	if medic.special_cd > 0.0:
		return
	for ally in enemies:
		if ally == medic or bool(ally.get("dead", false)):
			continue
		if ally.hp < ally.max_hp and ally.pos.distance_to(medic.pos) < 190.0:
			ally.hp = minf(ally.max_hp, ally.hp + 26.0)
			medic.special_cd = 2.2
			add_floater(ally.pos + Vector2(0, -64), "+HP", Color.html("#f0abfc"))
			spawn_particles(ally.pos, Color.html("#f0abfc"), 8, 120.0)
			return

func throw_bottle(enemy: Dictionary) -> void:
	var dir: Vector2 = Vector2(player.pos - enemy.pos).normalized()
	projectiles.append({"pos": enemy.pos + Vector2(float(enemy.facing) * 22.0, -20.0), "vel": dir * 285.0, "damage": float(ENEMY_PROFILES[enemy.type].damage), "life": 2.6})
	enemy.special_cd = 1.6
	enemy.attack_cd = 0.6

func enemy_attack(enemy: Dictionary) -> void:
	enemy.attack_cd = 1.05 if enemy.type != "boss" else 0.72
	enemy.wind = 0.16
	var damage := float(ENEMY_PROFILES[enemy.type].damage)
	if enemy.type == "boss" and enemy.hp < enemy.max_hp * 0.48:
		damage += 8.0
		enemy.attack_cd = 0.54
	take_damage(damage, enemy.pos, enemy)

func take_damage(amount: float, source: Vector2, attacker = null) -> void:
	if player.invuln > 0.0:
		return
	var from_front: bool = sign(source.x - float(player.pos.x)) == int(player.facing) or absf(source.x - float(player.pos.x)) < 20.0
	if player.guard and from_front:
		if player.parry > 0.0 and attacker != null:
			attacker.stun = 0.75
			attacker.air = maxf(float(attacker.get("air", 0.0)), 0.26)
			attacker.hp -= 18.0
			stats.parries += 1
			player.super = minf(MAX_SUPER, player.super + 18.0)
			score += 90
			award_style(42, "PARRY")
			add_floater(player.pos + Vector2(0, -82), "PARRY", Color.html("#67e8f9"))
			spawn_particles(player.pos + Vector2(float(player.facing) * 24.0, -24.0), Color.html("#67e8f9"), 14, 210.0)
			if attacker.hp <= 0.0:
				defeat_enemy(attacker)
			return
		amount *= 0.24
		player.stamina = maxf(0.0, player.stamina - amount * 1.7)
		add_floater(player.pos + Vector2(0, -70), "Block", Color.html("#bfdbfe"))
	else:
		player.hurt = 0.22
		player.invuln = 0.42
		player.pos.x = clampf(player.pos.x - sign(source.x - player.pos.x) * 38.0, 70.0, WORLD_W - 70.0)
		combo = 0
	player.hp -= amount
	wave_damage_taken += amount
	style_points = max(0, style_points - int(amount * 0.9))
	shake = maxf(shake, 0.12)
	spawn_particles(player.pos + Vector2(0, -20), Color.html("#fecaca"), 8, 170.0)

func update_projectiles(delta: float) -> void:
	for projectile in projectiles:
		projectile.life -= delta
		projectile.pos += projectile.vel * delta
		if projectile.pos.distance_to(player.pos) < 34.0:
			take_damage(projectile.damage, projectile.pos)
			projectile.life = 0.0
	projectiles = projectiles.filter(func(projectile): return projectile.life > 0.0 and projectile.pos.x > 0.0 and projectile.pos.x < WORLD_W)

func update_pickups(delta: float) -> void:
	for pickup in pickups:
		pickup.life -= delta
		pickup.bob += delta * 5.0
		if pickup.pos.distance_to(player.pos) < 42.0:
			collect_pickup(pickup)
			pickup.life = 0.0
	pickups = pickups.filter(func(pickup): return pickup.life > 0.0)

func collect_pickup(pickup: Dictionary) -> void:
	var kind := str(pickup.kind)
	if kind == "food":
		player.hp = minf(MAX_HP, player.hp + 34.0)
		add_floater(player.pos + Vector2(0, -76), "+HP", Color.html("#bbf7d0"))
	elif kind == "energy":
		player.stamina = MAX_STAMINA
		player.super = minf(MAX_SUPER, player.super + 18.0)
		add_floater(player.pos + Vector2(0, -76), "Ausdauer", Color.html("#bae6fd"))
	elif kind == "super":
		player.super = MAX_SUPER
		add_floater(player.pos + Vector2(0, -76), "SUPER VOLL", Color.html("#fde68a"))
	elif kind == "coin":
		score += 220
		add_floater(player.pos + Vector2(0, -76), "+220", Color.html("#fde68a"))
	elif kind.begins_with("weapon:"):
		var weapon_id := kind.get_slice(":", 1)
		player.weapon = weapon_id
		player.weapon_durability = int(WEAPONS[weapon_id].durability)
		add_floater(player.pos + Vector2(0, -76), str(WEAPONS[weapon_id].label), Color.html(str(WEAPONS[weapon_id].color)))

func update_particles(delta: float) -> void:
	for p in particles:
		p.life -= delta
		p.pos += p.vel * delta
		p.vel *= 0.88
	particles = particles.filter(func(p): return p.life > 0.0)

func update_floaters(delta: float) -> void:
	for f in floaters:
		f.life -= delta
		f.pos.y -= 48.0 * delta
	floaters = floaters.filter(func(f): return f.life > 0.0)

func cleanup_enemies() -> void:
	var alive := []
	for enemy in enemies:
		if not bool(enemy.get("dead", false)):
			alive.append(enemy)
	enemies = alive

func award_wave_clear() -> void:
	var base := 280 + wave * 55
	score += base
	award_style(26, "WAVE")
	if wave_damage_taken <= 0.0:
		score += 700
		stats.perfect += 1
		award_style(70, "PERFECT")
		mission_notice = "Perfect Wave +" + str(700)
		mission_timer = 2.4
	elif combo >= 8:
		score += combo * 22
		mission_notice = "Combo-Bonus +" + str(combo * 22)
		mission_timer = 1.8

func spawn_wave() -> void:
	wave += 1
	wave_damage_taken = 0.0
	var boss_wave := wave % 4 == 0
	if boss_wave:
		spawn_enemy("boss", Vector2(clampf(player.pos.x + 520.0, 420.0, WORLD_W - 240.0), 510.0))
		message = "Boss-Welle " + str(wave) + ": Parry und Super nutzen."
		message_timer = 2.2
		return
	var pattern = ["grunt", "kicker", "knife", "shield", "thrower", "duelist", "grunt", "brute", "medic", "kicker"]
	var count := mini(8, 3 + wave)
	for i in range(count):
		var side := 1 if i % 2 == 0 else -1
		var x := clampf(player.pos.x + side * (430.0 + float(i) * 92.0), 120.0, WORLD_W - 120.0)
		if absf(x - player.pos.x) < 280.0:
			x = clampf(player.pos.x + side * 320.0, 120.0, WORLD_W - 120.0)
		var y := float(LANES[(i + wave) % LANES.size()])
		var kind := str(pattern[(i + wave) % pattern.size()])
		if wave < 2 and kind == "brute":
			kind = "grunt"
		if wave < 3 and kind == "medic":
			kind = "kicker"
		if wave < 3 and kind == "shield":
			kind = "grunt"
		if wave < 4 and kind == "duelist":
			kind = "knife"
		spawn_enemy(kind, Vector2(x, y))
	message = "Welle " + str(wave) + " - " + str(count) + " Gegner"
	message_timer = 1.45

func spawn_enemy(kind: String, pos: Vector2) -> void:
	var profile: Dictionary = ENEMY_PROFILES[kind]
	var scale := 1.0 + float(wave) * 0.055
	var hp := float(profile.hp) * scale
	enemies.append({
		"type": kind,
		"pos": pos,
		"hp": hp,
		"max_hp": hp,
		"speed": float(profile.speed),
		"damage": float(profile.damage),
		"range": float(profile.range),
		"score": int(profile.score),
		"color": str(profile.color),
		"facing": -1,
		"attack_cd": 0.7 + rng.randf() * 0.9,
		"special_cd": 0.8 + rng.randf() * 1.2,
		"stun": 0.0,
		"air": 0.0,
		"hit": 0.0,
		"wind": 0.0,
		"dead": false
	})

func toggle_mode() -> void:
	mode = "Lernen" if mode == "Normal" else "Normal"
	learn_gates.clear()
	message = "Lernmodus: " + mode
	message_timer = 1.3
	if mode == "Lernen":
		ensure_learn_gates()

func cycle_subject() -> void:
	lesson_index = (lesson_index + 1) % LESSONS.size()
	learn_gates.clear()
	active_task.clear()
	message = "Fach: " + str(LESSONS[lesson_index])
	message_timer = 1.1

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

func next_task() -> Dictionary:
	if repeat_queue.size() > 0:
		return repeat_queue.pop_front()
	var bank := get_bank()
	var task: Dictionary = bank[question_index % bank.size()]
	question_index += 1
	return task.duplicate(true)

func ensure_learn_gates() -> void:
	if learn_gates.size() > 0:
		return
	active_task = next_task()
	var anchor_x := clampf(player.pos.x + 410.0, 290.0, WORLD_W - 290.0)
	var lanes = [370.0, 495.0, 610.0]
	var options: Array = active_task.options
	for i in range(options.size()):
		learn_gates.append({
			"pos": Vector2(anchor_x + float(i) * 76.0, lanes[i]),
			"label": str(options[i]),
			"correct": str(options[i]) == str(active_task.answer),
			"resolved": false,
			"pulse": rng.randf() * TAU
		})

func check_learn_answers() -> void:
	for gate in learn_gates:
		if bool(gate.resolved):
			continue
		if absf(player.pos.x - gate.pos.x) < 58.0 and absf(player.pos.y - gate.pos.y) < 46.0:
			resolve_gate(gate)
			break
	if learn_gates.size() > 0 and player.pos.x > float(learn_gates[0].pos.x) + 220.0:
		learn_gates.clear()

func resolve_gate(gate: Dictionary) -> void:
	gate.resolved = true
	if bool(gate.correct):
		score += 520
		learn_correct += 1
		learn_streak += 1
		best_learn_streak = maxi(best_learn_streak, learn_streak)
		player.hp = minf(MAX_HP, player.hp + 12.0)
		player.super = minf(MAX_SUPER, player.super + 12.0)
		if learn_streak > 0 and learn_streak % 3 == 0:
			player.stamina = MAX_STAMINA
			player.super = minf(MAX_SUPER, player.super + 18.0)
			score += 360
			award_style(36, "LEARN")
			add_floater(gate.pos + Vector2(0, -88), "Serie +" + str(learn_streak), Color.html("#fde68a"))
		add_floater(gate.pos + Vector2(0, -60), "richtig +520", Color.html("#bbf7d0"))
		spawn_particles(gate.pos, Color.html("#22c55e"), 18, 180.0)
		if learn_correct == LEARN_GOAL:
			mission_notice = "Lernziel erreicht: " + str(LEARN_GOAL) + " richtige Antworten"
			mission_timer = 3.5
			score += 1600
	else:
		stats.wrong += 1
		learn_streak = 0
		repeat_queue.append(active_task.duplicate(true))
		player.hp -= 10.0
		add_floater(gate.pos + Vector2(0, -60), "nochmal spaeter", Color.html("#fecaca"))
		spawn_particles(gate.pos, Color.html("#ef4444"), 14, 190.0)
		message = "Falsche Antwort kommt in die Wiederholung."
		message_timer = 1.5
	learn_gates.clear()

func update_camera() -> void:
	var visible_width := size.x / world_scale()
	var target: float = float(player.pos.x) - visible_width * 0.36
	camera_x = lerpf(camera_x, clampf(target, 0.0, WORLD_W - VIEW_W), 0.16)

func add_floater(pos: Vector2, text: String, color: Color) -> void:
	floaters.append({"pos": pos, "text": text, "color": color, "life": 1.0})

func spawn_particles(pos: Vector2, color: Color, count: int, speed: float) -> void:
	for i in range(count):
		var a := (TAU * float(i) / float(count)) + rng.randf_range(-0.25, 0.25)
		var burst := speed * rng.randf_range(0.35, 1.0)
		particles.append({"pos": pos, "vel": Vector2(cos(a), sin(a)) * burst, "life": rng.randf_range(0.28, 0.72), "color": color, "size": rng.randf_range(2.0, 6.0)})

func key_once(code: int) -> bool:
	var id := str(code)
	var pressed := Input.is_key_pressed(code)
	var was := bool(key_memory.get(id, false))
	key_memory[id] = pressed
	return pressed and not was

func consume_touch_edge(action: String) -> bool:
	var value := bool(touch_edges.get(action, false))
	touch_edges[action] = false
	return value

func _gui_input(event: InputEvent) -> void:
	if not should_show_touch():
		return
	if event is InputEventScreenTouch:
		if event.pressed:
			if event.position.x < size.x * 0.45:
				touch_pointer = event.index
				update_touch_axis(event.position)
			else:
				var action := button_at(event.position)
				if action != "":
					touch_buttons[event.index] = action
					touch_edges[action] = true
					refresh_touch_buttons()
		else:
			if event.index == touch_pointer:
				touch_pointer = -1
				touch_axis = Vector2.ZERO
			if touch_buttons.has(event.index):
				touch_buttons.erase(event.index)
				refresh_touch_buttons()
	elif event is InputEventScreenDrag:
		if event.index == touch_pointer:
			update_touch_axis(event.position)

func update_touch_axis(pos: Vector2) -> void:
	var center := stick_center()
	var diff := pos - center
	if diff.length() < 18.0 * ui_scale():
		touch_axis = Vector2.ZERO
	else:
		touch_axis = (diff / (92.0 * ui_scale())).limit_length(1.0)

func refresh_touch_buttons() -> void:
	touch_button_state.clear()
	for key in touch_buttons.keys():
		touch_button_state[str(touch_buttons[key])] = true

func button_at(pos: Vector2) -> String:
	for button in button_layout():
		var rect: Rect2 = button.rect
		if rect.has_point(pos):
			return str(button.id)
	return ""

func should_show_touch() -> bool:
	return size.x < 980.0 or size.y > size.x * 1.15

func ui_scale() -> float:
	if portrait_mode():
		return 2.35
	if size.x <= 540.0 or size.y > size.x * 1.25:
		return 0.92
	return 1.0

func stick_center() -> Vector2:
	var ui := ui_scale()
	return Vector2(124.0 * ui, size.y - 154.0 * ui)

func button_layout() -> Array:
	var ui := ui_scale()
	var w := 86.0 * ui
	var h := 56.0 * ui
	var gap := 10.0 * ui
	var x := size.x - (w * 3.0 + gap * 2.0 + 18.0 * ui)
	var y := size.y - (h * 3.0 + gap * 2.0 + 74.0 * ui)
	return [
		{"id": "learn", "label": "L\nLern", "rect": Rect2(Vector2(x, y), Vector2(w, h))},
		{"id": "subject", "label": "C\nFach", "rect": Rect2(Vector2(x + w + gap, y), Vector2(w, h))},
		{"id": "super", "label": "I\nSuper", "rect": Rect2(Vector2(x + (w + gap) * 2.0, y), Vector2(w, h))},
		{"id": "punch", "label": "J\nHieb", "rect": Rect2(Vector2(x, y + h + gap), Vector2(w, h))},
		{"id": "kick", "label": "K\nKick", "rect": Rect2(Vector2(x + w + gap, y + h + gap), Vector2(w, h))},
		{"id": "guard", "label": "G\nBlock", "rect": Rect2(Vector2(x + (w + gap) * 2.0, y + h + gap), Vector2(w, h))},
		{"id": "grab", "label": "U\nWurf", "rect": Rect2(Vector2(x, y + (h + gap) * 2.0), Vector2(w, h))},
		{"id": "roll", "label": "Space\nRolle", "rect": Rect2(Vector2(x + w + gap, y + (h + gap) * 2.0), Vector2(w, h))},
		{"id": "launch", "label": "O\nLift", "rect": Rect2(Vector2(x + (w + gap) * 2.0, y + (h + gap) * 2.0), Vector2(w, h))}
	]

func world_x(x: float) -> float:
	return x - camera_x + (rng.randf_range(-1.0, 1.0) * shake * 16.0)

func _draw() -> void:
	draw_background()
	draw_world()
	draw_hud()
	if should_show_touch():
		draw_touch_controls()

func world_y_offset() -> float:
	if size.y <= VIEW_H * 1.12:
		return 0.0
	if portrait_mode():
		return clampf((size.y - VIEW_H) * 0.12, 0.0, 310.0)
	return clampf((size.y - VIEW_H) * 0.38, 0.0, 760.0)

func portrait_mode() -> bool:
	return size.y > size.x * 1.35

func world_scale() -> float:
	return 1.75 if portrait_mode() else 1.0

func draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color.html("#07111f"), true)
	var offset_y := world_y_offset()
	var scale := world_scale()
	var visible_width := size.x / scale
	draw_set_transform(Vector2(0.0, offset_y), 0.0, Vector2(scale, scale))
	var horizon := FLOOR_TOP - 44.0
	draw_rect(Rect2(0, -offset_y / scale, visible_width, horizon + offset_y / scale), Color.html("#0d1b2e"), true)
	for i in range(22):
		var bx := float(i) * 210.0 - fmod(camera_x * 0.32, 210.0) - 60.0
		var bh := 95.0 + float((i * 37) % 120)
		draw_rect(Rect2(bx, horizon - bh, 150.0, bh), Color(0.05, 0.09, 0.17, 0.84), true)
		for w in range(3):
			for h in range(4):
				if (i + w + h) % 3 == 0:
					draw_rect(Rect2(bx + 20 + w * 36, horizon - bh + 22 + h * 28, 14, 12), Color(0.96, 0.77, 0.29, 0.25), true)
	draw_rect(Rect2(0, horizon, visible_width, (size.y / scale) - horizon), Color.html("#16263a"), true)
	for lane in LANES:
		draw_line(Vector2(0, lane), Vector2(visible_width, lane - 22.0), Color(0.72, 0.84, 1.0, 0.12), 2.0)
	for i in range(48):
		var sx := float(i) * 115.0 - fmod(camera_x * 0.88, 115.0)
		draw_rect(Rect2(sx, FLOOR_BOTTOM - 18.0, 54.0, 5.0), Color(0.96, 0.77, 0.29, 0.36), true)
	draw_line(Vector2(0, FLOOR_TOP), Vector2(visible_width, FLOOR_TOP - 30.0), Color(0.35, 0.52, 0.69, 0.55), 5.0)
	draw_line(Vector2(0, FLOOR_BOTTOM), Vector2(visible_width, FLOOR_BOTTOM - 8.0), Color(0.75, 0.85, 0.96, 0.18), 3.0)
	draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)

func draw_world() -> void:
	var scale := world_scale()
	draw_set_transform(Vector2(0.0, world_y_offset()), 0.0, Vector2(scale, scale))
	draw_learn_gates()
	for prop in props:
		if not bool(prop.broken):
			draw_prop(prop)
	for pickup in pickups:
		draw_pickup(pickup)
	for projectile in projectiles:
		draw_projectile(projectile)
	var actors := []
	actors.append({"type": "player", "ref": player})
	for enemy in enemies:
		actors.append({"type": "enemy", "ref": enemy})
	actors.sort_custom(func(a, b): return float(a.ref.pos.y) < float(b.ref.pos.y))
	for actor in actors:
		if str(actor.type) == "player":
			draw_player()
		else:
			draw_enemy(actor.ref)
	for p in particles:
		var alpha := clampf(float(p.life) / 0.72, 0.0, 1.0)
		var c: Color = p.color
		c.a = alpha
		draw_circle(Vector2(world_x(p.pos.x), p.pos.y), float(p.size), c)
	for f in floaters:
		var c: Color = f.color
		c.a = clampf(float(f.life), 0.0, 1.0)
		draw_string(font, Vector2(world_x(f.pos.x) - 80.0, f.pos.y), str(f.text), HORIZONTAL_ALIGNMENT_CENTER, 160.0, 19, c)
	draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)

func draw_prop(prop: Dictionary) -> void:
	var x := world_x(float(prop.x))
	var y := float(prop.y)
	var c := Color.html("#92400e")
	if str(prop.kind) == "barrel":
		c = Color.html("#f97316")
	elif str(prop.kind) == "sign":
		c = Color.html("#38bdf8")
	if float(prop.hit) > 0.0:
		c = c.lerp(Color.WHITE, 0.45)
	var rect := Rect2(x - 30.0, y - 44.0, 60.0, 44.0)
	if str(prop.kind) == "barrel":
		draw_circle(Vector2(x, y - 22.0), 28.0, Color(0, 0, 0, 0.28))
		draw_rect(Rect2(x - 24.0, y - 50.0, 48.0, 50.0), c, true)
		draw_line(Vector2(x - 24.0, y - 35.0), Vector2(x + 24.0, y - 35.0), Color(1, 1, 1, 0.22), 3.0)
	else:
		draw_rect(Rect2(x - 36.0, y - 12.0, 72.0, 10.0), Color(0, 0, 0, 0.25), true)
		draw_rect(rect, c, true)
		draw_rect(rect, Color(1, 1, 1, 0.22), false, 3.0)
		if str(prop.kind) == "sign":
			draw_string(font, Vector2(x - 35.0, y - 25.0), "BONUS", HORIZONTAL_ALIGNMENT_CENTER, 70.0, 13, Color.html("#f8fafc"))
	var ratio := clampf(float(prop.hp) / float(prop.max_hp), 0.0, 1.0)
	draw_rect(Rect2(x - 26.0, y - 58.0, 52.0, 5.0), Color(0, 0, 0, 0.34), true)
	draw_rect(Rect2(x - 26.0, y - 58.0, 52.0 * ratio, 5.0), Color.html("#fde68a"), true)

func draw_pickup(pickup: Dictionary) -> void:
	var pos: Vector2 = pickup.pos
	var y := pos.y - 20.0 + sin(float(pickup.bob)) * 6.0
	var x := world_x(pos.x)
	var kind := str(pickup.kind)
	var c := Color.html("#facc15")
	var label := "$"
	if kind == "food":
		c = Color.html("#22c55e")
		label = "+"
	elif kind == "energy":
		c = Color.html("#38bdf8")
		label = "E"
	elif kind == "super":
		c = Color.html("#fde047")
		label = "S"
	elif kind.begins_with("weapon:"):
		var id := kind.get_slice(":", 1)
		c = Color.html(str(WEAPONS[id].color))
		label = str(WEAPONS[id].label).substr(0, 1)
	draw_circle(Vector2(x, y), 17.0, Color(0, 0, 0, 0.28))
	draw_circle(Vector2(x, y - 3.0), 15.0, c)
	draw_string(font, Vector2(x - 18.0, y + 4.0), label, HORIZONTAL_ALIGNMENT_CENTER, 36.0, 16, Color.html("#07111f"))

func draw_projectile(projectile: Dictionary) -> void:
	var pos: Vector2 = projectile.pos
	draw_circle(Vector2(world_x(pos.x), pos.y), 9.0, Color.html("#bbf7d0"))
	draw_circle(Vector2(world_x(pos.x), pos.y), 14.0, Color(0.34, 0.95, 0.62, 0.18))

func draw_learn_gates() -> void:
	if mode != "Lernen":
		return
	for gate in learn_gates:
		var pos: Vector2 = gate.pos
		var x := world_x(pos.x)
		var pulse := 0.5 + sin(elapsed * 4.0 + float(gate.pulse)) * 0.5
		var rect := Rect2(x - 72.0, pos.y - 42.0, 144.0, 76.0)
		draw_rect(rect.grow(7.0), Color(0.02, 0.05, 0.09, 0.46), true)
		draw_rect(rect, Color(0.92, 0.96, 1.0, 0.86), true)
		draw_rect(rect, Color(0.25, 0.58, 1.0, 0.56 + pulse * 0.22), false, 4.0)
		draw_string(font, rect.position + Vector2(0, 45), str(gate.label), HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, 17, Color.html("#0f172a"))

func draw_player() -> void:
	var pos: Vector2 = player.pos
	var x := world_x(pos.x)
	var y := pos.y
	var flash: bool = float(player.hurt) > 0.0 or (int(elapsed * 18.0) % 2 == 0 and float(player.invuln) > 0.0)
	var body := Color.html("#2563eb") if not flash else Color.html("#f8fafc")
	var trim := Color.html("#facc15")
	var leg_shift := sin(float(player.step)) * 5.0
	draw_ellipse_shadow(Vector2(x, y + 8.0), 38.0, 12.0, Color(0, 0, 0, 0.33))
	draw_rect(Rect2(x - 15.0 + leg_shift, y - 31.0, 10.0, 33.0), Color.html("#172554"), true)
	draw_rect(Rect2(x + 5.0 - leg_shift, y - 31.0, 10.0, 33.0), Color.html("#172554"), true)
	draw_rect(Rect2(x - 23.0, y - 78.0, 46.0, 54.0), body, true)
	draw_rect(Rect2(x - 23.0, y - 78.0, 46.0, 54.0), Color(1, 1, 1, 0.22), false, 3.0)
	draw_circle(Vector2(x, y - 96.0), 24.0, Color.html("#f8fafc"))
	draw_rect(Rect2(x - 24.0, y - 104.0, 48.0, 12.0), trim, true)
	draw_circle(Vector2(x + float(player.facing) * 9.0, y - 98.0), 3.4, Color.html("#0f172a"))
	draw_line(Vector2(x + float(player.facing) * 15.0, y - 66.0), Vector2(x + float(player.facing) * 38.0, y - 58.0), trim, 6.0)
	if player.weapon != "":
		draw_weapon(Vector2(x, y), player.weapon, player.facing)
	if player.guard:
		draw_arc(Vector2(x + float(player.facing) * 34.0, y - 59.0), 32.0, -1.35, 1.35, 24, Color(0.73, 0.88, 1.0, 0.85), 5.0)
	if player.attack_timer > 0.0:
		draw_attack_flash(Vector2(x, y), player.attack_kind, player.facing)

func draw_enemy(enemy: Dictionary) -> void:
	var pos: Vector2 = enemy.pos
	var x := world_x(pos.x)
	var air_lift := sin(clampf(float(enemy.get("air", 0.0)) / 0.72, 0.0, 1.0) * PI) * 46.0
	var y := pos.y - air_lift
	var color := Color.html(str(enemy.color))
	if float(enemy.hit) > 0.0:
		color = color.lerp(Color.WHITE, 0.55)
	var scale := 1.0
	if enemy.type == "brute":
		scale = 1.18
	elif enemy.type == "boss":
		scale = 1.65
	draw_ellipse_shadow(Vector2(x, y + 9.0), 35.0 * scale, 12.0 * scale, Color(0, 0, 0, 0.34))
	draw_rect(Rect2(x - 18.0 * scale, y - 68.0 * scale, 36.0 * scale, 48.0 * scale), color, true)
	draw_rect(Rect2(x - 18.0 * scale, y - 68.0 * scale, 36.0 * scale, 48.0 * scale), Color(1, 1, 1, 0.18), false, 3.0)
	draw_circle(Vector2(x, y - 82.0 * scale), 19.0 * scale, Color.html("#1f2937"))
	draw_circle(Vector2(x + float(enemy.facing) * 8.0 * scale, y - 84.0 * scale), 3.0 * scale, Color.html("#fde68a"))
	if enemy.type == "thrower":
		draw_circle(Vector2(x + float(enemy.facing) * 28.0, y - 58.0), 7.0, Color.html("#bbf7d0"))
	elif enemy.type == "shield":
		draw_arc(Vector2(x + float(enemy.facing) * 25.0, y - 57.0), 25.0, -1.28, 1.28, 22, Color.html("#bfdbfe"), 6.0)
	elif enemy.type == "duelist":
		draw_line(Vector2(x + float(enemy.facing) * 15.0, y - 58.0), Vector2(x + float(enemy.facing) * 48.0, y - 76.0), Color.html("#fbcfe8"), 4.0)
	elif enemy.type == "medic":
		draw_line(Vector2(x - 13.0, y - 55.0), Vector2(x + 13.0, y - 55.0), Color.html("#f8fafc"), 4.0)
		draw_line(Vector2(x, y - 68.0), Vector2(x, y - 42.0), Color.html("#f8fafc"), 4.0)
	elif enemy.type == "knife":
		draw_line(Vector2(x + float(enemy.facing) * 18.0, y - 56.0), Vector2(x + float(enemy.facing) * 42.0, y - 62.0), Color.html("#f8fafc"), 4.0)
	elif enemy.type == "boss":
		draw_string(font, Vector2(x - 68.0, y - 142.0), "BOSS", HORIZONTAL_ALIGNMENT_CENTER, 136.0, 18, Color.html("#fef3c7"))
	var ratio := clampf(float(enemy.hp) / float(enemy.max_hp), 0.0, 1.0)
	draw_rect(Rect2(x - 30.0 * scale, y - 112.0 * scale, 60.0 * scale, 6.0), Color(0, 0, 0, 0.38), true)
	draw_rect(Rect2(x - 30.0 * scale, y - 112.0 * scale, 60.0 * scale * ratio, 6.0), Color.html("#f87171"), true)

func draw_weapon(origin: Vector2, weapon_id: String, facing: int) -> void:
	var c := Color.html(str(WEAPONS[weapon_id].color))
	if weapon_id == "chain":
		for i in range(5):
			draw_circle(origin + Vector2(float(facing) * (26.0 + i * 10.0), -60.0 + sin(elapsed * 10.0 + i) * 4.0), 4.0, c)
	else:
		draw_line(origin + Vector2(float(facing) * 18.0, -62.0), origin + Vector2(float(facing) * 58.0, -76.0), c, 7.0)

func draw_attack_flash(origin: Vector2, kind: String, facing: int) -> void:
	var reach := 78.0
	var col := Color(0.99, 0.88, 0.32, 0.45)
	if kind == "kick":
		reach = 104.0
		col = Color(0.56, 0.83, 1.0, 0.42)
	elif kind == "grab":
		reach = 58.0
		col = Color(0.94, 0.42, 0.94, 0.42)
	elif kind == "launch":
		reach = 94.0
		col = Color(0.99, 0.88, 0.32, 0.58)
	elif kind == "super":
		reach = 170.0
		col = Color(0.99, 0.82, 0.18, 0.58)
	var center := origin + Vector2(float(facing) * reach * 0.55, -58.0)
	draw_arc(center, reach * 0.55, -0.8 if facing > 0 else PI - 0.8, 0.8 if facing > 0 else PI + 0.8, 28, col, 16.0)

func draw_ellipse_shadow(pos: Vector2, rx: float, ry: float, color: Color) -> void:
	var points := PackedVector2Array()
	for i in range(24):
		var a := TAU * float(i) / 24.0
		points.append(pos + Vector2(cos(a) * rx, sin(a) * ry))
	draw_polygon(points, PackedColorArray([color]))

func draw_hud() -> void:
	var panel := Rect2(16, 14, minf(size.x - 32.0, 720.0), 126.0)
	draw_rect(panel, Color(0.02, 0.05, 0.09, 0.74), true)
	draw_rect(panel, Color(0.78, 0.88, 1.0, 0.22), false, 2.0)
	draw_string(font, Vector2(30, 38), "FASKA BRAWLER PRO", HORIZONTAL_ALIGNMENT_LEFT, 260.0, 22, Color.html("#f8fafc"))
	draw_bar(Vector2(30, 70), 190.0, "HP", player.hp / MAX_HP, Color.html("#fb7185"))
	draw_bar(Vector2(240, 70), 180.0, "AUS", player.stamina / MAX_STAMINA, Color.html("#67e8f9"))
	draw_bar(Vector2(440, 70), 180.0, "SUPER", player.super / MAX_SUPER, Color.html("#facc15"))
	var info := "Welle " + str(wave) + "   Gegner " + str(enemies.size()) + "   Score " + str(score)
	draw_string(font, Vector2(30, 114), info, HORIZONTAL_ALIGNMENT_LEFT, 520.0, 17, Color.html("#cbd5e1"))
	draw_string(font, Vector2(440, 114), "Style " + style_rank() + " / Best " + best_style_rank + "   Perfect " + str(stats.perfect), HORIZONTAL_ALIGNMENT_LEFT, 270.0, 17, Color.html("#fef3c7"))
	var mode_panel := Rect2(size.x - 350.0, 14.0, 334.0, 126.0)
	draw_rect(mode_panel, Color(0.02, 0.05, 0.09, 0.74), true)
	draw_rect(mode_panel, Color(0.78, 0.88, 1.0, 0.22), false, 2.0)
	draw_string(font, mode_panel.position + Vector2(14, 28), mode + "  |  " + str(LESSONS[lesson_index]), HORIZONTAL_ALIGNMENT_LEFT, 280.0, 18, Color.html("#fef3c7"))
	draw_string(font, mode_panel.position + Vector2(14, 56), "Richtig: " + str(learn_correct) + "/" + str(LEARN_GOAL) + "  Wdh: " + str(repeat_queue.size()) + "  Serie: " + str(learn_streak) + "/" + str(best_learn_streak), HORIZONTAL_ALIGNMENT_LEFT, 310.0, 14, Color.html("#cbd5e1"))
	var weapon_text := "Waffe: Faust"
	if player.weapon != "":
		weapon_text = "Waffe: " + str(WEAPONS[player.weapon].label) + " " + str(player.weapon_durability)
	draw_string(font, mode_panel.position + Vector2(14, 82), weapon_text, HORIZONTAL_ALIGNMENT_LEFT, 310.0, 14, Color.html("#cbd5e1"))
	draw_string(font, mode_panel.position + Vector2(14, 108), "O Launcher  G Parry  I Super", HORIZONTAL_ALIGNMENT_LEFT, 310.0, 13, Color.html("#cbd5e1"))
	if mode == "Lernen" and active_task.size() > 0:
		var qpanel := Rect2(160.0, 148.0, size.x - 320.0, 66.0)
		draw_rect(qpanel, Color(0.92, 0.96, 1.0, 0.9), true)
		draw_rect(qpanel, Color(0.25, 0.58, 1.0, 0.52), false, 3.0)
		draw_string(font, qpanel.position + Vector2(14, 25), str(active_task.prompt), HORIZONTAL_ALIGNMENT_LEFT, qpanel.size.x - 28.0, 20, Color.html("#0f172a"))
		draw_string(font, qpanel.position + Vector2(14, 50), "Laufe durch das richtige Antworttor.", HORIZONTAL_ALIGNMENT_LEFT, qpanel.size.x - 28.0, 13, Color.html("#334155"))
	if message_timer > 0.0:
		draw_center_notice(message, 214.0, Color.html("#f8fafc"))
	if mission_timer > 0.0:
		draw_center_notice(mission_notice, 262.0, Color.html("#facc15"))
	if combo > 1:
		draw_string(font, Vector2(size.x * 0.5 - 80.0, 116.0), str(combo) + " HIT", HORIZONTAL_ALIGNMENT_CENTER, 160.0, 29, Color.html("#facc15"))
	if phase == "over":
		draw_rect(Rect2(Vector2.ZERO, size), Color(0, 0, 0, 0.48), true)
		draw_string(font, Vector2(0, size.y * 0.46), "K.O.", HORIZONTAL_ALIGNMENT_CENTER, size.x, 56, Color.html("#f8fafc"))
		draw_string(font, Vector2(0, size.y * 0.55), "Enter, Space oder Touch startet neu", HORIZONTAL_ALIGNMENT_CENTER, size.x, 22, Color.html("#cbd5e1"))

func draw_bar(pos: Vector2, width: float, label: String, ratio: float, color: Color) -> void:
	draw_string(font, pos + Vector2(0, -7), label, HORIZONTAL_ALIGNMENT_LEFT, 58.0, 12, Color.html("#cbd5e1"))
	draw_rect(Rect2(pos + Vector2(46, -15), Vector2(width, 12)), Color(0, 0, 0, 0.34), true)
	draw_rect(Rect2(pos + Vector2(46, -15), Vector2(width * clampf(ratio, 0.0, 1.0), 12)), color, true)
	draw_rect(Rect2(pos + Vector2(46, -15), Vector2(width, 12)), Color(1, 1, 1, 0.22), false, 2.0)

func draw_center_notice(text: String, y: float, color: Color) -> void:
	var rect := Rect2(size.x * 0.5 - 280.0, y, 560.0, 42.0)
	draw_rect(rect, Color(0.02, 0.05, 0.09, 0.72), true)
	draw_rect(rect, Color(1, 1, 1, 0.18), false, 2.0)
	draw_string(font, rect.position + Vector2(0, 27), text, HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, 18, color)

func draw_touch_controls() -> void:
	var ui := ui_scale()
	var center := stick_center()
	draw_circle(center, 82.0 * ui, Color(0.02, 0.05, 0.09, 0.54))
	draw_arc(center, 82.0 * ui, 0.0, TAU, 36, Color(0.78, 0.88, 1.0, 0.52), 4.0 * ui)
	draw_circle(center + touch_axis * 48.0 * ui, 30.0 * ui, Color(0.93, 0.96, 1.0, 0.82))
	draw_string(font, center + Vector2(-70.0 * ui, -96.0 * ui), "Bewegen", HORIZONTAL_ALIGNMENT_CENTER, 140.0 * ui, 14, Color.html("#cbd5e1"))
	for button in button_layout():
		var rect: Rect2 = button.rect
		var id := str(button.id)
		var active := bool(touch_button_state.get(id, false))
		draw_rect(rect, Color(0.02, 0.05, 0.09, 0.66), true)
		draw_rect(rect, Color.html("#facc15") if active else Color(0.78, 0.88, 1.0, 0.56), false, 3.0 * ui)
		var lines := str(button.label).split("\n")
		for i in range(lines.size()):
			draw_string(font, rect.position + Vector2(0, (23.0 + float(i) * 20.0) * ui), lines[i], HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, int(15.0 * ui), Color.html("#f8fafc"))
