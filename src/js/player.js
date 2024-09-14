import { CANNON, GLTFLoader, THREE } from "./libs.js";
import { input } from "./inputController.js";

export class Player {
    constructor(position, model_url, model_scale, camera, speed) {
        this.position = position;
        this.model_url = model_url;
        this.scale = model_scale;
        this.camera = camera;
        this.action = null;
        this.speed = speed;
        this.rotation = new THREE.Vector3();
        this.initialization();
    }

    initialization() {
        new GLTFLoader().load(this.model_url, (data) => {
            data.scene.scale.set(this.scale, this.scale, this.scale);
            const playerBody = new CANNON.Body({
                mass: 10,
                shape: new CANNON.Sphere(1),
                position: new CANNON.Vec3(this.position.x, this.position.y, this.position.z)
            })
            const wireframe = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 20), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }));

            this.player = { model: data.scene, body: playerBody, wireframe: wireframe, animations: data.animations, mixer: new THREE.AnimationMixer(data.scene) };
        })
    }

    get() {
        return this.player;
    }

    changeAnimation(animation) {
        if (this.action != null) {
            this.action = null;
        }

        this.action = this.player.mixer.clipAction(this.player.animations[animation]);
        this.action.play();
    }

    stopAnimation() {
        if (this.action == null) {
            return;
        }

        this.action.stop();
        this.action = null;
    }

    update() {
        this.run = input.keys.r ? true : false;

        this.updateMovement();
        this.updateRotation();
    }

    updateRotation() {
        if (input.needAnimation()) {
            const newRotation = Math.atan2(-this.rotation.x, -this.rotation.z);
            this.player.model.rotation.y = newRotation;
        }
    }

    updatePosition(forward, strafe) {
        this.player.body.velocity.x = forward.x + strafe.x
        this.player.body.velocity.z = forward.z + strafe.z

        this.rotation.addVectors(forward, strafe);
    }

    updateMovement() {
        const forwardD = (input.keys.w ? 1 : 0) + (input.keys.s ? -1 : 0);
        const strafeD = (input.keys.a ? 1 : 0) + (input.keys.d ? -1 : 0);

        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.camera.quaternion);
        const strafe = new THREE.Vector3(-1, 0, 0);
        strafe.applyQuaternion(this.camera.quaternion);

        forward.y = 0;
        strafe.y = 0;

        let speed = this.run ? 2 : 1;

        const moveFoward = forward.multiplyScalar(forwardD * speed);
        const moveStrafe = strafe.multiplyScalar(strafeD * speed);
        
        this.updatePosition(moveFoward, moveStrafe);
    }
}