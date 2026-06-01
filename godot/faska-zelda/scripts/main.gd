extends Control

const TILE_SIZE := 40.0
const MAP_W := 38
const MAP_H := 28
const LEARN_GOAL := 4

const FLOOR := 0
const WALL := 1
const WATER := 2
const BRIDGE := 3
const FLOWER := 4

const LESSONS := ["WORTART", "MATHE", "SATZ", "LESEN"]

const QUESTIONS_WORD := [
	{"prompt": "Welche Wortart ist 'mutig'?", "answers": ["Nomen", "Verb", "Adjektiv"], "correct": 2, "hint": "Mutig beschreibt, wie jemand ist."},
	{"prompt": "Welche Wortart ist 'kaempfen'?", "answers": ["Verb", "Artikel", "Nomen"], "correct": 0, "hint": "Kaempfen ist etwas, das man tun kann."},
	{"prompt": "Welche Wortart ist 'die'?", "answers": ["Adjektiv", "Artikel", "Verb"], "correct": 1, "hint": "Die steht vor einem Nomen."},
	{"prompt": "Welche Wortart ist 'Burg'?", "answers": ["Nomen", "Verb", "Artikel"], "correct": 0, "hint": "Eine Burg ist ein Ding."},
]

const QUESTIONS_MATH := [
	{"prompt": "Welche Zahl oeffnet das Tor? 7 + 5", "answers": ["11", "12", "13"], "correct": 1, "hint": "Zaehle von 7 fuenf weiter."},
	{"prompt": "Welche Zahl passt? 3 x 4", "answers": ["7", "12", "14"], "correct": 1, "hint": "Drei Vierergruppen."},
	{"prompt": "Welche Zahl fehlt? 18 - ? = 10", "answers": ["6", "8", "9"], "correct": 1, "hint": "Von 18 bis 10 sind es 8."},
	{"prompt": "Welche Zahl ist gerade?", "answers": ["15", "18", "21"], "correct": 1, "hint": "Gerade Zahlen lassen sich durch 2 teilen."},
]

const QUESTIONS_SENTENCE := [
	{"prompt": "Welches Wort gehoert in den Satz? Der Ritter ___ schnell.", "answers": ["rennt", "blau", "der"], "correct": 0, "hint": "Gesucht ist ein Tunwort."},
	{"prompt": "Welche Satzstelle ist das Subjekt? Luna findet den Stern.", "answers": ["Luna", "findet", "den Stern"], "correct": 0, "hint": "Wer findet den Stern?"},
	{"prompt": "Welches Wort beendet den Satz sinnvoll? Die Bruecke ist ___.", "answers": ["springt", "stabil", "und"], "correct": 1, "hint": "Gesucht ist eine Eigenschaft."},
	{"prompt": "Was ist das Prädikat? Bruno hebt den Schild.", "answers": ["Bruno", "hebt", "den Schild"], "correct": 1, "hint": "Was tut Bruno?"},
]

const QUESTIONS_READING := [
	{"prompt": "Lies genau: Wohin geht der Held?", "answers": ["zur Bruecke", "in den See", "unter den Tisch"], "correct": 0, "hint": "Das Ziel liegt ueber dem Wasser."},
	{"prompt": "Welches Wort reimt sich auf Wald?", "answers": ["kalt", "Wiese", "Turm"], "correct": 0, "hint": "Beide enden aehnlich."},
	{"prompt": "Welches Wort beginnt wie Schwert?", "answers": ["Schule", "Tor", "Bach"], "correct": 0, "hint": "Hoere auf den Anfang: Sch."},
	{"prompt": "Welche Anweisung passt? Gehe zum Tor.", "answers": ["Tor", "Wasser", "Blume"], "correct": 0, "hint": "Der Satz nennt den Zielort."},
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
		elif event is InputEventScreenDrag:
			if event.index == _move_touch:
				_update_move(event.position)

	func _update_move(pos: Vector2) -> void:
		var center := _stick_center()
		var radius := 112.0
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
		return Vector2(128.0, size.y - 240.0)

	func _buttons() -> Array:
		var button_w := 112.0
		var button_h := 82.0
		var gap := 14.0
		var cluster_x := size.x - (button_w * 2.0 + gap + 28.0)
		var cluster_y := size.y - (button_h * 2.0 + gap + 126.0)
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

	func _draw_stick() -> void:
		var center := _stick_center()
		draw_circle(center, 112.0, Color(0.02, 0.05, 0.09, 0.48))
		draw_arc(center, 112.0, 0.0, TAU, 34, Color(0.78, 0.88, 1.0, 0.5), 5.0)
		draw_circle(center + move_vector * 58.0, 44.0, Color(0.93, 0.96, 1.0, 0.78))

	func _draw_buttons() -> void:
		var font := get_theme_default_font()
		for button in _buttons():
			var rect: Rect2 = button["rect"]
			var action: String = str(button["action"])
			var active := (action == "sword" and sword_down) or (action == "shield" and shield_down) or (action == "dash" and dash_down) or (action == "bomb" and bomb_down) or (action == "learn" and learn_down) or (action == "subject" and subject_down)
			draw_rect(rect, Color(0.02, 0.05, 0.09, 0.62), true)
			draw_rect(rect, Color.html("#facc15") if active else Color(0.78, 0.88, 1.0, 0.55), false, 5.0)
			var lines := str(button["label"]).split("\n")
			for i in range(lines.size()):
				draw_string(font, rect.position + Vector2(0.0, 32.0 + float(i) * 27.0), lines[i], HORIZONTAL_ALIGNMENT_CENTER, rect.size.x, 24, Color.html("#f8fafc"))

var tiles: Array = []
var player_pos := Vector2(150.0, 150.0)
var player_hp := 6
var player_max_hp := 6
var stamina := 100.0
var facing := Vector2(0.0, 1.0)
var velocity := Vector2.ZERO
var camera_pos := Vector2.ZERO
var score := 0
var shards := 0
var bombs_left := 2
var mode_learn := true
var lesson_index := 0
var question_index := 0
var learn_hits := 0
var mistakes := 0
var attack_timer := 0.0
var attack_cooldown := 0.0
var dash_timer := 0.0
var dash_cooldown := 0.0
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
var shrines: Array = []
var exit_cell := Vector2i(MAP_W - 4, 3)
var exit_open := false
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
	shards = 0
	bombs_left = 2
	learn_hits = 0
	mistakes = 0
	attack_timer = 0.0
	attack_cooldown = 0.0
	dash_timer = 0.0
	dash_cooldown = 0.0
	hurt_cooldown = 0.0
	won = false
	game_over = false
	exit_open = false
	bombs.clear()
	explosions.clear()
	pickups.clear()
	spawn_objects()
	spawn_enemies()
	setup_shrines()
	message = "Zelda-Lernwald: Hiebe, Schild, Dash, Bomben und echte Schreine im Spielfeld."
	message_timer = 4.0

func make_tile(x: int, y: int) -> int:
	var border: bool = x == 0 or y == 0 or x == MAP_W - 1 or y == MAP_H - 1
	if border:
		return WALL
	if y == 12 or y == 13:
		if x >= 12 and x <= 17:
			return BRIDGE
		return WATER
	if (x == 8 and y > 5 and y < 20) or (x == 25 and y > 3 and y < 22):
		if y % 5 != 0:
			return WALL
	if (x * 11 + y * 7) % 29 == 0 and x > 5 and y > 4 and x < MAP_W - 5:
		return FLOWER
	return FLOOR

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

func spawn_enemies() -> void:
	enemies.clear()
	var starts: Array = [
		Vector2i(13, 4), Vector2i(21, 5), Vector2i(30, 10), Vector2i(7, 21),
		Vector2i(17, 20), Vector2i(26, 23), Vector2i(33, 15),
	]
	for i in range(starts.size()):
		enemies.append({
			"pos": cell_center(starts[i]),
			"hp": 2 + int(i % 3 == 0),
			"kind": "slime" if i % 2 == 0 else "soldier",
			"timer": 0.2 + float(i) * 0.07,
			"hit": 0.0,
		})
	enemies.append({"pos": cell_center(Vector2i(MAP_W - 6, 5)), "hp": 9, "kind": "guardian", "timer": 0.2, "hit": 0.0})

func setup_shrines() -> void:
	shrines.clear()
	var q: Dictionary = current_question()
	var cells: Array = [Vector2i(6, 23), Vector2i(19, 4), Vector2i(31, 22)]
	for i in range(cells.size()):
		var answers: Array = q["answers"]
		shrines.append({"cell": cells[i], "label": answers[i], "index": i, "armed": true})

func current_question() -> Dictionary:
	var bank: Array = QUESTIONS_WORD
	var lesson := str(LESSONS[lesson_index])
	if lesson == "MATHE":
		bank = QUESTIONS_MATH
	elif lesson == "SATZ":
		bank = QUESTIONS_SENTENCE
	elif lesson == "LESEN":
		bank = QUESTIONS_READING
	return bank[question_index % bank.size()]

func cycle_lesson() -> void:
	lesson_index = (lesson_index + 1) % LESSONS.size()
	question_index = 0
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
	update_bombs(delta)
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
	if dash_timer > 0.0:
		dash_timer -= delta
	if dash_cooldown > 0.0:
		dash_cooldown -= delta
	if hurt_cooldown > 0.0:
		hurt_cooldown -= delta
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
	attack_timer = 0.16
	attack_cooldown = 0.32
	hit_attack()

func attack_rect() -> Rect2:
	var center: Vector2 = player_pos + facing.normalized() * 34.0
	if absf(facing.x) > absf(facing.y):
		return Rect2(center - Vector2(34.0, 23.0), Vector2(68.0, 46.0))
	return Rect2(center - Vector2(23.0, 34.0), Vector2(46.0, 68.0))

func hit_attack() -> void:
	var hit_rect: Rect2 = attack_rect()
	for i in range(enemies.size() - 1, -1, -1):
		var enemy: Dictionary = enemies[i]
		var pos: Vector2 = enemy["pos"]
		if hit_rect.has_point(pos):
			enemy["hp"] = int(enemy["hp"]) - 1
			enemy["hit"] = 0.16
			score += 25
			var push: Vector2 = (pos - player_pos).normalized() * 18.0
			enemy["pos"] = pos + push
			if int(enemy["hp"]) <= 0:
				defeat_enemy(enemy)
				enemies.remove_at(i)
			else:
				enemies[i] = enemy
	hit_objects(hit_rect, 1)
	if mode_learn:
		check_shrine_hit(hit_rect)

func start_dash() -> void:
	if dash_cooldown > 0.0 or stamina < 28.0 or shield_active:
		return
	stamina -= 28.0
	dash_timer = 0.18
	dash_cooldown = 0.62
	hurt_cooldown = maxf(hurt_cooldown, 0.2)

func place_bomb() -> void:
	if bombs_left <= 0:
		return
	bombs_left -= 1
	var cell: Vector2i = world_to_cell(player_pos)
	bombs.append({"cell": cell, "timer": 1.35})
	message = "Bombe gelegt."
	message_timer = 1.0

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
		for i in range(enemies.size() - 1, -1, -1):
			var enemy: Dictionary = enemies[i]
			if rect.has_point(enemy["pos"]):
				enemy["hp"] = int(enemy["hp"]) - 2
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
		var to_player: Vector2 = player_pos - pos
		var distance: float = to_player.length()
		var speed: float = 54.0
		if str(enemy["kind"]) == "soldier":
			speed = 68.0
		elif str(enemy["kind"]) == "guardian":
			speed = 42.0
		var dir := Vector2.ZERO
		if distance < 270.0 and distance > 4.0:
			dir = to_player.normalized()
		else:
			var timer: float = float(enemy["timer"]) + delta
			dir = Vector2(sin(timer * 1.7 + float(i)), cos(timer * 1.3 + float(i) * 0.4)).normalized()
			enemy["timer"] = timer
		var next_pos: Vector2 = pos + dir * speed * delta
		if not collides_world(next_pos, 12.0):
			enemy["pos"] = next_pos
		if float(enemy["hit"]) > 0.0:
			enemy["hit"] = float(enemy["hit"]) - delta
		if distance < 22.0 and hurt_cooldown <= 0.0:
			var block_ok: bool = shield_active and facing.dot((pos - player_pos).normalized()) > 0.25
			if block_ok:
				stamina = maxf(0.0, stamina - 18.0)
				message = "Geblockt."
				message_timer = 0.8
			else:
				hurt_player(1 if str(enemy["kind"]) != "guardian" else 2, "Treffer.")
		enemies[i] = enemy

func defeat_enemy(enemy: Dictionary) -> void:
	var pos: Vector2 = enemy["pos"]
	score += 120 if str(enemy["kind"]) != "guardian" else 900
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
			score += 20
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
			score += 350
			message = "Richtig: %s (%d/%d)." % [str(shrine["label"]), learn_hits, LEARN_GOAL]
			question_index += 1
			setup_shrines()
		else:
			mistakes += 1
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
			score += 180
		else:
			score += 40
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
		score += 1200
		message = "Sternentor offen. Abenteuer geschafft! R startet neu."
		message_timer = 99.0

func hurt_player(amount: int, text: String) -> void:
	if hurt_cooldown > 0.0:
		return
	player_hp -= amount
	hurt_cooldown = 0.95
	message = text
	message_timer = 1.6
	if player_hp <= 0:
		game_over = true
		message = "Game Over. R startet neu."
		message_timer = 99.0

func update_camera() -> void:
	var world_size: Vector2 = Vector2(float(MAP_W) * TILE_SIZE, float(MAP_H) * TILE_SIZE)
	var target: Vector2 = player_pos - size * 0.5
	camera_pos.x = clampf(target.x, 0.0, maxf(0.0, world_size.x - size.x))
	camera_pos.y = clampf(target.y, 0.0, maxf(0.0, world_size.y - size.y))

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
	return Rect2(rect.position - camera_pos + world_offset(), rect.size)

func world_pos_to_screen(pos: Vector2) -> Vector2:
	return pos - camera_pos + world_offset()

func world_offset() -> Vector2:
	var world_size: Vector2 = Vector2(float(MAP_W) * TILE_SIZE, float(MAP_H) * TILE_SIZE)
	return Vector2(maxf(0.0, (size.x - world_size.x) * 0.5), maxf(0.0, (size.y - world_size.y) * 0.5))

func _draw() -> void:
	draw_background()
	draw_map()
	draw_exit()
	draw_objects()
	draw_shrines()
	draw_bombs()
	draw_explosions()
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
	var start_x: int = maxi(0, int(floor(camera_pos.x / TILE_SIZE)) - 1)
	var start_y: int = maxi(0, int(floor(camera_pos.y / TILE_SIZE)) - 1)
	var end_x: int = mini(MAP_W - 1, int(ceil((camera_pos.x + size.x) / TILE_SIZE)) + 1)
	var end_y: int = mini(MAP_H - 1, int(ceil((camera_pos.y + size.y) / TILE_SIZE)) + 1)
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
	draw_string(get_theme_default_font(), rect.position + Vector2(8.0, 28.0), "TOR", HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.html("#f8fafc"))

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

func draw_shrines() -> void:
	if not mode_learn:
		return
	var font := get_theme_default_font()
	for shrine in shrines:
		var item: Dictionary = shrine
		var rect: Rect2 = world_rect_to_screen(cell_world_rect(item["cell"]).grow(-6.0))
		var color: Color = Color.html("#38bdf8") if bool(item["armed"]) else Color.html("#475569")
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
	for enemy in enemies:
		var item: Dictionary = enemy
		var pos: Vector2 = world_pos_to_screen(item["pos"])
		var kind: String = str(item["kind"])
		var color: Color = Color.html("#ef4444")
		var size_px: float = 24.0
		if kind == "soldier":
			color = Color.html("#a855f7")
		elif kind == "guardian":
			color = Color.html("#7f1d1d")
			size_px = 40.0
		if float(item["hit"]) > 0.0:
			color = Color.html("#f8fafc")
		draw_rect(Rect2(pos - Vector2(size_px * 0.5, size_px * 0.5), Vector2(size_px, size_px)), Color(0.0, 0.0, 0.0, 0.28), true)
		draw_rect(Rect2(pos - Vector2(size_px * 0.45, size_px * 0.55), Vector2(size_px * 0.9, size_px * 0.95)), color, true)
		draw_rect(Rect2(pos + Vector2(-7.0, -6.0), Vector2(5.0, 5.0)), Color.html("#f8fafc"), true)
		draw_rect(Rect2(pos + Vector2(4.0, -6.0), Vector2(5.0, 5.0)), Color.html("#f8fafc"), true)
		draw_rect(Rect2(pos + Vector2(-8.0, 8.0), Vector2(16.0, 4.0)), Color.html("#020617"), true)

func draw_player() -> void:
	var pos: Vector2 = world_pos_to_screen(player_pos)
	var blink := hurt_cooldown > 0.0 and int(hurt_cooldown * 12.0) % 2 != 0
	var tunic: Color = Color.html("#22c55e") if not blink else Color.html("#f8fafc")
	var skin := Color.html("#fde68a")
	draw_rect(Rect2(pos - Vector2(13.0, 9.0), Vector2(26.0, 28.0)), Color(0.0, 0.0, 0.0, 0.24), true)
	draw_rect(Rect2(pos - Vector2(12.0, 8.0), Vector2(24.0, 26.0)), tunic, true)
	draw_rect(Rect2(pos - Vector2(9.0, 23.0), Vector2(7.0, 7.0)), Color.html("#78350f"), true)
	draw_rect(Rect2(pos + Vector2(3.0, 23.0), Vector2(7.0, 7.0)), Color.html("#78350f"), true)
	draw_rect(Rect2(pos - Vector2(10.0, 25.0), Vector2(20.0, 14.0)), skin, true)
	draw_rect(Rect2(pos - Vector2(7.0, 31.0), Vector2(14.0, 5.0)), Color.html("#16a34a"), true)
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
	var e := origin + Vector2(float(exit_cell.x) * scale.x, float(exit_cell.y) * scale.y)
	draw_rect(Rect2(e, Vector2(5.0, 5.0)), Color.html("#facc15") if exit_open else Color.html("#94a3b8"), true)

func draw_hud() -> void:
	var font := get_theme_default_font()
	draw_rect(Rect2(12.0, 10.0, minf(size.x - 24.0, 690.0), 98.0), Color(0.02, 0.05, 0.09, 0.74), true)
	draw_string(font, Vector2(24.0, 34.0), "FASKA ZELDA PRO - 16-BIT LERNWALD", HORIZONTAL_ALIGNMENT_LEFT, -1, 21, Color.html("#facc15"))
	draw_string(font, Vector2(24.0, 59.0), "HP %d/%d  Ausdauer %d  Splitter %d/3  Bomben %d  Score %d" % [player_hp, player_max_hp, int(stamina), shards, bombs_left, score], HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.html("#f8fafc"))
	draw_string(font, Vector2(24.0, 81.0), "Mode %s  Fach %s  Lernziel %d/%d  Fehler %d" % ["Learncade" if mode_learn else "Normal", str(LESSONS[lesson_index]), learn_hits, LEARN_GOAL, mistakes], HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color.html("#cbd5e1"))
	draw_string(font, Vector2(24.0, 101.0), "WASD bewegen  J Schwert  K Schild  Space Dash  B Bombe  L Lernen  C Fach", HORIZONTAL_ALIGNMENT_LEFT, -1, 12, Color.html("#fde68a"))
	if mode_learn:
		var q: Dictionary = current_question()
		draw_rect(Rect2(12.0, 118.0, minf(size.x - 24.0, 720.0), 34.0), Color(0.02, 0.05, 0.09, 0.74), true)
		draw_string(font, Vector2(24.0, 141.0), str(q["prompt"]), HORIZONTAL_ALIGNMENT_LEFT, minf(size.x - 48.0, 696.0), 16, Color.html("#f8fafc"))
	if message_timer > 0.0:
		draw_rect(Rect2(12.0, size.y - 42.0, minf(size.x - 24.0, 720.0), 29.0), Color(0.02, 0.05, 0.09, 0.74), true)
		draw_string(font, Vector2(24.0, size.y - 20.0), message, HORIZONTAL_ALIGNMENT_LEFT, minf(size.x - 48.0, 696.0), 14, Color.html("#f8fafc"))
