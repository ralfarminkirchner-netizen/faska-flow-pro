extends Node3D

const GRAVITY := 31.0
const MOVE_SPEED := 9.5
const AIR_SPEED := 6.2
const ACCEL := 12.0
const JUMP_FORCE := 12.7
const DOUBLE_JUMP_FORCE := 11.4
const SPIN_DURATION := 0.42
const DIVE_SPEED := 17.0
const MAX_HP := 5
const LEARN_GOAL := 5

const LEARN_TASKS := [
	{
		"prompt": "Wortarten-Gate: Welche Wortart ist 'springt'?",
		"answers": ["Verb", "Nomen", "Adjektiv"],
		"correct": 0,
		"hint": "Ein Verb sagt, was jemand tut.",
	},
	{
		"prompt": "Lesetor: Welche Silbe hoerst du zuerst in 'Rakete'?",
		"answers": ["Ra", "ke", "te"],
		"correct": 0,
		"hint": "Sprich das Wort langsam: Ra-ke-te.",
	},
	{
		"prompt": "Satzbruecke: Was passt? Der Hund ___ schnell.",
		"answers": ["rennt", "Hund", "schnell"],
		"correct": 0,
		"hint": "Gesucht ist die Taetigkeit im Satz.",
	},
	{
		"prompt": "Komposita-Tor: Welches Wort ist zusammengesetzt?",
		"answers": ["Baumhaus", "laufen", "gruen"],
		"correct": 0,
		"hint": "Baum + Haus wird Baumhaus.",
	},
	{
		"prompt": "Mathe-Ring: Was ist 7 + 5?",
		"answers": ["10", "12", "14"],
		"correct": 1,
		"hint": "7 + 3 = 10, dann noch 2 dazu.",
	},
	{
		"prompt": "Lesetor: Welches Wort reimt sich auf Haus?",
		"answers": ["Maus", "Hase", "Baum"],
		"correct": 0,
		"hint": "Haus und Maus enden gleich.",
	},
	{
		"prompt": "Geo-Tor: Welcher Kontinent passt zu Brasilien?",
		"answers": ["Europa", "Suedamerika", "Asien"],
		"correct": 1,
		"hint": "Brasilien liegt in Suedamerika.",
	},
	{
		"prompt": "Adjektiv-Tor: Welches Wort beschreibt eine Eigenschaft?",
		"answers": ["mutig", "Katze", "springt"],
		"correct": 0,
		"hint": "Mutig beschreibt, wie jemand ist.",
	},
	{
		"prompt": "Mathe-Ring: Welche Zahl fehlt? 4, 6, 8, __",
		"answers": ["9", "10", "12"],
		"correct": 1,
		"hint": "Die Reihe springt immer +2.",
	},
]

class TouchOverlay:
	extends Control

	var move_vector := Vector2.ZERO
	var buttons := {
		"jump": false,
		"spin": false,
		"dive": false,
		"learn": false,
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

	func _stick_center() -> Vector2:
		var size := get_viewport_rect().size
		return Vector2(94.0, size.y - 102.0)

	func _button_centers() -> Dictionary:
		var size := get_viewport_rect().size
		return {
			"jump": Vector2(size.x - 92.0, size.y - 134.0),
			"spin": Vector2(size.x - 176.0, size.y - 88.0),
			"dive": Vector2(size.x - 92.0, size.y - 60.0),
			"learn": Vector2(size.x - 252.0, size.y - 58.0),
		}

	func _is_on_stick(pos: Vector2) -> bool:
		return pos.distance_to(_stick_center()) <= 86.0

	func _button_at(pos: Vector2) -> String:
		for name in _button_centers().keys():
			if pos.distance_to(_button_centers()[name]) <= 42.0:
				return name
		return ""

	func _update_stick(pos: Vector2) -> void:
		var raw := pos - _stick_center()
		move_vector = raw.limit_length(56.0) / 56.0
		queue_redraw()

	func _draw() -> void:
		var font := get_theme_default_font()
		var center := _stick_center()
		draw_circle(center, 62.0, Color(0.02, 0.08, 0.13, 0.48))
		draw_arc(center, 62.0, 0.0, TAU, 48, Color(0.65, 0.86, 1.0, 0.48), 3.0)
		draw_circle(center + move_vector * 42.0, 27.0, Color(0.25, 0.85, 1.0, 0.86))
		var labels := {
			"jump": ["A", "JUMP"],
			"spin": ["X", "SPIN"],
			"dive": ["C", "DIVE"],
			"learn": ["L", "LEARN"],
		}
		for name in _button_centers().keys():
			var button_center: Vector2 = _button_centers()[name]
			var fill := Color(0.04, 0.08, 0.17, 0.74)
			if is_down(name):
				fill = Color(0.18, 0.56, 0.95, 0.92)
			draw_circle(button_center, 38.0, fill)
			draw_arc(button_center, 38.0, 0.0, TAU, 48, Color(0.79, 0.91, 1.0, 0.62), 2.0)
			draw_string(font, button_center + Vector2(-24.0, -8.0), labels[name][0], HORIZONTAL_ALIGNMENT_CENTER, 48.0, 14, Color.WHITE)
			draw_string(font, button_center + Vector2(-28.0, 12.0), labels[name][1], HORIZONTAL_ALIGNMENT_CENTER, 56.0, 8, Color(0.82, 0.92, 1.0))

var player: CharacterBody3D
var player_visual: Node3D
var camera: Camera3D
var hud: Label
var message_label: Label
var touch_overlay: TouchOverlay

var camera_yaw := 0.38
var jump_count := 0
var spin_timer := 0.0
var dive_timer := 0.0
var hurt_timer := 0.0
var hp := MAX_HP
var score := 0
var notes := 0
var shards := 0
var rings := 0
var learn_hits := 0
var quiz_index := 0
var learn_mode := true
var finished := false
var spawn_point := Vector3(0.0, 3.2, 0.0)
var feedback_text := "Laufe durch das richtige Antwort-Tor. 5 richtige Aufgaben oeffnen das Abschluss-Tor."
var feedback_timer := 5.0
var last_touch_learn := false
var last_touch_jump := false
var last_touch_spin := false
var last_touch_dive := false

var collectibles := []
var enemies := []
var moving_platforms := []
var jump_pads := []
var labels_3d := []
var gates := []
var portal: Node3D
var guardian: Node3D
var guardian_hp := 3
var guardian_hurt_timer := 0.0

func _ready() -> void:
	Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)
	_build_scene()
	_build_player()
	_build_level()
	_build_ui()
	_setup_question()
	_update_hud()

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseMotion and Input.is_mouse_button_pressed(MOUSE_BUTTON_RIGHT):
		camera_yaw -= event.relative.x * 0.006
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_R:
			_reset_run()
		elif event.keycode == KEY_L:
			learn_mode = not learn_mode
			_set_message("Learncade aktiv" if learn_mode else "Normalmodus")
			_setup_question()

func _physics_process(delta: float) -> void:
	if finished:
		_update_camera(delta)
		_update_labels()
		return

	_update_touch_toggles()
	_update_moving_platforms(delta)
	_update_player(delta)
	_update_collectibles(delta)
	_update_enemies(delta)
	_update_guardian(delta)
	_update_jump_pads()
	_update_gates()
	_update_portal(delta)
	_update_camera(delta)
	_update_labels()
	_update_hud()
	_update_message(delta)
	if player.global_position.y < -18.0:
		_damage_player(1, "Zurueck zur Insel")
		_respawn()

func _build_scene() -> void:
	var environment_node := WorldEnvironment.new()
	var environment := Environment.new()
	environment.background_mode = Environment.BG_COLOR
	environment.background_color = Color(0.48, 0.78, 0.98)
	environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	environment.ambient_light_color = Color(0.78, 0.88, 1.0)
	environment.ambient_light_energy = 0.82
	environment.fog_enabled = true
	environment.fog_light_color = Color(0.64, 0.82, 0.94)
	environment.fog_density = 0.012
	environment_node.environment = environment
	add_child(environment_node)

	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-48.0, -32.0, 0.0)
	sun.light_energy = 2.25
	sun.shadow_enabled = true
	add_child(sun)

	var fill := OmniLight3D.new()
	fill.position = Vector3(0.0, 8.0, 0.0)
	fill.light_energy = 0.55
	fill.omni_range = 40.0
	add_child(fill)

	camera = Camera3D.new()
	camera.current = true
	camera.fov = 64.0
	add_child(camera)

func _build_player() -> void:
	player = CharacterBody3D.new()
	player.name = "Player"
	player.position = spawn_point
	player.floor_snap_length = 0.35
	player.safe_margin = 0.05
	var collider := CollisionShape3D.new()
	var shape := CapsuleShape3D.new()
	shape.radius = 0.42
	shape.height = 1.35
	collider.shape = shape
	collider.position.y = 0.88
	player.add_child(collider)

	player_visual = Node3D.new()
	player_visual.name = "FaskaKid"
	player.add_child(player_visual)

	var body := MeshInstance3D.new()
	var body_mesh := CapsuleMesh.new()
	body_mesh.radius = 0.42
	body_mesh.height = 1.25
	body.mesh = body_mesh
	body.position.y = 0.9
	body.material_override = _mat(Color(0.96, 0.58, 0.18), true)
	player_visual.add_child(body)

	var head := MeshInstance3D.new()
	var head_mesh := SphereMesh.new()
	head_mesh.radius = 0.42
	head_mesh.height = 0.84
	head.mesh = head_mesh
	head.position.y = 1.65
	head.material_override = _mat(Color(1.0, 0.78, 0.35), false)
	player_visual.add_child(head)

	var nose := MeshInstance3D.new()
	var nose_mesh := SphereMesh.new()
	nose_mesh.radius = 0.13
	nose_mesh.height = 0.26
	nose.mesh = nose_mesh
	nose.position = Vector3(0.0, 1.65, -0.44)
	nose.material_override = _mat(Color(0.11, 0.18, 0.33), false)
	player_visual.add_child(nose)

	add_child(player)

func _build_level() -> void:
	_create_platform(Vector3(0.0, 0.0, 0.0), Vector3(12.0, 1.0, 12.0), Color(0.29, 0.72, 0.36), "Lernpark")
	_create_platform(Vector3(13.2, 1.35, -7.0), Vector3(8.6, 1.0, 8.2), Color(0.95, 0.67, 0.28), "Wuesteninsel")
	_create_platform(Vector3(-13.2, 2.3, -8.6), Vector3(8.2, 1.0, 8.2), Color(0.46, 0.77, 0.94), "Eisplateau")
	_create_platform(Vector3(12.8, 3.35, 8.4), Vector3(7.6, 1.0, 7.6), Color(0.52, 0.36, 0.78), "Sternwarte")
	_create_platform(Vector3(-14.0, 4.5, 8.8), Vector3(8.0, 1.0, 7.0), Color(0.42, 0.25, 0.17), "Wipfelpfad")
	_create_platform(Vector3(0.0, 6.0, 17.5), Vector3(9.6, 1.0, 7.2), Color(0.23, 0.36, 0.76), "Himmelstor")
	_create_platform(Vector3(0.0, 2.2, -20.0), Vector3(10.0, 1.0, 6.4), Color(0.47, 0.20, 0.16), "Vulkankante")

	_create_platform(Vector3(6.4, 0.7, -3.0), Vector3(4.0, 0.45, 2.2), Color(0.55, 0.39, 0.24), "")
	_create_platform(Vector3(-6.8, 1.2, -3.4), Vector3(3.8, 0.45, 2.2), Color(0.55, 0.39, 0.24), "")
	_create_platform(Vector3(8.6, 2.35, 3.6), Vector3(3.0, 0.4, 2.0), Color(0.55, 0.39, 0.24), "")
	_create_moving_platform(Vector3(-5.2, 2.8, 5.7), Vector3(-10.5, 3.75, 7.2), Vector3(3.2, 0.35, 2.2), 0.8)
	_create_moving_platform(Vector3(4.8, 4.15, 12.2), Vector3(0.8, 5.35, 15.2), Vector3(3.0, 0.35, 2.0), 1.1)

	for pos in [
		Vector3(2.4, 1.2, 1.5), Vector3(-2.5, 1.2, 2.1), Vector3(5.0, 1.65, -4.4),
		Vector3(12.1, 2.55, -6.2), Vector3(15.4, 2.55, -9.4), Vector3(-12.5, 3.55, -7.1),
		Vector3(-16.0, 3.55, -10.2), Vector3(12.4, 4.55, 8.7), Vector3(-13.7, 5.75, 8.6),
		Vector3(0.0, 7.35, 17.5), Vector3(0.2, 3.35, -20.5), Vector3(-3.2, 1.2, -2.8)
	]:
		_create_collectible(pos, "note")

	for pos in [
		Vector3(13.3, 2.75, -7.0), Vector3(-13.2, 3.75, -8.6), Vector3(12.8, 4.7, 8.4),
		Vector3(-14.0, 5.9, 8.8), Vector3(0.0, 7.25, 17.5), Vector3(0.0, 3.55, -20.0),
		Vector3(-6.5, 3.4, 6.4)
	]:
		_create_collectible(pos, "shard")

	for pos in [
		Vector3(4.4, 2.3, 1.6), Vector3(9.1, 3.7, -2.8), Vector3(-8.0, 4.4, -2.8),
		Vector3(2.8, 7.7, 13.8)
	]:
		_create_collectible(pos, "ring")

	_create_enemy(Vector3(3.7, 1.0, -3.7), 0.0)
	_create_enemy(Vector3(-11.8, 3.25, -9.8), 1.7)
	_create_enemy(Vector3(12.2, 2.35, -9.6), 3.4)
	_create_enemy(Vector3(-13.7, 5.35, 8.8), 4.1)

	_create_jump_pad(Vector3(5.8, 1.15, 4.8), 16.0)
	_create_jump_pad(Vector3(-6.6, 2.35, -7.3), 18.0)
	_create_jump_pad(Vector3(3.4, 6.7, 14.0), 14.0)

	_build_learn_gates()
	_create_label("5 richtige Antwort-Tore oeffnen das Abschluss-Tor.", Vector3(0.0, 1.25, 4.0), Color(0.05, 0.09, 0.16))
	_build_guardian()
	_build_portal()

func _build_ui() -> void:
	var layer := CanvasLayer.new()
	add_child(layer)

	var hud_back := ColorRect.new()
	hud_back.color = Color(0.02, 0.04, 0.08, 0.70)
	hud_back.position = Vector2(8, 8)
	hud_back.size = Vector2(360, 106)
	layer.add_child(hud_back)

	hud = Label.new()
	hud.position = Vector2(18, 14)
	hud.size = Vector2(540, 132)
	hud.add_theme_font_size_override("font_size", 15)
	hud.add_theme_color_override("font_color", Color(0.93, 0.98, 1.0))
	layer.add_child(hud)

	message_label = Label.new()
	message_label.position = Vector2(430, 12)
	message_label.size = Vector2(650, 96)
	message_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	message_label.add_theme_font_size_override("font_size", 17)
	message_label.add_theme_color_override("font_color", Color(1.0, 0.96, 0.72))
	layer.add_child(message_label)

	touch_overlay = TouchOverlay.new()
	layer.add_child(touch_overlay)

func _create_platform(pos: Vector3, size: Vector3, color: Color, label_text: String) -> StaticBody3D:
	var body := StaticBody3D.new()
	body.position = pos
	body.name = "Platform"

	var mesh_instance := MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = size
	mesh_instance.mesh = mesh
	mesh_instance.material_override = _mat(color, false)
	body.add_child(mesh_instance)

	var collision := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = size
	collision.shape = shape
	body.add_child(collision)
	add_child(body)

	if label_text != "":
		_create_label(label_text, pos + Vector3(0.0, size.y * 0.55 + 0.18, 0.0), Color(0.05, 0.09, 0.16))
	return body

func _create_moving_platform(a: Vector3, b: Vector3, size: Vector3, speed: float) -> void:
	var node := _create_platform(a, size, Color(0.83, 0.75, 0.48), "")
	moving_platforms.append({
		"node": node,
		"from": a,
		"to": b,
		"speed": speed,
		"phase": 0.0,
	})

func _create_collectible(pos: Vector3, kind: String) -> void:
	var node := Node3D.new()
	node.position = pos
	var mesh_instance := MeshInstance3D.new()
	var color := Color(1.0, 0.86, 0.18)
	if kind == "shard":
		color = Color(0.34, 0.92, 1.0)
	elif kind == "ring":
		color = Color(1.0, 0.38, 0.72)
	var sphere := SphereMesh.new()
	sphere.radius = 0.32 if kind != "shard" else 0.42
	sphere.height = sphere.radius * 2.0
	mesh_instance.mesh = sphere
	mesh_instance.material_override = _mat(color, true)
	node.add_child(mesh_instance)
	add_child(node)
	collectibles.append({
		"node": node,
		"kind": kind,
		"taken": false,
		"base_y": pos.y,
	})

func _create_enemy(pos: Vector3, phase: float) -> void:
	var node := Node3D.new()
	node.position = pos
	var body := MeshInstance3D.new()
	var body_mesh := CapsuleMesh.new()
	body_mesh.radius = 0.45
	body_mesh.height = 1.0
	body.mesh = body_mesh
	body.position.y = 0.5
	body.material_override = _mat(Color(0.84, 0.16, 0.24), false)
	node.add_child(body)
	var eye := MeshInstance3D.new()
	var eye_mesh := SphereMesh.new()
	eye_mesh.radius = 0.09
	eye_mesh.height = 0.18
	eye.mesh = eye_mesh
	eye.position = Vector3(0.0, 0.76, -0.42)
	eye.material_override = _mat(Color.WHITE, false)
	node.add_child(eye)
	add_child(node)
	enemies.append({
		"node": node,
		"base": pos,
		"phase": phase,
		"alive": true,
		"cooldown": 0.0,
	})

func _create_jump_pad(pos: Vector3, power: float) -> void:
	var node := Node3D.new()
	node.position = pos
	var mesh_instance := MeshInstance3D.new()
	var mesh := CylinderMesh.new()
	mesh.top_radius = 0.85
	mesh.bottom_radius = 0.85
	mesh.height = 0.18
	mesh.radial_segments = 32
	mesh_instance.mesh = mesh
	mesh_instance.material_override = _mat(Color(0.14, 0.92, 0.85), true)
	node.add_child(mesh_instance)
	add_child(node)
	jump_pads.append({ "node": node, "power": power })

func _build_learn_gates() -> void:
	var positions := [
		Vector3(-2.8, 1.45, -3.8),
		Vector3(0.0, 1.45, -4.35),
		Vector3(2.8, 1.45, -3.8),
	]
	for index in range(3):
		var node := Node3D.new()
		node.position = positions[index]
		var ring_mesh := MeshInstance3D.new()
		var torus := TorusMesh.new()
		torus.inner_radius = 0.5
		torus.outer_radius = 0.72
		ring_mesh.mesh = torus
		ring_mesh.rotation_degrees.x = 90.0
		ring_mesh.material_override = _mat(Color(0.28, 0.58, 1.0), true)
		node.add_child(ring_mesh)
		var label := _create_label("", node.position + Vector3(0.0, 1.15, 0.0), Color.WHITE)
		add_child(node)
		gates.append({
			"node": node,
			"label": label,
			"answer": index,
		})

func _build_guardian() -> void:
	guardian = Node3D.new()
	guardian.name = "ShardGuardian"
	guardian.position = Vector3(0.0, 3.15, -20.0)
	var mesh_instance := MeshInstance3D.new()
	var mesh := CapsuleMesh.new()
	mesh.radius = 0.9
	mesh.height = 2.4
	mesh_instance.mesh = mesh
	mesh_instance.position.y = 1.15
	mesh_instance.material_override = _mat(Color(0.36, 0.08, 0.12), false)
	guardian.add_child(mesh_instance)
	add_child(guardian)
	_create_label("Boss: 7 Splitter machen ihn verwundbar", guardian.position + Vector3(0.0, 2.8, 0.0), Color(1.0, 0.74, 0.45))

func _build_portal() -> void:
	portal = Node3D.new()
	portal.position = Vector3(-4.6, 1.35, 4.2)
	var mesh_instance := MeshInstance3D.new()
	var torus := TorusMesh.new()
	torus.inner_radius = 1.15
	torus.outer_radius = 1.52
	mesh_instance.mesh = torus
	mesh_instance.rotation_degrees.x = 90.0
	mesh_instance.material_override = _mat(Color(0.74, 0.40, 1.0), true)
	portal.add_child(mesh_instance)
	add_child(portal)
	_create_label("Abschluss-Tor", portal.position + Vector3(0.0, 2.0, 0.0), Color(0.93, 0.85, 1.0))

func _create_label(text: String, pos: Vector3, color: Color) -> Label3D:
	var label := Label3D.new()
	label.text = text
	label.position = pos
	label.font_size = 36
	label.modulate = color
	add_child(label)
	labels_3d.append(label)
	return label

func _update_touch_toggles() -> void:
	var touch_jump := touch_overlay.is_down("jump")
	var touch_spin := touch_overlay.is_down("spin")
	var touch_dive := touch_overlay.is_down("dive")
	var touch_learn := touch_overlay.is_down("learn")
	if touch_jump and not last_touch_jump:
		_try_jump()
	if touch_spin and not last_touch_spin:
		_start_spin()
	if touch_dive and not last_touch_dive:
		_start_dive()
	if touch_learn and not last_touch_learn:
		learn_mode = not learn_mode
		_set_message("Learncade aktiv" if learn_mode else "Normalmodus")
		_setup_question()
	last_touch_jump = touch_jump
	last_touch_spin = touch_spin
	last_touch_dive = touch_dive
	last_touch_learn = touch_learn

func _update_player(delta: float) -> void:
	spin_timer = maxf(0.0, spin_timer - delta)
	dive_timer = maxf(0.0, dive_timer - delta)
	hurt_timer = maxf(0.0, hurt_timer - delta)

	if Input.is_key_pressed(KEY_Q):
		camera_yaw += delta * 2.15
	if Input.is_key_pressed(KEY_E):
		camera_yaw -= delta * 2.15

	var input_vec := Vector2.ZERO
	input_vec.x = float(Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT)) - float(Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT))
	input_vec.y = float(Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP)) - float(Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN))
	if touch_overlay.move_vector.length() > 0.08:
		input_vec += Vector2(touch_overlay.move_vector.x, -touch_overlay.move_vector.y)
	input_vec = input_vec.limit_length(1.0)

	if Input.is_key_pressed(KEY_SPACE):
		_try_jump()
	if Input.is_key_pressed(KEY_J) or Input.is_key_pressed(KEY_X):
		_start_spin()
	if Input.is_key_pressed(KEY_K) or Input.is_key_pressed(KEY_C):
		_start_dive()

	var forward := Vector3(-sin(camera_yaw), 0.0, -cos(camera_yaw))
	var right := Vector3(cos(camera_yaw), 0.0, -sin(camera_yaw))
	var move_dir := (right * input_vec.x + forward * input_vec.y).normalized()
	var target_speed := MOVE_SPEED if player.is_on_floor() else AIR_SPEED
	if dive_timer > 0.0:
		target_speed = DIVE_SPEED
	var target_velocity := move_dir * target_speed
	player.velocity.x = move_toward(player.velocity.x, target_velocity.x, ACCEL * delta)
	player.velocity.z = move_toward(player.velocity.z, target_velocity.z, ACCEL * delta)

	if not player.is_on_floor():
		player.velocity.y -= GRAVITY * delta
	else:
		jump_count = 0
		if player.velocity.y < 0.0:
			player.velocity.y = -0.8

	player.move_and_slide()
	if move_dir.length() > 0.1:
		player_visual.look_at(player.global_position + move_dir, Vector3.UP)
	if spin_timer > 0.0:
		player_visual.rotation.y += delta * 18.0

func _try_jump() -> void:
	if finished:
		return
	if player.is_on_floor():
		player.velocity.y = JUMP_FORCE
		jump_count = 1
		_set_message("Sprung")
	elif jump_count < 2:
		player.velocity.y = DOUBLE_JUMP_FORCE
		jump_count = 2
		_set_message("Double-Jump")

func _start_spin() -> void:
	if spin_timer <= 0.08:
		spin_timer = SPIN_DURATION
		_set_message("Spin-Angriff")

func _start_dive() -> void:
	if not player.is_on_floor():
		dive_timer = 0.38
		player.velocity.y = -DIVE_SPEED
		_set_message("Dive")

func _update_moving_platforms(delta: float) -> void:
	for platform in moving_platforms:
		platform["phase"] += delta * platform["speed"]
		var amount := (sin(platform["phase"]) + 1.0) * 0.5
		platform["node"].position = platform["from"].lerp(platform["to"], amount)

func _update_collectibles(delta: float) -> void:
	for item in collectibles:
		if item["taken"]:
			continue
		var node: Node3D = item["node"]
		node.rotate_y(delta * 2.4)
		node.position.y = item["base_y"] + sin(Time.get_ticks_msec() * 0.004 + node.position.x) * 0.18
		var radius := 1.0 if item["kind"] != "ring" else 1.35
		if player.global_position.distance_to(node.global_position) <= radius:
			item["taken"] = true
			node.visible = false
			if item["kind"] == "note":
				notes += 1
				score += 25
				_set_message("Note gesammelt")
			elif item["kind"] == "shard":
				shards += 1
				score += 160
				_set_message("Splitter %d/7" % shards)
			else:
				rings += 1
				score += 110
				player.velocity.y = maxf(player.velocity.y, 8.5)
				_set_message("Stunt-Ring")

func _update_enemies(delta: float) -> void:
	for enemy in enemies:
		if not enemy["alive"]:
			continue
		enemy["phase"] += delta * 1.15
		enemy["cooldown"] = maxf(0.0, enemy["cooldown"] - delta)
		var node: Node3D = enemy["node"]
		var base: Vector3 = enemy["base"]
		node.position = base + Vector3(sin(enemy["phase"]) * 1.8, 0.0, cos(enemy["phase"] * 0.7) * 1.2)
		node.look_at(Vector3(player.global_position.x, node.global_position.y, player.global_position.z), Vector3.UP)
		var distance := player.global_position.distance_to(node.global_position)
		if distance < 1.2:
			if spin_timer > 0.0 or (player.velocity.y < -8.0 and player.global_position.y > node.global_position.y + 0.5):
				enemy["alive"] = false
				node.visible = false
				score += 120
				player.velocity.y = 9.0
				_set_message("Gegner besiegt")
			elif enemy["cooldown"] <= 0.0 and hurt_timer <= 0.0:
				enemy["cooldown"] = 1.1
				_damage_player(1, "Autsch")

func _update_guardian(delta: float) -> void:
	if guardian == null:
		return
	guardian_hurt_timer = maxf(0.0, guardian_hurt_timer - delta)
	guardian.rotate_y(delta * 0.9)
	var vulnerable := shards >= 7
	if vulnerable:
		guardian.position.y = 3.15 + sin(Time.get_ticks_msec() * 0.004) * 0.25
	var distance := player.global_position.distance_to(guardian.global_position)
	if distance < 2.0 and guardian_hp > 0:
		if vulnerable and spin_timer > 0.0 and guardian_hurt_timer <= 0.0:
			guardian_hp -= 1
			guardian_hurt_timer = 0.7
			score += 250
			_set_message("Boss getroffen: %d HP" % guardian_hp)
			player.velocity = (player.global_position - guardian.global_position).normalized() * 10.0 + Vector3(0.0, 8.0, 0.0)
			if guardian_hp <= 0:
				guardian.visible = false
				_set_message("Boss besiegt. Sternentor offen!")
		elif hurt_timer <= 0.0:
			_damage_player(1, "Boss blockiert den Weg")

func _update_jump_pads() -> void:
	for pad in jump_pads:
		var node: Node3D = pad["node"]
		node.rotate_y(0.04)
		if player.global_position.distance_to(node.global_position) < 1.25 and player.velocity.y <= 3.0:
			player.velocity.y = pad["power"]
			jump_count = 1
			_set_message("Launch-Pad")

func _update_gates() -> void:
	for gate in gates:
		var node: Node3D = gate["node"]
		node.visible = learn_mode
		var label: Label3D = gate["label"]
		label.visible = learn_mode
		if not learn_mode:
			continue
		node.rotate_y(0.025)
		if player.global_position.distance_to(node.global_position) < 1.4:
			var task: Dictionary = LEARN_TASKS[quiz_index % LEARN_TASKS.size()]
			if gate["answer"] == task["correct"]:
				learn_hits += 1
				score += 220
				player.velocity.y = 8.5
				_set_message("Richtig: %s  (%d/%d)" % [task["answers"][task["correct"]], mini(learn_hits, LEARN_GOAL), LEARN_GOAL])
				quiz_index += 1
				_setup_question()
			else:
				_damage_player(1, "Noch einmal: %s" % task["hint"])
			player.global_position += (player.global_position - node.global_position).normalized() * 2.0

func _update_portal(delta: float) -> void:
	if portal == null:
		return
	portal.rotate_y(delta)
	var open := learn_hits >= LEARN_GOAL or (guardian_hp <= 0 and shards >= 7)
	portal.scale = Vector3.ONE * (1.0 + (0.12 if open else 0.0) * sin(Time.get_ticks_msec() * 0.006))
	if open and player.global_position.distance_to(portal.global_position) < 1.8:
		finished = true
		score += 1000
		_set_message("Lernrunde geschafft! Score %d" % score)

func _update_camera(delta: float) -> void:
	var focus := player.global_position + Vector3(0.0, 1.35, 0.0)
	var offset := Vector3(sin(camera_yaw) * 10.5, 6.4, cos(camera_yaw) * 10.5)
	camera.global_position = camera.global_position.lerp(focus + offset, 1.0 - pow(0.001, delta))
	camera.look_at(focus, Vector3.UP)

func _update_labels() -> void:
	if camera == null:
		return
	for label in labels_3d:
		if is_instance_valid(label):
			label.look_at(camera.global_position, Vector3.UP)
			label.rotate_y(PI)

func _setup_question() -> void:
	var task: Dictionary = LEARN_TASKS[quiz_index % LEARN_TASKS.size()]
	for gate in gates:
		var label: Label3D = gate["label"]
		label.text = task["answers"][gate["answer"]]
	_update_message(0.0)

func _update_hud() -> void:
	var mode := "Learncade" if learn_mode else "Normal"
	var goal_text := "Tor offen" if learn_hits >= LEARN_GOAL else "Lernziel %d/%d" % [learn_hits, LEARN_GOAL]
	hud.text = "FASKA 64 - LERNPARK\nHP %d/%d  Score %d  Mode %s\n%s  Notes %d/12  Ringe %d/4\nSpace/A Jump · richtiges Gate suchen" % [
		hp, MAX_HP, score, mode, goal_text, notes, rings
	]
	touch_overlay.queue_redraw()

func _update_message(delta: float) -> void:
	feedback_timer = maxf(0.0, feedback_timer - delta)
	if message_label == null:
		return
	if learn_mode:
		var task: Dictionary = LEARN_TASKS[quiz_index % LEARN_TASKS.size()]
		if feedback_timer > 0.0 and feedback_text != "":
			message_label.text = "%s\n%s" % [task["prompt"], feedback_text]
		else:
			message_label.text = task["prompt"]
	elif feedback_timer > 0.0:
		message_label.text = feedback_text
	else:
		message_label.text = ""

func _damage_player(amount: int, text: String) -> void:
	if hurt_timer > 0.0:
		return
	hp -= amount
	hurt_timer = 1.0
	_set_message(text)
	player.velocity = Vector3(0.0, 7.5, 0.0) + (player.global_position - Vector3.ZERO).normalized() * 5.0
	if hp <= 0:
		_respawn()
		hp = MAX_HP
		score = max(0, score - 200)
		_set_message("Neustart am Checkpoint")

func _respawn() -> void:
	player.global_position = spawn_point
	player.velocity = Vector3.ZERO
	jump_count = 0

func _reset_run() -> void:
	get_tree().reload_current_scene()

func _set_message(text: String) -> void:
	feedback_text = text
	feedback_timer = 2.8
	_update_message(0.0)

func _mat(color: Color, emission: bool) -> StandardMaterial3D:
	var material := StandardMaterial3D.new()
	material.albedo_color = color
	material.roughness = 0.82
	if emission:
		material.emission_enabled = true
		material.emission = color
		material.emission_energy_multiplier = 0.45
	return material
