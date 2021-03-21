var gui = new dat.GUI();
var params = {
    Random_Seed: 0,
    Noise_Scale: 50,
    Bezier: 10,
    Circle_Subs: 33,
    lower_diameter: 50,
    Circles_Spacing: 15,
    Download_Image: function () { return save(); },
};
gui.add(params, "Random_Seed", 0, 100, 1);
gui.add(params, "Noise_Scale", 0, 100, 1);
gui.add(params, "Bezier", 0, 50, 1);
gui.add(params, "Circle_Subs", 10, 100, 1);
gui.add(params, "lower_diameter", 0, 100, 1);
gui.add(params, "Circles_Spacing", 0, 30, 0.5);
gui.add(params, "Download_Image");
var NB_CIRCLES = 15;
function draw() {
    randomSeed(params.Random_Seed);
    background('white');
    translate(width / 2, height / 2);
    noFill();
    stroke('black');
    strokeWeight(3.0);
    for (var range = 0; range < NB_CIRCLES; range++) {
        var nbSubs = params.Circle_Subs + (range - 10);
        var circleAnchors = generateCircleAnchors(range, nbSubs);
        for (var i = 0; i < nbSubs; i++) {
            var startControler = generateControlMark(range, circleAnchors[i], i * (TWO_PI / nbSubs), 1);
            var endControler = generateControlMark(range, circleAnchors[i + 1], (i + 1) * (TWO_PI / nbSubs), -1);
            bezier(circleAnchors[i].x, circleAnchors[i].y, startControler.x, startControler.y, endControler.x, endControler.y, circleAnchors[i + 1].x, circleAnchors[i + 1].y);
        }
    }
    function generateCircleAnchors(circleNumber, nbSubs) {
        var anchors = new Array();
        if (circleNumber != 9) {
            noiseSeed(random() * 1000);
            for (var i = 0; i < nbSubs; i++) {
                var angle = i * (TWO_PI / nbSubs);
                var radius = params.lower_diameter + params.Circles_Spacing * circleNumber;
                anchors[i] = {
                    'x': (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * params.Noise_Scale) * cos(angle),
                    'y': (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * params.Noise_Scale) * sin(angle)
                };
            }
        }
        else {
            for (var i = 0; i < nbSubs; i++) {
                var angle = i * (TWO_PI / nbSubs);
                var radius = params.Noise_Scale / 2 + params.lower_diameter + params.Circles_Spacing * circleNumber;
                anchors[i] = {
                    'x': radius * cos(angle),
                    'y': radius * sin(angle)
                };
            }
        }
        anchors[nbSubs] = anchors[0];
        if (circleNumber == 3) {
            var pic = int(random(0, nbSubs));
            anchors[pic].y = anchors[pic].y - (height / 2 + anchors[pic].y - 50);
        }
        return anchors;
    }
    function generateControlMark(circleNumber, anchor, angle, orientation) {
        if (circleNumber != 8) {
            var x = sqrt((pow(anchor['x'], 2) + pow(anchor['y'], 2)) + pow(params.Bezier, 2)) * cos(angle + orientation * (PI / 2 - atan(sqrt(pow(anchor['x'], 2) + pow(anchor['y'], 2)) / (params.Bezier + circleNumber / 2))));
            var y = sqrt((pow(anchor['x'], 2) + pow(anchor['y'], 2)) + pow(params.Bezier, 2)) * sin(angle + orientation * (PI / 2 - atan(sqrt(pow(anchor['x'], 2) + pow(anchor['y'], 2)) / (params.Bezier + circleNumber / 2))));
            return { 'x': x, 'y': y };
        }
        else {
            return anchor;
        }
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