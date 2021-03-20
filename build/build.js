var gui = new dat.GUI();
var params = {
    Random_Seed: 0,
    Circle_Subs: 10,
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
    var range = 1;
    var CIRCLE_SUBS = params.Circle_Subs + range;
    var BASE_ANGLE = TWO_PI / CIRCLE_SUBS;
    var BASE_RADIUS = 50 + 20 * range;
    var previous_anchor = new Array();
    beginShape();
    var x = BASE_RADIUS * cos(-BASE_ANGLE);
    var y = BASE_RADIUS * sin(-BASE_ANGLE);
    vertex(x, y);
    previous_anchor[0] = x;
    previous_anchor[1] = y;
    for (var i = 0; i < 3; i++) {
        var anchor_x = void 0, anchor_y = void 0;
        var control1_x = void 0, control1_y = void 0;
        var control2_x = void 0, control2_y = void 0;
        anchor_x = BASE_RADIUS * cos(i * BASE_ANGLE);
        anchor_y = BASE_RADIUS * sin(i * BASE_ANGLE);
        control1_x = sqrt((pow(previous_anchor[0], 2) + pow(previous_anchor[1], 2)) + 100) * cos(i * BASE_ANGLE + (PI / 2 - atan(sqrt(pow(previous_anchor[0], 2) + pow(previous_anchor[1], 2)) / 10)));
        control1_y = sqrt((pow(previous_anchor[0], 2) + pow(previous_anchor[1], 2)) + 100) * sin(i * BASE_ANGLE + (PI / 2 - atan(sqrt(pow(previous_anchor[0], 2) + pow(previous_anchor[1], 2)) / 10)));
        control2_x = sqrt((pow(anchor_x, 2) + pow(anchor_y, 2)) + 100) * cos(i * BASE_ANGLE - (PI / 2 - atan(sqrt(pow(anchor_x, 2) + pow(anchor_y, 2)) / 10)));
        control2_y = sqrt((pow(anchor_x, 2) + pow(anchor_y, 2)) + 100) * sin(i * BASE_ANGLE - (PI / 2 - atan(sqrt(pow(anchor_x, 2) + pow(anchor_y, 2)) / 10)));
        bezierVertex(control1_x, control1_y, control2_x, control2_y, -anchor_x, anchor_y);
        previous_anchor[0] = anchor_x;
        previous_anchor[1] = anchor_y;
    }
    endShape();
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