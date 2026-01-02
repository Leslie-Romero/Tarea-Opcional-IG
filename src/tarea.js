import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Ammo from "ammojs-typed";

let camera, controls, scene, renderer;
let textureLoader;
let floorTexture;
const clock = new THREE.Clock();

const mouseCoords = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const ballMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });

// Mundo físico con Ammo
let physicsWorld;
const gravityConstant = 7.8;
let collisionConfiguration;
let dispatcher;
let broadphase;
let solver;
const margin = 0.05; //margen colisiones

// Objetos rígidos
const rigidBodies = [];

const pos = new THREE.Vector3();
const quat = new THREE.Quaternion();

//Variables temporales para actualizar transformación en el bucle
let transformAux1;
let tempBtVec3_1;

// Mis variables
let brickLetters = [];
let allBricks = [];
let glowingLetterMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  emissive: 0x333333,
  emissiveIntensity: 1.0,
  shininess: 80,
});
let saveOgMaterials = [];
let lightOn = false;

const listener = new THREE.AudioListener();
let shootSound;
let isShootReady = false;

// Letras del muro
let hi_map = [
  "H  H    I",
  "H  H    I",
  "H  H    I",
  "H  H    I",
  "H  H    I",
  "H  H    I",
  "H  H    I",
  "HHHH    I",
  "H  H    I",
  "H  H    I",
  "H  H    I",
  "H  H    I",
  "H  H    I",
  "H  H    I",
  "H  H    I",
];

let gg_map = [
  "GGGGGG   GGGGGG",
  "G    G   G    G",
  "G    G   G    G",
  "G    G   G    G",
  "G    G   G    G",
  "G    G   G    G",
  "G  GGG   G  GGG",
  "G        G     ",
  "G        G     ",
  "G        G     ",
  "G        G     ",
  "G    G   G    G",
  "GGGGGG   GGGGGG",
];

let win_map = [
  "W     W   IIIII   N    N",
  "WW   WW   IIIII   N    N",
  "W W W W     I     N    N",
  "W  W  W     I     N   NN",
  "W  W  W     I     N   NN",
  "W     W     I     N  N N",
  "W     W     I     N N  N",
  "W     W     I     NN   N",
  "W     W     I     NN   N",
  "W     W     I     N    N",
  "W     W     I     N    N",
  "W     W   IIIII   N    N",
  "W     W   IIIII   N    N",
];

let s11_map = [
  "SSSSS     11     11 ",
  "SSSSS     11     11 ",
  "    S     11     11 ",
  "    S     11     11 ",
  "    S     11     11 ",
  "SSSSS     11     11 ",
  "SSSSS     11     11 ",
  "S         11     11 ",
  "S         11     11 ",
  "S      1  11  1  11 ",
  "SSSSS   1 11   1 11 ",
  "SSSSS    111    111 ",
];

let heart_map = [
  "        H        ",
  "       H H       ",
  "      H   H      ",
  "     H     H     ",
  "    H       H    ",
  "   H         H   ",
  "  H           H  ",
  " H             H ",
  "H               H",
  "H               H",
  "H               H",
  "H               H",
  "H               H",
  "H               H",
  "H               H",
  "H               H",
  "H       H       H",
  " H     H H     H ",
  "  H   H   H   H  ",
  "   H  H   H  H   ",
  "    HH     HH    ",
];

let letter_map = hi_map;

// Ampliación: añadir niveles
const GameMode = {
  Levels: "levels",
  Zen: "zen",
};
let currentMode = GameMode.Levels;
const levels = [
  { name: "HI", map: hi_map, balls: 15 },
  { name: "GG", map: gg_map, balls: 15 },
  { name: "WIN", map: win_map, balls: 15 },
  { name: "S11", map: s11_map, balls: 20 },
  { name: "HEART", map: heart_map, balls: 20 },
];
let currentLevel = 0;
let ballsUsed = 0;
let totalBalls = 0;
let totalBricks = 0;
let fallenBricks = 0;

// Ampliación: activación condicional de las físicas de los ladrillos
let bricksActivated = false;

let gameModeButton;
// Ampliación: sincronizamos el selector con el mapa actual
let dropdown;

//Inicialización ammo
Ammo(Ammo).then(start);

function start() {
  //Elementos gráficos
  initGraphics();

  //Elementos del mundo físico
  initPhysics();
  //Objetos
  createObjects();

  //Eventos
  initInput();

  //Elementos HTML (UI)
  initUI();

  startLevels();

  animationLoop();
}

function initGraphics() {
  //Cámara, escena, renderer y control de cámara
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.2,
    2000
  );
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  camera.position.set(-25, 5, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2, 0);
  controls.update();

  textureLoader = new THREE.TextureLoader();

  //Luces
  const ambientLight = new THREE.AmbientLight(0x707070);
  scene.add(ambientLight);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(-10, 18, 5);
  light.castShadow = true;
  const d = 14;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.near = 2;
  light.shadow.camera.far = 50;

  light.shadow.mapSize.x = 1024;
  light.shadow.mapSize.y = 1024;

  scene.add(light);
  //Redimensión de la ventana
  window.addEventListener("resize", onWindowResize);
}

function initPhysics() {
  // Configuración Ammo
  // Colisiones
  collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
  // Gestor de colisiones convexas y cóncavas
  dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
  // Colisión fase amplia
  broadphase = new Ammo.btDbvtBroadphase();
  // Resuelve resricciones de reglas físicas como fuerzas, gravedad, etc.
  solver = new Ammo.btSequentialImpulseConstraintSolver();
  // Crea en mundo físico
  physicsWorld = new Ammo.btDiscreteDynamicsWorld(
    dispatcher,
    broadphase,
    solver,
    collisionConfiguration
  );
  // Establece gravedad
  physicsWorld.setGravity(new Ammo.btVector3(0, -gravityConstant, 0));

  transformAux1 = new Ammo.btTransform();
  tempBtVec3_1 = new Ammo.btVector3(0, 0, 0);
}

function createObjects() {
  // Suelo
  pos.set(0, -0.5, 0);
  quat.set(0, 0, 0, 1);
  const suelo = createBoxWithPhysics(
    40,
    1,
    40,
    0,
    pos,
    quat,
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  );
  suelo.receiveShadow = true;
  floorTexture = textureLoader.load(
    "/textures/gradient.png",
    function (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      suelo.material.map = texture;
      suelo.material.needsUpdate = true;
    }
  );
  floorTexture.colorSpace = THREE.SRGBColorSpace;
  // Muro
  createWall();
}

function isLetterBrick(row, col) {
  return (
    letter_map[row] && letter_map[row][col] && letter_map[row][col] !== " "
  );
}

function createWall() {
  const brickMass = 0.2;
  const brickLength = 1.2;
  const brickDepth = 0.6;
  const brickHeight = brickLength * 0.5;
  const numBricksLength = letter_map[0].length;
  const numBricksHeight = letter_map.length;
  const z0 = -numBricksLength * brickLength * 0.5;
  pos.set(0, brickHeight * 0.5, z0);
  quat.set(0, 0, 0, 1);
  for (let j = 0; j < numBricksHeight; j++) {
    pos.z = z0;

    for (let i = 0; i < numBricksLength; i++) {
      let brickIsLetter = isLetterBrick(j, i);

      // Si no tiene masa no se mueve
      let brickMassCurrent = brickIsLetter ? 0 : brickMass;

      const brick = createBoxWithPhysics(
        brickDepth,
        brickHeight,
        brickLength,
        brickMassCurrent,
        pos,
        quat,
        createMaterial()
      );
      if (brickIsLetter) brickLetters.push(brick);
      allBricks.push(brick);

      brick.castShadow = true;
      brick.receiveShadow = true;

      pos.z += brickLength;
    }
    pos.y += brickHeight;
  }
  totalBricks = allBricks.length - brickLetters.length;
}

function createBoxWithPhysics(sx, sy, sz, mass, pos, quat, material) {
  const object = new THREE.Mesh(
    new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1),
    material
  );
  // Estructura geométrica de colisión
  // Crea caja orientada en el espacio, especificando dimensiones
  const shape = new Ammo.btBoxShape(
    new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5)
  );
  // Margen para colisione
  shape.setMargin(margin);

  createRigidBody(object, shape, mass, pos, quat, undefined, undefined, true);

  return object;
}

//Creación de cuerpo rígido, con masa, sujeto a fuerzas, colisiones...
function createRigidBody(
  object,
  physicsShape,
  mass,
  pos,
  quat,
  vel,
  angVel,
  isBrick = false
) {
  //Posición
  if (pos) {
    object.position.copy(pos);
  } else {
    pos = object.position;
  }
  // Cuaternión, es decir orientación
  if (quat) {
    object.quaternion.copy(quat);
  } else {
    quat = object.quaternion;
  }
  // Matriz de transformación
  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  const motionState = new Ammo.btDefaultMotionState(transform);
  //Inercia inicial y parámetros de rozamiento, velocidad
  const localInertia = new Ammo.btVector3(0, 0, 0);
  physicsShape.calculateLocalInertia(mass, localInertia);
  //Crea el cuerpo
  const rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    physicsShape,
    localInertia
  );
  const body = new Ammo.btRigidBody(rbInfo);

  body.setFriction(0.5);

  if (vel) {
    body.setLinearVelocity(new Ammo.btVector3(vel.x, vel.y, vel.z));
  }

  if (angVel) {
    body.setAngularVelocity(new Ammo.btVector3(angVel.x, angVel.y, angVel.z));
  }

  // Enlaza primitiva gráfica con física
  object.userData.physicsBody = body;
  object.userData.collided = false;
  object.userData.isBrick = isBrick;
  object.userData.counted = false;

  scene.add(object);
  // Si tiene masa
  if (mass > 0) {
    rigidBodies.push(object);
    // No se mueven hasta el primer impacto si son ladrillos(Ampliación)
    if (isBrick) {
      body.setLinearFactor(new Ammo.btVector3(0, 0, 0));
      body.setAngularFactor(new Ammo.btVector3(0, 0, 0));
    } else {
      body.setActivationState(4);
    }
  }
  // Añadido al universo físico
  physicsWorld.addRigidBody(body);

  return body;
}

// Activamos las físicas más tarde (Ampliación)
function activateBricks() {
  for (let brick of rigidBodies) {
    if (brick.userData.isBrick) {
      const body = brick.userData.physicsBody;
      body.setLinearFactor(new Ammo.btVector3(1, 1, 1));
      body.setAngularFactor(new Ammo.btVector3(1, 1, 1));
      body.activate();
    }
  }
  bricksActivated = true;
}

function createRandomColor() {
  return Math.floor(Math.random() * (1 << 24));
}

function createMaterial(color) {
  color = color || createRandomColor();
  return new THREE.MeshPhongMaterial({ color: color });
}

function shoot() {
  if (!isShootReady) return;

  if (shootSound.isPlaying) {
    shootSound.stop();
  }

  shootSound.play();
}

//Eventos (ratón y teclado)
function initInput() {
  window.addEventListener("pointermove", (event) => {
    mouseCoords.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  });
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      shootBall();
    }
  });
  window.addEventListener("pointerdown", () => {
    const context = listener.context;
    if (context.state === "suspended") {
      context.resume();
    }
  });
}

function shootBall() {
  raycaster.setFromCamera(mouseCoords, camera);

  if (currentMode === GameMode.Levels) {
    ballsUsed++;
    if (ballsUsed > levels[currentLevel].balls) {
      alert("Maximum balls reached!");
      return;
    }
    const balls_remaining = document.getElementById("stats");
    balls_remaining.innerHTML =
      "Balls: " + (totalBalls - ballsUsed) + " / " + totalBalls;
  }

  // Efectos de sonido
  const context = listener.context;
  if (context.state === "suspended") {
    context.resume().then(shoot());
  } else {
    shoot();
  }

  if (!bricksActivated) activateBricks();

  const ballMass = 25;
  const ballRadius = 0.4;

  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(ballRadius, 14, 10),
    ballMaterial
  );

  ball.castShadow = true;
  ball.receiveShadow = true;

  const ballShape = new Ammo.btSphereShape(ballRadius);
  ballShape.setMargin(margin);

  pos.copy(raycaster.ray.direction);
  pos.add(raycaster.ray.origin);
  quat.set(0, 0, 0, 1);

  const ballBody = createRigidBody(ball, ballShape, ballMass, pos, quat);

  pos.copy(raycaster.ray.direction);
  pos.multiplyScalar(24);
  ballBody.setLinearVelocity(new Ammo.btVector3(pos.x, pos.y, pos.z));
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function clearWall(keepFigure = false) {
  const remainingBricks = [];

  for (let i = 0; i < allBricks.length; i++) {
    const brick = allBricks[i];
    const isLetter = brickLetters.includes(brick);

    if (keepFigure && isLetter) {
      remainingBricks.push(brick);
      continue;
    }

    const body = brick.userData.physicsBody;
    physicsWorld.removeRigidBody(body);
    Ammo.destroy(body);

    scene.remove(brick);

    const index = rigidBodies.indexOf(brick);
    if (index !== -1) rigidBodies.splice(index, 1);
  }

  if (keepFigure) {
    allBricks = remainingBricks;
    brickLetters = remainingBricks.slice();
  } else {
    allBricks.length = 0;
    brickLetters.length = 0;
  }

  fallenBricks = 0;
  bricksActivated = false;
  totalBricks = keepFigure ? 0 : totalBricks;
}

function initSFX() {
  shootSound = new THREE.Audio(listener);
  const sfxLoader = new THREE.AudioLoader();

  sfxLoader.load("/shoot_cut.mp3", function (buffer) {
    shootSound.setBuffer(buffer);
    shootSound.setVolume(0.7);
    isShootReady = true;
    console.log("Shoot SFX loaded");
  });
}

// Ampliación: niveles
function loadLevel(index) {
  clearWall();
  ballsUsed = 0;
  fallenBricks = 0;

  const level = levels[index];
  totalBalls = level.balls;
  letter_map = level.map;
  dropdown.value = level.name;
  let message = document.getElementById("level-message");
  message.innerHTML = "LEVEL " + (index + 1) + ": " + level.name;
  let balls_remaining = document.getElementById("stats");
  balls_remaining.innerHTML = "";
  createWall();

  document.getElementById("progress-bar").style.width = "0%";
}

function nextLevel() {
  currentLevel++;
  if (currentLevel >= levels.length) {
    let message = document.getElementById("level-message");
    message.innerHTML = "YOU WIN!";
    return;
  }
  loadLevel(currentLevel);
}

function startLevels() {
  currentMode = GameMode.Levels;
  currentLevel = 0;
  let message = document.getElementById("level-message");
  message.innerHTML = "MODE: LEVELS";
  document.getElementById("progress-container").style.display = "block";
  document.getElementById("stats").style.display = "block";
  loadLevel(0);
}

function updateProgress() {
  const percent = Math.min((fallenBricks / totalBricks) * 100, 100);
  let progress_bar = document.getElementById("progress-bar");
  progress_bar.style.width = percent + "%";

  if (percent >= 100) {
    if (currentMode === GameMode.Levels) nextLevel();
    progress_bar.style.background = "linear-gradient(90deg, #00ffcc, #00ff4c)";
  } else {
    progress_bar.style.background = "linear-gradient(90deg, #00ffcc, #00aaff)";
  }
}

function zenMode() {
  clearWall();
  createWall();

  let message = document.getElementById("level-message");
  message.innerHTML = "MODE: ZEN";

  gameModeButton.innerHTML = "Mode: Zen";
  gameModeButton.classList.remove("active-btn");
  currentMode = GameMode.Zen;

  document.getElementById("stats").style.display = "none";
  document.getElementById("progress-bar").style.width = "0%";
}

// Añadimos todos los elementos HTML
function initUI() {
  camera.add(listener);

  // Sonido de disparo
  initSFX();

  // Música de fondo
  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("background.mp3", function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.1);
    console.log("Sonido cargado");
  });

  let info = document.createElement("div");
  info.classList.add("info");
  info.innerHTML = "Tarea Opcional (S11+) - Leslie Romero";
  document.body.appendChild(info);

  let level_message = document.createElement("div");
  level_message.id = "level-message";
  level_message.innerHTML = "MODE: LEVELS";
  document.body.appendChild(level_message);

  let progress_container = document.createElement("div");
  progress_container.id = "progress-container";

  let progress_bar = document.createElement("div");
  progress_bar.id = "progress-bar";

  progress_container.appendChild(progress_bar);
  document.body.appendChild(progress_container);

  let balls_remaining = document.createElement("div");
  balls_remaining.id = "stats";

  document.body.appendChild(balls_remaining);

  dropdown = document.createElement("select");
  dropdown.id = "dropdown";
  let options = [
    { value: "HI", text: "HI" },
    { value: "GG", text: "GG" },
    { value: "WIN", text: "WIN" },
    { value: "S11", text: "S11" },
    { value: "HEART", text: "🤍" },
  ];

  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.text;
    dropdown.appendChild(option);
  });
  dropdown.addEventListener("change", (e) => {
    const value = e.target.value;

    if (value == "HI") letter_map = hi_map;
    if (value == "GG") letter_map = gg_map;
    if (value == "WIN") letter_map = win_map;
    if (value == "S11") letter_map = s11_map;
    if (value == "HEART") letter_map = heart_map;

    zenMode();
  });
  document.body.appendChild(dropdown);

  let resetButton = createButton("Reset", false, "", "", "30px", "30px");
  resetButton.onclick = function () {
    clearWall();
    ballsUsed = 0;
    document.getElementById("progress-bar").style.width = "0%";
    createWall();
  };
  document.body.appendChild(resetButton);

  let musicButton = createButton("🎧", false, "30px", "130px");
  musicButton.onclick = function () {
    const context = listener.context;

    if (context.state === "suspended") {
      context.resume().then(() => {
        console.log("AudioContext resumed");
        sound.play();
      });
    } else {
      if (!sound.isPlaying) {
        musicButton.classList.add("active-btn");
        sound.play();
      } else {
        musicButton.classList.remove("active-btn");
        sound.pause();
      }
    }
  };
  document.body.appendChild(musicButton);

  let lightButton = createButton("💡", false, "30px", "80px");
  lightButton.onclick = function () {
    if (!lightOn) {
      lightOn = true;
      for (let brick of brickLetters) {
        saveOgMaterials.push(brick.material);
        brick.material = glowingLetterMaterial;
      }
    } else {
      lightOn = false;
      for (let i = 0; i < brickLetters.length; i++) {
        let brick = brickLetters[i];
        brick.material = saveOgMaterials[i];
      }
    }
  };
  document.body.appendChild(lightButton);

  let showFigureButton = createButton("👁️", false, "30px", "30px");
  showFigureButton.onclick = function () {
    clearWall(true);
  };
  document.body.appendChild(showFigureButton);

  gameModeButton = createButton("Mode: Levels", true, "", "", "30px", "90px");
  gameModeButton.onclick = function () {
    if (currentMode == GameMode.Levels) {
      zenMode();
    } else {
      gameModeButton.innerHTML = "Mode: Levels";
      gameModeButton.classList.add("active-btn");
      currentMode = GameMode.Levels;
      clearWall();
      createWall();
      startLevels();
    }
  };
  document.body.appendChild(gameModeButton);
}

function createButton(
  name,
  isActive,
  top = "",
  right = "",
  bottom = "",
  left = ""
) {
  let btn = document.createElement("button");
  btn.innerHTML = name;
  btn.classList.add("btn");
  if (isActive) {
    btn.classList.add("active-btn");
  }
  btn.style.top = top;
  btn.style.bottom = bottom;
  btn.style.left = left;
  btn.style.right = right;
  return btn;
}

function animationLoop() {
  requestAnimationFrame(animationLoop);

  floorTexture.offset.x += 0.005;

  // Contamos los ladrillos caídos para el progreso del nivel
  rigidBodies.forEach((obj) => {
    if (
      obj.userData.isBrick &&
      !obj.userData.counted &&
      (obj.position.x < -0.5 || obj.position.x > 0.5)
    ) {
      obj.userData.counted = true;
      fallenBricks++;
      updateProgress();
    }
  });

  const deltaTime = clock.getDelta();
  updatePhysics(deltaTime);

  renderer.render(scene, camera);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}

function updatePhysics(deltaTime) {
  // Avanza la simulación en función del tiempo
  physicsWorld.stepSimulation(deltaTime, 10);

  // Actualiza cuerpos rígidos
  for (let i = 0, il = rigidBodies.length; i < il; i++) {
    const objThree = rigidBodies[i];
    const objPhys = objThree.userData.physicsBody;
    //Obtiene posición y rotación
    const ms = objPhys.getMotionState();
    //Actualiza la correspondiente primitiva gráfica asociada
    if (ms) {
      ms.getWorldTransform(transformAux1);
      const p = transformAux1.getOrigin();
      const q = transformAux1.getRotation();
      objThree.position.set(p.x(), p.y(), p.z());
      objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());

      objThree.userData.collided = false;
    }
  }
}
