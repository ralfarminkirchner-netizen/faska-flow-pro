extends Control

const ARENA_W := 2520.0
const ARENA_H := 1680.0
const PLAYER_R := 22.0
const ENEMY_R := 20.0
const BASE_SPEED := 430.0
const BOOST_SPEED := 620.0
const FRICTION := 7.4
const TOUCH_DEADZONE := 0.08

const LEARN_TASKS = [
	{"subject": "Deutsch", "prompt": "Welche Wortart ist 'mutig'?", "answer": "Adjektiv", "options": ["Nomen", "Verb", "Adjektiv"]},
	{"subject": "Mathe", "prompt": "9 + 8 = ?", "answer": "17", "options": ["16", "17", "18"]},
	{"subject": "Englisch", "prompt": "Was bedeutet 'shield'?", "answer": "Schild", "options": ["Schild", "Schwert", "Stern"]},
	{"subject": "Sachkunde", "prompt": "Welcher Planet ist rot?", "answer": "Mars", "options": ["Mars", "Venus", "Neptun"]},
	{"subject": "Deutsch", "prompt": "Welche Wortart ist 'rennt'?", "answer": "Verb", "options": ["Verb", "Nomen", "Artikel"]},
	{"subject": "Mathe", "prompt": "6 x 7 = ?", "answer": "42", "options": ["36", "42", "48"]}
]

const WEAPONS = {
	"pulse": {"label": "PULSE", "cooldown": 0.11, "speed": 980.0, "damage": 13.0, "heat": 4.0, "radius": 5.0, "color": Color(1.0, 0.92, 0.38), "ammo": -1},
	"scatter": {"label": "SCATTER", "cooldown": 0.32, "speed": 760.0, "damage": 10.0, "heat": 11.0, "radius": 5.0, "color": Color(1.0, 0.36, 0.45), "ammo": -1},
	"rail": {"label": "RAIL", "cooldown": 0.58, "speed": 1600.0, "damage": 46.0, "heat": 23.0, "radius": 7.0, "color": Color(0.35, 0.95, 1.0), "ammo": 2},
	"rocket": {"label": "ROCKET", "cooldown": 0.62, "speed": 620.0, "damage": 40.0, "heat": 18.0, "radius": 10.0, "color": Color(1.0, 0.55, 0.16), "ammo": 1}
}

const WEAPON_ORDER = ["pulse", "scatter", "rail", "rocket"]

var font
var rng := RandomNumberGenerator.new()
var player := {}
var walls := []
var pads := []
var pickups := []
var control_nodes := []
var learn_pillars := []
var enemies := []
var bullets := []
var enemy_bullets := []
var explosions := []
var particles := []
var floating_text := []
var camera := Vector2.ZERO
var aim_world := Vector2.ZERO
var touch_axis := Vector2.ZERO
var touch_pointer := -1
var touch_buttons := {}
var current_weapon := "pulse"
var weapon_index := 0
var mode := "Normal"
var phase := "run"
var wave := 1
var wave_timer := 0.0
var question_index := 0
var score := 0
var combo := 0
var message := ""
var message_timer := 0.0
var notice := ""
var notice_timer := 0.0
var shake := 0.0
var stats := {}

func _ready() -> void:
	rng.seed = 84031
	font = get_theme_default_font()
	focus_mode = Control.FOCUS_ALL
	mouse_filter = Control.MOUSE_FILTER_STOP
	grab_focus()
	reset_game()

func reset_game() -> void:
	player = {
		"pos": Vector2(ARENA_W * 0.5, ARENA_H * 0.5),
		"vel": Vector2.ZERO,
		"hp": 100.0,
		"armor": 30.0,
		"heat": 0.0,
		"rail": 10,
		"rocket": 8,
		"quad": 0.0,
		"air": 0.0,
		"fire_cd": 0.0,
		"invuln": 0.0
	}
	walls = [
		Rect2(260, 190, 330, 70),
		Rect2(870, 130, 88, 310),
		Rect2(1380, 280, 430, 72),
		Rect2(2020, 210, 92, 360),
		Rect2(190, 740, 405, 78),
		Rect2(940, 780, 320, 78),
		Rect2(1610, 720, 350, 82),
		Rect2(690, 1240, 92, 270),
		Rect2(1310, 1190, 430, 74),
		Rect2(2100, 1130, 92, 310)
	]
	pads = [
		{"label": "PAD N", "pos": Vector2(740, 520), "push": Vector2(1.0, -0.72), "color": Color(0.3, 0.9, 1.0)},
		{"label": "PAD E", "pos": Vector2(1820, 590), "push": Vector2(-0.5, 1.0), "color": Color(0.72, 0.52, 1.0)},
		{"label": "PAD S", "pos": Vector2(1180, 1350), "push": Vector2(0.72, -1.0), "color": Color(1.0, 0.88, 0.2)},
		{"label": "PAD W", "pos": Vector2(380, 1070), "push": Vector2(1.0, 0.34), "color": Color(0.28, 1.0, 0.62)}
	]
	pickups = [
		{"kind": "mega", "label": "MEGA", "pos": Vector2(1260, 610), "ready": true, "timer": 0.0, "respawn": 13.0, "color": Color(0.26, 1.0, 0.45)},
		{"kind": "quad", "label": "QUAD", "pos": Vector2(2150, 1300), "ready": true, "timer": 0.0, "respawn": 18.0, "color": Color(0.76, 0.45, 1.0)},
		{"kind": "armor", "label": "ARMOR", "pos": Vector2(520, 1320), "ready": true, "timer": 0.0, "respawn": 12.0, "color": Color(0.25, 0.75, 1.0)},
		{"kind": "rocket", "label": "ROCKET", "pos": Vector2(1740, 260), "ready": true, "timer": 0.0, "respawn": 10.0, "color": Color(1.0, 0.55, 0.16)}
	]
	control_nodes = [
		{"label": "ALPHA", "pos": Vector2(780, 690), "owner": 0.0, "captured": false, "color": Color(1.0, 0.83, 0.25)},
		{"label": "BETA", "pos": Vector2(1490, 950), "owner": 0.0, "captured": false, "color": Color(0.3, 0.9, 1.0)},
		{"label": "GAMMA", "pos": Vector2(2070, 690), "owner": 0.0, "captured": false, "color": Color(0.72, 0.52, 1.0)}
	]
	enemies.clear()
	bullets.clear()
	enemy_bullets.clear()
	explosions.clear()
	particles.clear()
	floating_text.clear()
	touch_axis = Vector2.ZERO
	touch_pointer = -1
	touch_buttons.clear()
	current_weapon = "pulse"
	weapon_index = 0
	mode = "Normal"
	phase = "run"
	wave = 1
	wave_timer = 1.0
	question_index = 0
	score = 0
	combo = 0
	stats = {"kills": 0, "waves": 0, "nodes": 0, "learn": 0, "rail": 0, "rocket": 0, "quad": 0, "pads": 0}
	message = "FASKA ARSENAL - Godot 4"
	message_timer = 2.2
	notice = ""
	notice_timer = 0.0
	shake = 0.0
	spawn_wave()
	build_learn_pillars()

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()
	if phase == "run":
		update_game(delta)
	update_effects(delta)
	queue_redraw()

func update_game(delta: float) -> void:
	update_input(delta)
	update_pickups(delta)
	update_control_nodes(delta)
	update_enemies(delta)
	update_bullets(delta)
	update_enemy_bullets(delta)
	update_explosions(delta)
	update_learn_pillars(delta)
	if enemies.is_empty():
		wave_timer -= delta
		if wave_timer <= 0.0:
			wave += 1
			stats.waves += 1
			score += 350 + wave * 60
			spawn_wave()
			message = "Welle " + str(wave)
			message_timer = 1.8
	player.heat = max(0.0, float(player.heat) - delta * 22.0)
	player.fire_cd = max(0.0, float(player.fire_cd) - delta)
	player.quad = max(0.0, float(player.quad) - delta)
	player.air = max(0.0, float(player.air) - delta)
	player.invuln = max(0.0, float(player.invuln) - delta)
	if float(player.hp) <= 0.0:
		phase = "over"
		message = "Arena verloren - R fuer Neustart"
		message_timer = 99.0
	camera = (Vector2(player.pos) - size * 0.5).clamp(Vector2.ZERO, Vector2(max(0.0, ARENA_W - size.x), max(0.0, ARENA_H - size.y)))

func update_input(delta: float) -> void:
	var axis := Vector2.ZERO
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		axis.x -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		axis.x += 1.0
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		axis.y -= 1.0
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		axis.y += 1.0
	if touch_axis.length() > TOUCH_DEADZONE:
		axis += touch_axis
	if axis.length() > 1.0:
		axis = axis.normalized()
	var speed := BOOST_SPEED if Input.is_key_pressed(KEY_SHIFT) else BASE_SPEED
	var target_vel := axis * speed
	player.vel = Vector2(player.vel).lerp(target_vel, min(1.0, delta * FRICTION))
	move_player(Vector2(player.vel) * delta)
	if Input.is_key_pressed(KEY_J) or Input.is_key_pressed(KEY_SPACE):
		fire_current_weapon()
	aim_world = screen_to_world(get_local_mouse_position())

func move_player(delta_pos: Vector2) -> void:
	var pos := Vector2(player.pos)
	var try_x := Vector2(clamp(pos.x + delta_pos.x, PLAYER_R, ARENA_W - PLAYER_R), pos.y)
	if not circle_hits_wall(try_x, PLAYER_R):
		pos.x = try_x.x
	else:
		player.vel = Vector2(0.0, Vector2(player.vel).y)
	var try_y := Vector2(pos.x, clamp(pos.y + delta_pos.y, PLAYER_R, ARENA_H - PLAYER_R))
	if not circle_hits_wall(try_y, PLAYER_R):
		pos.y = try_y.y
	else:
		player.vel = Vector2(Vector2(player.vel).x, 0.0)
	player.pos = pos
	for pad in pads:
		if Vector2(player.pos).distance_to(Vector2(pad.pos)) < 52.0:
			var push := Vector2(pad.push).normalized() * 820.0
			player.vel = push
			player.air = 0.9
			stats.pads += 1
			add_text("JUMP PAD", Vector2(player.pos), Color(0.45, 0.92, 1.0))

func spawn_wave() -> void:
	var count := 5 + wave * 2
	for i in range(count):
		var side := i % 4
		var pos := Vector2.ZERO
		if side == 0:
			pos = Vector2(rng.randf_range(80.0, ARENA_W - 80.0), 70.0)
		elif side == 1:
			pos = Vector2(ARENA_W - 70.0, rng.randf_range(80.0, ARENA_H - 80.0))
		elif side == 2:
			pos = Vector2(rng.randf_range(80.0, ARENA_W - 80.0), ARENA_H - 70.0)
		else:
			pos = Vector2(70.0, rng.randf_range(80.0, ARENA_H - 80.0))
		var kind := "grunt"
		if i % 5 == 0 and wave > 1:
			kind = "brute"
		elif i % 3 == 0:
			kind = "drone"
		spawn_enemy(kind, pos)

func spawn_enemy(kind: String, pos: Vector2) -> void:
	var hp := 36.0
	var speed := 190.0
	var color := Color(1.0, 0.24, 0.22)
	var radius := ENEMY_R
	if kind == "brute":
		hp = 82.0 + wave * 5.0
		speed = 132.0
		color = Color(1.0, 0.55, 0.18)
		radius = 29.0
	elif kind == "drone":
		hp = 26.0 + wave * 2.0
		speed = 250.0
		color = Color(0.76, 0.42, 1.0)
		radius = 18.0
	enemies.append({"kind": kind, "pos": pos, "vel": Vector2.ZERO, "hp": hp, "max_hp": hp, "speed": speed, "radius": radius, "color": color, "shoot": rng.randf_range(0.8, 2.2), "phase": rng.randf_range(0.0, TAU)})

func update_enemies(delta: float) -> void:
	for i in range(enemies.size() - 1, -1, -1):
		var e = enemies[i]
		var to_player: Vector2 = Vector2(player.pos) - Vector2(e.pos)
		var dist: float = max(1.0, to_player.length())
		var desired: Vector2 = to_player / dist
		if String(e.kind) == "drone":
			desired = desired.rotated(sin(float(e.phase)) * 0.9)
		e.phase = float(e.phase) + delta * 2.0
		e.vel = Vector2(e.vel).lerp(desired * float(e.speed), min(1.0, delta * 3.8))
		var next := Vector2(e.pos) + Vector2(e.vel) * delta
		next.x = clamp(next.x, float(e.radius), ARENA_W - float(e.radius))
		next.y = clamp(next.y, float(e.radius), ARENA_H - float(e.radius))
		if not circle_hits_wall(next, float(e.radius)):
			e.pos = next
		e.shoot = float(e.shoot) - delta
		if float(e.shoot) <= 0.0 and dist < 720.0:
			e.shoot = rng.randf_range(1.0, 2.0)
			fire_enemy_bullet(e)
		if dist < float(e.radius) + PLAYER_R:
			damage_player(14.0 * delta, "Kontakt")
		enemies[i] = e

func fire_enemy_bullet(e) -> void:
	var dir := (Vector2(player.pos) - Vector2(e.pos)).normalized()
	enemy_bullets.append({"pos": Vector2(e.pos), "vel": dir * 430.0, "life": 2.5, "damage": 9.0, "color": Color(1.0, 0.2, 0.16)})

func fire_current_weapon() -> void:
	var weapon = WEAPONS[current_weapon]
	if float(player.fire_cd) > 0.0 or float(player.heat) > 96.0:
		return
	var ammo_key := String(current_weapon)
	if int(weapon.ammo) > 0 and int(player.get(ammo_key, 0)) <= 0:
		add_text("Keine Munition", Vector2(player.pos), Color(1.0, 0.35, 0.25))
		return
	if int(weapon.ammo) > 0:
		player[ammo_key] = int(player[ammo_key]) - 1
	player.fire_cd = float(weapon.cooldown)
	player.heat = min(100.0, float(player.heat) + float(weapon.heat))
	var dir := (aim_world - Vector2(player.pos)).normalized()
	if dir.length() < 0.1:
		dir = Vector2.RIGHT
	var damage := float(weapon.damage)
	if float(player.quad) > 0.0:
		damage *= 3.0
	if current_weapon == "scatter":
		for spread in [-0.26, 0.0, 0.26]:
			spawn_player_bullet(dir.rotated(spread), weapon, damage)
	elif current_weapon == "rocket":
		spawn_player_bullet(dir, weapon, damage, true)
	else:
		spawn_player_bullet(dir, weapon, damage)

func spawn_player_bullet(dir: Vector2, weapon, damage: float, rocket := false) -> void:
	bullets.append({
		"pos": Vector2(player.pos) + dir * 28.0,
		"vel": dir * float(weapon.speed),
		"life": 1.4 if not rocket else 2.2,
		"damage": damage,
		"radius": float(weapon.radius),
		"color": weapon.color,
		"weapon": current_weapon,
		"rocket": rocket,
		"pierce": 2 if current_weapon == "rail" else 0
	})

func update_bullets(delta: float) -> void:
	for i in range(bullets.size() - 1, -1, -1):
		var b = bullets[i]
		var old_pos := Vector2(b.pos)
		b.pos = old_pos + Vector2(b.vel) * delta
		b.life = float(b.life) - delta
		var remove := false
		if float(b.life) <= 0.0 or point_outside(Vector2(b.pos)) or circle_hits_wall(Vector2(b.pos), float(b.radius)):
			if bool(b.rocket):
				explode(Vector2(b.pos), 104.0, float(b.damage), true)
			remove = true
		if not remove:
			for e_i in range(enemies.size() - 1, -1, -1):
				var e = enemies[e_i]
				if Vector2(b.pos).distance_to(Vector2(e.pos)) <= float(b.radius) + float(e.radius):
					hit_enemy(e_i, float(b.damage), String(b.weapon), Vector2(b.pos))
					if bool(b.rocket):
						explode(Vector2(b.pos), 130.0, float(b.damage), true)
						remove = true
						break
					if int(b.pierce) > 0:
						b.pierce = int(b.pierce) - 1
					else:
						remove = true
						break
		if remove:
			bullets.remove_at(i)
		else:
			bullets[i] = b

func update_enemy_bullets(delta: float) -> void:
	for i in range(enemy_bullets.size() - 1, -1, -1):
		var b = enemy_bullets[i]
		b.pos = Vector2(b.pos) + Vector2(b.vel) * delta
		b.life = float(b.life) - delta
		if Vector2(b.pos).distance_to(Vector2(player.pos)) <= PLAYER_R + 6.0:
			damage_player(float(b.damage), "Plasma")
			enemy_bullets.remove_at(i)
		elif float(b.life) <= 0.0 or point_outside(Vector2(b.pos)) or circle_hits_wall(Vector2(b.pos), 5.0):
			enemy_bullets.remove_at(i)
		else:
			enemy_bullets[i] = b

func hit_enemy(index: int, damage: float, weapon_id: String, hit_pos: Vector2) -> void:
	if index < 0 or index >= enemies.size():
		return
	var e = enemies[index]
	e.hp = float(e.hp) - damage
	spawn_sparks(hit_pos, e.color)
	if weapon_id == "rail":
		stats.rail += 1
	if weapon_id == "rocket":
		stats.rocket += 1
	if float(e.hp) <= 0.0:
		var points := 120
		if String(e.kind) == "brute":
			points = 250
		elif String(e.kind) == "drone":
			points = 150
		if float(player.quad) > 0.0:
			points *= 2
			stats.quad += 1
		combo += 1
		score += points + combo * 18
		stats.kills += 1
		add_text("+" + str(points), Vector2(e.pos), Color(1.0, 0.9, 0.3))
		spawn_sparks(Vector2(e.pos), Color(1.0, 0.45, 0.18))
		enemies.remove_at(index)
	else:
		enemies[index] = e

func explode(pos: Vector2, radius: float, damage: float, from_player: bool) -> void:
	explosions.append({"pos": pos, "radius": radius, "life": 0.22, "max": 0.22})
	spawn_sparks(pos, Color(1.0, 0.55, 0.15), 18)
	if from_player:
		for i in range(enemies.size() - 1, -1, -1):
			var e = enemies[i]
			var d := Vector2(e.pos).distance_to(pos)
			if d <= radius:
				hit_enemy(i, damage * (1.0 - d / radius * 0.45), "rocket", pos)
		var self_d := Vector2(player.pos).distance_to(pos)
		if self_d < radius * 0.58:
			player.vel = (Vector2(player.pos) - pos).normalized() * 760.0
			player.air = 0.8
			player.hp = max(1.0, float(player.hp) - 7.0)
			add_text("ROCKET JUMP", Vector2(player.pos), Color(1.0, 0.68, 0.25))

func update_explosions(delta: float) -> void:
	for i in range(explosions.size() - 1, -1, -1):
		var ex = explosions[i]
		ex.life = float(ex.life) - delta
		if float(ex.life) <= 0.0:
			explosions.remove_at(i)
		else:
			explosions[i] = ex

func update_pickups(delta: float) -> void:
	for i in range(pickups.size()):
		var p = pickups[i]
		if not bool(p.ready):
			p.timer = float(p.timer) - delta
			if float(p.timer) <= 0.0:
				p.ready = true
		elif Vector2(player.pos).distance_to(Vector2(p.pos)) < 46.0:
			collect_pickup(p)
			p.ready = false
			p.timer = float(p.respawn)
		pickups[i] = p

func collect_pickup(p) -> void:
	var kind := String(p.kind)
	if kind == "mega":
		player.hp = min(160.0, float(player.hp) + 55.0)
	elif kind == "armor":
		player.armor = min(120.0, float(player.armor) + 45.0)
	elif kind == "quad":
		player.quad = 10.0
	elif kind == "rocket":
		player.rocket = int(player.rocket) + 5
		player.rail = int(player.rail) + 3
	score += 80
	add_text(String(p.label), Vector2(p.pos), p.color)

func update_control_nodes(delta: float) -> void:
	for i in range(control_nodes.size()):
		var node = control_nodes[i]
		var d := Vector2(player.pos).distance_to(Vector2(node.pos))
		if d < 82.0:
			node.owner = min(1.0, float(node.owner) + delta * 0.42)
			if float(node.owner) >= 1.0 and not bool(node.captured):
				node.captured = true
				stats.nodes += 1
				score += 500
				add_text(String(node.label) + " SECURED", Vector2(node.pos), node.color)
		else:
			node.owner = max(0.0, float(node.owner) - delta * 0.08)
		control_nodes[i] = node

func build_learn_pillars() -> void:
	learn_pillars.clear()
	var task = LEARN_TASKS[question_index % LEARN_TASKS.size()]
	var positions = [Vector2(620, 430), Vector2(1260, 980), Vector2(1990, 430)]
	for i in range(3):
		learn_pillars.append({"pos": positions[i], "option": String(task.options[i]), "answer": String(task.answer), "task": task, "active": true})

func update_learn_pillars(_delta: float) -> void:
	if mode != "Learncade":
		return
	for i in range(learn_pillars.size()):
		var pillar = learn_pillars[i]
		if bool(pillar.active) and Vector2(player.pos).distance_to(Vector2(pillar.pos)) < 58.0:
			if String(pillar.option) == String(pillar.answer):
				stats.learn += 1
				score += 650
				player.hp = min(140.0, float(player.hp) + 14.0)
				add_text("RICHTIG", Vector2(pillar.pos), Color(0.35, 1.0, 0.48))
			else:
				damage_player(15.0, "Falsche Saeule")
				add_text("FALSCH", Vector2(pillar.pos), Color(1.0, 0.25, 0.22))
			question_index += 1
			build_learn_pillars()
			message_timer = 2.0
			return

func toggle_learncade() -> void:
	mode = "Learncade" if mode == "Normal" else "Normal"
	message = "Mode " + mode
	message_timer = 2.0
	if mode == "Learncade":
		build_learn_pillars()

func cycle_weapon(step := 1) -> void:
	weapon_index = (weapon_index + step + WEAPON_ORDER.size()) % WEAPON_ORDER.size()
	current_weapon = WEAPON_ORDER[weapon_index]
	add_text(String(WEAPONS[current_weapon].label), Vector2(player.pos), Color(0.76, 0.95, 1.0))

func damage_player(amount: float, reason: String) -> void:
	if float(player.invuln) > 0.0:
		return
	var left := amount
	var armor_absorb = min(float(player.armor), left * 0.58)
	player.armor = max(0.0, float(player.armor) - armor_absorb)
	left -= armor_absorb
	player.hp = max(0.0, float(player.hp) - left)
	player.invuln = 0.16
	combo = 0
	shake = 1.0
	add_text(reason, Vector2(player.pos), Color(1.0, 0.24, 0.2))

func _unhandled_input(event) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		match event.keycode:
			KEY_R:
				reset_game()
			KEY_L:
				toggle_learncade()
			KEY_C:
				cycle_weapon(1)
			KEY_1:
				weapon_index = 0
				current_weapon = WEAPON_ORDER[weapon_index]
			KEY_2:
				weapon_index = 1
				current_weapon = WEAPON_ORDER[weapon_index]
			KEY_3:
				weapon_index = 2
				current_weapon = WEAPON_ORDER[weapon_index]
			KEY_4:
				weapon_index = 3
				current_weapon = WEAPON_ORDER[weapon_index]

func _gui_input(event) -> void:
	if event is InputEventMouseMotion:
		aim_world = screen_to_world(event.position)
	elif event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_LEFT:
			aim_world = screen_to_world(event.position)
			fire_current_weapon()
		elif event.button_index == MOUSE_BUTTON_RIGHT:
			cycle_weapon(1)
	elif event is InputEventScreenTouch:
		if event.pressed:
			handle_touch_press(event.index, event.position)
		else:
			if event.index == touch_pointer:
				touch_pointer = -1
				touch_axis = Vector2.ZERO
	elif event is InputEventScreenDrag:
		if event.index == touch_pointer:
			var origin := Vector2(100.0, size.y - 100.0)
			touch_axis = (event.position - origin) / 76.0
			if touch_axis.length() > 1.0:
				touch_axis = touch_axis.normalized()

func handle_touch_press(pointer_id: int, pos: Vector2) -> void:
	if pos.x < size.x * 0.42 and pos.y > size.y * 0.56:
		touch_pointer = pointer_id
		var origin := Vector2(100.0, size.y - 100.0)
		touch_axis = (pos - origin) / 76.0
		if touch_axis.length() > 1.0:
			touch_axis = touch_axis.normalized()
		return
	for name in touch_buttons.keys():
		if touch_buttons[name].has_point(pos):
			if name == "fire":
				aim_world = screen_to_world(Vector2(size.x * 0.5, size.y * 0.5))
				fire_current_weapon()
			elif name == "weapon":
				cycle_weapon(1)
			elif name == "learn":
				toggle_learncade()

func point_outside(pos: Vector2) -> bool:
	return pos.x < -60.0 or pos.y < -60.0 or pos.x > ARENA_W + 60.0 or pos.y > ARENA_H + 60.0

func circle_hits_wall(pos: Vector2, radius: float) -> bool:
	for wall in walls:
		if circle_rect_intersects(pos, radius, wall):
			return true
	return false

func circle_rect_intersects(pos: Vector2, radius: float, rect: Rect2) -> bool:
	var nearest := Vector2(clamp(pos.x, rect.position.x, rect.position.x + rect.size.x), clamp(pos.y, rect.position.y, rect.position.y + rect.size.y))
	return nearest.distance_to(pos) <= radius

func world_to_screen(pos: Vector2) -> Vector2:
	var offset := Vector2.ZERO
	if shake > 0.0:
		offset = Vector2(rng.randf_range(-shake, shake), rng.randf_range(-shake, shake)) * 7.0
	return pos - camera + offset

func screen_to_world(pos: Vector2) -> Vector2:
	return pos + camera

func _draw() -> void:
	draw_background()
	draw_world()
	draw_projectiles()
	draw_entities()
	draw_player()
	draw_effects()
	draw_hud()
	draw_touch_controls()
	draw_messages()

func draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color(0.015, 0.02, 0.045))
	for i in range(26):
		var x := fmod(float(i) * 97.0 - fmod(camera.x, 97.0), size.x + 100.0) - 40.0
		draw_line(Vector2(x, 0), Vector2(x, size.y), Color(0.08, 0.15, 0.22, 0.28), 1.0)
	for j in range(18):
		var y := fmod(float(j) * 97.0 - fmod(camera.y, 97.0), size.y + 100.0) - 40.0
		draw_line(Vector2(0, y), Vector2(size.x, y), Color(0.08, 0.15, 0.22, 0.28), 1.0)

func draw_world() -> void:
	var arena_rect := Rect2(world_to_screen(Vector2.ZERO), Vector2(ARENA_W, ARENA_H))
	draw_rect(arena_rect, Color(0.03, 0.07, 0.095, 0.92))
	draw_rect(arena_rect, Color(0.25, 0.7, 0.9, 0.38), false, 4.0)
	for wall in walls:
		var rect := Rect2(world_to_screen(wall.position), wall.size)
		draw_rect(rect, Color(0.12, 0.18, 0.23))
		draw_rect(rect, Color(0.55, 0.72, 0.86, 0.46), false, 2.0)
	for pad in pads:
		var p := world_to_screen(Vector2(pad.pos))
		draw_circle(p, 42.0, Color(pad.color, 0.22))
		draw_arc(p, 42.0, 0.0, TAU, 32, pad.color, 4.0)
		draw_text_at(p + Vector2(-28, 5), String(pad.label), Color(0.94, 0.98, 1.0), 13)
	for node in control_nodes:
		var p2 := world_to_screen(Vector2(node.pos))
		draw_circle(p2, 64.0, Color(node.color, 0.13))
		draw_arc(p2, 64.0, -PI * 0.5, -PI * 0.5 + TAU * float(node.owner), 44, node.color, 6.0)
		draw_text_at(p2 + Vector2(-34, 5), String(node.label), Color(0.92, 0.96, 1.0), 13)
	for pickup in pickups:
		if bool(pickup.ready):
			var pp := world_to_screen(Vector2(pickup.pos))
			draw_rect(Rect2(pp - Vector2(30, 22), Vector2(60, 44)), Color(pickup.color, 0.22))
			draw_rect(Rect2(pp - Vector2(30, 22), Vector2(60, 44)), pickup.color, false, 3.0)
			draw_text_at(pp + Vector2(-24, 5), String(pickup.label), Color(1.0, 1.0, 1.0), 12)
	if mode == "Learncade":
		var task = LEARN_TASKS[question_index % LEARN_TASKS.size()]
		for pillar in learn_pillars:
			var lp := world_to_screen(Vector2(pillar.pos))
			draw_circle(lp, 44.0, Color(0.18, 0.34, 0.72, 0.52))
			draw_arc(lp, 50.0, 0.0, TAU, 34, Color(0.55, 0.8, 1.0), 4.0)
			draw_text_at(lp + Vector2(-34, 5), String(pillar.option), Color(1.0, 1.0, 1.0), 13)
		draw_text_at(Vector2(size.x * 0.33, 42), String(task.prompt), Color(0.75, 0.94, 1.0), 16)

func draw_entities() -> void:
	for e in enemies:
		var p := world_to_screen(Vector2(e.pos))
		draw_circle(p, float(e.radius) + 7.0, Color(e.color, 0.18))
		if String(e.kind) == "brute":
			draw_rect(Rect2(p - Vector2(float(e.radius), float(e.radius)), Vector2(float(e.radius) * 2.0, float(e.radius) * 2.0)), e.color)
		elif String(e.kind) == "drone":
			draw_regular_polygon(p, float(e.radius), 3, e.color, float(e.phase))
		else:
			draw_regular_polygon(p, float(e.radius), 5, e.color, float(e.phase))
		var hp_ratio: float = clamp(float(e.hp) / float(e.max_hp), 0.0, 1.0)
		draw_rect(Rect2(p + Vector2(-22, float(e.radius) + 8), Vector2(44, 5)), Color(0.1, 0.03, 0.04))
		draw_rect(Rect2(p + Vector2(-22, float(e.radius) + 8), Vector2(44 * hp_ratio, 5)), Color(0.35, 1.0, 0.5))

func draw_player() -> void:
	var p := world_to_screen(Vector2(player.pos))
	var dir := (aim_world - Vector2(player.pos)).normalized()
	if dir.length() < 0.1:
		dir = Vector2.RIGHT
	var side := dir.orthogonal()
	var pts := PackedVector2Array([p + dir * 30.0, p - dir * 18.0 + side * 18.0, p - dir * 9.0, p - dir * 18.0 - side * 18.0])
	var color := Color(0.25, 0.85, 1.0) if float(player.quad) <= 0.0 else Color(0.8, 0.42, 1.0)
	draw_colored_polygon(pts, color)
	draw_polyline(PackedVector2Array([pts[0], pts[1], pts[2], pts[3], pts[0]]), Color.WHITE, 2.0)
	draw_line(p, world_to_screen(aim_world), Color(0.6, 0.85, 1.0, 0.18), 1.0)

func draw_projectiles() -> void:
	for b in bullets:
		var p := world_to_screen(Vector2(b.pos))
		draw_circle(p, float(b.radius), b.color)
		draw_line(p - Vector2(b.vel).normalized() * 20.0, p, b.color, 3.0)
	for b in enemy_bullets:
		var p2 := world_to_screen(Vector2(b.pos))
		draw_circle(p2, 6.0, b.color)

func draw_effects() -> void:
	for ex in explosions:
		var p := world_to_screen(Vector2(ex.pos))
		var t: float = 1.0 - float(ex.life) / float(ex.max)
		draw_circle(p, float(ex.radius) * t, Color(1.0, 0.55, 0.12, 0.28 * (1.0 - t)))
		draw_arc(p, float(ex.radius) * t, 0.0, TAU, 48, Color(1.0, 0.86, 0.22, 0.74 * (1.0 - t)), 3.0)
	for part in particles:
		draw_circle(world_to_screen(Vector2(part.pos)), float(part.size), part.color)

func draw_hud() -> void:
	draw_rect(Rect2(Vector2(10, 10), Vector2(330, 112)), Color(0.0, 0.0, 0.0, 0.58))
	draw_text_at(Vector2(20, 30), "FASKA ARSENAL - GODOT 4", Color(1.0, 0.9, 0.28), 18)
	draw_bar(Vector2(20, 48), "HP", float(player.hp), 160.0, Color(0.32, 1.0, 0.5))
	draw_bar(Vector2(20, 70), "ARMOR", float(player.armor), 120.0, Color(0.25, 0.72, 1.0))
	draw_bar(Vector2(20, 92), "HEAT", float(player.heat), 100.0, Color(1.0, 0.43, 0.2))
	draw_text_at(Vector2(20, 116), "Score " + str(score) + " Combo " + str(combo) + " Mode " + mode, Color(0.86, 0.94, 1.0), 13)
	draw_rect(Rect2(Vector2(size.x - 280, 10), Vector2(266, 92)), Color(0.0, 0.0, 0.0, 0.54))
	draw_text_at(Vector2(size.x - 268, 32), "Weapon " + String(WEAPONS[current_weapon].label), Color(0.94, 0.98, 1.0), 15)
	draw_text_at(Vector2(size.x - 268, 54), "Rail " + str(player.rail) + "  Rocket " + str(player.rocket), Color(0.94, 0.98, 1.0), 14)
	draw_text_at(Vector2(size.x - 268, 76), "Wave " + str(wave) + "  Kills " + str(stats.kills) + "  Nodes " + str(stats.nodes), Color(0.94, 0.98, 1.0), 14)
	if float(player.quad) > 0.0:
		draw_text_at(Vector2(size.x * 0.45, 34), "QUAD DAMAGE " + str(int(ceil(float(player.quad)))), Color(0.9, 0.55, 1.0), 18)

func draw_bar(pos: Vector2, label: String, value: float, max_value: float, color: Color) -> void:
	draw_text_at(pos, label, Color(0.73, 0.82, 0.93), 12)
	draw_rect(Rect2(pos + Vector2(62, -10), Vector2(160, 8)), Color(0.06, 0.08, 0.12))
	draw_rect(Rect2(pos + Vector2(62, -10), Vector2(160.0 * clamp(value / max_value, 0.0, 1.0), 8)), color)

func draw_messages() -> void:
	if message_timer > 0.0:
		draw_rect(Rect2(Vector2(size.x * 0.32, 12), Vector2(size.x * 0.36, 30)), Color(0.0, 0.0, 0.0, 0.62))
		draw_text_at(Vector2(size.x * 0.33, 33), message, Color(0.95, 0.98, 1.0), 14)
	for text in floating_text:
		draw_text_at(world_to_screen(Vector2(text.pos)), String(text.text), text.color, 16)
	if phase == "over":
		draw_rect(Rect2(Vector2(size.x * 0.26, size.y * 0.38), Vector2(size.x * 0.48, 110)), Color(0.0, 0.0, 0.0, 0.76))
		draw_text_at(Vector2(size.x * 0.39, size.y * 0.44), "ARENA LOST", Color(1.0, 0.28, 0.22), 28)
		draw_text_at(Vector2(size.x * 0.36, size.y * 0.49), "Score " + str(score) + " - R fuer Neustart", Color(0.9, 0.96, 1.0), 16)

func draw_touch_controls() -> void:
	touch_buttons.clear()
	var origin := Vector2(100, size.y - 100)
	draw_arc(origin, 66, 0.0, TAU, 36, Color(0.6, 0.82, 1.0, 0.32), 3.0)
	draw_circle(origin + touch_axis * 44.0, 23.0, Color(0.28, 0.72, 1.0, 0.42))
	var buttons = [
		["fire", "FIRE", Vector2(size.x - 92, size.y - 92)],
		["weapon", "WPN", Vector2(size.x - 172, size.y - 132)],
		["learn", "LERN", Vector2(size.x - 252, size.y - 92)]
	]
	for item in buttons:
		var rect := Rect2(item[2] - Vector2(35, 24), Vector2(70, 48))
		touch_buttons[item[0]] = rect
		draw_rect(rect, Color(0.02, 0.07, 0.13, 0.7))
		draw_rect(rect, Color(0.55, 0.78, 1.0, 0.55), false, 2.0)
		draw_text_at(rect.position + Vector2(11, 31), item[1], Color(0.92, 0.97, 1.0), 12)

func update_effects(delta: float) -> void:
	message_timer = max(0.0, message_timer - delta)
	notice_timer = max(0.0, notice_timer - delta)
	shake = max(0.0, shake - delta * 7.0)
	for i in range(particles.size() - 1, -1, -1):
		var p = particles[i]
		p.life = float(p.life) - delta
		p.pos = Vector2(p.pos) + Vector2(p.vel) * delta
		p.size = max(0.0, float(p.size) - delta * 8.0)
		p.color.a = clamp(float(p.life), 0.0, 1.0)
		if float(p.life) <= 0.0:
			particles.remove_at(i)
		else:
			particles[i] = p
	for i in range(floating_text.size() - 1, -1, -1):
		var t = floating_text[i]
		t.life = float(t.life) - delta
		t.pos = Vector2(t.pos) + Vector2(0, -34) * delta
		t.color.a = clamp(float(t.life), 0.0, 1.0)
		if float(t.life) <= 0.0:
			floating_text.remove_at(i)
		else:
			floating_text[i] = t

func spawn_sparks(pos: Vector2, color: Color, count := 9) -> void:
	for i in range(count):
		particles.append({"pos": pos, "vel": Vector2(rng.randf_range(-150, 150), rng.randf_range(-150, 150)), "life": rng.randf_range(0.22, 0.72), "size": rng.randf_range(2.0, 5.5), "color": color})

func add_text(text: String, pos: Vector2, color: Color) -> void:
	floating_text.append({"text": text, "pos": pos, "life": 1.25, "color": color})

func draw_regular_polygon(center: Vector2, radius: float, sides: int, color: Color, rotation := 0.0) -> void:
	var pts := PackedVector2Array()
	for i in range(sides):
		var a := rotation + float(i) / float(sides) * TAU
		pts.append(center + Vector2(cos(a), sin(a)) * radius)
	draw_colored_polygon(pts, color)
	pts.append(pts[0])
	draw_polyline(pts, Color.WHITE, 1.5)

func draw_text_at(pos: Vector2, text: String, color: Color = Color.WHITE, font_size: int = 14) -> void:
	draw_string(font, pos, text, HORIZONTAL_ALIGNMENT_LEFT, -1.0, font_size, color)
