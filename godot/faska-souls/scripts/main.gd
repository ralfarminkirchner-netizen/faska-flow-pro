extends Control

const ARENA_SIZE := Vector2(1280.0, 720.0)
const FLOOR_TILE := 64.0
const PLAYER_MAX_HP := 12
const PLAYER_MAX_STAMINA := 100.0
const BOSS_MAX_HP := 180.0
const LEARN_GOAL := 5
const LESSONS := ["WORTART", "MATHE", "SATZ", "ENGLISCH"]

const QUESTIONS_WORD := [
	{"prompt": "Welche Wortart ist 'funkelt'?", "answers": ["Nomen", "Verb", "Adjektiv"], "correct": 1, "hint": "Funkeln ist etwas, das etwas tut."},
	{"prompt": "Welche Wortart ist 'dunkel'?", "answers": ["Adjektiv", "Artikel", "Verb"], "correct": 0, "hint": "Dunkel beschreibt, wie etwas ist."},
	{"prompt": "Welche Wortart ist 'der'?", "answers": ["Verb", "Artikel", "Nomen"], "correct": 1, "hint": "Der steht vor einem Nomen."},
	{"prompt": "Welche Wortart ist 'Arena'?", "answers": ["Nomen", "Verb", "Artikel"], "correct": 0, "hint": "Eine Arena ist ein Ort."},
	{"prompt": "Welche Wortart ist 'mutig'?", "answers": ["Verb", "Adjektiv", "Nomen"], "correct": 1, "hint": "Mutig beschreibt jemanden."},
]

const QUESTIONS_MATH := [
	{"prompt": "Welche Rune passt? 9 + 8", "answers": ["16", "17", "18"], "correct": 1, "hint": "Von 9 acht weiter."},
	{"prompt": "Was ist 6 x 5?", "answers": ["25", "30", "35"], "correct": 1, "hint": "Fuenf Sechser."},
	{"prompt": "Welche Zahl ist gerade?", "answers": ["27", "29", "32"], "correct": 2, "hint": "Gerade Zahlen sind durch 2 teilbar."},
	{"prompt": "Was ist 45 - 18?", "answers": ["25", "27", "29"], "correct": 1, "hint": "45 - 20 + 2."},
	{"prompt": "Welche Zahl fehlt? 7 x ? = 42", "answers": ["5", "6", "7"], "correct": 1, "hint": "Sechs Siebener."},
]

const QUESTIONS_SENTENCE := [
	{"prompt": "Was ist das Subjekt? Der Ritter blockt.", "answers": ["Der Ritter", "blockt", "schnell"], "correct": 0, "hint": "Wer blockt?"},
	{"prompt": "Was ist das Praedikat? Lumi rollt weg.", "answers": ["Lumi", "rollt", "weg"], "correct": 1, "hint": "Was tut Lumi?"},
	{"prompt": "Welches Wort passt? Der Boss ist ___.", "answers": ["stark", "springt", "der"], "correct": 0, "hint": "Gesucht ist eine Eigenschaft."},
	{"prompt": "Was ist das Objekt? Wir finden die Rune.", "answers": ["Wir", "finden", "die Rune"], "correct": 2, "hint": "Was finden wir?"},
	{"prompt": "Welches Wort macht den Satz fertig? Der Held ___ aus.", "answers": ["weicht", "blau", "ein"], "correct": 0, "hint": "Gesucht ist ein Verb."},
]

const QUESTIONS_ENGLISH := [
	{"prompt": "Was heisst 'Rolle' auf Englisch?", "answers": ["roll", "shield", "sword"], "correct": 0, "hint": "Roll ist die Ausweichrolle."},
	{"prompt": "Was heisst 'Schild'?", "answers": ["sword", "shield", "stamina"], "correct": 1, "hint": "Shield blockt Treffer."},
	{"prompt": "Was heisst 'stark'?", "answers": ["strong", "slow", "short"], "correct": 0, "hint": "Strong bedeutet stark."},
	{"prompt": "Was heisst 'heilen'?", "answers": ["hurt", "heal", "hit"], "correct": 1, "hint": "Heal fuellt Leben."},
	{"prompt": "Was heisst 'Ausdauer'?", "answers": ["stamina", "score", "swing"], "correct": 0, "hint": "Stamina steht im HUD."},
]

class TouchSoulsOverlay:
	extends Control

	var move_vector := Vector2.ZERO
	var attack_down := false
	var roll_down := false
	var block_down := false
	var heal_down := false
	var learn_down := false
	var subject_down := false
	var _move_touch := -1
	var _button_touches := {}

	func _ready() -> void:
		mouse_filter = Control.MOUSE_FILTER_STOP
		set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)

	func _process(_delta: float) -> void:
		queue_redraw()

	func _gui_input(event: InputEvent) -> void:
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
					move_vector = Vector2.ZERO
				if _button_touches.has(event.index):
					_button_touches.erase(event.index)
					_refresh_buttons()
		elif event is InputEventScreenDrag and event.index == _move_touch:
			_update_move(event.position)

	func _update_move(pos: Vector2) -> void:
		var center := _stick_center()
		move_vector = (pos - center) / 104.0
		if move_vector.length() > 1.0:
			move_vector = move_vector.normalized()
		if move_vector.length() < 0.14:
			move_vector = Vector2.ZERO

	func _refresh_buttons() -> void:
		attack_down = false
		roll_down = false
		block_down = false
		heal_down = false
		learn_down = false
		subject_down = false
		for key in _button_touches.keys():
			var action: String = str(_button_touches[key])
			if action == "attack":
				attack_down = true
			elif action == "roll":
				roll_down = true
			elif action == "block":
				block_down = true
			elif action == "heal":
				heal_down = true
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
		return Vector2(128.0, size.y - 210.0)

	func _buttons() -> Array:
		var w := 100.0
		var h := 72.0
		var gap := 12.0
		var x := size.x - (w * 2.0 + gap + 24.0)
		var y := size.y - (h * 3.0 + gap * 2.0 + 112.0)
		return [
			{"action": "learn", "label": "L\nLern", "rect": Rect2(Vector2(x, y), Vector2(w, h))},
			{"action": "subject", "label": "C\nFach", "rect": Rect2(Vector2(x + w + gap, y), Vector2(w, h))},
			{"action": "attack", "label": "J\nHieb", "rect": Rect2(Vector2(x, y + h + gap), Vector2(w, h))},
			{"action": "block", "label": "K\nBlock", "rect": Rect2(Vector2(x + w + gap, y + h + gap), Vector2(w, h))},
			{"action": "roll", "label": "A\nRolle", "rect": Rect2(Vector2(x, y + (h + gap) * 2.0), Vector2(w, h))},
			{"action": "heal", "label": "H\nHeal", "rect": Rect2(Vector2(x + w + gap, y + (h + gap) * 2.0), Vector2(w, h))},
		]

	func _draw() -> void:
		if size.x < 980.0 or size.y > size.x * 1.2:
			_draw_stick()
			_draw_buttons()

	func _draw_stick() -> void:
		var center := _stick_center()
		draw_circle(center, 104.0, Color(0.02, 0.05, 0.09, 0.5))
		draw_arc(center, 104.0, 0.0, TAU, 36, Color(0.78, 0.88, 1.0, 0.52), 5.0)
		draw_circle(center + move_vector * 58.0, 38.0, Color(0.93, 0.96, 1.0, 0.78))

	func _draw_buttons() -> void:
		var font := get_theme_default_font()
		for button in _buttons():
			var rect: Rect2 = button["rect"]
			var action := str(button["action"])
			var active := (action == "attack" and attack_down) or (action == "roll" and roll_down) or (action == "block" and block_down) or (action == "heal" and heal_down) or (action == "learn" and learn_down) or (action == "subject" and subject_down)
			draw_rect(rect, Color(0.02, 0.05, 0.09, 0.66), true)
			draw_rect(rect, Color.html("#facc15") if active else Color(0.78, 0.88, 1.0, 0.55), false, 4.0)
			var lines := str(button["label"]).split("\n")
			for i in range(lines.size()):
				draw_string(font, rect.position + Vector2(0.0, 28.0 + float(i) * 23.0), lines[i], HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, 20, Color.html("#f8fafc"))

var player_pos := Vector2(640.0, 470.0)
var player_hp := PLAYER_MAX_HP
var stamina := PLAYER_MAX_STAMINA
var facing := Vector2(0.0, -1.0)
var attack_timer := 0.0
var attack_cooldown := 0.0
var roll_timer := 0.0
var roll_cooldown := 0.0
var roll_dir := Vector2.ZERO
var invulnerable_timer := 0.0
var guard_flash := 0.0
var combo := 0
var score := 0
var vials := 3

var boss_pos := Vector2(640.0, 210.0)
var boss_hp := BOSS_MAX_HP
var boss_attack_cd := 1.8
var boss_telegraph := 0.0
var boss_swing := 0.0
var boss_hit_done := false
var boss_phase_two := false

var minions := []
var particles := []
var runes := []
var encounter_started := false
var learn_mode := true
var lesson_index := 0
var question_index := 0
var learn_hits := 0
var mistakes := 0
var message := "WASD/Pfeile: Bewegen  J: Angriff  K: Block  Space: Rolle  L: Learncade"
var message_timer := 4.0
var touch_overlay: TouchSoulsOverlay
var last_touch_attack := false
var last_touch_roll := false
var last_touch_heal := false
var last_touch_learn := false
var last_touch_subject := false

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_STOP
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	touch_overlay = TouchSoulsOverlay.new()
	add_child(touch_overlay)
	reset_game()

func reset_game() -> void:
	player_pos = Vector2(640.0, 470.0)
	player_hp = PLAYER_MAX_HP
	stamina = PLAYER_MAX_STAMINA
	facing = Vector2(0.0, -1.0)
	attack_timer = 0.0
	attack_cooldown = 0.0
	roll_timer = 0.0
	roll_cooldown = 0.0
	invulnerable_timer = 0.0
	guard_flash = 0.0
	combo = 0
	score = 0
	vials = 3
	boss_pos = Vector2(640.0, 210.0)
	boss_hp = BOSS_MAX_HP
	boss_attack_cd = 1.4
	boss_telegraph = 0.0
	boss_swing = 0.0
	boss_hit_done = false
	boss_phase_two = false
	encounter_started = false
	learn_mode = true
	lesson_index = 0
	question_index = 0
	learn_hits = 0
	mistakes = 0
	spawn_minions()
	spawn_runes()
	message = "Souls Pro: Erst orientieren, dann bewegen oder angreifen, um den Kampf zu starten."
	message_timer = 4.0

func spawn_minions() -> void:
	minions.clear()
	for i in range(4):
		var angle := TAU * float(i) / 4.0
		minions.append({
			"pos": Vector2(640.0, 360.0) + Vector2(cos(angle), sin(angle)) * (180.0 + float(i % 2) * 70.0),
			"hp": 3.0,
			"hit": 0.0,
			"attack_cd": 0.45 + float(i) * 0.08,
		})

func spawn_runes() -> void:
	var q := get_question()
	var answers: Array = q["answers"]
	runes = [
		{"pos": Vector2(250.0, 330.0), "label": answers[0], "index": 0, "hit": 0.0},
		{"pos": Vector2(640.0, 300.0), "label": answers[1], "index": 1, "hit": 0.0},
		{"pos": Vector2(1030.0, 330.0), "label": answers[2], "index": 2, "hit": 0.0},
	]

func get_question() -> Dictionary:
	var bank: Array = QUESTIONS_WORD
	var lesson := str(LESSONS[lesson_index])
	if lesson == "MATHE":
		bank = QUESTIONS_MATH
	elif lesson == "SATZ":
		bank = QUESTIONS_SENTENCE
	elif lesson == "ENGLISCH":
		bank = QUESTIONS_ENGLISH
	return bank[question_index % bank.size()]

func cycle_lesson() -> void:
	lesson_index = (lesson_index + 1) % LESSONS.size()
	question_index = 0
	spawn_runes()
	message = "Fach: %s. Runen wurden neu gebunden." % str(LESSONS[lesson_index])
	message_timer = 2.0

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_R:
			reset_game()
		elif event.keycode == KEY_L:
			learn_mode = not learn_mode
			spawn_runes()
			message = "Learncade aktiv: richtige Runen brechen Boss-Fokus." if learn_mode else "Normalmodus aktiv."
			message_timer = 2.5
		elif event.keycode == KEY_C:
			cycle_lesson()
		elif event.keycode == KEY_J:
			start_attack()
		elif event.keycode == KEY_SPACE:
			start_roll()
		elif event.keycode == KEY_H:
			drink_vial()

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()

	var input_vec := Vector2.ZERO
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		input_vec.x -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		input_vec.x += 1.0
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		input_vec.y -= 1.0
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		input_vec.y += 1.0
	if touch_overlay != null and touch_overlay.move_vector.length() > 0.05:
		input_vec = touch_overlay.move_vector
	if input_vec.length() > 0.0:
		input_vec = input_vec.normalized()
		facing = input_vec

	update_touch_actions()

	var blocking := (Input.is_key_pressed(KEY_K) or (touch_overlay != null and touch_overlay.block_down)) and stamina > 3.0 and roll_timer <= 0.0
	if input_vec.length() > 0.0 or blocking:
		encounter_started = true
	if blocking:
		stamina = max(0.0, stamina - 14.0 * delta)
	else:
		stamina = min(PLAYER_MAX_STAMINA, stamina + 28.0 * delta)

	if attack_cooldown > 0.0:
		attack_cooldown -= delta
	if attack_timer > 0.0:
		attack_timer -= delta
	if roll_cooldown > 0.0:
		roll_cooldown -= delta
	if invulnerable_timer > 0.0:
		invulnerable_timer -= delta
	if guard_flash > 0.0:
		guard_flash -= delta
	if message_timer > 0.0:
		message_timer -= delta

	if roll_timer > 0.0:
		roll_timer -= delta
		player_pos += roll_dir * 430.0 * delta
	else:
		var speed := 120.0 if blocking else 205.0
		player_pos += input_vec * speed * delta
	player_pos.x = clampf(player_pos.x, 62.0, ARENA_SIZE.x - 62.0)
	player_pos.y = clampf(player_pos.y, 92.0, ARENA_SIZE.y - 74.0)

	if encounter_started:
		update_boss(delta, blocking)
		update_minions(delta, blocking)
	update_particles(delta)
	queue_redraw()

func update_touch_actions() -> void:
	if touch_overlay == null:
		return
	if touch_overlay.move_vector.length() > 0.05:
		facing = touch_overlay.move_vector.normalized()
	if touch_overlay.attack_down and not last_touch_attack:
		start_attack()
	if touch_overlay.roll_down and not last_touch_roll:
		start_roll()
	if touch_overlay.heal_down and not last_touch_heal:
		drink_vial()
	if touch_overlay.learn_down and not last_touch_learn:
		learn_mode = not learn_mode
		spawn_runes()
		message = "Learncade aktiv." if learn_mode else "Normalmodus aktiv."
		message_timer = 1.8
	if touch_overlay.subject_down and not last_touch_subject:
		cycle_lesson()
	last_touch_attack = touch_overlay.attack_down
	last_touch_roll = touch_overlay.roll_down
	last_touch_heal = touch_overlay.heal_down
	last_touch_learn = touch_overlay.learn_down
	last_touch_subject = touch_overlay.subject_down

func start_attack() -> void:
	if attack_cooldown > 0.0 or stamina < 12.0 or roll_timer > 0.0:
		return
	encounter_started = true
	attack_timer = 0.18
	attack_cooldown = 0.34
	stamina -= 12.0
	var attack_center := player_pos + facing * 58.0
	var hit_any := false
	if boss_hp > 0.0 and attack_center.distance_to(boss_pos) < 92.0:
		var damage := 9.0 + float(combo) * 0.8
		boss_hp = max(0.0, boss_hp - damage)
		combo += 1
		score += 120
		hit_any = true
		add_particles(boss_pos, Color.html("#facc15"), 12)
	for i in range(minions.size()):
		var m = minions[i]
		if m["hp"] > 0.0 and attack_center.distance_to(m["pos"]) < 64.0:
			m["hp"] = max(0.0, m["hp"] - 2.0)
			m["hit"] = 0.18
			minions[i] = m
			combo += 1
			score += 30
			hit_any = true
			add_particles(m["pos"], Color.html("#ef4444"), 8)
	if learn_mode:
		check_rune_hit(attack_center)
	if not hit_any:
		combo = 0

func start_roll() -> void:
	if roll_cooldown > 0.0 or stamina < 22.0:
		return
	encounter_started = true
	roll_dir = facing.normalized()
	if roll_dir.length() <= 0.0:
		roll_dir = Vector2(0.0, -1.0)
	roll_timer = 0.26
	roll_cooldown = 0.55
	invulnerable_timer = 0.32
	stamina -= 22.0

func drink_vial() -> void:
	if vials <= 0 or player_hp >= PLAYER_MAX_HP or roll_timer > 0.0 or attack_timer > 0.0:
		return
	vials -= 1
	player_hp = mini(PLAYER_MAX_HP, player_hp + 4)
	stamina = minf(PLAYER_MAX_STAMINA, stamina + 18.0)
	message = "Heilflasche. Timing behalten."
	message_timer = 1.4
	add_particles(player_pos, Color.html("#22c55e"), 14)

func check_rune_hit(attack_center: Vector2) -> void:
	var q := get_question()
	for i in range(runes.size()):
		var rune = runes[i]
		if attack_center.distance_to(rune["pos"]) < 72.0:
			rune["hit"] = 0.24
			runes[i] = rune
			if int(rune["index"]) == int(q["correct"]):
				learn_hits += 1
				boss_hp = max(0.0, boss_hp - (18.0 + float(learn_hits) * 1.2))
				stamina = minf(PLAYER_MAX_STAMINA, stamina + 18.0)
				if learn_hits % 3 == 0:
					vials = mini(3, vials + 1)
				score += 250
				message = "Richtig: %s (%d/%d). Boss-Fokus bricht." % [str(rune["label"]), learn_hits, LEARN_GOAL]
				question_index += 1
				spawn_runes()
				add_particles(rune["pos"], Color.html("#38bdf8"), 16)
			else:
				mistakes += 1
				damage_player(1, false)
				message = "Falsche Rune. Tipp: %s" % str(q["hint"])
				add_particles(rune["pos"], Color.html("#ef4444"), 10)
			message_timer = 2.6

func update_boss(delta: float, blocking: bool) -> void:
	if boss_hp <= 0.0:
		return
	boss_phase_two = boss_hp < BOSS_MAX_HP * 0.5
	var to_player: Vector2 = player_pos - boss_pos
	var dist: float = max(1.0, to_player.length())
	var dir: Vector2 = to_player / dist
	if boss_telegraph > 0.0:
		boss_telegraph -= delta
		if boss_telegraph <= 0.0:
			boss_swing = 0.26
			boss_hit_done = false
	elif boss_swing > 0.0:
		boss_swing -= delta
		if not boss_hit_done and boss_swing < 0.16 and dist < 118.0:
			damage_player(2 if boss_phase_two else 1, blocking)
			boss_hit_done = true
	else:
		var boss_speed := 105.0 if boss_phase_two else 78.0
		if dist > 108.0:
			boss_pos += dir * boss_speed * delta
		boss_attack_cd -= delta
		if boss_attack_cd <= 0.0:
			boss_telegraph = 0.58 if boss_phase_two else 0.72
			boss_attack_cd = 1.15 if boss_phase_two else 1.55

func update_minions(delta: float, blocking: bool) -> void:
	for i in range(minions.size()):
		var m = minions[i]
		if m["hp"] <= 0.0:
			continue
		if m["hit"] > 0.0:
			m["hit"] -= delta
		if m["attack_cd"] > 0.0:
			m["attack_cd"] -= delta
		var to_player: Vector2 = player_pos - Vector2(m["pos"])
		var dist: float = max(1.0, to_player.length())
		m["pos"] += (to_player / dist) * (36.0 + float(i % 3) * 8.0) * delta
		if dist < 32.0 and m["attack_cd"] <= 0.0:
			damage_player(1, blocking)
			m["attack_cd"] = 1.1
			m["pos"] -= (to_player / dist) * 64.0
		minions[i] = m

func damage_player(amount: int, blocking: bool) -> void:
	if invulnerable_timer > 0.0:
		return
	if blocking and stamina >= 8.0:
		stamina = max(0.0, stamina - 20.0)
		guard_flash = 0.22
		combo += 1
		score += 45
		message = "Block! Konterfenster offen."
		message_timer = 1.4
		add_particles(player_pos + facing * 22.0, Color.html("#67e8f9"), 8)
		return
	player_hp = max(0, player_hp - amount)
	combo = 0
	invulnerable_timer = 1.05
	message = "Getroffen. Rolle oder Block timing nutzen."
	message_timer = 1.8
	add_particles(player_pos, Color.html("#ef4444"), 12)
	if player_hp <= 0:
		message = "Besiegt. R druecken fuer Neustart."
		message_timer = 99.0

func add_particles(origin: Vector2, color: Color, count: int) -> void:
	for i in range(count):
		var angle := randf() * TAU
		particles.append({
			"pos": origin,
			"vel": Vector2(cos(angle), sin(angle)) * randf_range(80.0, 190.0),
			"life": randf_range(0.28, 0.58),
			"color": color,
		})

func update_particles(delta: float) -> void:
	for i in range(particles.size() - 1, -1, -1):
		var p = particles[i]
		p["life"] -= delta
		p["pos"] += p["vel"] * delta
		p["vel"] *= 0.88
		if p["life"] <= 0.0:
			particles.remove_at(i)
		else:
			particles[i] = p

func _draw() -> void:
	draw_floor()
	if learn_mode:
		draw_runes()
	draw_boss()
	draw_minions()
	draw_player()
	draw_particles()
	draw_hud()

func draw_floor() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color.html("#06190d"), true)
	var cols := int(ceil(size.x / FLOOR_TILE)) + 1
	var rows := int(ceil(size.y / FLOOR_TILE)) + 1
	for y in range(rows):
		for x in range(cols):
			var tone := (x + y) % 2
			var c := Color.html("#0a3b16") if tone == 0 else Color.html("#0d4f1e")
			draw_rect(Rect2(Vector2(float(x) * FLOOR_TILE, float(y) * FLOOR_TILE), Vector2(FLOOR_TILE, FLOOR_TILE)), c, true)
	for x in range(0, int(size.x), 32):
		draw_line(Vector2(float(x), 0.0), Vector2(float(x), size.y), Color(1, 1, 1, 0.025), 1.0)
	for y in range(0, int(size.y), 32):
		draw_line(Vector2(0.0, float(y)), Vector2(size.x, float(y)), Color(1, 1, 1, 0.025), 1.0)
	draw_rect(Rect2(0, 0, size.x, 42), Color.html("#2b1d0f"), true)
	draw_rect(Rect2(0, size.y - 50.0, size.x, 50.0), Color.html("#2b1d0f"), true)

func draw_player() -> void:
	var blink := invulnerable_timer > 0.0 and int(Time.get_ticks_msec() / 80) % 2 == 0
	if blink:
		return
	draw_circle(player_pos + Vector2(0, 22), 21.0, Color(0, 0, 0, 0.28))
	var body := Color.html("#22c55e")
	if guard_flash > 0.0:
		body = Color.html("#67e8f9")
	elif roll_timer > 0.0:
		body = Color.html("#facc15")
	draw_rect(Rect2(player_pos + Vector2(-15, -22), Vector2(30, 14)), Color.html("#166534"), true)
	draw_rect(Rect2(player_pos + Vector2(-18, -10), Vector2(36, 18)), body, true)
	draw_rect(Rect2(player_pos + Vector2(-10, -2), Vector2(20, 23)), Color.html("#064e3b"), true)
	draw_rect(Rect2(player_pos + Vector2(-9, -21), Vector2(18, 15)), Color.html("#fed7aa"), true)
	draw_rect(Rect2(player_pos + Vector2(-5, -15), Vector2(3, 3)), Color.html("#020617"), true)
	draw_rect(Rect2(player_pos + Vector2(4, -15), Vector2(3, 3)), Color.html("#020617"), true)
	draw_rect(Rect2(player_pos + Vector2(-15, 19), Vector2(10, 6)), Color.html("#7c2d12"), true)
	draw_rect(Rect2(player_pos + Vector2(5, 19), Vector2(10, 6)), Color.html("#7c2d12"), true)
	if Input.is_key_pressed(KEY_K) or (touch_overlay != null and touch_overlay.block_down):
		draw_rect(Rect2(player_pos + facing * 22.0 + Vector2(-12, -12), Vector2(24, 26)), Color.html("#2563eb"), true)
		draw_rect(Rect2(player_pos + facing * 22.0 + Vector2(-5, -4), Vector2(10, 9)), Color.html("#facc15"), true)
	if attack_timer > 0.0:
		var a := player_pos + facing * 48.0
		draw_line(player_pos, a + Vector2(-facing.y, facing.x) * 32.0, Color.html("#f8fafc"), 8.0)
		draw_line(a, a + Vector2(-facing.y, facing.x) * 44.0, Color.html("#93c5fd"), 4.0)

func draw_boss() -> void:
	if boss_hp <= 0.0:
		var font := get_theme_default_font()
		draw_string(font, Vector2(size.x * 0.5 - 115.0, 120.0), "Boss besiegt - R fuer Neustart", HORIZONTAL_ALIGNMENT_LEFT, -1, 24, Color.html("#facc15"))
		return
	var color := Color.html("#ef4444") if boss_phase_two else Color.html("#facc15")
	if boss_telegraph > 0.0:
		draw_circle(boss_pos, 128.0, Color(color.r, color.g, color.b, 0.18))
		draw_arc(boss_pos, 128.0, 0.0, TAU, 48, color, 5.0)
	if boss_swing > 0.0:
		draw_circle(boss_pos, 112.0, Color(1.0, 0.25, 0.25, 0.16))
	draw_circle(boss_pos + Vector2(0, 35), 38.0, Color(0, 0, 0, 0.32))
	draw_rect(Rect2(boss_pos + Vector2(-34, -42), Vector2(68, 70)), Color.html("#1f2937"), true)
	draw_rect(Rect2(boss_pos + Vector2(-26, -58), Vector2(52, 22)), color, true)
	draw_rect(Rect2(boss_pos + Vector2(-20, -25), Vector2(9, 9)), Color.html("#f8fafc"), true)
	draw_rect(Rect2(boss_pos + Vector2(12, -25), Vector2(9, 9)), Color.html("#f8fafc"), true)
	draw_rect(Rect2(boss_pos + Vector2(34, -25), Vector2(12, 66)), Color.html("#e5e7eb"), true)
	draw_rect(Rect2(boss_pos + Vector2(-54, -18), Vector2(24, 42)), Color.html("#1d4ed8"), true)
	draw_rect(Rect2(Vector2(330, 52), Vector2(620, 13)), Color.html("#111827"), true)
	draw_rect(Rect2(Vector2(330, 52), Vector2(620.0 * boss_hp / BOSS_MAX_HP, 13)), color, true)

func draw_minions() -> void:
	for m in minions:
		if m["hp"] <= 0.0:
			continue
		var p: Vector2 = m["pos"]
		var c := Color.html("#f87171") if m["hit"] > 0.0 else Color.html("#ef4444")
		draw_circle(p + Vector2(0, 15), 18.0, Color(0, 0, 0, 0.28))
		draw_rect(Rect2(p + Vector2(-20, -12), Vector2(40, 27)), c, true)
		draw_rect(Rect2(p + Vector2(-11, -4), Vector2(8, 8)), Color.html("#f8fafc"), true)
		draw_rect(Rect2(p + Vector2(4, -4), Vector2(8, 8)), Color.html("#f8fafc"), true)
		draw_rect(Rect2(p + Vector2(-8, -1), Vector2(3, 3)), Color.html("#020617"), true)
		draw_rect(Rect2(p + Vector2(7, -1), Vector2(3, 3)), Color.html("#020617"), true)

func draw_runes() -> void:
	var font := get_theme_default_font()
	for rune in runes:
		var p: Vector2 = rune["pos"]
		var active: bool = rune["hit"] > 0.0
		var color: Color = Color.html("#38bdf8") if active else Color.html("#60a5fa")
		var points := PackedVector2Array([p + Vector2(0, -34), p + Vector2(44, 0), p + Vector2(0, 34), p + Vector2(-44, 0)])
		draw_polygon(points, PackedColorArray([Color(color.r, color.g, color.b, 0.58 if active else 0.28)]))
		draw_arc(p, 46.0, 0.0, TAU, 4, color, 3.0)
		draw_rect(Rect2(p + Vector2(-54, -48), Vector2(108, 24)), Color.html("#07111f"), true)
		draw_string(font, p + Vector2(-38, -30), rune["label"], HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color.html("#f8fafc"))

func draw_particles() -> void:
	for p in particles:
		var color: Color = p["color"]
		draw_rect(Rect2(p["pos"] - Vector2(3, 3), Vector2(6, 6)), Color(color.r, color.g, color.b, clampf(p["life"] * 2.0, 0.0, 1.0)), true)

func draw_hud() -> void:
	var font := get_theme_default_font()
	for i in range(PLAYER_MAX_HP):
		var x := 20.0 + float(i) * 22.0
		var c := Color.html("#ef4444") if i < player_hp else Color.html("#1f2937")
		draw_rect(Rect2(x, 18, 15, 15), c, true)
	draw_rect(Rect2(20, 46, 210, 10), Color.html("#111827"), true)
	draw_rect(Rect2(20, 46, 210.0 * stamina / PLAYER_MAX_STAMINA, 10), Color.html("#67e8f9"), true)
	draw_string(font, Vector2(260, 28), "FASKA SOULS PRO", HORIZONTAL_ALIGNMENT_LEFT, -1, 22, Color.html("#f8fafc"))
	draw_string(font, Vector2(260, 56), "Score %d  Combo x%d  Vials %d  Mode %s" % [score, combo, vials, "Learncade" if learn_mode else "Normal"], HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color.html("#cbd5e1"))
	draw_string(font, Vector2(260, 78), "Fach %s  Lernziel %d/%d  Fehler %d" % [str(LESSONS[lesson_index]), learn_hits, LEARN_GOAL, mistakes], HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.html("#fde68a"))
	if learn_mode:
		var q := get_question()
		draw_rect(Rect2(size.x * 0.5 - 270.0, 78.0, 540.0, 58.0), Color(0.02, 0.05, 0.09, 0.76), true)
		draw_string(font, Vector2(size.x * 0.5 - 250.0, 111.0), str(q["prompt"]), HORIZONTAL_ALIGNMENT_CENTER, 500.0, 20, Color.html("#f8fafc"))
	if message_timer > 0.0:
		draw_rect(Rect2(20.0, size.y - 42.0, min(size.x - 40.0, 720.0), 28.0), Color(0.02, 0.05, 0.09, 0.74), true)
		draw_string(font, Vector2(32.0, size.y - 21.0), message, HORIZONTAL_ALIGNMENT_LEFT, -1, 15, Color.html("#f8fafc"))
