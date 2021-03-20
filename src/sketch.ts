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

    // noFill();
    stroke('black');
    strokeWeight(2.5);
    for(let range=1; range<=NB_CIRCLES; range++){
        let pointsCircle = new Array();

        // ONE CLOSED CURVE DRAWING
        if(range != 10){
            noiseSeed(random() * 1000);
            for(let i=0; i<params.Circle_Subs; i++){
                const angle = i*(TWO_PI/params.Circle_Subs);
                const radius = 20 + 20 * range;
                
                pointsCircle[i] = new Array((radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * 50) * cos(angle),
                (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * 50) * sin(angle));
            }
        }else{
            for(let i=0; i<params.Circle_Subs; i++){
                const angle = i*(TWO_PI/params.Circle_Subs);
                const radius = 40 + 20 * range;
                
                pointsCircle[i] = new Array(radius * cos(angle),radius * sin(angle));
            }
        }

        pointsCircle[params.Circle_Subs] = new Array(pointsCircle[0][0], pointsCircle[0][1]);

        for(let i=0; i<params.Circle_Subs; i++){
            const angle = i*(TWO_PI/params.Circle_Subs);
            const longRadius = sqrt(pow(pointsCircle[i][0],2) + pow(pointsCircle[i][1],2) + 100);

            bezier(
                pointsCircle[i][0],
                pointsCircle[i][1],
                sqrt((pow(pointsCircle[i][0],2)+pow(pointsCircle[i][1],2)) + 100) * cos(i*(TWO_PI/params.Circle_Subs) + (PI/2 - atan(sqrt(pow(pointsCircle[i][0],2)+pow(pointsCircle[i][1],2))/10))),
                sqrt((pow(pointsCircle[i][0],2)+pow(pointsCircle[i][1],2)) + 100) * sin(i*(TWO_PI/params.Circle_Subs) + (PI/2 - atan(sqrt(pow(pointsCircle[i][0],2)+pow(pointsCircle[i][1],2))/10))),
                sqrt((pow(pointsCircle[i+1][0],2)+pow(pointsCircle[i+1][1],2)) + 100) * cos((i+1)*(TWO_PI/params.Circle_Subs) - (PI/2 - atan(sqrt(pow(pointsCircle[i+1][0],2)+pow(pointsCircle[i+1][1],2))/10))),
                sqrt((pow(pointsCircle[i+1][0],2)+pow(pointsCircle[i+1][1],2)) + 100) * sin((i+1)*(TWO_PI/params.Circle_Subs) - (PI/2 - atan(sqrt(pow(pointsCircle[i+1][0],2)+pow(pointsCircle[i+1][1],2))/10))),
                pointsCircle[i+1][0],
                pointsCircle[i+1][1]
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