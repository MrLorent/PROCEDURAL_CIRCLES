// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    Random_Seed: 0,
    Noise_Scale: 50,
    Bezier: 10,
    Circle_Subs: 33,
    lower_diameter : 50,
    Circles_Spacing: 15,
    Download_Image: () => save(),
}
gui.add(params, "Random_Seed", 0, 100, 1);
gui.add(params, "Noise_Scale", 0, 100, 1);
gui.add(params, "Bezier", 0, 50, 1);
gui.add(params, "Circle_Subs", 10, 100, 1);
gui.add(params, "lower_diameter", 0, 100, 1);
gui.add(params, "Circles_Spacing", 0, 30, 0.5);
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
    strokeWeight(3.0);
    for(let range=0; range<NB_CIRCLES; range++){
        const nbSubs = params.Circle_Subs + (range - 10);
        let circleAnchors = generateCircleAnchors(range, nbSubs);

        // ONE CLOSED CURVE DRAWING
        for(let i=0; i<nbSubs; i++){
            let startControler = generateControlMark(range, circleAnchors[i], i*(TWO_PI/nbSubs), 1);
            let endControler = generateControlMark(range, circleAnchors[i+1], (i+1)*(TWO_PI/nbSubs), -1);

            bezier(
                circleAnchors[i].x,
                circleAnchors[i].y,
                startControler.x,
                startControler.y,
                endControler.x,
                endControler.y,
                circleAnchors[i+1].x,
                circleAnchors[i+1].y
            );
        }

    }

    function generateCircleAnchors(circleNumber, nbSubs){
        let anchors = new Array();

        if(circleNumber != 9){
            noiseSeed(random() * 1000);
            for(let i=0; i<nbSubs; i++){
                const angle = i*(TWO_PI/nbSubs);
                const radius = params.lower_diameter + params.Circles_Spacing * circleNumber;
                
                anchors[i] = {
                    'x' : (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * params.Noise_Scale) * cos(angle),
                    'y' : (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * params.Noise_Scale) * sin(angle)
                };
            }
        }else{
            for(let i=0; i<nbSubs; i++){
                const angle = i*(TWO_PI/nbSubs);
                const radius = params.Noise_Scale/2 + params.lower_diameter + params.Circles_Spacing * circleNumber;
                
                anchors[i] = {
                    'x' : radius * cos(angle),
                    'y' : radius * sin(angle)
                }
            }
        }

        anchors[nbSubs] = anchors[0];

        if(circleNumber == 3){
            let pic = int(random(0, nbSubs));
            anchors[pic].y = anchors[pic].y - (height/2 + anchors[pic].y - 50);
        }

        return anchors;
    }

    function generateControlMark(circleNumber, anchor, angle, orientation){
        if(circleNumber != 8){
            let x = sqrt((pow(anchor['x'],2)+pow(anchor['y'],2)) + pow(params.Bezier, 2)) * cos(angle + orientation * (PI/2 - atan(sqrt(pow(anchor['x'],2)+pow(anchor['y'],2))/(params.Bezier + circleNumber/2))));

            let y = sqrt((pow(anchor['x'],2)+pow(anchor['y'],2)) + pow(params.Bezier, 2)) * sin(angle + orientation * (PI/2 - atan(sqrt(pow(anchor['x'],2)+pow(anchor['y'],2))/(params.Bezier + circleNumber/2))));

            return {'x':x, 'y':y};
        }else{
            return anchor;
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