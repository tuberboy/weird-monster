const rnd = () => {
    return 1 - Math.random() * 2;
};

const vary = (base, range) => {
    return base + base * rnd() * range;
};

const step = (min, max, step) => {
    return (max - min) * step + min;
};

const rndRange = (min, max) => {
    return step(min, max, Math.random());
};

class CircleScene
{
    constructor() {



        this.width   = window.innerWidth;
        this.height  = window.innerHeight;
        this.refSize = (this.width + this.height) / 2;

        this.config = {
            colors : [
                { occur: 5,  light: true,  alpha: 0.8, style: 'hsl(178, 100%, 60%)' },
                { occur: 10, light: false, alpha: 0.8, style: '#222' },
                { occur: 15, light: false, alpha: 0.8, style: '#555' }
            ],
            maxSize     : 0.02,
            maxDistance : 0.1,
            objectRadius : {
                min : 0.05,
                max : 0.2
            },
            count : 1000,

        };

        this.canvas = document.querySelector('canvas');
        this.engine = this.canvas.getContext('2d');

        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);

        this.objects = [];
        this.colors  = [];

        this.currentMove = [this.width / 2 | 0, this.height / 2 | 0];
        this.mouseStack  = new Array(100).fill(null).map(() => { return [...this.currentMove]; });
        this.mouseIndex  = 0;

        this.canvas.addEventListener('mousemove', e => {
             this.currentMove[0] = e.clientX;
             this.currentMove[1] = e.clientY;
        });

        this.buildColors();
        this.build();

    }

    currentMouseStack() {
        return this.getMouseStack(0);
    }

    getMouseStack(pos) {
        return this.mouseStack[(this.mouseStack.length + (this.mouseIndex - pos * this.mouseStack.length) | 0) % this.mouseStack.length];
    }

    buildColors() {

        this.config.colors.forEach(color => {
            for (let i = 0; i < color.occur; i++) {
                this.colors.push(color);
            }
        });

    }

    build() {

        for (let i = 0; i < this.config.count; i++) {

            const pos = i / this.config.count;

            this.objects.push({
                color: this.colors[this.colors.length * Math.random() | 0],
                pos : {
                    index : pos,
                    distance : {
                        current : Math.random(),
                        move    : rnd()
                    },
                    rotation : {
                        current : Math.random(),
                        move    : rnd()
                    },
                },
                size : Math.random() + 0.3,
                rotation : {
                    current : Math.random(),
                    move    : rnd()
                },
                parts: [
                    (0 / 3 + Math.random() / 1.5) * Math.PI,
                    (2 / 3 + Math.random() / 1.5) * Math.PI,
                    (4 / 3 + Math.random() / 1.5) * Math.PI,
                ],
            });
        }

    }

    mouseWalk() {

        this.mouseIndex++;

        const stack = this.currentMouseStack();

        stack[0] = this.currentMove[0];
        stack[1] = this.currentMove[1];

    }

    draw() {

        this.mouseWalk();

        // this.engine.fillStyle = 'rgba(0, 0, 0, 0.5)';
        // this.engine.fillRect(0, 0, this.width, this.height);
        this.engine.clearRect(0, 0, this.width, this.height);

        this.objects.forEach((obj) => {

            this.engine.globalCompositeOperation = '';

            this.engine.beginPath();
            this.engine.globalAlpha = obj.color.alpha;
            this.engine.fillStyle   = obj.color.style;

            if (obj.color.light) {
                // this.engine.globalCompositeOperation = 'lighter';
            }

            const stack = this.getMouseStack(1 - obj.pos.index);

            //rotate self
            obj.pos.rotation.current += obj.pos.rotation.move * 0.01;
            obj.rotation.current     += obj.rotation.move * 0.1;

            const dist = this.config.maxDistance * obj.pos.index * obj.pos.distance.current * this.refSize;
            const xAdd = Math.cos(obj.pos.rotation.current * Math.PI * 2) * dist;
            const yAdd = Math.sin(obj.pos.rotation.current * Math.PI * 2) * dist;


            this.engine.moveTo(
                stack[0] + xAdd + Math.cos(obj.rotation.current + obj.parts[0]) * this.config.maxSize * obj.pos.index * this.refSize * obj.size,
                stack[1] + yAdd + Math.sin(obj.rotation.current + obj.parts[0]) * this.config.maxSize * obj.pos.index * this.refSize * obj.size,
            );

            this.engine.lineTo(
                stack[0] + xAdd + Math.cos(obj.rotation.current + obj.parts[1]) * this.config.maxSize * obj.pos.index * this.refSize * obj.size,
                stack[1] + yAdd + Math.sin(obj.rotation.current + obj.parts[1]) * this.config.maxSize * obj.pos.index * this.refSize * obj.size,
            );

            this.engine.lineTo(
                stack[0] + xAdd + Math.cos(obj.rotation.current + obj.parts[2]) * this.config.maxSize * obj.pos.index * this.refSize * obj.size,
                stack[1] + yAdd + Math.sin(obj.rotation.current + obj.parts[2]) * this.config.maxSize * obj.pos.index * this.refSize * obj.size,
            );

            this.engine.closePath();
            this.engine.fill();


        });

        requestAnimationFrame(this.draw.bind(this));

    }

    run() {

        this.draw();

    }
}

new CircleScene().run();