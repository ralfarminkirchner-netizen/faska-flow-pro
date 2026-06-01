extends Control

const WORLD_W := 2040.0
const WORLD_H := 1320.0
const PLAYER_R := 18.0
const MAX_HP := 190.0
const MAX_STAMINA := 100.0
const BASE_SPEED := 294.0
const DASH_SPEED := 910.0
const LEARN_GOAL := 10

const LESSONS = ["WORTART", "LESEN", "SATZ", "KOMPOSITUM", "MATHE", "ENGLISCH", "SACHKUNDE"]

const TASKS_WORD = [
	{"prompt": "Welche Wortart ist 'mutig'?", "answer": "Adjektiv", "options": ["Nomen", "Verb", "Adjektiv"]},
	{"prompt": "Welches Wort ist ein Verb?", "answer": "springen", "options": ["springen", "Stein", "hell"]},
	{"prompt": "Welches Wort ist ein Nomen?", "answer": "Bruecke", "options": ["Bruecke", "laufen", "weich"]},
	{"prompt": "Welche Wortart ist 'leise'?", "answer": "Adjektiv", "options": ["Verb", "Adjektiv", "Artikel"]},
	{"prompt": "Welche Wortart ist 'unter'?", "answer": "Praeposition", "options": ["Nomen", "Praeposition", "Verb"]},
	{"prompt": "Welche Wortart ist 'weil'?", "answer": "Konjunktion", "options": ["Adjektiv", "Artikel", "Konjunktion"]}
]

const TASKS_READING = [
	{"prompt": "Welches Wort passt zu: Nachts scheint der ...", "answer": "Mond", "options": ["Mond", "Topf", "Seil"]},
	{"prompt": "Was bedeutet 'leuchten'?", "answer": "hell sein", "options": ["hell sein", "rennen", "schlafen"]},
	{"prompt": "Was liest du in 'Schatzkarte' zuerst?", "answer": "Schatz", "options": ["Karte", "Schatz", "Tasche"]},
	{"prompt": "Welches Wort reimt sich auf 'Haus'?", "answer": "Maus", "options": ["Maus", "Hut", "See"]},
	{"prompt": "Welches Wort passt: Der Jaeger traegt eine ...", "answer": "Laterne", "options": ["Laterne", "Wolke", "Birne"]},
	{"prompt": "Was bedeutet 'sicher'?", "answer": "geschuetzt", "options": ["geschuetzt", "kaputt", "durstig"]}
]

const TASKS_SENTENCE = [
	{"prompt": "Wo steht das Verb? 'Luna findet den Schluessel.'", "answer": "findet", "options": ["Luna", "findet", "Schluessel"]},
	{"prompt": "Welche Satzart ist: 'Komm schnell!'", "answer": "Aufforderung", "options": ["Frage", "Aufforderung", "Aussage"]},
	{"prompt": "Was fehlt? 'Der Held ___ die Tuer.'", "answer": "oeffnet", "options": ["oeffnet", "rot", "unter"]},
	{"prompt": "Welcher Satz ist richtig?", "answer": "Ich sehe den Turm.", "options": ["Ich den Turm sehe.", "Sehe den ich Turm.", "Ich sehe den Turm."]},
	{"prompt": "Welches Satzzeichen passt? 'Wo ist der Ausgang'", "answer": "?", "options": [".", "?", "!"]},
	{"prompt": "Was ist das Subjekt? 'Der Mutige kaempft.'", "answer": "Der Mutige", "options": ["kaempft", "Der Mutige", "mutig"]}
]

const TASKS_COMPOUND = [
	{"prompt": "Welches Kompositum ist richtig?", "answer": "Mondlicht", "options": ["Mondlicht", "Lichtmond", "hellMond"]},
	{"prompt": "Was entsteht aus Blut + Phiolen?", "answer": "Blutphiolen", "options": ["Phiolenblut", "Blutphiolen", "Blutig"]},
	{"prompt": "Welches Wort besteht aus zwei Nomen?", "answer": "Schlosstor", "options": ["Schlosstor", "hellrot", "rennen"]},
	{"prompt": "Welche Teile hat 'Nebelwald'?", "answer": "Nebel + Wald", "options": ["Nebel + Wald", "neben + bald", "Wald + Licht"]},
	{"prompt": "Was passt zusammen?", "answer": "Grab + Stein", "options": ["Grab + Stein", "schnell + Haus", "und + Tor"]},
	{"prompt": "Welches Kompositum passt zum Spiel?", "answer": "Nachtjaeger", "options": ["Nachtjaeger", "Tagmilch", "Laufartikel"]}
]

const TASKS_MATH = [
	{"prompt": "12 x 7 = ?", "answer": "84", "options": ["72", "84", "96"]},
	{"prompt": "36 : 4 = ?", "answer": "9", "options": ["6", "8", "9"]},
	{"prompt": "15 + 28 = ?", "answer": "43", "options": ["33", "43", "53"]},
	{"prompt": "90 - 27 = ?", "answer": "63", "options": ["57", "63", "73"]},
	{"prompt": "Welche Zahl ist gerade?", "answer": "48", "options": ["37", "48", "55"]},
	{"prompt": "3 x 9 + 2 = ?", "answer": "29", "options": ["27", "29", "32"]}
]

const TASKS_ENGLISH = [
	{"prompt": "Was bedeutet 'shield'?", "answer": "Schild", "options": ["Schwert", "Schild", "Schule"]},
	{"prompt": "Was bedeutet 'moon'?", "answer": "Mond", "options": ["Mond", "Mund", "Berg"]},
	{"prompt": "Was bedeutet 'key'?", "answer": "Schluessel", "options": ["Kerze", "Schluessel", "Keks"]},
	{"prompt": "Was bedeutet 'brave'?", "answer": "mutig", "options": ["mutig", "mued", "weich"]},
	{"prompt": "Was bedeutet 'forest'?", "answer": "Wald", "options": ["Wald", "Tor", "Wolke"]},
	{"prompt": "Was bedeutet 'heal'?", "answer": "heilen", "options": ["heilen", "halten", "holen"]}
]

const TASKS_SCIENCE = [
	{"prompt": "Was brauchen Pflanzen zum Wachsen?", "answer": "Licht", "options": ["Licht", "Stein", "Sanduhr"]},
	{"prompt": "Welches Tier ist nachtaktiv?", "answer": "Eule", "options": ["Eule", "Kuh", "Huhn"]},
	{"prompt": "Woraus besteht Nebel?", "answer": "Wasser", "options": ["Sand", "Wasser", "Metall"]},
	{"prompt": "Welche Richtung zeigt ein Kompass?", "answer": "Norden", "options": ["Norden", "unten", "laut"]},
	{"prompt": "Was schuetzt den Kopf?", "answer": "Schaedel", "options": ["Schaedel", "Magen", "Finger"]},
	{"prompt": "Was ist eine Lichtquelle?", "answer": "Laterne", "options": ["Laterne", "Schatten", "Stein"]}
]

var font
var rng := RandomNumberGenerator.new()
var player := {}
var enemies := []
var bullets := []
var effects := []
var particles := []
var floaters := []
var runes := []
var graves := []
var lamps := []
var gates := []
var pickups := []
var camera := Vector2.ZERO
var aim_world := Vector2.ZERO
var touch_axis := Vector2.ZERO
var touch_pointer := -1
var touch_buttons := {}
var touch_button_state := {}
var active_touch_buttons := {}
var mode := "Normal"
var phase := "run"
var wave := 1
var score := 0
var combo := 0
var weapon_form := "cane"
var question_index := 0
var lesson_index := 0
var repeat_queue: Array = []
var message := ""
var message_timer := 0.0
var shake := 0.0
var grace_timer := 0.0
var stats := {}

func _ready() -> void:
	rng.seed = 91047
	font = get_theme_default_font()
	mouse_filter = Control.MOUSE_FILTER_PASS
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	reset_game()

func reset_game() -> void:
	player = {
		"pos": Vector2(WORLD_W * 0.5, WORLD_H * 0.62),
		"vel": Vector2.ZERO,
		"hp": MAX_HP,
		"stamina": MAX_STAMINA,
		"blood": 8,
		"bullets": 16,
		"lost": 0.0,
		"rally": 0.0,
		"dash": 0.0,
		"attack": 0.0,
		"attack_cd": 0.0,
		"gun_cd": 0.0,
		"cast_cd": 0.0,
		"heal_cd": 0.0,
		"trick_cd": 0.0,
		"invuln": 0.0,
		"fever": 0.0,
		"dir": Vector2(0.0, -1.0)
	}
	enemies.clear()
	bullets.clear()
	effects.clear()
	particles.clear()
	floaters.clear()
	pickups.clear()
	touch_buttons.clear()
	touch_button_state = {"atk": false, "dash": false, "gun": false, "focus": false, "vial": false}
	active_touch_buttons.clear()
	touch_axis = Vector2.ZERO
	touch_pointer = -1
	mode = "Normal"
	phase = "run"
	wave = 1
	score = 0
	combo = 0
	weapon_form = "cane"
	question_index = 0
	lesson_index = 0
	repeat_queue.clear()
	stats = {"kills": 0, "parries": 0, "viscerals": 0, "dodges": 0, "trick": 0, "rally": 0, "learn": 0, "bosses": 0, "focus": 0, "wrong": 0}
	build_static_world()
	build_runes()
	spawn_wave()
	message = "FASKA NIGHT HUNT PRO"
	message_timer = 2.6
	shake = 0.0
	grace_timer = 10.0
	aim_world = Vector2(player.pos) + Vector2(player.dir) * 200.0

func build_static_world() -> void:
	graves = [
		Rect2(180, 210, 190, 56), Rect2(1520, 215, 235, 56), Rect2(285, 890, 245, 64),
		Rect2(1330, 900, 285, 64), Rect2(835, 565, 315, 76), Rect2(835, 260, 285, 52),
		Rect2(835, 1015, 285, 52), Rect2(145, 575, 98, 230), Rect2(1780, 560, 98, 250),
		Rect2(545, 420, 130, 48), Rect2(1360, 430, 130, 48), Rect2(520, 725, 170, 52),
		Rect2(1325, 730, 170, 52)
	]
	lamps = [Vector2(245, 370), Vector2(1780, 365), Vector2(360, 1065), Vector2(1630, 1070), Vector2(1010, 660), Vector2(1010, 180)]
	gates = [
		{"pos": Vector2(1010, 112), "label": "NORDTOR"},
		{"pos": Vector2(1010, 1200), "label": "SUEDTOR"},
		{"pos": Vector2(132, 660), "label": "WESTTOR"},
		{"pos": Vector2(1905, 660), "label": "OSTTOR"}
	]

func spawn_wave() -> void:
	var count = min(9, 3 + wave)
	for i in range(count):
		var side: int = i % 4
		var pos := Vector2.ZERO
		if side == 0:
			pos = Vector2(rng.randf_range(120.0, WORLD_W - 120.0), 100.0)
		elif side == 1:
			pos = Vector2(WORLD_W - 105.0, rng.randf_range(110.0, WORLD_H - 110.0))
		elif side == 2:
			pos = Vector2(rng.randf_range(120.0, WORLD_W - 120.0), WORLD_H - 105.0)
		else:
			pos = Vector2(105.0, rng.randf_range(110.0, WORLD_H - 110.0))
		var kind := "hunter"
		if wave % 4 == 0 and i == 0:
			kind = "boss"
		elif wave >= 5 and i == 1:
			kind = "bell"
		elif wave >= 3 and i % 4 == 0:
			kind = "gunner"
		elif wave >= 2 and i % 3 == 0:
			kind = "beast"
		spawn_enemy(kind, pos)
	message = "Nachtwelle " + str(wave) + " - " + ("Bossjagd" if wave % 4 == 0 else "ueberleben")
	message_timer = 2.0

func spawn_enemy(kind: String, pos: Vector2) -> void:
	var hp := 46.0 + wave * 5.0
	var speed := 132.0
	var radius := 20.0
	var color := Color(0.78, 0.12, 0.18)
	if kind == "beast":
		hp = 72.0 + wave * 5.5
		speed = 194.0
		radius = 25.0
		color = Color(0.95, 0.38, 0.16)
	elif kind == "gunner":
		hp = 38.0 + wave * 3.5
		speed = 112.0
		radius = 18.0
		color = Color(0.56, 0.48, 0.98)
	elif kind == "bell":
		hp = 64.0 + wave * 4.0
		speed = 92.0
		radius = 22.0
		color = Color(0.9, 0.65, 1.0)
	elif kind == "boss":
		hp = 360.0 + wave * 36.0
		speed = 106.0
		radius = 48.0
		color = Color(0.43, 0.02, 0.05)
	enemies.append({"kind": kind, "pos": pos, "vel": Vector2.ZERO, "hp": hp, "max_hp": hp, "speed": speed, "radius": radius, "color": color, "attack": rng.randf_range(0.8, 2.2), "contact": 0.0, "stagger": 0.0, "summon": rng.randf_range(4.0, 7.0), "phase": rng.randf_range(0.0, TAU)})

func build_runes() -> void:
	runes.clear()
	var task = current_task()
	var anchors = [Vector2(440, 365), Vector2(1010, 248), Vector2(1580, 365)]
	for i in range(3):
		runes.append({"pos": anchors[i], "label": String(task.options[i]), "answer": String(task.answer), "task": task, "active": true, "repeat": bool(task.get("repeat", false)), "phase": float(i) * 0.8})

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()
	if phase == "run":
		update_game(delta)
	update_effects(delta)
	queue_redraw()

func update_game(delta: float) -> void:
	grace_timer = max(0.0, grace_timer - delta)
	update_player(delta)
	update_enemies(delta)
	update_bullets(delta)
	update_pickups(delta)
	update_runes(delta)
	if enemies.is_empty():
		wave += 1
		score += 520 + wave * 85
		player.bullets = min(32, int(player.bullets) + 4)
		if wave % 2 == 0:
			player.blood = min(12, int(player.blood) + 1)
		spawn_wave()
	if float(player.hp) <= 0.0:
		phase = "over"
		message = "Die Nacht hat dich geholt - R fuer Neustart"
		message_timer = 99.0
	camera = (Vector2(player.pos) - size * 0.5).clamp(Vector2.ZERO, Vector2(max(0.0, WORLD_W - size.x), max(0.0, WORLD_H - size.y)))

func update_player(delta: float) -> void:
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
	if axis.length() > 0.0:
		player.dir = axis.normalized()
	var speed := BASE_SPEED
	if float(player.dash) > 0.0:
		speed = DASH_SPEED
		player.invuln = max(float(player.invuln), 0.08)
	player.vel = Vector2(player.vel).lerp(axis * speed, min(1.0, delta * 8.0))
	move_player(Vector2(player.vel) * delta)
	player.stamina = min(MAX_STAMINA, float(player.stamina) + delta * 29.0)
	player.dash = max(0.0, float(player.dash) - delta)
	player.attack = max(0.0, float(player.attack) - delta)
	player.attack_cd = max(0.0, float(player.attack_cd) - delta)
	player.gun_cd = max(0.0, float(player.gun_cd) - delta)
	player.cast_cd = max(0.0, float(player.cast_cd) - delta)
	player.heal_cd = max(0.0, float(player.heal_cd) - delta)
	player.trick_cd = max(0.0, float(player.trick_cd) - delta)
	player.invuln = max(0.0, float(player.invuln) - delta)
	player.fever = max(0.0, float(player.fever) - delta)
	player.rally = max(0.0, float(player.rally) - delta)
	if float(player.rally) <= 0.0:
		player.lost = max(0.0, float(player.lost) - delta * 22.0)
	if not should_show_touch_controls():
		aim_world = screen_to_world(get_local_mouse_position())
	if Input.is_key_pressed(KEY_J):
		start_attack()
	if touch_button_state.get("atk", false):
		start_attack()
	if touch_button_state.get("dash", false):
		start_dash()
	if touch_button_state.get("gun", false):
		fire_gun()

func move_player(delta_pos: Vector2) -> void:
	var pos := Vector2(player.pos)
	var try_x := Vector2(clamp(pos.x + delta_pos.x, PLAYER_R, WORLD_W - PLAYER_R), pos.y)
	if not circle_hits_wall(try_x, PLAYER_R):
		pos.x = try_x.x
	else:
		player.vel = Vector2(0.0, Vector2(player.vel).y)
	var try_y := Vector2(pos.x, clamp(pos.y + delta_pos.y, PLAYER_R, WORLD_H - PLAYER_R))
	if not circle_hits_wall(try_y, PLAYER_R):
		pos.y = try_y.y
	else:
		player.vel = Vector2(Vector2(player.vel).x, 0.0)
	player.pos = pos

func get_combat_dir() -> Vector2:
	var pos := Vector2(player.pos)
	var nearest := Vector2.ZERO
	var nearest_dist := 999999.0
	for e in enemies:
		var delta: Vector2 = Vector2(e.pos) - pos
		var d := delta.length()
		if d < nearest_dist and d < 520.0:
			nearest_dist = d
			nearest = delta
	if should_show_touch_controls() and nearest_dist < 520.0:
		return nearest.normalized()
	var aim := aim_world - pos
	if aim.length() > 18.0:
		return aim.normalized()
	if nearest_dist < 520.0:
		return nearest.normalized()
	return Vector2(player.dir).normalized()

func start_dash() -> void:
	if float(player.stamina) < 22.0 or float(player.dash) > 0.0:
		return
	var dir := Vector2(player.dir)
	if dir.length() < 0.1:
		dir = get_combat_dir()
	player.dir = dir.normalized()
	player.vel = Vector2(player.dir) * DASH_SPEED
	player.dash = 0.19
	player.invuln = 0.26
	player.stamina = max(0.0, float(player.stamina) - 22.0)
	stats.dodges += 1
	add_text("ROLL", Vector2(player.pos), Color(0.52, 0.82, 1.0))

func start_attack() -> void:
	if float(player.attack_cd) > 0.0 or float(player.stamina) < 14.0:
		return
	var dir := get_combat_dir()
	if dir.length() < 0.1:
		dir = Vector2(player.dir)
	player.dir = dir
	player.attack = 0.18
	player.attack_cd = 0.34 if weapon_form == "cane" else 0.52
	player.stamina = max(0.0, float(player.stamina) - (14.0 if weapon_form == "cane" else 23.0))
	var reach := 82.0 if weapon_form == "cane" else 130.0
	var damage := 23.0 if weapon_form == "cane" else 37.0
	if float(player.fever) > 0.0:
		damage *= 1.55
	var hit_any := false
	for i in range(enemies.size() - 1, -1, -1):
		var e = enemies[i]
		var to_enemy: Vector2 = Vector2(e.pos) - Vector2(player.pos)
		var in_arc := to_enemy.length() < reach + float(e.radius) and dir.dot(to_enemy.normalized()) > 0.22
		if in_arc:
			hit_enemy(i, damage, "trick" if weapon_form == "scythe" else "melee")
			hit_any = true
	if hit_any:
		recover_rally(damage * 0.44)
		add_effect(Vector2(player.pos) + dir * 48.0, reach * 0.45, Color(0.92, 0.76, 1.0))

func fire_gun() -> void:
	if int(player.bullets) <= 0 or float(player.gun_cd) > 0.0:
		if float(player.gun_cd) <= 0.0:
			add_text("Keine Blutkugeln", Vector2(player.pos), Color(1.0, 0.35, 0.26))
		return
	player.bullets -= 1
	player.gun_cd = 0.44
	var dir := get_combat_dir()
	if dir.length() < 0.1:
		dir = Vector2(player.dir)
	player.dir = dir
	bullets.append({"pos": Vector2(player.pos) + dir * 25.0, "vel": dir * 860.0, "life": 0.72, "damage": 11.0, "radius": 5.0, "color": Color(0.95, 0.78, 0.42), "from_player": true})

func cast_focus() -> void:
	if float(player.cast_cd) > 0.0 or float(player.stamina) < 28.0:
		return
	player.cast_cd = 1.35
	player.stamina = max(0.0, float(player.stamina) - 28.0)
	stats.focus = int(stats.get("focus", 0)) + 1
	var pos := Vector2(player.pos)
	for i in range(enemies.size() - 1, -1, -1):
		var e = enemies[i]
		if Vector2(e.pos).distance_to(pos) < 190.0:
			e.stagger = max(float(e.stagger), 0.75)
			enemies[i] = e
			hit_enemy(i, 27.0, "focus")
	add_effect(pos, 190.0, Color(0.55, 0.35, 1.0))

func use_vial() -> void:
	if int(player.blood) <= 0 or float(player.heal_cd) > 0.0:
		return
	player.blood -= 1
	player.heal_cd = 1.0
	player.hp = min(MAX_HP, float(player.hp) + 46.0)
	player.lost = 0.0
	add_text("BLOOD VIAL", Vector2(player.pos), Color(0.95, 0.18, 0.22))

func transform_weapon() -> void:
	if float(player.trick_cd) > 0.0:
		return
	player.trick_cd = 0.35
	weapon_form = "scythe" if weapon_form == "cane" else "cane"
	stats.trick += 1
	add_text("TRICK " + weapon_form.to_upper(), Vector2(player.pos), Color(0.9, 0.75, 1.0))

func update_enemies(delta: float) -> void:
	for i in range(enemies.size() - 1, -1, -1):
		var e = enemies[i]
		e.stagger = max(0.0, float(e.stagger) - delta)
		e.phase = float(e.phase) + delta
		e.attack = float(e.attack) - delta
		e.contact = max(0.0, float(e.contact) - delta)
		e.summon = float(e.summon) - delta
		if float(e.stagger) > 0.0:
			enemies[i] = e
			continue
		var to_player: Vector2 = Vector2(player.pos) - Vector2(e.pos)
		var dist: float = max(1.0, to_player.length())
		var desired := to_player / dist
		if String(e.kind) == "beast":
			desired = desired.rotated(sin(float(e.phase) * 3.2) * 0.5)
			if float(e.attack) <= 0.0 and dist < 360.0:
				e.attack = rng.randf_range(1.0, 1.65)
				e.vel = desired * (float(e.speed) * 2.65)
		elif String(e.kind) == "gunner":
			if dist < 260.0:
				desired = -desired
			else:
				desired = desired.rotated(sin(float(e.phase) * 2.0) * 0.6)
		elif String(e.kind) == "bell":
			if dist < 300.0:
				desired = -desired.rotated(0.35)
			if float(e.summon) <= 0.0 and enemies.size() < 12:
				e.summon = rng.randf_range(5.0, 7.5)
				spawn_enemy("hunter", Vector2(e.pos) + Vector2(rng.randf_range(-80, 80), rng.randf_range(-80, 80)))
				add_text("GLOCKE", Vector2(e.pos), Color(0.95, 0.72, 1.0))
		elif String(e.kind) == "boss":
			desired = desired.rotated(sin(float(e.phase) * 1.4) * 0.42)
			if float(e.attack) <= 0.0 and dist < 470.0:
				e.attack = rng.randf_range(1.35, 2.1)
				fire_enemy_bullet(e, 3)
		e.vel = Vector2(e.vel).lerp(desired * float(e.speed), min(1.0, delta * 3.8))
		var next := Vector2(e.pos) + Vector2(e.vel) * delta
		if not circle_hits_wall(next, float(e.radius)):
			e.pos = next
		else:
			e.vel = -Vector2(e.vel) * 0.28
		if String(e.kind) == "gunner" and float(e.attack) <= 0.0 and dist < 660.0:
			e.attack = rng.randf_range(1.0, 1.8)
			fire_enemy_bullet(e, 1)
		elif float(e.contact) <= 0.0 and dist < float(e.radius) + PLAYER_R + 31.0:
			e.contact = 0.75
			enemy_strike(e)
		enemies[i] = e

func enemy_strike(e) -> void:
	if grace_timer > 0.0:
		return
	var damage := 11.0
	if String(e.kind) == "boss":
		damage = 24.0
	elif String(e.kind) == "beast":
		damage = 15.0
	if float(player.invuln) > 0.0:
		add_text("PERFECT", Vector2(player.pos), Color(0.45, 0.85, 1.0))
		stats.dodges += 1
		return
	damage_player(damage, "Treffer")

func fire_enemy_bullet(e, count := 1) -> void:
	if grace_timer > 0.0:
		return
	var base := (Vector2(player.pos) - Vector2(e.pos)).normalized()
	for n in range(count):
		var offset := 0.0
		if count > 1:
			offset = (float(n) - float(count - 1) * 0.5) * 0.24
		var dir := base.rotated(offset)
		var damage := 8.0 if String(e.kind) != "boss" else 12.0
		bullets.append({"pos": Vector2(e.pos) + dir * float(e.radius), "vel": dir * (430.0 if String(e.kind) != "boss" else 500.0), "life": 2.2, "damage": damage, "radius": 6.0, "color": Color(0.75, 0.18, 1.0), "from_player": false})

func update_bullets(delta: float) -> void:
	for i in range(bullets.size() - 1, -1, -1):
		var b = bullets[i]
		b.pos = Vector2(b.pos) + Vector2(b.vel) * delta
		b.life = float(b.life) - delta
		var remove := false
		if bool(b.from_player):
			for e_i in range(enemies.size() - 1, -1, -1):
				var e = enemies[e_i]
				if Vector2(b.pos).distance_to(Vector2(e.pos)) < float(e.radius) + float(b.radius):
					if Vector2(player.pos).distance_to(Vector2(e.pos)) < 240.0 and float(e.attack) < 0.34:
						e.stagger = 1.25
						stats.parries += 1
						add_text("PARRY", Vector2(e.pos), Color(1.0, 0.84, 0.36))
						enemies[e_i] = e
					hit_enemy(e_i, float(b.damage), "gun")
					remove = true
					break
		else:
			if Vector2(b.pos).distance_to(Vector2(player.pos)) < PLAYER_R + float(b.radius):
				damage_player(float(b.damage), "Schuss")
				remove = true
		if float(b.life) <= 0.0 or point_outside(Vector2(b.pos)) or circle_hits_wall(Vector2(b.pos), 5.0):
			remove = true
		if remove:
			bullets.remove_at(i)
		else:
			bullets[i] = b

func hit_enemy(index: int, damage: float, source: String) -> void:
	if index < 0 or index >= enemies.size():
		return
	var e = enemies[index]
	if float(e.stagger) > 0.0 and source == "melee":
		damage *= 2.55
		stats.viscerals += 1
		add_text("VISCERAL", Vector2(e.pos), Color(1.0, 0.1, 0.16))
	if source == "trick":
		stats.trick += 1
	e.hp = float(e.hp) - damage
	spawn_sparks(Vector2(e.pos), e.color, 10)
	if float(e.hp) <= 0.0:
		var points := 170
		if String(e.kind) == "boss":
			points = 2600
			stats.bosses += 1
			player.blood = min(12, int(player.blood) + 3)
			player.bullets = min(36, int(player.bullets) + 8)
			add_text("BOSS DOWN", Vector2(player.pos), Color(1.0, 0.78, 0.34))
		elif String(e.kind) == "beast":
			points = 260
		elif String(e.kind) == "gunner":
			points = 220
		elif String(e.kind) == "bell":
			points = 360
		combo += 1
		stats.kills += 1
		score += points + combo * 24
		if combo > 7 and float(player.fever) <= 0.0:
			player.fever = 7.5
			add_text("BLUTFIEBER", Vector2(player.pos), Color(1.0, 0.16, 0.25))
		if rng.randf() < 0.24 or String(e.kind) == "bell":
			spawn_pickup(Vector2(e.pos), "blood" if rng.randf() < 0.55 else "bullet")
		add_text("+" + str(points), Vector2(e.pos), Color(1.0, 0.86, 0.28))
		spawn_sparks(Vector2(e.pos), Color(1.0, 0.18, 0.16), 18)
		enemies.remove_at(index)
	else:
		enemies[index] = e

func spawn_pickup(pos: Vector2, kind: String) -> void:
	pickups.append({"pos": pos, "kind": kind, "life": 10.0, "phase": rng.randf_range(0.0, TAU)})

func update_pickups(delta: float) -> void:
	for i in range(pickups.size() - 1, -1, -1):
		var p = pickups[i]
		p.life = float(p.life) - delta
		p.phase = float(p.phase) + delta * 3.0
		if Vector2(p.pos).distance_to(Vector2(player.pos)) < 48.0:
			if String(p.kind) == "blood":
				player.blood = min(12, int(player.blood) + 1)
				add_text("+VIAL", Vector2(player.pos), Color(0.95, 0.2, 0.24))
			else:
				player.bullets = min(36, int(player.bullets) + 4)
				add_text("+KUGELN", Vector2(player.pos), Color(0.95, 0.78, 0.42))
			pickups.remove_at(i)
		elif float(p.life) <= 0.0:
			pickups.remove_at(i)
		else:
			pickups[i] = p

func recover_rally(amount: float) -> void:
	if float(player.lost) <= 0.0 or float(player.rally) <= 0.0:
		return
	var heal: float = min(float(player.lost), amount)
	player.hp = min(MAX_HP, float(player.hp) + heal)
	player.lost = max(0.0, float(player.lost) - heal)
	stats.rally += int(heal)
	add_text("RALLY +" + str(int(heal)), Vector2(player.pos), Color(0.35, 1.0, 0.58))

func damage_player(amount: float, reason: String) -> void:
	if grace_timer > 0.0 or float(player.invuln) > 0.0:
		return
	player.hp = max(0.0, float(player.hp) - amount)
	player.lost = min(62.0, float(player.lost) + amount)
	player.rally = 4.2
	combo = 0
	shake = 1.0
	add_text(reason + " -" + str(int(amount)), Vector2(player.pos), Color(1.0, 0.22, 0.2))

func update_runes(_delta: float) -> void:
	if mode != "Learncade":
		return
	for rune in runes:
		if bool(rune.active) and Vector2(player.pos).distance_to(Vector2(rune.pos)) < 58.0:
			var task: Dictionary = rune.task
			if String(rune.label) == String(rune.answer):
				stats.learn += 1
				score += 720
				player.blood = min(12, int(player.blood) + 1)
				player.bullets = min(36, int(player.bullets) + 2)
				if bool(rune.repeat):
					remove_repeat(task)
				if int(stats.learn) == LEARN_GOAL:
					player.fever = 10.0
					add_text("LERNRAUSCH", Vector2(player.pos), Color(1.0, 0.48, 0.9))
				else:
					add_text("RICHTIG", Vector2(rune.pos), Color(0.35, 1.0, 0.52))
			else:
				stats.wrong += 1
				queue_repeat(task)
				damage_player(13.0, "Falsche Rune")
				add_text("FALSCH - kommt wieder", Vector2(rune.pos), Color(1.0, 0.22, 0.18))
			if repeat_queue.size() == 0 or not bool(task.get("repeat", false)):
				question_index = (question_index + 1) % question_bank().size()
			build_runes()
			return

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
	message = "Learncade: richtige Rune beruehren." if mode == "Learncade" else "Normalmodus aktiv."
	message_timer = 2.4
	if mode == "Learncade":
		build_runes()

func cycle_lesson() -> void:
	lesson_index = (lesson_index + 1) % LESSONS.size()
	question_index = 0
	repeat_queue.clear()
	message = "Fach: " + String(LESSONS[lesson_index])
	message_timer = 1.8
	if mode == "Learncade":
		build_runes()

func _unhandled_input(event) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		match event.keycode:
			KEY_R:
				reset_game()
			KEY_L:
				toggle_learncade()
			KEY_TAB, KEY_C:
				cycle_lesson()
			KEY_SPACE, KEY_K:
				start_dash()
			KEY_Q:
				fire_gun()
			KEY_H:
				use_vial()
			KEY_F:
				transform_weapon()
			KEY_E:
				cast_focus()

func _gui_input(event) -> void:
	if event is InputEventMouseMotion and not should_show_touch_controls():
		aim_world = screen_to_world(event.position)
	elif event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_LEFT:
			aim_world = screen_to_world(event.position)
			start_attack()
		elif event.button_index == MOUSE_BUTTON_RIGHT:
			fire_gun()
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
			touch_axis = (event.position - origin) / 78.0
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
		touch_axis = (pos - origin) / 78.0
		if touch_axis.length() > 1.0:
			touch_axis = touch_axis.normalized()

func handle_touch_action(name: String) -> void:
	if name == "atk":
		start_attack()
	elif name == "dash":
		start_dash()
	elif name == "gun":
		fire_gun()
	elif name == "focus":
		cast_focus()
	elif name == "vial":
		use_vial()
	elif name == "trick":
		transform_weapon()
	elif name == "learn":
		toggle_learncade()
	elif name == "subject":
		cycle_lesson()

func joystick_origin() -> Vector2:
	return Vector2(78, size.y - 84)

func should_show_touch_controls() -> bool:
	return size.x < 820.0 or size.y > size.x * 1.12

func add_effect(pos: Vector2, radius: float, color: Color) -> void:
	effects.append({"pos": pos, "radius": radius, "life": 0.34, "max": 0.34, "color": color})

func update_effects(delta: float) -> void:
	message_timer = max(0.0, message_timer - delta)
	shake = max(0.0, shake - delta * 7.0)
	for i in range(effects.size() - 1, -1, -1):
		var e = effects[i]
		e.life = float(e.life) - delta
		if float(e.life) <= 0.0:
			effects.remove_at(i)
		else:
			effects[i] = e
	for i in range(floaters.size() - 1, -1, -1):
		var f = floaters[i]
		f.life = float(f.life) - delta
		f.pos = Vector2(f.pos) + Vector2(0, -38) * delta
		f.color.a = clamp(float(f.life), 0.0, 1.0)
		if float(f.life) <= 0.0:
			floaters.remove_at(i)
		else:
			floaters[i] = f
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

func circle_hits_wall(pos: Vector2, radius: float) -> bool:
	for wall in graves:
		var nearest := Vector2(clamp(pos.x, wall.position.x, wall.position.x + wall.size.x), clamp(pos.y, wall.position.y, wall.position.y + wall.size.y))
		if nearest.distance_to(pos) <= radius:
			return true
	return false

func point_outside(pos: Vector2) -> bool:
	return pos.x < -50.0 or pos.y < -50.0 or pos.x > WORLD_W + 50.0 or pos.y > WORLD_H + 50.0

func world_to_screen(pos: Vector2) -> Vector2:
	var offset := Vector2.ZERO
	if shake > 0.0:
		offset = Vector2(rng.randf_range(-shake, shake), rng.randf_range(-shake, shake)) * 7.0
	return pos - camera + offset

func screen_to_world(pos: Vector2) -> Vector2:
	return pos + camera

func _draw() -> void:
	draw_background()
	draw_world()
	draw_pickups()
	draw_runes()
	draw_bullets()
	draw_enemies()
	draw_player()
	draw_effect_layer()
	draw_hud()
	draw_touch_controls()
	draw_messages()

func draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color(0.025, 0.018, 0.038))
	for i in range(28):
		var x := fmod(float(i) * 86.0 - fmod(camera.x, 86.0), size.x + 120.0) - 60.0
		draw_line(Vector2(x, 0), Vector2(x + 150, size.y), Color(0.09, 0.06, 0.12, 0.25), 1.0)
	for i in range(12):
		var y := fmod(float(i) * 122.0 - fmod(camera.y, 122.0), size.y + 130.0) - 65.0
		draw_line(Vector2(0, y), Vector2(size.x, y - 70), Color(0.08, 0.09, 0.16, 0.2), 1.0)

func draw_world() -> void:
	var rect := Rect2(world_to_screen(Vector2.ZERO), Vector2(WORLD_W, WORLD_H))
	draw_rect(rect, Color(0.045, 0.055, 0.07))
	draw_rect(rect, Color(0.45, 0.52, 0.62, 0.28), false, 4.0)
	for gate in gates:
		var gp := world_to_screen(Vector2(gate.pos))
		draw_circle(gp, 42.0, Color(0.16, 0.12, 0.25, 0.72))
		draw_arc(gp, 46.0, 0.0, TAU, 36, Color(0.78, 0.58, 1.0, 0.64), 3.0)
		draw_text_at(gp + Vector2(-35, 5), String(gate.label), Color(0.88, 0.84, 1.0), 11)
	for lamp in lamps:
		var lp := world_to_screen(lamp)
		draw_circle(lp, 96.0, Color(0.6, 0.45, 0.18, 0.08))
		draw_circle(lp, 12.0, Color(1.0, 0.75, 0.3))
		draw_line(lp + Vector2(0, 12), lp + Vector2(0, 40), Color(0.48, 0.35, 0.22), 3.0)
	for wall in graves:
		var wr := Rect2(world_to_screen(wall.position), wall.size)
		draw_rect(wr, Color(0.12, 0.16, 0.21))
		draw_rect(wr, Color(0.5, 0.62, 0.76, 0.36), false, 2.0)

func draw_pickups() -> void:
	for pickup in pickups:
		var p := world_to_screen(Vector2(pickup.pos)) + Vector2(0, sin(float(pickup.phase)) * 5.0)
		var color := Color(0.92, 0.1, 0.16) if String(pickup.kind) == "blood" else Color(0.96, 0.76, 0.28)
		draw_circle(p, 14.0, Color(color, 0.22))
		draw_regular_polygon(p, 10.0, 5, color, float(pickup.phase))

func draw_runes() -> void:
	if mode != "Learncade":
		return
	var task = current_task()
	draw_rect(Rect2(Vector2(size.x * 0.25, 14), Vector2(size.x * 0.5, 42)), Color(0.0, 0.0, 0.0, 0.58))
	draw_text_at(Vector2(size.x * 0.27, 40), String(task.prompt), Color(0.82, 0.9, 1.0), 16)
	for rune in runes:
		var p := world_to_screen(Vector2(rune.pos))
		var ring := Color(0.55, 0.72, 1.0)
		if bool(rune.repeat):
			ring = Color(1.0, 0.58, 0.95)
		draw_circle(p, 47.0, Color(0.18, 0.22, 0.55, 0.55))
		draw_arc(p, 53.0, 0.0, TAU, 36, ring, 4.0)
		draw_text_at(p + Vector2(-34, 5), String(rune.label), Color(0.95, 0.98, 1.0), 13)

func draw_bullets() -> void:
	for b in bullets:
		var p := world_to_screen(Vector2(b.pos))
		draw_circle(p, float(b.radius), b.color)
		draw_line(p - Vector2(b.vel).normalized() * 18.0, p, b.color, 2.0)

func draw_enemies() -> void:
	for e in enemies:
		var p := world_to_screen(Vector2(e.pos))
		var radius := float(e.radius)
		if float(e.stagger) > 0.0:
			draw_circle(p, radius + 13.0, Color(1.0, 0.9, 0.35, 0.35))
		if String(e.kind) == "boss":
			draw_circle(p, radius + 18.0, Color(0.25, 0.0, 0.02))
			draw_regular_polygon(p, radius, 8, e.color, float(e.phase))
			draw_arc(p, radius + 24.0, 0.0, TAU, 48, Color(1.0, 0.16, 0.26, 0.55), 3.0)
		elif String(e.kind) == "beast":
			draw_regular_polygon(p, radius, 5, e.color, float(e.phase))
		elif String(e.kind) == "gunner":
			draw_regular_polygon(p, radius, 3, e.color, float(e.phase))
			draw_line(p, p + (world_to_screen(Vector2(player.pos)) - p).normalized() * 32.0, Color(0.85, 0.75, 1.0), 3.0)
		elif String(e.kind) == "bell":
			draw_circle(p, radius, e.color)
			draw_arc(p, radius + 10.0, 0.0, TAU, 28, Color(0.95, 0.72, 1.0), 3.0)
		else:
			draw_regular_polygon(p, radius, 4, e.color, float(e.phase))
		var hp_ratio: float = clamp(float(e.hp) / float(e.max_hp), 0.0, 1.0)
		draw_rect(Rect2(p + Vector2(-28, radius + 8), Vector2(56, 5)), Color(0.08, 0.02, 0.03))
		draw_rect(Rect2(p + Vector2(-28, radius + 8), Vector2(56 * hp_ratio, 5)), Color(0.9, 0.08, 0.12))

func draw_player() -> void:
	var p := world_to_screen(Vector2(player.pos))
	var dir := get_combat_dir()
	if dir.length() < 0.1:
		dir = Vector2(player.dir)
	var side := dir.orthogonal()
	var color := Color(0.45, 0.72, 1.0) if float(player.fever) <= 0.0 else Color(1.0, 0.18, 0.24)
	draw_colored_polygon(PackedVector2Array([p + dir * 28, p - dir * 16 + side * 16, p - dir * 9, p - dir * 16 - side * 16]), color)
	if float(player.invuln) > 0.0:
		draw_arc(p, PLAYER_R + 12.0, 0.0, TAU, 30, Color(0.58, 0.86, 1.0, 0.55), 3.0)
	if float(player.attack) > 0.0:
		var reach := 88.0 if weapon_form == "cane" else 134.0
		draw_arc(p, reach, dir.angle() - 0.72, dir.angle() + 0.72, 32, Color(0.92, 0.82, 1.0, 0.76), 5.0)
	draw_circle(p, PLAYER_R + 3.0, Color(1.0, 1.0, 1.0, 0.18), false, 2.0)

func draw_effect_layer() -> void:
	for e in effects:
		var p := world_to_screen(Vector2(e.pos))
		var t: float = 1.0 - float(e.life) / float(e.max)
		draw_circle(p, float(e.radius) * t, Color(e.color, 0.24 * (1.0 - t)))
	for part in particles:
		draw_circle(world_to_screen(Vector2(part.pos)), float(part.size), part.color)

func draw_hud() -> void:
	var hud_w: float = min(390.0, size.x - 20.0)
	draw_rect(Rect2(Vector2(10, 10), Vector2(hud_w, 146)), Color(0.0, 0.0, 0.0, 0.62))
	draw_text_at(Vector2(20, 31), "FASKA NIGHT HUNT PRO", Color(0.95, 0.72, 0.92), 18)
	draw_bar(Vector2(20, 50), "HP", float(player.hp), MAX_HP, Color(0.92, 0.08, 0.16))
	if float(player.lost) > 0.0:
		draw_rect(Rect2(Vector2(101, 40), Vector2(180.0 * clamp(float(player.lost) / MAX_HP, 0.0, 1.0), 7)), Color(1.0, 0.8, 0.35, 0.65))
	draw_bar(Vector2(20, 72), "STAM", float(player.stamina), MAX_STAMINA, Color(0.38, 0.92, 0.62))
	draw_text_at(Vector2(20, 105), "Score " + str(score) + " Combo " + str(combo) + " Mode " + mode, Color(0.86, 0.92, 1.0), 13)
	draw_text_at(Vector2(20, 126), "Fach " + String(LESSONS[lesson_index]) + "  Lernen " + str(stats.learn) + "/" + str(LEARN_GOAL) + "  Wdh " + str(repeat_queue.size()), Color(0.78, 0.9, 1.0), 13)
	if size.x > 760.0 and size.y <= size.x * 1.15:
		draw_rect(Rect2(Vector2(size.x - 304, 10), Vector2(290, 112)), Color(0.0, 0.0, 0.0, 0.55))
		draw_text_at(Vector2(size.x - 292, 32), "Weapon " + weapon_form.to_upper(), Color(0.94, 0.98, 1.0), 15)
		draw_text_at(Vector2(size.x - 292, 55), "Blood " + str(player.blood) + "  Bullets " + str(player.bullets), Color(0.94, 0.98, 1.0), 14)
		draw_text_at(Vector2(size.x - 292, 78), "Wave " + str(wave) + "  Kills " + str(stats.kills), Color(0.94, 0.98, 1.0), 14)
		draw_text_at(Vector2(size.x - 292, 101), "Boss: jede 4. Welle", Color(0.95, 0.72, 0.92), 13)
	var status_pos := Vector2(size.x * 0.45, 78)
	if size.x < 760.0 or size.y > size.x * 1.15:
		status_pos = Vector2(size.x * 0.39, 172)
	elif mode == "Learncade":
		status_pos.y = 110
	if grace_timer > 0.0:
		draw_text_at(status_pos, "STARTSCHUTZ " + str(int(ceil(grace_timer))), Color(0.64, 0.9, 1.0), 18)
	elif float(player.fever) > 0.0:
		draw_text_at(status_pos, "BLUTFIEBER " + str(int(ceil(float(player.fever)))), Color(1.0, 0.28, 0.36), 18)

func draw_bar(pos: Vector2, label: String, value: float, max_value: float, color: Color) -> void:
	draw_text_at(pos, label, Color(0.76, 0.82, 0.9), 12)
	draw_rect(Rect2(pos + Vector2(80, -10), Vector2(180, 8)), Color(0.07, 0.06, 0.08))
	draw_rect(Rect2(pos + Vector2(80, -10), Vector2(180 * clamp(value / max_value, 0.0, 1.0), 8)), color)

func draw_touch_controls() -> void:
	touch_buttons.clear()
	if not should_show_touch_controls():
		return
	var origin := joystick_origin()
	draw_arc(origin, 66, 0.0, TAU, 36, Color(0.6, 0.75, 1.0, 0.3), 3.0)
	draw_circle(origin + touch_axis * 44.0, 23.0, Color(0.33, 0.62, 1.0, 0.4))
	var buttons = [
		["atk", "ATK", Vector2(size.x - 58, size.y - 172)],
		["dash", "ROLL", Vector2(size.x - 128, size.y - 132)],
		["gun", "GUN", Vector2(size.x - 58, size.y - 102)],
		["focus", "FOC", Vector2(size.x - 128, size.y - 62)],
		["trick", "TRK", Vector2(size.x - 198, size.y - 102)],
		["vial", "VIAL", Vector2(size.x - 198, size.y - 62)],
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
		var box := Rect2(Vector2(size.x * 0.31, 14), Vector2(size.x * 0.38, 30))
		if mode == "Learncade":
			box.position.y = 61
		draw_rect(box, Color(0.0, 0.0, 0.0, 0.64))
		draw_text_at(box.position + Vector2(10, 21), message, Color(0.95, 0.98, 1.0), 14)
	for f in floaters:
		draw_text_at(world_to_screen(Vector2(f.pos)), String(f.text), f.color, 16)
	if phase == "over":
		draw_rect(Rect2(Vector2(size.x * 0.25, size.y * 0.38), Vector2(size.x * 0.5, 116)), Color(0.0, 0.0, 0.0, 0.78))
		draw_text_at(Vector2(size.x * 0.38, size.y * 0.44), "HUNT FAILED", Color(1.0, 0.22, 0.26), 28)
		draw_text_at(Vector2(size.x * 0.35, size.y * 0.49), "Score " + str(score) + " - R fuer Neustart", Color(0.9, 0.96, 1.0), 16)

func spawn_sparks(pos: Vector2, color: Color, count := 9) -> void:
	for i in range(count):
		particles.append({"pos": pos, "vel": Vector2(rng.randf_range(-145, 145), rng.randf_range(-145, 145)), "life": rng.randf_range(0.24, 0.72), "size": rng.randf_range(2.0, 5.0), "color": color})

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
