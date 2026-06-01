extends Control

const WORLD_W := 5400.0
const PLAYER_W := 34.0
const PLAYER_H := 56.0
const GRAVITY := 1550.0
const RUN_SPEED := 285.0
const JUMP_SPEED := -620.0
const LEARN_GOAL := 7
const LESSONS := ["WORTART", "MATHE", "SATZ", "LESEN", "KOMPOSITUM", "ENGLISCH"]
const GATE_BASES := [
	Vector2(890.0, 365.0),
	Vector2(1700.0, 390.0),
	Vector2(2500.0, 300.0),
	Vector2(3380.0, 330.0),
	Vector2(4300.0, 350.0),
]

const QUESTIONS_WORD := [
	{"prompt": "Welche Wortart ist 'springen'?", "answers": ["Verb", "Artikel", "Nomen"], "correct": 0, "hint": "Springen kann man tun."},
	{"prompt": "Welche Wortart ist 'mutig'?", "answers": ["Nomen", "Verb", "Adjektiv"], "correct": 2, "hint": "Mutig beschreibt jemanden."},
	{"prompt": "Welche Wortart ist 'die'?", "answers": ["Adjektiv", "Artikel", "Verb"], "correct": 1, "hint": "Die steht vor einem Nomen."},
	{"prompt": "Welche Wortart ist 'Plattform'?", "answers": ["Nomen", "Verb", "Artikel"], "correct": 0, "hint": "Eine Plattform ist ein Ding."},
	{"prompt": "Welche Wortart ist 'schnell'?", "answers": ["Verb", "Adjektiv", "Nomen"], "correct": 1, "hint": "Schnell sagt, wie etwas passiert."},
	{"prompt": "Welche Wortart ist 'unter'?", "answers": ["Praeposition", "Nomen", "Verb"], "correct": 0, "hint": "Unter zeigt einen Ort oder eine Lage."},
	{"prompt": "Welche Wortart ist 'aber'?", "answers": ["Konjunktion", "Adjektiv", "Artikel"], "correct": 0, "hint": "Aber verbindet Satzteile."},
	{"prompt": "Welche Wortart ist 'wir'?", "answers": ["Pronomen", "Verb", "Nomen"], "correct": 0, "hint": "Wir steht fuer Personen."},
	{"prompt": "Welche Wortart ist 'heute'?", "answers": ["Adverb", "Artikel", "Nomen"], "correct": 0, "hint": "Heute sagt, wann etwas passiert."},
	{"prompt": "Welche Wortart ist 'leuchtet'?", "answers": ["Nomen", "Verb", "Artikel"], "correct": 1, "hint": "Leuchtet beschreibt eine Handlung."},
]

const QUESTIONS_MATH := [
	{"prompt": "Welche Zahl passt? 9 + 6", "answers": ["14", "15", "16"], "correct": 1, "hint": "Von 9 sechs weiter."},
	{"prompt": "Welche Zahl ist gerade?", "answers": ["17", "18", "21"], "correct": 1, "hint": "Gerade Zahlen sind durch 2 teilbar."},
	{"prompt": "Was ist 4 x 7?", "answers": ["24", "28", "32"], "correct": 1, "hint": "Vier Siebener."},
	{"prompt": "Welche Zahl fehlt? 30 - ? = 18", "answers": ["10", "12", "14"], "correct": 1, "hint": "Von 30 bis 18 sind es 12."},
	{"prompt": "Was ist die Haelfte von 38?", "answers": ["18", "19", "20"], "correct": 1, "hint": "19 + 19 = 38."},
	{"prompt": "Welche Zahl passt? 7 x 8", "answers": ["54", "56", "58"], "correct": 1, "hint": "Sieben Achter sind 56."},
	{"prompt": "Welche Zahl ist ein Vielfaches von 5?", "answers": ["42", "45", "47"], "correct": 1, "hint": "Vielfache von 5 enden auf 0 oder 5."},
	{"prompt": "Was ist 63 : 9?", "answers": ["6", "7", "8"], "correct": 1, "hint": "9 mal 7 ist 63."},
	{"prompt": "Welche Zahl fehlt? ? + 17 = 40", "answers": ["21", "23", "27"], "correct": 1, "hint": "40 minus 17 ist 23."},
	{"prompt": "Was ist ein Viertel von 20?", "answers": ["4", "5", "6"], "correct": 1, "hint": "20 in vier gleiche Teile."},
]

const QUESTIONS_SENTENCE := [
	{"prompt": "Was ist das Subjekt? Der Ninja springt.", "answers": ["Der Ninja", "springt", "schnell"], "correct": 0, "hint": "Wer springt?"},
	{"prompt": "Was ist das Praedikat? Lumi rennt los.", "answers": ["Lumi", "rennt", "los"], "correct": 1, "hint": "Was tut Lumi?"},
	{"prompt": "Welches Wort passt? Die Plattform ist ___.", "answers": ["stabil", "springt", "und"], "correct": 0, "hint": "Gesucht ist eine Eigenschaft."},
	{"prompt": "Welche Satzstelle ist ein Ort? Wir landen auf der Bruecke.", "answers": ["Wir", "landen", "auf der Bruecke"], "correct": 2, "hint": "Wo landen wir?"},
	{"prompt": "Welches Wort macht den Satz fertig? Der Held ___ hoch.", "answers": ["klettert", "blau", "der"], "correct": 0, "hint": "Gesucht ist ein Verb."},
	{"prompt": "Was ist das Objekt? Mia sammelt die Rune.", "answers": ["Mia", "sammelt", "die Rune"], "correct": 2, "hint": "Was sammelt Mia?"},
	{"prompt": "Welches Satzzeichen passt? Kommst du mit", "answers": [".", "?", ","], "correct": 1, "hint": "Es ist eine Frage."},
	{"prompt": "Welche Satzstelle nennt die Zeit? Am Morgen startet Tom.", "answers": ["Am Morgen", "startet", "Tom"], "correct": 0, "hint": "Wann startet Tom?"},
	{"prompt": "Welcher Satz ist vollstaendig?", "answers": ["Der Stern hell.", "Der Stern leuchtet.", "Der Stern und."], "correct": 1, "hint": "Er hat Subjekt und Praedikat."},
	{"prompt": "Welches Bindewort passt? Ich springe, ___ du wartest.", "answers": ["weil", "der", "schnell"], "correct": 0, "hint": "Weil verbindet Satzteile."},
]

const QUESTIONS_READING := [
	{"prompt": "Lies genau: Springe zum Ring.", "answers": ["Ring", "Tor", "See"], "correct": 0, "hint": "Das Zielwort steht im Satz."},
	{"prompt": "Welches Wort reimt sich auf Lauf?", "answers": ["rauf", "rot", "Tor"], "correct": 0, "hint": "Beide enden aehnlich."},
	{"prompt": "Welches Wort beginnt wie Grapple?", "answers": ["Gras", "Platz", "Ring"], "correct": 0, "hint": "Beide beginnen mit Gr."},
	{"prompt": "Welche Anweisung passt? Nimm die Rune.", "answers": ["Rune", "Wasser", "Wolke"], "correct": 0, "hint": "Der Satz nennt die Rune."},
	{"prompt": "Welches Wort ist laenger?", "answers": ["Tor", "Checkpoint", "Run"], "correct": 1, "hint": "Checkpoint hat mehr Buchstaben."},
	{"prompt": "Lies genau: Laufe zur Bruecke.", "answers": ["Bruecke", "Blume", "Berg"], "correct": 0, "hint": "Gesucht ist das Wort aus dem Satz."},
	{"prompt": "Welches Wort hat zwei Silben?", "answers": ["Tor", "Ninja", "Sprung"], "correct": 1, "hint": "Nin-ja."},
	{"prompt": "Welches Wort ist zusammengesetzt?", "answers": ["Mondlicht", "rennen", "klein"], "correct": 0, "hint": "Mond und Licht."},
	{"prompt": "Was passt zum Satz? Der Held findet den Schatz.", "answers": ["Schatz", "Schatten", "Schule"], "correct": 0, "hint": "Der Satz nennt den Schatz."},
	{"prompt": "Welches Wort beginnt mit Sch?", "answers": ["Schwert", "Tor", "Rune"], "correct": 0, "hint": "Sch steht am Anfang."},
]

const QUESTIONS_COMPOUND := [
	{"prompt": "Welche zwei Woerter stecken in Sonnenlicht?", "answers": ["Sonne + Licht", "Sohn + Licht", "Sonne + Lied"], "correct": 0, "hint": "Es geht um Licht der Sonne."},
	{"prompt": "Welches Kompositum passt: Wasser + Fall", "answers": ["Wasserfall", "Wassertor", "Wasserlauf"], "correct": 0, "hint": "Wasser faellt nach unten."},
	{"prompt": "Was bedeutet Sternentor?", "answers": ["Tor bei den Sternen", "kleiner Stern", "schneller Lauf"], "correct": 0, "hint": "Das Grundwort ist Tor."},
	{"prompt": "Welches Wort ist kein Kompositum?", "answers": ["Baumhaus", "Federleicht", "rennen"], "correct": 2, "hint": "Rennen ist ein einfaches Verb."},
	{"prompt": "Welches Grundwort hat Schneeball?", "answers": ["Schnee", "Ball", "Schne"], "correct": 1, "hint": "Das letzte Wort bestimmt die Sache."},
	{"prompt": "Welche Verbindung passt? Mond + Stein", "answers": ["Mondstein", "Steinmond", "Mondlauf"], "correct": 0, "hint": "So entsteht ein Gegenstand."},
	{"prompt": "Welches Bestimmungswort hat Waldweg?", "answers": ["Wald", "Weg", "Wall"], "correct": 0, "hint": "Es beschreibt den Weg genauer."},
]

const QUESTIONS_ENGLISH := [
	{"prompt": "Was heisst 'jump'?", "answers": ["springen", "lesen", "tragen"], "correct": 0, "hint": "Jump macht man auf Plattformen."},
	{"prompt": "Was heisst 'bridge'?", "answers": ["Bruecke", "Baum", "Bett"], "correct": 0, "hint": "Darueber kann man gehen."},
	{"prompt": "Was heisst 'fast'?", "answers": ["schnell", "leise", "rund"], "correct": 0, "hint": "Fast ist das Gegenteil von slow."},
	{"prompt": "Welches Wort bedeutet 'Schluessel'?", "answers": ["key", "coin", "door"], "correct": 0, "hint": "Mit a key oeffnet man etwas."},
	{"prompt": "Was heisst 'run'?", "answers": ["laufen", "malen", "singen"], "correct": 0, "hint": "Run passt zum Parkour."},
	{"prompt": "Welches Wort bedeutet 'Tor'?", "answers": ["gate", "rope", "stone"], "correct": 0, "hint": "Ein Gate ist ein Durchgang."},
	{"prompt": "Was heisst 'correct'?", "answers": ["richtig", "falsch", "langsam"], "correct": 0, "hint": "Correct ist die richtige Antwort."},
]

class TouchParkourOverlay:
	extends Control

	var move_x := 0.0
	var jump_down := false
	var dash_down := false
	var grapple_down := false
	var attack_down := false
	var learn_down := false
	var subject_down := false
	var _move_touch := -1
	var _button_touches := {}

	func _ready() -> void:
		mouse_filter = Control.MOUSE_FILTER_PASS
		set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)

	func _process(_delta: float) -> void:
		queue_redraw()

	func _gui_input(event: InputEvent) -> void:
		if not _should_show():
			return
		if event is InputEventScreenTouch:
			if event.pressed:
				if event.position.x < size.x * 0.44:
					_move_touch = event.index
					_update_move(event.position)
				else:
					var action := _button_at(event.position)
					if action != "":
						_button_touches[event.index] = action
						_refresh_buttons()
			else:
				if event.index == _move_touch:
					_move_touch = -1
					move_x = 0.0
				if _button_touches.has(event.index):
					_button_touches.erase(event.index)
					_refresh_buttons()
		elif event is InputEventScreenDrag:
			if event.index == _move_touch:
				_update_move(event.position)

	func _update_move(pos: Vector2) -> void:
		var ui := _ui_scale()
		var center := _stick_center()
		var diff := pos.x - center.x
		move_x = 0.0 if absf(diff) < 18.0 * ui else clampf(diff / (92.0 * ui), -1.0, 1.0)

	func _refresh_buttons() -> void:
		jump_down = false
		dash_down = false
		grapple_down = false
		attack_down = false
		learn_down = false
		subject_down = false
		for key in _button_touches.keys():
			var action: String = str(_button_touches[key])
			if action == "jump":
				jump_down = true
			elif action == "dash":
				dash_down = true
			elif action == "grapple":
				grapple_down = true
			elif action == "attack":
				attack_down = true
			elif action == "learn":
				learn_down = true
			elif action == "subject":
				subject_down = true

	func _button_at(pos: Vector2) -> String:
		for button in _buttons():
			var rect: Rect2 = button["rect"]
			if rect.has_point(pos):
				return str(button["action"])
		return ""

	func _stick_center() -> Vector2:
		return Vector2(128.0 * _ui_scale(), size.y - 220.0 * _ui_scale())

	func _buttons() -> Array:
		var ui := _ui_scale()
		var w := 98.0 * ui
		var h := 70.0 * ui
		var gap := 12.0 * ui
		var x := size.x - (w * 2.0 + gap + 24.0 * ui)
		var y := size.y - (h * 3.0 + gap * 2.0 + 110.0 * ui)
		return [
			{"action": "learn", "label": "L\nLern", "rect": Rect2(Vector2(x, y), Vector2(w, h))},
			{"action": "subject", "label": "C\nFach", "rect": Rect2(Vector2(x + w + gap, y), Vector2(w, h))},
			{"action": "jump", "label": "W\nJump", "rect": Rect2(Vector2(x, y + h + gap), Vector2(w, h))},
			{"action": "dash", "label": "A\nDash", "rect": Rect2(Vector2(x + w + gap, y + h + gap), Vector2(w, h))},
			{"action": "grapple", "label": "J\nHook", "rect": Rect2(Vector2(x, y + (h + gap) * 2.0), Vector2(w, h))},
			{"action": "attack", "label": "K\nHit", "rect": Rect2(Vector2(x + w + gap, y + (h + gap) * 2.0), Vector2(w, h))},
		]

	func _should_show() -> bool:
		return size.x < 980.0 or size.y > size.x * 1.2

	func _ui_scale() -> float:
		if size.x <= 520.0 or size.y > size.x * 1.35:
			return 1.18
		return 1.0

	func _draw() -> void:
		if not _should_show():
			return
		_draw_stick()
		_draw_buttons()

	func _draw_stick() -> void:
		var ui := _ui_scale()
		var center := _stick_center()
		draw_circle(center, 102.0 * ui, Color(0.02, 0.05, 0.09, 0.48))
		draw_arc(center, 102.0 * ui, 0.0, TAU, 36, Color(0.78, 0.88, 1.0, 0.52), 5.0 * ui)
		draw_circle(center + Vector2(move_x * 58.0 * ui, 0.0), 38.0 * ui, Color(0.93, 0.96, 1.0, 0.78))

	func _draw_buttons() -> void:
		var font := get_theme_default_font()
		var ui := _ui_scale()
		for button in _buttons():
			var rect: Rect2 = button["rect"]
			var action := str(button["action"])
			var active := (action == "jump" and jump_down) or (action == "dash" and dash_down) or (action == "grapple" and grapple_down) or (action == "attack" and attack_down) or (action == "learn" and learn_down) or (action == "subject" and subject_down)
			draw_rect(rect, Color(0.02, 0.05, 0.09, 0.66), true)
			draw_rect(rect, Color.html("#facc15") if active else Color(0.78, 0.88, 1.0, 0.55), false, 4.0 * ui)
			var lines := str(button["label"]).split("\n")
			for i in range(lines.size()):
				draw_string(font, rect.position + Vector2(0.0, (27.0 + float(i) * 23.0) * ui), lines[i], HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, 20 * ui, Color.html("#f8fafc"))

var platforms: Array = []
var moving_platforms: Array = []
var grapples: Array = []
var rings: Array = []
var shards: Array = []
var enemies: Array = []
var checkpoints: Array = []
var gates: Array = []
var player_pos := Vector2(120.0, 510.0)
var player_vel := Vector2.ZERO
var spawn_pos := Vector2(120.0, 510.0)
var camera_x := 0.0
var facing := 1
var hp := 5
var stamina := 100.0
var jumps_left := 2
var grounded := false
var dash_timer := 0.0
var attack_timer := 0.0
var hurt_timer := 0.0
var score := 0
var ring_combo := 0
var shard_count := 0
var checkpoint_index := 0
var mode_learn := true
var lesson_index := 0
var question_index := 0
var repeat_queue := []
var learn_hits := 0
var mistakes := 0
var message := "Godot Parkour: Double-Jump, Dash, Grapple, Gegner-Stomps, Checkpoints und Gates."
var message_timer := 4.0
var won := false
var game_over := false
var coyote_timer := 0.0
var jump_buffer := 0.0
var dash_charges := 1
var touch_overlay: TouchParkourOverlay
var last_touch_jump := false
var last_touch_dash := false
var last_touch_grapple := false
var last_touch_attack := false
var last_touch_learn := false
var last_touch_subject := false

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_STOP
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	touch_overlay = TouchParkourOverlay.new()
	add_child(touch_overlay)
	reset_game()

func reset_game() -> void:
	build_level()
	player_pos = Vector2(120.0, 510.0)
	spawn_pos = player_pos
	player_vel = Vector2.ZERO
	camera_x = 0.0
	facing = 1
	hp = 5
	stamina = 100.0
	jumps_left = 2
	grounded = false
	dash_timer = 0.0
	attack_timer = 0.0
	hurt_timer = 0.0
	score = 0
	ring_combo = 0
	shard_count = 0
	checkpoint_index = 0
	mode_learn = true
	lesson_index = 0
	question_index = 0
	repeat_queue.clear()
	learn_hits = 0
	mistakes = 0
	coyote_timer = 0.0
	jump_buffer = 0.0
	dash_charges = 1
	won = false
	game_over = false
	message = "Parkour Pro: Flow-Run mit Double-Jump, Dash, Grapple, Gegnern und echten Learncade-Gates."
	message_timer = 4.5

func build_level() -> void:
	platforms.clear()
	moving_platforms.clear()
	grapples.clear()
	rings.clear()
	shards.clear()
	enemies.clear()
	checkpoints.clear()
	gates.clear()
	platforms.append(Rect2(0.0, 570.0, 620.0, 60.0))
	platforms.append(Rect2(760.0, 515.0, 260.0, 34.0))
	platforms.append(Rect2(1130.0, 458.0, 310.0, 34.0))
	platforms.append(Rect2(1600.0, 535.0, 280.0, 34.0))
	platforms.append(Rect2(2030.0, 485.0, 230.0, 34.0))
	platforms.append(Rect2(2470.0, 430.0, 260.0, 34.0))
	platforms.append(Rect2(2950.0, 505.0, 310.0, 34.0))
	platforms.append(Rect2(3450.0, 455.0, 240.0, 34.0))
	platforms.append(Rect2(3840.0, 535.0, 260.0, 34.0))
	platforms.append(Rect2(4260.0, 476.0, 330.0, 34.0))
	platforms.append(Rect2(4750.0, 570.0, 650.0, 60.0))
	platforms.append(Rect2(1320.0, 320.0, 160.0, 28.0))
	platforms.append(Rect2(3190.0, 320.0, 170.0, 28.0))
	moving_platforms.append({"base": Rect2(610.0, 485.0, 135.0, 26.0), "axis": "y", "range": 86.0, "speed": 1.5, "phase": 0.0})
	moving_platforms.append({"base": Rect2(1880.0, 430.0, 140.0, 26.0), "axis": "x", "range": 150.0, "speed": 1.3, "phase": 0.8})
	moving_platforms.append({"base": Rect2(2750.0, 390.0, 140.0, 26.0), "axis": "y", "range": 110.0, "speed": 1.7, "phase": 1.2})
	moving_platforms.append({"base": Rect2(4100.0, 420.0, 140.0, 26.0), "axis": "x", "range": 170.0, "speed": 1.1, "phase": 2.1})
	grapples = [Vector2(710.0, 305.0), Vector2(1500.0, 245.0), Vector2(2380.0, 270.0), Vector2(3370.0, 250.0), Vector2(4550.0, 290.0)]
	checkpoints = [Vector2(1180.0, 420.0), Vector2(2550.0, 392.0), Vector2(3900.0, 500.0)]
	for i in range(35):
		var x: float = 360.0 + float(i) * 135.0
		var y: float = 390.0 + sin(float(i) * 0.85) * 85.0
		rings.append({"pos": Vector2(x, y), "taken": false})
	for i in range(8):
		shards.append({"pos": Vector2(920.0 + float(i) * 520.0, 280.0 + sin(float(i)) * 65.0), "taken": false})
	var enemy_data: Array = [
		{"pos": Vector2(900.0, 482.0), "left": 790.0, "right": 1000.0},
		{"pos": Vector2(1690.0, 502.0), "left": 1610.0, "right": 1870.0},
		{"pos": Vector2(3040.0, 472.0), "left": 2960.0, "right": 3250.0},
		{"pos": Vector2(4350.0, 443.0), "left": 4270.0, "right": 4580.0},
	]
	for item in enemy_data:
		var enemy: Dictionary = item
		enemy["dir"] = 1
		enemy["alive"] = true
		enemy["hit"] = 0.0
		enemies.append(enemy)
	setup_gates()

func setup_gates() -> void:
	gates.clear()
	var q: Dictionary = current_question()
	var answers: Array = q["answers"]
	var base: Vector2 = GATE_BASES[mini(learn_hits, GATE_BASES.size() - 1)]
	var xs: Array = [base.x - 130.0, base.x, base.x + 130.0]
	for i in range(answers.size()):
		gates.append({"rect": Rect2(xs[i], base.y, 105.0, 72.0), "label": answers[i], "index": i, "armed": true, "repeat": q.get("repeat", false)})

func current_question() -> Dictionary:
	if repeat_queue.size() > 0:
		var repeated: Dictionary = repeat_queue[0].duplicate(true)
		repeated["repeat"] = true
		return repeated
	var bank: Array = QUESTIONS_WORD
	var lesson := str(LESSONS[lesson_index])
	if lesson == "MATHE":
		bank = QUESTIONS_MATH
	elif lesson == "SATZ":
		bank = QUESTIONS_SENTENCE
	elif lesson == "LESEN":
		bank = QUESTIONS_READING
	elif lesson == "KOMPOSITUM":
		bank = QUESTIONS_COMPOUND
	elif lesson == "ENGLISCH":
		bank = QUESTIONS_ENGLISH
	return bank[question_index % bank.size()]

func cycle_lesson() -> void:
	lesson_index = (lesson_index + 1) % LESSONS.size()
	question_index = 0
	repeat_queue.clear()
	setup_gates()
	message = "Fach: %s. Naechste Gates wurden neu gesetzt." % str(LESSONS[lesson_index])
	message_timer = 2.0

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_R:
			reset_game()
		elif event.keycode == KEY_L:
			mode_learn = not mode_learn
			setup_gates()
			message = "Learncade: Triff die richtigen Gates im Lauf." if mode_learn else "Normalmodus: reiner Parkour-Lauf."
			message_timer = 3.0
		elif event.keycode == KEY_C:
			cycle_lesson()
		elif event.keycode == KEY_W or event.keycode == KEY_UP:
			buffer_jump()
		elif event.keycode == KEY_SPACE:
			try_dash()
		elif event.keycode == KEY_J:
			try_grapple()
		elif event.keycode == KEY_K:
			attack_timer = 0.16
			hit_near_enemy()

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()
	if game_over or won:
		queue_redraw()
		return
	tick_timers(delta)
	update_touch_actions()
	update_player(delta)
	update_enemies(delta)
	collect_items()
	check_checkpoints()
	check_gates()
	check_finish()
	update_camera()
	queue_redraw()

func update_touch_actions() -> void:
	if touch_overlay == null:
		return
	if touch_overlay.jump_down and not last_touch_jump:
		buffer_jump()
	if touch_overlay.dash_down and not last_touch_dash:
		try_dash()
	if touch_overlay.grapple_down and not last_touch_grapple:
		try_grapple()
	if touch_overlay.attack_down and not last_touch_attack:
		attack_timer = 0.16
		hit_near_enemy()
	if touch_overlay.learn_down and not last_touch_learn:
		mode_learn = not mode_learn
		setup_gates()
		message = "Learncade aktiv." if mode_learn else "Normalmodus aktiv."
		message_timer = 1.8
	if touch_overlay.subject_down and not last_touch_subject:
		cycle_lesson()
	last_touch_jump = touch_overlay.jump_down
	last_touch_dash = touch_overlay.dash_down
	last_touch_grapple = touch_overlay.grapple_down
	last_touch_attack = touch_overlay.attack_down
	last_touch_learn = touch_overlay.learn_down
	last_touch_subject = touch_overlay.subject_down

func tick_timers(delta: float) -> void:
	if message_timer > 0.0:
		message_timer -= delta
	if dash_timer > 0.0:
		dash_timer -= delta
	if attack_timer > 0.0:
		attack_timer -= delta
	if hurt_timer > 0.0:
		hurt_timer -= delta
	if coyote_timer > 0.0:
		coyote_timer -= delta
	if jump_buffer > 0.0:
		jump_buffer -= delta
	stamina = minf(100.0, stamina + delta * 24.0)

func update_player(delta: float) -> void:
	var input_dir := 0.0
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		input_dir -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		input_dir += 1.0
	if touch_overlay != null and absf(touch_overlay.move_x) > 0.08:
		input_dir = touch_overlay.move_x
	if input_dir != 0.0:
		facing = int(signf(input_dir))
	if dash_timer <= 0.0:
		player_vel.x = lerpf(player_vel.x, input_dir * RUN_SPEED, delta * 10.0)
	player_vel.y += GRAVITY * delta
	grounded = false
	move_player(Vector2(player_vel.x * delta, 0.0))
	move_player(Vector2(0.0, player_vel.y * delta))
	if grounded:
		coyote_timer = 0.12
		dash_charges = 1
	if jump_buffer > 0.0:
		try_jump()
	if player_pos.y > 820.0:
		respawn("Sturz.")

func buffer_jump() -> void:
	jump_buffer = 0.14

func try_jump() -> void:
	if jumps_left <= 0 and coyote_timer <= 0.0:
		return
	player_vel.y = JUMP_SPEED
	if coyote_timer > 0.0 and jumps_left <= 0:
		jumps_left = 1
	jumps_left -= 1
	jump_buffer = 0.0
	coyote_timer = 0.0
	grounded = false
	message = "Jump."
	message_timer = 0.7

func try_dash() -> void:
	if stamina < 26.0 or dash_timer > 0.0 or dash_charges <= 0:
		return
	stamina -= 26.0
	dash_charges -= 1
	dash_timer = 0.18
	player_vel.x = float(facing) * 690.0
	player_vel.y *= 0.45
	message = "Dash."
	message_timer = 0.7

func try_grapple() -> void:
	var best := Vector2.ZERO
	var best_dist := 9999.0
	for point in grapples:
		var hook: Vector2 = point
		var dist: float = player_pos.distance_to(hook)
		if dist < 330.0 and dist < best_dist and hook.y < player_pos.y - 40.0:
			best = hook
			best_dist = dist
	if best_dist >= 9999.0:
		message = "Kein Grapple in Reichweite."
		message_timer = 1.0
		return
	var direction: Vector2 = (best - player_pos).normalized()
	player_vel = direction * 640.0
	jumps_left = maxi(jumps_left, 1)
	message = "Grapple."
	message_timer = 0.8

func move_player(delta_pos: Vector2) -> void:
	if delta_pos.length_squared() <= 0.0:
		return
	var previous_rect: Rect2 = player_rect()
	player_pos += delta_pos
	var hit: Dictionary = find_collision(player_rect())
	if not bool(hit["hit"]):
		return
	var rect: Rect2 = hit["rect"]
	if delta_pos.x > 0.0:
		player_pos.x = rect.position.x - PLAYER_W * 0.5
		player_vel.x = minf(0.0, player_vel.x)
	elif delta_pos.x < 0.0:
		player_pos.x = rect.position.x + rect.size.x + PLAYER_W * 0.5
		player_vel.x = maxf(0.0, player_vel.x)
	elif delta_pos.y > 0.0:
		if previous_rect.position.y + previous_rect.size.y <= rect.position.y + 8.0:
			player_pos.y = rect.position.y
			player_vel.y = 0.0
			grounded = true
			jumps_left = 2
			dash_charges = 1
		else:
			player_pos.y = rect.position.y - 1.0
	elif delta_pos.y < 0.0:
		player_pos.y = rect.position.y + rect.size.y + PLAYER_H
		player_vel.y = maxf(0.0, player_vel.y)

func find_collision(rect: Rect2) -> Dictionary:
	for platform in platforms:
		var p: Rect2 = platform
		if rect.intersects(p):
			return {"hit": true, "rect": p}
	for platform in moving_platforms:
		var p: Rect2 = moving_rect(platform)
		if rect.intersects(p):
			return {"hit": true, "rect": p}
	return {"hit": false, "rect": Rect2()}

func moving_rect(platform: Dictionary) -> Rect2:
	var base: Rect2 = platform["base"]
	var offset: float = sin(Time.get_ticks_msec() * 0.001 * float(platform["speed"]) + float(platform["phase"])) * float(platform["range"])
	if str(platform["axis"]) == "x":
		return Rect2(base.position + Vector2(offset, 0.0), base.size)
	return Rect2(base.position + Vector2(0.0, offset), base.size)

func update_enemies(delta: float) -> void:
	for i in range(enemies.size()):
		var enemy: Dictionary = enemies[i]
		if not bool(enemy["alive"]):
			continue
		var pos: Vector2 = enemy["pos"]
		var dir: int = int(enemy["dir"])
		pos.x += float(dir) * 88.0 * delta
		if pos.x < float(enemy["left"]):
			pos.x = float(enemy["left"])
			dir = 1
		elif pos.x > float(enemy["right"]):
			pos.x = float(enemy["right"])
			dir = -1
		enemy["pos"] = pos
		enemy["dir"] = dir
		if float(enemy["hit"]) > 0.0:
			enemy["hit"] = maxf(0.0, float(enemy["hit"]) - delta)
		var enemy_rect: Rect2 = Rect2(pos - Vector2(20.0, 38.0), Vector2(40.0, 38.0))
		if player_rect().intersects(enemy_rect):
			if player_vel.y > 110.0 and player_pos.y - PLAYER_H * 0.5 < pos.y - 22.0:
				enemy["alive"] = false
				player_vel.y = JUMP_SPEED * 0.62
				score += 250
				message = "Stomp."
				message_timer = 0.9
			elif hurt_timer <= 0.0:
				hurt_player("Gegnerkontakt.")
		enemies[i] = enemy

func hit_near_enemy() -> void:
	var attack_rect: Rect2 = Rect2(player_pos + Vector2(float(facing) * 12.0, -44.0), Vector2(float(facing) * 58.0, 34.0)).abs()
	for i in range(enemies.size()):
		var enemy: Dictionary = enemies[i]
		if not bool(enemy["alive"]):
			continue
		var enemy_rect := Rect2(enemy["pos"] - Vector2(20.0, 38.0), Vector2(40.0, 38.0))
		if attack_rect.intersects(enemy_rect):
			enemy["alive"] = false
			enemies[i] = enemy
			score += 180
			message = "Treffer."
			message_timer = 0.8
			return

func collect_items() -> void:
	for i in range(rings.size()):
		var ring: Dictionary = rings[i]
		if bool(ring["taken"]):
			continue
		if player_pos.distance_to(ring["pos"]) < 34.0:
			ring["taken"] = true
			ring_combo += 1
			score += ring_combo * 35
			stamina = minf(100.0, stamina + 9.0)
			if ring_combo % 5 == 0:
				dash_charges = 1
				message = "Flow-Dash wieder bereit."
				message_timer = 0.9
			rings[i] = ring
	for i in range(shards.size()):
		var shard: Dictionary = shards[i]
		if bool(shard["taken"]):
			continue
		if player_pos.distance_to(shard["pos"]) < 36.0:
			shard["taken"] = true
			shard_count += 1
			score += 300
			message = "Rune %d/8." % shard_count
			message_timer = 1.4
			shards[i] = shard

func check_checkpoints() -> void:
	for i in range(checkpoints.size()):
		var cp: Vector2 = checkpoints[i]
		if i <= checkpoint_index:
			continue
		if player_pos.distance_to(cp) < 52.0:
			checkpoint_index = i
			spawn_pos = cp
			score += 250
			message = "Checkpoint."
			message_timer = 1.2

func check_gates() -> void:
	if not mode_learn:
		return
	var q: Dictionary = current_question()
	for i in range(gates.size()):
		var gate: Dictionary = gates[i]
		if not bool(gate["armed"]):
			continue
		if player_rect().intersects(gate["rect"]):
			gate["armed"] = false
			gates[i] = gate
			if int(gate["index"]) == int(q["correct"]):
				learn_hits += 1
				var repeated := bool(q.get("repeat", false))
				score += 850 if repeated else 700
				stamina = 100.0
				dash_charges = 1
				shard_count = mini(8, shard_count + 1)
				_remove_repeat(q)
				if repeated:
					message = "Wiederholung geloest: %s (%d/%d)." % [str(gate["label"]), learn_hits, LEARN_GOAL]
				else:
					message = "Richtiges Gate: %s (%d/%d)." % [str(gate["label"]), learn_hits, LEARN_GOAL]
				question_index += 1
				setup_gates()
			else:
				mistakes += 1
				_queue_repeat(q)
				hurt_player("Falsches Gate. Tipp: %s" % str(q["hint"]))
			message_timer = 2.0
			return

func check_finish() -> void:
	if player_pos.x > 5120.0 and (shard_count >= 3 or (mode_learn and learn_hits >= LEARN_GOAL)):
		won = true
		score += 1500 + shard_count * 200
		message = "Portal erreicht. Score %d. R startet neu." % score
		message_timer = 99.0
	elif player_pos.x > 5120.0:
		message = "Portal braucht 3 Runen oder %d Lern-Gates." % LEARN_GOAL
		message_timer = 1.5

func hurt_player(text: String) -> void:
	if hurt_timer > 0.0:
		return
	hp -= 1
	hurt_timer = 1.0
	player_vel = Vector2(-float(facing) * 240.0, -360.0)
	ring_combo = 0
	message = text
	message_timer = 1.4
	if hp <= 0:
		game_over = true
		message = "Game Over. R startet neu."
		message_timer = 99.0

func respawn(text: String) -> void:
	hp -= 1
	player_pos = spawn_pos
	player_vel = Vector2.ZERO
	jumps_left = 2
	hurt_timer = 1.0
	message = text
	message_timer = 1.2
	if hp <= 0:
		game_over = true
		message = "Game Over. R startet neu."
		message_timer = 99.0

func player_rect() -> Rect2:
	return Rect2(player_pos - Vector2(PLAYER_W * 0.5, PLAYER_H), Vector2(PLAYER_W, PLAYER_H))

func update_camera() -> void:
	camera_x = clampf(player_pos.x - size.x * 0.38, 0.0, maxf(0.0, WORLD_W - size.x))

func world_y_offset() -> float:
	if size.y > size.x * 1.2:
		return minf(780.0, maxf(0.0, size.y - 720.0) * 0.32)
	return 0.0

func screen_pos(world: Vector2) -> Vector2:
	return world - Vector2(camera_x, 0.0) + Vector2(0.0, world_y_offset())

func screen_rect(rect: Rect2) -> Rect2:
	return Rect2(rect.position - Vector2(camera_x, 0.0) + Vector2(0.0, world_y_offset()), rect.size)

func _draw() -> void:
	draw_background()
	draw_level()
	draw_items()
	draw_enemies()
	draw_player()
	draw_hud()

func draw_background() -> void:
	var y_offset := world_y_offset()
	var horizon_y := y_offset + 720.0 * 0.55
	draw_rect(Rect2(Vector2.ZERO, size), Color.html("#071421"), true)
	draw_rect(Rect2(Vector2.ZERO, Vector2(size.x, minf(size.y, horizon_y))), Color.html("#10446d"), true)
	for i in range(9):
		var x: float = float(i) * 230.0 - fmod(camera_x * 0.18, 230.0)
		draw_rect(Rect2(Vector2(x, y_offset + 720.0 * 0.28 + sin(float(i)) * 18.0), Vector2(170.0, 150.0)), Color(0.09, 0.18, 0.24, 0.55), true)
	for i in range(18):
		var x2: float = float(i) * 118.0 - fmod(camera_x * 0.42, 118.0)
		draw_rect(Rect2(Vector2(x2, y_offset + 720.0 * 0.52), Vector2(74.0, 8.0)), Color(0.76, 0.9, 1.0, 0.08), true)
	draw_rect(Rect2(Vector2(0.0, horizon_y), Vector2(size.x, maxf(0.0, size.y - horizon_y))), Color.html("#0a2f2d"), true)

func draw_level() -> void:
	for p in platforms:
		draw_platform(p, Color.html("#334155"))
	for platform in moving_platforms:
		draw_platform(moving_rect(platform), Color.html("#0ea5e9"))
	for hook in grapples:
		var pos: Vector2 = screen_pos(hook)
		draw_circle(pos, 12.0, Color.html("#facc15"))
		draw_circle(pos, 5.0, Color.html("#0f172a"))
	for i in range(checkpoints.size()):
		var cp: Vector2 = checkpoints[i]
		var pos := screen_pos(cp)
		var color: Color = Color.html("#22c55e") if i <= checkpoint_index else Color.html("#64748b")
		draw_rect(Rect2(pos - Vector2(8.0, 54.0), Vector2(16.0, 54.0)), color, true)
		draw_polygon(PackedVector2Array([pos + Vector2(8.0, -54.0), pos + Vector2(54.0, -39.0), pos + Vector2(8.0, -24.0)]), PackedColorArray([color]))
	if mode_learn:
		draw_gates()
	draw_portal()

func draw_platform(rect: Rect2, color: Color) -> void:
	var r: Rect2 = screen_rect(rect)
	if r.position.x > size.x or r.position.x + r.size.x < 0.0:
		return
	draw_rect(r, color, true)
	draw_rect(Rect2(r.position, Vector2(r.size.x, 6.0)), color.lightened(0.32), true)
	draw_line(r.position + Vector2(0.0, r.size.y), r.position + r.size, Color(0.0, 0.0, 0.0, 0.28), 3.0)

func draw_gates() -> void:
	var font := get_theme_default_font()
	for gate in gates:
		var item: Dictionary = gate
		if not bool(item["armed"]):
			continue
		var r: Rect2 = screen_rect(item["rect"])
		var is_repeat := bool(item.get("repeat", false))
		draw_rect(r, Color(0.05, 0.2, 0.33, 0.52) if not is_repeat else Color(0.23, 0.08, 0.35, 0.62), true)
		draw_rect(r, Color.html("#38bdf8") if not is_repeat else Color.html("#f0abfc"), false, 3.0)
		draw_rect(Rect2(r.position + Vector2(0.0, 0.0), Vector2(r.size.x, 9.0)), Color(0.56, 0.19, 1.0, 0.38) if not is_repeat else Color(0.98, 0.59, 1.0, 0.48), true)
		draw_string(font, r.position + Vector2(4.0, r.size.y * 0.58), str(item["label"]), HORIZONTAL_ALIGNMENT_CENTER, r.size.x - 8.0, 13, Color.html("#f8fafc"))

func draw_portal() -> void:
	var pos := screen_pos(Vector2(5200.0, 510.0))
	var color: Color = Color.html("#a855f7") if shard_count >= 3 else Color.html("#475569")
	draw_circle(pos + Vector2(0.0, -60.0), 58.0, Color(color.r, color.g, color.b, 0.35))
	draw_arc(pos + Vector2(0.0, -60.0), 58.0, 0.0, TAU, 24, color, 6.0)
	draw_string(get_theme_default_font(), pos + Vector2(-50.0, -54.0), "PORTAL", HORIZONTAL_ALIGNMENT_CENTER, 100.0, 14, Color.html("#f8fafc"))

func draw_items() -> void:
	for ring in rings:
		var item: Dictionary = ring
		if bool(item["taken"]):
			continue
		var pos: Vector2 = screen_pos(item["pos"])
		if pos.x < -40.0 or pos.x > size.x + 40.0:
			continue
		draw_arc(pos, 13.0, 0.0, TAU, 16, Color.html("#facc15"), 4.0)
	for shard in shards:
		var item: Dictionary = shard
		if bool(item["taken"]):
			continue
		var pos: Vector2 = screen_pos(item["pos"])
		if pos.x < -50.0 or pos.x > size.x + 50.0:
			continue
		draw_polygon(PackedVector2Array([pos + Vector2(0.0, -18.0), pos + Vector2(15.0, 0.0), pos + Vector2(0.0, 18.0), pos + Vector2(-15.0, 0.0)]), PackedColorArray([Color.html("#38bdf8")]))
		draw_arc(pos, 20.0, 0.0, TAU, 8, Color.html("#f8fafc"), 2.0)

func draw_enemies() -> void:
	for enemy in enemies:
		var item: Dictionary = enemy
		if not bool(item["alive"]):
			continue
		var pos: Vector2 = screen_pos(item["pos"])
		if pos.x < -60.0 or pos.x > size.x + 60.0:
			continue
		var color: Color = Color.html("#ef4444") if float(item["hit"]) <= 0.0 else Color.html("#f8fafc")
		draw_rect(Rect2(pos - Vector2(20.0, 38.0), Vector2(40.0, 38.0)), color, true)
		draw_rect(Rect2(pos + Vector2(-10.0, -28.0), Vector2(6.0, 6.0)), Color.html("#020617"), true)
		draw_rect(Rect2(pos + Vector2(5.0, -28.0), Vector2(6.0, 6.0)), Color.html("#020617"), true)

func draw_player() -> void:
	var rect: Rect2 = screen_rect(player_rect())
	var body: Color = Color.html("#facc15") if hurt_timer <= 0.0 or int(hurt_timer * 12.0) % 2 == 0 else Color.html("#f8fafc")
	draw_rect(Rect2(rect.position + Vector2(-3.0, rect.size.y - 4.0), Vector2(rect.size.x + 6.0, 7.0)), Color(0.0, 0.0, 0.0, 0.28), true)
	draw_rect(rect, body, true)
	draw_rect(Rect2(rect.position + Vector2(7.0, 8.0), Vector2(20.0, 8.0)), Color.html("#fde68a"), true)
	draw_rect(Rect2(rect.position + Vector2(7.0, 31.0), Vector2(6.0, 6.0)), Color.html("#020617"), true)
	draw_rect(Rect2(rect.position + Vector2(21.0, 31.0), Vector2(6.0, 6.0)), Color.html("#020617"), true)
	if dash_timer > 0.0:
		draw_rect(rect.grow(8.0), Color(0.32, 0.81, 1.0, 0.22), true)
	if attack_timer > 0.0:
		var blade := Rect2(rect.position + Vector2(float(facing) * 18.0, 14.0), Vector2(float(facing) * 58.0, 12.0)).abs()
		draw_rect(blade, Color(0.96, 0.95, 0.68, 0.68), true)

func draw_hud() -> void:
	var font := get_theme_default_font()
	draw_rect(Rect2(12.0, 12.0, minf(size.x - 24.0, 548.0), 112.0), Color(0.02, 0.05, 0.09, 0.75), true)
	draw_string(font, Vector2(25.0, 40.0), "FASKA PARKOUR PRO", HORIZONTAL_ALIGNMENT_LEFT, -1, 22, Color.html("#facc15"))
	draw_string(font, Vector2(25.0, 66.0), "HP %d  Stamina %d  Runen %d/8  Score %d" % [hp, int(stamina), shard_count, score], HORIZONTAL_ALIGNMENT_LEFT, -1, 15, Color.html("#f8fafc"))
	draw_string(font, Vector2(25.0, 89.0), "Jumps %d  Dash %d  Checkpoint %d/3  Mode %s" % [jumps_left, dash_charges, checkpoint_index, "Learncade" if mode_learn else "Normal"], HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.html("#cbd5e1"))
	draw_string(font, Vector2(25.0, 111.0), "Fach %s  Lernziel %d/%d  Fehler %d  Wdh %d" % [str(LESSONS[lesson_index]), learn_hits, LEARN_GOAL, mistakes, repeat_queue.size()], HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color.html("#fde68a"))
	if mode_learn:
		var q: Dictionary = current_question()
		draw_rect(Rect2(size.x * 0.5 - 330.0, 28.0, 660.0, 38.0), Color(0.02, 0.05, 0.09, 0.76), true)
		draw_string(font, Vector2(size.x * 0.5 - 310.0, 53.0), str(q["prompt"]), HORIZONTAL_ALIGNMENT_CENTER, 620.0, 17, Color.html("#f8fafc"))
	if message_timer > 0.0:
		draw_rect(Rect2(12.0, size.y - 44.0, minf(size.x - 24.0, 850.0), 30.0), Color(0.02, 0.05, 0.09, 0.76), true)
		draw_string(font, Vector2(26.0, size.y - 22.0), message, HORIZONTAL_ALIGNMENT_LEFT, minf(size.x - 52.0, 820.0), 15, Color.html("#f8fafc"))
	draw_rect(Rect2(size.x - 230.0, 18.0, 200.0, 12.0), Color.html("#0f172a"), true)
	draw_rect(Rect2(size.x - 230.0, 18.0, 200.0 * clampf(player_pos.x / WORLD_W, 0.0, 1.0), 12.0), Color.html("#22c55e"), true)
	draw_string(font, Vector2(size.x - 230.0, 52.0), "%d%% STRECKE" % int(player_pos.x / WORLD_W * 100.0), HORIZONTAL_ALIGNMENT_LEFT, -1, 17, Color.html("#f8fafc"))
	draw_string(font, Vector2(size.x * 0.5 - 330.0, size.y - 18.0), "A/D oder Touch-Stick laufen · W Jump · Space Dash · J Grapple · K Angriff · L Lernen · C Fach · R Neustart", HORIZONTAL_ALIGNMENT_CENTER, 660.0, 12, Color.html("#cbd5e1"))

func _question_id(question: Dictionary) -> String:
	return "%s|%s" % [str(question.get("lesson", str(LESSONS[lesson_index]))), str(question.get("prompt", ""))]

func _queue_repeat(question: Dictionary) -> void:
	var qid := _question_id(question)
	for item in repeat_queue:
		if _question_id(item) == qid:
			return
	if repeat_queue.size() >= 6:
		repeat_queue.pop_front()
	var copy := question.duplicate(true)
	copy["repeat"] = true
	copy["lesson"] = str(LESSONS[lesson_index])
	repeat_queue.append(copy)

func _remove_repeat(question: Dictionary) -> void:
	var qid := _question_id(question)
	for i in range(repeat_queue.size() - 1, -1, -1):
		if _question_id(repeat_queue[i]) == qid:
			repeat_queue.remove_at(i)
