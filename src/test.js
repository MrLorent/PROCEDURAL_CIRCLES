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
        const nbSubs = params.Circle_Subs + range;

        let circleAnchors = generateCircleAnchors(range, nbSubs);

        // ONE CLOSED CURVE DRAWING
        for(let i=0; i<nbSubs; i++){
            const base_angle = (TWO_PI/nbSubs);
            let startControler = generateControleMark(circleAnchors[i], i*(TWO_PI/nbSubs), 1);
            let endControler = generateControleMark(circleAnchors[i+1], (i+1)*(TWO_PI/nbSubs), -1);

            bezier(
                circleAnchors[i]['x'],
                circleAnchors[i]['y'],
                sqrt((pow(circleAnchors[i][0],2)+pow(circleAnchors[i][1],2)) + 100) * cos(i*(TWO_PI/nbSubs) + (PI/2 - atan(sqrt(pow(circleAnchors[i][0],2)+pow(circleAnchors[i][1],2))/10))),
                sqrt((pow(circleAnchors[i][0],2)+pow(circleAnchors[i][1],2)) + 100) * sin(i*(TWO_PI/nbSubs) + (PI/2 - atan(sqrt(pow(circleAnchors[i][0],2)+pow(circleAnchors[i][1],2))/10))),
                sqrt((pow(circleAnchors[i+1][0],2)+pow(circleAnchors[i+1][1],2)) + 100) * cos((i+1)*(TWO_PI/nbSubs) - (PI/2 - atan(sqrt(pow(circleAnchors[i+1][0],2)+pow(circleAnchors[i+1][1],2))/10))),
                sqrt((pow(circleAnchors[i+1][0],2)+pow(circleAnchors[i+1][1],2)) + 100) * sin((i+1)*(TWO_PI/nbSubs) - (PI/2 - atan(sqrt(pow(circleAnchors[i+1][0],2)+pow(circleAnchors[i+1][1],2))/10))),
                circleAnchors[i+1]['x'],
                circleAnchors[i+1]['y']
            );
        }

    }

    function generateCircleAnchors(circleNumber, nbAnchors){
        let anchors = new Array();

        for(let i=0; i<nbAnchors;i++){
            const angle = i*(TWO_PI/nbAnchors);
            const radius = (20 + 20 * circleNumber) + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * 50;

            anchors[i] = {
                'x' : radius * cos(angle),
                'y' : radius * sin(angle)
            }
        }

        anchors[nbAnchors] = anchors[0];

        return anchors;
    }

    function generateControleMark(anchor, angle, orientation){
        let x = sqrt((pow(anchor['x'],2)+pow(anchor['y'],2) + 100) * cos(angle) + orientation * (PI/2 - atan(sqrt(pow(anchor['x'],2)+pow(anchor['y'],2))/10)));

        let y = sqrt((pow(anchor['x'][0],2)+pow(anchor['y'],2) + 100) * sin(angle) + orientation * (PI/2 - atan(sqrt(pow(anchor['x'],2)+pow(anchor['y'],2))/10)))
        
        return {'x':x, 'y':y};
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