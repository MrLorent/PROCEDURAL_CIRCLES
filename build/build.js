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
    noFill();
    stroke('black');
    strokeWeight(2.5);
    for (var range = 1; range <= NB_CIRCLES; range++) {
        var pointsCircle = void 0;
        if (range != 10) {
            noiseSeed(random() * 10);
            for (var i = 0; i < params.Circle_Subs; i++) {
                var angle = i * (TWO_PI / params.Circle_Subs);
                var radius = 20 + 20 * range;
                pointsCircle[i][0] = (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * 50) * cos(angle);
                pointsCircle[i][1] = (radius + noise(10 + 10 * cos(angle), 10 + 10 * sin(angle)) * 50) * sin(angle);
            }
        }
        else {
            for (var i = 0; i < params.Circle_Subs; i++) {
                var angle = i * (TWO_PI / params.Circle_Subs);
                var radius = 40 + 20 * range;
                pointsCircle[i][0] = radius * cos(angle);
                pointsCircle[i][1] = radius * sin(angle);
            }
        }
        pointsCircle[params.Circle_Subs][0] = pointsCircle[0][0];
        pointsCircle[params.Circle_Subs][1] = pointsCircle[0][1];
        for (var i = 0; i < params.Circle_Subs; i++) {
            line(pointsCircle[i][0], pointsCircle[i][1], pointsCircle[i + 1][0], pointsCircle[i + 1][1]);
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