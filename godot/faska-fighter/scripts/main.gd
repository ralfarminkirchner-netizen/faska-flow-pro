extends Control

const STAGE_LEFT := 86.0
const STAGE_RIGHT := 1194.0
const GRAVITY := 1540.0
const LEARN_GOAL := 7
const LESSONS := ["WORTART", "MATHE", "SATZ", "LESEN", "KOMPOSITUM", "ENGLISCH"]

const QUESTIONS_WORD := [
	{"prompt": "Welche Wortart ist 'mutig'?", "answers": ["Nomen", "Verb", "Adjektiv"], "correct": 2, "hint": "Mutig beschreibt eine Eigenschaft."},
	{"prompt": "Welche Wortart ist 'kaempfen'?", "answers": ["Verb", "Artikel", "Nomen"], "correct": 0, "hint": "Kaempfen ist etwas, das man tun kann."},
	{"prompt": "Welche Wortart ist 'der'?", "answers": ["Adjektiv", "Artikel", "Verb"], "correct": 1, "hint": "Der steht vor einem Nomen."},
	{"prompt": "Welche Wortart ist 'Arena'?", "answers": ["Nomen", "Verb", "Artikel"], "correct": 0, "hint": "Eine Arena ist ein Ort."},
	{"prompt": "Welche Wortart ist 'schnell'?", "answers": ["Verb", "Adjektiv", "Nomen"], "correct": 1, "hint": "Schnell sagt, wie etwas passiert."},
	{"prompt": "Welche Wortart ist 'gegen'?", "answers": ["Praeposition", "Verb", "Nomen"], "correct": 0, "hint": "Gegen zeigt eine Beziehung oder Richtung."},
	{"prompt": "Welche Wortart ist 'wir'?", "answers": ["Pronomen", "Artikel", "Adjektiv"], "correct": 0, "hint": "Wir steht fuer Personen."},
	{"prompt": "Welche Wortart ist 'heute'?", "answers": ["Adverb", "Nomen", "Verb"], "correct": 0, "hint": "Heute sagt, wann etwas passiert."},
	{"prompt": "Welche Wortart ist 'blockt'?", "answers": ["Nomen", "Verb", "Artikel"], "correct": 1, "hint": "Blockt beschreibt eine Handlung."},
]

const QUESTIONS_MATH := [
	{"prompt": "Welche Kombo trifft? 8 + 7", "answers": ["14", "15", "16"], "correct": 1, "hint": "Von 8 sieben weiter zaehlen."},
	{"prompt": "Welche Zahl ist gerade?", "answers": ["19", "21", "24"], "correct": 2, "hint": "Gerade Zahlen sind durch 2 teilbar."},
	{"prompt": "Welche Zahl fehlt? 6 x ? = 30", "answers": ["4", "5", "6"], "correct": 1, "hint": "Fuenf Sechser sind dreissig."},
	{"prompt": "Was ist 42 - 18?", "answers": ["22", "24", "26"], "correct": 1, "hint": "Erst 42 - 20, dann 2 dazu."},
	{"prompt": "Welche Zahl ist groesser als 3/4?", "answers": ["1/2", "2/3", "5/6"], "correct": 2, "hint": "5 von 6 Teilen ist sehr viel."},
	{"prompt": "Was ist 7 x 8?", "answers": ["54", "56", "58"], "correct": 1, "hint": "Sieben Achter sind 56."},
	{"prompt": "Welche Zahl fehlt? ? + 17 = 39", "answers": ["20", "22", "24"], "correct": 1, "hint": "39 minus 17 ist 22."},
	{"prompt": "Was ist 72 : 9?", "answers": ["7", "8", "9"], "correct": 1, "hint": "9 mal 8 ist 72."},
	{"prompt": "Welche Zahl ist ein Vielfaches von 6?", "answers": ["32", "36", "40"], "correct": 1, "hint": "6 mal 6 ist 36."},
]

const QUESTIONS_SENTENCE := [
	{"prompt": "Was ist das Subjekt? Luna blockt den Schlag.", "answers": ["Luna", "blockt", "den Schlag"], "correct": 0, "hint": "Wer blockt?"},
	{"prompt": "Was ist das Praedikat? Bruno springt hoch.", "answers": ["Bruno", "springt", "hoch"], "correct": 1, "hint": "Was tut Bruno?"},
	{"prompt": "Welches Wort passt? Der Kaempfer ___ aus.", "answers": ["weicht", "gruen", "die"], "correct": 0, "hint": "Gesucht ist ein Verb."},
	{"prompt": "Welches Satzglied ist 'in der Arena'?", "answers": ["Ort", "Zeit", "Grund"], "correct": 0, "hint": "Es sagt, wo etwas passiert."},
	{"prompt": "Welches Wort beendet den Satz sinnvoll? Der Schild ist ___.", "answers": ["stark", "rennt", "und"], "correct": 0, "hint": "Gesucht ist eine Eigenschaft."},
	{"prompt": "Was ist das Objekt? Roni trifft den Kristall.", "answers": ["Roni", "trifft", "den Kristall"], "correct": 2, "hint": "Was trifft Roni?"},
	{"prompt": "Welche Satzstelle nennt die Zeit? Nach dem Gong startet der Kampf.", "answers": ["Nach dem Gong", "startet", "der Kampf"], "correct": 0, "hint": "Wann startet der Kampf?"},
	{"prompt": "Welches Satzzeichen passt? Blockst du", "answers": [".", "?", ","], "correct": 1, "hint": "Das ist eine Frage."},
	{"prompt": "Welcher Satz ist vollstaendig?", "answers": ["Der Gegner stark.", "Der Gegner taumelt.", "Der Gegner und."], "correct": 1, "hint": "Subjekt und Praedikat sind vorhanden."},
]

const QUESTIONS_READING := [
	{"prompt": "Lies genau: Triff den Schild-Kristall.", "answers": ["Schild", "Schatz", "Schule"], "correct": 0, "hint": "Der Satz nennt den Schild."},
	{"prompt": "Welches Wort beginnt wie Schlag?", "answers": ["Schule", "Tor", "Kampf"], "correct": 0, "hint": "Beide beginnen mit Sch."},
	{"prompt": "Welches Wort reimt sich auf Hieb?", "answers": ["lieb", "hoch", "schnell"], "correct": 0, "hint": "Beide enden auf -ieb."},
	{"prompt": "Welches Wort hat zwei Silben?", "answers": ["Block", "Luna", "Tor"], "correct": 1, "hint": "Lu-na."},
	{"prompt": "Welche Anweisung passt? Weiche nach links aus.", "answers": ["links", "rechts", "oben"], "correct": 0, "hint": "Die Richtung steht im Satz."},
	{"prompt": "Welches Wort ist laenger?", "answers": ["Jab", "Supermeter", "Low"], "correct": 1, "hint": "Supermeter hat viel mehr Buchstaben."},
]

const QUESTIONS_COMPOUND := [
	{"prompt": "Welche zwei Woerter stecken in Kampfarena?", "answers": ["Kampf + Arena", "Kamm + Arena", "Kampf + Arm"], "correct": 0, "hint": "Es ist eine Arena fuer den Kampf."},
	{"prompt": "Welches Kompositum passt: Schild + Block", "answers": ["Schildblock", "Blockschild", "Schildblick"], "correct": 0, "hint": "Das passt zum Blocken."},
	{"prompt": "Was ist das Grundwort von Trefferanzeige?", "answers": ["Treffer", "Anzeige", "zeigen"], "correct": 1, "hint": "Das letzte Wort bestimmt die Sache."},
	{"prompt": "Welches Wort ist kein Kompositum?", "answers": ["Schwertgriff", "Arenator", "schnell"], "correct": 2, "hint": "Schnell ist eine Eigenschaft."},
	{"prompt": "Welches Bestimmungswort hat Supermeter?", "answers": ["Super", "Meter", "mehr"], "correct": 0, "hint": "Super beschreibt den Meter genauer."},
	{"prompt": "Welche Verbindung passt? Gegner + Druck", "answers": ["Gegnerdruck", "Druckgegner", "Gegendruck"], "correct": 0, "hint": "So nennt man Druck durch den Gegner."},
]

const QUESTIONS_ENGLISH := [
	{"prompt": "Was heisst 'Schild' auf Englisch?", "answers": ["sword", "shield", "stage"], "correct": 1, "hint": "Ein shield blockt Treffer."},
	{"prompt": "Was heisst 'springen'?", "answers": ["jump", "run", "hit"], "correct": 0, "hint": "W springt auch im Spiel."},
	{"prompt": "Was heisst 'stark'?", "answers": ["slow", "strong", "short"], "correct": 1, "hint": "Strong ist stark."},
	{"prompt": "Was heisst 'Treffer'?", "answers": ["hit", "miss", "guard"], "correct": 0, "hint": "Hit steht auch bei Kombos."},
	{"prompt": "Was heisst 'schnell'?", "answers": ["fast", "flat", "full"], "correct": 0, "hint": "Fast bedeutet schnell."},
	{"prompt": "Was heisst 'kick'?", "answers": ["Tritt", "Schild", "Runde"], "correct": 0, "hint": "Kick ist ein Tritt."},
	{"prompt": "Was heisst 'round'?", "answers": ["Runde", "Schlag", "links"], "correct": 0, "hint": "Eine Runde im Kampf."},
	{"prompt": "Was heisst 'low'?", "answers": ["tief", "hoch", "laut"], "correct": 0, "hint": "Low attacks treffen unten."},
	{"prompt": "Was heisst 'guard'?", "answers": ["blocken", "springen", "fallen"], "correct": 0, "hint": "Guard schuetzt dich."},
]

class TouchFighterOverlay:
	extends Control

	var move_x := 0.0
	var guard_down := false
	var light_down := false
	var heavy_down := false
	var low_down := false
	var dash_down := false
	var super_down := false
	var throw_down := false
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
				if event.position.x < size.x * 0.42:
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
		if absf(diff) < 18.0 * ui:
			move_x = 0.0
		else:
			move_x = clampf(diff / (86.0 * ui), -1.0, 1.0)

	func _refresh_buttons() -> void:
		guard_down = false
		light_down = false
		heavy_down = false
		low_down = false
		dash_down = false
		super_down = false
		throw_down = false
		learn_down = false
		subject_down = false
		for key in _button_touches.keys():
			var action: String = str(_button_touches[key])
			if action == "guard":
				guard_down = true
			elif action == "light":
				light_down = true
			elif action == "heavy":
				heavy_down = true
			elif action == "low":
				low_down = true
			elif action == "dash":
				dash_down = true
			elif action == "super":
				super_down = true
			elif action == "throw":
				throw_down = true
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
		return Vector2(128.0 * _ui_scale(), size.y - 196.0 * _ui_scale())

	func _buttons() -> Array:
		var ui := _ui_scale()
		var w := 92.0 * ui
		var h := 66.0 * ui
		var gap := 12.0 * ui
		var x := size.x - (w * 3.0 + gap * 2.0 + 24.0 * ui)
		var y := size.y - (h * 3.0 + gap * 2.0 + 108.0 * ui)
		return [
			{"action": "learn", "label": "L\nLern", "rect": Rect2(Vector2(x, y), Vector2(w, h))},
			{"action": "subject", "label": "C\nFach", "rect": Rect2(Vector2(x + w + gap, y), Vector2(w, h))},
			{"action": "super", "label": "I\nSuper", "rect": Rect2(Vector2(x + (w + gap) * 2.0, y), Vector2(w, h))},
			{"action": "light", "label": "J\nJab", "rect": Rect2(Vector2(x, y + h + gap), Vector2(w, h))},
			{"action": "heavy", "label": "K\nKick", "rect": Rect2(Vector2(x + w + gap, y + h + gap), Vector2(w, h))},
			{"action": "guard", "label": "G\nBlock", "rect": Rect2(Vector2(x + (w + gap) * 2.0, y + h + gap), Vector2(w, h))},
			{"action": "low", "label": "U\nLow", "rect": Rect2(Vector2(x, y + (h + gap) * 2.0), Vector2(w, h))},
			{"action": "dash", "label": "A\nDash", "rect": Rect2(Vector2(x + w + gap, y + (h + gap) * 2.0), Vector2(w, h))},
			{"action": "throw", "label": "O\nThrow", "rect": Rect2(Vector2(x + (w + gap) * 2.0, y + (h + gap) * 2.0), Vector2(w, h))},
		]

	func _draw() -> void:
		if not _should_show():
			return
		_draw_stick()
		_draw_buttons()

	func _should_show() -> bool:
		return size.x < 980.0 or size.y > size.x * 1.2

	func _ui_scale() -> float:
		if size.x <= 520.0 or size.y > size.x * 1.35:
			return 1.12
		return 1.0

	func _draw_stick() -> void:
		var ui := _ui_scale()
		var center := _stick_center()
		draw_circle(center, 96.0 * ui, Color(0.02, 0.05, 0.09, 0.5))
		draw_arc(center, 96.0 * ui, 0.0, TAU, 36, Color(0.78, 0.88, 1.0, 0.52), 5.0 * ui)
		draw_circle(center + Vector2(move_x * 54.0 * ui, 0.0), 36.0 * ui, Color(0.93, 0.96, 1.0, 0.78))

	func _draw_buttons() -> void:
		var font := get_theme_default_font()
		var ui := _ui_scale()
		for button in _buttons():
			var rect: Rect2 = button["rect"]
			var action := str(button["action"])
			var active := (action == "guard" and guard_down) or (action == "light" and light_down) or (action == "heavy" and heavy_down) or (action == "low" and low_down) or (action == "dash" and dash_down) or (action == "super" and super_down) or (action == "throw" and throw_down) or (action == "learn" and learn_down) or (action == "subject" and subject_down)
			draw_rect(rect, Color(0.02, 0.05, 0.09, 0.66), true)
			draw_rect(rect, Color.html("#facc15") if active else Color(0.78, 0.88, 1.0, 0.55), false, 4.0 * ui)
			var lines := str(button["label"]).split("\n")
			for i in range(lines.size()):
				draw_string(font, rect.position + Vector2(0.0, (26.0 + float(i) * 22.0) * ui), lines[i], HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, 19 * ui, Color.html("#f8fafc"))

var player: Dictionary = {}
var rival: Dictionary = {}
var mode_learn := false
var lesson_index := 0
var question_index := 0
var repeat_queue := []
var learn_hits := 0
var mistakes := 0
var answer_crystals: Array = []
var hit_sparks: Array = []
var score := 0
var player_rounds := 0
var rival_rounds := 0
var round_number := 1
var round_time := 99.0
var round_over := false
var match_over := false
var message := "Godot Fighter: Abstand, Blocken, Whiff-Punish, Kombos und Supermeter."
var message_timer := 4.0
var shake_timer := 0.0
var flash_timer := 0.0
var touch_overlay: TouchFighterOverlay
var last_touch_light := false
var last_touch_heavy := false
var last_touch_low := false
var last_touch_dash := false
var last_touch_super := false
var last_touch_throw := false
var last_touch_guard := false
var last_touch_learn := false
var last_touch_subject := false
var rival_style := "Striker"

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_STOP
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	touch_overlay = TouchFighterOverlay.new()
	add_child(touch_overlay)
	reset_game()

func reset_game() -> void:
	player_rounds = 0
	rival_rounds = 0
	round_number = 1
	match_over = false
	rival_style = "Striker"
	player = make_fighter(Vector2(lerpf(arena_left(), arena_right(), 0.28), ground_y()), 1, Color.html("#facc15"), Color.html("#22d3ee"))
	rival = make_fighter(Vector2(lerpf(arena_left(), arena_right(), 0.72), ground_y()), -1, Color.html("#ef4444"), Color.html("#7c3aed"))
	rival["ai_timer"] = 1.05
	mode_learn = false
	lesson_index = 0
	question_index = 0
	repeat_queue.clear()
	learn_hits = 0
	mistakes = 0
	score = 0
	round_time = 99.0
	round_over = false
	shake_timer = 0.0
	flash_timer = 0.0
	hit_sparks.clear()
	setup_answers()
	message = "Runde 1: Abstand kontrollieren, blocken, Counter-Hits suchen. L schaltet Lernen zu."
	message_timer = 4.0

func start_next_round() -> void:
	round_number += 1
	rival_style = _style_for_round(round_number)
	player = make_fighter(Vector2(lerpf(arena_left(), arena_right(), 0.28), ground_y()), 1, Color.html("#facc15"), Color.html("#22d3ee"))
	rival = make_fighter(Vector2(lerpf(arena_left(), arena_right(), 0.72), ground_y()), -1, Color.html("#ef4444"), Color.html("#7c3aed"))
	rival["ai_timer"] = 0.95
	round_time = 99.0
	round_over = false
	shake_timer = 0.0
	flash_timer = 0.0
	hit_sparks.clear()
	setup_answers()
	message = "Runde %d. CPU-Stil: %s. Fight!" % [round_number, rival_style]
	message_timer = 2.2

func _style_for_round(number: int) -> String:
	var styles := ["Striker", "Grappler", "Counter"]
	return str(styles[(number - 1) % styles.size()])

func make_fighter(pos: Vector2, face: int, body: Color, trim: Color) -> Dictionary:
	return {
		"pos": pos,
		"vel": Vector2.ZERO,
		"face": face,
		"hp": 100,
		"max_hp": 100,
		"stamina": 100.0,
		"super": 0.0,
		"attack": "none",
		"attack_time": 0.0,
		"attack_cooldown": 0.0,
		"attack_hit": false,
		"hitstun": 0.0,
		"guard": false,
		"crouch": false,
		"parry": 0.0,
		"throw_escape": 0.0,
		"knockdown": 0.0,
		"dash": 0.0,
		"combo": 0,
		"combo_timer": 0.0,
		"anim": 0.0,
		"body": body,
		"trim": trim,
		"ai_timer": 0.2,
		"ai_seed": pos.x * 0.013,
	}

func setup_answers() -> void:
	answer_crystals.clear()
	var q: Dictionary = current_question()
	var answers: Array = q["answers"]
	var xs: Array = [
		lerpf(arena_left(), arena_right(), 0.28),
		lerpf(arena_left(), arena_right(), 0.5),
		lerpf(arena_left(), arena_right(), 0.72),
	]
	for i in range(answers.size()):
		answer_crystals.append({"pos": Vector2(xs[i], ground_y() - 160.0), "label": answers[i], "index": i, "armed": true, "repeat": q.get("repeat", false)})

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
	setup_answers()
	message = "Fach: %s. Neue Kristalle sind aktiv." % str(LESSONS[lesson_index])
	message_timer = 2.0

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_R:
			if round_over and not match_over:
				start_next_round()
			else:
				reset_game()
		elif event.keycode == KEY_L:
			mode_learn = not mode_learn
			setup_answers()
			message = "Learncade: richtige Kristalle erzeugen Supermeter und Guard-Break." if mode_learn else "Normalmodus: reines 1v1-Fighting."
			message_timer = 3.0
		elif event.keycode == KEY_C:
			cycle_lesson()
		elif event.keycode == KEY_J:
			player = start_attack(player, "light")
		elif event.keycode == KEY_K:
			player = start_attack(player, "heavy")
		elif event.keycode == KEY_U:
			player = start_attack(player, "low")
		elif event.keycode == KEY_I:
			player = start_attack(player, "super")
		elif event.keycode == KEY_O:
			player = start_attack(player, "throw")
		elif event.keycode == KEY_G:
			player = start_parry(player)
		elif event.keycode == KEY_SPACE:
			player = start_dash(player)

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()
	if message_timer > 0.0:
		message_timer -= delta
	if shake_timer > 0.0:
		shake_timer -= delta
	if flash_timer > 0.0:
		flash_timer -= delta
	if round_over:
		update_hit_sparks(delta)
		queue_redraw()
		return
	round_time = maxf(0.0, round_time - delta)
	update_touch_actions()
	update_player_intent()
	update_ai(delta)
	player = update_fighter(player, delta)
	rival = update_fighter(rival, delta)
	resolve_attacks()
	update_hit_sparks(delta)
	update_answer_crystals()
	check_round_end()
	queue_redraw()

func update_touch_actions() -> void:
	if touch_overlay == null:
		return
	if touch_overlay.light_down and not last_touch_light:
		player = start_attack(player, "light")
	if touch_overlay.heavy_down and not last_touch_heavy:
		player = start_attack(player, "heavy")
	if touch_overlay.low_down and not last_touch_low:
		player = start_attack(player, "low")
	if touch_overlay.dash_down and not last_touch_dash:
		player = start_dash(player)
	if touch_overlay.super_down and not last_touch_super:
		player = start_attack(player, "super")
	if touch_overlay.throw_down and not last_touch_throw:
		player = start_attack(player, "throw")
	if touch_overlay.guard_down and not last_touch_guard:
		player = start_parry(player)
	if touch_overlay.learn_down and not last_touch_learn:
		mode_learn = not mode_learn
		setup_answers()
		message = "Learncade aktiv." if mode_learn else "Normalmodus aktiv."
		message_timer = 1.8
	if touch_overlay.subject_down and not last_touch_subject:
		cycle_lesson()
	last_touch_light = touch_overlay.light_down
	last_touch_heavy = touch_overlay.heavy_down
	last_touch_low = touch_overlay.low_down
	last_touch_dash = touch_overlay.dash_down
	last_touch_super = touch_overlay.super_down
	last_touch_throw = touch_overlay.throw_down
	last_touch_guard = touch_overlay.guard_down
	last_touch_learn = touch_overlay.learn_down
	last_touch_subject = touch_overlay.subject_down

func update_player_intent() -> void:
	var p_pos: Vector2 = player["pos"]
	var r_pos: Vector2 = rival["pos"]
	player["face"] = 1 if r_pos.x >= p_pos.x else -1
	if float(player["knockdown"]) > 0.0:
		player["guard"] = false
		player["crouch"] = false
		var down_vel: Vector2 = player["vel"]
		down_vel.x = 0.0
		player["vel"] = down_vel
		return
	var dir := 0.0
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		dir -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		dir += 1.0
	if touch_overlay != null and absf(touch_overlay.move_x) > 0.08:
		dir = touch_overlay.move_x
	var away: bool = dir != 0.0 and signf(dir) != float(player["face"])
	var crouch: bool = Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN)
	if touch_overlay != null and touch_overlay.guard_down:
		crouch = true
	player["crouch"] = crouch
	player["guard"] = (away or crouch or (touch_overlay != null and touch_overlay.guard_down)) and str(player["attack"]) == "none" and float(player["hitstun"]) <= 0.0
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		player = jump_fighter(player)
	var velocity: Vector2 = player["vel"]
	var speed: float = 255.0 if not bool(player["guard"]) else 128.0
	if float(player["dash"]) > 0.0:
		speed = 520.0
		dir = float(player["face"])
	if str(player["attack"]) != "none" or float(player["hitstun"]) > 0.0:
		dir = 0.0
	velocity.x = dir * speed
	player["vel"] = velocity

func update_ai(delta: float) -> void:
	if float(rival["knockdown"]) > 0.0:
		rival["guard"] = false
		rival["crouch"] = false
		var down_vel: Vector2 = rival["vel"]
		down_vel.x = 0.0
		rival["vel"] = down_vel
		return
	var e_pos: Vector2 = rival["pos"]
	var p_pos: Vector2 = player["pos"]
	rival["face"] = 1 if p_pos.x >= e_pos.x else -1
	var distance: float = absf(p_pos.x - e_pos.x)
	var ai_timer: float = float(rival["ai_timer"]) - delta
	var phase: float = sin(float(rival["ai_seed"]) + round_time * (2.1 if rival_style != "Counter" else 2.7))
	var velocity: Vector2 = rival["vel"]
	var dir := 0.0
	rival["guard"] = false
	rival["crouch"] = false
	if ai_timer <= 0.0:
		rival["ai_timer"] = 0.22 + absf(phase) * 0.28
		if rival_style == "Grappler" and distance < 74.0 and phase > -0.35:
			rival = start_attack(rival, "throw")
		elif rival_style == "Counter" and distance < 128.0 and phase < -0.42:
			rival = start_parry(rival)
			rival["guard"] = true
		elif distance < 82.0:
			if phase > 0.15:
				rival = start_attack(rival, "light")
			elif phase < -0.5:
				rival = start_attack(rival, "low" if phase < -0.82 else "heavy")
			else:
				rival["guard"] = true
		elif distance < 168.0 and phase > 0.35:
			rival = start_attack(rival, "heavy")
		else:
			dir = float(rival["face"])
	else:
		rival["ai_timer"] = ai_timer
		if distance > 118.0:
			dir = float(rival["face"])
		elif distance < 58.0:
			dir = -float(rival["face"])
		if phase < -0.72 and distance < 210.0:
			rival["guard"] = true
	velocity.x = dir * (205.0 if not bool(rival["guard"]) else 98.0)
	if str(rival["attack"]) != "none" or float(rival["hitstun"]) > 0.0:
		velocity.x = 0.0
	rival["vel"] = velocity

func jump_fighter(fighter: Dictionary) -> Dictionary:
	var pos: Vector2 = fighter["pos"]
	var vel: Vector2 = fighter["vel"]
	if pos.y >= ground_y() - 1.0 and str(fighter["attack"]) == "none" and float(fighter["hitstun"]) <= 0.0:
		vel.y = -585.0
		fighter["vel"] = vel
	return fighter

func start_dash(fighter: Dictionary) -> Dictionary:
	if float(fighter["stamina"]) < 24.0 or float(fighter["dash"]) > 0.0 or float(fighter["hitstun"]) > 0.0 or float(fighter["knockdown"]) > 0.0:
		return fighter
	fighter["stamina"] = maxf(0.0, float(fighter["stamina"]) - 24.0)
	fighter["dash"] = 0.16
	return fighter

func start_parry(fighter: Dictionary) -> Dictionary:
	if float(fighter["stamina"]) < 14.0 or float(fighter["hitstun"]) > 0.0 or float(fighter["knockdown"]) > 0.0 or str(fighter["attack"]) != "none":
		return fighter
	fighter["stamina"] = maxf(0.0, float(fighter["stamina"]) - 14.0)
	fighter["parry"] = 0.28
	fighter["throw_escape"] = 0.34
	return fighter

func start_attack(fighter: Dictionary, attack_name: String) -> Dictionary:
	if float(fighter["attack_cooldown"]) > 0.0 or float(fighter["hitstun"]) > 0.0 or float(fighter["knockdown"]) > 0.0:
		return fighter
	if attack_name == "super" and float(fighter["super"]) < 65.0:
		return fighter
	var duration := 0.22
	var cooldown := 0.32
	if attack_name == "heavy":
		duration = 0.34
		cooldown = 0.55
	elif attack_name == "low":
		duration = 0.30
		cooldown = 0.48
	elif attack_name == "super":
		duration = 0.48
		cooldown = 0.88
		fighter["super"] = maxf(0.0, float(fighter["super"]) - 65.0)
	elif attack_name == "throw":
		duration = 0.36
		cooldown = 0.62
	fighter["attack"] = attack_name
	fighter["attack_time"] = duration
	fighter["attack_cooldown"] = cooldown
	fighter["attack_hit"] = false
	fighter["guard"] = false
	return fighter

func update_fighter(fighter: Dictionary, delta: float) -> Dictionary:
	var vel: Vector2 = fighter["vel"]
	var pos: Vector2 = fighter["pos"]
	if float(fighter["attack_cooldown"]) > 0.0:
		fighter["attack_cooldown"] = maxf(0.0, float(fighter["attack_cooldown"]) - delta)
	if float(fighter["attack_time"]) > 0.0:
		fighter["attack_time"] = maxf(0.0, float(fighter["attack_time"]) - delta)
		if float(fighter["attack_time"]) <= 0.0:
			fighter["attack"] = "none"
			fighter["attack_hit"] = false
	if float(fighter["hitstun"]) > 0.0:
		fighter["hitstun"] = maxf(0.0, float(fighter["hitstun"]) - delta)
	if float(fighter["parry"]) > 0.0:
		fighter["parry"] = maxf(0.0, float(fighter["parry"]) - delta)
	if float(fighter["throw_escape"]) > 0.0:
		fighter["throw_escape"] = maxf(0.0, float(fighter["throw_escape"]) - delta)
	if float(fighter["knockdown"]) > 0.0:
		fighter["knockdown"] = maxf(0.0, float(fighter["knockdown"]) - delta)
	if float(fighter["dash"]) > 0.0:
		fighter["dash"] = maxf(0.0, float(fighter["dash"]) - delta)
	if int(fighter["combo"]) > 0:
		fighter["combo_timer"] = maxf(0.0, float(fighter["combo_timer"]) - delta)
		if float(fighter["combo_timer"]) <= 0.0:
			fighter["combo"] = 0
	if absf(vel.x) > 8.0 and pos.y >= ground_y() - 2.0 and str(fighter["attack"]) == "none":
		fighter["anim"] = float(fighter["anim"]) + delta * 9.0
	else:
		fighter["anim"] = 0.0
	fighter["stamina"] = minf(100.0, float(fighter["stamina"]) + delta * 27.0)
	fighter["super"] = minf(100.0, float(fighter["super"]) + delta * 3.0)
	vel.y += GRAVITY * delta
	pos += vel * delta
	if pos.y >= ground_y():
		pos.y = ground_y()
		vel.y = 0.0
	pos.x = clampf(pos.x, arena_left() + 32.0, arena_right() - 32.0)
	fighter["pos"] = pos
	fighter["vel"] = vel
	return fighter

func resolve_attacks() -> void:
	player = resolve_one_attack(player, rival, true)
	rival = last_defender
	rival = resolve_one_attack(rival, player, false)
	player = last_defender

var last_defender: Dictionary = {}

func resolve_one_attack(attacker: Dictionary, defender: Dictionary, player_attacks: bool) -> Dictionary:
	if str(attacker["attack"]) == "none" or bool(attacker["attack_hit"]):
		last_defender = defender
		return attacker
	if not attack_is_active(attacker):
		last_defender = defender
		return attacker
	var hitbox: Rect2 = attack_box(attacker)
	var body: Rect2 = fighter_body(defender)
	if not hitbox.intersects(body):
		last_defender = defender
		return attacker
	if str(attacker["attack"]) == "throw":
		return resolve_throw(attacker, defender, player_attacks)
	if can_parry(defender, attacker):
		attacker["hitstun"] = 0.42
		attacker["attack"] = "none"
		attacker["attack_hit"] = true
		defender["super"] = minf(100.0, float(defender["super"]) + 22.0)
		defender["stamina"] = minf(100.0, float(defender["stamina"]) + 18.0)
		message = "Parry! Counter-Fenster offen."
		message_timer = 1.35
		shake_timer = 0.08
		spawn_hit_spark(defender, "parry")
		last_defender = defender
		return attacker
	var blocked: bool = can_block(defender, attacker)
	var damage: int = attack_damage(str(attacker["attack"]))
	if not player_attacks:
		damage = maxi(1, int(ceil(float(damage) * 0.72)))
	var push: float = attack_push(str(attacker["attack"]))
	var d_vel: Vector2 = defender["vel"]
	if blocked:
		defender["stamina"] = maxf(0.0, float(defender["stamina"]) - float(damage) * 1.45)
		if float(defender["stamina"]) <= 0.0:
			blocked = false
			damage = maxi(5, int(ceil(float(damage) * 0.55)))
			defender["hitstun"] = 0.46
			push *= 0.7
			message = "Guard Break!"
			spawn_hit_spark(defender, "break")
		else:
			damage = 1
			push *= 0.45
			message = "Block."
			spawn_hit_spark(defender, "block")
	else:
		var counter_hit := str(defender["attack"]) != "none" and not bool(defender["attack_hit"])
		if counter_hit:
			damage += 4
			push *= 1.18
		defender["hitstun"] = (0.22 if str(attacker["attack"]) == "light" else 0.36) + (0.12 if counter_hit else 0.0)
		attacker["combo"] = int(attacker["combo"]) + 1
		attacker["combo_timer"] = 1.4
		attacker["super"] = minf(100.0, float(attacker["super"]) + float(damage) * 1.2)
		if counter_hit:
			message = "Counter-Hit!"
		else:
			message = "%d-Hit Combo" % int(attacker["combo"]) if int(attacker["combo"]) > 1 else "Treffer."
		spawn_hit_spark(defender, "hit" if str(attacker["attack"]) != "super" else "super")
	defender["hp"] = maxi(0, int(defender["hp"]) - damage)
	d_vel.x = float(attacker["face"]) * push
	d_vel.y = -80.0 if not blocked and str(attacker["attack"]) != "light" else d_vel.y
	defender["vel"] = d_vel
	attacker["attack_hit"] = true
	score += damage * (12 if player_attacks else 4)
	shake_timer = 0.12 if not blocked else 0.04
	flash_timer = 0.08 if str(attacker["attack"]) == "super" else flash_timer
	message_timer = 1.3
	last_defender = defender
	return attacker

func resolve_throw(attacker: Dictionary, defender: Dictionary, player_attacks: bool) -> Dictionary:
	var d_vel: Vector2 = defender["vel"]
	if float(defender["throw_escape"]) > 0.0:
		attacker["attack_hit"] = true
		attacker["hitstun"] = 0.18
		defender["super"] = minf(100.0, float(defender["super"]) + 12.0)
		message = "Throw-Tech!"
		message_timer = 1.2
		spawn_hit_spark(defender, "parry")
		last_defender = defender
		return attacker
	var damage := attack_damage("throw")
	if not player_attacks:
		damage = maxi(1, int(ceil(float(damage) * 0.72)))
	defender["hp"] = maxi(0, int(defender["hp"]) - damage)
	defender["hitstun"] = 0.34
	defender["knockdown"] = 0.72
	defender["guard"] = false
	defender["crouch"] = false
	d_vel.x = float(attacker["face"]) * attack_push("throw")
	d_vel.y = -135.0
	defender["vel"] = d_vel
	attacker["attack_hit"] = true
	attacker["super"] = minf(100.0, float(attacker["super"]) + 14.0)
	attacker["combo"] = int(attacker["combo"]) + 1
	attacker["combo_timer"] = 1.2
	score += damage * (13 if player_attacks else 4)
	message = "Throw! Block geknackt."
	message_timer = 1.35
	shake_timer = 0.16
	spawn_hit_spark(defender, "throw")
	last_defender = defender
	return attacker

func attack_is_active(fighter: Dictionary) -> bool:
	var name: String = str(fighter["attack"])
	var t: float = float(fighter["attack_time"])
	if name == "light":
		return t < 0.18 and t > 0.05
	if name == "heavy":
		return t < 0.27 and t > 0.07
	if name == "low":
		return t < 0.24 and t > 0.06
	if name == "super":
		return t < 0.38 and t > 0.06
	if name == "throw":
		return t < 0.25 and t > 0.08
	return false

func attack_damage(name: String) -> int:
	if name == "heavy":
		return 11
	if name == "low":
		return 8
	if name == "super":
		return 23
	if name == "throw":
		return 12
	return 6

func attack_push(name: String) -> float:
	if name == "heavy":
		return 240.0
	if name == "low":
		return 120.0
	if name == "super":
		return 390.0
	if name == "throw":
		return 280.0
	return 150.0

func spawn_hit_spark(target: Dictionary, kind: String) -> void:
	var pos: Vector2 = target["pos"]
	var y := -92.0
	if kind == "block":
		y = -108.0
	elif kind == "break":
		y = -118.0
	elif kind == "super":
		y = -96.0
	elif kind == "parry":
		y = -112.0
	elif kind == "throw":
		y = -84.0
	hit_sparks.append({"pos": pos + Vector2(0.0, y), "kind": kind, "timer": 0.24})
	if hit_sparks.size() > 10:
		hit_sparks.pop_front()

func update_hit_sparks(delta: float) -> void:
	for i in range(hit_sparks.size() - 1, -1, -1):
		var spark: Dictionary = hit_sparks[i]
		spark["timer"] = float(spark["timer"]) - delta
		if float(spark["timer"]) <= 0.0:
			hit_sparks.remove_at(i)
		else:
			hit_sparks[i] = spark

func attack_box(fighter: Dictionary) -> Rect2:
	var pos: Vector2 = fighter["pos"]
	var face: float = float(fighter["face"])
	var name: String = str(fighter["attack"])
	var width := 72.0
	var height := 58.0
	var y_offset := 118.0
	if name == "heavy":
		width = 98.0
		height = 66.0
	elif name == "low":
		width = 86.0
		height = 38.0
		y_offset = 54.0
	elif name == "super":
		width = 150.0
		height = 82.0
	elif name == "throw":
		width = 70.0
		height = 100.0
		y_offset = 112.0
	var x: float = pos.x + face * 30.0
	if face < 0.0:
		x -= width
	return Rect2(Vector2(x, pos.y - y_offset), Vector2(width, height))

func fighter_body(fighter: Dictionary) -> Rect2:
	var pos: Vector2 = fighter["pos"]
	var height := 118.0
	if bool(fighter["crouch"]):
		height = 82.0
	return Rect2(Vector2(pos.x - 25.0, pos.y - height), Vector2(50.0, height))

func can_block(defender: Dictionary, attacker: Dictionary) -> bool:
	if not bool(defender["guard"]) or float(defender["stamina"]) <= 2.0 or float(defender["hitstun"]) > 0.0:
		return false
	if str(attacker["attack"]) == "throw":
		return false
	if str(attacker["attack"]) == "low" and not bool(defender["crouch"]):
		return false
	var d_pos: Vector2 = defender["pos"]
	var a_pos: Vector2 = attacker["pos"]
	var incoming: float = signf(a_pos.x - d_pos.x)
	return incoming == float(defender["face"])

func can_parry(defender: Dictionary, attacker: Dictionary) -> bool:
	if float(defender["parry"]) <= 0.0 or float(defender["hitstun"]) > 0.0 or float(defender["knockdown"]) > 0.0:
		return false
	if str(attacker["attack"]) == "low" or str(attacker["attack"]) == "throw" or str(attacker["attack"]) == "super":
		return false
	var d_pos: Vector2 = defender["pos"]
	var a_pos: Vector2 = attacker["pos"]
	var incoming: float = signf(a_pos.x - d_pos.x)
	return incoming == float(defender["face"])

func update_answer_crystals() -> void:
	if not mode_learn:
		return
	if str(player["attack"]) == "none" or bool(player["attack_hit"]) or not attack_is_active(player):
		return
	var hitbox: Rect2 = attack_box(player)
	var q: Dictionary = current_question()
	for i in range(answer_crystals.size()):
		var crystal: Dictionary = answer_crystals[i]
		if not bool(crystal["armed"]):
			continue
		var rect := Rect2(crystal["pos"] - Vector2(24.0, 24.0), Vector2(48.0, 48.0))
		if not hitbox.intersects(rect):
			continue
		crystal["armed"] = false
		answer_crystals[i] = crystal
		player["attack_hit"] = true
		if int(crystal["index"]) == int(q["correct"]):
			var repeated := bool(q.get("repeat", false))
			learn_hits += 1
			player["super"] = minf(100.0, float(player["super"]) + 38.0)
			rival["hp"] = maxi(0, int(rival["hp"]) - (9 + (3 if learn_hits >= LEARN_GOAL else 0)))
			rival["hitstun"] = maxf(float(rival["hitstun"]), 0.38 if learn_hits >= LEARN_GOAL else 0.18)
			rival["stamina"] = maxf(0.0, float(rival["stamina"]) - 24.0)
			score += 520 if repeated else 420
			_remove_repeat(q)
			if repeated:
				message = "Wiederholung geloest: %s (%d/%d)." % [str(crystal["label"]), learn_hits, LEARN_GOAL]
			else:
				message = "Richtig: %s (%d/%d), Guard-Break-Druck." % [str(crystal["label"]), learn_hits, LEARN_GOAL]
			question_index += 1
			setup_answers()
		else:
			mistakes += 1
			_queue_repeat(q)
			player["hp"] = maxi(0, int(player["hp"]) - 7)
			player["hitstun"] = maxf(float(player["hitstun"]), 0.24)
			message = "Falscher Kristall. Tipp: %s" % str(q["hint"])
		message_timer = 2.0
		shake_timer = 0.1
		break

func check_round_end() -> void:
	if int(player["hp"]) <= 0 or int(rival["hp"]) <= 0 or round_time <= 0.0:
		if round_over:
			return
		round_over = true
		var player_wins: bool = int(player["hp"]) > int(rival["hp"])
		if int(rival["hp"]) <= 0:
			player_wins = true
		elif int(player["hp"]) <= 0:
			player_wins = false
		if player_wins:
			player_rounds += 1
		else:
			rival_rounds += 1
		match_over = player_rounds >= 2 or rival_rounds >= 2
		if match_over:
			message = "Match gewonnen. R startet neu." if player_wins else "Match verloren. R startet neu."
		else:
			if player_wins:
				message = "Runde gewonnen. R startet Runde %d." % (round_number + 1)
			else:
				message = "Runde verloren. R startet Runde %d." % (round_number + 1)
		message_timer = 99.0

func _draw() -> void:
	var offset: Vector2 = screen_shake()
	draw_background(offset)
	draw_stage(offset)
	draw_answer_crystals(offset)
	draw_fighter(rival, false, offset)
	draw_fighter(player, true, offset)
	draw_attack_effects(offset)
	draw_hit_sparks(offset)
	draw_hud()

func ground_y() -> float:
	if size.y > size.x * 1.2:
		return clampf(size.y * 0.58, 420.0, size.y - 360.0)
	if size.x < 980.0:
		return clampf(size.y * 0.68, 430.0, size.y - 150.0)
	return clampf(size.y * 0.72, 540.0, size.y - 170.0)

func is_mobile_layout() -> bool:
	return size.x < 980.0 or size.y > size.x * 1.2

func arena_left() -> float:
	if is_mobile_layout():
		return maxf(32.0, size.x * 0.08)
	return STAGE_LEFT

func arena_right() -> float:
	if is_mobile_layout():
		return maxf(arena_left() + 320.0, size.x - 32.0)
	return minf(STAGE_RIGHT, size.x - 86.0)

func screen_shake() -> Vector2:
	if shake_timer <= 0.0:
		return Vector2.ZERO
	return Vector2(sin(round_time * 90.0) * 5.0, cos(round_time * 110.0) * 3.0)

func draw_background(offset: Vector2) -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color.html("#080b16"), true)
	draw_rect(Rect2(Vector2.ZERO, Vector2(size.x, size.y * 0.46)), Color.html("#14203c"), true)
	draw_rect(Rect2(Vector2.ZERO, Vector2(size.x, size.y * 0.22)), Color.html("#21143c"), true)
	for i in range(18):
		var x: float = float(i) * 82.0 - 60.0 + fmod(round_time * 9.0, 82.0)
		draw_rect(Rect2(Vector2(x, 138.0), Vector2(42.0, 170.0)), Color(0.12, 0.16, 0.29, 0.7), true)
	for i in range(7):
		var cx := lerpf(arena_left(), arena_right(), (float(i) + 0.5) / 7.0)
		draw_circle(Vector2(cx, ground_y() - 236.0 + sin(round_time + float(i)) * 5.0), 26.0, Color(0.98, 0.79, 0.2, 0.28))
	for y in range(0, int(size.y), 30):
		draw_line(Vector2(0.0, float(y)), Vector2(size.x, float(y)), Color(1.0, 1.0, 1.0, 0.024), 1.0)
	if flash_timer > 0.0:
		draw_rect(Rect2(Vector2.ZERO, size), Color(1.0, 1.0, 1.0, 0.22), true)

func draw_stage(offset: Vector2) -> void:
	var floor_y: float = ground_y() + offset.y
	var left := arena_left()
	var right := arena_right()
	draw_rect(Rect2(Vector2(left + offset.x, floor_y), Vector2(right - left, 36.0)), Color.html("#334155"), true)
	draw_rect(Rect2(Vector2(left + offset.x, floor_y + 36.0), Vector2(right - left, 120.0)), Color.html("#1e293b"), true)
	draw_rect(Rect2(Vector2(left + offset.x, floor_y + 12.0), Vector2(right - left, 8.0)), Color(1.0, 1.0, 1.0, 0.08), true)
	for i in range(16):
		var x: float = left + float(i) * ((right - left) / 15.0) + offset.x
		draw_line(Vector2(x, floor_y), Vector2(x + 42.0, floor_y + 150.0), Color(1.0, 1.0, 1.0, 0.07), 2.0)
	draw_rect(Rect2(Vector2(left + offset.x, floor_y - 8.0), Vector2(right - left, 8.0)), Color.html("#facc15"), true)

func draw_answer_crystals(offset: Vector2) -> void:
	if not mode_learn:
		return
	var font := get_theme_default_font()
	for answer in answer_crystals:
		var item: Dictionary = answer
		var pos: Vector2 = item["pos"] + offset
		var is_repeat := bool(item.get("repeat", false))
		var color: Color = (Color.html("#f0abfc") if is_repeat else Color.html("#38bdf8")) if bool(item["armed"]) else Color.html("#475569")
		var points: PackedVector2Array = PackedVector2Array([
			pos + Vector2(0.0, -28.0),
			pos + Vector2(28.0, 0.0),
			pos + Vector2(0.0, 28.0),
			pos + Vector2(-28.0, 0.0),
		])
		draw_polygon(points, PackedColorArray([Color(color.r, color.g, color.b, 0.42)]))
		draw_polyline(points + PackedVector2Array([points[0]]), color, 3.0)
		draw_string(font, pos + Vector2(-32.0, 5.0), str(item["label"]), HORIZONTAL_ALIGNMENT_CENTER, 64.0, 12, Color.html("#f8fafc"))

func draw_fighter(fighter: Dictionary, is_player: bool, offset: Vector2) -> void:
	var pos: Vector2 = fighter["pos"] + offset
	var face: float = float(fighter["face"])
	var body: Color = fighter["body"]
	var trim: Color = fighter["trim"]
	if float(fighter["hitstun"]) > 0.0 and int(round_time * 22.0) % 2 == 0:
		body = Color.html("#f8fafc")
	var crouch: bool = bool(fighter["crouch"])
	var knocked: bool = float(fighter["knockdown"]) > 0.0
	var torso_h: float = 72.0 if not crouch else 48.0
	var leg_h: float = 44.0 if not crouch else 24.0
	if knocked:
		torso_h = 34.0
		leg_h = 18.0
	var step: float = sin(float(fighter["anim"]))
	var left_step := maxf(0.0, step) * 5.0
	var right_step := maxf(0.0, -step) * 5.0
	draw_rect(Rect2(pos + Vector2(-24.0, -6.0), Vector2(48.0, 8.0)), Color(0.0, 0.0, 0.0, 0.28), true)
	draw_rect(Rect2(pos + Vector2(-18.0, -torso_h - leg_h), Vector2(36.0, torso_h)), body, true)
	draw_rect(Rect2(pos + Vector2(-14.0, -torso_h - leg_h - 24.0), Vector2(28.0, 26.0)), body.lightened(0.18), true)
	draw_rect(Rect2(pos + Vector2(-15.0, -leg_h + left_step), Vector2(10.0, leg_h - left_step)), trim, true)
	draw_rect(Rect2(pos + Vector2(5.0, -leg_h + right_step), Vector2(10.0, leg_h - right_step)), trim, true)
	var arm_x := pos.x + (15.0 if face > 0.0 else -47.0)
	draw_rect(Rect2(Vector2(arm_x, pos.y - torso_h - leg_h + 16.0), Vector2(32.0, 12.0)), trim, true)
	draw_rect(Rect2(pos + Vector2(-8.0, -torso_h - leg_h - 14.0), Vector2(5.0, 5.0)), Color.html("#020617"), true)
	draw_rect(Rect2(pos + Vector2(4.0, -torso_h - leg_h - 14.0), Vector2(5.0, 5.0)), Color.html("#020617"), true)
	if float(fighter["parry"]) > 0.0:
		draw_arc(pos + Vector2(0.0, -82.0), 54.0, -PI * 0.85, PI * 0.85, 32, Color.html("#38bdf8"), 5.0)
	if bool(fighter["guard"]):
		var shield_x: float = face * 30.0
		draw_rect(Rect2(pos + Vector2(shield_x - 8.0, -104.0), Vector2(16.0, 76.0)), Color(0.38, 0.77, 1.0, 0.46), true)
	if str(fighter["attack"]) != "none" and attack_is_active(fighter):
		var box: Rect2 = attack_box(fighter)
		var screen_box: Rect2 = Rect2(box.position + offset, box.size)
		var color := Color(0.98, 0.89, 0.38, 0.36)
		if str(fighter["attack"]) == "low":
			color = Color(0.22, 0.86, 0.74, 0.38)
		if str(fighter["attack"]) == "super":
			color = Color(0.56, 0.19, 1.0, 0.48)
		if str(fighter["attack"]) == "throw":
			color = Color(0.98, 0.28, 0.42, 0.42)
		draw_rect(screen_box, color, true)
	if is_player:
		draw_string(get_theme_default_font(), pos + Vector2(-38.0, 22.0), "DU", HORIZONTAL_ALIGNMENT_CENTER, 76.0, 12, Color.html("#facc15"))
	var state_label := ""
	if knocked:
		state_label = "DOWN"
	elif float(fighter["parry"]) > 0.0:
		state_label = "PARRY"
	elif float(fighter["hitstun"]) > 0.0:
		state_label = "STUN"
	elif bool(fighter["guard"]):
		state_label = "GUARD"
	elif str(fighter["attack"]) != "none":
		state_label = str(fighter["attack"]).to_upper()
	if state_label != "":
		draw_string(get_theme_default_font(), pos + Vector2(-40.0, -150.0), state_label, HORIZONTAL_ALIGNMENT_CENTER, 80.0, 11, Color.html("#f8fafc"))

func draw_attack_effects(offset: Vector2) -> void:
	if float(player["combo_timer"]) > 0.0 and int(player["combo"]) > 1:
		draw_string(get_theme_default_font(), Vector2(538.0, 156.0), "%d HIT" % int(player["combo"]), HORIZONTAL_ALIGNMENT_CENTER, 200.0, 34, Color.html("#facc15"))
	if mode_learn and learn_hits >= LEARN_GOAL:
		draw_string(get_theme_default_font(), Vector2(size.x * 0.5 - 190.0, 164.0), "KNOWLEDGE BREAK", HORIZONTAL_ALIGNMENT_CENTER, 380.0, 24, Color.html("#38bdf8"))
	if float(player["parry"]) > 0.0:
		draw_string(get_theme_default_font(), Vector2(size.x * 0.5 - 126.0, 192.0), "PARRY WINDOW", HORIZONTAL_ALIGNMENT_CENTER, 252.0, 20, Color.html("#38bdf8"))

func draw_hit_sparks(offset: Vector2) -> void:
	for spark in hit_sparks:
		var item: Dictionary = spark
		var t: float = clampf(float(item["timer"]) / 0.24, 0.0, 1.0)
		var pos: Vector2 = item["pos"] + offset
		var kind := str(item["kind"])
		var color := Color.html("#fde047")
		if kind == "block":
			color = Color.html("#60a5fa")
		elif kind == "break":
			color = Color.html("#f97316")
		elif kind == "super":
			color = Color.html("#c084fc")
		elif kind == "parry":
			color = Color.html("#38bdf8")
		elif kind == "throw":
			color = Color.html("#fb7185")
		var radius := lerpf(35.0, 8.0, 1.0 - t)
		draw_circle(pos, radius, Color(color.r, color.g, color.b, 0.32 * t))
		for i in range(8):
			var angle := float(i) / 8.0 * TAU + round_time
			var a := pos + Vector2(cos(angle), sin(angle)) * radius * 0.35
			var b := pos + Vector2(cos(angle), sin(angle)) * radius
			draw_line(a, b, Color(color.r, color.g, color.b, 0.86 * t), 3.0)

func draw_hud() -> void:
	var font := get_theme_default_font()
	draw_health_bar(Vector2(34.0, 25.0), 478.0, player, true)
	draw_health_bar(Vector2(size.x - 512.0, 25.0), 478.0, rival, false)
	draw_string(font, Vector2(size.x * 0.5 - 45.0, 56.0), "%02d" % int(ceil(round_time)), HORIZONTAL_ALIGNMENT_CENTER, 90.0, 34, Color.html("#f8fafc"))
	draw_string(font, Vector2(size.x * 0.5 - 120.0, 28.0), "Runde %d  %d:%d" % [round_number, player_rounds, rival_rounds], HORIZONTAL_ALIGNMENT_CENTER, 240.0, 17, Color.html("#facc15"))
	draw_string(font, Vector2(42.0, 84.0), "Super %d  Stamina %d" % [int(player["super"]), int(player["stamina"])], HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.html("#cbd5e1"))
	draw_string(font, Vector2(size.x - 318.0, 84.0), "CPU %s  Super %d" % [rival_style, int(rival["super"])], HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.html("#cbd5e1"))
	draw_string(font, Vector2(size.x * 0.5 - 220.0, 88.0), "Mode %s  Fach %s  Lernziel %d/%d  Fehler %d  Wdh %d" % ["Learncade" if mode_learn else "Normal", str(LESSONS[lesson_index]), learn_hits, LEARN_GOAL, mistakes, repeat_queue.size()], HORIZONTAL_ALIGNMENT_CENTER, 440.0, 13, Color.html("#fde68a"))
	if mode_learn:
		var q: Dictionary = current_question()
		draw_rect(Rect2(Vector2(size.x * 0.5 - 330.0, 108.0), Vector2(660.0, 38.0)), Color(0.02, 0.05, 0.09, 0.76), true)
		draw_string(font, Vector2(size.x * 0.5 - 310.0, 133.0), str(q["prompt"]), HORIZONTAL_ALIGNMENT_CENTER, 620.0, 18, Color.html("#f8fafc"))
	if message_timer > 0.0:
		var bottom_clearance := 96.0 if not is_mobile_layout() else 238.0
		var msg_y := size.y - bottom_clearance
		draw_rect(Rect2(Vector2(28.0, msg_y), Vector2(minf(size.x - 56.0, 780.0), 34.0)), Color(0.02, 0.05, 0.09, 0.76), true)
		draw_string(font, Vector2(42.0, msg_y + 23.0), message, HORIZONTAL_ALIGNMENT_LEFT, minf(size.x - 84.0, 752.0), 16, Color.html("#f8fafc"))
	if not is_mobile_layout():
		draw_string(font, Vector2(38.0, size.y - 38.0), "J Jab  K Kick  U Low  O Throw  G Parry/Block  Space Dash  I Super  L Learncade", HORIZONTAL_ALIGNMENT_LEFT, size.x - 76.0, 13, Color.html("#94a3b8"))

func draw_health_bar(pos: Vector2, width: float, fighter: Dictionary, left_to_right: bool) -> void:
	var ratio: float = clampf(float(fighter["hp"]) / float(fighter["max_hp"]), 0.0, 1.0)
	draw_rect(Rect2(pos, Vector2(width, 24.0)), Color.html("#020617"), true)
	var filled: float = width * ratio
	var bar_pos: Vector2 = pos
	if not left_to_right:
		bar_pos.x = pos.x + width - filled
	draw_rect(Rect2(bar_pos, Vector2(filled, 24.0)), Color.html("#22c55e") if ratio > 0.35 else Color.html("#ef4444"), true)
	draw_rect(Rect2(pos, Vector2(width, 24.0)), Color(1.0, 1.0, 1.0, 0.24), false, 2.0)

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
