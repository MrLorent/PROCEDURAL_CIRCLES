var gui = new dat.GUI();
var params = {
    Random_Seed: 0,
    Circle_Subs: 30,
    Download_Image: function () { return save(); },
};
gui.add(params, "Random_Seed", 0, 100, 1);
gui.add(params, "Circle_Subs", 0, 100, 1);
gui.add(params, "Download_Image");
var NB_CIRCLES = 15;
function draw() {
    randomSeed(params.Random_Seed);
    background('white');
    translate(width / 2, height / 2);
    stroke('black');
    strokeWeight(2.5);
    for (var range = 0; range < NB_CIRCLES; range++) {
        var circleAnchors = generateCircleAnchors(range);
        for (var i = 0; i < params.Circle_Subs; i++) {
            var base_angle = (TWO_PI / params.Circle_Subs);
            var startControler = generateControleMark(circleAnchors[i], i * (TWO_PI / params.Circle_Subs), 1);
            var endControler = generateControleMark(circleAnchors[i + 1], (i + 1) * (TWO_PI / params.Circle_Subs), -1);
            bezier(circleAnchors[i]['x'], circleAnchors[i]['y'], startControler.x, startControler.y, endControler.x, endControler.y, circleAnchors[i + 1]['x'], circleAnchors[i + 1]['y']);
        }
    }
    function generateCircleAnchors(circleNumber) {
        var anchors = new Array();
        if (circleNumber != 10) {
            noiseSeed(random() * 1000);
            for (var i = 0; i < params.Circle_Subs; i++) {
                var angle = i * (TWO_PI / params.Circle_Subs);
                var radius = 20 + 20 * circleNumber;
                anchors[i] = {
                    'x': (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * 50) * cos(angle),
                    'y': (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * 50) * sin(angle)
                };
            }
        }
        else {
            for (var i = 0; i < params.Circle_Subs; i++) {
                var angle = i * (TWO_PI / params.Circle_Subs);
                var radius = 40 + 20 * circleNumber;
                anchors[i] = {
                    'x': radius * cos(angle),
                    'y': radius * sin(angle)
                };
            }
        }
        anchors[params.Circle_Subs] = anchors[0];
        return anchors;
    }
    function generateControleMark(anchor, angle, orientation) {
        var x = sqrt((pow(anchor['x'], 2) + pow(anchor['y'], 2)) + 100) * cos(angle + orientation * (PI / 2 - atan(sqrt(pow(anchor['x'], 2) + pow(anchor['y'], 2)) / 10)));
        var y = sqrt((pow(anchor['x'], 2) + pow(anchor['y'], 2)) + 100) * sin(angle + orientation * (PI / 2 - atan(sqrt(pow(anchor['x'], 2) + pow(anchor['y'], 2)) / 10)));
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