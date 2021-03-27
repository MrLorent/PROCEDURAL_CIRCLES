var gui = new dat.GUI();
var params = {
    Like_Original: 1,
    Random_Seed: 108,
    Noise_Scale: 50,
    Noise_Frequence: 5,
    Bezier: 10,
    Circle_Subs: 35,
    lower_diameter: 50,
    Circles_Spacing: 15,
    Download_Image: function () { return save(); },
};
gui.add(params, "Like_Original", 0, 1, 1);
gui.add(params, "Random_Seed", 0, 200, 0.5);
gui.add(params, "Noise_Scale", 0, 100, 1);
gui.add(params, "Noise_Frequence", 0, 20, 0.05);
gui.add(params, "Bezier", 0, 50, 1);
gui.add(params, "Circle_Subs", 10, 100, 1);
gui.add(params, "lower_diameter", 0, 100, 1);
gui.add(params, "Circles_Spacing", 0, 30, 0.5);
gui.add(params, "Download_Image");
function draw() {
    randomSeed(params.Random_Seed * 100);
    background('white');
    translate(width / 2, height / 2);
    noFill();
    stroke('black');
    strokeWeight(3.5);
    var NB_CIRCLES = 15;
    var HAS_PIC;
    var POLYGONE;
    var PERFECT_CIRCLE;
    if (params.Like_Original) {
        HAS_PIC = 2;
        POLYGONE = 8;
        PERFECT_CIRCLE = 9;
    }
    else {
        var picked = pickRandomly(NB_CIRCLES);
        HAS_PIC = picked[0];
        POLYGONE = picked[1];
        PERFECT_CIRCLE = picked[2];
    }
    for (var range = 0; range < NB_CIRCLES; range++) {
        var nbSubs = params.Circle_Subs + (range - 10);
        var circleAnchors = new Array();
        switch (range) {
            case PERFECT_CIRCLE:
                generatePerfectCircle(nbSubs, range, circleAnchors);
                break;
            case HAS_PIC:
                generateDisturbedCircle(nbSubs, range, circleAnchors);
                generatePic(nbSubs, circleAnchors);
                break;
            default:
                generateDisturbedCircle(nbSubs, range, circleAnchors);
                if (range >= 0 && range < 3) {
                    ampliphyPics(nbSubs, circleAnchors);
                }
                break;
        }
        for (var i = 0; i < nbSubs; i++) {
            var angle = i * (TWO_PI / nbSubs);
            var angleSuivant = (i + 1) * (TWO_PI / nbSubs);
            var startControler = void 0;
            var endControler = void 0;
            switch (range) {
                case HAS_PIC:
                    if (abs(circleAnchors[i + 1].y - circleAnchors[i].y) > 50) {
                        startControler = generateShortControlMark(range, circleAnchors[i], angle, 1);
                        endControler = generateShortControlMark(range, circleAnchors[i + 1], angleSuivant, -1);
                    }
                    else {
                        startControler = generateControlMark(range, circleAnchors[i], angle, 1);
                        endControler = generateControlMark(range, circleAnchors[i + 1], angleSuivant, -1);
                    }
                    break;
                case POLYGONE:
                    startControler = circleAnchors[i];
                    endControler = circleAnchors[i + 1];
                    break;
                default:
                    startControler = generateControlMark(range, circleAnchors[i], angle, 1);
                    endControler = generateControlMark(range, circleAnchors[i + 1], angleSuivant, -1);
                    break;
            }
            bezier(circleAnchors[i].x, circleAnchors[i].y, startControler.x, startControler.y, endControler.x, endControler.y, circleAnchors[i + 1].x, circleAnchors[i + 1].y);
        }
    }
    function pickRandomly(max) {
        var tmp;
        var theOnes = new Array(-1, -1, -1);
        for (var i = 0; i < 3; i++) {
            do {
                tmp = int(random(0, max));
            } while (tmp == theOnes[0] || tmp == theOnes[1] || tmp == theOnes[2]);
            theOnes[i] = tmp;
        }
        return theOnes;
    }
    function generateDisturbedCircle(nbSubs, circleNumber, anchors) {
        noiseSeed(random() * 1000000);
        for (var i = 0; i < nbSubs; i++) {
            var angle = i * (TWO_PI / nbSubs);
            var radius = params.lower_diameter + params.Circles_Spacing * circleNumber;
            anchors[i] = {
                'x': (radius + noise(params.Noise_Frequence * (1 + cos(angle)), params.Noise_Frequence * (1 + sin(angle))) * params.Noise_Scale) * cos(angle),
                'y': (radius + noise(params.Noise_Frequence * (1 + cos(angle)), params.Noise_Frequence * (1 * sin(angle))) * params.Noise_Scale) * sin(angle)
            };
            anchors[nbSubs] = anchors[0];
        }
    }
    function ampliphyPics(nbSubs, anchors) {
        for (var i = 0; i < nbSubs; i++) {
            var angle = i * (TWO_PI / nbSubs);
            if (cos(angle) > cos(PI / 4) || cos(angle) < cos(3 * PI / 4)) {
                anchors[i].x += 2.5 * pow(-1, i);
            }
            else {
                anchors[i].y += 10 * pow(-1, i);
            }
        }
    }
    function generatePic(nbSubs, anchors) {
        var pic = int(random(0, nbSubs));
        anchors[pic].y = anchors[pic].y - (height / 2 + anchors[pic].y - random(50, height / 2 + anchors[pic].y + 55));
    }
    function generatePerfectCircle(nbSubs, circleNumber, anchors) {
        for (var i = 0; i < nbSubs; i++) {
            var angle = i * (TWO_PI / nbSubs);
            var radius = params.Noise_Scale / 2 + params.lower_diameter + params.Circles_Spacing * circleNumber;
            anchors[i] = {
                'x': radius * cos(angle),
                'y': radius * sin(angle)
            };
        }
        anchors[nbSubs] = anchors[0];
    }
    function generateControlMark(circleNumber, anchor, angle, orientation) {
        var x, y;
        if (circleNumber >= 0 && circleNumber < 3 && circleNumber != PERFECT_CIRCLE) {
            if ((cos(angle) > cos(PI / 4) || cos(angle) < cos(3 * PI / 4))) {
                x = anchor.x;
                y = anchor.y + cos(angle) / abs(cos(angle)) * orientation * params.Bezier;
            }
            else {
                x = anchor.x - sin(angle) / abs(sin(angle)) * orientation * params.Bezier;
                y = anchor.y;
            }
        }
        else {
            x = sqrt((pow(anchor['x'], 2) + pow(anchor['y'], 2)) + pow(params.Bezier, 2)) * cos(angle + orientation * (PI / 2 - atan(sqrt(pow(anchor['x'], 2) + pow(anchor['y'], 2)) / (params.Bezier + circleNumber / 2))));
            y = sqrt((pow(anchor['x'], 2) + pow(anchor['y'], 2)) + pow(params.Bezier, 2)) * sin(angle + orientation * (PI / 2 - atan(sqrt(pow(anchor['x'], 2) + pow(anchor['y'], 2)) / (params.Bezier + circleNumber / 2))));
        }
        return { 'x': x, 'y': y };
    }
    function generateShortControlMark(circleNumber, anchor, angle, orientation) {
        var x, y;
        if (sin(angle) < 0) {
            x = anchor.x + orientation * (5 + HAS_PIC / 3);
            y = anchor.y;
        }
        else {
            x = anchor.x - orientation * (5 + HAS_PIC / 3);
            y = anchor.y;
        }
        return { 'x': x, 'y': y };
    }
}
function setup() {
    p6_CreateCanvas();
}
function windowResized() {
    p6_ResizeCanvas();
}
var __ASPECT_RATIO = 1;
var __MARGIN_SIZE = 25;
function __desiredCanvasWidth() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return windowWidth - __MARGIN_SIZE * 2;
    }
    else {
        return __desiredCanvasHeight() * __ASPECT_RATIO;
    }
}
function __desiredCanvasHeight() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return __desiredCanvasWidth() / __ASPECT_RATIO;
    }
    else {
        return windowHeight - __MARGIN_SIZE * 2;
    }
}
var __canvas;
function __centerCanvas() {
    __canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}
function p6_CreateCanvas() {
    __canvas = createCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
function p6_ResizeCanvas() {
    resizeCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
var p6_SaveImageSequence = function (durationInFrames, fileExtension) {
    if (frameCount <= durationInFrames) {
        noLoop();
        var filename_1 = nf(frameCount - 1, ceil(log(durationInFrames) / log(10)));
        var mimeType = (function () {
            switch (fileExtension) {
                case 'png':
                    return 'image/png';
                case 'jpeg':
                case 'jpg':
                    return 'image/jpeg';
            }
        })();
        __canvas.elt.toBlob(function (blob) {
            p5.prototype.downloadFile(blob, filename_1, fileExtension);
            setTimeout(function () { return loop(); }, 100);
        }, mimeType);
    }
};
//# sourceMappingURL=../src/src/build.js.map