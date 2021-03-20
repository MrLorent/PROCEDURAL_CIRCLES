// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    Random_Seed: 0,
    Circle_Subs: 10,
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

    // noFill();
    stroke('black');
    strokeWeight(2.5);
    let range = 1;
    //for(let range=1; range<=NB_CIRCLES; range++){
        const CIRCLE_SUBS = params.Circle_Subs + range;
        const BASE_ANGLE = TWO_PI/CIRCLE_SUBS;
        const BASE_RADIUS = 50 + 20 * range;

        let previous_anchor = new Array();

        // ONE CLOSED CURVE DRAWING
        beginShape();
        let x = BASE_RADIUS * cos(-BASE_ANGLE);
        let y = BASE_RADIUS * sin(-BASE_ANGLE);

        vertex(x, y);

        previous_anchor[0] = x;
        previous_anchor[1] = y;

        //let i =1
        for(let i=0; i<3; i++){
            let anchor_x, anchor_y;
            let control1_x, control1_y;
            let control2_x, control2_y;

            anchor_x = BASE_RADIUS * cos(i * BASE_ANGLE);
            anchor_y = BASE_RADIUS * sin(i * BASE_ANGLE);

            control1_x = sqrt((pow(previous_anchor[0],2)+pow(previous_anchor[1],2)) + 100) * cos(i*BASE_ANGLE + (PI/2 - atan(sqrt(pow(previous_anchor[0],2)+pow(previous_anchor[1],2))/10)));

            control1_y = sqrt((pow(previous_anchor[0],2)+pow(previous_anchor[1],2)) + 100) * sin(i*BASE_ANGLE + (PI/2 - atan(sqrt(pow(previous_anchor[0],2)+pow(previous_anchor[1],2))/10)));

            control2_x = sqrt((pow(anchor_x,2)+pow(anchor_y,2)) + 100) * cos(i*BASE_ANGLE - (PI/2 - atan(sqrt(pow(anchor_x,2)+pow(anchor_y,2))/10)));

            control2_y = sqrt((pow(anchor_x,2)+pow(anchor_y,2)) + 100) * sin(i*BASE_ANGLE - (PI/2 - atan(sqrt(pow(anchor_x,2)+pow(anchor_y,2))/10)));
            
            bezierVertex(
                control1_x,
                control1_y,
                control2_x,
                control2_y,
                -anchor_x,
                anchor_y
                );

            previous_anchor[0] = anchor_x;
            previous_anchor[1] = anchor_y;
        }
        endShape();
    //}
    
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