import * as THREE from 'three';
import {GLTFLoader} from 'GLTFLoader';
import {BufferGeometryUtils} from 'BufferGeometryUtils';
import {renderer, camera, runtime, world, universe, physics, ui, rig, app, appManager, popovers} from 'app';
import Simplex from './simplex-noise.js';
import alea from './alea.js';

const parcelSize = 16;
const width = 10;
const height = 10;
const depth = 10;
const streetSize = new THREE.Vector3(10, 1, 1000);

const zeroVector = new THREE.Vector3(0, 0, 0);
const zeroQuaternion = new THREE.Quaternion();
const oneVector = new THREE.Vector3(1, 1, 1);
const localVector = new THREE.Vector3();
const localVector2 = new THREE.Vector3();
const localVector3 = new THREE.Vector3();
const localVector2D = new THREE.Vector2();
const localQuaternion = new THREE.Quaternion();
const localEuler = new THREE.Euler();
const localMatrix = new THREE.Matrix4();
const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

const rootScene = new THREE.Object3D();
app.object.add(rootScene);

(async () => {
  const res = await fetch('./parcels/parcels.json');
  const parcelsJson = await res.json();
  for (const parcel of parcelsJson) {
    const {name, rarity, extents} = parcel;
    const o = {
      // objects: [],
      room: name,
      extents,
    };
    const s = JSON.stringify(o);
    const b = new Blob([s], {
      type: 'application/json',
    });
    const u = URL.createObjectURL(b) + '/parcel.url';
    world.addObject(u, null, new THREE.Vector3(), new THREE.Quaternion());
  }
})();

let lastUpdateTime = Date.now();
renderer.setAnimationLoop(() => {
  const now = Date.now();

  

  lastUpdateTime = now;
});