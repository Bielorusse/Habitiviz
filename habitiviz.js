/*
Script for Habitiviz.
*/

// global variables
const canvas_width = 500;
const canvas_height = 100;

function read_habitica_data(history_file, graph) {
    /*
    Read data from habitica history files and apply it to a given graph.
    Input:
        -history_file   str
            path to habitica history file
        -graph          Graph instance
    */

    let dates_str_array = [];

    // fetch earth positions through ajax request
    $.ajax({
        type: "GET",
        url: history_file,
        async: false,
        success: function(data) {
            var rows = data.split("\n");
            for (var i = 1; i < rows.length - 1; i++) {
                var cols = rows[i].split(",");
                let date_obj = new Date(cols[3].slice(0, 10)); // date object
                let date_str =
                    cols[3].slice(0, 4) +
                    cols[3].slice(5, 7) +
                    cols[3].slice(8, 10); // date string, helps for findIndex see next lines
                let task = cols[0];
                let index = dates_str_array.findIndex(
                    element => element == date_str
                );
                if (index == -1) {
                    // if first task found for this date, create a new row in data array
                    dates_str_array.push(date_str);
                    graph.data_array.push([date_str, date_obj, [task]]);
                } else {
                    // if tasks already found on this date, add to list of task for this date's row
                    graph.data_array[index][2].push(task);
                }
            }
        }
    });

    // sort data array by dates
    graph.data_array.sort(sort_function);
    function sort_function(a, b) {
        /*
        See: https://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
        */
        if (a[0] === b[0]) {
            return 0;
        } else {
            return a[0] > b[0] ? -1 : 1;
        }
    }
}

class Graph {
    /*
    Class defining a graph.
    */

    constructor() {
        this.cells = [];
        this.cell_size = 8;
        this.cells_spacing = 10;
        this.data_array = []; // 2d array: date string (YYYYmmdd), date object, tasks
    }

    fill_cells() {
        /*
        Read this graph data array and compute cells positions and colors.
        */

        // initiate variables
        let cell_count = 0;
        let week_count = 1;
        let cell_day_of_week;
        let cell_tasks_count;

        // loop through this graph's data rows: from most recent day and backwards
        while (cell_count < this.data_array.length - 6 || week_count == 16) {
            // stop when less than a week is remaining unprocessed or at 4 months

            cell_day_of_week = this.data_array[cell_count][1].getDay();

            if (cell_day_of_week == 6) {
                week_count += 1; // increase week count every sunday
            }

            cell_tasks_count = this.data_array[cell_count][2].length;

            this.cells.push(
                new Cell(
                    500 - week_count * this.cells_spacing, // cell x value: depends on week count
                    cell_day_of_week * this.cells_spacing, // cell y value: depends on day of week
                    [
                        cell_tasks_count * 10, // cell color: depends on tasks count
                        cell_tasks_count * 10,
                        cell_tasks_count * 10
                    ]
                )
            );
            cell_count += 1; // increase cells count
        }
    }

    draw(sketch) {
        /*
        Draws this graph on a given sketch.
        Input:
            -sketch     p5js sketch object
        */
        for (let cell of this.cells) {
            sketch.fill(cell.color);
            sketch.square(cell.x, cell.y, this.cell_size);
        }
    }
}

class Cell {
    /*
    Class defining a cell in a graph.
    */

    constructor(x, y, color) {
        /*
        Constructor for the Cell class.
        Input:
            -x      int
            -y      int
            -color  [int, int, int]
        */
        this.x = x;
        this.y = y;
        this.color = color;
    }
}

// creating graph showing total activities
let total_graph = new Graph();
read_habitica_data("./data/habitica-tasks-history.csv", total_graph);
total_graph.fill_cells();

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
        let canvas = sketch.createCanvas(canvas_width, canvas_height);
        canvas.parent(habitiviz_canvas_div);
    };

    sketch.draw = function() {
        /*
        Processing main loop function.
        */

        // initialisation
        sketch.background(0);
        sketch.noStroke();

        // drawing graph
        total_graph.draw(sketch);
    };
};

let myp5 = new p5(s);
