import * as THREE from 'three';
import {GLTFLoader} from 'GLTFLoader';
import {renderer, camera, runtime, world, universe, physics, ui, rig, app, scene, appManager, popovers, crypto} from 'app';

const gltfLoader = new GLTFLoader();

const tokensHost = `https://tokens.webaverse.com`;
const landHost = `https://land.webaverse.com`;

(async () => {
  let parcelsJson = await universe.getParcels();
  parcelsJson = parcelsJson.slice(0, 1);
  for (const parcel of parcelsJson) {
    (async () => {
      const res = await fetch(`${landHost}/${parcel.id}`);
      const land = await res.json();
      const {hash: contentId} = land.properties;
      
      const id = (() => {
        const id = parseInt(contentId, 10);
        if (id > 0) {
          return id;
        } else {
          let u;
          try {
            u = new URL(contentId);
          } catch (err) {
            u = null;
          }
          if (u && /\.[^\.]+$/.test(u.pathname)) {
            return contentId;
          } else {
            return null;
          }
        }
      })();
      const u = await (async () => {
        if (typeof id === 'number') {
          const res = await fetch(`https://tokens.webaverse.com/${id}`);
          const j = await res.json();
          const {properties: {ext, hash, name}} = j;
          console.warn(j);
          return `https://ipfs.exokit.org/${hash}/${name}.${ext}`;
        } else if (typeof id === 'string') {
          return id;
        } else {
          return null;
        }
      })();
      console.log('loading', parcel, u);
      
      const {name} = parcel;
      const {rarity} = parcel.properties;
      const extents = JSON.parse(parcel.properties.extents);
      const box = new THREE.Box3(
        new THREE.Vector3().fromArray(extents[0]),
        new THREE.Vector3().fromArray(extents[1])
      );
      const center = box.getCenter(new THREE.Vector3());
      const centerBox = new THREE.Box3(
        box.min.clone().sub(center),
        box.max.clone().sub(center)
      );

      const o = {
        contentId: id || `./parcels/parcel.json`,
        room: name.replace(/ /g, '-'),
        rarity,
        extents,
      };
      const s = JSON.stringify(o);
      const b = new Blob([s], {
        type: 'application/json',
      });
      const parcelUrl = URL.createObjectURL(b) + '/parcel.url';
      const bakeUrl = `https://bake.exokit.org/model.glb?u=${u}&e=${JSON.stringify([centerBox.min.toArray(), centerBox.max.toArray()])}`;

      await Promise.all([
        await world.addStaticObject(parcelUrl, null, new THREE.Vector3(), new THREE.Quaternion()),
        await world.addStaticObject(bakeUrl, null, new THREE.Vector3(center.x, box.min.y, center.z), new THREE.Quaternion()),
      ]);
    })();
  }
})();