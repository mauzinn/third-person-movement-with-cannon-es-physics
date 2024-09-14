const top_button = document.querySelector("#top");
const run_button = document.querySelector("#run");
const left_button = document.querySelector("#left");
const right_button = document.querySelector("#right");
const bottom_button = document.querySelector("#bottom");
const keysAndTasks = [{dom: top_button, key: "w"}, {dom: bottom_button, key: "s"}, {dom: left_button, key: "a"}, {dom: right_button, key: "d"}]

class inputController {
    constructor() {
        this.initialization();
    }

    initialization() {
        this.allowedKeys = {
            w: true,
            s: true,
            a: true,
            d: true
        }
        this.keys = {
            w: false,
            s: false,
            a: false,
            d: false,
            r: false
        };

        document.addEventListener("keydown", (e) => this.keyDown(e));
        document.addEventListener("keyup", (e) => this.keyUp(e));
        keysAndTasks.map(kat => {
            kat.dom.addEventListener("touchstart", () => {
                this.keys[kat.key] = true;
            });
            kat.dom.addEventListener("touchend", () => {
                this.keys[kat.key]  = false;
            });
        })

        run_button.addEventListener("click", () => {
            this.keys.r = !this.keys.r;
            
            if (this.keys.r) {
                run_button.className = "run_on";
            } else {
                run_button.className = "run_off";
            }
        })
    }

    keyDown(e) {
        this.keys[e.key] = true;
    }

    keyUp(e) {
        this.keys[e.key] = false;
    }

    needAnimation() {
        for (let key in this.keys) {
            const data = this.keys[key];

            if (data && this.allowedKeys[key]) {
                return true;
            }
        }

        return false;
    }

    nextAnimation() {
        let new_animation = 3;

        if (this.keys.r) {
            new_animation = 1;
        }

        return new_animation;
    }
}

const input = new inputController();
export { input };