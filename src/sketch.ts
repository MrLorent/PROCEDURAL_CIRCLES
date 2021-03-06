// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    Random_Seed: 0,
    Circle_Subs: 30,
    Download_Image: () => save(),
}
gui.add(params, "Random_Seed", 0, 100, 1);
gui.add(params, "Circle_Subs", 0, 100, 1);
gui.add(params, "Download_Image");

// -------------------
//       Drawing
// -------------------
const NB_CIRCLES = 15;

function draw() {
    randomSeed(params.Random_Seed);
    background('white');
    translate(width/2, height/2);

    noFill();
    stroke('black');
    strokeWeight(2.5);
    for(let range=1; range<=NB_CIRCLES; range++){

        // ONE CLOSED CURVE DRAWING
        beginShape();
        if(range != 10){
            noiseSeed(random() * 10);
            for(let i=0; i<params.Circle_Subs; i++){
                const angle = i*(TWO_PI/params.Circle_Subs);
                const radius = 20 + 20 * range;
                let x, y;
                
                x = (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * 50) * cos(angle);
                y = (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * 50) * sin(angle);

                vertex(x, y);
            }
        }else{
            for(let i=0; i<params.Circle_Subs; i++){
                const angle = i*(TWO_PI/params.Circle_Subs);
                const radius = 40 + 20 * range;
                let x, y;
                
                x = radius * cos(angle);
                y = radius * sin(angle);

                vertex(x, y);
            }
        }
        endShape(CLOSE);
    }
    
}

// -------------------
//    Initialization
// -------------------

function setup() {
    p6_CreateCanvas()
}

function windowResized() {
    p6_ResizeCanvas()
}