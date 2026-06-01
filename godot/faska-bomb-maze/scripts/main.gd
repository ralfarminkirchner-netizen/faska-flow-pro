extends Control

const COLS := 17
const ROWS := 13
const FLOOR := 0
const WALL := 1
const CRATE := 2
const LEARN_GOAL := 4
const LESSONS := ["WORTART", "MATHE", "SATZ"]
const QUESTIONS_WORD := [
	{"prompt": "Welche Wortart ist 'schnell'?", "answers": ["Nomen", "Verb", "Adjektiv"], "correct": 2, "hint": "Schnell beschreibt, wie etwas passiert."},
	{"prompt": "Welche Wortart ist 'laufen'?", "answers": ["Verb", "Artikel", "Nomen"], "correct": 0, "hint": "Laufen ist eine Taetigkeit."},
	{"prompt": "Welche Wortart ist 'der'?", "answers": ["Adjektiv", "Artikel", "Verb"], "correct": 1, "hint": "Der begleitet ein Nomen."},
	{"prompt": "Welche Wortart ist 'Baumhaus'?", "answers": ["Nomen", "Verb", "Adjektiv"], "correct": 0, "hint": "Man kann das Baumhaus sehen und anfassen."},
	{"prompt": "Welche Wortart ist 'unter'?", "answers": ["Praeposition", "Verb", "Artikel"], "correct": 0, "hint": "Unter sagt, wo etwas liegt."},
]
const QUESTIONS_MATH := [
	{"prompt": "Sprenge das Ergebnis von 7 + 5.", "answers": ["10", "12", "14"], "correct": 1, "hint": "7 + 3 = 10, dann noch 2."},
	{"prompt": "Sprenge das Ergebnis von 18 - 9.", "answers": ["7", "9", "11"], "correct": 1, "hint": "18 halbieren ergibt 9."},
	{"prompt": "Sprenge das Ergebnis von 3 x 4.", "answers": ["7", "12", "14"], "correct": 1, "hint": "3 Vierergruppen sind 12."},
	{"prompt": "Welche Zahl fehlt? 4, 6, 8, __", "answers": ["9", "10", "12"], "correct": 1, "hint": "Die Reihe springt immer +2."},
]
const QUESTIONS_SENTENCE := [
	{"prompt": "Was passt? Der Hund ___ schnell.", "answers": ["rennt", "Hund", "schnell"], "correct": 0, "hint": "Gesucht ist die Taetigkeit."},
	{"prompt": "Was passt? Das ___ Auto faehrt.", "answers": ["gelbe", "rennt", "Auto"], "correct": 0, "hint": "Gesucht ist eine Eigenschaft."},
	{"prompt": "Was passt? Der Ball liegt ___ dem Tisch.", "answers": ["unter", "Ball", "springt"], "correct": 0, "hint": "Gesucht ist ein Lagewort."},
	{"prompt": "Was passt? Mia liest, ___ sie lernen will.", "answers": ["weil", "Mia", "schnell"], "correct": 0, "hint": "Gesucht ist ein Bindewort."},
]

class TouchMazeOverlay:
	extends Control

	var move_vector := Vector2.ZERO
	var buttons := {
		"bomb": false,
		"learn": false,
		"cycle": false,
	}
	var active_move := -1
	var active_buttons := {}
	var mouse_move_active := false
	var mouse_button_name := ""

	func _ready() -> void:
		set_anchors_preset(Control.PRESET_FULL_RECT)
		mouse_filter = Control.MOUSE_FILTER_STOP
		queue_redraw()

	func _gui_input(event: InputEvent) -> void:
		if event is InputEventScreenTouch:
			if event.pressed:
				var picked_button := _button_at(event.position)
				if picked_button != "":
					buttons[picked_button] = true
					active_buttons[event.index] = picked_button
					accept_event()
				elif _is_on_stick(event.position):
					active_move = event.index
					_update_stick(event.position)
					accept_event()
			else:
				if active_move == event.index:
					active_move = -1
					move_vector = Vector2.ZERO
				if active_buttons.has(event.index):
					buttons[active_buttons[event.index]] = false
					active_buttons.erase(event.index)
				queue_redraw()
		elif event is InputEventScreenDrag:
			if event.index == active_move:
				_update_stick(event.position)
				accept_event()
		elif event is InputEventMouseButton:
			if event.button_index != MOUSE_BUTTON_LEFT:
				return
			if event.pressed:
				var picked_mouse_button := _button_at(event.position)
				if picked_mouse_button != "":
					mouse_button_name = picked_mouse_button
					buttons[mouse_button_name] = true
					accept_event()
				elif _is_on_stick(event.position):
					mouse_move_active = true
					_update_stick(event.position)
					accept_event()
			else:
				mouse_move_active = false
				move_vector = Vector2.ZERO
				if mouse_button_name != "":
					buttons[mouse_button_name] = false
					mouse_button_name = ""
				queue_redraw()
		elif event is InputEventMouseMotion and mouse_move_active:
			_update_stick(event.position)
			accept_event()

	func is_down(name: String) -> bool:
		return buttons.has(name) and buttons[name]

	func release(name: String) -> void:
		if buttons.has(name):
			buttons[name] = false
			queue_redraw()

	func _stick_center() -> Vector2:
		var screen := get_viewport_rect().size
		return Vector2(106.0, screen.y - 112.0)

	func _button_centers() -> Dictionary:
		var screen := get_viewport_rect().size
		return {
			"bomb": Vector2(screen.x - 96.0, screen.y - 120.0),
			"learn": Vector2(screen.x - 190.0, screen.y - 64.0),
			"cycle": Vector2(screen.x - 96.0, screen.y - 42.0),
		}

	func _is_on_stick(pos: Vector2) -> bool:
		return pos.distance_to(_stick_center()) <= 88.0

	func _button_at(pos: Vector2) -> String:
		for name in _button_centers().keys():
			if pos.distance_to(_button_centers()[name]) <= 44.0:
				return name
		return ""

	func _update_stick(pos: Vector2) -> void:
		var raw := pos - _stick_center()
		move_vector = raw.limit_length(56.0) / 56.0
		queue_redraw()

	func _draw() -> void:
		var font := get_theme_default_font()
		var center := _stick_center()
		draw_circle(center, 64.0, Color(0.02, 0.08, 0.13, 0.48))
		draw_arc(center, 64.0, 0.0, TAU, 48, Color(0.65, 0.86, 1.0, 0.48), 3.0)
		draw_circle(center + move_vector * 42.0, 27.0, Color(0.25, 0.85, 1.0, 0.86))
		var labels := {
			"bomb": ["B", "BOMB"],
			"learn": ["L", "LEARN"],
			"cycle": ["C", "FACH"],
		}
		for name in _button_centers().keys():
			var button_center: Vector2 = _button_centers()[name]
			var fill := Color(0.04, 0.08, 0.17, 0.74)
			if is_down(name):
				fill = Color(0.18, 0.56, 0.95, 0.92)
			draw_circle(button_center, 40.0, fill)
			draw_arc(button_center, 40.0, 0.0, TAU, 48, Color(0.79, 0.91, 1.0, 0.62), 2.0)
			draw_string(font, button_center + Vector2(-24.0, -8.0), labels[name][0], HORIZONTAL_ALIGNMENT_CENTER, 48.0, 14, Color.WHITE)
			draw_string(font, button_center + Vector2(-32.0, 13.0), labels[name][1], HORIZONTAL_ALIGNMENT_CENTER, 64.0, 8, Color(0.82, 0.92, 1.0))

var tiles := []
var player := Vector2i(1, 1)
var move_cooldown := 0.0
var hurt_cooldown := 0.0
var lives := 3
var bombs_left := 2
var bomb_radius := 2
var max_bombs := 2
var score := 0
var level := 1
var keys := 0
var rooms_cleared := 0
var learn_hits := 0
var mistakes := 0
var exit_cell := Vector2i(COLS - 2, ROWS - 2)
var exit_open := false
var mode_learn := true
var lesson_index := 0
var question_index := 0
var answer_cells := []
var powerups := []
var bombs := []
var explosions := []
var enemies := []
var touch_overlay: TouchMazeOverlay
var last_touch_bomb := false
var last_touch_learn := false
var last_touch_cycle := false
var message := "Space: Bombe legen. Zerstoere Kisten, finde Schluessel und erreiche das Tor."
var message_timer := 4.0
var game_over := false
var won := false

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_STOP
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	touch_overlay = TouchMazeOverlay.new()
	add_child(touch_overlay)
	reset_game()

func reset_game() -> void:
	tiles.clear()
	for y in range(ROWS):
		var row := []
		for x in range(COLS):
			var border := x == 0 or y == 0 or x == COLS - 1 or y == ROWS - 1
			var pillar := x % 2 == 0 and y % 2 == 0
			if border or pillar:
				row.append(WALL)
			elif (x + y * 3 + level) % 4 == 0 and not is_spawn_safe(Vector2i(x, y)):
				row.append(CRATE)
			else:
				row.append(FLOOR)
		tiles.append(row)
	player = Vector2i(1, 1)
	hurt_cooldown = 0.0
	max_bombs = min(4, 2 + int(level / 3))
	bombs_left = max_bombs
	bomb_radius = min(5, 2 + int(level / 4))
	keys = 0
	learn_hits = 0
	mistakes = 0
	exit_open = false
	game_over = false
	won = false
	bombs.clear()
	explosions.clear()
	powerups.clear()
	spawn_enemies()
	setup_answers()
	message = "Bomb Maze Pro: Kisten sprengen, Powerups nutzen, Gegner kontrollieren."
	message_timer = 4.0

func is_spawn_safe(cell: Vector2i) -> bool:
	return cell.x <= 3 and cell.y <= 3

func spawn_enemies() -> void:
	enemies.clear()
	var starts := [
		Vector2i(COLS - 3, 1),
		Vector2i(1, ROWS - 3),
		Vector2i(COLS - 4, ROWS - 4),
		Vector2i(COLS / 2, ROWS - 2),
	]
	for i in range(min(2 + level, starts.size())):
		enemies.append({"cell": starts[i], "timer": 0.28 + float(i) * 0.12, "alive": true})

func setup_answers() -> void:
	answer_cells.clear()
	var q := current_question()
	var positions := [Vector2i(3, ROWS - 2), Vector2i(COLS / 2, 1), Vector2i(COLS - 4, ROWS - 2)]
	for i in range(q["answers"].size()):
		set_tile(positions[i], FLOOR)
		answer_cells.append({"cell": positions[i], "label": q["answers"][i], "index": i, "armed": true})

func current_question() -> Dictionary:
	var questions: Array
	match LESSONS[lesson_index]:
		"MATHE":
			questions = QUESTIONS_MATH
		"SATZ":
			questions = QUESTIONS_SENTENCE
		_:
			questions = QUESTIONS_WORD
	return questions[question_index % questions.size()]

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_R:
			reset_game()
		elif event.keycode == KEY_L:
			mode_learn = not mode_learn
			setup_answers()
			message = "Learncade: Sprenge das richtige Antwortfeld." if mode_learn else "Normalmodus: finde Schluessel, Powerups und Tor."
			message_timer = 3.0
		elif event.keycode == KEY_C:
			lesson_index = (lesson_index + 1) % LESSONS.size()
			question_index = 0
			setup_answers()
			message = "Fach gewechselt: %s" % LESSONS[lesson_index]
			message_timer = 2.5
		elif event.keycode == KEY_SPACE:
			place_bomb()

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()
	if game_over or won:
		queue_redraw()
		return
	if message_timer > 0.0:
		message_timer -= delta
	if move_cooldown > 0.0:
		move_cooldown -= delta
	if hurt_cooldown > 0.0:
		hurt_cooldown -= delta
	update_touch_actions()
	handle_movement()
	update_bombs(delta)
	update_enemies(delta)
	check_player_hazards()
	check_powerups()
	queue_redraw()

func update_touch_actions() -> void:
	if not touch_overlay:
		return
	var touch_bomb := touch_overlay.is_down("bomb")
	var touch_learn := touch_overlay.is_down("learn")
	var touch_cycle := touch_overlay.is_down("cycle")
	if touch_bomb and not last_touch_bomb:
		place_bomb()
	if touch_learn and not last_touch_learn:
		mode_learn = not mode_learn
		setup_answers()
		message = "Learncade: Sprenge das richtige Antwortfeld." if mode_learn else "Normalmodus: finde Schluessel, Powerups und Tor."
		message_timer = 3.0
	if touch_cycle and not last_touch_cycle:
		lesson_index = (lesson_index + 1) % LESSONS.size()
		question_index = 0
		setup_answers()
		message = "Fach gewechselt: %s" % LESSONS[lesson_index]
		message_timer = 2.5
	last_touch_bomb = touch_bomb
	last_touch_learn = touch_learn
	last_touch_cycle = touch_cycle

func handle_movement() -> void:
	if move_cooldown > 0.0:
		return
	var dir := Vector2i.ZERO
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		dir = Vector2i.LEFT
	elif Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		dir = Vector2i.RIGHT
	elif Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		dir = Vector2i.UP
	elif Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		dir = Vector2i.DOWN
	if touch_overlay and touch_overlay.move_vector.length() > 0.45:
		if absf(touch_overlay.move_vector.x) > absf(touch_overlay.move_vector.y):
			dir = Vector2i.RIGHT if touch_overlay.move_vector.x > 0.0 else Vector2i.LEFT
		else:
			dir = Vector2i.DOWN if touch_overlay.move_vector.y > 0.0 else Vector2i.UP
	if dir == Vector2i.ZERO:
		return
	var target := player + dir
	if can_enter(target):
		player = target
		move_cooldown = 0.105
		if player == exit_cell and exit_open:
			won = true
			rooms_cleared += 1
			level += 1
			score += 1000
			message = "Raum geschafft! R startet Raum %d." % level
			message_timer = 99.0

func can_enter(cell: Vector2i) -> bool:
	if not in_bounds(cell):
		return false
	if get_tile(cell) == WALL or get_tile(cell) == CRATE:
		return false
	for bomb in bombs:
		if bomb["cell"] == cell:
			return false
	return true

func place_bomb() -> void:
	if bombs_left <= 0 or game_over or won:
		return
	for bomb in bombs:
		if bomb["cell"] == player:
			return
	bombs_left -= 1
	bombs.append({"cell": player, "timer": 1.55, "radius": bomb_radius})
	message = "Bombe gelegt."
	message_timer = 1.0

func update_bombs(delta: float) -> void:
	for i in range(bombs.size() - 1, -1, -1):
		var bomb = bombs[i]
		bomb["timer"] -= delta
		if bomb["timer"] <= 0.0:
			explode_bomb(bomb)
			bombs.remove_at(i)
			bombs_left = min(max_bombs, bombs_left + 1)
		else:
			bombs[i] = bomb
	for i in range(explosions.size() - 1, -1, -1):
		var explosion = explosions[i]
		explosion["timer"] -= delta
		if explosion["timer"] <= 0.0:
			explosions.remove_at(i)
		else:
			explosions[i] = explosion

func explode_bomb(bomb: Dictionary) -> void:
	var cells := [bomb["cell"]]
	var dirs := [Vector2i.LEFT, Vector2i.RIGHT, Vector2i.UP, Vector2i.DOWN]
	for dir in dirs:
		for step in range(1, int(bomb["radius"]) + 1):
			var cell: Vector2i = bomb["cell"] + dir * step
			if not in_bounds(cell) or get_tile(cell) == WALL:
				break
			cells.append(cell)
			if get_tile(cell) == CRATE:
				set_tile(cell, FLOOR)
				score += 25
				spawn_powerup_from_crate(cell)
				break
	explosions.append({"cells": cells, "timer": 0.34})
	damage_enemies(cells)
	check_answers(cells)
	if keys >= 2 or (mode_learn and learn_hits >= LEARN_GOAL):
		exit_open = true

func spawn_powerup_from_crate(cell: Vector2i) -> void:
	var roll := (cell.x * 7 + cell.y * 11 + level * 13) % 9
	if roll == 0:
		powerups.append({"cell": cell, "kind": "key"})
		message = "Schluessel freigelegt."
		message_timer = 2.0
	elif roll == 1:
		powerups.append({"cell": cell, "kind": "radius"})
		message = "Feuerkraft gefunden."
		message_timer = 2.0
	elif roll == 2:
		powerups.append({"cell": cell, "kind": "bomb"})
		message = "Bomben-Upgrade gefunden."
		message_timer = 2.0
	elif roll == 3:
		powerups.append({"cell": cell, "kind": "score"})

func check_powerups() -> void:
	for i in range(powerups.size() - 1, -1, -1):
		var pickup = powerups[i]
		if pickup["cell"] != player:
			continue
		match pickup["kind"]:
			"key":
				keys += 1
				message = "Schluessel +1."
			"radius":
				bomb_radius = min(5, bomb_radius + 1)
				message = "Feuerkraft +1."
			"bomb":
				max_bombs = min(5, max_bombs + 1)
				bombs_left += 1
				message = "Mehr Bomben."
			_:
				score += 100
				message = "Bonus +100."
		message_timer = 2.0
		powerups.remove_at(i)
	if keys >= 2 or (mode_learn and learn_hits >= LEARN_GOAL):
		exit_open = true

func damage_enemies(cells: Array) -> void:
	for i in range(enemies.size()):
		var enemy = enemies[i]
		if not enemy["alive"]:
			continue
		if cells.has(enemy["cell"]):
			enemy["alive"] = false
			score += 120
			enemies[i] = enemy

func check_answers(cells: Array) -> void:
	if not mode_learn:
		return
	var q := current_question()
	for i in range(answer_cells.size()):
		var answer = answer_cells[i]
		if not answer["armed"] or not cells.has(answer["cell"]):
			continue
		answer["armed"] = false
		answer_cells[i] = answer
		if answer["index"] == q["correct"]:
			score += 300
			keys += 1
			learn_hits += 1
			exit_open = learn_hits >= LEARN_GOAL
			message = "Richtig: %s (%d/%d)." % [answer["label"], learn_hits, LEARN_GOAL]
			question_index += 1
			setup_answers()
		else:
			lives -= 1
			mistakes += 1
			message = "Falsch. Tipp: %s" % q["hint"]
			if lives <= 0:
				game_over = true
				message = "Game Over. R startet neu."
				message_timer = 99.0
		if not game_over:
			message_timer = 2.5

func update_enemies(delta: float) -> void:
	for i in range(enemies.size()):
		var enemy = enemies[i]
		if not enemy["alive"]:
			continue
		enemy["timer"] -= delta
		if enemy["timer"] <= 0.0:
			var options := [Vector2i.LEFT, Vector2i.RIGHT, Vector2i.UP, Vector2i.DOWN]
			options.sort_custom(func(a, b): return (enemy["cell"] + a).distance_squared_to(player) < (enemy["cell"] + b).distance_squared_to(player))
			for dir in options:
				var target: Vector2i = enemy["cell"] + dir
				if can_enter(target) and target != player:
					enemy["cell"] = target
					break
			enemy["timer"] = 0.46
		enemies[i] = enemy

func check_player_hazards() -> void:
	if hurt_cooldown > 0.0:
		return
	for explosion in explosions:
		if Array(explosion["cells"]).has(player):
			hurt_player("Explosion erwischt.")
	for enemy in enemies:
		if enemy["alive"] and enemy["cell"] == player:
			hurt_player("Gegnerkontakt.")

func hurt_player(text: String) -> void:
	lives -= 1
	hurt_cooldown = 1.0
	message = text
	message_timer = 1.8
	player = Vector2i(1, 1)
	if lives <= 0:
		game_over = true
		message = "Game Over. R startet neu."
		message_timer = 99.0

func in_bounds(cell: Vector2i) -> bool:
	return cell.x >= 0 and cell.y >= 0 and cell.x < COLS and cell.y < ROWS

func get_tile(cell: Vector2i) -> int:
	return int(tiles[cell.y][cell.x])

func set_tile(cell: Vector2i, value: int) -> void:
	tiles[cell.y][cell.x] = value

func board_layout() -> Dictionary:
	var reserved_y: float = 150.0 if mode_learn else 118.0
	var tile: float = floor(min((size.x - 70.0) / float(COLS), (size.y - reserved_y - 48.0) / float(ROWS)))
	tile = clampf(tile, 30.0, 58.0)
	var board_size: Vector2 = Vector2(float(COLS) * tile, float(ROWS) * tile)
	var spare_y: float = maxf(0.0, size.y - reserved_y - board_size.y - 48.0)
	var origin_y: float = reserved_y + minf(spare_y * 0.35, 150.0)
	var origin: Vector2 = Vector2((size.x - board_size.x) * 0.5, origin_y)
	return {"origin": origin, "tile": tile}

func cell_rect(cell: Vector2i, origin: Vector2, tile: float, inset: float = 3.0) -> Rect2:
	return Rect2(origin + Vector2(cell) * tile + Vector2(inset, inset), Vector2(tile - inset * 2.0, tile - inset * 2.0))

func _draw() -> void:
	var layout := board_layout()
	var origin: Vector2 = layout["origin"]
	var tile: float = layout["tile"]
	draw_background()
	draw_board(origin, tile)
	draw_answers(origin, tile)
	draw_exit(origin, tile)
	draw_powerups(origin, tile)
	draw_bombs(origin, tile)
	draw_explosions(origin, tile)
	draw_enemies(origin, tile)
	draw_player(origin, tile)
	draw_hud()

func draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color.html("#06111f"), true)
	for y in range(0, int(size.y), 28):
		draw_line(Vector2(0, y), Vector2(size.x, y), Color(1, 1, 1, 0.025), 1.0)

func draw_board(origin: Vector2, tile: float) -> void:
	for y in range(ROWS):
		for x in range(COLS):
			var cell := Vector2i(x, y)
			var rect := cell_rect(cell, origin, tile, 2.0)
			var tone := Color.html("#123b28") if (x + y) % 2 == 0 else Color.html("#0e2f21")
			draw_rect(rect, tone, true)
			var value := get_tile(cell)
			if value == WALL:
				draw_rect(rect, Color.html("#334155"), true)
				draw_rect(Rect2(rect.position, Vector2(rect.size.x, 5)), Color.html("#64748b"), true)
			elif value == CRATE:
				draw_rect(rect.grow(-5), Color.html("#92400e"), true)
				draw_line(rect.position + Vector2(8, 8), rect.position + rect.size - Vector2(8, 8), Color.html("#f59e0b"), 3.0)

func draw_answers(origin: Vector2, tile: float) -> void:
	if not mode_learn:
		return
	var font := get_theme_default_font()
	var q := current_question()
	for answer in answer_cells:
		var cell: Vector2i = answer["cell"]
		var rect := cell_rect(cell, origin, tile, 6.0)
		var color := Color.html("#38bdf8") if answer["armed"] else Color.html("#334155")
		draw_rect(rect, Color(color.r, color.g, color.b, 0.28), true)
		draw_arc(rect.get_center(), tile * 0.42, 0.0, TAU, 5, color, 4.0)
		draw_string(font, rect.position + Vector2(4, rect.size.y * 0.58), answer["label"], HORIZONTAL_ALIGNMENT_LEFT, -1, max(11, int(tile * 0.22)), Color.html("#f8fafc"))
	var prompt_rect: Rect2 = Rect2(12.0, 96.0, minf(size.x - 24.0, 620.0), 30.0)
	draw_rect(prompt_rect, Color(0.02, 0.05, 0.09, 0.78), true)
	draw_string(font, prompt_rect.position + Vector2(10.0, 22.0), q["prompt"], HORIZONTAL_ALIGNMENT_LEFT, prompt_rect.size.x - 20.0, 17, Color.html("#f8fafc"))

func draw_powerups(origin: Vector2, tile: float) -> void:
	var font := get_theme_default_font()
	for pickup in powerups:
		var rect := cell_rect(pickup["cell"], origin, tile, tile * 0.25)
		var color := Color.html("#facc15")
		var label := "$"
		match pickup["kind"]:
			"key":
				color = Color.html("#fde047")
				label = "K"
			"radius":
				color = Color.html("#fb923c")
				label = "F"
			"bomb":
				color = Color.html("#38bdf8")
				label = "B"
			_:
				color = Color.html("#22c55e")
				label = "+"
		draw_rect(rect, Color(color.r, color.g, color.b, 0.9), true)
		draw_rect(rect, Color.html("#020617"), false, 2.0)
		draw_string(font, rect.position + Vector2(3.0, rect.size.y * 0.68), label, HORIZONTAL_ALIGNMENT_CENTER, rect.size.x - 6.0, max(12, int(tile * 0.28)), Color.html("#020617"))

func draw_exit(origin: Vector2, tile: float) -> void:
	var rect := cell_rect(exit_cell, origin, tile, 8.0)
	draw_rect(rect, Color.html("#22c55e") if exit_open else Color.html("#475569"), true)
	draw_string(get_theme_default_font(), rect.position + Vector2(5, rect.size.y * 0.62), "TOR", HORIZONTAL_ALIGNMENT_LEFT, -1, max(12, int(tile * 0.25)), Color.html("#f8fafc"))

func draw_bombs(origin: Vector2, tile: float) -> void:
	for bomb in bombs:
		var rect := cell_rect(bomb["cell"], origin, tile, tile * 0.22)
		draw_circle(rect.get_center(), rect.size.x * 0.45, Color.html("#020617"))
		draw_circle(rect.get_center() + Vector2(rect.size.x * 0.18, -rect.size.y * 0.22), rect.size.x * 0.12, Color.html("#f97316"))

func draw_explosions(origin: Vector2, tile: float) -> void:
	for explosion in explosions:
		for cell in explosion["cells"]:
			var rect := cell_rect(cell, origin, tile, 6.0)
			draw_rect(rect, Color(1.0, 0.78, 0.18, 0.72), true)
			draw_rect(rect.grow(-10), Color(1.0, 0.25, 0.08, 0.72), true)

func draw_enemies(origin: Vector2, tile: float) -> void:
	for enemy in enemies:
		if not enemy["alive"]:
			continue
		var rect := cell_rect(enemy["cell"], origin, tile, tile * 0.18)
		draw_rect(rect, Color.html("#ef4444"), true)
		draw_rect(Rect2(rect.position + Vector2(rect.size.x * 0.2, rect.size.y * 0.34), Vector2(rect.size.x * 0.18, rect.size.y * 0.18)), Color.html("#f8fafc"), true)
		draw_rect(Rect2(rect.position + Vector2(rect.size.x * 0.62, rect.size.y * 0.34), Vector2(rect.size.x * 0.18, rect.size.y * 0.18)), Color.html("#f8fafc"), true)

func draw_player(origin: Vector2, tile: float) -> void:
	var rect := cell_rect(player, origin, tile, tile * 0.16)
	draw_rect(rect, Color.html("#facc15"), true)
	draw_rect(Rect2(rect.position + Vector2(rect.size.x * 0.18, rect.size.y * 0.18), Vector2(rect.size.x * 0.64, rect.size.y * 0.24)), Color.html("#fde68a"), true)
	draw_rect(Rect2(rect.position + Vector2(rect.size.x * 0.24, rect.size.y * 0.54), Vector2(rect.size.x * 0.16, rect.size.y * 0.16)), Color.html("#020617"), true)
	draw_rect(Rect2(rect.position + Vector2(rect.size.x * 0.60, rect.size.y * 0.54), Vector2(rect.size.x * 0.16, rect.size.y * 0.16)), Color.html("#020617"), true)

func draw_hud() -> void:
	var font := get_theme_default_font()
	draw_rect(Rect2(12, 12, 460, 108), Color(0.02, 0.05, 0.09, 0.78), true)
	draw_string(font, Vector2(24, 38), "FASKA BOMB MAZE PRO", HORIZONTAL_ALIGNMENT_LEFT, -1, 21, Color.html("#facc15"))
	draw_string(font, Vector2(24, 64), "Score %d  Raum %d  Leben %d  Bomben %d/%d  Radius %d" % [score, level, lives, bombs_left, max_bombs, bomb_radius], HORIZONTAL_ALIGNMENT_LEFT, -1, 15, Color.html("#f8fafc"))
	draw_string(font, Vector2(24, 88), "Keys %d/2  Mode %s  Fach %s  Fehler %d" % [keys, "Learncade" if mode_learn else "Normal", LESSONS[lesson_index], mistakes], HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.html("#cbd5e1"))
	draw_string(font, Vector2(24, 110), "Lernziel %d/%d  Space/B Bombe  L Learncade  C Fach" % [learn_hits, LEARN_GOAL], HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color.html("#fde68a"))
	if message_timer > 0.0:
		draw_rect(Rect2(12.0, size.y - 40.0, min(size.x - 24.0, 760.0), 28.0), Color(0.02, 0.05, 0.09, 0.78), true)
		draw_string(font, Vector2(24.0, size.y - 19.0), message, HORIZONTAL_ALIGNMENT_LEFT, -1, 15, Color.html("#f8fafc"))
