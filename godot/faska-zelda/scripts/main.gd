extends Control

const TILE_SIZE := 40.0
const MAP_W := 38
const MAP_H := 28
const LEARN_GOAL := 6
const COMBO_WINDOW := 4.5
const GUARDIAN_WAVE_DELAY := 0.42

const FLOOR := 0
const WALL := 1
const WATER := 2
const BRIDGE := 3
const FLOWER := 4
const PATH := 5
const RUIN := 6

const LESSONS := ["WORTART", "MATHE", "SATZ", "LESEN", "KOMPOSITUM", "ENGLISCH"]

const QUESTIONS_WORD := [
	{"prompt": "Welche Wortart ist 'mutig'?", "answers": ["Nomen", "Verb", "Adjektiv"], "correct": 2, "hint": "Mutig beschreibt, wie jemand ist."},
	{"prompt": "Welche Wortart ist 'kaempfen'?", "answers": ["Verb", "Artikel", "Nomen"], "correct": 0, "hint": "Kaempfen ist etwas, das man tun kann."},
	{"prompt": "Welche Wortart ist 'die'?", "answers": ["Adjektiv", "Artikel", "Verb"], "correct": 1, "hint": "Die steht vor einem Nomen."},
	{"prompt": "Welche Wortart ist 'Burg'?", "answers": ["Nomen", "Verb", "Artikel"], "correct": 0, "hint": "Eine Burg ist ein Ding."},
	{"prompt": "Welche Wortart ist 'unter'?", "answers": ["Praeposition", "Verb", "Nomen"], "correct": 0, "hint": "Unter zeigt einen Ort oder eine Lage."},
	{"prompt": "Welche Wortart ist 'leise'?", "answers": ["Artikel", "Adjektiv", "Nomen"], "correct": 1, "hint": "Leise beschreibt, wie etwas klingt."},
	{"prompt": "Welche Wortart ist 'wir'?", "answers": ["Pronomen", "Verb", "Artikel"], "correct": 0, "hint": "Wir steht fuer Personen."},
	{"prompt": "Welche Wortart ist 'heute'?", "answers": ["Adverb", "Nomen", "Artikel"], "correct": 0, "hint": "Heute sagt, wann etwas passiert."},
]

const QUESTIONS_MATH := [
	{"prompt": "Welche Zahl oeffnet das Tor? 7 + 5", "answers": ["11", "12", "13"], "correct": 1, "hint": "Zaehle von 7 fuenf weiter."},
	{"prompt": "Welche Zahl passt? 3 x 4", "answers": ["7", "12", "14"], "correct": 1, "hint": "Drei Vierergruppen."},
	{"prompt": "Welche Zahl fehlt? 18 - ? = 10", "answers": ["6", "8", "9"], "correct": 1, "hint": "Von 18 bis 10 sind es 8."},
	{"prompt": "Welche Zahl ist gerade?", "answers": ["15", "18", "21"], "correct": 1, "hint": "Gerade Zahlen lassen sich durch 2 teilen."},
	{"prompt": "Welche Zahl passt? 6 x 7", "answers": ["36", "42", "48"], "correct": 1, "hint": "Sechs Siebener sind 42."},
	{"prompt": "Was ist die Haelfte von 34?", "answers": ["16", "17", "18"], "correct": 1, "hint": "17 + 17 = 34."},
	{"prompt": "Welche Zahl fehlt? ? + 9 = 25", "answers": ["14", "16", "18"], "correct": 1, "hint": "25 minus 9 ist 16."},
	{"prompt": "Was ist 56 : 8?", "answers": ["6", "7", "9"], "correct": 1, "hint": "8 mal 7 ist 56."},
]

const QUESTIONS_SENTENCE := [
	{"prompt": "Welches Wort gehoert in den Satz? Der Ritter ___ schnell.", "answers": ["rennt", "blau", "der"], "correct": 0, "hint": "Gesucht ist ein Tunwort."},
	{"prompt": "Welche Satzstelle ist das Subjekt? Luna findet den Stern.", "answers": ["Luna", "findet", "den Stern"], "correct": 0, "hint": "Wer findet den Stern?"},
	{"prompt": "Welches Wort beendet den Satz sinnvoll? Die Bruecke ist ___.", "answers": ["springt", "stabil", "und"], "correct": 1, "hint": "Gesucht ist eine Eigenschaft."},
	{"prompt": "Was ist das Prädikat? Bruno hebt den Schild.", "answers": ["Bruno", "hebt", "den Schild"], "correct": 1, "hint": "Was tut Bruno?"},
	{"prompt": "Was ist das Objekt? Roni findet die Rune.", "answers": ["Roni", "findet", "die Rune"], "correct": 2, "hint": "Was findet Roni?"},
	{"prompt": "Welche Satzstelle nennt den Ort? Am Tor wartet Lumi.", "answers": ["Am Tor", "wartet", "Lumi"], "correct": 0, "hint": "Wo wartet Lumi?"},
	{"prompt": "Welches Satzzeichen passt? Hilfst du mir", "answers": [".", "?", ","], "correct": 1, "hint": "Es ist eine Frage."},
	{"prompt": "Welcher Satz ist vollstaendig?", "answers": ["Der Wald dunkel.", "Der Wald rauscht.", "Der Wald und."], "correct": 1, "hint": "Subjekt und Praedikat sind da."},
]

const QUESTIONS_READING := [
	{"prompt": "Lies genau: Wohin geht der Held?", "answers": ["zur Bruecke", "in den See", "unter den Tisch"], "correct": 0, "hint": "Das Ziel liegt ueber dem Wasser."},
	{"prompt": "Welches Wort reimt sich auf Wald?", "answers": ["kalt", "Wiese", "Turm"], "correct": 0, "hint": "Beide enden aehnlich."},
	{"prompt": "Welches Wort beginnt wie Schwert?", "answers": ["Schule", "Tor", "Bach"], "correct": 0, "hint": "Hoere auf den Anfang: Sch."},
	{"prompt": "Welche Anweisung passt? Gehe zum Tor.", "answers": ["Tor", "Wasser", "Blume"], "correct": 0, "hint": "Der Satz nennt den Zielort."},
	{"prompt": "Lies genau: Nimm den goldenen Splitter.", "answers": ["Splitter", "Schild", "Bombe"], "correct": 0, "hint": "Der Satz nennt den Splitter."},
	{"prompt": "Welches Wort hat zwei Silben?", "answers": ["Tor", "Luna", "Wald"], "correct": 1, "hint": "Lu-na."},
	{"prompt": "Welches Wort beginnt mit Br?", "answers": ["Bruecke", "Blume", "Turm"], "correct": 0, "hint": "Br steht am Anfang."},
	{"prompt": "Was passt zum Satz? Bruno schuetzt sich mit dem Schild.", "answers": ["Schild", "Schatz", "Schloss"], "correct": 0, "hint": "Der Satz nennt den Schild."},
]

const QUESTIONS_COMPOUND := [
	{"prompt": "Welche zwei Woerter stecken in Waldtor?", "answers": ["Wald + Tor", "Wand + Tor", "Wald + Ton"], "correct": 0, "hint": "Das Tor steht im Wald."},
	{"prompt": "Welches Kompositum passt: Stern + Splitter", "answers": ["Sternsplitter", "Splitternstern", "Sternlicht"], "correct": 0, "hint": "Der Splitter kommt vom Stern."},
	{"prompt": "Was ist das Grundwort von Brueckenwaechter?", "answers": ["Bruecke", "Waechter", "Weg"], "correct": 1, "hint": "Das letzte Wort bestimmt die Sache."},
	{"prompt": "Welches Wort ist kein Kompositum?", "answers": ["Baumhaus", "Wasserfall", "mutig"], "correct": 2, "hint": "Mutig ist eine Eigenschaft."},
	{"prompt": "Welche Verbindung passt? Schild + Hand", "answers": ["Schildhand", "Handschild", "Schilder"], "correct": 0, "hint": "So kann eine Hand bezeichnet werden."},
	{"prompt": "Welches Bestimmungswort hat Mondbruecke?", "answers": ["Mond", "Bruecke", "Mund"], "correct": 0, "hint": "Es beschreibt die Bruecke genauer."},
]

const QUESTIONS_ENGLISH := [
	{"prompt": "Was heisst 'sword'?", "answers": ["Schwert", "Schild", "Tor"], "correct": 0, "hint": "Mit a sword greift man an."},
	{"prompt": "Was heisst 'shield'?", "answers": ["Schild", "Splitter", "Wasser"], "correct": 0, "hint": "A shield schuetzt."},
	{"prompt": "Was heisst 'forest'?", "answers": ["Wald", "Bruecke", "Burg"], "correct": 0, "hint": "Im forest stehen viele Baeume."},
	{"prompt": "Welches Wort bedeutet 'Tor'?", "answers": ["gate", "coin", "heart"], "correct": 0, "hint": "Ein gate ist ein Durchgang."},
	{"prompt": "Was heisst 'heart'?", "answers": ["Herz", "Schwert", "Weg"], "correct": 0, "hint": "A heart heilt dich."},
	{"prompt": "Was heisst 'run'?", "answers": ["laufen", "lesen", "tragen"], "correct": 0, "hint": "Run passt zum Abenteuerlauf."},
]

class TouchAdventureOverlay:
	extends Control

	var move_vector := Vector2.ZERO
	var sword_down := false
	var shield_down := false
	var dash_down := false
	var bomb_down := false
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
		if not _should_show_touch():
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
					move_vector = Vector2.ZERO
				if _button_touches.has(event.index):
					_button_touches.erase(event.index)
					_refresh_buttons()
		elif event is InputEventScreenDrag:
			if event.index == _move_touch:
				_update_move(event.position)

	func _update_move(pos: Vector2) -> void:
		var ui := _ui_scale()
		var center := _stick_center()
		var radius := 112.0 * ui
		move_vector = (pos - center) / radius
		if move_vector.length() > 1.0:
			move_vector = move_vector.normalized()
		if move_vector.length() < 0.14:
			move_vector = Vector2.ZERO

	func _refresh_buttons() -> void:
		sword_down = false
		shield_down = false
		dash_down = false
		bomb_down = false
		learn_down = false
		subject_down = false
		for key in _button_touches.keys():
			var action: String = str(_button_touches[key])
			if action == "sword":
				sword_down = true
			elif action == "shield":
				shield_down = true
			elif action == "dash":
				dash_down = true
			elif action == "bomb":
				bomb_down = true
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
		return Vector2(128.0 * _ui_scale(), size.y - 240.0 * _ui_scale())

	func _buttons() -> Array:
		var ui := _ui_scale()
		var button_w := 112.0 * ui
		var button_h := 82.0 * ui
		var gap := 14.0 * ui
		var cluster_x := size.x - (button_w * 2.0 + gap + 28.0 * ui)
		var cluster_y := size.y - (button_h * 2.0 + gap + 126.0 * ui)
		return [
			{"action": "learn", "label": "L\nLern", "rect": Rect2(Vector2(cluster_x, cluster_y - button_h - gap), Vector2(button_w, button_h))},
			{"action": "subject", "label": "C\nFach", "rect": Rect2(Vector2(cluster_x + button_w + gap, cluster_y - button_h - gap), Vector2(button_w, button_h))},
			{"action": "sword", "label": "J\nHieb", "rect": Rect2(Vector2(cluster_x, cluster_y), Vector2(button_w, button_h))},
			{"action": "shield", "label": "K\nSchild", "rect": Rect2(Vector2(cluster_x + button_w + gap, cluster_y), Vector2(button_w, button_h))},
			{"action": "dash", "label": "A\nDash", "rect": Rect2(Vector2(cluster_x, cluster_y + button_h + gap), Vector2(button_w, button_h))},
			{"action": "bomb", "label": "B\nBombe", "rect": Rect2(Vector2(cluster_x + button_w + gap, cluster_y + button_h + gap), Vector2(button_w, button_h))},
		]

	func _draw() -> void:
		if _should_show_touch():
			_draw_stick()
			_draw_buttons()

	func _should_show_touch() -> bool:
		return size.x < 960.0 or size.y > size.x * 1.25

	func _ui_scale() -> float:
		if size.x <= 520.0 or size.y > size.x * 1.35:
			return 1.12
		return 1.0

	func _draw_stick() -> void:
		var ui := _ui_scale()
		var center := _stick_center()
		draw_circle(center, 112.0 * ui, Color(0.02, 0.05, 0.09, 0.48))
		draw_arc(center, 112.0 * ui, 0.0, TAU, 34, Color(0.78, 0.88, 1.0, 0.5), 5.0 * ui)
		draw_circle(center + move_vector * 58.0 * ui, 44.0 * ui, Color(0.93, 0.96, 1.0, 0.78))

	func _draw_buttons() -> void:
		var font := get_theme_default_font()
		var ui := _ui_scale()
		for button in _buttons():
			var rect: Rect2 = button["rect"]
			var action: String = str(button["action"])
			var active := (action == "sword" and sword_down) or (action == "shield" and shield_down) or (action == "dash" and dash_down) or (action == "bomb" and bomb_down) or (action == "learn" and learn_down) or (action == "subject" and subject_down)
			draw_rect(rect, Color(0.02, 0.05, 0.09, 0.62), true)
			draw_rect(rect, Color.html("#facc15") if active else Color(0.78, 0.88, 1.0, 0.55), false, 5.0 * ui)
			var lines := str(button["label"]).split("\n")
			for i in range(lines.size()):
				draw_string(font, rect.position + Vector2(0.0, (32.0 + float(i) * 27.0) * ui), lines[i], HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, 24 * ui, Color.html("#f8fafc"))

var tiles: Array = []
var player_pos := Vector2(150.0, 150.0)
var player_hp := 6
var player_max_hp := 6
var stamina := 100.0
var facing := Vector2(0.0, 1.0)
var velocity := Vector2.ZERO
var camera_pos := Vector2.ZERO
var score := 0
var combat_combo := 0
var combo_timer := 0.0
var best_combo := 0
var shards := 0
var keys := 0
var opened_chests := 0
var opened_doors := 0
var bombs_left := 2
var mode_learn := false
var lesson_index := 0
var question_index := 0
var repeat_queue := []
var learn_hits := 0
var mistakes := 0
var attack_timer := 0.0
var attack_cooldown := 0.0
var attack_chain := 0
var dash_timer := 0.0
var dash_cooldown := 0.0
var counter_timer := 0.0
var hurt_cooldown := 0.0
var shield_active := false
var message := "Finde 3 Splitter, besiege den Torwaechter und oeffne das Sternentor."
var message_timer := 4.0
var won := false
var game_over := false
var enemies: Array = []
var objects: Array = []
var pickups: Array = []
var bombs: Array = []
var explosions: Array = []
var guardian_waves: Array = []
var shrines: Array = []
var chests: Array = []
var locked_doors: Array = []
var exit_cell := Vector2i(MAP_W - 4, 3)
var exit_open := false
var walk_phase := 0.0
var touch_overlay: TouchAdventureOverlay
var last_touch_sword := false
var last_touch_dash := false
var last_touch_bomb := false
var last_touch_learn := false
var last_touch_subject := false

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_STOP
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	touch_overlay = TouchAdventureOverlay.new()
	add_child(touch_overlay)
	reset_game()

func reset_game() -> void:
	tiles.clear()
	for y in range(MAP_H):
		var row: Array = []
		for x in range(MAP_W):
			row.append(make_tile(x, y))
		tiles.append(row)
	player_pos = cell_center(Vector2i(4, 5))
	player_hp = player_max_hp
	stamina = 100.0
	facing = Vector2(0.0, 1.0)
	velocity = Vector2.ZERO
	score = 0
	combat_combo = 0
	combo_timer = 0.0
	best_combo = 0
	shards = 0
	keys = 0
	opened_chests = 0
	opened_doors = 0
	bombs_left = 2
	mode_learn = false
	lesson_index = 0
	question_index = 0
	repeat_queue.clear()
	learn_hits = 0
	mistakes = 0
	attack_timer = 0.0
	attack_cooldown = 0.0
	attack_chain = 0
	dash_timer = 0.0
	dash_cooldown = 0.0
	counter_timer = 0.0
	hurt_cooldown = 0.0
	won = false
	game_over = false
	exit_open = false
	bombs.clear()
	explosions.clear()
	guardian_waves.clear()
	pickups.clear()
	chests.clear()
	locked_doors.clear()
	spawn_objects()
	spawn_enemies()
	setup_chests()
	setup_locked_doors()
	setup_shrines()
	message = "Normalmodus: Finde Schluessel, oeffne Tore, sammle 3 Splitter und besiege den Waechter."
	message_timer = 4.0

func make_tile(x: int, y: int) -> int:
	var border: bool = x == 0 or y == 0 or x == MAP_W - 1 or y == MAP_H - 1
	if border:
		return WALL
	if y == 12 or y == 13:
		if x >= 12 and x <= 17:
			return BRIDGE
		return WATER
	if is_ruin_cell(Vector2i(x, y)):
		return RUIN
	if is_path_cell(Vector2i(x, y)):
		return PATH
	if (x == 8 and y > 5 and y < 20) or (x == 25 and y > 3 and y < 22):
		if y % 5 != 0:
			return WALL
	if (x * 11 + y * 7) % 29 == 0 and x > 5 and y > 4 and x < MAP_W - 5:
		return FLOWER
	return FLOOR

func is_path_cell(cell: Vector2i) -> bool:
	if cell.y == 6 and cell.x >= 3 and cell.x <= 31:
		return true
	if cell.x == 14 and cell.y >= 6 and cell.y <= 22:
		return true
	if cell.y == 20 and cell.x >= 6 and cell.x <= 34:
		return true
	if cell.x == 30 and cell.y >= 6 and cell.y <= 21:
		return true
	return false

func is_ruin_cell(cell: Vector2i) -> bool:
	var in_north_ruin := cell.x >= 27 and cell.x <= 35 and cell.y >= 3 and cell.y <= 9
	var in_south_ruin := cell.x >= 20 and cell.x <= 26 and cell.y >= 17 and cell.y <= 23
	return in_north_ruin or in_south_ruin

func spawn_objects() -> void:
	objects.clear()
	var cells: Array = [
		Vector2i(7, 4), Vector2i(11, 7), Vector2i(15, 5), Vector2i(20, 7),
		Vector2i(28, 8), Vector2i(31, 6), Vector2i(5, 16), Vector2i(10, 18),
		Vector2i(14, 21), Vector2i(22, 20), Vector2i(30, 18), Vector2i(33, 22),
	]
	for i in range(cells.size()):
		objects.append({"cell": cells[i], "type": "pot" if i % 2 == 0 else "bush", "hp": 1})
	objects.append({"cell": Vector2i(18, 12), "type": "crystal", "hp": 2})
	objects.append({"cell": Vector2i(19, 13), "type": "crystal", "hp": 2})

func setup_chests() -> void:
	chests.clear()
	chests.append({"cell": Vector2i(6, 6), "reward": "key", "label": "K1", "opened": false})
	chests.append({"cell": Vector2i(13, 9), "reward": "heart", "label": "HP", "opened": false})
	chests.append({"cell": Vector2i(16, 16), "reward": "shard", "label": "S1", "opened": false})
	chests.append({"cell": Vector2i(22, 7), "reward": "key", "label": "K2", "opened": false})
	chests.append({"cell": Vector2i(23, 21), "reward": "bomb", "label": "B", "opened": false})
	chests.append({"cell": Vector2i(31, 20), "reward": "shard", "label": "S2", "opened": false})

func setup_locked_doors() -> void:
	locked_doors.clear()
	locked_doors.append({"id": "river", "cell": Vector2i(8, 10), "opened": false, "label": "K"})
	locked_doors.append({"id": "boss", "cell": Vector2i(25, 5), "opened": false, "label": "BOSS"})

func spawn_enemies() -> void:
	enemies.clear()
	var starts: Array = [
		Vector2i(13, 4), Vector2i(21, 5), Vector2i(30, 10), Vector2i(7, 21),
		Vector2i(17, 20), Vector2i(26, 23), Vector2i(33, 15),
	]
	for i in range(starts.size()):
		var hp := 2 + int(i % 3 == 0)
		enemies.append({
			"pos": cell_center(starts[i]),
			"hp": hp,
			"max_hp": hp,
			"kind": "slime" if i % 2 == 0 else "soldier",
			"timer": 0.2 + float(i) * 0.07,
			"phase": 1,
			"slam": 0.0,
			"rush": 0.0,
			"rush_dir": Vector2.ZERO,
			"slam_done": true,
			"hit": 0.0,
		})
	enemies.append({"pos": cell_center(Vector2i(MAP_W - 6, 5)), "hp": 14, "max_hp": 14, "kind": "guardian", "timer": 0.2, "phase": 1, "slam": 0.0, "rush": 0.0, "rush_dir": Vector2.ZERO, "slam_done": true, "hit": 0.0})

func setup_shrines() -> void:
	shrines.clear()
	var q: Dictionary = current_question()
	var cells: Array = [Vector2i(6, 23), Vector2i(19, 4), Vector2i(31, 22)]
	for i in range(cells.size()):
		var answers: Array = q["answers"]
		shrines.append({"cell": cells[i], "label": answers[i], "index": i, "armed": true, "repeat": q.get("repeat", false)})

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
	setup_shrines()
	message = "Fach: %s. Schreine wurden neu gesetzt." % str(LESSONS[lesson_index])
	message_timer = 2.0

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_R:
			reset_game()
		elif event.keycode == KEY_L:
			mode_learn = not mode_learn
			message = "Learncade: Triff den richtigen Schrein mit dem Schwert." if mode_learn else "Normalmodus: Splitter, Gegner und Sternentor."
			message_timer = 3.0
		elif event.keycode == KEY_C:
			cycle_lesson()
		elif event.keycode == KEY_J:
			start_attack()
		elif event.keycode == KEY_SPACE:
			start_dash()
		elif event.keycode == KEY_B:
			place_bomb()

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()
	if game_over or won:
		queue_redraw()
		return
	tick_timers(delta)
	update_touch_actions()
	handle_player(delta)
	update_locked_doors()
	update_bombs(delta)
	update_guardian_waves(delta)
	update_enemies(delta)
	collect_pickups()
	update_exit_state()
	update_camera()
	queue_redraw()

func update_touch_actions() -> void:
	if touch_overlay == null:
		return
	if touch_overlay.sword_down and not last_touch_sword:
		start_attack()
	if touch_overlay.dash_down and not last_touch_dash:
		start_dash()
	if touch_overlay.bomb_down and not last_touch_bomb:
		place_bomb()
	if touch_overlay.learn_down and not last_touch_learn:
		mode_learn = not mode_learn
		message = "Learncade: Schreine zaehlen als Lernziel." if mode_learn else "Normalmodus: Erkunde und besiege den Waechter."
		message_timer = 2.2
	if touch_overlay.subject_down and not last_touch_subject:
		cycle_lesson()
	last_touch_sword = touch_overlay.sword_down
	last_touch_dash = touch_overlay.dash_down
	last_touch_bomb = touch_overlay.bomb_down
	last_touch_learn = touch_overlay.learn_down
	last_touch_subject = touch_overlay.subject_down

func tick_timers(delta: float) -> void:
	if message_timer > 0.0:
		message_timer -= delta
	if attack_timer > 0.0:
		attack_timer -= delta
	if attack_cooldown > 0.0:
		attack_cooldown -= delta
	if counter_timer > 0.0:
		counter_timer -= delta
	if dash_timer > 0.0:
		dash_timer -= delta
	if dash_cooldown > 0.0:
		dash_cooldown -= delta
	if hurt_cooldown > 0.0:
		hurt_cooldown -= delta
	if combo_timer > 0.0:
		combo_timer -= delta
	elif combat_combo > 0:
		combat_combo = 0
		attack_chain = 0
	stamina = minf(100.0, stamina + delta * 28.0)

func handle_player(delta: float) -> void:
	var input_dir := Vector2.ZERO
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		input_dir.x -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		input_dir.x += 1.0
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		input_dir.y -= 1.0
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		input_dir.y += 1.0
	if touch_overlay != null and touch_overlay.move_vector.length() > 0.05:
		input_dir = touch_overlay.move_vector
	var shield_input := Input.is_key_pressed(KEY_K)
	if touch_overlay != null:
		shield_input = shield_input or touch_overlay.shield_down
	shield_active = shield_input and stamina > 3.0 and dash_timer <= 0.0
	if shield_active:
		stamina = maxf(0.0, stamina - delta * 10.0)
	if input_dir.length() > 0.01:
		input_dir = input_dir.normalized()
		facing = input_dir
		walk_phase += delta * (14.0 if dash_timer > 0.0 else 8.5)
	else:
		walk_phase = 0.0
	var speed: float = 156.0
	if shield_active:
		speed = 82.0
	if dash_timer > 0.0:
		speed = 330.0
		input_dir = facing
	move_player(input_dir * speed * delta)

func move_player(move_delta: Vector2) -> void:
	if move_delta.length_squared() <= 0.001:
		return
	var next_x := Vector2(player_pos.x + move_delta.x, player_pos.y)
	if not collides_world(next_x, 14.0):
		player_pos.x = next_x.x
	var next_y := Vector2(player_pos.x, player_pos.y + move_delta.y)
	if not collides_world(next_y, 14.0):
		player_pos.y = next_y.y

func start_attack() -> void:
	if attack_cooldown > 0.0 or shield_active:
		return
	attack_chain = min(3, attack_chain + 1) if combo_timer > 0.0 else 1
	attack_timer = 0.15 + float(attack_chain) * 0.025
	attack_cooldown = 0.30 - float(attack_chain) * 0.025
	var damage := 1
	var source := "Schwert"
	if counter_timer > 0.0:
		damage += 2
		source = "Counter"
		counter_timer = 0.0
	elif dash_timer > 0.0:
		damage += 1
		source = "Dash-Slash"
	if attack_chain >= 3:
		damage += 1
	hit_attack(damage, source)

func attack_rect() -> Rect2:
	var reach := 34.0 + float(attack_chain) * 4.0
	var center: Vector2 = player_pos + facing.normalized() * reach
	if absf(facing.x) > absf(facing.y):
		return Rect2(center - Vector2(34.0 + float(attack_chain) * 6.0, 24.0), Vector2(68.0 + float(attack_chain) * 12.0, 48.0))
	return Rect2(center - Vector2(24.0, 34.0 + float(attack_chain) * 6.0), Vector2(48.0, 68.0 + float(attack_chain) * 12.0))

func hit_attack(damage := 1, source := "Schwert") -> void:
	var hit_rect: Rect2 = attack_rect()
	var did_hit := false
	for i in range(enemies.size() - 1, -1, -1):
		var enemy: Dictionary = enemies[i]
		var pos: Vector2 = enemy["pos"]
		if hit_rect.has_point(pos):
			did_hit = true
			enemy["hp"] = int(enemy["hp"]) - damage
			enemy["hit"] = 0.18
			add_combo(1, source, 30 * damage)
			var push: Vector2 = (pos - player_pos).normalized() * 18.0
			enemy["pos"] = pos + push
			if str(enemy["kind"]) == "guardian" and int(enemy["hp"]) > 0:
				enemy["slam"] = maxf(float(enemy.get("slam", 0.0)), 0.24)
				enemy["slam_done"] = true
			if int(enemy["hp"]) <= 0:
				defeat_enemy(enemy)
				enemies.remove_at(i)
			else:
				enemies[i] = enemy
	hit_objects(hit_rect, 1)
	hit_chests(hit_rect)
	if mode_learn:
		check_shrine_hit(hit_rect)
	if not did_hit:
		attack_chain = maxi(1, attack_chain - 1)

func start_dash() -> void:
	if dash_cooldown > 0.0 or stamina < 28.0 or shield_active:
		return
	stamina -= 28.0
	dash_timer = 0.18
	dash_cooldown = 0.62
	hurt_cooldown = maxf(hurt_cooldown, 0.2)
	message = "Dash bereit fuer Dash-Slash."
	message_timer = 0.7

func place_bomb() -> void:
	if bombs_left <= 0:
		return
	bombs_left -= 1
	var cell: Vector2i = world_to_cell(player_pos)
	bombs.append({"cell": cell, "timer": 1.35})
	add_combo(1, "Bombe", 20)
	message = "Bombe gelegt."
	message_timer = 1.0

func hit_chests(hit_rect: Rect2) -> void:
	for i in range(chests.size()):
		var chest: Dictionary = chests[i]
		if bool(chest["opened"]):
			continue
		var rect: Rect2 = cell_world_rect(chest["cell"]).grow(-8.0)
		if not hit_rect.intersects(rect):
			continue
		chest["opened"] = true
		chests[i] = chest
		opened_chests += 1
		add_combo(1, "Truhe", 140)
		var reward: String = str(chest["reward"])
		if reward == "key":
			keys += 1
			message = "Kleiner Schluessel gefunden. Ein verriegeltes Tor kann jetzt aufgehen."
		elif reward == "heart":
			player_hp = mini(player_max_hp, player_hp + 2)
			message = "Herz gefunden. HP aufgefuellt."
		elif reward == "bomb":
			bombs_left += 2
			message = "Bombentasche gefunden. Zwei Bomben mehr."
		else:
			shards = mini(3, shards + 1)
			message = "Sternsplitter gefunden (%d/3)." % shards
		message_timer = 2.1

func update_locked_doors() -> void:
	for i in range(locked_doors.size()):
		var door: Dictionary = locked_doors[i]
		if bool(door["opened"]):
			continue
		var cell: Vector2i = door["cell"]
		if player_pos.distance_to(cell_center(cell)) > 42.0:
			continue
		if keys <= 0:
			message = "Verriegelt. Suche eine Truhe mit kleinem Schluessel."
			message_timer = 1.1
			continue
		keys -= 1
		opened_doors += 1
		door["opened"] = true
		locked_doors[i] = door
		add_combo(2, "Tor", 220)
		if str(door["id"]) == "boss":
			message = "Boss-Tor offen. Schild halten, dann zuschlagen."
		else:
			message = "Tor geoeffnet. Der Weg fuehrt tiefer in den Lernwald."
		message_timer = 2.2

func is_boss_door_open() -> bool:
	for door in locked_doors:
		var item: Dictionary = door
		if str(item["id"]) == "boss":
			return bool(item["opened"])
	return false

func update_bombs(delta: float) -> void:
	for i in range(bombs.size() - 1, -1, -1):
		var bomb: Dictionary = bombs[i]
		bomb["timer"] = float(bomb["timer"]) - delta
		if float(bomb["timer"]) <= 0.0:
			explode_bomb(bomb)
			bombs.remove_at(i)
			bombs_left += 1
		else:
			bombs[i] = bomb
	for i in range(explosions.size() - 1, -1, -1):
		var explosion: Dictionary = explosions[i]
		explosion["timer"] = float(explosion["timer"]) - delta
		if float(explosion["timer"]) <= 0.0:
			explosions.remove_at(i)
		else:
			explosions[i] = explosion

func update_guardian_waves(delta: float) -> void:
	for i in range(guardian_waves.size() - 1, -1, -1):
		var wave: Dictionary = guardian_waves[i]
		wave["delay"] = float(wave["delay"]) - delta
		wave["timer"] = float(wave["timer"]) - delta
		if float(wave["delay"]) <= 0.0 and not bool(wave["hit"]):
			wave["hit"] = true
			var origin: Vector2 = wave["pos"]
			var radius: float = float(wave["radius"])
			if player_pos.distance_to(origin) <= radius and hurt_cooldown <= 0.0:
				var block_vector: Vector2 = origin - player_pos
				var block_ok: bool = shield_active and block_vector.length() > 0.1 and facing.dot(block_vector.normalized()) > 0.15
				if block_ok:
					stamina = maxf(0.0, stamina - 22.0)
					counter_timer = 1.0
					add_combo(2, "Block", 80)
					message = "Guardian-Schock geblockt: Counter offen."
					message_timer = 1.0
				else:
					hurt_player(2, "Guardian-Schock.")
		if float(wave["timer"]) <= 0.0:
			guardian_waves.remove_at(i)
		else:
			guardian_waves[i] = wave

func explode_bomb(bomb: Dictionary) -> void:
	var origin: Vector2i = bomb["cell"]
	var rects: Array = []
	rects.append(cell_world_rect(origin).grow(-4.0))
	var dirs: Array = [Vector2i.LEFT, Vector2i.RIGHT, Vector2i.UP, Vector2i.DOWN]
	for dir in dirs:
		for step in range(1, 3):
			var cell: Vector2i = origin + dir * step
			if is_solid_tile(cell):
				if get_tile(cell) == WALL and cell.x > 2 and cell.y > 2 and cell.x < MAP_W - 3:
					set_tile(cell, FLOOR)
				break
			rects.append(cell_world_rect(cell).grow(-4.0))
	for rect in rects:
		hit_objects(rect, 2)
		hit_chests(rect)
		for i in range(enemies.size() - 1, -1, -1):
			var enemy: Dictionary = enemies[i]
			if rect.has_point(enemy["pos"]):
				enemy["hp"] = int(enemy["hp"]) - 2
				enemy["hit"] = 0.22
				add_combo(2, "Bomb-Hit", 95)
				if int(enemy["hp"]) <= 0:
					defeat_enemy(enemy)
					enemies.remove_at(i)
				else:
					enemies[i] = enemy
		if hurt_cooldown <= 0.0 and rect.has_point(player_pos):
			hurt_player(2, "Eigene Bombe erwischt.")
	explosions.append({"rects": rects, "timer": 0.28})

func update_enemies(delta: float) -> void:
	for i in range(enemies.size()):
		var enemy: Dictionary = enemies[i]
		var pos: Vector2 = enemy["pos"]
		var kind: String = str(enemy["kind"])
		var timer: float = float(enemy["timer"]) + delta
		enemy["timer"] = timer
		if kind == "guardian" and not is_boss_door_open():
			enemies[i] = enemy
			continue
		var to_player: Vector2 = player_pos - pos
		var distance: float = to_player.length()
		var speed: float = 54.0
		if kind == "soldier":
			speed = 68.0
		elif kind == "guardian":
			var hp_ratio: float = float(enemy["hp"]) / maxf(1.0, float(enemy.get("max_hp", 14)))
			var phase := 1
			if hp_ratio <= 0.34:
				phase = 3
			elif hp_ratio <= 0.67:
				phase = 2
			enemy["phase"] = phase
			speed = 42.0 + float(phase) * 10.0
			var slam: float = maxf(0.0, float(enemy.get("slam", 0.0)) - delta)
			var rush: float = maxf(0.0, float(enemy.get("rush", 0.0)) - delta)
			var slam_done: bool = bool(enemy.get("slam_done", true))
			if slam > 0.0:
				if slam <= 0.06 and not slam_done:
					slam_done = true
					trigger_guardian_wave(pos, 76.0 + float(phase) * 18.0)
				enemy["slam"] = slam
				enemy["rush"] = rush
				enemy["slam_done"] = slam_done
				if float(enemy["hit"]) > 0.0:
					enemy["hit"] = float(enemy["hit"]) - delta
				enemies[i] = enemy
				continue
			if phase >= 2 and distance > 88.0 and distance < 310.0 and timer > 2.2:
				rush = 0.34
				enemy["rush_dir"] = to_player.normalized()
				enemy["timer"] = 0.0
				message = "Guardian-Rush! Schild oder Dash."
				message_timer = 0.9
			elif distance < 104.0 and timer > (1.45 if phase == 1 else 1.05):
				slam = GUARDIAN_WAVE_DELAY
				slam_done = false
				enemy["timer"] = 0.0
				message = "Guardian hebt die Klinge."
				message_timer = 0.75
			enemy["slam"] = slam
			enemy["rush"] = rush
			enemy["slam_done"] = slam_done
		var dir := Vector2.ZERO
		if kind == "guardian" and float(enemy.get("rush", 0.0)) > 0.0:
			var rush_dir: Vector2 = enemy.get("rush_dir", Vector2.ZERO)
			dir = rush_dir.normalized() if rush_dir.length() > 0.1 else to_player.normalized()
			speed = 265.0
		elif distance < 270.0 and distance > 4.0:
			dir = to_player.normalized()
		else:
			dir = Vector2(sin(timer * 1.7 + float(i)), cos(timer * 1.3 + float(i) * 0.4)).normalized()
		var next_pos: Vector2 = pos + dir * speed * delta
		if not collides_world(next_pos, 12.0):
			enemy["pos"] = next_pos
		if float(enemy["hit"]) > 0.0:
			enemy["hit"] = float(enemy["hit"]) - delta
		if distance < 22.0 and hurt_cooldown <= 0.0:
			var block_vector: Vector2 = pos - player_pos
			var block_ok: bool = shield_active and block_vector.length() > 0.1 and facing.dot(block_vector.normalized()) > 0.25
			if block_ok:
				stamina = maxf(0.0, stamina - 18.0)
				counter_timer = 0.82
				add_combo(1, "Block", 55)
				message = "Geblockt - Counterfenster!"
				message_timer = 0.8
			else:
				hurt_player(1 if kind != "guardian" else 2, "Treffer.")
		enemies[i] = enemy

func defeat_enemy(enemy: Dictionary) -> void:
	var pos: Vector2 = enemy["pos"]
	add_combo(2 if str(enemy["kind"]) != "guardian" else 6, "Sieg", 120 if str(enemy["kind"]) != "guardian" else 900)
	if str(enemy["kind"]) == "guardian":
		shards = maxi(shards, 3)
		message = "Torwaechter besiegt. Das Sternentor reagiert."
		message_timer = 3.0
	else:
		if (int(pos.x) + int(pos.y)) % 2 == 0:
			pickups.append({"pos": pos, "type": "heart"})
		if shards < 3 and (score / 25) % 4 == 0:
			pickups.append({"pos": pos + Vector2(0.0, -8.0), "type": "shard"})

func hit_objects(hit_rect: Rect2, damage: int) -> void:
	for i in range(objects.size() - 1, -1, -1):
		var obj: Dictionary = objects[i]
		var rect: Rect2 = cell_world_rect(obj["cell"]).grow(-10.0)
		if not hit_rect.intersects(rect):
			continue
		obj["hp"] = int(obj["hp"]) - damage
		if int(obj["hp"]) <= 0:
			var center: Vector2 = rect.get_center()
			add_combo(1, "Objekt", 20)
			if str(obj["type"]) == "crystal":
				pickups.append({"pos": center, "type": "shard"})
			elif (int(center.x) + int(center.y)) % 3 == 0:
				pickups.append({"pos": center, "type": "heart"})
			else:
				pickups.append({"pos": center, "type": "coin"})
			objects.remove_at(i)
		else:
			objects[i] = obj

func check_shrine_hit(hit_rect: Rect2) -> void:
	var q: Dictionary = current_question()
	for i in range(shrines.size()):
		var shrine: Dictionary = shrines[i]
		if not bool(shrine["armed"]):
			continue
		var rect: Rect2 = cell_world_rect(shrine["cell"]).grow(-4.0)
		if not hit_rect.intersects(rect):
			continue
		shrine["armed"] = false
		shrines[i] = shrine
		if int(shrine["index"]) == int(q["correct"]):
			shards = mini(3, shards + 1)
			learn_hits += 1
			var repeated := bool(q.get("repeat", false))
			add_combo(2, "Lernschrein", 440 if repeated else 350)
			_remove_repeat(q)
			if repeated:
				message = "Wiederholung geloest: %s (%d/%d)." % [str(shrine["label"]), learn_hits, LEARN_GOAL]
			else:
				message = "Richtig: %s (%d/%d)." % [str(shrine["label"]), learn_hits, LEARN_GOAL]
			question_index += 1
			setup_shrines()
		else:
			mistakes += 1
			_queue_repeat(q)
			hurt_player(1, "Falscher Schrein. Tipp: %s" % str(q["hint"]))
			setup_shrines()
		message_timer = 2.4

func collect_pickups() -> void:
	for i in range(pickups.size() - 1, -1, -1):
		var pickup: Dictionary = pickups[i]
		var pos: Vector2 = pickup["pos"]
		if player_pos.distance_to(pos) > 24.0:
			continue
		var kind: String = str(pickup["type"])
		if kind == "heart":
			player_hp = mini(player_max_hp, player_hp + 1)
		elif kind == "shard":
			shards = mini(3, shards + 1)
			add_combo(2, "Splitter", 180)
		else:
			add_combo(1, "Fund", 40)
		pickups.remove_at(i)

func update_exit_state() -> void:
	var guardian_alive := false
	for enemy in enemies:
		var item: Dictionary = enemy
		if str(item["kind"]) == "guardian":
			guardian_alive = true
	exit_open = (mode_learn and learn_hits >= LEARN_GOAL) or (shards >= 3 and not guardian_alive)
	if exit_open and player_pos.distance_to(cell_center(exit_cell)) < 34.0:
		won = true
		score += 1200 + best_combo * 45
		message = "Sternentor offen. Abenteuer geschafft! Best-Combo %d. R startet neu." % best_combo
		message_timer = 99.0

func hurt_player(amount: int, text: String) -> void:
	if hurt_cooldown > 0.0:
		return
	player_hp -= amount
	combat_combo = 0
	combo_timer = 0.0
	attack_chain = 0
	hurt_cooldown = 0.95
	message = text
	message_timer = 1.6
	if player_hp <= 0:
		game_over = true
		message = "Game Over. R startet neu."
		message_timer = 99.0

func update_camera() -> void:
	var world_size: Vector2 = Vector2(float(MAP_W) * TILE_SIZE, float(MAP_H) * TILE_SIZE)
	var visible_size: Vector2 = size / world_scale()
	var target: Vector2 = player_pos - visible_size * 0.5
	camera_pos.x = clampf(target.x, 0.0, maxf(0.0, world_size.x - visible_size.x))
	camera_pos.y = clampf(target.y, 0.0, maxf(0.0, world_size.y - visible_size.y))

func add_combo(amount: int, label: String, base_points: int) -> void:
	combat_combo += amount
	best_combo = maxi(best_combo, combat_combo)
	combo_timer = COMBO_WINDOW
	var gained: int = int(round(float(base_points) * combo_multiplier()))
	score += gained
	if amount >= 2 or combat_combo % 5 == 0:
		message = "%s-Combo %d! +%d" % [label, combat_combo, gained]
		message_timer = 0.85

func combo_multiplier() -> float:
	if combat_combo < 3:
		return 1.0
	return minf(3.0, 1.0 + float(combat_combo) * 0.08)

func trigger_guardian_wave(origin: Vector2, radius: float) -> void:
	guardian_waves.append({"pos": origin, "radius": radius, "delay": 0.08, "timer": 0.58, "hit": false})

func objective_text() -> String:
	if mode_learn and learn_hits < LEARN_GOAL:
		return "Quest: Lernschreine treffen, Fehler kommen wieder. Danach oeffnet das Sternentor."
	if shards < 3:
		return "Quest: Splitter aus Truhen, Gegnern und Kristallen holen."
	if not is_boss_door_open():
		return "Quest: Schluessel finden und Boss-Tor oeffnen."
	for enemy in enemies:
		var item: Dictionary = enemy
		if str(item["kind"]) == "guardian":
			return "Quest: Guardian lesen, Schockwellen blocken, Counter setzen."
	return "Quest: Sternentor erreichen."

func collides_world(pos: Vector2, radius: float) -> bool:
	var samples: Array = [
		pos + Vector2(-radius, -radius),
		pos + Vector2(radius, -radius),
		pos + Vector2(-radius, radius),
		pos + Vector2(radius, radius),
	]
	for sample in samples:
		if is_solid_tile(world_to_cell(sample)):
			return true
	for obj in objects:
		var item: Dictionary = obj
		var rect: Rect2 = cell_world_rect(item["cell"]).grow(-10.0)
		if rect.has_point(pos):
			return true
	for chest in chests:
		var chest_item: Dictionary = chest
		if bool(chest_item["opened"]):
			continue
		var chest_rect: Rect2 = cell_world_rect(chest_item["cell"]).grow(-10.0)
		if chest_rect.has_point(pos):
			return true
	for door in locked_doors:
		var door_item: Dictionary = door
		if bool(door_item["opened"]):
			continue
		var door_rect: Rect2 = cell_world_rect(door_item["cell"]).grow(-4.0)
		if door_rect.has_point(pos):
			return true
	return false

func is_solid_tile(cell: Vector2i) -> bool:
	if cell.x < 0 or cell.y < 0 or cell.x >= MAP_W or cell.y >= MAP_H:
		return true
	var tile: int = get_tile(cell)
	return tile == WALL or tile == WATER

func get_tile(cell: Vector2i) -> int:
	return int(tiles[cell.y][cell.x])

func set_tile(cell: Vector2i, value: int) -> void:
	tiles[cell.y][cell.x] = value

func world_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / TILE_SIZE)), int(floor(pos.y / TILE_SIZE)))

func cell_center(cell: Vector2i) -> Vector2:
	return Vector2((float(cell.x) + 0.5) * TILE_SIZE, (float(cell.y) + 0.5) * TILE_SIZE)

func cell_world_rect(cell: Vector2i) -> Rect2:
	return Rect2(Vector2(float(cell.x) * TILE_SIZE, float(cell.y) * TILE_SIZE), Vector2(TILE_SIZE, TILE_SIZE))

func world_rect_to_screen(rect: Rect2) -> Rect2:
	var scale := world_scale()
	return Rect2((rect.position - camera_pos) * scale + world_offset(), rect.size * scale)

func world_pos_to_screen(pos: Vector2) -> Vector2:
	return (pos - camera_pos) * world_scale() + world_offset()

func world_scale() -> float:
	if size.y > size.x * 1.25:
		return 1.18
	if size.x < 960.0:
		return 1.08
	return 1.0

func world_offset() -> Vector2:
	var world_size: Vector2 = Vector2(float(MAP_W) * TILE_SIZE, float(MAP_H) * TILE_SIZE)
	var scaled_world_size := world_size * world_scale()
	var offset := Vector2(maxf(0.0, (size.x - scaled_world_size.x) * 0.5), maxf(0.0, (size.y - scaled_world_size.y) * 0.5))
	if size.y > size.x * 1.25:
		offset.y = minf(128.0, maxf(0.0, (size.y - scaled_world_size.y) * 0.22))
	return offset

func _draw() -> void:
	draw_background()
	draw_map()
	draw_exit()
	draw_objects()
	draw_chests()
	draw_locked_doors()
	draw_shrines()
	draw_bombs()
	draw_explosions()
	draw_guardian_waves()
	draw_pickups()
	draw_enemies()
	draw_player()
	draw_minimap()
	draw_hud()

func draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color.html("#071f17"), true)
	for y in range(0, int(size.y), 8):
		var shade := 0.02 if (y / 8) % 2 == 0 else 0.0
		draw_rect(Rect2(0.0, float(y), size.x, 8.0), Color(1.0, 1.0, 1.0, shade), true)

func draw_map() -> void:
	var visible_size := size / world_scale()
	var start_x: int = maxi(0, int(floor(camera_pos.x / TILE_SIZE)) - 1)
	var start_y: int = maxi(0, int(floor(camera_pos.y / TILE_SIZE)) - 1)
	var end_x: int = mini(MAP_W - 1, int(ceil((camera_pos.x + visible_size.x) / TILE_SIZE)) + 1)
	var end_y: int = mini(MAP_H - 1, int(ceil((camera_pos.y + visible_size.y) / TILE_SIZE)) + 1)
	for y in range(start_y, end_y + 1):
		for x in range(start_x, end_x + 1):
			var cell := Vector2i(x, y)
			var rect: Rect2 = world_rect_to_screen(cell_world_rect(cell))
			var tile: int = get_tile(cell)
			if tile == WALL:
				draw_rect(rect, Color.html("#213b2a"), true)
				draw_rect(Rect2(rect.position + Vector2(0.0, 0.0), Vector2(rect.size.x, 8.0)), Color.html("#4d7c3f"), true)
				draw_rect(Rect2(rect.position + Vector2(6.0, 10.0), Vector2(11.0, 10.0)), Color.html("#365f32"), true)
				draw_rect(Rect2(rect.position + Vector2(22.0, 22.0), Vector2(10.0, 9.0)), Color.html("#17251d"), true)
			elif tile == WATER:
				draw_rect(rect, Color.html("#0f5f78"), true)
				draw_rect(Rect2(rect.position + Vector2(3.0, 9.0), Vector2(rect.size.x - 6.0, 4.0)), Color.html("#38bdf8"), true)
				draw_rect(Rect2(rect.position + Vector2(8.0, 25.0), Vector2(rect.size.x - 16.0, 3.0)), Color.html("#67e8f9"), true)
			elif tile == BRIDGE:
				draw_rect(rect, Color.html("#7c4a16"), true)
				draw_rect(Rect2(rect.position + Vector2(0.0, 8.0), Vector2(rect.size.x, 4.0)), Color.html("#b7791f"), true)
				draw_rect(Rect2(rect.position + Vector2(0.0, 26.0), Vector2(rect.size.x, 4.0)), Color.html("#b7791f"), true)
			elif tile == PATH:
				draw_rect(rect, Color.html("#8a5a2b"), true)
				draw_rect(Rect2(rect.position + Vector2(0.0, 0.0), Vector2(rect.size.x, 4.0)), Color.html("#c0843d"), true)
				draw_rect(Rect2(rect.position + Vector2(7.0, 24.0), Vector2(9.0, 4.0)), Color.html("#5f3b1b"), true)
				draw_rect(Rect2(rect.position + Vector2(25.0, 12.0), Vector2(7.0, 4.0)), Color.html("#5f3b1b"), true)
			elif tile == RUIN:
				draw_rect(rect, Color.html("#475569"), true)
				draw_rect(Rect2(rect.position + Vector2(2.0, 2.0), Vector2(rect.size.x - 4.0, 4.0)), Color.html("#94a3b8"), true)
				draw_rect(Rect2(rect.position + Vector2(6.0, 21.0), Vector2(13.0, 8.0)), Color.html("#334155"), true)
				draw_rect(Rect2(rect.position + Vector2(24.0, 11.0), Vector2(9.0, 9.0)), Color.html("#1e293b"), true)
			else:
				var grass: Color = Color.html("#1f7a3a") if (x + y) % 2 == 0 else Color.html("#1a6d34")
				draw_rect(rect, grass, true)
				draw_rect(Rect2(rect.position, Vector2(rect.size.x, 2.0)), Color(1.0, 1.0, 1.0, 0.05), true)
				if (x * 5 + y * 3) % 11 == 0:
					draw_rect(Rect2(rect.position + Vector2(8.0, 25.0), Vector2(8.0, 4.0)), Color.html("#14532d"), true)
				if tile == FLOWER:
					draw_rect(Rect2(rect.position + Vector2(14.0, 15.0), Vector2(5.0, 5.0)), Color.html("#f472b6"), true)
					draw_rect(Rect2(rect.position + Vector2(23.0, 19.0), Vector2(5.0, 5.0)), Color.html("#facc15"), true)

func draw_exit() -> void:
	var rect: Rect2 = world_rect_to_screen(cell_world_rect(exit_cell).grow(9.0))
	draw_rect(rect, Color.html("#fde047") if exit_open else Color.html("#334155"), true)
	draw_rect(rect.grow(-6.0), Color.html("#0f172a"), true)
	draw_string(get_theme_default_font(), rect.position + Vector2(2.0, 24.0), "OFFEN" if exit_open else "ZU", HORIZONTAL_ALIGNMENT_CENTER, rect.size.x - 4.0, 12, Color.html("#f8fafc"))

func draw_objects() -> void:
	for obj in objects:
		var item: Dictionary = obj
		var rect: Rect2 = world_rect_to_screen(cell_world_rect(item["cell"]).grow(-10.0))
		if str(item["type"]) == "crystal":
			draw_rect(rect, Color.html("#38bdf8"), true)
			draw_rect(rect.grow(-9.0), Color.html("#e0f2fe"), true)
		elif str(item["type"]) == "bush":
			draw_rect(rect, Color.html("#14532d"), true)
			draw_rect(Rect2(rect.position + Vector2(4.0, 3.0), Vector2(rect.size.x - 8.0, 12.0)), Color.html("#22c55e"), true)
			draw_rect(Rect2(rect.position + Vector2(9.0, 15.0), Vector2(rect.size.x - 18.0, 8.0)), Color.html("#16a34a"), true)
		else:
			draw_rect(rect, Color.html("#7c2d12"), true)
			draw_rect(Rect2(rect.position + Vector2(6.0, 5.0), Vector2(18.0, 7.0)), Color.html("#facc15"), true)
			draw_rect(Rect2(rect.position + Vector2(10.0, 18.0), Vector2(12.0, 5.0)), Color.html("#431407"), true)

func draw_chests() -> void:
	var font := get_theme_default_font()
	for chest in chests:
		var item: Dictionary = chest
		var rect: Rect2 = world_rect_to_screen(cell_world_rect(item["cell"]).grow(-9.0))
		var opened := bool(item["opened"])
		draw_rect(rect, Color.html("#4a2d12") if opened else Color.html("#8b4513"), true)
		draw_rect(Rect2(rect.position + Vector2(2.0, 4.0), Vector2(rect.size.x - 4.0, 7.0)), Color.html("#facc15") if not opened else Color.html("#64748b"), true)
		draw_rect(Rect2(rect.position + Vector2(rect.size.x * 0.5 - 4.0, 13.0), Vector2(8.0, 8.0)), Color.html("#fde68a") if not opened else Color.html("#1f2937"), true)
		if not opened:
			draw_string(font, rect.position + Vector2(0.0, 30.0), str(item["label"]), HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, 10, Color.html("#f8fafc"))

func draw_locked_doors() -> void:
	var font := get_theme_default_font()
	for door in locked_doors:
		var item: Dictionary = door
		var rect: Rect2 = world_rect_to_screen(cell_world_rect(item["cell"]).grow(-3.0))
		if bool(item["opened"]):
			draw_rect(rect, Color(0.96, 0.78, 0.25, 0.22), true)
			draw_rect(Rect2(rect.position + Vector2(4.0, rect.size.y * 0.5 - 3.0), Vector2(rect.size.x - 8.0, 6.0)), Color.html("#facc15"), true)
			continue
		draw_rect(rect, Color.html("#1e1b4b"), true)
		draw_rect(rect.grow(-5.0), Color.html("#312e81"), true)
		draw_rect(Rect2(rect.position + Vector2(rect.size.x * 0.5 - 6.0, 9.0), Vector2(12.0, 15.0)), Color.html("#facc15"), true)
		draw_string(font, rect.position + Vector2(0.0, rect.size.y - 7.0), str(item["label"]), HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, 10, Color.html("#f8fafc"))

func draw_shrines() -> void:
	if not mode_learn:
		return
	var font := get_theme_default_font()
	for shrine in shrines:
		var item: Dictionary = shrine
		var rect: Rect2 = world_rect_to_screen(cell_world_rect(item["cell"]).grow(-6.0))
		var is_repeat := bool(item.get("repeat", false))
		var color: Color = (Color.html("#f0abfc") if is_repeat else Color.html("#38bdf8")) if bool(item["armed"]) else Color.html("#475569")
		draw_rect(rect, Color(color.r, color.g, color.b, 0.35), true)
		draw_arc(rect.get_center(), 22.0, 0.0, TAU, 5, color, 4.0)
		draw_string(font, rect.position + Vector2(2.0, 29.0), str(item["label"]), HORIZONTAL_ALIGNMENT_CENTER, rect.size.x - 4.0, 11, Color.html("#f8fafc"))

func draw_bombs() -> void:
	for bomb in bombs:
		var item: Dictionary = bomb
		var center: Vector2 = world_pos_to_screen(cell_center(item["cell"]))
		draw_circle(center, 13.0, Color.html("#020617"))
		draw_rect(Rect2(center + Vector2(9.0, -16.0), Vector2(6.0, 6.0)), Color.html("#fb923c"), true)

func draw_explosions() -> void:
	for explosion in explosions:
		var item: Dictionary = explosion
		var rects: Array = item["rects"]
		for rect in rects:
			draw_rect(world_rect_to_screen(rect), Color(1.0, 0.8, 0.18, 0.76), true)
			draw_rect(world_rect_to_screen(rect.grow(-12.0)), Color(1.0, 0.18, 0.08, 0.76), true)

func draw_guardian_waves() -> void:
	for wave in guardian_waves:
		var item: Dictionary = wave
		var pos: Vector2 = world_pos_to_screen(item["pos"])
		var timer: float = maxf(0.0, float(item["timer"]))
		var delay: float = maxf(0.0, float(item["delay"]))
		var reveal: float = clampf(1.0 - timer / 0.58, 0.0, 1.0)
		if delay > 0.0:
			reveal = clampf(1.0 - delay / 0.08, 0.0, 1.0) * 0.35
		var radius: float = float(item["radius"]) * world_scale() * maxf(0.22, reveal)
		draw_arc(pos, radius, 0.0, TAU, 48, Color.html("#fde047"), 4.0)
		draw_arc(pos, radius + 7.0, 0.0, TAU, 48, Color(1.0, 0.28, 0.12, 0.58), 2.0)

func draw_pickups() -> void:
	for pickup in pickups:
		var item: Dictionary = pickup
		var pos: Vector2 = world_pos_to_screen(item["pos"])
		var color: Color = Color.html("#ef4444")
		if str(item["type"]) == "shard":
			color = Color.html("#facc15")
		elif str(item["type"]) == "coin":
			color = Color.html("#f59e0b")
		draw_rect(Rect2(pos - Vector2(7.0, 7.0), Vector2(14.0, 14.0)), color, true)

func draw_enemies() -> void:
	var font := get_theme_default_font()
	for enemy in enemies:
		var item: Dictionary = enemy
		var pos: Vector2 = world_pos_to_screen(item["pos"])
		var kind: String = str(item["kind"])
		var color: Color = Color.html("#ef4444")
		var size_px: float = 24.0
		if kind == "soldier":
			color = Color.html("#a855f7")
		elif kind == "guardian":
			var phase: int = int(item.get("phase", 1))
			if not is_boss_door_open():
				color = Color.html("#334155")
			elif phase == 1:
				color = Color.html("#7f1d1d")
			elif phase == 2:
				color = Color.html("#c2410c")
			else:
				color = Color.html("#dc2626")
			size_px = 40.0
		if float(item["hit"]) > 0.0:
			color = Color.html("#f8fafc")
		draw_rect(Rect2(pos - Vector2(size_px * 0.5, size_px * 0.5), Vector2(size_px, size_px)), Color(0.0, 0.0, 0.0, 0.28), true)
		draw_rect(Rect2(pos - Vector2(size_px * 0.45, size_px * 0.55), Vector2(size_px * 0.9, size_px * 0.95)), color, true)
		draw_rect(Rect2(pos + Vector2(-7.0, -6.0), Vector2(5.0, 5.0)), Color.html("#f8fafc"), true)
		draw_rect(Rect2(pos + Vector2(4.0, -6.0), Vector2(5.0, 5.0)), Color.html("#f8fafc"), true)
		draw_rect(Rect2(pos + Vector2(-8.0, 8.0), Vector2(16.0, 4.0)), Color.html("#020617"), true)
		if kind == "guardian" and not is_boss_door_open():
			draw_string(font, pos + Vector2(-24.0, -28.0), "SIEGEL", HORIZONTAL_ALIGNMENT_CENTER, 48.0, 10, Color.html("#cbd5e1"))
		elif kind == "guardian":
			var hp_ratio: float = clampf(float(item["hp"]) / maxf(1.0, float(item.get("max_hp", 14))), 0.0, 1.0)
			draw_rect(Rect2(pos + Vector2(-32.0, -38.0), Vector2(64.0, 6.0)), Color.html("#020617"), true)
			draw_rect(Rect2(pos + Vector2(-32.0, -38.0), Vector2(64.0 * hp_ratio, 6.0)), Color.html("#fde047"), true)
			draw_string(font, pos + Vector2(-28.0, -44.0), "P%d" % int(item.get("phase", 1)), HORIZONTAL_ALIGNMENT_LEFT, 56.0, 10, Color.html("#fde68a"))
			if float(item.get("slam", 0.0)) > 0.0:
				var pulse: float = 1.0 - clampf(float(item.get("slam", 0.0)) / GUARDIAN_WAVE_DELAY, 0.0, 1.0)
				draw_arc(pos, 48.0 + pulse * 24.0, 0.0, TAU, 40, Color.html("#facc15"), 3.0)

func draw_player() -> void:
	var pos: Vector2 = world_pos_to_screen(player_pos)
	var blink := hurt_cooldown > 0.0 and int(hurt_cooldown * 12.0) % 2 != 0
	var tunic: Color = Color.html("#22c55e") if not blink else Color.html("#f8fafc")
	var skin := Color.html("#fde68a")
	var bob := 0.0
	var step := 0.0
	if walk_phase > 0.0:
		step = sin(walk_phase)
		bob = absf(step) * -1.4
	pos += Vector2(0.0, bob)
	draw_rect(Rect2(pos + Vector2(-15.0, 14.0), Vector2(30.0, 8.0)), Color(0.0, 0.0, 0.0, 0.24), true)
	draw_rect(Rect2(pos + Vector2(-8.0, 11.0 + maxf(0.0, step) * 2.0), Vector2(7.0, 9.0)), Color.html("#78350f"), true)
	draw_rect(Rect2(pos + Vector2(2.0, 11.0 + maxf(0.0, -step) * 2.0), Vector2(7.0, 9.0)), Color.html("#78350f"), true)
	draw_rect(Rect2(pos + Vector2(-12.0, -8.0), Vector2(24.0, 23.0)), tunic, true)
	draw_rect(Rect2(pos + Vector2(-9.0, -3.0), Vector2(18.0, 6.0)), Color.html("#16a34a"), true)
	draw_rect(Rect2(pos + Vector2(-10.0, -25.0), Vector2(20.0, 15.0)), skin, true)
	draw_rect(Rect2(pos + Vector2(-7.0, -33.0), Vector2(14.0, 9.0)), Color.html("#16a34a"), true)
	draw_rect(Rect2(pos + Vector2(-3.0, -39.0), Vector2(8.0, 8.0)), Color.html("#15803d"), true)
	var eye_offset := Vector2.ZERO
	if absf(facing.x) > absf(facing.y):
		eye_offset.x = 3.0 * signf(facing.x)
	elif facing.y > 0.0:
		eye_offset.y = 2.0
	else:
		eye_offset.y = -1.0
	draw_rect(Rect2(pos + Vector2(-6.0, -19.0) + eye_offset, Vector2(4.0, 4.0)), Color.html("#020617"), true)
	draw_rect(Rect2(pos + Vector2(3.0, -19.0) + eye_offset, Vector2(4.0, 4.0)), Color.html("#020617"), true)
	if shield_active:
		var shield_center: Vector2 = pos + facing * 22.0
		draw_rect(Rect2(shield_center - Vector2(11.0, 14.0), Vector2(22.0, 28.0)), Color.html("#60a5fa"), true)
		draw_rect(Rect2(shield_center - Vector2(6.0, 8.0), Vector2(12.0, 16.0)), Color.html("#dbeafe"), true)
	if attack_timer > 0.0:
		var slash: Rect2 = world_rect_to_screen(attack_rect())
		draw_rect(slash, Color(0.96, 0.95, 0.68, 0.52), true)
		var blade_origin := pos + facing * 12.0
		var blade_size := Vector2(8.0, 30.0)
		if absf(facing.x) > absf(facing.y):
			blade_size = Vector2(30.0, 8.0)
		draw_rect(Rect2(blade_origin - blade_size * 0.5, blade_size), Color.html("#f8fafc"), true)

func draw_minimap() -> void:
	if size.x < 960.0 or size.y > size.x * 1.25:
		return
	var map_size := Vector2(164.0, 118.0)
	var origin := Vector2(size.x - map_size.x - 18.0, 78.0)
	draw_rect(Rect2(origin, map_size), Color(0.02, 0.05, 0.09, 0.62), true)
	draw_rect(Rect2(origin, map_size), Color(0.78, 0.88, 1.0, 0.28), false, 2.0)
	var scale := Vector2(map_size.x / float(MAP_W), map_size.y / float(MAP_H))
	for y in range(MAP_H):
		for x in range(MAP_W):
			var tile := get_tile(Vector2i(x, y))
			if tile == WALL or tile == WATER:
				var color := Color.html("#334155") if tile == WALL else Color.html("#0ea5e9")
				draw_rect(Rect2(origin + Vector2(float(x) * scale.x, float(y) * scale.y), scale + Vector2(0.3, 0.3)), color, true)
	var p := origin + Vector2(player_pos.x / TILE_SIZE * scale.x, player_pos.y / TILE_SIZE * scale.y)
	draw_rect(Rect2(p - Vector2(2.5, 2.5), Vector2(5.0, 5.0)), Color.html("#fde047"), true)
	for chest in chests:
		var chest_item: Dictionary = chest
		if bool(chest_item["opened"]):
			continue
		var ccell: Vector2i = chest_item["cell"]
		var c := origin + Vector2(float(ccell.x) * scale.x, float(ccell.y) * scale.y)
		draw_rect(Rect2(c, Vector2(4.0, 4.0)), Color.html("#f59e0b"), true)
	for door in locked_doors:
		var door_item: Dictionary = door
		var dcell: Vector2i = door_item["cell"]
		var d := origin + Vector2(float(dcell.x) * scale.x, float(dcell.y) * scale.y)
		draw_rect(Rect2(d, Vector2(5.0, 5.0)), Color.html("#22c55e") if bool(door_item["opened"]) else Color.html("#a855f7"), true)
	var e := origin + Vector2(float(exit_cell.x) * scale.x, float(exit_cell.y) * scale.y)
	draw_rect(Rect2(e, Vector2(5.0, 5.0)), Color.html("#facc15") if exit_open else Color.html("#94a3b8"), true)

func draw_hud() -> void:
	var font := get_theme_default_font()
	draw_rect(Rect2(12.0, 10.0, minf(size.x - 24.0, 810.0), 130.0), Color(0.02, 0.05, 0.09, 0.74), true)
	draw_string(font, Vector2(24.0, 34.0), "FASKA ZELDA PRO - 16-BIT ABENTEUER", HORIZONTAL_ALIGNMENT_LEFT, -1, 21, Color.html("#facc15"))
	draw_string(font, Vector2(24.0, 59.0), "HP %d/%d  STA %d  Splitter %d/3  Schluessel %d  Bomben %d  Score %d" % [player_hp, player_max_hp, int(stamina), shards, keys, bombs_left, score], HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.html("#f8fafc"))
	draw_string(font, Vector2(24.0, 81.0), "Tore %d/%d  Truhen %d/%d  Mode %s  Fach %s  Lernziel %d/%d" % [opened_doors, locked_doors.size(), opened_chests, chests.size(), "Learncade" if mode_learn else "Normal", str(LESSONS[lesson_index]), learn_hits, LEARN_GOAL], HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color.html("#cbd5e1"))
	draw_string(font, Vector2(24.0, 103.0), "Combo %d  Best %d  Multi x%.1f  Counter %s  Kette %d" % [combat_combo, best_combo, combo_multiplier(), "offen" if counter_timer > 0.0 else "-", attack_chain], HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color.html("#fde68a"))
	draw_string(font, Vector2(24.0, 124.0), objective_text(), HORIZONTAL_ALIGNMENT_LEFT, minf(size.x - 48.0, 780.0), 12, Color.html("#f8fafc"))
	if mode_learn:
		var q: Dictionary = current_question()
		draw_rect(Rect2(12.0, 148.0, minf(size.x - 24.0, 810.0), 34.0), Color(0.02, 0.05, 0.09, 0.74), true)
		draw_string(font, Vector2(24.0, 171.0), str(q["prompt"]), HORIZONTAL_ALIGNMENT_LEFT, minf(size.x - 48.0, 786.0), 16, Color.html("#f8fafc"))
	if message_timer > 0.0:
		draw_rect(Rect2(12.0, size.y - 42.0, minf(size.x - 24.0, 720.0), 29.0), Color(0.02, 0.05, 0.09, 0.74), true)
		draw_string(font, Vector2(24.0, size.y - 20.0), message, HORIZONTAL_ALIGNMENT_LEFT, minf(size.x - 48.0, 696.0), 14, Color.html("#f8fafc"))

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
