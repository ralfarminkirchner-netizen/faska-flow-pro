extends Control

const QUESTION_BANK = [
	{
		"subject": "Deutsch",
		"prompt": "Welche Wortart ist markiert?",
		"sentence": "Der Pilot sammelt Energie.",
		"word": "sammelt",
		"answer": "Verb",
		"options": ["Nomen", "Verb", "Adjektiv"]
	},
	{
		"subject": "Deutsch",
		"prompt": "Welche Wortart ist markiert?",
		"sentence": "Die Station blinkt hell.",
		"word": "hell",
		"answer": "Adverb",
		"options": ["Nomen", "Adverb", "Verb"]
	},
	{
		"subject": "Komposita",
		"prompt": "Bilde das zusammengesetzte Wort.",
		"sentence": "Tunnel + Karte",
		"word": "Tunnel + Karte",
		"answer": "Tunnelkarte",
		"options": ["Kartentunnel", "Tunnelkarte", "Tunneltor"]
	},
	{
		"subject": "Mathe",
		"prompt": "Welcher Schild-Code stimmt?",
		"sentence": "18 - 7 = ?",
		"word": "18 - 7",
		"answer": "11",
		"options": ["9", "11", "12"]
	},
	{
		"subject": "Satzbau",
		"prompt": "Welches Wort passt in die Luecke?",
		"sentence": "Der Pilot ___ die Rakete.",
		"word": "___",
		"answer": "startet",
		"options": ["unter", "startet", "schnell"]
	},
	{
		"subject": "Sachkunde",
		"prompt": "Was liefert der Reaktor?",
		"sentence": "Er treibt die Station an.",
		"word": "Reaktor",
		"answer": "Energie",
		"options": ["Energie", "Schnee", "Sand"]
	}
]

const WEAPONS = {
	"laser": {
		"label": "PULSE LASER",
		"heat": 8.0,
		"cooldown": 0.11,
		"speed": 44.0,
		"damage": 13.0,
		"color": Color(1.0, 0.91, 0.26),
		"spread": [-0.08, 0.08]
	},
	"spread": {
		"label": "SCATTER",
		"heat": 15.0,
		"cooldown": 0.22,
		"speed": 38.0,
		"damage": 10.0,
		"color": Color(1.0, 0.43, 0.16),
		"spread": [-0.2, 0.0, 0.2]
	},
	"rail": {
		"label": "RAIL LANCE",
		"heat": 28.0,
		"cooldown": 0.55,
		"speed": 62.0,
		"damage": 38.0,
		"color": Color(0.37, 0.92, 1.0),
		"spread": [0.0]
	}
}

const WEAPON_ORDER = ["laser", "spread", "rail"]
const LANES = [-0.72, 0.0, 0.72]
const MAX_Z := 74.0
const MIN_Z := 2.2
const TUNNEL_RADIUS := 2.55
const PROJECTION_SCALE := 1420.0
const BASE_SPEED := 16.0
const BOOST_SPEED := 26.0

var font
var rng := RandomNumberGenerator.new()
var player := {}
var shots := []
var missiles := []
var entities := []
var particles := []
var floating_text := []
var touch_buttons := {}
var touch_axis := Vector2.ZERO
var touch_pointer := -1
var mode := "Normal"
var current_weapon := "laser"
var weapon_index := 0
var fire_cooldown := 0.0
var spawn_timer := 0.0
var ring_timer := 0.0
var gate_timer := 0.0
var distance := 0.0
var phase := "run"
var boss_spawned := false
var boss_defeated := false
var question_index := 0
var message := ""
var message_timer := 0.0
var shake := 0.0

func _ready() -> void:
	rng.seed = 64023
	font = get_theme_default_font()
	focus_mode = Control.FOCUS_ALL
	mouse_filter = Control.MOUSE_FILTER_STOP
	grab_focus()
	reset_game()

func reset_game() -> void:
	player = {
		"x": 0.0,
		"y": 0.0,
		"vx": 0.0,
		"vy": 0.0,
		"roll": 0.0,
		"shield": 100.0,
		"heat": 0.0,
		"missiles": 5,
		"score": 0,
		"combo": 0,
		"best_combo": 0,
		"rings": 0,
		"gates": 0,
		"kills": 0,
		"boss_hp": 260.0
	}
	shots.clear()
	missiles.clear()
	entities.clear()
	particles.clear()
	floating_text.clear()
	touch_axis = Vector2.ZERO
	touch_pointer = -1
	mode = "Normal"
	current_weapon = "laser"
	weapon_index = 0
	fire_cooldown = 0.0
	spawn_timer = 0.2
	ring_timer = 2.0
	gate_timer = 4.0
	distance = 0.0
	phase = "run"
	boss_spawned = false
	boss_defeated = false
	question_index = 0
	message = "FASKA DESCENT - Godot 4"
	message_timer = 2.2
	shake = 0.0
	for i in range(7):
		spawn_enemy(16.0 + float(i) * 5.2)
	for i in range(3):
		spawn_flow_ring(22.0 + float(i) * 15.0)

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()
	handle_continuous_input(delta)
	if phase == "run":
		update_run(delta)
	update_particles(delta)
	if message_timer > 0.0:
		message_timer -= delta
	if shake > 0.0:
		shake = max(0.0, shake - delta * 12.0)
	queue_redraw()

func handle_continuous_input(delta: float) -> void:
	var axis := Vector2.ZERO
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		axis.x -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		axis.x += 1.0
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		axis.y -= 1.0
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		axis.y += 1.0
	if touch_axis.length() > 0.05:
		axis += touch_axis
	if axis.length() > 1.0:
		axis = axis.normalized()
	var agility := 6.8
	player.vx = lerp(float(player.vx), axis.x * 1.28, min(1.0, delta * agility))
	player.vy = lerp(float(player.vy), axis.y * 1.02, min(1.0, delta * agility))
	player.x = clamp(float(player.x) + float(player.vx) * delta * 1.8, -1.16, 1.16)
	player.y = clamp(float(player.y) + float(player.vy) * delta * 1.42, -0.86, 0.86)
	var roll_input := 0.0
	if Input.is_key_pressed(KEY_Q):
		roll_input -= 1.0
	if Input.is_key_pressed(KEY_E):
		roll_input += 1.0
	player.roll = lerp(float(player.roll), roll_input * 0.72 - float(player.vx) * 0.22, min(1.0, delta * 5.0))
	if (Input.is_key_pressed(KEY_J) or Input.is_key_pressed(KEY_SPACE)) and phase == "run":
		fire_weapon()
	if Input.is_key_pressed(KEY_SHIFT) and phase == "run":
		player.heat = min(100.0, float(player.heat) + delta * 12.0)

func update_run(delta: float) -> void:
	fire_cooldown = max(0.0, fire_cooldown - delta)
	player.heat = max(0.0, float(player.heat) - delta * 25.0)
	var boosted := Input.is_key_pressed(KEY_SHIFT) and float(player.heat) < 96.0
	var speed := BOOST_SPEED if boosted else BASE_SPEED
	distance += speed * delta
	spawn_timer -= delta
	ring_timer -= delta
	gate_timer -= delta
	if spawn_timer <= 0.0:
		spawn_timer = rng.randf_range(0.65, 1.25) if distance < 760.0 else rng.randf_range(0.35, 0.75)
		spawn_enemy(MAX_Z + rng.randf_range(0.0, 14.0))
	if ring_timer <= 0.0:
		ring_timer = rng.randf_range(3.0, 5.4)
		spawn_flow_ring(MAX_Z + 4.0)
	if mode == "Learncade" and gate_timer <= 0.0:
		gate_timer = rng.randf_range(7.0, 10.0)
		spawn_learn_gate(MAX_Z + 6.0)
	if distance > 880.0 and not boss_spawned:
		spawn_boss()
	update_entities(delta, speed)
	update_shots(delta)
	update_missiles(delta)
	if float(player.shield) <= 0.0:
		phase = "over"
		message = "Schiff zerstoert - R fuer Neustart"
		message_timer = 99.0

func spawn_enemy(z_value: float) -> void:
	var pick := rng.randf()
	var kind := "drone"
	var hp := 28.0
	var radius := 0.18
	if pick > 0.78:
		kind = "sentinel"
		hp = 54.0
		radius = 0.24
	elif pick > 0.58:
		kind = "mine"
		hp = 18.0
		radius = 0.2
	var enemy := {
		"kind": kind,
		"x": rng.randf_range(-1.0, 1.0),
		"y": rng.randf_range(-0.72, 0.72),
		"z": z_value,
		"hp": hp,
		"max_hp": hp,
		"radius": radius,
		"phase": rng.randf_range(0.0, TAU),
		"attack": rng.randf_range(0.6, 2.4)
	}
	entities.append(enemy)

func spawn_flow_ring(z_value: float) -> void:
	entities.append({
		"kind": "ring",
		"x": rng.randf_range(-0.85, 0.85),
		"y": rng.randf_range(-0.56, 0.56),
		"z": z_value,
		"radius": 0.34,
		"phase": rng.randf_range(0.0, TAU)
	})

func spawn_pickup(z_value: float) -> void:
	entities.append({
		"kind": "pickup",
		"x": rng.randf_range(-0.9, 0.9),
		"y": rng.randf_range(-0.6, 0.6),
		"z": z_value,
		"radius": 0.2
	})

func spawn_learn_gate(z_value: float) -> void:
	var question = QUESTION_BANK[question_index % QUESTION_BANK.size()]
	question_index += 1
	entities.append({
		"kind": "gate",
		"x": 0.0,
		"y": 0.0,
		"z": z_value,
		"radius": 0.55,
		"question": question
	})
	message = String(question.prompt) + "  " + String(question.sentence)
	message_timer = 5.0

func spawn_boss() -> void:
	boss_spawned = true
	entities.append({
		"kind": "boss",
		"x": 0.0,
		"y": -0.02,
		"z": MAX_Z,
		"hp": float(player.boss_hp),
		"max_hp": float(player.boss_hp),
		"radius": 0.62,
		"phase": 0.0,
		"attack": 1.1
	})
	message = "Bosskern online - Schilde brechen!"
	message_timer = 3.0

func update_entities(delta: float, speed: float) -> void:
	for i in range(entities.size() - 1, -1, -1):
		var e = entities[i]
		var kind := String(e.kind)
		var z_speed := speed
		if kind == "boss":
			z_speed = speed * 0.32
		e.z = float(e.z) - z_speed * delta
		e.phase = float(e.get("phase", 0.0)) + delta
		if kind == "drone":
			e.x = float(e.x) + sin(float(e.phase) * 2.4) * delta * 0.18
		elif kind == "sentinel":
			e.y = float(e.y) + cos(float(e.phase) * 2.0) * delta * 0.12
			e.attack = float(e.attack) - delta
			if float(e.attack) <= 0.0 and float(e.z) < 44.0:
				e.attack = rng.randf_range(1.1, 2.0)
				spawn_bolt(float(e.x), float(e.y), float(e.z) - 0.8)
		elif kind == "boss":
			e.z = max(17.5, float(e.z))
			e.x = sin(float(e.phase) * 0.9) * 0.24
			e.y = cos(float(e.phase) * 1.1) * 0.14
			e.attack = float(e.attack) - delta
			if float(e.attack) <= 0.0:
				e.attack = 0.75
				for offset in [-0.35, 0.0, 0.35]:
					spawn_bolt(float(e.x) + offset, float(e.y), float(e.z) - 1.0)
		if kind == "bolt":
			e.z = float(e.z) - speed * delta * 0.55
			e.x = lerp(float(e.x), float(player.x), delta * 0.62)
			e.y = lerp(float(e.y), float(player.y), delta * 0.62)
		if float(e.z) < MIN_Z:
			resolve_near_entity(e)
			entities.remove_at(i)
		elif float(e.z) > MAX_Z + 24.0:
			entities.remove_at(i)
		else:
			entities[i] = e

func spawn_bolt(x_value: float, y_value: float, z_value: float) -> void:
	entities.append({
		"kind": "bolt",
		"x": x_value,
		"y": y_value,
		"z": z_value,
		"radius": 0.13,
		"phase": 0.0
	})

func resolve_near_entity(e) -> void:
	var kind := String(e.kind)
	if kind == "ring":
		if distance_to_player(e) < 0.42:
			player.rings += 1
			player.score += 220
			player.combo += 1
			add_text("FLOW +" + str(player.combo), Color(0.45, 0.95, 1.0))
			player.heat = max(0.0, float(player.heat) - 18.0)
		else:
			player.combo = 0
	elif kind == "pickup":
		if distance_to_player(e) < 0.36:
			player.shield = min(100.0, float(player.shield) + 16.0)
			player.missiles += 1
			player.score += 160
			add_text("SUPPLY", Color(0.45, 1.0, 0.55))
	elif kind == "gate":
		resolve_gate(e)
	elif kind == "bolt":
		if distance_to_player(e) < 0.32:
			damage_player(8.0, "Treffer")
	elif kind != "boss":
		if distance_to_player(e) < 0.35:
			damage_player(14.0, "Kollision")

func distance_to_player(e) -> float:
	return Vector2(float(e.x) - float(player.x), float(e.y) - float(player.y)).length()

func resolve_gate(gate) -> void:
	var question = gate.question
	var lane_index := 1
	var best := 99.0
	for i in range(LANES.size()):
		var d: float = abs(float(player.x) - float(LANES[i]))
		if d < best:
			best = d
			lane_index = i
	var chosen := String(question.options[lane_index])
	if chosen == String(question.answer):
		player.gates += 1
		player.score += 520
		player.shield = min(100.0, float(player.shield) + 10.0)
		player.combo += 2
		add_text("RICHTIG: " + chosen, Color(0.47, 1.0, 0.58))
		message = "Richtig: " + chosen
	else:
		damage_player(12.0, "Falsch: " + chosen)
		message = "Falsch: " + chosen + " / richtig: " + String(question.answer)
	message_timer = 3.0

func fire_weapon() -> void:
	var weapon = WEAPONS[current_weapon]
	if fire_cooldown > 0.0 or float(player.heat) > 95.0:
		return
	fire_cooldown = float(weapon.cooldown)
	player.heat = min(100.0, float(player.heat) + float(weapon.heat))
	for offset in weapon.spread:
		shots.append({
			"x": float(player.x) + float(offset),
			"y": float(player.y) + 0.05,
			"vx": float(offset) * 0.8,
			"vy": 0.0,
			"z": 1.0,
			"prev_z": 1.0,
			"speed": float(weapon.speed),
			"damage": float(weapon.damage),
			"color": weapon.color,
			"weapon": current_weapon
		})

func fire_missile() -> void:
	if int(player.missiles) <= 0:
		add_text("Keine Raketen", Color(1.0, 0.45, 0.32))
		return
	var target := find_lock_target()
	if target == -1:
		add_text("Kein Lock", Color(0.8, 0.85, 1.0))
		return
	player.missiles -= 1
	missiles.append({
		"x": float(player.x),
		"y": float(player.y),
		"z": 1.0,
		"target_id": target,
		"speed": 34.0,
		"damage": 48.0,
		"life": 2.8
	})
	add_text("LOCK MISSILE", Color(1.0, 0.7, 0.2))

func find_lock_target() -> int:
	var best_index := -1
	var best_score := 999.0
	for i in range(entities.size()):
		var e = entities[i]
		var kind := String(e.kind)
		if kind not in ["drone", "sentinel", "mine", "boss"]:
			continue
		if float(e.z) < 5.0 or float(e.z) > 55.0:
			continue
		var aim := Vector2(float(e.x) - float(player.x), float(e.y) - float(player.y)).length()
		var score := aim + float(e.z) * 0.015
		if score < best_score:
			best_score = score
			best_index = i
	return best_index

func update_shots(delta: float) -> void:
	for i in range(shots.size() - 1, -1, -1):
		var shot = shots[i]
		shot.prev_z = float(shot.z)
		shot.z = float(shot.z) + float(shot.speed) * delta
		shot.x = float(shot.x) + float(shot.vx) * delta
		var hit := find_hit_for_shot(shot)
		if hit != -1:
			apply_hit(hit, float(shot.damage), String(shot.weapon))
			spawn_sparks(project_point(float(shot.x), float(shot.y), min(float(shot.z), MAX_Z)), shot.color)
			shots.remove_at(i)
		elif float(shot.z) > MAX_Z:
			shots.remove_at(i)
		else:
			shots[i] = shot

func update_missiles(delta: float) -> void:
	for i in range(missiles.size() - 1, -1, -1):
		var missile = missiles[i]
		missile.life = float(missile.life) - delta
		var target_index := int(missile.target_id)
		if target_index >= 0 and target_index < entities.size():
			var target = entities[target_index]
			missile.x = lerp(float(missile.x), float(target.x), delta * 3.0)
			missile.y = lerp(float(missile.y), float(target.y), delta * 3.0)
			missile.z = float(missile.z) + float(missile.speed) * delta
			if abs(float(missile.z) - float(target.z)) < 1.8 and Vector2(float(missile.x) - float(target.x), float(missile.y) - float(target.y)).length() < 0.38:
				apply_hit(target_index, float(missile.damage), "missile")
				spawn_sparks(project_point(float(target.x), float(target.y), float(target.z)), Color(1.0, 0.62, 0.12))
				missiles.remove_at(i)
				continue
		else:
			missile.z = float(missile.z) + float(missile.speed) * delta
		if float(missile.z) > MAX_Z or float(missile.life) <= 0.0:
			missiles.remove_at(i)
		else:
			missiles[i] = missile

func find_hit_for_shot(shot) -> int:
	for i in range(entities.size()):
		var e = entities[i]
		var kind := String(e.kind)
		if kind not in ["drone", "sentinel", "mine", "boss"]:
			continue
		var z_hit: bool = abs(float(shot.z) - float(e.z)) < 1.4
		if not z_hit:
			continue
		var radius := float(e.radius) + (0.08 if String(shot.weapon) == "rail" else 0.0)
		if Vector2(float(shot.x) - float(e.x), float(shot.y) - float(e.y)).length() <= radius:
			return i
	return -1

func apply_hit(index: int, damage: float, source: String) -> void:
	if index < 0 or index >= entities.size():
		return
	var e = entities[index]
	e.hp = float(e.hp) - damage
	if source == "rail":
		player.score += 35
	if float(e.hp) <= 0.0:
		var kind := String(e.kind)
		var points := 260
		if kind == "sentinel":
			points = 430
		elif kind == "mine":
			points = 160
		elif kind == "boss":
			points = 2500
		player.score += points + int(player.combo) * 30
		player.combo += 1
		player.best_combo = max(int(player.best_combo), int(player.combo))
		player.kills += 1
		add_text("+" + str(points), Color(1.0, 0.9, 0.35))
		spawn_sparks(project_point(float(e.x), float(e.y), float(e.z)), Color(1.0, 0.42, 0.22))
		if kind == "boss":
			boss_defeated = true
			phase = "win"
			message = "Bosskern zerlegt - Sector clear!"
			message_timer = 99.0
		else:
			if rng.randf() < 0.22:
				spawn_pickup(float(e.z) + 3.0)
		entities.remove_at(index)
	else:
		entities[index] = e

func damage_player(amount: float, reason: String) -> void:
	player.shield = max(0.0, float(player.shield) - amount)
	player.combo = 0
	shake = 1.0
	add_text(reason + " -" + str(int(amount)), Color(1.0, 0.3, 0.25))

func pulse_clear() -> void:
	if float(player.heat) > 72.0:
		return
	player.heat = min(100.0, float(player.heat) + 30.0)
	var cleared := 0
	for i in range(entities.size() - 1, -1, -1):
		var e = entities[i]
		if String(e.kind) == "bolt" and float(e.z) < 24.0:
			entities.remove_at(i)
			cleared += 1
	if cleared > 0:
		player.score += cleared * 90
		add_text("PULSE CLEAR x" + str(cleared), Color(0.65, 0.85, 1.0))
	else:
		add_text("Pulse leer", Color(0.58, 0.68, 0.9))

func cycle_weapon() -> void:
	weapon_index = (weapon_index + 1) % WEAPON_ORDER.size()
	current_weapon = WEAPON_ORDER[weapon_index]
	add_text(String(WEAPONS[current_weapon].label), Color(0.75, 0.92, 1.0))

func toggle_learncade() -> void:
	mode = "Learncade" if mode == "Normal" else "Normal"
	gate_timer = 1.2 if mode == "Learncade" else 8.0
	message = "Mode " + mode
	message_timer = 2.0

func _unhandled_input(event) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		match event.keycode:
			KEY_R:
				reset_game()
			KEY_L:
				toggle_learncade()
			KEY_K:
				fire_missile()
			KEY_X:
				pulse_clear()
			KEY_C:
				cycle_weapon()

func _gui_input(event) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			handle_touch_press(event.index, event.position)
		else:
			if event.index == touch_pointer:
				touch_pointer = -1
				touch_axis = Vector2.ZERO
	elif event is InputEventScreenDrag:
		if event.index == touch_pointer:
			var origin := Vector2(96.0, size.y - 96.0)
			touch_axis = (event.position - origin) / 72.0
			if touch_axis.length() > 1.0:
				touch_axis = touch_axis.normalized()
	elif event is InputEventMouseButton and event.pressed:
		handle_touch_press(999, event.position)

func handle_touch_press(pointer_id: int, pos: Vector2) -> void:
	if pos.x < size.x * 0.45 and pos.y > size.y * 0.56:
		touch_pointer = pointer_id
		var origin := Vector2(96.0, size.y - 96.0)
		touch_axis = (pos - origin) / 72.0
		if touch_axis.length() > 1.0:
			touch_axis = touch_axis.normalized()
		return
	for name in touch_buttons.keys():
		if touch_buttons[name].has_point(pos):
			if name == "fire":
				fire_weapon()
			elif name == "missile":
				fire_missile()
			elif name == "pulse":
				pulse_clear()
			elif name == "learn":
				toggle_learncade()
			elif name == "weapon":
				cycle_weapon()

func project_point(x_value: float, y_value: float, z_value: float) -> Vector2:
	var center := get_center()
	var z: float = max(1.1, z_value)
	var rel := Vector2((x_value - float(player.x)) * PROJECTION_SCALE / z, (y_value - float(player.y)) * PROJECTION_SCALE / z)
	var c := cos(float(player.roll))
	var s := sin(float(player.roll))
	var rotated := Vector2(rel.x * c - rel.y * s, rel.x * s + rel.y * c)
	if shake > 0.0:
		rotated += Vector2(rng.randf_range(-shake, shake), rng.randf_range(-shake, shake)) * 5.0
	return center + rotated

func get_center() -> Vector2:
	return Vector2(size.x * 0.5, size.y * 0.52)

func _draw() -> void:
	draw_background()
	draw_tunnel()
	draw_entities()
	draw_shots()
	draw_player_reticle()
	draw_hud()
	draw_touch_controls()
	draw_messages()

func draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color(0.006, 0.013, 0.04))
	var center := get_center()
	draw_circle(center, min(size.x, size.y) * 0.62, Color(0.02, 0.05, 0.11))
	draw_circle(center, min(size.x, size.y) * 0.34, Color(0.005, 0.015, 0.04))

func draw_tunnel() -> void:
	var center := get_center()
	var offset := fmod(distance * 0.12, 4.0)
	for i in range(21, -1, -1):
		var z := MIN_Z + float(i) * 3.7 - offset
		if z < MIN_Z:
			z += 77.0
		var radius := TUNNEL_RADIUS * 900.0 / z
		var points := []
		for p in range(32):
			var a := (float(p) / 32.0) * TAU + float(player.roll)
			points.append(center + Vector2(cos(a), sin(a)) * radius)
		points.append(points[0])
		var shade: float = clamp(1.0 - z / MAX_Z, 0.08, 0.65)
		draw_polyline(PackedVector2Array(points), Color(0.06 + shade * 0.08, 0.14 + shade * 0.18, 0.22 + shade * 0.28, 0.82), 2.0)
		if i % 2 == 0:
			for spoke in range(0, 8):
				var a2 := (float(spoke) / 8.0) * TAU + float(player.roll)
				draw_line(center + Vector2(cos(a2), sin(a2)) * radius * 0.18, center + Vector2(cos(a2), sin(a2)) * radius, Color(0.05, 0.22, 0.32, 0.25), 1.0)

func draw_entities() -> void:
	var sorted := entities.duplicate()
	sorted.sort_custom(func(a, b): return float(a.z) > float(b.z))
	for e in sorted:
		var kind := String(e.kind)
		if kind == "gate":
			draw_gate(e)
		elif kind == "ring":
			draw_ring(e)
		elif kind == "pickup":
			draw_pickup(e)
		elif kind == "bolt":
			draw_bolt(e)
		elif kind == "boss":
			draw_boss(e)
		else:
			draw_enemy(e)

func draw_enemy(e) -> void:
	var pos := project_point(float(e.x), float(e.y), float(e.z))
	var scale: float = clamp(260.0 / float(e.z), 10.0, 92.0)
	var kind := String(e.kind)
	var color := Color(0.96, 0.18, 0.18)
	if kind == "sentinel":
		color = Color(0.76, 0.34, 1.0)
	elif kind == "mine":
		color = Color(1.0, 0.62, 0.18)
	var sides := 4 if kind != "mine" else 8
	var points := []
	for i in range(sides):
		var a := (float(i) / float(sides)) * TAU + float(e.phase)
		points.append(pos + Vector2(cos(a), sin(a)) * scale)
	draw_colored_polygon(PackedVector2Array(points), color)
	draw_polyline(PackedVector2Array(points + [points[0]]), Color.WHITE, 1.5)
	var hp_ratio: float = clamp(float(e.hp) / float(e.max_hp), 0.0, 1.0)
	draw_rect(Rect2(pos + Vector2(-scale, scale + 5.0), Vector2(scale * 2.0, 4.0)), Color(0.1, 0.05, 0.06, 0.9))
	draw_rect(Rect2(pos + Vector2(-scale, scale + 5.0), Vector2(scale * 2.0 * hp_ratio, 4.0)), Color(0.35, 1.0, 0.5))

func draw_boss(e) -> void:
	var pos := project_point(float(e.x), float(e.y), float(e.z))
	var scale: float = clamp(900.0 / float(e.z), 68.0, 240.0)
	draw_circle(pos, scale * 0.75, Color(0.22, 0.02, 0.05, 0.94))
	draw_arc(pos, scale, 0.0, TAU, 64, Color(1.0, 0.2, 0.16), 5.0)
	draw_arc(pos, scale * 0.55, float(e.phase), float(e.phase) + PI * 1.4, 48, Color(1.0, 0.82, 0.22), 5.0)
	draw_circle(pos, scale * 0.26 + sin(float(e.phase) * 5.0) * 4.0, Color(0.25, 0.9, 1.0))
	var hp_ratio: float = clamp(float(e.hp) / float(e.max_hp), 0.0, 1.0)
	draw_rect(Rect2(Vector2(size.x * 0.24, 82.0), Vector2(size.x * 0.52, 12.0)), Color(0.14, 0.02, 0.03, 0.9))
	draw_rect(Rect2(Vector2(size.x * 0.24, 82.0), Vector2(size.x * 0.52 * hp_ratio, 12.0)), Color(1.0, 0.17, 0.12))
	draw_text(Vector2(size.x * 0.24, 76.0), "REAKTORBOSS")

func draw_ring(e) -> void:
	var pos := project_point(float(e.x), float(e.y), float(e.z))
	var scale: float = clamp(360.0 / float(e.z), 16.0, 98.0)
	draw_arc(pos, scale, 0.0, TAU, 40, Color(0.21, 0.9, 1.0), 4.0)
	draw_arc(pos, scale * 0.62, float(e.phase), float(e.phase) + PI, 24, Color(1.0, 0.9, 0.24), 3.0)

func draw_pickup(e) -> void:
	var pos := project_point(float(e.x), float(e.y), float(e.z))
	var scale: float = clamp(220.0 / float(e.z), 12.0, 58.0)
	draw_rect(Rect2(pos - Vector2(scale, scale), Vector2(scale * 2.0, scale * 2.0)), Color(0.2, 1.0, 0.45))
	draw_text(pos + Vector2(-scale * 0.8, scale * 0.25), "+")

func draw_bolt(e) -> void:
	var pos := project_point(float(e.x), float(e.y), float(e.z))
	var scale: float = clamp(170.0 / float(e.z), 9.0, 46.0)
	draw_circle(pos, scale, Color(1.0, 0.15, 0.06))
	draw_circle(pos, scale * 0.45, Color(1.0, 0.95, 0.4))

func draw_gate(gate) -> void:
	var question = gate.question
	for i in range(3):
		var lane := float(LANES[i])
		var pos := project_point(lane, 0.0, float(gate.z))
		var scale: float = clamp(620.0 / float(gate.z), 58.0, 190.0)
		var rect := Rect2(pos - Vector2(scale * 0.56, scale * 0.38), Vector2(scale * 1.12, scale * 0.76))
		var is_answer := String(question.options[i]) == String(question.answer)
		var gate_color := Color(0.18, 0.36, 0.72, 0.72)
		if is_answer:
			gate_color = Color(0.2, 0.55, 0.32, 0.72)
		draw_rect(rect, gate_color)
		draw_rect(rect, Color(0.7, 0.9, 1.0, 0.88), false, 2.0)
		draw_text(pos + Vector2(-scale * 0.43, 5.0), String(question.options[i]))

func draw_shots() -> void:
	for shot in shots:
		var pos := project_point(float(shot.x), float(shot.y), float(shot.z))
		var prev := project_point(float(shot.x), float(shot.y), max(1.0, float(shot.z) - 4.0))
		draw_line(prev, pos, shot.color, 4.0)
		draw_circle(pos, 4.0, shot.color)
	for missile in missiles:
		var pos2 := project_point(float(missile.x), float(missile.y), float(missile.z))
		draw_circle(pos2, 7.0, Color(1.0, 0.64, 0.12))
		draw_circle(pos2, 3.0, Color.WHITE)
	for p in particles:
		draw_circle(p.pos, p.size, p.color)

func draw_player_reticle() -> void:
	var center := get_center()
	var ret := project_point(float(player.x), float(player.y), 12.0)
	draw_arc(center, 68.0, float(player.roll), float(player.roll) + TAU, 64, Color(0.28, 0.75, 1.0, 0.22), 2.0)
	draw_line(ret + Vector2(-18, 0), ret + Vector2(-6, 0), Color(0.8, 0.95, 1.0), 2.0)
	draw_line(ret + Vector2(6, 0), ret + Vector2(18, 0), Color(0.8, 0.95, 1.0), 2.0)
	draw_line(ret + Vector2(0, -18), ret + Vector2(0, -6), Color(0.8, 0.95, 1.0), 2.0)
	draw_line(ret + Vector2(0, 6), ret + Vector2(0, 18), Color(0.8, 0.95, 1.0), 2.0)
	draw_circle(ret, 4.0, Color(1.0, 0.94, 0.3))

func draw_hud() -> void:
	draw_rect(Rect2(Vector2(10, 10), Vector2(286, 104)), Color(0.0, 0.0, 0.0, 0.62))
	draw_text(Vector2(18, 28), "FASKA DESCENT - GODOT 4", Color(1.0, 0.93, 0.32), 18)
	draw_bar(Vector2(18, 42), "SHIELD", float(player.shield), 100.0, Color(0.28, 0.92, 1.0))
	draw_bar(Vector2(18, 66), "HEAT", float(player.heat), 100.0, Color(1.0, 0.48, 0.2))
	draw_text(Vector2(18, 102), "Score " + str(player.score) + "  Combo " + str(player.combo) + "  Mode " + mode, Color(0.86, 0.92, 1.0), 13)
	draw_rect(Rect2(Vector2(size.x - 264.0, 10.0), Vector2(250.0, 82.0)), Color(0.0, 0.0, 0.0, 0.55))
	draw_text(Vector2(size.x - 254.0, 30.0), "Weapon " + String(WEAPONS[current_weapon].label), Color(0.95, 0.98, 1.0), 14)
	draw_text(Vector2(size.x - 254.0, 52.0), "Missiles " + str(player.missiles) + "  Kills " + str(player.kills), Color(0.95, 0.98, 1.0), 14)
	draw_text(Vector2(size.x - 254.0, 74.0), "Dist " + str(int(distance)) + "  Gates " + str(player.gates), Color(0.95, 0.98, 1.0), 14)
	if mode == "Learncade":
		draw_rect(Rect2(Vector2(size.x * 0.28, 12.0), Vector2(size.x * 0.44, 30.0)), Color(0.04, 0.08, 0.14, 0.82))
		draw_text(Vector2(size.x * 0.29, 33.0), "Learncade aktiv: fliege durch die richtige Antwortspur", Color(0.72, 0.94, 1.0), 14)

func draw_bar(pos: Vector2, label: String, value: float, max_value: float, color: Color) -> void:
	draw_text(pos, label, Color(0.75, 0.84, 0.94), 12)
	draw_rect(Rect2(pos + Vector2(62, -11), Vector2(155, 9)), Color(0.08, 0.12, 0.18))
	draw_rect(Rect2(pos + Vector2(62, -11), Vector2(155 * clamp(value / max_value, 0.0, 1.0), 9)), color)

func draw_touch_controls() -> void:
	touch_buttons.clear()
	var left_center := Vector2(96.0, size.y - 96.0)
	draw_arc(left_center, 64.0, 0.0, TAU, 40, Color(0.6, 0.8, 1.0, 0.28), 3.0)
	draw_circle(left_center + touch_axis * 42.0, 22.0, Color(0.35, 0.75, 1.0, 0.38))
	var labels = [
		["fire", "FIRE", Vector2(size.x - 98.0, size.y - 102.0)],
		["missile", "MISS", Vector2(size.x - 178.0, size.y - 92.0)],
		["pulse", "PULSE", Vector2(size.x - 98.0, size.y - 182.0)],
		["weapon", "WPN", Vector2(size.x - 178.0, size.y - 172.0)],
		["learn", "LERN", Vector2(size.x - 258.0, size.y - 132.0)]
	]
	for item in labels:
		var rect := Rect2(item[2] - Vector2(34, 24), Vector2(68, 48))
		touch_buttons[item[0]] = rect
		draw_rect(rect, Color(0.03, 0.08, 0.15, 0.68))
		draw_rect(rect, Color(0.58, 0.78, 1.0, 0.52), false, 2.0)
		draw_text(rect.position + Vector2(10, 31), item[1], Color(0.9, 0.96, 1.0), 12)

func draw_messages() -> void:
	if message_timer > 0.0:
		draw_rect(Rect2(Vector2(size.x * 0.24, 52.0), Vector2(size.x * 0.52, 28.0)), Color(0.0, 0.0, 0.0, 0.66))
		draw_text(Vector2(size.x * 0.25, 72.0), message, Color(0.96, 0.98, 1.0), 14)
	for item in floating_text:
		draw_text(item.pos, item.text, item.color, 16)
	if phase == "over" or phase == "win":
		draw_rect(Rect2(Vector2(size.x * 0.24, size.y * 0.38), Vector2(size.x * 0.52, 118.0)), Color(0.0, 0.0, 0.0, 0.76))
		var title := "SECTOR CLEAR" if phase == "win" else "SHIP LOST"
		draw_text(Vector2(size.x * 0.39, size.y * 0.43), title, Color(1.0, 0.9, 0.25), 28)
		draw_text(Vector2(size.x * 0.34, size.y * 0.49), "Score " + str(player.score) + " - R fuer Neustart", Color(0.9, 0.96, 1.0), 16)

func draw_text(pos: Vector2, text: String, color: Color = Color.WHITE, font_size: int = 14) -> void:
	draw_string(font, pos, text, HORIZONTAL_ALIGNMENT_LEFT, -1.0, font_size, color)

func add_text(text: String, color: Color) -> void:
	floating_text.append({
		"text": text,
		"pos": get_center() + Vector2(rng.randf_range(-120.0, 120.0), rng.randf_range(-80.0, 80.0)),
		"life": 1.2,
		"color": color
	})

func update_particles(delta: float) -> void:
	for i in range(particles.size() - 1, -1, -1):
		var p = particles[i]
		p.life = float(p.life) - delta
		p.pos = p.pos + p.vel * delta
		p.size = max(0.0, float(p.size) - delta * 9.0)
		p.color.a = clamp(float(p.life), 0.0, 1.0)
		if float(p.life) <= 0.0:
			particles.remove_at(i)
		else:
			particles[i] = p
	for i in range(floating_text.size() - 1, -1, -1):
		var t = floating_text[i]
		t.life = float(t.life) - delta
		t.pos = t.pos + Vector2(0.0, -28.0) * delta
		t.color.a = clamp(float(t.life), 0.0, 1.0)
		if float(t.life) <= 0.0:
			floating_text.remove_at(i)
		else:
			floating_text[i] = t

func spawn_sparks(pos: Vector2, color: Color) -> void:
	for i in range(12):
		particles.append({
			"pos": pos,
			"vel": Vector2(rng.randf_range(-90.0, 90.0), rng.randf_range(-80.0, 80.0)),
			"life": rng.randf_range(0.25, 0.7),
			"size": rng.randf_range(2.0, 5.5),
			"color": color
		})
