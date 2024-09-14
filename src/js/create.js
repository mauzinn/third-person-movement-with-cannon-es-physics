import { CANNON, THREE } from "./libs.js";
import { objects } from "./initialization.js";

function newBox([x, y, z], [sizex, sizey, sizez], texture_url, scene, world, mass) {
    const loader = new THREE.TextureLoader();
    const Box = new THREE.Mesh(new THREE.BoxGeometry(sizex, sizey, sizez), new THREE.MeshStandardMaterial({ map: loader.load(texture_url) }));
    const BoxBody = new CANNON.Body({
        position: new CANNON.Vec3(x, y, z),
        mass: mass,
        shape: new CANNON.Box(new CANNON.Vec3(sizex / 2, sizey / 2, sizez / 2))
    });
    
    world.addBody(BoxBody)
    scene.add(Box);

    objects.push({ display: Box, body: BoxBody });
}

export { newBox, objects };