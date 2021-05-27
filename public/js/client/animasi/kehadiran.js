/** start of text animation */
//var title = ['Firly Arie Azland', 'Imam', 'Radityo', 'Permana', 'Imam Darto', 'Eko', 'Muhammad Raden Hafizd Rizki Ikhsan'];
var j = 0;  // the index of the current item to show
setInterval(function() { // setInterval makes it run repeatedly        
    // Wrap every letter in a span
    document.getElementById('welcome').innerHTML = "Welcome,";
    var textWrapperW = document.querySelector('.welcome');
    textWrapperW.innerHTML = textWrapperW.textContent.replace(/\S/g, "<span class='letterW'>$&</span>");

    document.getElementById('nama').innerHTML = title[j++];    // get the item and increment
    var textWrapper = document.querySelector('.nama');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({loop: true})
    .add({
        targets: ['.welcome .letterW','.nama .letter'],
        translateY: [100,0],
        translateZ: 0,
        opacity: [0,1],
        easing: "easeOutExpo",
        duration: 1400,
        delay: (el, i) => 300 + 30 * i
    }).add({
        targets: ['.welcome .letterW','.nama .letter'],
        translateY: [0,-100],
        opacity: [1,0],
        easing: "easeInExpo",
        duration: 1200,
        delay: (el, i) => 10 + 30 * i
    });
    if (j == title.length) j = 0; // reset to first element if you've reached the end
}, 4000);

window.setTimeout(function () {
    window.location.reload();
}, 300000);
/** end of text animation */

// canvas 1
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// canvas 2
const canvasbg = document.getElementById('canvasbg');
const ctxbg = canvasbg.getContext('2d');
canvasbg.width = window.innerWidth;
canvasbg.height = window.innerHeight;

let Bubbles = [];
let bgBubbles = [];

function addBubble() {
    // Bubbles.push(new Bubble('rgb(255,194,194', 2.5));
    Bubbles.push(new Bubble('rgb(0,212,255,1', 2.5));
}

function addBgBubble() {
    bgBubbles.push(new Bubble('rgb(255,255,255', 3.5));
}

class Bubble {
    constructor (color, ySpeed) {
        this.radius = (Math.random() * 150) + 30;
        this.life = true;
        this.x = (Math.random() * window.innerWidth);
        this.y = (Math.random() * 20) + window.innerHeight + this.radius;
        this.vy = ((Math.random() * 0.0002) + 0.001) + ySpeed;
        this.vr = 0;
        this.vx = (Math.random() * 4) - 2;
        this.color = color;
    }

    update() {
        this.vy += 0.00001;
        this.vr += 0.02;
        this.y -= this.vy;
        this.x += this.vx;
        if(this.radius > 1){
            this.radius -= this.vr;
        }
        if(this.radius <= 1){
            this.life = false;
        }
    }
    
    draw(currentCanvas) {
        currentCanvas.beginPath();
        currentCanvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        currentCanvas. fillStyle = this.color;
        currentCanvas.fill();
    }
}

function handleBubbles() {
    for(let i = Bubbles.length - 1; i >= 0; i--){
        Bubbles[i].update();
        if(!Bubbles[i].life){
            Bubbles.splice(i, 1);
        }
    }

    for(let i = bgBubbles.length - 1; i >= 0; i --){
        bgBubbles[i].update();
        if(!bgBubbles[i].life){
            bgBubbles.splice(i, 1);
        }
    }

    if(Bubbles.length < (window.innerWidth / 4)){
        addBubble();
    }

    if(bgBubbles.length < (window.innerWidth / 12)){
        addBgBubble();
    }
}

function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctxbg.clearRect(0,0,canvas.width, canvas.height);

    handleBubbles();

    for(let i = bgBubbles.length - 1; i >= 0; i--){
        bgBubbles[i].draw(ctxbg);
    }

    for(let i = Bubbles.length - 1; i >= 0; i--){
        Bubbles[i].draw(ctx);
    }

    requestAnimationFrame(animate);
}

window.addEventListener('load', animate);

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasbg.width = window.innerWidth;
    canvasbg.height = window.innerHeight;

    let Bubbles = [];
    let bgBubbles = [];
});