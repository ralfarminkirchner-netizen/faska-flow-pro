extends Control

const COLS := 13
const ROWS := 11
const FLOOR := 0
const WALL := 1
const CRATE := 2
const LEARN_GOAL := 6
const KEY_GOAL := 2
const CRATE_GOAL := 12
const BASE_TIMER := 120.0
const LESSONS := ["WORTART", "MATHE", "SATZ", "KOMPOSITUM", "ENGLISCH"]
const QUESTIONS_WORD := [
	{"prompt": "Welche Wortart ist 'schnell'?", "answers": ["Nomen", "Verb", "Adjektiv"], "correct": 2, "hint": "Schnell beschreibt, wie etwas passiert."},
	{"prompt": "Welche Wortart ist 'laufen'?", "answers": ["Verb", "Artikel", "Nomen"], "correct": 0, "hint": "Laufen ist eine Taetigkeit."},
	{"prompt": "Welche Wortart ist 'der'?", "answers": ["Adjektiv", "Artikel", "Verb"], "correct": 1, "hint": "Der begleitet ein Nomen."},
	{"prompt": "Welche Wortart ist 'Baumhaus'?", "answers": ["Nomen", "Verb", "Adjektiv"], "correct": 0, "hint": "Man kann das Baumhaus sehen und anfassen."},
	{"prompt": "Welche Wortart ist 'unter'?", "answers": ["Praeposition", "Verb", "Artikel"], "correct": 0, "hint": "Unter sagt, wo etwas liegt."},
	{"prompt": "Welche Wortart ist 'weil'?", "answers": ["Konjunktion", "Adjektiv", "Artikel"], "correct": 0, "hint": "Weil verbindet einen Grund mit dem Satz."},
	{"prompt": "Welche Wortart ist 'mutig'?", "answers": ["Verb", "Adjektiv", "Nomen"], "correct": 1, "hint": "Mutig beschreibt, wie jemand ist."},
]
const QUESTIONS_MATH := [
	{"prompt": "Sprenge das Ergebnis von 7 + 5.", "answers": ["10", "12", "14"], "correct": 1, "hint": "7 + 3 = 10, dann noch 2."},
	{"prompt": "Sprenge das Ergebnis von 18 - 9.", "answers": ["7", "9", "11"], "correct": 1, "hint": "18 halbieren ergibt 9."},
	{"prompt": "Sprenge das Ergebnis von 3 x 4.", "answers": ["7", "12", "14"], "correct": 1, "hint": "3 Vierergruppen sind 12."},
	{"prompt": "Welche Zahl fehlt? 4, 6, 8, __", "answers": ["9", "10", "12"], "correct": 1, "hint": "Die Reihe springt immer +2."},
	{"prompt": "Sprenge das Ergebnis von 36 : 6.", "answers": ["5", "6", "8"], "correct": 1, "hint": "6 mal 6 ist 36."},
	{"prompt": "Sprenge das Ergebnis von 8 x 7.", "answers": ["54", "56", "64"], "correct": 1, "hint": "8 mal 7 ist 56."},
	{"prompt": "Welche Zahl ist gerade?", "answers": ["21", "24", "35"], "correct": 1, "hint": "Gerade Zahlen lassen sich durch 2 teilen."},
]
const QUESTIONS_SENTENCE := [
	{"prompt": "Was passt? Der Hund ___ schnell.", "answers": ["rennt", "Hund", "schnell"], "correct": 0, "hint": "Gesucht ist die Taetigkeit."},
	{"prompt": "Was passt? Das ___ Auto faehrt.", "answers": ["gelbe", "rennt", "Auto"], "correct": 0, "hint": "Gesucht ist eine Eigenschaft."},
	{"prompt": "Was passt? Der Ball liegt ___ dem Tisch.", "answers": ["unter", "Ball", "springt"], "correct": 0, "hint": "Gesucht ist ein Lagewort."},
	{"prompt": "Was passt? Mia liest, ___ sie lernen will.", "answers": ["weil", "Mia", "schnell"], "correct": 0, "hint": "Gesucht ist ein Bindewort."},
	{"prompt": "Was passt? ___ malt ein Bild.", "answers": ["Lina", "leise", "unter"], "correct": 0, "hint": "Gesucht ist, wer etwas tut."},
	{"prompt": "Was passt? Der Vogel fliegt ___ den Baum.", "answers": ["ueber", "gelb", "singt"], "correct": 0, "hint": "Gesucht ist ein Lagewort."},
]
const QUESTIONS_COMPOUND := [
	{"prompt": "Welche Teile bilden 'Baumhaus'?", "answers": ["Baum + Haus", "Ball + Haus", "Baum + Maus"], "correct": 0, "hint": "Ein Baumhaus steht am oder im Baum."},
	{"prompt": "Welche Teile bilden 'Schneeball'?", "answers": ["Schnee + Ball", "Schnell + Ball", "Schnee + Wald"], "correct": 0, "hint": "Ein Schneeball besteht aus Schnee."},
	{"prompt": "Welches Wort ist ein Kompositum?", "answers": ["laufen", "Regenbogen", "mutig"], "correct": 1, "hint": "Regenbogen besteht aus Regen + Bogen."},
	{"prompt": "Welche Teile bilden 'Zahnbuerste'?", "answers": ["Zahn + Buerste", "Zahl + Buerste", "Zahn + Baum"], "correct": 0, "hint": "Man putzt damit Zaehne."},
]
const QUESTIONS_ENGLISH := [
	{"prompt": "Was heisst 'Apfel' auf Englisch?", "answers": ["apple", "table", "school"], "correct": 0, "hint": "Apple ist auch ein Obstwort."},
	{"prompt": "Was heisst 'rennen' auf Englisch?", "answers": ["read", "run", "rain"], "correct": 1, "hint": "Run bedeutet laufen oder rennen."},
	{"prompt": "Was heisst 'gelb' auf Englisch?", "answers": ["green", "yellow", "small"], "correct": 1, "hint": "Yellow ist die Farbe der Sonne."},
	{"prompt": "Was heisst 'Haus' auf Englisch?", "answers": ["horse", "house", "hand"], "correct": 1, "hint": "House klingt fast wie Haus."},
	{"prompt": "Was heisst 'lesen' auf Englisch?", "answers": ["read", "red", "ride"], "correct": 0, "hint": "Read benutzt man fuer Buecher."},
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
		mouse_filter = Control.MOUSE_FILTER_PASS
		queue_redraw()

	func _gui_input(event: InputEvent) -> void:
		if not _should_show():
			return
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

	func _should_show() -> bool:
		var screen := get_viewport_rect().size
		return screen.x <= 1100.0 or screen.x < screen.y

	func _ui_scale() -> float:
		var screen := get_viewport_rect().size
		return 3.0 if screen.x < screen.y else 1.0

	func _stick_center() -> Vector2:
		var screen := get_viewport_rect().size
		var ui := _ui_scale()
		return Vector2(106.0 * ui, screen.y - 112.0 * ui)

	func _button_centers() -> Dictionary:
		var screen := get_viewport_rect().size
		var ui := _ui_scale()
		return {
			"bomb": Vector2(screen.x - 96.0 * ui, screen.y - 120.0 * ui),
			"learn": Vector2(screen.x - 190.0 * ui, screen.y - 64.0 * ui),
			"cycle": Vector2(screen.x - 96.0 * ui, screen.y - 42.0 * ui),
		}

	func _is_on_stick(pos: Vector2) -> bool:
		return pos.distance_to(_stick_center()) <= 88.0 * _ui_scale()

	func _button_at(pos: Vector2) -> String:
		for name in _button_centers().keys():
			if pos.distance_to(_button_centers()[name]) <= 44.0 * _ui_scale():
				return name
		return ""

	func _update_stick(pos: Vector2) -> void:
		var limit := 56.0 * _ui_scale()
		var raw := pos - _stick_center()
		move_vector = raw.limit_length(limit) / limit
		queue_redraw()

	func _draw() -> void:
		if not _should_show():
			return
		var ui := _ui_scale()
		var font := get_theme_default_font()
		var center := _stick_center()
		draw_circle(center, 64.0 * ui, Color(0.02, 0.08, 0.13, 0.48))
		draw_arc(center, 64.0 * ui, 0.0, TAU, 48, Color(0.65, 0.86, 1.0, 0.48), 3.0 * ui)
		draw_circle(center + move_vector * 42.0 * ui, 27.0 * ui, Color(0.25, 0.85, 1.0, 0.86))
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
			draw_circle(button_center, 40.0 * ui, fill)
			draw_arc(button_center, 40.0 * ui, 0.0, TAU, 48, Color(0.79, 0.91, 1.0, 0.62), 2.0 * ui)
			draw_string(font, button_center + Vector2(-24.0, -8.0) * ui, labels[name][0], HORIZONTAL_ALIGNMENT_CENTER, 48.0 * ui, 14 * ui, Color.WHITE)
			draw_string(font, button_center + Vector2(-32.0, 13.0) * ui, labels[name][1], HORIZONTAL_ALIGNMENT_CENTER, 64.0 * ui, 8 * ui, Color(0.82, 0.92, 1.0))

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
var crates_destroyed := 0
var rooms_cleared := 0
var learn_hits := 0
var mistakes := 0
var exit_cell := Vector2i(COLS - 2, ROWS - 2)
var exit_open := false
var mode_learn := false
var lesson_index := 0
var question_index := 0
var answer_cells := []
var repeat_queue := []
var answered_ids := {}
var powerups := []
var bombs := []
var explosions := []
var enemies := []
var chain_count := 0
var level_timer := BASE_TIMER
var panic_spawned := false
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
	crates_destroyed = 0
	learn_hits = 0
	mistakes = 0
	repeat_queue.clear()
	answered_ids.clear()
	exit_open = false
	game_over = false
	won = false
	bombs.clear()
	explosions.clear()
	powerups.clear()
	chain_count = 0
	level_timer = maxf(72.0, BASE_TIMER - float(level - 1) * 7.0)
	panic_spawned = false
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
		var kind := "hunter" if i % 3 == 0 else ("guard" if i % 3 == 1 else "runner")
		enemies.append({"cell": starts[i], "timer": 0.28 + float(i) * 0.12, "alive": true, "kind": kind})

func setup_answers() -> void:
	answer_cells.clear()
	var q := current_question()
	var positions := [Vector2i(3, ROWS - 2), Vector2i(COLS / 2, 1), Vector2i(COLS - 4, ROWS - 2)]
	for i in range(q["answers"].size()):
		set_tile(positions[i], FLOOR)
		answer_cells.append({"cell": positions[i], "label": q["answers"][i], "index": i, "armed": true, "repeat": q.get("repeat", false)})

func current_question() -> Dictionary:
	if repeat_queue.size() > 0:
		var repeated: Dictionary = repeat_queue[0].duplicate(true)
		repeated["repeat"] = true
		return repeated
	var questions: Array
	match LESSONS[lesson_index]:
		"MATHE":
			questions = QUESTIONS_MATH
		"SATZ":
			questions = QUESTIONS_SENTENCE
		"KOMPOSITUM":
			questions = QUESTIONS_COMPOUND
		"ENGLISCH":
			questions = QUESTIONS_ENGLISH
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
			repeat_queue.clear()
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
	update_level_timer(delta)
	update_touch_actions()
	handle_movement()
	update_bombs(delta)
	update_enemies(delta)
	check_player_hazards()
	check_powerups()
	update_exit_state()
	queue_redraw()

func update_level_timer(delta: float) -> void:
	level_timer = maxf(0.0, level_timer - delta)
	if level_timer <= 28.0 and not panic_spawned:
		panic_spawned = true
		spawn_panic_enemy()
		message = "Zeitdruck! Ein Jaeger betritt das Labyrinth."
		message_timer = 2.5

func spawn_panic_enemy() -> void:
	var candidates := [Vector2i(COLS - 2, 1), Vector2i(1, ROWS - 2), Vector2i(COLS - 2, ROWS - 2)]
	for cell in candidates:
		if can_enter(cell) and cell != player:
			enemies.append({"cell": cell, "timer": 0.2, "alive": true, "kind": "hunter"})
			return

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
		repeat_queue.clear()
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
	var cells := preview_blast_cells(bomb)
	for cell in cells:
		if get_tile(cell) == CRATE:
			set_tile(cell, FLOOR)
			crates_destroyed += 1
			score += 25
			spawn_powerup_from_crate(cell)
	trigger_chain_reactions(cells, bomb["cell"])
	explosions.append({"cells": cells, "timer": 0.34})
	damage_enemies(cells)
	check_answers(cells)
	update_exit_state()

func preview_blast_cells(bomb: Dictionary) -> Array:
	var cells := [bomb["cell"]]
	var dirs := [Vector2i.LEFT, Vector2i.RIGHT, Vector2i.UP, Vector2i.DOWN]
	for dir in dirs:
		for step in range(1, int(bomb["radius"]) + 1):
			var cell: Vector2i = bomb["cell"] + dir * step
			if not in_bounds(cell) or get_tile(cell) == WALL:
				break
			cells.append(cell)
			if get_tile(cell) == CRATE:
				break
	return cells

func trigger_chain_reactions(cells: Array, source_cell: Vector2i) -> void:
	for i in range(bombs.size()):
		var queued = bombs[i]
		if queued["cell"] == source_cell:
			continue
		if cells.has(queued["cell"]) and float(queued["timer"]) > 0.06:
			queued["timer"] = 0.06
			bombs[i] = queued
			chain_count += 1
			score += 40
			message = "Kettenreaktion!"
			message_timer = 1.4

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
	update_exit_state()

func damage_enemies(cells: Array) -> void:
	for i in range(enemies.size()):
		var enemy = enemies[i]
		if not enemy["alive"]:
			continue
		if cells.has(enemy["cell"]):
			enemy["alive"] = false
			score += 120
			enemies[i] = enemy
	update_exit_state()

func active_enemy_count() -> int:
	var count := 0
	for enemy in enemies:
		if bool(enemy["alive"]):
			count += 1
	return count

func update_exit_state() -> void:
	if mode_learn:
		exit_open = learn_hits >= LEARN_GOAL
	else:
		exit_open = keys >= KEY_GOAL and crates_destroyed >= CRATE_GOAL and active_enemy_count() == 0

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
			score += 360 if q.get("repeat", false) else 300
			keys += 1
			learn_hits += 1
			exit_open = learn_hits >= LEARN_GOAL
			answered_ids[_question_id(q)] = true
			_remove_repeat(q)
			message = "Richtig: %s (%d/%d)." % [answer["label"], learn_hits, LEARN_GOAL]
			if not q.get("repeat", false):
				question_index += 1
			setup_answers()
		else:
			lives -= 1
			mistakes += 1
			_queue_repeat(q)
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
			for dir in enemy_directions(enemy):
				var target: Vector2i = enemy["cell"] + dir
				if can_enter(target) and target != player:
					enemy["cell"] = target
					break
			enemy["timer"] = enemy_step_time(enemy)
		enemies[i] = enemy

func enemy_directions(enemy: Dictionary) -> Array:
	var options := [Vector2i.LEFT, Vector2i.RIGHT, Vector2i.UP, Vector2i.DOWN]
	var kind := String(enemy.get("kind", "hunter"))
	if kind == "guard":
		options.sort_custom(func(a, b): return abs((enemy["cell"] + a).x - exit_cell.x) + abs((enemy["cell"] + a).y - exit_cell.y) < abs((enemy["cell"] + b).x - exit_cell.x) + abs((enemy["cell"] + b).y - exit_cell.y))
	elif kind == "runner":
		options.sort_custom(func(a, b): return int((enemy["cell"] + a).x * 7 + (enemy["cell"] + a).y * 11 + level) % 9 < int((enemy["cell"] + b).x * 7 + (enemy["cell"] + b).y * 11 + level) % 9)
	else:
		options.sort_custom(func(a, b): return (enemy["cell"] + a).distance_squared_to(player) < (enemy["cell"] + b).distance_squared_to(player))
	return options

func enemy_step_time(enemy: Dictionary) -> float:
	match String(enemy.get("kind", "hunter")):
		"runner":
			return 0.34
		"guard":
			return 0.58
		_:
			return maxf(0.32, 0.48 - float(level) * 0.015)

func enemy_color(enemy: Dictionary) -> Color:
	match String(enemy.get("kind", "hunter")):
		"runner":
			return Color.html("#f97316")
		"guard":
			return Color.html("#a78bfa")
		_:
			return Color.html("#ef4444")

func enemy_label(enemy: Dictionary) -> String:
	match String(enemy.get("kind", "hunter")):
		"runner":
			return "R"
		"guard":
			return "G"
		_:
			return "J"

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

func _is_portrait_layout() -> bool:
	return size.x < size.y

func _ui_scale() -> float:
	return 3.0 if _is_portrait_layout() else 1.0

func board_layout() -> Dictionary:
	var compact := size.x < 720.0 or _is_portrait_layout()
	var touch_reserved: float = 520.0 if compact else (150.0 if touch_overlay != null and touch_overlay._should_show() else 48.0)
	var reserved_y: float = (430.0 if mode_learn else 330.0) if compact else (154.0 if mode_learn else 118.0)
	var side_margin: float = 90.0 if compact else 70.0
	var tile: float = floor(min((size.x - side_margin) / float(COLS), (size.y - reserved_y - touch_reserved) / float(ROWS)))
	tile = clampf(tile, 64.0, 96.0) if compact else clampf(tile, 30.0, 64.0)
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
	draw_blast_preview(origin, tile)
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
		var color := Color.html("#c084fc") if answer.get("repeat", false) else Color.html("#38bdf8")
		if not answer["armed"]:
			color = Color.html("#334155")
		draw_rect(rect, Color(color.r, color.g, color.b, 0.28), true)
		draw_arc(rect.get_center(), tile * 0.42, 0.0, TAU, 5, color, 4.0)
		draw_string(font, rect.position + Vector2(4, rect.size.y * 0.58), answer["label"], HORIZONTAL_ALIGNMENT_LEFT, -1, max(11, int(tile * 0.22)), Color.html("#f8fafc"))
	var ui := _ui_scale()
	var prompt_rect: Rect2 = Rect2(12.0 * ui, 96.0 * ui, minf(size.x - 24.0 * ui, 620.0 * ui), 30.0 * ui)
	draw_rect(prompt_rect, Color(0.02, 0.05, 0.09, 0.78), true)
	var prefix := "Wiederholung: " if q.get("repeat", false) else ""
	draw_string(font, prompt_rect.position + Vector2(10.0, 22.0) * ui, "%s%s" % [prefix, q["prompt"]], HORIZONTAL_ALIGNMENT_LEFT, prompt_rect.size.x - 20.0 * ui, 17 * ui, Color.html("#f8fafc"))

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
	var label := "OFFEN" if exit_open else "TOR"
	draw_string(get_theme_default_font(), rect.position + Vector2(5, rect.size.y * 0.62), label, HORIZONTAL_ALIGNMENT_LEFT, -1, max(12, int(tile * 0.25)), Color.html("#f8fafc"))

func draw_blast_preview(origin: Vector2, tile: float) -> void:
	for bomb in bombs:
		var alpha := clampf(0.16 + (1.6 - float(bomb["timer"])) * 0.12, 0.14, 0.42)
		for cell in preview_blast_cells(bomb):
			var rect := cell_rect(cell, origin, tile, 10.0)
			draw_rect(rect, Color(1.0, 0.72, 0.12, alpha), true)
			draw_rect(rect, Color(1.0, 0.32, 0.06, alpha * 0.7), false, 2.0)

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
		var color := enemy_color(enemy)
		draw_rect(rect, color, true)
		draw_rect(Rect2(rect.position + Vector2(rect.size.x * 0.2, rect.size.y * 0.34), Vector2(rect.size.x * 0.18, rect.size.y * 0.18)), Color.html("#f8fafc"), true)
		draw_rect(Rect2(rect.position + Vector2(rect.size.x * 0.62, rect.size.y * 0.34), Vector2(rect.size.x * 0.18, rect.size.y * 0.18)), Color.html("#f8fafc"), true)
		draw_string(get_theme_default_font(), rect.position + Vector2(2, rect.size.y * 0.88), enemy_label(enemy), HORIZONTAL_ALIGNMENT_CENTER, rect.size.x - 4, max(9, int(tile * 0.16)), Color.html("#020617"))

func draw_player(origin: Vector2, tile: float) -> void:
	var rect := cell_rect(player, origin, tile, tile * 0.16)
	draw_rect(rect, Color.html("#facc15"), true)
	draw_rect(Rect2(rect.position + Vector2(rect.size.x * 0.18, rect.size.y * 0.18), Vector2(rect.size.x * 0.64, rect.size.y * 0.24)), Color.html("#fde68a"), true)
	draw_rect(Rect2(rect.position + Vector2(rect.size.x * 0.24, rect.size.y * 0.54), Vector2(rect.size.x * 0.16, rect.size.y * 0.16)), Color.html("#020617"), true)
	draw_rect(Rect2(rect.position + Vector2(rect.size.x * 0.60, rect.size.y * 0.54), Vector2(rect.size.x * 0.16, rect.size.y * 0.16)), Color.html("#020617"), true)

func draw_hud() -> void:
	var font := get_theme_default_font()
	var ui := _ui_scale()
	draw_rect(Rect2(12.0 * ui, 12.0 * ui, minf(size.x - 24.0 * ui, 460.0 * ui), 108.0 * ui), Color(0.02, 0.05, 0.09, 0.78), true)
	draw_string(font, Vector2(24.0, 38.0) * ui, "FASKA BOMB MAZE PRO", HORIZONTAL_ALIGNMENT_LEFT, -1, 21 * ui, Color.html("#facc15"))
	draw_string(font, Vector2(24.0, 64.0) * ui, "Score %d  Raum %d  Zeit %ds  Leben %d  Bomben %d/%d  Radius %d" % [score, level, int(level_timer), lives, bombs_left, max_bombs, bomb_radius], HORIZONTAL_ALIGNMENT_LEFT, -1, 15 * ui, Color.html("#f8fafc"))
	draw_string(font, Vector2(24.0, 88.0) * ui, "Keys %d/%d  Kisten %d/%d  Gegner %d  Ketten %d" % [keys, KEY_GOAL, crates_destroyed, CRATE_GOAL, active_enemy_count(), chain_count], HORIZONTAL_ALIGNMENT_LEFT, -1, 14 * ui, Color.html("#cbd5e1"))
	draw_string(font, Vector2(24.0, 110.0) * ui, "%s | %s | Wdh %d" % ["Learncade" if mode_learn else "Normal", mission_text(), repeat_queue.size()], HORIZONTAL_ALIGNMENT_LEFT, -1, 13 * ui, Color.html("#fde68a"))
	if message_timer > 0.0:
		draw_rect(Rect2(12.0 * ui, size.y - 40.0 * ui, min(size.x - 24.0 * ui, 760.0 * ui), 28.0 * ui), Color(0.02, 0.05, 0.09, 0.78), true)
		draw_string(font, Vector2(24.0 * ui, size.y - 19.0 * ui), message, HORIZONTAL_ALIGNMENT_LEFT, -1, 15 * ui, Color.html("#f8fafc"))

func _question_id(question: Dictionary) -> String:
	return "%s|%s" % [String(LESSONS[lesson_index]), String(question.get("prompt", ""))]

func _queue_repeat(question: Dictionary) -> void:
	var qid := _question_id(question)
	for item in repeat_queue:
		if _question_id(item) == qid:
			return
	if repeat_queue.size() >= 6:
		repeat_queue.pop_front()
	var copy := question.duplicate(true)
	copy["repeat"] = true
	repeat_queue.append(copy)

func _remove_repeat(question: Dictionary) -> void:
	var qid := _question_id(question)
	for i in range(repeat_queue.size() - 1, -1, -1):
		if _question_id(repeat_queue[i]) == qid:
			repeat_queue.remove_at(i)

func mission_text() -> String:
	if mode_learn:
		return "%s %d/%d, Fehler %d, Fach %s" % ["Lernziel", learn_hits, LEARN_GOAL, mistakes, LESSONS[lesson_index]]
	if exit_open:
		return "Tor offen"
	return "Tor: Keys, Kistenziel und alle Gegner"
