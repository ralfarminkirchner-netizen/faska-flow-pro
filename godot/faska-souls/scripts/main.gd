extends Control

const ARENA_SIZE := Vector2(1280.0, 720.0)
const FLOOR_TILE := 64.0
const PLAYER_MAX_HP := 12
const PLAYER_MAX_STAMINA := 100.0
const BOSS_MAX_HP := 180.0
const LEARN_GOAL := 5
const LESSONS := ["WORTART", "MATHE", "SATZ", "ENGLISCH"]
const PARRY_WINDOW := 0.24
const RIPOSTE_WINDOW := 1.25
const RALLY_WINDOW := 3.0

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
	var heavy_down := false
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
		heavy_down = false
		roll_down = false
		block_down = false
		heal_down = false
		learn_down = false
		subject_down = false
		for key in _button_touches.keys():
			var action: String = str(_button_touches[key])
			if action == "attack":
				attack_down = true
			elif action == "heavy":
				heavy_down = true
			elif action == "roll":
				roll_down = true
			elif action == "block" or action == "parry":
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
		var w := 88.0
		var h := 68.0
		var gap := 12.0
		var x := size.x - (w * 3.0 + gap * 2.0 + 24.0)
		var y := size.y - (h * 3.0 + gap * 2.0 + 112.0)
		return [
			{"action": "learn", "label": "L\nLern", "rect": Rect2(Vector2(x, y), Vector2(w, h))},
			{"action": "subject", "label": "C\nFach", "rect": Rect2(Vector2(x + w + gap, y), Vector2(w, h))},
			{"action": "heavy", "label": "U\nHeavy", "rect": Rect2(Vector2(x + (w + gap) * 2.0, y), Vector2(w, h))},
			{"action": "attack", "label": "J\nHieb", "rect": Rect2(Vector2(x, y + h + gap), Vector2(w, h))},
			{"action": "block", "label": "K\nBlock", "rect": Rect2(Vector2(x + w + gap, y + h + gap), Vector2(w, h))},
			{"action": "parry", "label": "K\nParry", "rect": Rect2(Vector2(x + (w + gap) * 2.0, y + h + gap), Vector2(w, h))},
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
			var active := (action == "attack" and attack_down) or (action == "heavy" and heavy_down) or (action == "roll" and roll_down) or (action == "block" and block_down) or (action == "parry" and block_down) or (action == "heal" and heal_down) or (action == "learn" and learn_down) or (action == "subject" and subject_down)
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
var attack_kind := "light"
var roll_timer := 0.0
var roll_cooldown := 0.0
var roll_dir := Vector2.ZERO
var invulnerable_timer := 0.0
var parry_timer := 0.0
var riposte_timer := 0.0
var rally_pool := 0.0
var rally_timer := 0.0
var guard_flash := 0.0
var combo := 0
var score := 0
var vials := 3

var boss_pos := Vector2(640.0, 210.0)
var boss_hp := BOSS_MAX_HP
var boss_attack_cd := 1.8
var boss_telegraph := 0.0
var boss_swing := 0.0
var boss_stagger := 0.0
var boss_attack_kind := "slash"
var boss_attack_dir := Vector2(0.0, 1.0)
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
var last_touch_heavy := false
var last_touch_roll := false
var last_touch_block := false
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
	attack_kind = "light"
	roll_timer = 0.0
	roll_cooldown = 0.0
	invulnerable_timer = 0.0
	parry_timer = 0.0
	riposte_timer = 0.0
	rally_pool = 0.0
	rally_timer = 0.0
	guard_flash = 0.0
	combo = 0
	score = 0
	vials = 3
	boss_pos = Vector2(640.0, 210.0)
	boss_hp = BOSS_MAX_HP
	boss_attack_cd = 1.4
	boss_telegraph = 0.0
	boss_swing = 0.0
	boss_stagger = 0.0
	boss_attack_kind = "slash"
	boss_attack_dir = Vector2(0.0, 1.0)
	boss_hit_done = false
	boss_phase_two = false
	encounter_started = false
	learn_mode = false
	lesson_index = 0
	question_index = 0
	learn_hits = 0
	mistakes = 0
	spawn_minions()
	spawn_runes()
	message = "Normalmodus: Boss lesen, Rolle/Block/Parry timen. L schaltet Learncade-Runen zu."
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
			start_attack("light")
		elif event.keycode == KEY_U:
			start_attack("heavy")
		elif event.keycode == KEY_K:
			start_parry()
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
	if parry_timer > 0.0:
		parry_timer -= delta
	if riposte_timer > 0.0:
		riposte_timer -= delta
	if rally_timer > 0.0:
		rally_timer -= delta
	else:
		rally_pool = maxf(0.0, rally_pool - delta * 2.0)
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
		start_attack("light")
	if touch_overlay.heavy_down and not last_touch_heavy:
		start_attack("heavy")
	if touch_overlay.roll_down and not last_touch_roll:
		start_roll()
	if touch_overlay.block_down and not last_touch_block:
		start_parry()
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
	last_touch_heavy = touch_overlay.heavy_down
	last_touch_roll = touch_overlay.roll_down
	last_touch_block = touch_overlay.block_down
	last_touch_heal = touch_overlay.heal_down
	last_touch_learn = touch_overlay.learn_down
	last_touch_subject = touch_overlay.subject_down

func start_attack(kind: String = "light") -> void:
	var stamina_cost := 12.0
	var duration := 0.18
	var cooldown := 0.34
	var reach := 58.0
	var boss_range := 92.0
	var minion_range := 64.0
	if kind == "heavy":
		stamina_cost = 26.0
		duration = 0.34
		cooldown = 0.68
		reach = 76.0
		boss_range = 116.0
		minion_range = 82.0
	if riposte_timer > 0.0 and player_pos.distance_to(boss_pos) < 132.0 and boss_stagger > 0.0:
		kind = "riposte"
		stamina_cost = 8.0
		duration = 0.24
		cooldown = 0.42
		reach = 82.0
		boss_range = 144.0
	if attack_cooldown > 0.0 or stamina < stamina_cost or roll_timer > 0.0:
		return
	encounter_started = true
	attack_kind = kind
	attack_timer = duration
	attack_cooldown = cooldown
	stamina -= stamina_cost
	var attack_center := player_pos + facing * reach
	var hit_any := false
	if boss_hp > 0.0 and attack_center.distance_to(boss_pos) < boss_range:
		var damage := 9.0 + float(combo) * 0.8
		if kind == "heavy":
			damage = 16.0 + float(combo) * 0.9
			boss_stagger = maxf(boss_stagger, 0.34)
		elif kind == "riposte":
			damage = 34.0
			boss_stagger = 0.0
			riposte_timer = 0.0
			message = "Riposte! Kritischer Treffer."
			message_timer = 1.6
		boss_hp = max(0.0, boss_hp - damage)
		apply_rally(2.0 if kind != "light" else 1.0)
		combo += 1
		score += 120 if kind == "light" else 190
		hit_any = true
		add_particles(boss_pos, Color.html("#facc15") if kind != "riposte" else Color.html("#f8fafc"), 12 if kind != "riposte" else 22)
	for i in range(minions.size()):
		var m = minions[i]
		if m["hp"] > 0.0 and attack_center.distance_to(m["pos"]) < minion_range:
			m["hp"] = max(0.0, m["hp"] - (3.0 if kind == "heavy" else 2.0))
			m["hit"] = 0.18
			minions[i] = m
			apply_rally(0.75)
			combo += 1
			score += 30
			hit_any = true
			add_particles(m["pos"], Color.html("#ef4444"), 8)
	if learn_mode:
		check_rune_hit(attack_center)
	if not hit_any:
		combo = 0

func start_parry() -> void:
	if stamina < 10.0 or roll_timer > 0.0 or attack_timer > 0.0:
		return
	parry_timer = PARRY_WINDOW
	stamina = maxf(0.0, stamina - 10.0)
	guard_flash = 0.16

func apply_rally(amount: float) -> void:
	if rally_pool <= 0.0 or rally_timer <= 0.0 or player_hp >= PLAYER_MAX_HP:
		return
	var recovered := minf(rally_pool, amount)
	rally_pool -= recovered
	player_hp = mini(PLAYER_MAX_HP, player_hp + int(ceil(recovered)))
	score += int(recovered * 45.0)

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
	if boss_stagger > 0.0:
		boss_stagger -= delta
		boss_attack_cd = maxf(boss_attack_cd, 0.42)
		return
	var to_player: Vector2 = player_pos - boss_pos
	var dist: float = max(1.0, to_player.length())
	var dir: Vector2 = to_player / dist
	if boss_telegraph > 0.0:
		boss_telegraph -= delta
		if boss_telegraph <= 0.0:
			boss_swing = 0.34 if boss_attack_kind == "slam" else 0.26
			boss_hit_done = false
	elif boss_swing > 0.0:
		boss_swing -= delta
		if not boss_hit_done and boss_swing < 0.18 and boss_attack_hits(dist, dir):
			damage_player(boss_attack_damage(), blocking, boss_pos)
			boss_hit_done = true
	else:
		var boss_speed := 105.0 if boss_phase_two else 78.0
		if dist > 108.0:
			boss_pos += dir * boss_speed * delta
		boss_attack_cd -= delta
		if boss_attack_cd <= 0.0:
			choose_boss_attack(dist, dir)

func choose_boss_attack(dist: float, dir: Vector2) -> void:
	boss_attack_dir = dir
	if boss_phase_two and sin(Time.get_ticks_msec() * 0.004) > 0.35:
		boss_attack_kind = "slam"
	elif dist > 152.0:
		boss_attack_kind = "thrust"
	else:
		boss_attack_kind = "slash"
	if boss_attack_kind == "slam":
		boss_telegraph = 0.82
		boss_attack_cd = 1.35
	elif boss_attack_kind == "thrust":
		boss_telegraph = 0.62
		boss_attack_cd = 1.25 if boss_phase_two else 1.45
	else:
		boss_telegraph = 0.55 if boss_phase_two else 0.70
		boss_attack_cd = 1.12 if boss_phase_two else 1.55

func boss_attack_hits(dist: float, dir_to_player: Vector2) -> bool:
	if boss_attack_kind == "slam":
		return dist < 162.0
	if boss_attack_kind == "thrust":
		return dist < 198.0 and boss_attack_dir.dot(dir_to_player) > 0.68
	return dist < 124.0

func boss_attack_damage() -> int:
	if boss_attack_kind == "slam":
		return 3 if boss_phase_two else 2
	if boss_attack_kind == "thrust":
		return 2
	return 2 if boss_phase_two else 1

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
			damage_player(1, blocking, Vector2(m["pos"]))
			m["attack_cd"] = 1.1
			m["pos"] -= (to_player / dist) * 64.0
		minions[i] = m

func damage_player(amount: int, blocking: bool, source_pos: Vector2 = Vector2.ZERO) -> void:
	if invulnerable_timer > 0.0:
		return
	if parry_timer > 0.0 and source_pos != Vector2.ZERO:
		parry_timer = 0.0
		riposte_timer = RIPOSTE_WINDOW
		boss_stagger = maxf(boss_stagger, RIPOSTE_WINDOW)
		stamina = minf(PLAYER_MAX_STAMINA, stamina + 24.0)
		combo += 1
		score += 260
		message = "Parry! Boss offen fuer Riposte."
		message_timer = 1.5
		add_particles(source_pos, Color.html("#38bdf8"), 18)
		add_particles(player_pos, Color.html("#f8fafc"), 10)
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
	rally_pool = minf(4.0, rally_pool + float(amount))
	rally_timer = RALLY_WINDOW
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
	if parry_timer > 0.0:
		draw_arc(player_pos, 48.0, 0.0, TAU, 44, Color.html("#38bdf8"), 5.0)
	if rally_pool > 0.0 and rally_timer > 0.0:
		draw_arc(player_pos, 58.0, -PI * 0.5, -PI * 0.5 + TAU * (rally_timer / RALLY_WINDOW), 34, Color.html("#fb7185"), 4.0)
	if attack_timer > 0.0:
		var a := player_pos + facing * 48.0
		var slash_color := Color.html("#93c5fd")
		var slash_width := 8.0
		if attack_kind == "heavy":
			slash_color = Color.html("#facc15")
			slash_width = 11.0
		elif attack_kind == "riposte":
			slash_color = Color.html("#f8fafc")
			slash_width = 13.0
		draw_line(player_pos, a + Vector2(-facing.y, facing.x) * 32.0, Color.html("#f8fafc"), slash_width)
		draw_line(a, a + Vector2(-facing.y, facing.x) * 52.0, slash_color, slash_width * 0.5)

func draw_boss() -> void:
	if boss_hp <= 0.0:
		var font := get_theme_default_font()
		draw_string(font, Vector2(size.x * 0.5 - 115.0, 120.0), "Boss besiegt - R fuer Neustart", HORIZONTAL_ALIGNMENT_LEFT, -1, 24, Color.html("#facc15"))
		return
	var color := Color.html("#ef4444") if boss_phase_two else Color.html("#facc15")
	if boss_telegraph > 0.0:
		if boss_attack_kind == "slam":
			draw_circle(boss_pos, 162.0, Color(color.r, color.g, color.b, 0.16))
			draw_arc(boss_pos, 162.0, 0.0, TAU, 56, color, 6.0)
		elif boss_attack_kind == "thrust":
			var end := boss_pos + boss_attack_dir * 208.0
			var side := Vector2(-boss_attack_dir.y, boss_attack_dir.x) * 34.0
			draw_polygon(PackedVector2Array([boss_pos + side, end, boss_pos - side]), PackedColorArray([Color(color.r, color.g, color.b, 0.18)]))
			draw_line(boss_pos, end, color, 8.0)
		else:
			draw_circle(boss_pos, 124.0, Color(color.r, color.g, color.b, 0.14))
			draw_arc(boss_pos, 124.0, -PI * 0.2, PI * 1.2, 42, color, 6.0)
	if boss_swing > 0.0:
		draw_circle(boss_pos, 112.0, Color(1.0, 0.25, 0.25, 0.16))
	if boss_stagger > 0.0:
		draw_arc(boss_pos, 88.0, 0.0, TAU, 48, Color.html("#38bdf8"), 6.0)
		draw_string(get_theme_default_font(), boss_pos + Vector2(-54.0, -82.0), "STAGGER", HORIZONTAL_ALIGNMENT_CENTER, 108.0, 16, Color.html("#38bdf8"))
	draw_circle(boss_pos + Vector2(0, 35), 38.0, Color(0, 0, 0, 0.32))
	draw_rect(Rect2(boss_pos + Vector2(-34, -42), Vector2(68, 70)), Color.html("#1f2937"), true)
	draw_rect(Rect2(boss_pos + Vector2(-26, -58), Vector2(52, 22)), color, true)
	draw_rect(Rect2(boss_pos + Vector2(-20, -25), Vector2(9, 9)), Color.html("#f8fafc"), true)
	draw_rect(Rect2(boss_pos + Vector2(12, -25), Vector2(9, 9)), Color.html("#f8fafc"), true)
	draw_rect(Rect2(boss_pos + Vector2(34, -25), Vector2(12, 66)), Color.html("#e5e7eb"), true)
	draw_rect(Rect2(boss_pos + Vector2(-54, -18), Vector2(24, 42)), Color.html("#1d4ed8"), true)
	var boss_bar_x := size.x * 0.5 - 260.0
	draw_rect(Rect2(Vector2(boss_bar_x, 30), Vector2(520, 13)), Color.html("#111827"), true)
	draw_rect(Rect2(Vector2(boss_bar_x, 30), Vector2(520.0 * boss_hp / BOSS_MAX_HP, 13)), color, true)
	draw_string(get_theme_default_font(), Vector2(boss_bar_x, 25.0), boss_attack_kind.to_upper() if boss_telegraph > 0.0 else "BOSS", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, color)

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
	if rally_pool > 0.0 and rally_timer > 0.0:
		draw_rect(Rect2(20, 60, 210.0 * minf(1.0, rally_pool / 4.0), 6), Color.html("#fb7185"), true)
	draw_string(font, Vector2(20, 86), "FASKA SOULS PRO", HORIZONTAL_ALIGNMENT_LEFT, -1, 21, Color.html("#f8fafc"))
	draw_string(font, Vector2(20, 112), "Score %d  Combo x%d  Vials %d  Mode %s" % [score, combo, vials, "Learncade" if learn_mode else "Normal"], HORIZONTAL_ALIGNMENT_LEFT, -1, 15, Color.html("#cbd5e1"))
	draw_string(font, Vector2(20, 133), "Fach %s  Lernziel %d/%d  Fehler %d  Riposte %.1f  Rally %.1f" % [str(LESSONS[lesson_index]), learn_hits, LEARN_GOAL, mistakes, maxf(0.0, riposte_timer), maxf(0.0, rally_timer)], HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color.html("#fde68a"))
	if learn_mode:
		var q := get_question()
		draw_rect(Rect2(size.x * 0.5 - 270.0, 72.0, 540.0, 58.0), Color(0.02, 0.05, 0.09, 0.76), true)
		draw_string(font, Vector2(size.x * 0.5 - 250.0, 105.0), str(q["prompt"]), HORIZONTAL_ALIGNMENT_CENTER, 500.0, 20, Color.html("#f8fafc"))
	if message_timer > 0.0:
		draw_rect(Rect2(20.0, size.y - 88.0, min(size.x - 40.0, 760.0), 28.0), Color(0.02, 0.05, 0.09, 0.74), true)
		draw_string(font, Vector2(32.0, size.y - 67.0), message, HORIZONTAL_ALIGNMENT_LEFT, min(size.x - 64.0, 732.0), 15, Color.html("#f8fafc"))
	if size.x >= 980.0:
		draw_string(font, Vector2(24.0, size.y - 116.0), "J Light  U Heavy  K Block/Parry  Space Roll  H Heal  L Learncade  C Fach  R Reset", HORIZONTAL_ALIGNMENT_LEFT, size.x - 48.0, 13, Color.html("#bbf7d0"))
