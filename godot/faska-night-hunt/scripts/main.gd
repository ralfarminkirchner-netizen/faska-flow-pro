extends Control

const WORLD_W := 1840.0
const WORLD_H := 1160.0
const PLAYER_R := 18.0
const MAX_HP := 180.0
const MAX_STAMINA := 100.0
const BASE_SPEED := 285.0
const DASH_SPEED := 860.0

const LEARN_TASKS = [
	{"prompt": "Welche Wortart ist 'mutig'?", "answer": "Adjektiv", "options": ["Nomen", "Verb", "Adjektiv"]},
	{"prompt": "Welches Wort ist ein Verb?", "answer": "springen", "options": ["springen", "Stein", "hell"]},
	{"prompt": "12 x 7 = ?", "answer": "84", "options": ["72", "84", "96"]},
	{"prompt": "Was bedeutet 'shield'?", "answer": "Schild", "options": ["Schwert", "Schild", "Schule"]},
	{"prompt": "Was brauchen Pflanzen zum Wachsen?", "answer": "Licht", "options": ["Licht", "Stein", "Sanduhr"]},
	{"prompt": "Welches Wort ist ein Nomen?", "answer": "Bruecke", "options": ["Bruecke", "laufen", "weich"]}
]

var font
var rng := RandomNumberGenerator.new()
var player := {}
var enemies := []
var bullets := []
var effects := []
var particles := []
var floaters := []
var runes := []
var graves := []
var lamps := []
var camera := Vector2.ZERO
var aim_world := Vector2.ZERO
var touch_axis := Vector2.ZERO
var touch_pointer := -1
var touch_buttons := {}
var mode := "Normal"
var phase := "run"
var wave := 1
var score := 0
var combo := 0
var weapon_form := "cane"
var question_index := 0
var message := ""
var message_timer := 0.0
var shake := 0.0
var stats := {}

func _ready() -> void:
	rng.seed = 91047
	font = get_theme_default_font()
	mouse_filter = Control.MOUSE_FILTER_STOP
	focus_mode = Control.FOCUS_ALL
	grab_focus()
	reset_game()

func reset_game() -> void:
	player = {
		"pos": Vector2(WORLD_W * 0.5, WORLD_H * 0.62),
		"vel": Vector2.ZERO,
		"hp": MAX_HP,
		"stamina": MAX_STAMINA,
		"blood": 8,
		"bullets": 12,
		"lost": 0.0,
		"rally": 0.0,
		"dash": 0.0,
		"attack": 0.0,
		"attack_cd": 0.0,
		"gun_cd": 0.0,
		"cast_cd": 0.0,
		"heal_cd": 0.0,
		"invuln": 0.0,
		"fever": 0.0,
		"dir": Vector2(0.0, -1.0)
	}
	enemies.clear()
	bullets.clear()
	effects.clear()
	particles.clear()
	floaters.clear()
	touch_buttons.clear()
	touch_axis = Vector2.ZERO
	touch_pointer = -1
	mode = "Normal"
	phase = "run"
	wave = 1
	score = 0
	combo = 0
	weapon_form = "cane"
	question_index = 0
	stats = {"kills": 0, "parries": 0, "viscerals": 0, "dodges": 0, "trick": 0, "rally": 0, "learn": 0, "bosses": 0}
	build_static_world()
	build_runes()
	spawn_wave()
	message = "FASKA NIGHT HUNT - Godot 4"
	message_timer = 2.6
	shake = 0.0

func build_static_world() -> void:
	graves = [
		Rect2(180, 210, 170, 54), Rect2(1420, 215, 205, 56), Rect2(310, 820, 230, 64),
		Rect2(1250, 830, 250, 64), Rect2(790, 535, 285, 72), Rect2(810, 245, 250, 50),
		Rect2(805, 890, 250, 50), Rect2(145, 560, 92, 210), Rect2(1605, 520, 92, 230)
	]
	lamps = [Vector2(230, 350), Vector2(1600, 350), Vector2(350, 965), Vector2(1490, 970), Vector2(920, 580)]

func spawn_wave() -> void:
	var count: int = 3 + wave
	for i in range(count):
		var side: int = i % 4
		var pos := Vector2.ZERO
		if side == 0:
			pos = Vector2(rng.randf_range(90.0, WORLD_W - 90.0), 90.0)
		elif side == 1:
			pos = Vector2(WORLD_W - 90.0, rng.randf_range(90.0, WORLD_H - 90.0))
		elif side == 2:
			pos = Vector2(rng.randf_range(90.0, WORLD_W - 90.0), WORLD_H - 90.0)
		else:
			pos = Vector2(90.0, rng.randf_range(90.0, WORLD_H - 90.0))
		var kind := "hunter"
		if wave >= 3 and i == 0:
			kind = "boss"
		elif wave >= 2 and i % 4 == 0:
			kind = "beast"
		elif wave >= 2 and i % 3 == 0:
			kind = "gunner"
		spawn_enemy(kind, pos)

func spawn_enemy(kind: String, pos: Vector2) -> void:
	var hp := 42.0 + wave * 4.0
	var speed := 130.0
	var radius := 20.0
	var color := Color(0.75, 0.12, 0.18)
	if kind == "beast":
		hp = 62.0 + wave * 5.0
		speed = 178.0
		radius = 25.0
		color = Color(0.9, 0.38, 0.18)
	elif kind == "gunner":
		hp = 34.0 + wave * 3.0
		speed = 108.0
		radius = 18.0
		color = Color(0.55, 0.46, 0.95)
	elif kind == "boss":
		hp = 330.0
		speed = 96.0
		radius = 46.0
		color = Color(0.45, 0.02, 0.05)
	enemies.append({"kind": kind, "pos": pos, "vel": Vector2.ZERO, "hp": hp, "max_hp": hp, "speed": speed, "radius": radius, "color": color, "attack": rng.randf_range(0.8, 2.2), "stagger": 0.0, "phase": rng.randf_range(0.0, TAU)})

func build_runes() -> void:
	runes.clear()
	var task = LEARN_TASKS[question_index % LEARN_TASKS.size()]
	var anchors = [Vector2(430, 360), Vector2(920, 250), Vector2(1410, 360)]
	for i in range(3):
		runes.append({"pos": anchors[i], "label": String(task.options[i]), "answer": String(task.answer), "active": true, "phase": float(i) * 0.8})

func _process(delta: float) -> void:
	if not has_focus():
		grab_focus()
	if phase == "run":
		update_game(delta)
	update_effects(delta)
	queue_redraw()

func update_game(delta: float) -> void:
	update_player(delta)
	update_enemies(delta)
	update_bullets(delta)
	update_runes(delta)
	if enemies.is_empty():
		wave += 1
		score += 420 + wave * 70
		spawn_wave()
		message = "Nachtwelle " + str(wave)
		message_timer = 1.8
	if float(player.hp) <= 0.0:
		phase = "over"
		message = "Die Nacht hat dich geholt - R fuer Neustart"
		message_timer = 99.0
	camera = (Vector2(player.pos) - size * 0.5).clamp(Vector2.ZERO, Vector2(max(0.0, WORLD_W - size.x), max(0.0, WORLD_H - size.y)))

func update_player(delta: float) -> void:
	var axis := Vector2.ZERO
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		axis.x -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		axis.x += 1.0
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		axis.y -= 1.0
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		axis.y += 1.0
	if touch_axis.length() > 0.08:
		axis += touch_axis
	if axis.length() > 1.0:
		axis = axis.normalized()
	if axis.length() > 0.0:
		player.dir = axis
	var speed := BASE_SPEED
	if float(player.dash) > 0.0:
		speed = DASH_SPEED
		player.invuln = max(float(player.invuln), 0.08)
	player.vel = Vector2(player.vel).lerp(axis * speed, min(1.0, delta * 8.0))
	move_player(Vector2(player.vel) * delta)
	player.stamina = min(MAX_STAMINA, float(player.stamina) + delta * 28.0)
	player.dash = max(0.0, float(player.dash) - delta)
	player.attack = max(0.0, float(player.attack) - delta)
	player.attack_cd = max(0.0, float(player.attack_cd) - delta)
	player.gun_cd = max(0.0, float(player.gun_cd) - delta)
	player.cast_cd = max(0.0, float(player.cast_cd) - delta)
	player.heal_cd = max(0.0, float(player.heal_cd) - delta)
	player.invuln = max(0.0, float(player.invuln) - delta)
	player.fever = max(0.0, float(player.fever) - delta)
	player.rally = max(0.0, float(player.rally) - delta)
	if float(player.rally) <= 0.0:
		player.lost = max(0.0, float(player.lost) - delta * 20.0)
	aim_world = screen_to_world(get_local_mouse_position())
	if Input.is_key_pressed(KEY_J):
		start_attack()

func move_player(delta_pos: Vector2) -> void:
	var pos := Vector2(player.pos)
	var try_x := Vector2(clamp(pos.x + delta_pos.x, PLAYER_R, WORLD_W - PLAYER_R), pos.y)
	if not circle_hits_wall(try_x, PLAYER_R):
		pos.x = try_x.x
	else:
		player.vel = Vector2(0.0, Vector2(player.vel).y)
	var try_y := Vector2(pos.x, clamp(pos.y + delta_pos.y, PLAYER_R, WORLD_H - PLAYER_R))
	if not circle_hits_wall(try_y, PLAYER_R):
		pos.y = try_y.y
	else:
		player.vel = Vector2(Vector2(player.vel).x, 0.0)
	player.pos = pos

func start_dash() -> void:
	if float(player.stamina) < 22.0 or float(player.dash) > 0.0:
		return
	var dir := Vector2(player.dir)
	if dir.length() < 0.1:
		dir = (aim_world - Vector2(player.pos)).normalized()
	player.dir = dir.normalized()
	player.vel = Vector2(player.dir) * DASH_SPEED
	player.dash = 0.18
	player.invuln = 0.24
	player.stamina = max(0.0, float(player.stamina) - 22.0)
	stats.dodges += 1
	add_text("DODGE", Vector2(player.pos), Color(0.52, 0.82, 1.0))

func start_attack() -> void:
	if float(player.attack_cd) > 0.0 or float(player.stamina) < 14.0:
		return
	var dir := (aim_world - Vector2(player.pos)).normalized()
	if dir.length() < 0.1:
		dir = Vector2(player.dir)
	player.dir = dir
	player.attack = 0.18
	player.attack_cd = 0.36 if weapon_form == "cane" else 0.55
	player.stamina = max(0.0, float(player.stamina) - (15.0 if weapon_form == "cane" else 24.0))
	var reach := 78.0 if weapon_form == "cane" else 122.0
	var damage := 21.0 if weapon_form == "cane" else 34.0
	if float(player.fever) > 0.0:
		damage *= 1.55
	var hit_any := false
	for i in range(enemies.size() - 1, -1, -1):
		var e = enemies[i]
		var to_enemy: Vector2 = Vector2(e.pos) - Vector2(player.pos)
		var in_arc := to_enemy.length() < reach + float(e.radius) and dir.dot(to_enemy.normalized()) > 0.28
		if in_arc:
			hit_enemy(i, damage, "trick" if weapon_form == "scythe" else "melee")
			hit_any = true
	if hit_any:
		recover_rally(damage * 0.42)

func fire_gun() -> void:
	if int(player.bullets) <= 0 or float(player.gun_cd) > 0.0:
		add_text("Keine Blutkugeln", Vector2(player.pos), Color(1.0, 0.35, 0.26))
		return
	player.bullets -= 1
	player.gun_cd = 0.48
	var dir := (aim_world - Vector2(player.pos)).normalized()
	if dir.length() < 0.1:
		dir = Vector2(player.dir)
	bullets.append({"pos": Vector2(player.pos) + dir * 25.0, "vel": dir * 820.0, "life": 0.65, "damage": 10.0, "color": Color(0.95, 0.78, 0.42), "from_player": true})

func cast_focus() -> void:
	if float(player.cast_cd) > 0.0 or float(player.stamina) < 28.0:
		return
	player.cast_cd = 1.4
	player.stamina = max(0.0, float(player.stamina) - 28.0)
	stats.focus = int(stats.get("focus", 0)) + 1
	var pos := Vector2(player.pos)
	for i in range(enemies.size() - 1, -1, -1):
		var e = enemies[i]
		if Vector2(e.pos).distance_to(pos) < 175.0:
			hit_enemy(i, 28.0, "focus")
	add_effect(pos, 180.0, Color(0.55, 0.35, 1.0))

func use_vial() -> void:
	if int(player.blood) <= 0 or float(player.heal_cd) > 0.0:
		return
	player.blood -= 1
	player.heal_cd = 1.0
	player.hp = min(MAX_HP, float(player.hp) + 42.0)
	player.lost = 0.0
	add_text("BLOOD VIAL", Vector2(player.pos), Color(0.95, 0.18, 0.22))

func transform_weapon() -> void:
	weapon_form = "scythe" if weapon_form == "cane" else "cane"
	stats.trick += 1
	add_text("TRICK " + weapon_form.to_upper(), Vector2(player.pos), Color(0.9, 0.75, 1.0))

func update_enemies(delta: float) -> void:
	for i in range(enemies.size() - 1, -1, -1):
		var e = enemies[i]
		e.stagger = max(0.0, float(e.stagger) - delta)
		e.phase = float(e.phase) + delta
		if float(e.stagger) > 0.0:
			enemies[i] = e
			continue
		var to_player: Vector2 = Vector2(player.pos) - Vector2(e.pos)
		var dist: float = max(1.0, to_player.length())
		var desired := to_player / dist
		if String(e.kind) == "beast":
			desired = desired.rotated(sin(float(e.phase) * 3.0) * 0.45)
		e.vel = Vector2(e.vel).lerp(desired * float(e.speed), min(1.0, delta * 3.6))
		var next := Vector2(e.pos) + Vector2(e.vel) * delta
		if not circle_hits_wall(next, float(e.radius)):
			e.pos = next
		e.attack = float(e.attack) - delta
		if String(e.kind) == "gunner" and float(e.attack) <= 0.0 and dist < 620.0:
			e.attack = rng.randf_range(1.0, 1.9)
			fire_enemy_bullet(e)
		elif float(e.attack) <= 0.0 and dist < float(e.radius) + PLAYER_R + 34.0:
			e.attack = rng.randf_range(0.85, 1.5)
			enemy_strike(e)
		enemies[i] = e

func enemy_strike(e) -> void:
	var damage := 10.0 if String(e.kind) != "boss" else 22.0
	if float(player.invuln) > 0.0:
		add_text("PERFECT", Vector2(player.pos), Color(0.45, 0.85, 1.0))
		stats.dodges += 1
		return
	damage_player(damage, "Biss")

func fire_enemy_bullet(e) -> void:
	var dir := (Vector2(player.pos) - Vector2(e.pos)).normalized()
	bullets.append({"pos": Vector2(e.pos), "vel": dir * 410.0, "life": 2.0, "damage": 8.0, "color": Color(0.75, 0.18, 1.0), "from_player": false})

func update_bullets(delta: float) -> void:
	for i in range(bullets.size() - 1, -1, -1):
		var b = bullets[i]
		b.pos = Vector2(b.pos) + Vector2(b.vel) * delta
		b.life = float(b.life) - delta
		var remove := false
		if bool(b.from_player):
			for e_i in range(enemies.size() - 1, -1, -1):
				var e = enemies[e_i]
				if Vector2(b.pos).distance_to(Vector2(e.pos)) < float(e.radius) + 7.0:
					if Vector2(player.pos).distance_to(Vector2(e.pos)) < 220.0 and float(e.attack) < 0.3:
						e.stagger = 1.25
						stats.parries += 1
						add_text("PARRY", Vector2(e.pos), Color(1.0, 0.84, 0.36))
						enemies[e_i] = e
					hit_enemy(e_i, float(b.damage), "gun")
					remove = true
					break
		else:
			if Vector2(b.pos).distance_to(Vector2(player.pos)) < PLAYER_R + 7.0:
				damage_player(float(b.damage), "Schuss")
				remove = true
		if float(b.life) <= 0.0 or point_outside(Vector2(b.pos)) or circle_hits_wall(Vector2(b.pos), 5.0):
			remove = true
		if remove:
			bullets.remove_at(i)
		else:
			bullets[i] = b

func hit_enemy(index: int, damage: float, source: String) -> void:
	if index < 0 or index >= enemies.size():
		return
	var e = enemies[index]
	if float(e.stagger) > 0.0 and source == "melee":
		damage *= 2.4
		stats.viscerals += 1
		add_text("VISCERAL", Vector2(e.pos), Color(1.0, 0.1, 0.16))
	if source == "trick":
		stats.trick += 1
	e.hp = float(e.hp) - damage
	spawn_sparks(Vector2(e.pos), e.color, 10)
	if float(e.hp) <= 0.0:
		var points := 160
		if String(e.kind) == "boss":
			points = 2200
			stats.bosses += 1
		elif String(e.kind) == "beast":
			points = 230
		combo += 1
		stats.kills += 1
		score += points + combo * 22
		if combo > 7 and float(player.fever) <= 0.0:
			player.fever = 7.0
			add_text("BLUTFIEBER", Vector2(player.pos), Color(1.0, 0.16, 0.25))
		add_text("+" + str(points), Vector2(e.pos), Color(1.0, 0.86, 0.28))
		spawn_sparks(Vector2(e.pos), Color(1.0, 0.18, 0.16), 18)
		enemies.remove_at(index)
	else:
		enemies[index] = e

func recover_rally(amount: float) -> void:
	if float(player.lost) <= 0.0 or float(player.rally) <= 0.0:
		return
	var heal: float = min(float(player.lost), amount)
	player.hp = min(MAX_HP, float(player.hp) + heal)
	player.lost = max(0.0, float(player.lost) - heal)
	stats.rally += int(heal)
	add_text("RALLY +" + str(int(heal)), Vector2(player.pos), Color(0.35, 1.0, 0.58))

func damage_player(amount: float, reason: String) -> void:
	if float(player.invuln) > 0.0:
		return
	player.hp = max(0.0, float(player.hp) - amount)
	player.lost = min(55.0, float(player.lost) + amount)
	player.rally = 4.2
	combo = 0
	shake = 1.0
	add_text(reason + " -" + str(int(amount)), Vector2(player.pos), Color(1.0, 0.22, 0.2))

func update_runes(_delta: float) -> void:
	if mode != "Learncade":
		return
	for rune in runes:
		if bool(rune.active) and Vector2(player.pos).distance_to(Vector2(rune.pos)) < 56.0:
			if String(rune.label) == String(rune.answer):
				stats.learn += 1
				score += 650
				player.blood += 1
				add_text("RICHTIG", Vector2(rune.pos), Color(0.35, 1.0, 0.52))
			else:
				damage_player(14.0, "Falsche Rune")
				add_text("FALSCH", Vector2(rune.pos), Color(1.0, 0.22, 0.18))
			question_index += 1
			build_runes()
			return

func toggle_learncade() -> void:
	mode = "Learncade" if mode == "Normal" else "Normal"
	message = "Learncade: beruehre die richtige Rune." if mode == "Learncade" else "Normalmodus aktiv."
	message_timer = 2.4
	if mode == "Learncade":
		build_runes()

func _unhandled_input(event) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		match event.keycode:
			KEY_R:
				reset_game()
			KEY_L:
				toggle_learncade()
			KEY_SPACE, KEY_K:
				start_dash()
			KEY_Q:
				fire_gun()
			KEY_H:
				use_vial()
			KEY_F:
				transform_weapon()
			KEY_E:
				cast_focus()

func _gui_input(event) -> void:
	if event is InputEventMouseMotion:
		aim_world = screen_to_world(event.position)
	elif event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_LEFT:
			aim_world = screen_to_world(event.position)
			start_attack()
		elif event.button_index == MOUSE_BUTTON_RIGHT:
			fire_gun()
	elif event is InputEventScreenTouch:
		if event.pressed:
			handle_touch_press(event.index, event.position)
		else:
			if event.index == touch_pointer:
				touch_pointer = -1
				touch_axis = Vector2.ZERO
	elif event is InputEventScreenDrag:
		if event.index == touch_pointer:
			var origin := Vector2(100, size.y - 100)
			touch_axis = (event.position - origin) / 76.0
			if touch_axis.length() > 1.0:
				touch_axis = touch_axis.normalized()

func handle_touch_press(pointer_id: int, pos: Vector2) -> void:
	if pos.x < size.x * 0.42 and pos.y > size.y * 0.56:
		touch_pointer = pointer_id
		var origin := Vector2(100, size.y - 100)
		touch_axis = (pos - origin) / 76.0
		if touch_axis.length() > 1.0:
			touch_axis = touch_axis.normalized()
		return
	for name in touch_buttons.keys():
		if touch_buttons[name].has_point(pos):
			if name == "atk":
				start_attack()
			elif name == "dash":
				start_dash()
			elif name == "gun":
				fire_gun()
			elif name == "learn":
				toggle_learncade()
			elif name == "vial":
				use_vial()

func add_effect(pos: Vector2, radius: float, color: Color) -> void:
	effects.append({"pos": pos, "radius": radius, "life": 0.32, "max": 0.32, "color": color})

func update_effects(delta: float) -> void:
	message_timer = max(0.0, message_timer - delta)
	shake = max(0.0, shake - delta * 7.0)
	for i in range(effects.size() - 1, -1, -1):
		var e = effects[i]
		e.life = float(e.life) - delta
		if float(e.life) <= 0.0:
			effects.remove_at(i)
		else:
			effects[i] = e
	for i in range(floaters.size() - 1, -1, -1):
		var f = floaters[i]
		f.life = float(f.life) - delta
		f.pos = Vector2(f.pos) + Vector2(0, -38) * delta
		f.color.a = clamp(float(f.life), 0.0, 1.0)
		if float(f.life) <= 0.0:
			floaters.remove_at(i)
		else:
			floaters[i] = f
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

func circle_hits_wall(pos: Vector2, radius: float) -> bool:
	for wall in graves:
		var nearest := Vector2(clamp(pos.x, wall.position.x, wall.position.x + wall.size.x), clamp(pos.y, wall.position.y, wall.position.y + wall.size.y))
		if nearest.distance_to(pos) <= radius:
			return true
	return false

func point_outside(pos: Vector2) -> bool:
	return pos.x < -50.0 or pos.y < -50.0 or pos.x > WORLD_W + 50.0 or pos.y > WORLD_H + 50.0

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
	draw_runes()
	draw_bullets()
	draw_enemies()
	draw_player()
	draw_effect_layer()
	draw_hud()
	draw_touch_controls()
	draw_messages()

func draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color(0.025, 0.018, 0.038))
	for i in range(24):
		var x := fmod(float(i) * 86.0 - fmod(camera.x, 86.0), size.x + 100.0) - 50.0
		draw_line(Vector2(x, 0), Vector2(x + 120, size.y), Color(0.09, 0.06, 0.12, 0.25), 1.0)

func draw_world() -> void:
	var rect := Rect2(world_to_screen(Vector2.ZERO), Vector2(WORLD_W, WORLD_H))
	draw_rect(rect, Color(0.045, 0.055, 0.07))
	draw_rect(rect, Color(0.45, 0.52, 0.62, 0.28), false, 4.0)
	for lamp in lamps:
		var lp := world_to_screen(lamp)
		draw_circle(lp, 86.0, Color(0.6, 0.45, 0.18, 0.08))
		draw_circle(lp, 9.0, Color(1.0, 0.75, 0.3))
	for wall in graves:
		var wr := Rect2(world_to_screen(wall.position), wall.size)
		draw_rect(wr, Color(0.12, 0.16, 0.21))
		draw_rect(wr, Color(0.5, 0.62, 0.76, 0.36), false, 2.0)

func draw_runes() -> void:
	if mode != "Learncade":
		return
	var task = LEARN_TASKS[question_index % LEARN_TASKS.size()]
	draw_text_at(Vector2(size.x * 0.34, 34), String(task.prompt), Color(0.82, 0.9, 1.0), 16)
	for rune in runes:
		var p := world_to_screen(Vector2(rune.pos))
		draw_circle(p, 46.0, Color(0.18, 0.22, 0.55, 0.55))
		draw_arc(p, 52.0, 0.0, TAU, 36, Color(0.55, 0.72, 1.0), 4.0)
		draw_text_at(p + Vector2(-34, 5), String(rune.label), Color(0.95, 0.98, 1.0), 13)

func draw_bullets() -> void:
	for b in bullets:
		var p := world_to_screen(Vector2(b.pos))
		draw_circle(p, 5.0, b.color)
		draw_line(p - Vector2(b.vel).normalized() * 18.0, p, b.color, 2.0)

func draw_enemies() -> void:
	for e in enemies:
		var p := world_to_screen(Vector2(e.pos))
		var radius := float(e.radius)
		if float(e.stagger) > 0.0:
			draw_circle(p, radius + 13.0, Color(1.0, 0.9, 0.35, 0.35))
		if String(e.kind) == "boss":
			draw_circle(p, radius + 16.0, Color(0.25, 0.0, 0.02))
			draw_regular_polygon(p, radius, 8, e.color, float(e.phase))
		elif String(e.kind) == "beast":
			draw_regular_polygon(p, radius, 5, e.color, float(e.phase))
		else:
			draw_regular_polygon(p, radius, 4, e.color, float(e.phase))
		var hp_ratio: float = clamp(float(e.hp) / float(e.max_hp), 0.0, 1.0)
		draw_rect(Rect2(p + Vector2(-26, radius + 8), Vector2(52, 5)), Color(0.08, 0.02, 0.03))
		draw_rect(Rect2(p + Vector2(-26, radius + 8), Vector2(52 * hp_ratio, 5)), Color(0.9, 0.08, 0.12))

func draw_player() -> void:
	var p := world_to_screen(Vector2(player.pos))
	var dir := (aim_world - Vector2(player.pos)).normalized()
	if dir.length() < 0.1:
		dir = Vector2(player.dir)
	var side := dir.orthogonal()
	var color := Color(0.45, 0.72, 1.0) if float(player.fever) <= 0.0 else Color(1.0, 0.18, 0.24)
	draw_colored_polygon(PackedVector2Array([p + dir * 28, p - dir * 16 + side * 16, p - dir * 9, p - dir * 16 - side * 16]), color)
	if float(player.attack) > 0.0:
		var reach := 86.0 if weapon_form == "cane" else 132.0
		draw_arc(p, reach, dir.angle() - 0.72, dir.angle() + 0.72, 32, Color(0.92, 0.82, 1.0, 0.76), 5.0)
	draw_circle(p, PLAYER_R + 3.0, Color(1.0, 1.0, 1.0, 0.18), false, 2.0)

func draw_effect_layer() -> void:
	for e in effects:
		var p := world_to_screen(Vector2(e.pos))
		var t: float = 1.0 - float(e.life) / float(e.max)
		draw_circle(p, float(e.radius) * t, Color(e.color, 0.24 * (1.0 - t)))
	for part in particles:
		draw_circle(world_to_screen(Vector2(part.pos)), float(part.size), part.color)

func draw_hud() -> void:
	draw_rect(Rect2(Vector2(10, 10), Vector2(342, 124)), Color(0.0, 0.0, 0.0, 0.62))
	draw_text_at(Vector2(20, 31), "FASKA NIGHT HUNT - GODOT 4", Color(0.95, 0.72, 0.92), 18)
	draw_bar(Vector2(20, 50), "HP", float(player.hp), MAX_HP, Color(0.92, 0.08, 0.16))
	if float(player.lost) > 0.0:
		draw_rect(Rect2(Vector2(101, 40), Vector2(180.0 * clamp(float(player.lost) / MAX_HP, 0.0, 1.0), 7)), Color(1.0, 0.8, 0.35, 0.65))
	draw_bar(Vector2(20, 72), "STAM", float(player.stamina), MAX_STAMINA, Color(0.38, 0.92, 0.62))
	draw_text_at(Vector2(20, 105), "Score " + str(score) + " Combo " + str(combo) + " Mode " + mode, Color(0.86, 0.92, 1.0), 13)
	draw_rect(Rect2(Vector2(size.x - 284, 10), Vector2(270, 96)), Color(0.0, 0.0, 0.0, 0.55))
	draw_text_at(Vector2(size.x - 272, 32), "Weapon " + weapon_form.to_upper(), Color(0.94, 0.98, 1.0), 15)
	draw_text_at(Vector2(size.x - 272, 55), "Blood " + str(player.blood) + "  Bullets " + str(player.bullets), Color(0.94, 0.98, 1.0), 14)
	draw_text_at(Vector2(size.x - 272, 78), "Wave " + str(wave) + "  Kills " + str(stats.kills), Color(0.94, 0.98, 1.0), 14)
	if float(player.fever) > 0.0:
		draw_text_at(Vector2(size.x * 0.45, 32), "BLUTFIEBER " + str(int(ceil(float(player.fever)))), Color(1.0, 0.28, 0.36), 18)

func draw_bar(pos: Vector2, label: String, value: float, max_value: float, color: Color) -> void:
	draw_text_at(pos, label, Color(0.76, 0.82, 0.9), 12)
	draw_rect(Rect2(pos + Vector2(80, -10), Vector2(180, 8)), Color(0.07, 0.06, 0.08))
	draw_rect(Rect2(pos + Vector2(80, -10), Vector2(180 * clamp(value / max_value, 0.0, 1.0), 8)), color)

func draw_touch_controls() -> void:
	touch_buttons.clear()
	var origin := Vector2(100, size.y - 100)
	draw_arc(origin, 66, 0.0, TAU, 36, Color(0.6, 0.75, 1.0, 0.3), 3.0)
	draw_circle(origin + touch_axis * 44.0, 23.0, Color(0.33, 0.62, 1.0, 0.4))
	var buttons = [
		["atk", "ATK", Vector2(size.x - 90, size.y - 96)],
		["dash", "DASH", Vector2(size.x - 172, size.y - 134)],
		["gun", "GUN", Vector2(size.x - 252, size.y - 96)],
		["vial", "VIAL", Vector2(size.x - 172, size.y - 54)],
		["learn", "LERN", Vector2(size.x - 334, size.y - 96)]
	]
	for item in buttons:
		var rect := Rect2(item[2] - Vector2(35, 24), Vector2(70, 48))
		touch_buttons[item[0]] = rect
		draw_rect(rect, Color(0.03, 0.05, 0.09, 0.72))
		draw_rect(rect, Color(0.65, 0.76, 1.0, 0.52), false, 2.0)
		draw_text_at(rect.position + Vector2(10, 31), item[1], Color(0.94, 0.97, 1.0), 12)

func draw_messages() -> void:
	if message_timer > 0.0:
		draw_rect(Rect2(Vector2(size.x * 0.31, 12), Vector2(size.x * 0.38, 30)), Color(0.0, 0.0, 0.0, 0.64))
		draw_text_at(Vector2(size.x * 0.32, 33), message, Color(0.95, 0.98, 1.0), 14)
	for f in floaters:
		draw_text_at(world_to_screen(Vector2(f.pos)), String(f.text), f.color, 16)
	if phase == "over":
		draw_rect(Rect2(Vector2(size.x * 0.25, size.y * 0.38), Vector2(size.x * 0.5, 116)), Color(0.0, 0.0, 0.0, 0.78))
		draw_text_at(Vector2(size.x * 0.38, size.y * 0.44), "HUNT FAILED", Color(1.0, 0.22, 0.26), 28)
		draw_text_at(Vector2(size.x * 0.35, size.y * 0.49), "Score " + str(score) + " - R fuer Neustart", Color(0.9, 0.96, 1.0), 16)

func spawn_sparks(pos: Vector2, color: Color, count := 9) -> void:
	for i in range(count):
		particles.append({"pos": pos, "vel": Vector2(rng.randf_range(-135, 135), rng.randf_range(-135, 135)), "life": rng.randf_range(0.24, 0.72), "size": rng.randf_range(2.0, 5.0), "color": color})

func add_text(text: String, pos: Vector2, color: Color) -> void:
	floaters.append({"text": text, "pos": pos, "life": 1.25, "color": color})

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
