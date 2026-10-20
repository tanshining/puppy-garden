import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const mount = document.querySelector<HTMLDivElement>('#scene')!;
const loading = document.querySelector<HTMLDivElement>('#loading')!;
const hint = document.querySelector<HTMLDivElement>('#hint')!;
const card = document.querySelector<HTMLElement>('#dog-card')!;
const dogName = document.querySelector<HTMLElement>('#dog-name')!;
const dogState = document.querySelector<HTMLElement>('#dog-state')!;
const autoButton = document.querySelector<HTMLButtonElement>('#auto-button')!;
const resetButton = document.querySelector<HTMLButtonElement>('#reset-button')!;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 700px)').matches;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xe9d4bd, 0.0065);

const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 160);
const homePosition = new THREE.Vector3(isMobile ? 24 : 28, isMobile ? 23 : 20, isMobile ? 32 : 30);
const homeTarget = new THREE.Vector3(0, 2.4, 0);
camera.position.copy(homePosition);

const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.88;
mount.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(homeTarget);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.minDistance = 17;
controls.maxDistance = 58;
controls.minPolarAngle = Math.PI * 0.16;
controls.maxPolarAngle = Math.PI * 0.47;
controls.enablePan = false;
controls.autoRotate = !reducedMotion;
controls.autoRotateSpeed = 0.22;

const composer = new EffectComposer(renderer);
composer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.25 : 1.65));
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.08, 0.5, 1.05);
composer.addPass(bloom);
composer.addPass(new OutputPass());

const C = {
  sage: 0x80996f,
  sageDark: 0x5f7655,
  moss: 0x667e56,
  cream: 0xfff1d8,
  butter: 0xf2d686,
  blush: 0xe7a3a3,
  terracotta: 0xb96849,
  wood: 0x9c6d4b,
  woodDark: 0x6e4c39,
  stone: 0xd2c5aa,
  soil: 0x6b4e38,
  leaf: 0x789b65,
  white: 0xfff8e9,
  red: 0xc94f49,
  corgi: 0xc7864f,
  charcoal: 0x4a4138,
};

const mats = {
  grass: mat(C.sage, 0.94),
  grassDark: mat(C.sageDark, 1),
  path: mat(C.stone, 0.92),
  soil: mat(C.soil, 1),
  wood: mat(C.wood, 0.93),
  woodDark: mat(C.woodDark, 1),
  cream: mat(C.cream, 0.88),
  white: mat(C.white, 0.88),
  blush: mat(C.blush, 0.9),
  butter: mat(C.butter, 0.9),
  terracotta: mat(C.terracotta, 1),
  leaf: mat(C.leaf, 0.96),
  leafDark: mat(C.moss, 1),
  metal: mat(0x9aa799, 0.72, 0.12),
  dark: mat(C.charcoal, 1),
  red: mat(C.red, 0.82),
};

function mat(color: THREE.ColorRepresentation, roughness = 0.9, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function mesh(geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[], parent: THREE.Object3D = scene) {
  const m = new THREE.Mesh(geometry, material);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

function box(size: [number, number, number], material: THREE.Material, pos: [number, number, number], parent: THREE.Object3D = scene, radius = 0.08) {
  const g = new THREE.BoxGeometry(...size, 2, 2, 2);
  const m = mesh(g, material, parent);
  m.position.set(...pos);
  if (radius) {
    // Slight scale irregularity gives plain geometry a soft handmade character.
    m.scale.set(1, 1, 1);
  }
  return m;
}

function cylinder(radiusTop: number, radiusBottom: number, height: number, material: THREE.Material, pos: [number, number, number], parent: THREE.Object3D = scene, segments = 12) {
  const m = mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material, parent);
  m.position.set(...pos);
  return m;
}

function sphere(radius: number, material: THREE.Material, pos: [number, number, number], parent: THREE.Object3D = scene, scale: [number, number, number] = [1, 1, 1]) {
  const m = mesh(new THREE.SphereGeometry(radius, 16, 12), material, parent);
  m.position.set(...pos);
  m.scale.set(...scale);
  return m;
}

// LIGHTING
scene.add(new THREE.HemisphereLight(0xffefd8, 0x52634a, 1.35));
const sun = new THREE.DirectionalLight(0xffd49a, 2.55);
sun.position.set(-16, 28, 18);
sun.castShadow = true;
sun.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
sun.shadow.camera.left = -25;
sun.shadow.camera.right = 25;
sun.shadow.camera.top = 25;
sun.shadow.camera.bottom = -25;
sun.shadow.camera.near = 2;
sun.shadow.camera.far = 70;
sun.shadow.bias = -0.0006;
scene.add(sun);
const fill = new THREE.DirectionalLight(0xe8f1d3, 0.8);
fill.position.set(20, 12, -15);
scene.add(fill);

// DIORAMA BASE
const base = cylinder(15.9, 16.5, 1.25, mat(0xb88762, 1), [0, -0.68, 0], scene, 48);
base.receiveShadow = true;
cylinder(15.2, 15.5, 0.62, mats.grassDark, [0, 0.05, 0], scene, 48);
cylinder(14.75, 14.85, 0.42, mats.grass, [0, 0.42, 0], scene, 48);

// CHASE ROUTE AND STEPPING STONES
const routePoints = [
  new THREE.Vector3(-9.2, 0.9, 2.7),
  new THREE.Vector3(-7.1, 0.9, -5.5),
  new THREE.Vector3(-0.8, 0.9, -8.7),
  new THREE.Vector3(6.8, 0.9, -6.2),
  new THREE.Vector3(9.4, 0.9, -0.5),
  new THREE.Vector3(7.7, 0.9, 5.4),
  new THREE.Vector3(2.0, 0.9, 8.0),
  new THREE.Vector3(-5.8, 0.9, 7.4),
];
const chaseCurve = new THREE.CatmullRomCurve3(routePoints, true, 'catmullrom', 0.34);
for (let i = 0; i < 46; i++) {
  const p = chaseCurve.getPoint(i / 46);
  const tangent = chaseCurve.getTangent(i / 46);
  const stone = mesh(new THREE.CylinderGeometry(0.68 + Math.sin(i * 2.1) * 0.08, 0.74, 0.18, 8), mats.path);
  stone.position.set(p.x, 0.75, p.z);
  stone.scale.z = 0.72;
  stone.rotation.y = Math.atan2(tangent.x, tangent.z) + (i % 3 - 1) * 0.08;
  stone.rotation.x = (i % 4 - 1.5) * 0.009;
}

// FLOWER BEDS
const swayingPlants: THREE.Object3D[] = [];
const flowerBeds = [
  { x: -3.9, z: -1.7, rx: 3.2, rz: 2.25, palette: [C.white, C.butter] },
  { x: 4.0, z: 1.7, rx: 2.6, rz: 2.15, palette: [C.blush, 0xd8a7cc] },
  { x: -2.1, z: 6.0, rx: 2.4, rz: 1.3, palette: [0x9677b6, 0xc6a6db] },
];

flowerBeds.forEach((bed, bedIndex) => {
  const soil = mesh(new THREE.CylinderGeometry(1, 1.06, 0.27, 32), mats.soil);
  soil.scale.set(bed.rx, 1, bed.rz);
  soil.position.set(bed.x, 0.73, bed.z);
  const count = bedIndex === 1 ? 24 : 30;
  for (let i = 0; i < count; i++) {
    const a = i * 2.399963 + bedIndex;
    const r = Math.sqrt((i + 0.5) / count) * 0.88;
    const x = bed.x + Math.cos(a) * bed.rx * r;
    const z = bed.z + Math.sin(a) * bed.rz * r;
    const type = (i + bedIndex) % 3;
    const color = bed.palette[i % bed.palette.length];
    createFlower(x, z, 0.55 + (i % 5) * 0.08, color, type);
  }
});

function createFlower(x: number, z: number, h: number, color: number, type: number) {
  const g = new THREE.Group();
  g.position.set(x, 0.84, z);
  const stem = cylinder(0.025, 0.032, h, mats.leafDark, [0, h / 2, 0], g, 6);
  stem.castShadow = false;
  if (type === 2) {
    for (let i = 0; i < 4; i++) sphere(0.15, mat(color, 0.9), [(i % 2 - .5) * .18, h + Math.floor(i / 2) * .11, (i % 2 ? 1 : -1) * .08], g);
  } else if (type === 1) {
    const bloom = sphere(0.18, mat(color, 0.88), [0, h, 0], g, [0.85, 1.25, 0.85]);
    bloom.rotation.z = 0.08;
  } else {
    for (let i = 0; i < 6; i++) {
      const petal = sphere(0.12, mat(color, 0.92), [Math.cos(i * Math.PI / 3) * .16, h + Math.sin(i * Math.PI / 3) * .16, 0], g, [1.2, .72, .55]);
      petal.rotation.z = i * Math.PI / 3;
    }
    sphere(0.1, mats.butter, [0, h, .05], g);
  }
  const leaf = sphere(0.12, mats.leaf, [0.07, h * .45, 0], g, [1.4, .35, .6]);
  leaf.rotation.z = -.55;
  g.userData.phase = (x * 1.7 + z * 1.1) % 6;
  swayingPlants.push(g);
}

// INSTANCED GRASS CLUMPS
const bladeGeo = new THREE.ConeGeometry(0.07, 0.55, 5);
const grassInstances = new THREE.InstancedMesh(bladeGeo, mats.grassDark, isMobile ? 210 : 360);
grassInstances.castShadow = false;
const dummy = new THREE.Object3D();
let seeded = 71823;
const rand = () => ((seeded = (seeded * 16807) % 2147483647) - 1) / 2147483646;
let grassPlaced = 0;
while (grassPlaced < grassInstances.count) {
  const a = rand() * Math.PI * 2;
  const r = 3 + Math.sqrt(rand()) * 11;
  const x = Math.cos(a) * r;
  const z = Math.sin(a) * r;
  const nearPath = routePoints.some(p => Math.hypot(p.x - x, p.z - z) < 1.2);
  if (nearPath) continue;
  dummy.position.set(x, .86, z);
  dummy.rotation.set((rand() - .5) * .2, rand() * Math.PI, (rand() - .5) * .2);
  dummy.scale.setScalar(.65 + rand() * .75);
  dummy.updateMatrix();
  grassInstances.setMatrixAt(grassPlaced++, dummy.matrix);
}
scene.add(grassInstances);

// FENCE AND VINE ARCH
for (let i = 0; i < 12; i++) {
  const x = -12.5 + i * 1.28;
  if (x > -2.6 && x < .4) continue;
  box([.14, 1.65, .14], mats.wood, [x, 1.55, -11.3]);
  const cap = mesh(new THREE.ConeGeometry(.16, .28, 4), mats.wood);
  cap.position.set(x, 2.48, -11.3);
}
box([14.6, .13, .16], mats.wood, [-5.2, 1.35, -11.3]);
box([14.6, .13, .16], mats.wood, [-5.2, 2.05, -11.3]);
createArch(-1.1, -10.7);

function createArch(x: number, z: number) {
  const g = new THREE.Group();
  g.position.set(x, .65, z);
  for (const sx of [-1.25, 1.25]) box([.18, 3.7, .18], mats.wood, [sx, 1.85, 0], g);
  const archCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.25, 3.25, 0), new THREE.Vector3(-.75, 4.05, 0), new THREE.Vector3(0, 4.3, 0), new THREE.Vector3(.75, 4.05, 0), new THREE.Vector3(1.25, 3.25, 0)
  ]);
  mesh(new THREE.TubeGeometry(archCurve, 20, .12, 7, false), mats.wood, g);
  mesh(new THREE.TubeGeometry(archCurve, 28, .07, 6, false), mats.leafDark, g).position.z = .12;
  for (let i = 0; i < 15; i++) {
    const p = archCurve.getPoint(i / 14);
    sphere(.16, mats.leaf, [p.x + (i % 2 ? .12 : -.08), p.y, .17], g, [1.4, .55, .8]);
    if (i % 4 === 0) sphere(.11, mats.blush, [p.x, p.y - .12, .27], g);
  }
  scene.add(g);
}

// GARDEN SHED
const shed = new THREE.Group();
shed.position.set(8.1, .65, -7.5);
box([5.0, 3.8, 3.6], mats.cream, [0, 1.9, 0], shed);
const roof = mesh(new THREE.ConeGeometry(3.55, 1.5, 4), mats.terracotta, shed);
roof.position.set(0, 4.35, 0);
roof.rotation.y = Math.PI / 4;
roof.scale.z = .86;
box([1.65, 2.8, .16], mats.wood, [-.8, 1.5, 1.86], shed);
box([1.15, 1.15, .15], mat(0x9fc4c0, .35), [1.25, 2.45, 1.86], shed);
box([.07, 1.35, .12], mats.white, [1.25, 2.45, 1.96], shed);
box([1.35, .07, .12], mats.white, [1.25, 2.45, 1.96], shed);
sphere(.1, mats.butter, [-.2, 1.55, 1.98], shed);
scene.add(shed);

// FLOWERING TREE
const tree = new THREE.Group();
tree.position.set(-8.0, .65, -5.0);
const trunk = cylinder(.55, .82, 4.5, mats.woodDark, [0, 2.2, 0], tree, 10);
trunk.rotation.z = -.05;
for (const [x, y, z, s] of [[0,5.0,0,2.1],[-1.4,4.5,.2,1.55],[1.4,4.8,-.2,1.7],[-.6,5.7,-.7,1.65],[.8,5.8,.65,1.45]] as const) {
  sphere(s, mat(0x9bb27f, .98), [x,y,z], tree, [1.05,.85,1]);
  for (let j = 0; j < 7; j++) {
    const a = j * 2.4 + x;
    sphere(.16, j % 3 ? mats.blush : mats.white, [x + Math.cos(a) * s * .72, y + Math.sin(a * 1.7) * s * .5, z + Math.sin(a) * s * .64], tree);
  }
}
scene.add(tree);

// PROPS
createBench(-9.2, 4.1, .55);
createWateringCan(-5.5, -6.7);
createPots(4.6, -7.9);
createWheelbarrow(9.1, 4.9);
createDogBowl(2.0, -6.6);
const windmillRotor = createWindmill(-10.3, 7.2);
createSign(-6.8, 9.6);

function createBench(x: number, z: number, rot: number) {
  const g = new THREE.Group(); g.position.set(x, .7, z); g.rotation.y = rot;
  for (const sx of [-1.25, 1.25]) for (const sz of [-.38, .38]) box([.13, 1.05, .13], mats.metal, [sx, .5, sz], g);
  for (let i = 0; i < 4; i++) box([3.0, .14, .24], mats.wood, [0, 1 + i * .04, -.36 + i * .24], g);
  for (let i = 0; i < 3; i++) box([3.0, .24, .13], mats.wood, [0, 1.45 + i * .34, .38], g);
  scene.add(g);
}

function createWateringCan(x: number, z: number) {
  const g = new THREE.Group(); g.position.set(x, .75, z); g.rotation.y = -.6;
  cylinder(.46, .52, .75, mats.metal, [0,.38,0], g, 16);
  const spout = mesh(new THREE.CylinderGeometry(.12,.22,1.3,10), mats.metal, g); spout.rotation.z = -1.0; spout.position.set(.67,.52,0);
  const handleCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(-.38,.55,0),new THREE.Vector3(-.55,1.28,0),new THREE.Vector3(.35,1.25,0),new THREE.Vector3(.4,.7,0)]);
  mesh(new THREE.TubeGeometry(handleCurve,18,.07,7,false),mats.metal,g);
  scene.add(g);
}

function createPots(x: number, z: number) {
  const g = new THREE.Group(); g.position.set(x,.66,z);
  [[0,0,.46],[.8,.3,.34],[-.75,.15,.38]].forEach(([px,pz,s],i)=>{
    cylinder(s*.82,s,s*1.15,mats.terracotta,[px,s*.58,pz],g,14);
    sphere(s*.82,i===1?mats.blush:mats.leaf,[px,s*1.55,pz],g,[1,.9,1]);
  }); scene.add(g);
}

function createWheelbarrow(x: number, z: number) {
  const g = new THREE.Group(); g.position.set(x,.75,z); g.rotation.y=-.45;
  const tray=mesh(new THREE.CylinderGeometry(.55,.85,.8,4),mats.terracotta,g);tray.rotation.x=Math.PI/2;tray.rotation.z=Math.PI/4;tray.scale.z=1.5;tray.position.y=.85;
  const wheel=cylinder(.4,.4,.16,mats.dark,[0,.38,-1.05],g,16);wheel.rotation.z=Math.PI/2;
  for(const sx of [-.4,.4]){const h=box([.1,.1,2.5],mats.wood,[sx,.6,.35],g);h.rotation.x=-.18;}
  scene.add(g);
}

function createDogBowl(x:number,z:number){
  const bowl=mesh(new THREE.CylinderGeometry(.52,.7,.28,20,1,true),mats.red);bowl.position.set(x,.85,z);
  const water=mesh(new THREE.CircleGeometry(.48,20),new THREE.MeshStandardMaterial({color:0x8fc4cf,roughness:.15,metalness:.05}));water.rotation.x=-Math.PI/2;water.position.set(x,1.0,z);water.castShadow=false;
}

function createWindmill(x:number,z:number){
  const g=new THREE.Group();g.position.set(x,.7,z);
  cylinder(.12,.2,4.8,mats.wood,[0,2.4,0],g,10);
  const rotor=new THREE.Group();rotor.position.set(0,4.4,.14);
  for(let i=0;i<6;i++){const blade=box([.42,1.75,.08],i%2?mats.blush:mats.butter,[0,.95,0],rotor);blade.geometry.translate(0,-.15,0);blade.rotation.z=i*Math.PI/3;}
  sphere(.27,mats.terracotta,[0,0,.09],rotor);g.add(rotor);scene.add(g);return rotor;
}

function createSign(x:number,z:number){
  const g=new THREE.Group();g.position.set(x,.72,z);g.rotation.y=.2;
  for(const sx of [-1.15,1.15]) box([.15,2.2,.15],mats.wood,[sx,1.1,0],g);
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=280;const ctx=canvas.getContext('2d')!;
  ctx.fillStyle='#f4d9ac';ctx.fillRect(0,0,768,280);ctx.strokeStyle='#8d6547';ctx.lineWidth=24;ctx.strokeRect(12,12,744,256);
  ctx.fillStyle='#58704e';ctx.font='700 74px Georgia, serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('PUPPY GARDEN',384,126);
  ctx.font='600 30px sans-serif';ctx.fillStyle='#a66d61';ctx.fillText('RUN · PLAY · BLOOM',384,205);
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
  const sign=box([3.2,1.25,.17],new THREE.MeshStandardMaterial({map:tex,roughness:.85}),[0,2.1,0],g);sign.castShadow=true;scene.add(g);
}

// DOGS AND STATE MACHINE
type DogMood = 'run' | 'turn' | 'sniff' | 'play' | 'idle';
type DogRig = {
  root: THREE.Group; body: THREE.Group; head: THREE.Group; ears: THREE.Object3D[]; legs: THREE.Object3D[];
  tail: THREE.Group; name: string; label: Record<DogMood,string>; offset:number; speed:number; mood:DogMood; ball?:THREE.Mesh;
};

const creamDog = createDog('奶糖', mats.cream, mats.butter, 'floppy', .105, 1.42);
const corgiDog = createDog('栗子', mat(C.corgi,.88), mats.white, 'corgi', 0, 1.34);

function createDog(name:string, bodyMat:THREE.Material, patchMat:THREE.Material, earType:'floppy'|'corgi', offset:number, scale:number):DogRig{
  const root=new THREE.Group();root.scale.setScalar(scale);scene.add(root);root.userData.isDog=true;
  const body=new THREE.Group();root.add(body);
  sphere(.72,bodyMat,[0,1.12,0],body,[.92,.76,1.38]);
  sphere(.54,patchMat,[0,1.15,.35],body,[.8,.68,1.0]);
  const head=new THREE.Group();head.position.set(0,1.62,.92);body.add(head);
  sphere(.57,bodyMat,[0,0,0],head,[1,.9,.92]);
  sphere(.32,patchMat,[0,-.09,.46],head,[.9,.65,.75]);
  const nose=sphere(.105,mats.dark,[0,-.06,.72],head,[1,.8,.8]);nose.userData.nose=true;
  for(const sx of [-.2,.2]){sphere(.055,mats.dark,[sx,.08,.52],head);sphere(.019,mats.white,[sx-.012,.1,.562],head);}
  const ears:THREE.Object3D[]=[];
  for(const sx of [-1,1]){
    const eg=new THREE.Group();eg.position.set(sx*.42,.24,.02);head.add(eg);
    const e=earType==='floppy'?sphere(.29,bodyMat,[sx*.08,-.13,0],eg,[.72,1.35,.45]):mesh(new THREE.ConeGeometry(.27,.72,4),bodyMat,eg);
    if(earType==='corgi'){e.position.y=.28;e.rotation.z=sx*-.08;}
    else e.rotation.z=sx*.32; ears.push(eg);
  }
  const legs:THREE.Object3D[]=[];
  for(const [x,z] of [[-.38,-.48],[.38,-.48],[-.38,.48],[.38,.48]]){
    const leg=new THREE.Group();leg.position.set(x,.75,z);body.add(leg);
    const l=cylinder(.13,.16,.62,bodyMat,[0,-.3,0],leg,10);l.rotation.z=0;
    sphere(.18,patchMat,[0,-.62,.08],leg,[.85,.55,1.2]);legs.push(leg);
  }
  const tail=new THREE.Group();tail.position.set(0,1.25,-1.0);body.add(tail);
  const tailMesh=mesh(new THREE.CapsuleGeometry(.12,.64,4,8),bodyMat,tail);tailMesh.position.y=.36;tailMesh.rotation.x=-.55;
  if(name==='栗子'){
    const ball=sphere(.22,mats.red,[0,-.1,.91],head);ball.userData.ball=true;
  }
  const rig:DogRig={root,body,head,ears,legs,tail,name,offset,speed:1,mood:'run',label:{run:'追逐中',turn:'回头看看',sniff:'闻到了花香',play:'一起玩球',idle:'晒一会儿太阳'}};
  root.traverse(o=>o.userData.dogRig=rig);
  return rig;
}

const dogs=[corgiDog,creamDog];
let selectedDog:DogRig|null=null;
let chaseTime=0;

function updateDog(dog:DogRig, t:number, dt:number){
  const cycle=(t+dog.offset*12)%18;
  let mood:DogMood='run';
  let progress:number;
  if(cycle<11.4){progress=(cycle/11.4*.72+dog.offset)%1;mood=cycle>5.2&&cycle<6.1?'turn':'run';}
  else if(cycle<13.4){progress=(.72+(cycle-11.4)*.018+dog.offset)%1;mood='sniff';}
  else if(cycle<15.6){progress=(.756+(cycle-13.4)*.01+dog.offset)%1;mood='play';}
  else{progress=(.778+(cycle-15.6)/2.4*.222+dog.offset)%1;mood='run';}
  const p=chaseCurve.getPointAt(progress);
  const tangent=chaseCurve.getTangentAt(progress).normalize();
  dog.root.position.lerp(new THREE.Vector3(p.x,.76,p.z),1-Math.exp(-dt*7));
  const desired=Math.atan2(tangent.x,tangent.z);
  let delta=desired-dog.root.rotation.y;delta=Math.atan2(Math.sin(delta),Math.cos(delta));
  dog.root.rotation.y+=delta*Math.min(1,dt*6);
  dog.mood=mood;
  const run=mood==='run'||mood==='turn';
  const stride=Math.sin(t*12+(dog.offset*30));
  dog.body.position.y=(run?Math.abs(Math.sin(t*12))*.11:Math.sin(t*2)*.025);
  dog.body.rotation.z=run?Math.sin(t*6)*.025:0;
  dog.legs.forEach((leg,i)=>{leg.rotation.x=run?stride*(i%2?-.58:.58):0;});
  dog.tail.rotation.z=Math.sin(t*(run?12:6)+dog.offset*8)*.55;
  dog.tail.rotation.x=-.35;
  dog.ears.forEach((ear,i)=>ear.rotation.z=(i?1:-1)*(run?Math.sin(t*12)*.13:.04));
  dog.head.rotation.x=mood==='sniff'?.5:run?Math.sin(t*12+.8)*.05:0;
  dog.head.rotation.y=mood==='turn'?(dog.name==='栗子'?.55:-.35):mood==='play'?Math.sin(t*2.2)*.18:0;
  if(mood==='play') dog.root.position.y+=Math.max(0,Math.sin((cycle-13.4)*Math.PI*1.8))*.18;
}

// BUTTERFLIES, PETALS AND DUST
const butterflies:THREE.Group[]=[];
for(let i=0;i<7;i++){
  const b=new THREE.Group();
  const wingMat=mat(i%2?0xefb2a2:0xf4d778,.8);
  for(const sx of [-1,1]){const w=sphere(.18,wingMat,[sx*.16,0,0],b,[1.2,.18,.8]);w.userData.side=sx;}
  sphere(.045,mats.dark,[0,0,0],b,[.8,1.8,.8]);b.userData={phase:i*.91,radius:2.5+i*.32,height:2.2+(i%3)*.45,center:i%2?new THREE.Vector3(4,0,2):new THREE.Vector3(-4,0,-1.5)};
  butterflies.push(b);scene.add(b);
}

const petalCount=isMobile?36:70;
const petalGeo=new THREE.BufferGeometry();const petalPositions=new Float32Array(petalCount*3);const petalData:{x:number;y:number;z:number;s:number;p:number}[]=[];
for(let i=0;i<petalCount;i++){const d={x:-8+(rand()-.5)*8,y:1+rand()*8,z:-5+(rand()-.5)*8,s:.25+rand()*.28,p:rand()*10};petalData.push(d);petalPositions.set([d.x,d.y,d.z],i*3);}
petalGeo.setAttribute('position',new THREE.BufferAttribute(petalPositions,3));
const petalMat=new THREE.PointsMaterial({color:0xf3b8bd,size:.13,sizeAttenuation:true,transparent:true,opacity:.78,depthWrite:false});
const petals=new THREE.Points(petalGeo,petalMat);scene.add(petals);

const dustGeo=new THREE.BufferGeometry();const dustPositions=new Float32Array((isMobile?70:130)*3);
for(let i=0;i<dustPositions.length;i+=3){dustPositions[i]=(rand()-.5)*26;dustPositions[i+1]=1+rand()*10;dustPositions[i+2]=(rand()-.5)*26;}
dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPositions,3));
const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xffe8b5,size:.055,transparent:true,opacity:.45,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(dust);

// INTERACTION
const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();let pointerDown={x:0,y:0};
renderer.domElement.addEventListener('pointerdown',e=>{pointerDown={x:e.clientX,y:e.clientY};hint.classList.add('is-hidden');});
renderer.domElement.addEventListener('pointerup',e=>{
  if(Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y)>7)return;
  pointer.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);raycaster.setFromCamera(pointer,camera);
  const hits=raycaster.intersectObjects(dogs.map(d=>d.root),true);
  if(hits.length){const rig=hits[0].object.userData.dogRig as DogRig|undefined;if(rig)selectDog(rig);}else selectDog(null);
});

function selectDog(dog:DogRig|null){
  selectedDog=dog;controls.autoRotate=false;autoButton.classList.remove('is-active');autoButton.setAttribute('aria-pressed','false');
  if(dog){dogName.textContent=dog.name;dogState.textContent=dog.label[dog.mood];card.classList.add('is-visible');}
  else card.classList.remove('is-visible');
}

autoButton.addEventListener('click',()=>{
  const next=!controls.autoRotate;controls.autoRotate=next;selectedDog=null;card.classList.remove('is-visible');autoButton.classList.toggle('is-active',next);autoButton.setAttribute('aria-pressed',String(next));
});
resetButton.addEventListener('click',()=>{
  selectedDog=null;card.classList.remove('is-visible');controls.autoRotate=!reducedMotion;autoButton.classList.toggle('is-active',!reducedMotion);autoButton.setAttribute('aria-pressed',String(!reducedMotion));
  camera.position.copy(homePosition);controls.target.copy(homeTarget);controls.update();
});
controls.addEventListener('start',()=>{if(!selectedDog){controls.autoRotate=false;autoButton.classList.remove('is-active');autoButton.setAttribute('aria-pressed','false');}});

function updateCard(){
  if(!selectedDog)return;
  const p=selectedDog.root.position.clone();p.y+=3.2;p.project(camera);
  const cardX=THREE.MathUtils.clamp((p.x*.5+.5)*innerWidth,82,innerWidth-82);
  const cardY=THREE.MathUtils.clamp((-p.y*.5+.5)*innerHeight,150,innerHeight-72);
  card.style.left=`${cardX}px`;card.style.top=`${cardY}px`;
  dogState.textContent=selectedDog.label[selectedDog.mood];
}

// LOOP
const clock=new THREE.Clock();let paused=false;let elapsed=0;
function animate(){
  requestAnimationFrame(animate);if(paused)return;
  const dt=Math.min(clock.getDelta(),.04);elapsed+=dt;chaseTime+=dt*(reducedMotion?.32:1);
  dogs.forEach(d=>updateDog(d,chaseTime,dt));
  swayingPlants.forEach((p,i)=>{const phase=p.userData.phase||i;p.rotation.z=Math.sin(elapsed*1.35+phase)*.025;p.rotation.x=Math.cos(elapsed*1.1+phase)*.018;});
  windmillRotor.rotation.z-=dt*(reducedMotion?.18:.55);
  butterflies.forEach((b,i)=>{const d=b.userData;const a=elapsed*.42+d.phase;b.position.set(d.center.x+Math.cos(a)*d.radius,d.height+Math.sin(a*2.1)*.35,d.center.z+Math.sin(a)*d.radius*.72);b.rotation.y=-a+.4;const flap=Math.sin(elapsed*9+i);b.children.slice(0,2).forEach((w,j)=>w.rotation.y=(j?1:-1)*flap*.8);});
  const arr=petalGeo.attributes.position.array as Float32Array;petalData.forEach((d,i)=>{d.y-=dt*d.s;d.x+=Math.sin(elapsed*.8+d.p)*dt*.16;d.z+=Math.cos(elapsed*.65+d.p)*dt*.1;if(d.y<.8)d.y=8+rand()*2;arr[i*3]=d.x;arr[i*3+1]=d.y;arr[i*3+2]=d.z;});petalGeo.attributes.position.needsUpdate=true;
  dust.rotation.y=elapsed*.025;
  if(selectedDog){
    const focus=selectedDog.root.position.clone().add(new THREE.Vector3(0,1.4,0));controls.target.lerp(focus,1-Math.exp(-dt*4));
    const desiredOffset=new THREE.Vector3(7.5,5.1,8.2).applyAxisAngle(new THREE.Vector3(0,1,0),selectedDog.root.rotation.y);
    const desired=focus.clone().add(desiredOffset);camera.position.lerp(desired,1-Math.exp(-dt*1.8));updateCard();
  }
  controls.update();composer.render();
}

function onResize(){
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.5:2));composer.setSize(innerWidth,innerHeight);
}
addEventListener('resize',onResize);
document.addEventListener('visibilitychange',()=>{paused=document.hidden;if(!paused)clock.getDelta();});

window.addEventListener('beforeunload',()=>{
  renderer.dispose();composer.dispose();scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const mm=Array.isArray(o.material)?o.material:[o.material];mm.forEach(m=>m.dispose());}});
});

animate();
setTimeout(()=>loading.classList.add('is-done'),420);
setTimeout(()=>hint.classList.add('is-hidden'),6500);
