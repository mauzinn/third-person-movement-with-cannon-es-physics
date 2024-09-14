//Third Person Movement with Cannon ES // BY: mauzinn

import { THREE, CANNON, OrbitControls } from './libs.js';
import { Player } from './player.js';
import { input } from './inputController.js';
import { newBox } from './create.js';
const button_wireframe = document.querySelector("#button_wireframe");
export const objects = [];

(() => {
    //Basics Variables;
        const world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.81, 0)
        });
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer();
        const controls = new OrbitControls(camera, renderer.domElement);
        let loaded = false;
        let wireframe = false;
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.querySelector("#main").appendChild(renderer.domElement);
        controls.enablePan = false;
        controls.maxPolarAngle = Math.PI / 2.5;
        controls.minPolarAngle = Math.PI / 2.5;
        controls.maxDistance = 4;
        controls.minDistance = 4;
        scene.background = new THREE.Color(0x98DED9)

        camera.position.set(2, 2, 2);
        camera.lookAt(scene.position);


    //Dom
        //Button to change Wireframe
            button_wireframe.addEventListener("click", () => {
                if (button_wireframe.className == "on") {
                    button_wireframe.className = "off";
                    wireframe = false;
                } else {
                    button_wireframe.className = "on"
                    wireframe = true;
                }
            })

    
    //Models
        //Light
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
            directionalLight.position.set(15, 15, 25);
            directionalLight.lookAt(scene.position);

        //Box
            const box1 = newBox([0, 0, 0], [1, 1, 1], 'data/images/box1.jpeg', scene, world, 1);
            const box2 = newBox([-5, 0, -6], [2, 2, 2], 'data/images/box1.jpeg', scene, world, 2);

        //Ground
            const ground1 = newBox([0, -15, 0], [30, 30, 30], 'data/images/ground1.jpeg', scene, world, 0);

        //Player
            const player_position = new THREE.Vector3(0, 5, 0);
            const player = new Player(player_position, 'data/models/Soldier.glb', 1.2, camera, 1);
            let player_data;
            const clock = new THREE.Clock();
            let inAnimation = false;
            let currentAnim = 0;

            setTimeout(() => {
                loaded = true;
                player_data = player.get();
                world.addBody(player_data.body);
                scene.add(player_data.model, ambientLight, directionalLight, player_data.wireframe);
                player_data.wireframe.visible = false;
                player.changeAnimation(0);
            }, 1000)

    //Loop;
        function loop_function() {
            requestAnimationFrame(loop_function);

            if (loaded) {
                player_data.mixer.update(clock.getDelta());
                controls.target.set(player_data.model.position.x, player_data.model.position.y + 1.8, player_data.model.position.z);
                controls.update();
                player.update();

                if (!inAnimation && input.needAnimation() || currentAnim != input.nextAnimation()) {
                    inAnimation = true;
                    player.stopAnimation();
                    currentAnim = input.nextAnimation();
                    player.changeAnimation(input.nextAnimation());
                } else if (inAnimation && !input.needAnimation()) {
                    inAnimation = false;
                    player.stopAnimation();
                    player.changeAnimation(0);
                }

                objects.map(object => {
                    object.display.position.copy(object.body.position);
                    object.display.quaternion.copy(object.body.quaternion);
                    object.display.material.wireframe = wireframe;
                })

                player_data.model.position.set(player_data.body.position.x, player_data.body.position.y - 1, player_data.body.position.z);

                if (wireframe) {
                    player_data.wireframe.visible = true;
                    player_data.wireframe.position.copy(player_data.body.position);
                    player_data.wireframe.quaternion.copy(player_data.body.quaternion);
                } else {
                    player_data.wireframe.visible = false;
                }
            }

            world.step(1 / 24);
            renderer.render( scene, camera );
        }
        loop_function();
})()