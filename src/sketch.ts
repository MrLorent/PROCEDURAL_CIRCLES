// -------------------
//  Parameters and UI 
// -------------------

const gui = new dat.GUI()
const params = {
    Random_Seed: 26,
    Noise_Scale: 50,
    Bezier: 10,
    Circle_Subs: 35,
    lower_diameter : 50,
    Circles_Spacing: 15,
    Download_Image: () => save(),
}
gui.add(params, "Random_Seed", 0, 100, 0.5);
gui.add(params, "Noise_Scale", 0, 100, 1);
gui.add(params, "Bezier", 0, 50, 1);
gui.add(params, "Circle_Subs", 10, 100, 1);
gui.add(params, "lower_diameter", 0, 100, 1);
gui.add(params, "Circles_Spacing", 0, 30, 0.5);
gui.add(params, "Download_Image");

// -------------------
//       Drawing
// -------------------

function draw() {
    randomSeed(params.Random_Seed);
    background('white');
    translate(width/2, height/2);

    noFill();
    stroke('black');
    strokeWeight(3.5);

    //  INITIALIZATION
    // const NB_CIRCLES = 15;
    // const HAS_PIC = 2;
    // const POLYGONE = 8;
    // const PERFECT_CIRCLE = 9;

    const NB_CIRCLES = 15;
    var picked = pickRandomly(NB_CIRCLES);
    const HAS_PIC = picked[0];
    const POLYGONE = picked[1];
    const PERFECT_CIRCLE = picked[2];

    // DRAWING OF THE FIFTEEN CIRCLES
    for(let range=0; range<NB_CIRCLES; range++){
        // Determination of the number of subdivitons
        // needed to draw the current circle
        const nbSubs = params.Circle_Subs + (range - 10);
        
        // GENERATION OF THE CIRCLE ANCHORS 
        let circleAnchors = new Array();

        switch(range){
            case PERFECT_CIRCLE:
                generatePerfectCircle(nbSubs, range, circleAnchors);
                break;
            case HAS_PIC:
                generateDisturbedCircle(nbSubs, range, circleAnchors);
                generatePic(nbSubs, circleAnchors);
                break;
            default:
                generateDisturbedCircle(nbSubs, range, circleAnchors);
                if(range >= 0 && range < 3){
                    ampliphyPics(nbSubs, circleAnchors);
                }
                break;
        }


        // DRAWING OF THE CURVES BETWEEN ALL THE ANCHORS
        for(let i=0; i<nbSubs; i++){
            const angle = i*(TWO_PI/nbSubs);
            const angleSuivant = (i+1)*(TWO_PI/nbSubs);

            let startControler;
            let endControler;

            if(range == POLYGONE){
                startControler = circleAnchors[i];
                endControler = circleAnchors[i+1];
            }else{
                startControler = generateControlMark(range, circleAnchors[i], angle, 1);
                endControler = generateControlMark(range, circleAnchors[i+1], angleSuivant, -1);
            }

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

    function pickRandomly(max){
        let tmp;
        let theOnes = new Array(-1,-1,-1);
        

        for(let i=0; i<3;i++){
            do{
                tmp = int(random(0, max));
            }while(tmp == theOnes[0] || tmp == theOnes[1] || tmp == theOnes[2]);
            theOnes[i] = tmp;
        }

        return theOnes;
    }

    function generateDisturbedCircle(nbSubs, circleNumber, anchors){
        noiseSeed(random() * 1000000);

        for(let i=0; i<nbSubs; i++){
            const angle = i*(TWO_PI/nbSubs);
            const radius = params.lower_diameter + params.Circles_Spacing * circleNumber;
            
            anchors[i] = {
                'x' : (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * params.Noise_Scale) * cos(angle),
                'y' : (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * params.Noise_Scale) * sin(angle)
            };

            anchors[nbSubs] = anchors[0];
        }
    }

    function ampliphyPics(nbSubs, anchors){
        for(let i=0; i<nbSubs; i++){
            const angle = i*(TWO_PI/nbSubs);

            if(cos(angle) > cos(PI/4) || cos(angle) < cos(3*PI/4)){
                anchors[i].x += 2.5*pow(-1,i);
            }else{
                anchors[i].y += 10*pow(-1,i);
            }
        }
    }

    function generatePic(nbSubs, anchors){
        let pic = int(random(0, nbSubs));
        anchors[pic].y = anchors[pic].y - (height/2 + anchors[pic].y - 60);
    }

    function generatePerfectCircle(nbSubs, circleNumber, anchors){

        for(let i=0; i<nbSubs; i++){
            const angle = i*(TWO_PI/nbSubs);
            const radius = params.Noise_Scale/2 + params.lower_diameter + params.Circles_Spacing * circleNumber;
            
            anchors[i] = {
                'x' : radius * cos(angle),
                'y' : radius * sin(angle)
            }
        }

        anchors[nbSubs] = anchors[0];
    }

    function generateControlMark(circleNumber, anchor, angle, orientation){
        let x, y;
        if(anchor.y == 60 - height/2){
            if(sin(angle) < 0){
                x = anchor.x + orientation*5;
                y = anchor.y;
            }else{
                x = anchor.x - orientation*5;
                y = anchor.y;
            }
        }else{
            if(circleNumber >= 0 && circleNumber <3 && circleNumber != PERFECT_CIRCLE){
                if((cos(angle) > cos(PI/4) || cos(angle) < cos(3*PI/4))){
                    x = anchor.x;
                    y = anchor.y + cos(angle)/abs(cos(angle))*orientation *params.Bezier;
                }else{
                    x = anchor.x - sin(angle)/abs(sin(angle))*orientation*params.Bezier;
                    y = anchor.y;
                }
            }else{
                x = sqrt((pow(anchor['x'],2)+pow(anchor['y'],2)) + pow(params.Bezier, 2)) * cos(angle + orientation * (PI/2 - atan(sqrt(pow(anchor['x'],2)+pow(anchor['y'],2))/(params.Bezier + circleNumber/2))));

                y = sqrt((pow(anchor['x'],2)+pow(anchor['y'],2)) + pow(params.Bezier, 2)) * sin(angle + orientation * (PI/2 - atan(sqrt(pow(anchor['x'],2)+pow(anchor['y'],2))/(params.Bezier + circleNumber/2))));
            }
        }

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