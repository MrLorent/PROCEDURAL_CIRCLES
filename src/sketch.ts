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
    for(let range=0; range<NB_CIRCLES; range++){
        let circleAnchors = new Array();

        // ONE CLOSED CURVE DRAWING
        if(range != 10){
            noiseSeed(random() * 1000);
            for(let i=0; i<params.Circle_Subs; i++){
                const angle = i*(TWO_PI/params.Circle_Subs);
                const radius = 20 + 20 * range;
                
                circleAnchors[i] = {
                    'x' : (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * 50) * cos(angle),
                    'y' : (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * 50) * sin(angle)
                };
            }
        }else{
            for(let i=0; i<params.Circle_Subs; i++){
                const angle = i*(TWO_PI/params.Circle_Subs);
                const radius = 40 + 20 * range;
                
                circleAnchors[i] = {
                    'x' : radius * cos(angle),
                    'y' : radius * sin(angle)
                }
            }
        }

        circleAnchors[params.Circle_Subs] = circleAnchors[0];

        for(let i=0; i<params.Circle_Subs; i++){
            const angle = i*(TWO_PI/params.Circle_Subs);
            const longRadius = sqrt(pow(circleAnchors[i]['x'],2) + pow(circleAnchors[i]['y'],2) + 100);

            bezier(
                circleAnchors[i]['x'],
                circleAnchors[i]['y'],
                sqrt((pow(circleAnchors[i]['x'],2)+pow(circleAnchors[i]['y'],2)) + 100) * cos(i*(TWO_PI/params.Circle_Subs) + (PI/2 - atan(sqrt(pow(circleAnchors[i]['x'],2)+pow(circleAnchors[i]['y'],2))/10))),
                sqrt((pow(circleAnchors[i]['x'],2)+pow(circleAnchors[i]['y'],2)) + 100) * sin(i*(TWO_PI/params.Circle_Subs) + (PI/2 - atan(sqrt(pow(circleAnchors[i]['x'],2)+pow(circleAnchors[i]['y'],2))/10))),
                sqrt((pow(circleAnchors[i+1]['x'],2)+pow(circleAnchors[i+1]['y'],2)) + 100) * cos((i+1)*(TWO_PI/params.Circle_Subs) - (PI/2 - atan(sqrt(pow(circleAnchors[i+1]['x'],2)+pow(circleAnchors[i+1]['y'],2))/10))),
                sqrt((pow(circleAnchors[i+1]['x'],2)+pow(circleAnchors[i+1]['y'],2)) + 100) * sin((i+1)*(TWO_PI/params.Circle_Subs) - (PI/2 - atan(sqrt(pow(circleAnchors[i+1]['x'],2)+pow(circleAnchors[i+1]['y'],2))/10))),
                circleAnchors[i+1]['x'],
                circleAnchors[i+1]['y']
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