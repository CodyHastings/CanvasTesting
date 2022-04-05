$(document).ready(function() {
    var canvas = document.querySelector("canvas");
    const gravity = 0.2;
    const friction = 0.98;
    var flag = true;
    var kill = false;
    const c = canvas.getContext("2d");
    var mouse = {
        x: 1,
        y: 1
    }
    const colors = [
        '#04e5de',
        '#421384',
        '#c7d9e0',
        '#e0c7dd'
    ];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 30;
    window.addEventListener("resize", function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    window.addEventListener("mousemove", function(event) {
        // console.log(particleArray)
        mouse.x = event.x;
        mouse.y = event.y;
    })
    function randomIntFromRange(min,max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    function randomColor(colors) {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function Particle(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.radians = Math.random() * Math.PI * 2;
        this.velocity = 0.05;
        this.distanceFromCenter = { x: randomIntFromRange(20, 70), y: randomIntFromRange(20,100)}
        this.updateP = function() {
            var lastPoint = {x: this.x, y: this.y};
            this.radians += this.velocity
            this.x = mouse.x + Math.cos(this.radians) * this.distanceFromCenter.x;
            this.y = mouse.y + Math.sin(this.radians) * this.distanceFromCenter.y;


            this.drawP(lastPoint);
        }

        this.drawP = function(lastPoint) {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.fillStyle = this.color;
            c.fill();
            c.closePath();
            c.beginPath();
            c.strokeStyle = this.color;
            c.lineWidth = this.radius * 2;
            c.moveTo(lastPoint.x, lastPoint.y)
            c.lineTo(this.x, this.y)
            c.stroke();
            c.closePath();
        };
    }


    function Ball(x, y, dx, dy, radius, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.color = color;
        this.update = function() {
            if (this.y + this.radius + this.dy > canvas.height) {
                this.dy = -this.dy;
                this.dy = this.dy * friction;
                this.dx = this.dx * friction;
            } else {
                this.dy += gravity;
            }
            if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
                this.dx = -this.dx * friction;
            }
            this.x += this.dx;
            this.y += this.dy;
            this.draw();
        };
        this.vacuum = function(){
            if(this.x + this.radius === canvas.width/2 && this.y >= 0){
                this.y-= 25;
            }
            if (this.x + this.radius > canvas.width /2 && this.y >= 0){
                this.x -= 25;
                this.y -= 25;
            }
            if (this.x + this.radius  < canvas.width /2 && this.y >= 0){
                this.x += 25;
            } else if (this.y <= 0) {
                kill = true;
            }
            this.draw();
        }
        this.draw = function() {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.stroke();
            c.fillStyle = this.color;
            c.fill();
            c.closePath();
        };
    }
    let ballArray = [];
    function init() {
        let radius = randomIntFromRange(8, 20);
        let x = randomIntFromRange(radius, canvas.width - radius);
        let y = randomIntFromRange(0, canvas.height - radius);
        let dx = randomIntFromRange(-3, 3)
        let dy = randomIntFromRange(-2, 2)
        let color = randomColor(colors)
        ballArray.push(new Ball(x, y, dx, dy, radius, color));
    }
    function initBigBall(){
        let radius = 100;
        let x = randomIntFromRange(radius, canvas.width - radius);
        let y = randomIntFromRange(0, canvas.height - radius);
        let dx = randomIntFromRange(-3, 3)
        let dy = randomIntFromRange(-2, 2)
        let color = randomColor(colors)
        ballArray.push(new Ball(x, y, dx, dy, radius, color));
    }
    function init300Balls(){
        for (let i = 0; i < 300; i++) {
            let radius = randomIntFromRange(4, 12);
            let x = randomIntFromRange(radius, canvas.width - radius);
            let y = 400;
            let dx = randomIntFromRange(-3, 3)
            let dy = randomIntFromRange(-2, 2)
            let color = randomColor(colors)
            ballArray.push(new Ball(x, y, dx, dy, radius, color));
        }
    }
    var particleArray = []
    function initParticle(){
        // console.log(particleArray)
        for (let i = 0; i < 4; i++) {
            let x = canvas.width /2 + randomIntFromRange(-5, 5);
            let y = canvas.height /2 + randomIntFromRange(-5, 5);
            let radius = randomIntFromRange(5, 10)
            let color = randomColor(colors)
            particleArray.push(new Particle(x, y, radius, color));

        }
    }
    function animate() {
        requestAnimationFrame(animate);
        // c.fillStyle = 'rgba(0, 0, 0, 0.05)'
        // c.fillRect(0, 0, innerWidth, innerHeight)
        c.clearRect(0, 0, innerWidth , innerHeight);
        if (flag === false){
            for (let i = 0; i < ballArray.length; i++) {
                ballArray[i].vacuum();
                if (kill === true) {
                    ballArray.splice(i, 1);
                    kill = false;
                }
            }
        } else {
            for (let i = 0; i < ballArray.length; i++) {
                ballArray[i].update();
            }
        }
        if (ballArray.length === 0) {
            flag = true;
        }
        for (let j = 0; j < particleArray.length; j++) {
            particleArray[j].updateP();
        }

    }
    function vacuum(){
        flag = false;
    }
    initParticle();
    animate();
    $("#addBall").click(init);
    $("#bigBall").click(initBigBall);
    $("#200Balls").click(init300Balls);
    $("#vacuumBalls").click(vacuum);


});