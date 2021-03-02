// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    Ellipse_Size: 30,
    Download_Image: () => save(),
}
gui.add(params, "Ellipse_Size", 0, 100, 1)
gui.add(params, "Download_Image")

// -------------------
//       Drawing
// -------------------
const NB_CIRCLES = 15;
const CIRCLE_SUBS = 100;

function draw() {

    background('white');

    for(let range=1; range<=NB_CIRCLES; range++){
        // ONE CIRCLE DRAWING
        stroke(0);
        for(let i=0; i<CIRCLE_SUBS; i++){
            line(
                width/2 + 20 * range * cos(i * 2*PI/CIRCLE_SUBS),
                height/2 + 20 * range * sin(i * 2*PI/CIRCLE_SUBS),
                width/2 + 20 * range * cos((i+1) * 2*PI/CIRCLE_SUBS),
                height/2 + 20 * range * sin((i+1) * 2*PI/CIRCLE_SUBS),
            );
        }
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