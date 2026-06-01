extends Control

const BASE_Y := 636.0
const BASE_X := 640.0
const GOAL_HITS := 18
const CARD_HEIGHT := 48.0
const LANES := [150.0, 300.0, 450.0, 600.0, 750.0, 900.0, 1050.0, 1200.0]
const MODE_SEQUENCE := ["TYPE", "NOMEN", "VERB", "ADJEKTIV", "KOMPOSITUM", "MATH", "LUECKE"]

const WORDS := [
	{"word": "HAUS", "type": "NOMEN", "clue": "ein Ding"},
	{"word": "MAUS", "type": "NOMEN", "clue": "reimt sich auf Haus"},
	{"word": "LAMPE", "type": "NOMEN", "clue": "ein Ding"},
	{"word": "SCHULE", "type": "NOMEN", "clue": "ein Ort"},
	{"word": "WOLKE", "type": "NOMEN", "clue": "am Himmel"},
	{"word": "FENSTER", "type": "NOMEN", "clue": "ein Ding"},
	{"word": "RENNEN", "type": "VERB", "clue": "etwas tun"},
	{"word": "LESEN", "type": "VERB", "clue": "etwas tun"},
	{"word": "SPRINGEN", "type": "VERB", "clue": "etwas tun"},
	{"word": "MALEN", "type": "VERB", "clue": "etwas tun"},
	{"word": "SUCHEN", "type": "VERB", "clue": "etwas tun"},
	{"word": "LACHEN", "type": "VERB", "clue": "etwas tun"},
	{"word": "MUTIG", "type": "ADJEKTIV", "clue": "wie jemand ist"},
	{"word": "HELL", "type": "ADJEKTIV", "clue": "wie etwas ist"},
	{"word": "LEISE", "type": "ADJEKTIV", "clue": "wie etwas ist"},
	{"word": "KALT", "type": "ADJEKTIV", "clue": "wie etwas ist"},
	{"word": "BUNT", "type": "ADJEKTIV", "clue": "wie etwas ist"},
	{"word": "SCHNELL", "type": "ADJEKTIV", "clue": "wie etwas ist"},
	{"word": "BAUMHAUS", "type": "KOMPOSITUM", "clue": "Baum + Haus"},
	{"word": "TURGRIFF", "type": "KOMPOSITUM", "clue": "Tuer + Griff"},
	{"word": "SONNENBLUME", "type": "KOMPOSITUM", "clue": "Sonne + Blume"},
	{"word": "BILDERBUCH", "type": "KOMPOSITUM", "clue": "Bilder + Buch"},
]

const MATH_TASKS := [
	{"display": "7+5", "answer": "12"},
	{"display": "9+4", "answer": "13"},
	{"display": "15-6", "answer": "9"},
	{"display": "3x4", "answer": "12"},
	{"display": "18-9", "answer": "9"},
	{"display": "6+8", "answer": "14"},
]

const GAP_TASKS := [
	{"display": "H?ND", "answer": "HUND", "clue": "u fehlt"},
	{"display": "SCH?LE", "answer": "SCHULE", "clue": "u fehlt"},
	{"display": "M?US", "answer": "MAUS", "clue": "a fehlt"},
	{"display": "L?SEN", "answer": "LESEN", "clue": "e fehlt"},
	{"display": "B?NT", "answer": "BUNT", "clue": "u fehlt"},
]

var enemies := []
var particles := []
var lasers := []
var current_input := ""
var selected_enemy_id := -1
var score := 0
var hp := 6
var combo := 0
var streak := 0
var mistakes := 0
var level := 1
var hits := 0
var spawn_timer := 0.0
var mode_timer := 0.0
var mode_index := 0
var learn_mode := true
var next_id := 1
var message := "Tippe das Wort, bevor es die Basis erreicht."
var message_timer := 4.0
var shake := 0.0
var finished := false

func _ready() -> void:
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	set_process(true)
	for i in range(5):
		_spawn_enemy(i * 0.4)

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		_select_enemy_at(event.position)
		return
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_R:
			get_tree().reload_current_scene()
		elif event.keycode == KEY_L:
			learn_mode = not learn_mode
			mode_timer = 0.0
			_set_message("Lernmodus aktiv" if learn_mode else "Nur Tippen")
		elif event.keycode == KEY_BACKSPACE:
			if current_input.length() > 0:
				current_input = current_input.left(current_input.length() - 1)
		elif event.keycode == KEY_ENTER or event.keycode == KEY_KP_ENTER:
			_try_resolve_input(true)
		else:
			var label := _key_to_token(event)
			if label.length() == 1 and ((label >= "A" and label <= "Z") or (label >= "0" and label <= "9")):
				current_input += label
				_try_resolve_input(false)

func _process(delta: float) -> void:
	if finished:
		queue_redraw()
		return
	spawn_timer += delta
	mode_timer += delta
	message_timer = maxf(0.0, message_timer - delta)
	shake = maxf(0.0, shake - delta * 7.0)
	_update_mode()
	_update_spawns()
	_update_enemies(delta)
	_update_fx(delta)
	queue_redraw()

func _key_to_token(event: InputEventKey) -> String:
	if event.unicode >= 48 and event.unicode <= 57:
		return String.chr(event.unicode)
	if event.unicode >= 65 and event.unicode <= 90:
		return String.chr(event.unicode)
	if event.unicode >= 97 and event.unicode <= 122:
		return String.chr(event.unicode).to_upper()
	var key_map := {
		KEY_A: "A", KEY_B: "B", KEY_C: "C", KEY_D: "D", KEY_E: "E", KEY_F: "F",
		KEY_G: "G", KEY_H: "H", KEY_I: "I", KEY_J: "J", KEY_K: "K", KEY_L: "L",
		KEY_M: "M", KEY_N: "N", KEY_O: "O", KEY_P: "P", KEY_Q: "Q", KEY_R: "R",
		KEY_S: "S", KEY_T: "T", KEY_U: "U", KEY_V: "V", KEY_W: "W", KEY_X: "X",
		KEY_Y: "Y", KEY_Z: "Z", KEY_0: "0", KEY_1: "1", KEY_2: "2", KEY_3: "3",
		KEY_4: "4", KEY_5: "5", KEY_6: "6", KEY_7: "7", KEY_8: "8", KEY_9: "9",
		KEY_KP_0: "0", KEY_KP_1: "1", KEY_KP_2: "2", KEY_KP_3: "3", KEY_KP_4: "4",
		KEY_KP_5: "5", KEY_KP_6: "6", KEY_KP_7: "7", KEY_KP_8: "8", KEY_KP_9: "9",
	}
	return key_map.get(event.keycode, "")

func _update_mode() -> void:
	if not learn_mode:
		mode_index = 0
		return
	if mode_timer > 28.0 or (hits > 0 and hits % 4 == 0 and mode_timer > 9.0):
		mode_index = (mode_index + 1) % MODE_SEQUENCE.size()
		mode_timer = 0.0
		current_input = ""
		selected_enemy_id = -1
		_clear_targeting()
		_set_message(_mode_prompt())

func _update_spawns() -> void:
	var interval := maxf(0.85, 2.15 - level * 0.12)
	if spawn_timer >= interval:
		spawn_timer = 0.0
		_spawn_enemy(0.0)
		if enemies.size() < 4:
			_spawn_enemy(0.25)

func _update_enemies(delta: float) -> void:
	for enemy in enemies:
		enemy["y"] += enemy["speed"] * delta
		enemy["pulse"] += delta
		if enemy["y"] > BASE_Y - 28.0:
			hp -= 1
			combo = 0
			current_input = ""
			if enemy["id"] == selected_enemy_id:
				selected_enemy_id = -1
			_spawn_particles(Vector2(enemy["x"], enemy["y"]), Color(1.0, 0.15, 0.12), 10)
			enemy["dead"] = true
			_set_message("Zu spaet: %s" % enemy["answer"])
			shake = 1.0
	enemies = enemies.filter(func(enemy): return not enemy.get("dead", false))
	if hp <= 0:
		hp = 6
		score = max(0, score - 250)
		level = max(1, level - 1)
		hits = max(0, hits - 3)
		enemies.clear()
		current_input = ""
		selected_enemy_id = -1
		for i in range(4):
			_spawn_enemy(i * 0.35)
		_set_message("Basis neu geladen. Schwierigkeit etwas runter.")

func _update_fx(delta: float) -> void:
	for particle in particles:
		particle["pos"] += particle["vel"] * delta
		particle["life"] -= delta
	for laser in lasers:
		laser["life"] -= delta
	particles = particles.filter(func(p): return p["life"] > 0.0)
	lasers = lasers.filter(func(l): return l["life"] > 0.0)

func _try_resolve_input(force: bool) -> void:
	if current_input == "":
		_clear_targeting()
		return
	var matching := _matching_enemies()
	if matching.is_empty():
		var fuzzy_target := _fuzzy_match_enemy(current_input)
		if not fuzzy_target.is_empty():
			_target_enemy(fuzzy_target)
			var answer_text: String = fuzzy_target["answer"]
			var needed := answer_text.length() - 1
			if needed < 3:
				needed = 3
			if current_input.length() >= needed:
				_hit_enemy(fuzzy_target)
			else:
				_set_message("Fast richtig: %s passt zu %s" % [current_input, answer_text])
			return
		if current_input.length() > 1:
			var last_char := current_input.substr(current_input.length() - 1, 1)
			current_input = last_char
			matching = _matching_enemies()
			if not matching.is_empty():
				matching.sort_custom(func(a, b): return a["y"] > b["y"])
				_target_enemy(matching[0])
				_set_message("Neu angesetzt mit %s" % current_input)
				return
		if force or current_input.length() >= 3:
			_register_mistake("Kein Ziel beginnt mit %s" % current_input)
			current_input = ""
		return
	matching.sort_custom(func(a, b): return a["y"] > b["y"])
	var target: Dictionary = matching[0]
	_target_enemy(target)
	if current_input == target["answer"]:
		_hit_enemy(target)

func _matching_enemies() -> Array:
	var result := []
	var selected := _selected_enemy()
	if not selected.is_empty() and selected["answer"].begins_with(current_input):
		result.append(selected)
	for enemy in enemies:
		if enemy["id"] != selected_enemy_id and enemy["answer"].begins_with(current_input):
			result.append(enemy)
	return result

func _selected_enemy() -> Dictionary:
	if selected_enemy_id < 0:
		return {}
	for enemy in enemies:
		if enemy["id"] == selected_enemy_id:
			return enemy
	return {}

func _fuzzy_match_enemy(text: String) -> Dictionary:
	if text.length() < 2:
		return {}
	var selected := _selected_enemy()
	if not selected.is_empty() and _is_subsequence(text, selected["answer"]):
		return selected
	var best := {}
	for enemy in enemies:
		if _is_subsequence(text, enemy["answer"]):
			if best.is_empty() or enemy["y"] > best["y"]:
				best = enemy
	return best

func _is_subsequence(text: String, answer: String) -> bool:
	var typed := text.to_upper()
	var target := answer.to_upper()
	var typed_index := 0
	for i in range(target.length()):
		if typed_index < typed.length() and typed.substr(typed_index, 1) == target.substr(i, 1):
			typed_index += 1
	return typed_index == typed.length()

func _target_enemy(target: Dictionary) -> void:
	for enemy in enemies:
		enemy["targeted"] = enemy["id"] == target["id"]

func _clear_targeting() -> void:
	for enemy in enemies:
		enemy["targeted"] = false

func _select_enemy_at(point: Vector2) -> void:
	for i in range(enemies.size() - 1, -1, -1):
		var enemy: Dictionary = enemies[i]
		if _enemy_rect(enemy).has_point(point):
			selected_enemy_id = enemy["id"]
			current_input = ""
			_target_enemy(enemy)
			_set_message("Ziel gewaehlt: tippe %s" % enemy["answer"])
			return
	selected_enemy_id = -1
	_clear_targeting()

func _enemy_rect(enemy: Dictionary) -> Rect2:
	var pos := Vector2(enemy["x"], enemy["y"])
	var width := maxf(86.0, enemy["display"].length() * 18.0 + 42.0)
	return Rect2(pos - Vector2(width * 0.5, CARD_HEIGHT * 0.5), Vector2(width, CARD_HEIGHT))

func _hit_enemy(target: Dictionary) -> void:
	var correct_for_mode := _is_correct_target(target)
	var target_pos := Vector2(target["x"], target["y"])
	lasers.append({"from": Vector2(BASE_X, BASE_Y + 12), "to": target_pos, "life": 0.14, "good": correct_for_mode})
	target["dead"] = true
	if correct_for_mode:
		combo += 1
		streak += 1
		hits += 1
		score += 80 + target["answer"].length() * 12 + combo * 8
		level = 1 + int(hits / 5)
		_spawn_particles(target_pos, Color(0.18, 0.9, 1.0), 16)
		_set_message("Treffer: %s  Combo %d" % [target["answer"], combo])
		if hits >= GOAL_HITS:
			finished = true
			score += 800
			_set_message("Lernrunde geschafft. Score %d" % score)
	else:
		_register_mistake("Das war kein passendes %s: %s" % [_current_mode(), target["display"]])
		_spawn_particles(target_pos, Color(1.0, 0.25, 0.15), 12)
	enemies = enemies.filter(func(enemy): return not enemy.get("dead", false))
	current_input = ""
	if target["id"] == selected_enemy_id:
		selected_enemy_id = -1
	if enemies.size() < 3 and not finished:
		_spawn_enemy(0.0)

func _is_correct_target(enemy: Dictionary) -> bool:
	var mode := _current_mode()
	if mode == "TYPE":
		return true
	if mode == "MATH" or mode == "LUECKE":
		return enemy["mode"] == mode
	return enemy["kind"] == mode

func _register_mistake(text: String) -> void:
	mistakes += 1
	combo = 0
	streak = 0
	hp = max(1, hp - 1)
	shake = 1.2
	_set_message(text)

func _spawn_enemy(delay: float) -> void:
	var mode := _current_mode()
	var lane_index := (next_id * 3 + level) % LANES.size()
	var x: float = LANES[lane_index]
	var enemy: Dictionary = _make_enemy_payload(mode)
	enemy["id"] = next_id
	enemy["x"] = x
	enemy["y"] = -60.0 - delay * 160.0
	enemy["speed"] = 34.0 + level * 4.8 + (0.0 if enemy["target"] else 7.0)
	enemy["pulse"] = float(next_id) * 0.31
	enemy["targeted"] = false
	next_id += 1
	enemies.append(enemy)

func _make_enemy_payload(mode: String) -> Dictionary:
	if mode == "MATH":
		var task: Dictionary = MATH_TASKS[(next_id + level) % MATH_TASKS.size()]
		return {
			"display": task["display"],
			"answer": task["answer"],
			"kind": "MATH",
			"mode": "MATH",
			"target": true,
			"clue": "Rechne und tippe die Zahl.",
		}
	if mode == "LUECKE":
		var gap: Dictionary = GAP_TASKS[(next_id + hits) % GAP_TASKS.size()]
		return {
			"display": gap["display"],
			"answer": gap["answer"],
			"kind": "LUECKE",
			"mode": "LUECKE",
			"target": true,
			"clue": gap["clue"],
		}
	var word: Dictionary = WORDS[(next_id * 5 + level + hits) % WORDS.size()]
	if mode != "TYPE" and next_id % 3 == 0:
		word = _word_not_kind(mode)
	return {
		"display": word["word"],
		"answer": word["word"],
		"kind": word["type"],
		"mode": "WORD",
		"target": mode == "TYPE" or word["type"] == mode,
		"clue": word["clue"],
	}

func _word_not_kind(kind: String) -> Dictionary:
	for i in range(WORDS.size()):
		var candidate: Dictionary = WORDS[(next_id + i * 2) % WORDS.size()]
		if candidate["type"] != kind:
			return candidate
	return WORDS[0]

func _current_mode() -> String:
	return MODE_SEQUENCE[mode_index] if learn_mode else "TYPE"

func _mode_prompt() -> String:
	var mode := _current_mode()
	if mode == "TYPE":
		return "Tippe die ganzen Woerter, bevor sie die Basis erreichen."
	if mode == "MATH":
		return "Mathe-Blaster: Tippe das Ergebnis."
	if mode == "LUECKE":
		return "Lesen: Ergaenze das Wort und tippe es vollstaendig."
	return "Wortarten-Blaster: Tippe nur %s." % mode

func _set_message(text: String) -> void:
	message = text
	message_timer = 3.0

func _spawn_particles(pos: Vector2, color: Color, count: int) -> void:
	for i in range(count):
		var angle := (float(i) / maxf(1.0, count)) * TAU
		var speed := 50.0 + float((i * 37) % 80)
		particles.append({
			"pos": pos,
			"vel": Vector2(cos(angle), sin(angle)) * speed,
			"life": 0.45 + float(i % 4) * 0.08,
			"color": color,
		})

func _draw() -> void:
	var screen := get_viewport_rect().size
	var offset := Vector2.ZERO
	if shake > 0.0:
		offset = Vector2(sin(Time.get_ticks_msec() * 0.07), cos(Time.get_ticks_msec() * 0.05)) * shake * 8.0
	draw_set_transform(offset)
	_draw_background(screen)
	_draw_enemies()
	_draw_lasers()
	_draw_particles()
	_draw_base(screen)
	draw_set_transform(Vector2.ZERO)
	_draw_hud(screen)
	_draw_input_bar(screen)

func _draw_background(screen: Vector2) -> void:
	draw_rect(Rect2(Vector2.ZERO, screen), Color(0.025, 0.035, 0.07))
	for i in range(14):
		var y := fmod(Time.get_ticks_msec() * 0.025 + i * 74.0, screen.y + 80.0) - 80.0
		draw_line(Vector2(0, y), Vector2(screen.x, y + 40.0), Color(0.08, 0.12, 0.2, 0.55), 2.0)
	for lane in LANES:
		draw_line(Vector2(lane, 92), Vector2(lane, BASE_Y), Color(0.12, 0.2, 0.32, 0.55), 1.0)

func _draw_enemies() -> void:
	var font := get_theme_default_font()
	for enemy in enemies:
		var pos := Vector2(enemy["x"], enemy["y"])
		var rect := _enemy_rect(enemy)
		var width := rect.size.x
		var good := _is_correct_target(enemy)
		var fill := Color(0.13, 0.22, 0.42, 0.96) if good else Color(0.31, 0.18, 0.19, 0.96)
		if enemy["targeted"] or enemy["id"] == selected_enemy_id:
			fill = Color(0.12, 0.55, 0.78, 0.98)
		draw_rect(rect, fill)
		if enemy["id"] == selected_enemy_id:
			draw_rect(rect.grow(5.0), Color(1.0, 0.87, 0.26, 0.72), false, 3.0)
		draw_rect(rect, Color(0.78, 0.92, 1.0, 0.72), false, 2.0)
		var answer: String = enemy["answer"]
		var typed_len := 0
		if answer.begins_with(current_input):
			typed_len = current_input.length()
		elif _is_subsequence(current_input, answer):
			typed_len = min(current_input.length(), answer.length())
		var display: String = enemy["display"]
		draw_string(font, pos + Vector2(-width * 0.5 + 12.0, 7.0), display, HORIZONTAL_ALIGNMENT_LEFT, width - 24.0, 23, Color.WHITE)
		if typed_len > 0:
			draw_rect(Rect2(rect.position + Vector2(0, rect.size.y - 6.0), Vector2(rect.size.x * float(typed_len) / maxf(1.0, answer.length()), 6.0)), Color(0.24, 0.95, 0.95))
		draw_string(font, pos + Vector2(-width * 0.5 + 12.0, -27.0), enemy["kind"], HORIZONTAL_ALIGNMENT_LEFT, width - 24.0, 11, Color(0.82, 0.92, 1.0))

func _draw_lasers() -> void:
	for laser in lasers:
		var color := Color(0.20, 0.95, 1.0, laser["life"] * 5.0) if laser["good"] else Color(1.0, 0.22, 0.15, laser["life"] * 5.0)
		draw_line(laser["from"], laser["to"], color, 5.0)
		draw_circle(laser["to"], 18.0, Color(color.r, color.g, color.b, 0.22))

func _draw_particles() -> void:
	for particle in particles:
		var c: Color = particle["color"]
		c.a = minf(1.0, particle["life"] * 2.0)
		draw_circle(particle["pos"], 4.0 + particle["life"] * 9.0, c)

func _draw_base(screen: Vector2) -> void:
	var font := get_theme_default_font()
	draw_rect(Rect2(0, BASE_Y, screen.x, 84), Color(0.04, 0.08, 0.12))
	draw_line(Vector2(0, BASE_Y), Vector2(screen.x, BASE_Y), Color(0.3, 0.85, 1.0), 4.0)
	draw_circle(Vector2(BASE_X, BASE_Y + 20), 34.0, Color(0.18, 0.70, 0.92))
	draw_string(font, Vector2(BASE_X - 50.0, BASE_Y + 30), "BASIS", HORIZONTAL_ALIGNMENT_CENTER, 100.0, 14, Color.WHITE)

func _draw_hud(screen: Vector2) -> void:
	var font := get_theme_default_font()
	draw_rect(Rect2(10, 10, 430, 118), Color(0.02, 0.03, 0.06, 0.78))
	draw_string(font, Vector2(24, 34), "FASKA TYPE HERO - WORD BLASTER", HORIZONTAL_ALIGNMENT_LEFT, 400, 18, Color(1.0, 0.92, 0.64))
	draw_string(font, Vector2(24, 60), "HP %d/6  Score %d  Level %d  Combo %d" % [hp, score, level, combo], HORIZONTAL_ALIGNMENT_LEFT, 400, 14, Color.WHITE)
	draw_string(font, Vector2(24, 84), "Lernziel %d/%d  Fehler %d  Mode %s" % [hits, GOAL_HITS, mistakes, _current_mode()], HORIZONTAL_ALIGNMENT_LEFT, 400, 14, Color.WHITE)
	draw_rect(Rect2(24, 98, 360, 10), Color(0.13, 0.16, 0.22))
	draw_rect(Rect2(24, 98, 360.0 * float(hits) / GOAL_HITS, 10), Color(0.22, 0.85, 0.62))
	draw_rect(Rect2(screen.x * 0.5 - 330, 14, 660, 54), Color(0.02, 0.03, 0.06, 0.56))
	draw_string(font, Vector2(screen.x * 0.5 - 310, 48), _mode_prompt(), HORIZONTAL_ALIGNMENT_CENTER, 620, 17, Color(0.95, 0.98, 1.0))
	if message_timer > 0.0:
		draw_string(font, Vector2(screen.x * 0.5 - 310, 86), message, HORIZONTAL_ALIGNMENT_CENTER, 620, 15, Color(1.0, 0.90, 0.55))
	if finished:
		draw_rect(Rect2(Vector2.ZERO, screen), Color(0.0, 0.0, 0.0, 0.64))
		draw_string(font, Vector2(screen.x * 0.5 - 320, screen.y * 0.5 - 20), "LERNRUNDE GESCHAFFT - SCORE %d" % score, HORIZONTAL_ALIGNMENT_CENTER, 640, 30, Color(1.0, 0.93, 0.55))
		draw_string(font, Vector2(screen.x * 0.5 - 260, screen.y * 0.5 + 24), "R fuer Neustart", HORIZONTAL_ALIGNMENT_CENTER, 520, 18, Color.WHITE)

func _draw_input_bar(screen: Vector2) -> void:
	var font := get_theme_default_font()
	draw_rect(Rect2(screen.x * 0.5 - 210, screen.y - 62, 420, 44), Color(0.02, 0.03, 0.06, 0.82))
	draw_rect(Rect2(screen.x * 0.5 - 210, screen.y - 62, 420, 44), Color(0.55, 0.72, 0.9, 0.5), false, 2.0)
	var text := current_input if current_input != "" else "tippe..."
	var color := Color.WHITE if current_input != "" else Color(0.55, 0.65, 0.75)
	draw_string(font, Vector2(screen.x * 0.5 - 190, screen.y - 34), text, HORIZONTAL_ALIGNMENT_CENTER, 380, 24, color)
