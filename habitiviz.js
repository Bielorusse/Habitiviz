/*
Script for Habitiviz.
*/

// global variables
const canvas_width = 500;
const canvas_height = 100;

const s = sketch => {
    /*
    Function which takes a "sketch" object as argument and attaches properties such as setup and
    draw functions which are needed for a p5js sketch.
    See: https://github.com/processing/p5.js/wiki/Global-and-instance-mode
    */

    sketch.setup = function() {
        /*
        Processing setup function.
        Called one time at start.
        */
        var canvas = sketch.createCanvas(canvas_width, canvas_height);
        canvas.parent(habitiviz_canvas_div);
    };

    sketch.draw = function() {
        /*
        Processing main loop function.
        */

        // initialisation
        sketch.background(0);
        sketch.noStroke();

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 50; col++) {
                let cell_id = col + row * 50;
                let cell_total = 500;
                let color = Math.floor(255 * cell_id / cell_total);
                sketch.fill(color);
                sketch.square(col * 10, row * 10, 8);
            }
        }
    };
};

let myp5 = new p5(s);
