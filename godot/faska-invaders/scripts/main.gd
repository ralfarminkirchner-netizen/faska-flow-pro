extends Control

const VIEW_W := 1280.0
const VIEW_H := 720.0
const PLAYER_Y := 642.0
const PLAYER_SPEED := 430.0
const MAX_HP := 120.0
const MAX_HEAT := 100.0
const MAX_OVERDRIVE := 100.0
const LEARN_GOAL := 12
const MISSION_TIME := 38.0

const LESSONS = ["WORTART", "LESEN", "SATZ", "KOMPOSITUM", "MATHE", "ENGLISCH", "SACHKUNDE"]

const MISSION_BANK = [
	{"id": "combo", "title": "Feuerkette", "goal": 12, "reward": 900, "brief": "Halte eine Trefferkette."},
	{"id": "charge", "title": "Charge-Beam", "goal": 3, "reward": 820, "brief": "Zerstoere Ziele mit geladenem Beam."},
	{"id": "elite", "title": "Elite-Jagd", "goal": 2, "reward": 980, "brief": "Schalte gelbe Elite-Invader aus."},
	{"id": "barrier", "title": "Schildwall", "goal": 7, "reward": 760, "brief": "Lass Deckungen Treffer abfangen."},
	{"id": "dash", "title": "Ausweichflug", "goal": 4, "reward": 720, "brief": "Nutze Dashs ohne den Druck zu verlieren."},
	{"id": "overdrive", "title": "Overdrive-Raid", "goal": 1, "reward": 1040, "brief": "Zuendele eine volle Overdrive-Phase."},
	{"id": "boss", "title": "Mutterschiff", "goal": 1, "reward": 1500, "brief": "Zerstoere den Boss dieser Welle."},
	{"id": "learn", "title": "Antwort-Fokus", "goal": 3, "reward": 1100, "brief": "Triff richtige Lern-Antwortziele."}
]

const INVADER_TYPES = {
	"scout": {"hp": 1.0, "points": 90, "color": "#22d3ee", "radius": 18.0, "fire": 1.0},
	"crab": {"hp": 2.0, "points": 150, "color": "#fb923c", "radius": 22.0, "fire": 1.15},
	"manta": {"hp": 3.0, "points": 240, "color": "#a78bfa", "radius": 25.0, "fire": 1.35},
	"hunter": {"hp": 3.0, "points": 320, "color": "#f43f5e", "radius": 24.0, "fire": 1.55},
	"sentinel": {"hp": 4.0, "points": 420, "color": "#facc15", "radius": 28.0, "fire": 1.8}
}

const TASKS_WORD = [
	{"prompt": "Welche Wortart ist 'rennt'?", "answer": "Verb", "options": ["Verb", "Nomen", "Adjektiv", "Artikel"]},
	{"prompt": "Welche Wortart ist 'Schluessel'?", "answer": "Nomen", "options": ["Verb", "Nomen", "Adjektiv", "Praeposition"]},
	{"prompt": "Welche Wortart ist 'schnell'?", "answer": "Adjektiv", "options": ["Adjektiv", "Nomen", "Artikel", "Verb"]},
	{"prompt": "Welche Wortart ist 'unter'?", "answer": "Praeposition", "options": ["Nomen", "Verb", "Praeposition", "Zahl"]},
	{"prompt": "Welche Wortart ist 'wir'?", "answer": "Pronomen", "options": ["Artikel", "Pronomen", "Nomen", "Adverb"]},
	{"prompt": "Welche Wortart ist 'heute'?", "answer": "Adverb", "options": ["Adverb", "Verb", "Nomen", "Artikel"]},
	{"prompt": "Welche Wortart ist 'weil'?", "answer": "Konjunktion", "options": ["Adjektiv", "Konjunktion", "Verb", "Nomen"]}
]

const TASKS_READING = [
	{"prompt": "Lies genau: Schiesse auf den Stern.", "answer": "Stern", "options": ["Stein", "Stern", "Stuhl", "Sturm"]},
	{"prompt": "Welches Wort reimt sich auf Haus?", "answer": "Maus", "options": ["Maus", "Hut", "See", "Tor"]},
	{"prompt": "Welches Wort beginnt wie Schule?", "answer": "Schiff", "options": ["Fisch", "Schiff", "Rose", "Lampe"]},
	{"prompt": "Welches Wort hat drei Silben?", "answer": "Rakete", "options": ["Tor", "Rakete", "Mond", "Stern"]},
	{"prompt": "Was bedeutet 'Bibliothek'?", "answer": "Ort fuer Buecher", "options": ["Ort fuer Buecher", "Tier", "Farbe", "Zahl"]},
	{"prompt": "Welche Anweisung passt: Bleib links.", "answer": "links", "options": ["rechts", "oben", "links", "unten"]},
	{"prompt": "Welches Wort ist am laengsten?", "answer": "Sternenwarte", "options": ["Tor", "Sternenwarte", "Raum", "Licht"]}
]

const TASKS_SENTENCE = [
	{"prompt": "Was ist das Subjekt? Mila liest ein Buch.", "answer": "Mila", "options": ["Mila", "liest", "ein Buch", "heute"]},
	{"prompt": "Was ist das Praedikat? Der Pilot startet.", "answer": "startet", "options": ["Der Pilot", "startet", "leise", "Raum"]},
	{"prompt": "Was fehlt? Das Schiff ___ schnell.", "answer": "fliegt", "options": ["fliegt", "blau", "unter", "der"]},
	{"prompt": "Welcher Satz ist richtig?", "answer": "Luna sieht den Stern.", "options": ["Sieht Luna Stern den.", "Luna sieht den Stern.", "Den sieht Luna Stern.", "Stern den Luna sieht."]},
	{"prompt": "Welches Satzzeichen passt? Wo ist der Mond", "answer": "?", "options": [".", "?", ",", "!"]},
	{"prompt": "Was ist das Objekt? Roni findet den Code.", "answer": "den Code", "options": ["Roni", "findet", "den Code", "heute"]},
	{"prompt": "Welche Stelle nennt die Zeit? Nachts leuchtet die Stadt.", "answer": "Nachts", "options": ["Nachts", "leuchtet", "die Stadt", "hell"]}
]

const TASKS_COMPOUND = [
	{"prompt": "Welche Teile hat Sternwarte?", "answer": "Stern + Warte", "options": ["Stern + Warte", "Stern + Karte", "Stein + Warte", "Warte + Stern"]},
	{"prompt": "Bilde Raum + Schiff.", "answer": "Raumschiff", "options": ["Schiffraum", "Raumschiff", "Raumschaf", "Raumheit"]},
	{"prompt": "Was ist das Grundwort von Laserstrahl?", "answer": "Strahl", "options": ["Laser", "Strahl", "lasern", "hell"]},
	{"prompt": "Welches Wort ist kein Kompositum?", "answer": "schnell", "options": ["Sternentor", "Raketenstart", "schnell", "Mondlicht"]},
	{"prompt": "Welche Verbindung passt?", "answer": "Schutzschild", "options": ["Schutzschild", "Schildschutz", "schutzig", "Schildung"]},
	{"prompt": "Welche Teile hat Antwortziel?", "answer": "Antwort + Ziel", "options": ["Antwort + Ziel", "Ziel + Antwort", "Ant + Wort", "Auto + Ziel"]},
	{"prompt": "Was entsteht aus Licht + Punkt?", "answer": "Lichtpunkt", "options": ["Punktlicht", "Lichtpunkt", "Lichtpuppe", "Punktung"]}
]

const TASKS_MATH = [
	{"prompt": "6 x 7 = ?", "answer": "42", "options": ["36", "42", "48", "56"]},
	{"prompt": "84 - 29 = ?", "answer": "55", "options": ["45", "55", "56", "65"]},
	{"prompt": "9 x 8 = ?", "answer": "72", "options": ["64", "72", "81", "78"]},
	{"prompt": "144 : 12 = ?", "answer": "12", "options": ["9", "10", "12", "14"]},
	{"prompt": "Welche Zahl ist gerade?", "answer": "38", "options": ["31", "37", "38", "45"]},
	{"prompt": "Welche Zahl fehlt? ? + 18 = 63", "answer": "45", "options": ["35", "45", "55", "81"]},
	{"prompt": "Was ist groesser als 3/4?", "answer": "5/6", "options": ["1/2", "2/3", "5/6", "3/5"]}
]

const TASKS_ENGLISH = [
	{"prompt": "Was bedeutet 'shield'?", "answer": "Schild", "options": ["Stern", "Schiff", "Schild", "Schule"]},
	{"prompt": "Was bedeutet 'thunder'?", "answer": "Donner", "options": ["Wasser", "Donner", "Fenster", "Kette"]},
	{"prompt": "Was bedeutet 'star'?", "answer": "Stern", "options": ["Stein", "Stadt", "Stern", "Start"]},
	{"prompt": "Was bedeutet 'target'?", "answer": "Ziel", "options": ["Zeit", "Ziel", "Zahl", "Zeile"]},
	{"prompt": "Was bedeutet 'fast'?", "answer": "schnell", "options": ["schnell", "fest", "laut", "klein"]},
	{"prompt": "Was bedeutet 'answer'?", "answer": "Antwort", "options": ["Antwort", "Anker", "Angriff", "Ampel"]},
	{"prompt": "Was bedeutet 'wave'?", "answer": "Welle", "options": ["Welle", "Wald", "Wand", "Wort"]}
]

const TASKS_SCIENCE = [
	{"prompt": "Wozu gehoert Sauerstoff?", "answer": "Gas", "options": ["Gas", "Metall", "Planet", "Geraeusch"]},
	{"prompt": "Was braucht Feuer?", "answer": "Sauerstoff", "options": ["Sauerstoff", "Schnee", "Stein", "Salz"]},
	{"prompt": "Was zieht Dinge zur Erde?", "answer": "Schwerkraft", "options": ["Schwerkraft", "Magie", "Laerm", "Farbe"]},
	{"prompt": "Was ist eine Lichtquelle?", "answer": "Sonne", "options": ["Sonne", "Schatten", "Stein", "Wasser"]},
	{"prompt": "Welche Richtung zeigt ein Kompass?", "answer": "Norden", "options": ["Norden", "unten", "laut", "rund"]},
	{"prompt": "Was schuetzt Augen vor zu viel Licht?", "answer": "Sonnenbrille", "options": ["Sonnenbrille", "Schuh", "Lineal", "Topf"]},
	{"prompt": "Was misst ein Thermometer?", "answer": "Temperatur", "options": ["Temperatur", "Gewicht", "Tempo", "Laenge"]}
]

var font
var rng := RandomNumberGenerator.new()
var stars := []
var player := {}
var invaders := []
var boss := {}
var player_shots := []
var enemy_shots := []
var barriers := []
var pickups := []
var particles := []
var floaters := []
var mode := "Normal"
var phase := "run"
var wave := 0
var score := 0
var combo := 0
var combo_timer := 0.0
var max_combo := 0
var mission := {}
var mission_progress := 0
var mission_timer := 0.0
var mission_index := -1
var mission_cooldown := 0.0
var mission_medals := 0
var charged_kills := 0
var elite_kills := 0
var barrier_saves := 0
var dive_timer := 3.2
var direction := 1.0
var formation := Vector2.ZERO
var formation_speed := 44.0
var enemy_fire_timer := 1.5
var lesson_index := 0
var question_index := 0
var learn_correct := 0
var learn_streak := 0
var repeat_queue: Array = []
var active_task := {}
var message := ""
var message_timer := 0.0
var shake := 0.0
var elapsed := 0.0
var touch_axis := 0.0
var touch_pointer := -1
var touch_buttons := {}
var touch_button_state := {}
var touch_edges := {}
var key_memory := {}

func _ready() -> void:
	rng.seed = 823441
	font = get_theme_default_font()
	mouse_filter = Control.MOUSE_FILTER_PASS
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	build_stars()
	reset_game()

func build_stars() -> void:
	stars.clear()
	for i in range(145):
		stars.append({
			"x": rng.randf_range(0.0, VIEW_W),
			"y": rng.randf_range(0.0, VIEW_H),
			"speed": rng.randf_range(16.0, 88.0),
			"size": rng.randf_range(1.0, 3.2),
			"alpha": rng.randf_range(0.25, 0.9)
		})

func reset_game() -> void:
	player = {
		"x": VIEW_W * 0.5,
		"hp": MAX_HP,
		"heat": 0.0,
		"overdrive": 0.0,
		"dash": 0.0,
		"fire_cd": 0.0,
		"charge": 0.0,
		"charge_down": false,
		"invuln": 0.0,
		"drone": 0.0,
		"wide": 0.0,
		"shield": 0.0
	}
	invaders.clear()
	boss.clear()
	player_shots.clear()
	enemy_shots.clear()
	pickups.clear()
	particles.clear()
	floaters.clear()
	key_memory.clear()
	touch_buttons.clear()
	touch_button_state.clear()
	touch_edges.clear()
	touch_axis = 0.0
	touch_pointer = -1
	mode = "Normal"
	phase = "run"
	wave = 0
	score = 0
	combo = 0
	combo_timer = 0.0
	max_combo = 0
	mission.clear()
	mission_progress = 0
	mission_timer = 0.0
	mission_index = -1
	mission_cooldown = 0.4
	mission_medals = 0
	charged_kills = 0
	elite_kills = 0
	barrier_saves = 0
	dive_timer = 3.2
	direction = 1.0
	formation = Vector2.ZERO
	formation_speed = 44.0
	enemy_fire_timer = 1.2
	lesson_index = 0
	question_index = 0
	learn_correct = 0
	learn_streak = 0
	repeat_queue.clear()
	active_task.clear()
	build_barriers()
	spawn_wave()
	message = "FASKA INVADERS PRO"
	message_timer = 2.0
	shake = 0.0

func build_barriers() -> void:
	barriers.clear()
	for b in range(4):
		var cells := []
		var origin_x := 205.0 + float(b) * 290.0
		for row in range(3):
			for col in range(7):
				if row == 2 and (col == 0 or col == 6):
					continue
				cells.append({
					"rect": Rect2(origin_x + float(col) * 22.0 - 66.0, 536.0 + float(row) * 18.0, 20.0, 16.0),
					"hp": 3.0,
					"max_hp": 3.0
				})
		barriers.append({"cells": cells, "repair": 0.0})

func _process(delta: float) -> void:
	elapsed += delta
	if key_once(KEY_R):
		reset_game()
	if phase == "run":
		update_game(delta)
	else:
		if key_once(KEY_ENTER) or key_once(KEY_SPACE) or consume_touch_edge("fire"):
			reset_game()
	update_timers(delta)
	queue_redraw()

func update_game(delta: float) -> void:
	if key_once(KEY_L) or consume_touch_edge("learn"):
		toggle_mode()
	if key_once(KEY_C) or consume_touch_edge("subject"):
		cycle_subject()
	update_player(delta)
	update_stars(delta)
	update_invaders(delta)
	update_boss(delta)
	update_shots(delta)
	update_pickups(delta)
	update_particles(delta)
	update_floaters(delta)
	if invaders.size() == 0 and boss.size() == 0:
		spawn_wave()
	if player.hp <= 0.0:
		phase = "over"
		message = "Basis verloren - Enter oder Touch startet neu"
		message_timer = 99.0

func update_timers(delta: float) -> void:
	message_timer = maxf(0.0, message_timer - delta)
	shake = maxf(0.0, shake - delta)
	combo_timer = maxf(0.0, combo_timer - delta)
	if combo_timer <= 0.0:
		combo = 0
	if phase == "run":
		if mission.size() > 0:
			mission_timer = maxf(0.0, mission_timer - delta)
			if mission_timer <= 0.0:
				fail_mission()
		else:
			mission_cooldown = maxf(0.0, mission_cooldown - delta)
			if mission_cooldown <= 0.0 and wave > 0:
				start_next_mission()

func update_player(delta: float) -> void:
	var axis := read_axis()
	var speed := PLAYER_SPEED
	player.dash = maxf(0.0, float(player.dash) - delta)
	player.fire_cd = maxf(0.0, float(player.fire_cd) - delta)
	player.invuln = maxf(0.0, float(player.invuln) - delta)
	player.drone = maxf(0.0, float(player.drone) - delta)
	player.wide = maxf(0.0, float(player.wide) - delta)
	player.shield = maxf(0.0, float(player.shield) - delta)
	if float(player.dash) > 0.0:
		speed = 870.0
	player.x = clampf(float(player.x) + axis * speed * delta, 54.0, VIEW_W - 54.0)
	player.heat = maxf(0.0, float(player.heat) - (32.0 + (28.0 if float(player.overdrive) > 0.0 else 0.0)) * delta)
	player.overdrive = maxf(0.0, float(player.overdrive) - 18.0 * delta)
	if (key_once(KEY_SPACE) or consume_touch_edge("dash")) and float(player.dash) <= 0.0 and float(player.heat) < 86.0:
		player.dash = 0.22
		player.invuln = 0.28
		player.heat += 14.0
		spawn_particles(Vector2(float(player.x), PLAYER_Y + 10.0), Color.html("#67e8f9"), 14, 190.0)
		advance_mission("dash", 1, Vector2(float(player.x), PLAYER_Y))
	if (key_once(KEY_I) or consume_touch_edge("overdrive")) and float(player.overdrive) >= MAX_OVERDRIVE:
		player.overdrive = 7.0
		player.heat = 0.0
		add_floater(Vector2(float(player.x), PLAYER_Y - 72.0), "OVERDRIVE", Color.html("#facc15"))
		spawn_particles(Vector2(float(player.x), PLAYER_Y - 20.0), Color.html("#facc15"), 32, 320.0)
		advance_mission("overdrive", 1, Vector2(float(player.x), PLAYER_Y - 72.0))
	if key_once(KEY_J) or consume_touch_edge("fire"):
		fire_player_shot(1.0, false)
	var charge_now := Input.is_key_pressed(KEY_K) or bool(touch_button_state.get("charge", false))
	if charge_now:
		player.charge = minf(1.35, float(player.charge) + delta)
		player.heat = minf(MAX_HEAT + 10.0, float(player.heat) + 10.0 * delta)
	elif bool(player.charge_down):
		fire_player_shot(clampf(float(player.charge), 0.2, 1.35), true)
		player.charge = 0.0
	player.charge_down = charge_now

func read_axis() -> float:
	var axis := 0.0
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		axis -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		axis += 1.0
	axis += touch_axis
	return clampf(axis, -1.0, 1.0)

func fire_player_shot(power: float, charged: bool) -> void:
	if float(player.fire_cd) > 0.0:
		return
	var heat_cost := 8.0 if not charged else 18.0 + power * 18.0
	if float(player.heat) + heat_cost > MAX_HEAT + (20.0 if float(player.overdrive) > 0.0 else 0.0):
		add_floater(Vector2(float(player.x), PLAYER_Y - 72.0), "HEAT", Color.html("#fecaca"))
		return
	player.heat += heat_cost
	player.fire_cd = 0.16 if float(player.overdrive) > 0.0 else (0.22 if not charged else 0.46)
	var damage := 1.0 if not charged else 2.0 + power * 2.2
	var speed := -690.0 if not charged else -820.0
	var radius := 5.0 if not charged else 8.0 + power * 5.0
	var color := "#67e8f9" if not charged else "#facc15"
	player_shots.append({"pos": Vector2(float(player.x), PLAYER_Y - 36.0), "vel": Vector2(0, speed), "damage": damage, "radius": radius, "color": color, "charged": charged, "life": 1.8})
	if charged:
		score += 8
	if float(player.wide) > 0.0 and not charged:
		player_shots.append({"pos": Vector2(float(player.x) - 22.0, PLAYER_Y - 32.0), "vel": Vector2(-70.0, speed), "damage": 0.8, "radius": radius, "color": color, "charged": false, "life": 1.8})
		player_shots.append({"pos": Vector2(float(player.x) + 22.0, PLAYER_Y - 32.0), "vel": Vector2(70.0, speed), "damage": 0.8, "radius": radius, "color": color, "charged": false, "life": 1.8})
	if float(player.drone) > 0.0:
		player_shots.append({"pos": Vector2(float(player.x) - 46.0, PLAYER_Y - 18.0), "vel": Vector2(0, -620.0), "damage": 0.7, "radius": 4.0, "color": "#bbf7d0", "charged": false, "life": 1.5})
		player_shots.append({"pos": Vector2(float(player.x) + 46.0, PLAYER_Y - 18.0), "vel": Vector2(0, -620.0), "damage": 0.7, "radius": 4.0, "color": "#bbf7d0", "charged": false, "life": 1.5})
	spawn_particles(Vector2(float(player.x), PLAYER_Y - 36.0), Color.html(color), 5 if not charged else 11, 90.0)

func update_stars(delta: float) -> void:
	for star in stars:
		star.y += float(star.speed) * delta
		if float(star.y) > VIEW_H:
			star.y = 0.0
			star.x = rng.randf_range(0.0, VIEW_W)

func update_invaders(delta: float) -> void:
	if invaders.size() == 0:
		return
	var left := VIEW_W
	var right := 0.0
	for invader in invaders:
		left = minf(left, float(invader.base.x + formation.x))
		right = maxf(right, float(invader.base.x + formation.x))
	if right > VIEW_W - 52.0 and direction > 0.0:
		direction = -1.0
		formation.y += 22.0
	elif left < 52.0 and direction < 0.0:
		direction = 1.0
		formation.y += 22.0
	formation.x += direction * formation_speed * delta
	formation_speed = minf(142.0, 42.0 + float(wave) * 7.0 + float(45 - invaders.size()) * 1.15)
	enemy_fire_timer -= delta
	dive_timer -= delta
	if dive_timer <= 0.0:
		start_enemy_dive()
	for invader in invaders:
		invader.hit = maxf(0.0, float(invader.hit) - delta)
		if bool(invader.get("dive", false)):
			update_diving_invader(invader, delta)
		else:
			var wobble := sin(elapsed * 2.4 + float(invader.phase)) * 7.0
			invader.pos = Vector2(float(invader.base.x) + formation.x + wobble, float(invader.base.y) + formation.y)
		if float(invader.pos.y) > PLAYER_Y - 76.0:
			player.hp = 0.0
	if enemy_fire_timer <= 0.0:
		fire_enemy_wave()
		enemy_fire_timer = rng.randf_range(0.52, 1.25) / maxf(1.0, 0.8 + float(wave) * 0.08)

func start_enemy_dive() -> void:
	dive_timer = rng.randf_range(2.5, 4.6) / maxf(1.0, 0.82 + float(wave) * 0.045)
	if wave < 2 or invaders.size() <= 5:
		return
	var candidates := []
	for invader in invaders:
		if bool(invader.get("dive", false)):
			continue
		if float(invader.pos.y) < PLAYER_Y - 155.0 and (bool(invader.elite) or str(invader.type) in ["hunter", "manta", "sentinel"]):
			candidates.append(invader)
	if candidates.size() == 0:
		for invader in invaders:
			if not bool(invader.get("dive", false)) and float(invader.pos.y) < PLAYER_Y - 180.0:
				candidates.append(invader)
	if candidates.size() == 0:
		return
	var invader: Dictionary = candidates[rng.randi_range(0, candidates.size() - 1)]
	invader.dive = true
	invader.dive_t = 0.0
	invader.dive_origin = Vector2(invader.pos)
	invader.dive_target_x = clampf(float(player.x) + rng.randf_range(-54.0, 54.0), 62.0, VIEW_W - 62.0)
	invader.dive_amp = rng.randf_range(-72.0, 72.0)
	invader.dive_speed = rng.randf_range(0.72, 0.94) + minf(0.24, float(wave) * 0.018)
	add_floater(Vector2(invader.pos), "DIVE", Color.html("#fef08a"))

func update_diving_invader(invader: Dictionary, delta: float) -> void:
	var t := minf(1.12, float(invader.dive_t) + delta * float(invader.dive_speed))
	invader.dive_t = t
	var origin: Vector2 = invader.dive_origin
	var target_x := float(invader.dive_target_x)
	var arc := sin(t * PI)
	invader.pos = Vector2(
		lerpf(origin.x, target_x, minf(1.0, t)) + sin(t * TAU) * float(invader.dive_amp),
		lerpf(origin.y, PLAYER_Y - 92.0, minf(1.0, t)) - arc * 42.0
	)
	if Vector2(invader.pos).distance_to(Vector2(float(player.x), PLAYER_Y)) < float(invader.radius) + 29.0:
		invader.dive = false
		if float(player.invuln) > 0.0:
			return
		shake = 0.22
		combo = 0
		player.invuln = 0.58
		player.hp -= 16.0 + float(wave) * 1.2
		spawn_particles(Vector2(invader.pos), Color.html("#fecaca"), 16, 180.0)
	if t >= 1.0:
		invader.dive = false

func fire_enemy_wave() -> void:
	if invaders.size() == 0:
		return
	var candidates := []
	for invader in invaders:
		var blocked := false
		for other in invaders:
			if other == invader:
				continue
			if absf(float(other.pos.x - invader.pos.x)) < 28.0 and float(other.pos.y) > float(invader.pos.y):
				blocked = true
				break
		if not blocked:
			candidates.append(invader)
	if candidates.size() == 0:
		candidates = invaders
	var shooter: Dictionary = candidates[rng.randi_range(0, candidates.size() - 1)]
	var aim := (Vector2(float(player.x), PLAYER_Y) - Vector2(shooter.pos)).normalized()
	enemy_shots.append({"pos": Vector2(shooter.pos) + Vector2(0, 20), "vel": aim * rng.randf_range(180.0, 255.0), "damage": 10.0 + float(wave), "radius": 6.0, "life": 4.0, "color": shooter.color})

func update_boss(delta: float) -> void:
	if boss.size() == 0:
		return
	boss.hit = maxf(0.0, float(boss.hit) - delta)
	boss.x += float(boss.vx) * delta
	if float(boss.x) < 150.0 or float(boss.x) > VIEW_W - 150.0:
		boss.vx = -float(boss.vx)
	boss.fire -= delta
	boss.laser -= delta
	if float(boss.fire) <= 0.0:
		for angle in [-0.18, 0.0, 0.18]:
			var dir := Vector2(sin(angle), 1.0).normalized()
			enemy_shots.append({"pos": Vector2(float(boss.x), float(boss.y) + 56.0), "vel": dir * 280.0, "damage": 14.0 + float(wave), "radius": 8.0, "life": 4.0, "color": "#f0abfc"})
		boss.fire = 0.82
	if float(boss.laser) <= 0.0:
		var dir2 := (Vector2(float(player.x), PLAYER_Y) - Vector2(float(boss.x), float(boss.y))).normalized()
		enemy_shots.append({"pos": Vector2(float(boss.x), float(boss.y) + 64.0), "vel": dir2 * 370.0, "damage": 24.0, "radius": 13.0, "life": 3.3, "color": "#facc15"})
		boss.laser = 2.9

func update_shots(delta: float) -> void:
	for shot in player_shots:
		shot.life -= delta
		shot.pos += Vector2(shot.vel) * delta
		check_player_shot(shot)
	for shot in enemy_shots:
		shot.life -= delta
		shot.pos += Vector2(shot.vel) * delta
		check_enemy_shot(shot)
	player_shots = player_shots.filter(func(s): return float(s.life) > 0.0 and float(s.pos.y) > -40.0 and float(s.pos.y) < VIEW_H + 40.0)
	enemy_shots = enemy_shots.filter(func(s): return float(s.life) > 0.0 and float(s.pos.y) > -50.0 and float(s.pos.y) < VIEW_H + 60.0)

func check_player_shot(shot: Dictionary) -> void:
	if float(shot.life) <= 0.0:
		return
	for barrier in barriers:
		for cell in barrier.cells:
			if float(cell.hp) > 0.0 and Rect2(cell.rect).grow(float(shot.radius)).has_point(Vector2(shot.pos)):
				cell.hp -= float(shot.damage) * 0.9
				shot.life = 0.0
				spawn_particles(Vector2(shot.pos), Color.html("#93c5fd"), 5, 80.0)
				return
	if boss.size() > 0 and Vector2(shot.pos).distance_to(Vector2(float(boss.x), float(boss.y))) < 72.0 + float(shot.radius):
		boss.hp -= float(shot.damage)
		boss.hit = 0.18
		shot.life = 0.0
		add_combo(1)
		player.overdrive = minf(MAX_OVERDRIVE, float(player.overdrive) + 3.0)
		spawn_particles(Vector2(shot.pos), Color.html("#f0abfc"), 9, 140.0)
		if float(boss.hp) <= 0.0:
			score += 2400 + wave * 80
			add_floater(Vector2(float(boss.x), float(boss.y)), "BOSS +" + str(2400 + wave * 80), Color.html("#facc15"))
			if bool(shot.charged):
				advance_mission("charge", 1, Vector2(float(boss.x), float(boss.y)))
			advance_mission("boss", 1, Vector2(float(boss.x), float(boss.y)))
			spawn_pickup(Vector2(float(boss.x), float(boss.y)), "overdrive")
			spawn_particles(Vector2(float(boss.x), float(boss.y)), Color.html("#facc15"), 42, 350.0)
			boss.clear()
		return
	for invader in invaders:
		if Vector2(shot.pos).distance_to(Vector2(invader.pos)) < float(invader.radius) + float(shot.radius):
			invader.hp -= float(shot.damage)
			invader.hit = 0.16
			invader.last_hit_charged = bool(shot.charged)
			shot.life = 0.0
			spawn_particles(Vector2(shot.pos), Color.html(str(invader.color)), 8, 120.0)
			if float(invader.hp) <= 0.0:
				defeat_invader(invader)
			return

func check_enemy_shot(shot: Dictionary) -> void:
	if float(shot.life) <= 0.0:
		return
	for barrier in barriers:
		for cell in barrier.cells:
			if float(cell.hp) > 0.0 and Rect2(cell.rect).grow(float(shot.radius)).has_point(Vector2(shot.pos)):
				cell.hp -= 1.0
				shot.life = 0.0
				barrier_saves += 1
				var hit_rect := Rect2(cell.rect)
				advance_mission("barrier", 1, hit_rect.position + hit_rect.size * 0.5)
				spawn_particles(Vector2(shot.pos), Color.html("#fde68a"), 5, 80.0)
				return
	if Vector2(shot.pos).distance_to(Vector2(float(player.x), PLAYER_Y)) < 30.0 + float(shot.radius):
		shot.life = 0.0
		if float(player.invuln) > 0.0:
			return
		var damage := float(shot.damage)
		if float(player.shield) > 0.0:
			damage *= 0.35
		player.hp -= damage
		player.invuln = 0.55
		shake = 0.18
		combo = 0
		spawn_particles(Vector2(float(player.x), PLAYER_Y), Color.html("#fecaca"), 14, 180.0)

func defeat_invader(invader: Dictionary) -> void:
	var points := int(invader.points)
	score += points + combo * 8
	add_combo(1)
	player.overdrive = minf(MAX_OVERDRIVE, float(player.overdrive) + 4.0)
	add_floater(Vector2(invader.pos), "+" + str(points), Color.html("#bbf7d0"))
	if bool(invader.elite):
		elite_kills += 1
		advance_mission("elite", 1, Vector2(invader.pos))
	if bool(invader.get("last_hit_charged", false)):
		charged_kills += 1
		advance_mission("charge", 1, Vector2(invader.pos))
	if mode == "Lernen" and str(invader.label) != "":
		resolve_answer_invader(invader)
	if rng.randf() < 0.12 or bool(invader.elite):
		var kind := "wide"
		var roll := rng.randf()
		if roll < 0.25:
			kind = "heal"
		elif roll < 0.48:
			kind = "drone"
		elif roll < 0.72:
			kind = "shield"
		spawn_pickup(Vector2(invader.pos), kind)
	spawn_particles(Vector2(invader.pos), Color.html(str(invader.color)), 15, 210.0)
	invaders.erase(invader)
	if mode == "Lernen":
		ensure_learn_targets()

func add_combo(amount: int) -> void:
	combo += amount
	max_combo = maxi(max_combo, combo)
	combo_timer = 2.0
	if mission.size() > 0 and str(mission.get("id", "")) == "combo" and combo >= int(mission.get("goal", 1)):
		advance_mission("combo", int(mission.get("goal", 1)) - mission_progress, Vector2(float(player.x), PLAYER_Y - 90.0))
	if combo % 8 == 0:
		add_floater(Vector2(float(player.x), PLAYER_Y - 90.0), str(combo) + " COMBO", Color.html("#facc15"))

func start_next_mission() -> void:
	var candidates := []
	var has_elites := false
	for invader in invaders:
		if bool(invader.elite):
			has_elites = true
			break
	for template in MISSION_BANK:
		var id := str(template.id)
		if id == "learn" and mode != "Lernen":
			continue
		if id == "boss" and boss.size() == 0:
			continue
		if id == "elite" and not has_elites:
			continue
		candidates.append(template)
	if candidates.size() == 0:
		mission.clear()
		mission_cooldown = 2.0
		return
	mission_index += 1
	mission = Dictionary(candidates[mission_index % candidates.size()]).duplicate(true)
	mission_progress = 0
	mission_timer = MISSION_TIME + minf(16.0, float(wave) * 1.35)
	message = "Mission: " + str(mission.title)
	message_timer = 1.35

func advance_mission(id: String, amount: int = 1, pos: Vector2 = Vector2.ZERO) -> void:
	if mission.size() == 0 or str(mission.get("id", "")) != id:
		return
	mission_progress = mini(int(mission.get("goal", 1)), mission_progress + maxi(1, amount))
	if mission_progress >= int(mission.get("goal", 1)):
		complete_mission(pos)

func complete_mission(pos: Vector2) -> void:
	if mission.size() == 0:
		return
	var reward := int(mission.get("reward", 500)) + wave * 45 + max_combo * 6
	var title := str(mission.get("title", "Mission"))
	score += reward
	mission_medals += 1
	player.overdrive = minf(MAX_OVERDRIVE, float(player.overdrive) + 18.0)
	repair_barriers(0.8 + float(mission_medals % 3) * 0.4)
	add_floater(pos, "MISSION +" + str(reward), Color.html("#facc15"))
	if mission_medals % 3 == 0:
		spawn_pickup(Vector2(float(player.x), PLAYER_Y - 210.0), "overdrive")
	elif mission_medals % 2 == 0:
		spawn_pickup(Vector2(float(player.x), PLAYER_Y - 210.0), "shield")
	message = title + " geschafft"
	message_timer = 1.7
	mission.clear()
	mission_progress = 0
	mission_timer = 0.0
	mission_cooldown = 2.0

func fail_mission() -> void:
	if mission.size() == 0:
		return
	var title := str(mission.get("title", "Mission"))
	score = maxi(0, score - 160)
	message = title + " verpasst"
	message_timer = 1.4
	mission.clear()
	mission_progress = 0
	mission_timer = 0.0
	mission_cooldown = 1.35

func repair_barriers(amount: float) -> void:
	for barrier in barriers:
		for cell in barrier.cells:
			if float(cell.hp) <= 0.0 and mission_medals % 2 == 0:
				cell.hp = minf(float(cell.max_hp), amount)
			elif float(cell.hp) > 0.0:
				cell.hp = minf(float(cell.max_hp), float(cell.hp) + amount)

func spawn_pickup(pos: Vector2, kind: String) -> void:
	pickups.append({"pos": pos, "kind": kind, "life": 10.0, "bob": rng.randf() * TAU})

func update_pickups(delta: float) -> void:
	for pickup in pickups:
		pickup.life -= delta
		pickup.bob += delta * 5.0
		pickup.pos += Vector2(0, 55.0 * delta)
		if Vector2(pickup.pos).distance_to(Vector2(float(player.x), PLAYER_Y)) < 40.0:
			collect_pickup(pickup)
			pickup.life = 0.0
	pickups = pickups.filter(func(p): return float(p.life) > 0.0 and float(p.pos.y) < VIEW_H + 40.0)

func collect_pickup(pickup: Dictionary) -> void:
	var kind := str(pickup.kind)
	if kind == "heal":
		player.hp = minf(MAX_HP, float(player.hp) + 30.0)
	elif kind == "wide":
		player.wide = 12.0
	elif kind == "drone":
		player.drone = 14.0
	elif kind == "shield":
		player.shield = 12.0
	elif kind == "overdrive":
		player.overdrive = MAX_OVERDRIVE
	score += 160
	add_floater(Vector2(pickup.pos), kind.to_upper(), Color.html("#facc15"))

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

func spawn_wave() -> void:
	wave += 1
	player.heat = 0.0
	formation = Vector2.ZERO
	direction = 1.0
	if wave % 5 == 0:
		spawn_boss_wave()
	else:
		spawn_invader_wave()
	if mode == "Lernen":
		prepare_task()
		ensure_learn_targets()
	if mission.size() == 0:
		mission_cooldown = minf(mission_cooldown, 0.55)

func spawn_invader_wave() -> void:
	var cols := mini(10, 7 + wave / 2)
	var rows := mini(5, 3 + wave / 3)
	var start_x := VIEW_W * 0.5 - float(cols - 1) * 42.0
	var start_y := 104.0
	for row in range(rows):
		for col in range(cols):
			var kind := "scout"
			if row == 0 and wave >= 6:
				kind = "sentinel"
			elif row == 0 and wave >= 3:
				kind = "manta"
			elif row == 1 and wave >= 4:
				kind = "hunter"
			elif row < 2:
				kind = "crab"
			var profile: Dictionary = INVADER_TYPES[kind]
			var elite := wave >= 4 and (row + col + wave) % 7 == 0
			var hp := float(profile.hp) + float(wave / 5) + (2.0 if elite else 0.0)
			invaders.append({
				"id": str(wave) + "_" + str(row) + "_" + str(col),
				"type": kind,
				"base": Vector2(start_x + float(col) * 84.0, start_y + float(row) * 62.0),
				"pos": Vector2(start_x + float(col) * 84.0, start_y + float(row) * 62.0),
				"hp": hp,
				"max_hp": hp,
				"points": int(profile.points) + wave * 12 + (140 if elite else 0),
				"color": "#fef08a" if elite else str(profile.color),
				"radius": float(profile.radius) + (4.0 if elite else 0.0),
				"phase": rng.randf() * TAU,
				"elite": elite,
				"label": "",
				"correct": false,
				"hit": 0.0,
				"last_hit_charged": false,
				"dive": false,
				"dive_t": 0.0,
				"dive_origin": Vector2.ZERO,
				"dive_target_x": 0.0,
				"dive_amp": 0.0,
				"dive_speed": 0.0
			})
	message = "Welle " + str(wave) + " - Formation bricht an."
	message_timer = 1.35

func spawn_boss_wave() -> void:
	for i in range(8):
		var profile: Dictionary = INVADER_TYPES["hunter"]
		invaders.append({
			"id": "escort_" + str(i),
			"type": "hunter",
			"base": Vector2(260.0 + float(i) * 108.0, 210.0 + float(i % 2) * 52.0),
			"pos": Vector2(260.0 + float(i) * 108.0, 210.0 + float(i % 2) * 52.0),
			"hp": 3.0 + float(wave / 4),
			"max_hp": 3.0 + float(wave / 4),
			"points": int(profile.points) + wave * 18,
			"color": str(profile.color),
			"radius": float(profile.radius),
			"phase": rng.randf() * TAU,
			"elite": false,
			"label": "",
			"correct": false,
			"hit": 0.0,
			"last_hit_charged": false,
			"dive": false,
			"dive_t": 0.0,
			"dive_origin": Vector2.ZERO,
			"dive_target_x": 0.0,
			"dive_amp": 0.0,
			"dive_speed": 0.0
		})
	boss = {"x": VIEW_W * 0.5, "y": 116.0, "vx": 105.0 + float(wave) * 6.0, "hp": 28.0 + float(wave) * 7.0, "max_hp": 28.0 + float(wave) * 7.0, "fire": 1.1, "laser": 2.4, "hit": 0.0}
	message = "Boss-Welle " + str(wave)
	message_timer = 1.8

func toggle_mode() -> void:
	mode = "Lernen" if mode == "Normal" else "Normal"
	clear_labels()
	mission.clear()
	mission_progress = 0
	mission_timer = 0.0
	mission_cooldown = 0.35
	if mode == "Lernen":
		prepare_task()
		ensure_learn_targets()
	message = "Modus: " + mode
	message_timer = 1.1

func cycle_subject() -> void:
	lesson_index = (lesson_index + 1) % LESSONS.size()
	clear_labels()
	active_task.clear()
	if str(mission.get("id", "")) == "learn":
		mission.clear()
		mission_progress = 0
		mission_timer = 0.0
		mission_cooldown = 0.35
	if mode == "Lernen":
		prepare_task()
		ensure_learn_targets()
	message = "Fach: " + str(LESSONS[lesson_index])
	message_timer = 1.1

func clear_labels() -> void:
	for invader in invaders:
		invader.label = ""
		invader.correct = false

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

func prepare_task() -> void:
	if active_task.size() > 0:
		return
	if repeat_queue.size() > 0:
		active_task = repeat_queue.pop_front()
	else:
		var bank := get_bank()
		active_task = Dictionary(bank[question_index % bank.size()]).duplicate(true)
		question_index += 1

func ensure_learn_targets() -> void:
	if mode != "Lernen" or invaders.size() == 0:
		return
	prepare_task()
	var labeled := 0
	for invader in invaders:
		if str(invader.label) != "":
			labeled += 1
	if labeled > 0:
		return
	var options: Array = active_task.options
	var candidates := []
	for invader in invaders:
		var base: Vector2 = invader.base
		if base.y > 190.0:
			candidates.append(invader)
	if candidates.size() < options.size():
		candidates = invaders.duplicate()
	candidates.shuffle()
	for i in range(mini(options.size(), candidates.size())):
		var invader: Dictionary = candidates[i]
		invader.label = str(options[i])
		invader.correct = str(options[i]) == str(active_task.answer)

func resolve_answer_invader(invader: Dictionary) -> void:
	if bool(invader.correct):
		learn_correct += 1
		learn_streak += 1
		score += 650
		player.hp = minf(MAX_HP, float(player.hp) + 10.0)
		player.overdrive = minf(MAX_OVERDRIVE, float(player.overdrive) + 12.0)
		advance_mission("learn", 1, Vector2(invader.pos))
		add_floater(Vector2(invader.pos), "RICHTIG +650", Color.html("#bbf7d0"))
		active_task.clear()
		clear_labels()
		if learn_correct >= LEARN_GOAL:
			message = "Lernziel erreicht: " + str(LEARN_GOAL) + " Antworten"
			message_timer = 2.0
	else:
		learn_streak = 0
		repeat_queue.append(active_task.duplicate(true))
		player.hp -= 12.0
		score = maxi(0, score - 120)
		add_floater(Vector2(invader.pos), "WIEDERHOLUNG", Color.html("#fecaca"))
		active_task.clear()
		clear_labels()

func spawn_particles(pos: Vector2, color: Color, count: int, speed: float) -> void:
	for i in range(count):
		var angle := TAU * float(i) / float(count) + rng.randf_range(-0.3, 0.3)
		var burst := speed * rng.randf_range(0.35, 1.0)
		particles.append({"pos": pos, "vel": Vector2(cos(angle), sin(angle)) * burst, "life": rng.randf_range(0.25, 0.8), "color": color, "size": rng.randf_range(2.0, 6.0)})

func add_floater(pos: Vector2, text: String, color: Color) -> void:
	floaters.append({"pos": pos, "text": text, "color": color, "life": 1.0})

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
				touch_axis = 0.0
			if touch_buttons.has(event.index):
				touch_buttons.erase(event.index)
				refresh_touch_buttons()
	elif event is InputEventScreenDrag and event.index == touch_pointer:
		update_touch_axis(event.position)

func update_touch_axis(pos: Vector2) -> void:
	var center := stick_center()
	var diff := pos.x - center.x
	if absf(diff) < 16.0 * ui_scale():
		touch_axis = 0.0
	else:
		touch_axis = clampf(diff / (86.0 * ui_scale()), -1.0, 1.0)

func refresh_touch_buttons() -> void:
	touch_button_state.clear()
	for key in touch_buttons.keys():
		touch_button_state[str(touch_buttons[key])] = true

func should_show_touch() -> bool:
	return size.x < 980.0 or size.y > size.x * 1.15

func ui_scale() -> float:
	if size.y > size.x * 1.25:
		return 0.94
	if size.x <= 560.0:
		return 0.92
	return 1.0

func stick_center() -> Vector2:
	var ui := ui_scale()
	return Vector2(128.0 * ui, size.y - 150.0 * ui)

func button_layout() -> Array:
	var ui := ui_scale()
	var w := 88.0 * ui
	var h := 58.0 * ui
	var gap := 10.0 * ui
	var x := size.x - (w * 3.0 + gap * 2.0 + 18.0 * ui)
	var y := size.y - (h * 2.0 + gap + 88.0 * ui)
	return [
		{"id": "learn", "label": "L\nLern", "rect": Rect2(Vector2(x, y), Vector2(w, h))},
		{"id": "subject", "label": "C\nFach", "rect": Rect2(Vector2(x + w + gap, y), Vector2(w, h))},
		{"id": "overdrive", "label": "I\nOver", "rect": Rect2(Vector2(x + (w + gap) * 2.0, y), Vector2(w, h))},
		{"id": "fire", "label": "J\nFeuer", "rect": Rect2(Vector2(x, y + h + gap), Vector2(w, h))},
		{"id": "charge", "label": "K\nBeam", "rect": Rect2(Vector2(x + w + gap, y + h + gap), Vector2(w, h))},
		{"id": "dash", "label": "Space\nDash", "rect": Rect2(Vector2(x + (w + gap) * 2.0, y + h + gap), Vector2(w, h))}
	]

func button_at(pos: Vector2) -> String:
	for button in button_layout():
		var rect: Rect2 = button.rect
		if rect.has_point(pos):
			return str(button.id)
	return ""

func _draw() -> void:
	draw_background()
	draw_barriers()
	draw_pickups()
	draw_shots()
	draw_invaders()
	draw_boss()
	draw_player()
	draw_particles_and_floaters()
	draw_hud()
	if should_show_touch():
		draw_touch_controls()

func draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color.html("#030712"), true)
	for star in stars:
		var c := Color(0.75, 0.86, 1.0, float(star.alpha))
		draw_circle(Vector2(float(star.x), float(star.y)), float(star.size), c)
	for i in range(9):
		var x := float(i) * 170.0 + sin(elapsed * 0.25 + i) * 12.0
		draw_line(Vector2(x, 0), Vector2(x + 120.0, VIEW_H), Color(0.18, 0.32, 0.62, 0.12), 2.0)
	draw_rect(Rect2(0, PLAYER_Y + 42.0, size.x, 4.0), Color(0.36, 0.58, 0.88, 0.42), true)

func draw_barriers() -> void:
	for barrier in barriers:
		for cell in barrier.cells:
			if float(cell.hp) <= 0.0:
				continue
			var ratio := clampf(float(cell.hp) / float(cell.max_hp), 0.0, 1.0)
			var color := Color.html("#22c55e").lerp(Color.html("#fde68a"), 1.0 - ratio)
			draw_rect(Rect2(cell.rect), Color(0, 0, 0, 0.22), true)
			draw_rect(Rect2(cell.rect).grow(-1.0), color, true)

func draw_pickups() -> void:
	for pickup in pickups:
		var pos: Vector2 = pickup.pos
		var y := pos.y + sin(float(pickup.bob)) * 5.0
		var color := Color.html("#facc15")
		var label := "$"
		match str(pickup.kind):
			"heal":
				color = Color.html("#22c55e")
				label = "+"
			"wide":
				color = Color.html("#67e8f9")
				label = "W"
			"drone":
				color = Color.html("#bbf7d0")
				label = "D"
			"shield":
				color = Color.html("#93c5fd")
				label = "S"
			"overdrive":
				color = Color.html("#facc15")
				label = "O"
		draw_circle(Vector2(pos.x, y), 17.0, Color(0, 0, 0, 0.35))
		draw_circle(Vector2(pos.x, y - 2.0), 14.0, color)
		draw_string(font, Vector2(pos.x - 16.0, y + 5.0), label, HORIZONTAL_ALIGNMENT_CENTER, 32.0, 15, Color.html("#020617"))

func draw_shots() -> void:
	for shot in player_shots:
		draw_circle(Vector2(shot.pos), float(shot.radius) + 4.0, Color(1, 1, 1, 0.12))
		draw_circle(Vector2(shot.pos), float(shot.radius), Color.html(str(shot.color)))
	for shot in enemy_shots:
		draw_circle(Vector2(shot.pos), float(shot.radius) + 3.0, Color(1, 0.3, 0.4, 0.14))
		draw_circle(Vector2(shot.pos), float(shot.radius), Color.html(str(shot.color)))

func draw_invaders() -> void:
	for invader in invaders:
		var pos: Vector2 = invader.pos
		var radius := float(invader.radius)
		var color := Color.html(str(invader.color))
		if float(invader.hit) > 0.0:
			color = color.lerp(Color.WHITE, 0.55)
		if bool(invader.get("dive", false)):
			var origin: Vector2 = invader.dive_origin
			draw_line(origin, pos, Color(0.99, 0.9, 0.5, 0.22), 4.0)
			draw_arc(pos, radius + 11.0, -PI * 0.2, PI * 1.2, 28, Color.html("#facc15"), 3.0)
		draw_circle(pos + Vector2(0, 9), radius * 0.82, Color(0, 0, 0, 0.28))
		draw_rect(Rect2(pos.x - radius, pos.y - radius * 0.55, radius * 2.0, radius * 1.1), color, true)
		draw_circle(pos + Vector2(-radius * 0.56, -radius * 0.16), radius * 0.42, color)
		draw_circle(pos + Vector2(radius * 0.56, -radius * 0.16), radius * 0.42, color)
		draw_circle(pos + Vector2(-radius * 0.32, -radius * 0.1), 3.2, Color.html("#020617"))
		draw_circle(pos + Vector2(radius * 0.32, -radius * 0.1), 3.2, Color.html("#020617"))
		if bool(invader.elite):
			draw_arc(pos, radius + 7.0, 0, TAU, 32, Color.html("#fef08a"), 3.0)
		if str(invader.label) != "":
			var rect := Rect2(pos.x - 58.0, pos.y + radius + 9.0, 116.0, 30.0)
			draw_rect(rect, Color(0.92, 0.96, 1.0, 0.92), true)
			draw_rect(rect, Color(0.38, 0.67, 1.0, 0.8), false, 2.0)
			draw_string(font, rect.position + Vector2(0, 21), str(invader.label), HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, 14, Color.html("#0f172a"))
		var ratio := clampf(float(invader.hp) / float(invader.max_hp), 0.0, 1.0)
		if ratio < 1.0:
			draw_rect(Rect2(pos.x - radius, pos.y - radius - 9.0, radius * 2.0, 4.0), Color(0, 0, 0, 0.35), true)
			draw_rect(Rect2(pos.x - radius, pos.y - radius - 9.0, radius * 2.0 * ratio, 4.0), Color.html("#fef3c7"), true)

func draw_boss() -> void:
	if boss.size() == 0:
		return
	var pos := Vector2(float(boss.x), float(boss.y))
	var color := Color.html("#a78bfa")
	if float(boss.hit) > 0.0:
		color = color.lerp(Color.WHITE, 0.55)
	draw_circle(pos + Vector2(0, 16), 74.0, Color(0, 0, 0, 0.32))
	draw_rect(Rect2(pos.x - 112.0, pos.y - 34.0, 224.0, 68.0), color, true)
	draw_rect(Rect2(pos.x - 76.0, pos.y - 70.0, 152.0, 42.0), Color.html("#7c3aed"), true)
	draw_circle(pos + Vector2(-74, 0), 33.0, Color.html("#f0abfc"))
	draw_circle(pos + Vector2(74, 0), 33.0, Color.html("#f0abfc"))
	draw_string(font, pos + Vector2(-72, 7), "BOSS", HORIZONTAL_ALIGNMENT_CENTER, 144.0, 22, Color.html("#f8fafc"))
	var ratio := clampf(float(boss.hp) / float(boss.max_hp), 0.0, 1.0)
	draw_rect(Rect2(pos.x - 150.0, pos.y - 92.0, 300.0, 9.0), Color(0, 0, 0, 0.38), true)
	draw_rect(Rect2(pos.x - 150.0, pos.y - 92.0, 300.0 * ratio, 9.0), Color.html("#facc15"), true)

func draw_player() -> void:
	var pos := Vector2(float(player.x) + rng.randf_range(-1.0, 1.0) * shake * 18.0, PLAYER_Y)
	var flash := float(player.invuln) > 0.0 and int(elapsed * 18.0) % 2 == 0
	var body := Color.html("#38bdf8") if not flash else Color.html("#f8fafc")
	draw_circle(pos + Vector2(0, 16), 32.0, Color(0, 0, 0, 0.34))
	var hull := PackedVector2Array([pos + Vector2(0, -42), pos + Vector2(-34, 28), pos + Vector2(34, 28)])
	draw_polygon(hull, PackedColorArray([body]))
	draw_line(pos + Vector2(-24, 18), pos + Vector2(24, 18), Color.html("#0f172a"), 5.0)
	draw_circle(pos + Vector2(0, -10), 8.0, Color.html("#facc15"))
	if float(player.shield) > 0.0:
		draw_arc(pos, 48.0, 0.0, TAU, 42, Color(0.58, 0.77, 1.0, 0.72), 4.0)
	if float(player.drone) > 0.0:
		draw_circle(pos + Vector2(-48, 5), 10.0, Color.html("#bbf7d0"))
		draw_circle(pos + Vector2(48, 5), 10.0, Color.html("#bbf7d0"))
	if float(player.charge) > 0.0:
		draw_arc(pos + Vector2(0, -44), 20.0 + float(player.charge) * 14.0, 0, TAU, 32, Color.html("#facc15"), 4.0)

func draw_particles_and_floaters() -> void:
	for particle in particles:
		var c: Color = particle.color
		c.a = clampf(float(particle.life) / 0.8, 0.0, 1.0)
		draw_circle(Vector2(particle.pos), float(particle.size), c)
	for floater in floaters:
		var c2: Color = floater.color
		c2.a = clampf(float(floater.life), 0.0, 1.0)
		draw_string(font, Vector2(floater.pos) + Vector2(-80, 0), str(floater.text), HORIZONTAL_ALIGNMENT_CENTER, 160.0, 18, c2)

func draw_hud() -> void:
	var panel := Rect2(16, 14, minf(size.x - 32.0, 760.0), 118.0)
	draw_rect(panel, Color(0.02, 0.05, 0.09, 0.78), true)
	draw_rect(panel, Color(0.78, 0.88, 1.0, 0.22), false, 2.0)
	draw_string(font, Vector2(30, 39), "FASKA INVADERS PRO", HORIZONTAL_ALIGNMENT_LEFT, 310.0, 22, Color.html("#f8fafc"))
	draw_bar(Vector2(30, 56), 170.0, "HP", float(player.hp) / MAX_HP, Color.html("#fb7185"))
	draw_bar(Vector2(230, 56), 170.0, "HEAT", float(player.heat) / MAX_HEAT, Color.html("#f97316"))
	var over_ratio := float(player.overdrive) / MAX_OVERDRIVE if float(player.overdrive) <= MAX_OVERDRIVE else float(player.overdrive) / 7.0
	draw_bar(Vector2(430, 56), 190.0, "OVER", clampf(over_ratio, 0.0, 1.0), Color.html("#facc15"))
	draw_string(font, Vector2(30, 98), "Welle " + str(wave) + "   Ziele " + str(invaders.size()) + "   Score " + str(score), HORIZONTAL_ALIGNMENT_LEFT, 580.0, 17, Color.html("#cbd5e1"))
	if mission.size() > 0:
		var goal := int(mission.get("goal", 1))
		var ratio := float(mission_progress) / float(maxi(1, goal))
		draw_string(font, Vector2(30, 121), "Mission: " + str(mission.get("title", "")) + "  " + str(mission_progress) + "/" + str(goal) + "  " + str(ceil(mission_timer)) + "s", HORIZONTAL_ALIGNMENT_LEFT, 360.0, 15, Color.html("#fef3c7"))
		draw_rect(Rect2(Vector2(394, 108), Vector2(222, 12)), Color(0, 0, 0, 0.42), true)
		draw_rect(Rect2(Vector2(394, 108), Vector2(222.0 * clampf(ratio, 0.0, 1.0), 12)), Color.html("#22d3ee"), true)
		draw_rect(Rect2(Vector2(394, 108), Vector2(222, 12)), Color(1, 1, 1, 0.22), false, 2.0)
	else:
		draw_string(font, Vector2(30, 121), "Mission wird vorbereitet", HORIZONTAL_ALIGNMENT_LEFT, 360.0, 15, Color.html("#94a3b8"))
	var right := Rect2(size.x - 376.0, 14.0, 360.0, 118.0)
	draw_rect(right, Color(0.02, 0.05, 0.09, 0.78), true)
	draw_rect(right, Color(0.78, 0.88, 1.0, 0.22), false, 2.0)
	draw_string(font, right.position + Vector2(14, 25), mode + "  |  " + str(LESSONS[lesson_index]), HORIZONTAL_ALIGNMENT_LEFT, 328.0, 18, Color.html("#fef3c7"))
	draw_string(font, right.position + Vector2(14, 50), "Richtig: " + str(learn_correct) + "/" + str(LEARN_GOAL) + "  Serie: " + str(learn_streak), HORIZONTAL_ALIGNMENT_LEFT, 328.0, 14, Color.html("#cbd5e1"))
	draw_string(font, right.position + Vector2(14, 74), "Medaillen: " + str(mission_medals) + "  Max-Combo: " + str(max_combo), HORIZONTAL_ALIGNMENT_LEFT, 328.0, 14, Color.html("#cbd5e1"))
	draw_string(font, right.position + Vector2(14, 98), "Beam-Kills: " + str(charged_kills) + "  Eliten: " + str(elite_kills) + "  Deckung: " + str(barrier_saves), HORIZONTAL_ALIGNMENT_LEFT, 328.0, 13, Color.html("#cbd5e1"))
	if mode == "Lernen" and active_task.size() > 0:
		var qpanel := Rect2(170.0, 146.0, size.x - 340.0, 62.0)
		draw_rect(qpanel, Color(0.92, 0.96, 1.0, 0.92), true)
		draw_rect(qpanel, Color(0.38, 0.67, 1.0, 0.7), false, 3.0)
		draw_string(font, qpanel.position + Vector2(14, 24), str(active_task.prompt), HORIZONTAL_ALIGNMENT_LEFT, qpanel.size.x - 28.0, 20, Color.html("#0f172a"))
		draw_string(font, qpanel.position + Vector2(14, 48), "Schiesse nur das richtige Antwort-Ziel ab.", HORIZONTAL_ALIGNMENT_LEFT, qpanel.size.x - 28.0, 13, Color.html("#334155"))
	if message_timer > 0.0:
		draw_center_notice(message)
	if combo > 1:
		draw_string(font, Vector2(size.x * 0.5 - 80.0, 106.0), str(combo) + " HIT", HORIZONTAL_ALIGNMENT_CENTER, 160.0, 30, Color.html("#facc15"))
	if phase == "over":
		draw_rect(Rect2(Vector2.ZERO, size), Color(0, 0, 0, 0.55), true)
		draw_string(font, Vector2(0, size.y * 0.45), "GAME OVER", HORIZONTAL_ALIGNMENT_CENTER, size.x, 48, Color.html("#f8fafc"))
		draw_string(font, Vector2(0, size.y * 0.54), "Enter, Space oder Touch startet neu", HORIZONTAL_ALIGNMENT_CENTER, size.x, 21, Color.html("#cbd5e1"))

func draw_bar(pos: Vector2, width: float, label: String, ratio: float, color: Color) -> void:
	draw_string(font, pos + Vector2(0, -7), label, HORIZONTAL_ALIGNMENT_LEFT, 60.0, 12, Color.html("#cbd5e1"))
	draw_rect(Rect2(pos + Vector2(48, -15), Vector2(width, 12)), Color(0, 0, 0, 0.38), true)
	draw_rect(Rect2(pos + Vector2(48, -15), Vector2(width * clampf(ratio, 0.0, 1.0), 12)), color, true)
	draw_rect(Rect2(pos + Vector2(48, -15), Vector2(width, 12)), Color(1, 1, 1, 0.22), false, 2.0)

func draw_center_notice(text: String) -> void:
	var rect := Rect2(size.x * 0.5 - 250.0, 192.0, 500.0, 42.0)
	draw_rect(rect, Color(0.02, 0.05, 0.09, 0.74), true)
	draw_rect(rect, Color(1, 1, 1, 0.18), false, 2.0)
	draw_string(font, rect.position + Vector2(0, 27), text, HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, 18, Color.html("#f8fafc"))

func draw_touch_controls() -> void:
	var ui := ui_scale()
	var center := stick_center()
	draw_circle(center, 82.0 * ui, Color(0.02, 0.05, 0.09, 0.54))
	draw_arc(center, 82.0 * ui, 0.0, TAU, 36, Color(0.78, 0.88, 1.0, 0.52), 4.0 * ui)
	draw_circle(center + Vector2(touch_axis * 48.0 * ui, 0), 30.0 * ui, Color(0.93, 0.96, 1.0, 0.82))
	draw_string(font, center + Vector2(-70.0 * ui, -96.0 * ui), "Fliegen", HORIZONTAL_ALIGNMENT_CENTER, 140.0 * ui, 14, Color.html("#cbd5e1"))
	for button in button_layout():
		var rect: Rect2 = button.rect
		var id := str(button.id)
		var active := bool(touch_button_state.get(id, false))
		draw_rect(rect, Color(0.02, 0.05, 0.09, 0.66), true)
		draw_rect(rect, Color.html("#facc15") if active else Color(0.78, 0.88, 1.0, 0.56), false, 3.0 * ui)
		var lines := str(button.label).split("\n")
		for i in range(lines.size()):
			draw_string(font, rect.position + Vector2(0, (24.0 + float(i) * 20.0) * ui), lines[i], HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, int(15.0 * ui), Color.html("#f8fafc"))
