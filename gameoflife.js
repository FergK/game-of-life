// Deividas Rutkauskas
// Fergus Kelley

// Project #3

// CSC4370 Web Programming

/* global $ */

/*  The coordinate system is a bit confusing, but when there are two nested
    loops, i is the current row, j is the current column, so instead of x/y
    coords, we should use i/j */

var grid = [];
var nextGrid = [];
var generation = 0;
var size = 0;
var speed = 0;
var stop = false;

// Creates a 2D array of a particular size initialized to contain false in every cell
// false means the cell in that position is dead
function makeGrid() {
    stopAnimation();
    generation = 0;
    $('#genCount').html(generation);

    grid = [];

    size = parseInt($('#sizeField').val(), 10);

    for (var i = 0; i < size; i++) {
        grid[i] = [];
        nextGrid[i] = [];
        for (var j = 0; j < size; j++) {
            grid[i][j] = false;
            nextGrid[i][j] = false;
        }
    }

    makeTable();
}

// This generates the HTML code to generate the actual table;
function makeTable() {
    var result = '';
    for (var i = 0; i < size; i++) {
        result += "<tr>";
        for (var j = 0; j < size; j++) {
            result += "<td" + ' id="' + i + '-' + j + '" class="cell" onclick="toggleCell( ' + i + ',' + j + ' )"> </td>';
        }
        result += "</tr>";
    }
    $('#grid').html(result);
}

// This takes the value of the global grid var and updates the html table to match the current state
function updateTable() {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            updateCell(i, j);
        }
    }
    $('#genCount').html(generation);
}

// This loops over each cell, calling checkCell(), to complete a certain number of generations
function doGeneration(gens) {
    for (var g = 1; g <= gens; g++) {
        generation++;

        // Copy the current grid to nextGrid
        for (var r = 0; r < size; r++) {
            nextGrid[r] = grid[r].slice();
        }

        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                checkCell(i, j);
            }
        }

        // Copy the nextGrid to the current one
        for (r = 0; r < size; r++) {
            grid[r] = nextGrid[r].slice();
        }
    }

    updateTable();
}

// This looks at the cell's neighbors and sees if the cell should live, die or, reproduce
function checkCell(i, j) {

    var neighbors = 0;

    // Check up
    if ((i > 0) && grid[i - 1][j]) {
        neighbors++;
    }
    // Check down
    if ((i < (size - 1)) && grid[i + 1][j]) {
        neighbors++;
    }

    // Check left
    if ((j > 0) && grid[i][j - 1]) {
        neighbors++;
    }

    // Check right
    if ((j < (size - 1)) && grid[i][j + 1]) {
        neighbors++;
    }

    // Check up left
    if ((i > 0) && (j > 0) && grid[i - 1][j - 1]) {
        neighbors++;
    }

    // Check up right
    if ((i > 0) && (j < (size - 1)) && grid[i - 1][j + 1]) {
        neighbors++;
    }

    // Check down left
    if ((i < (size - 1)) && (j > 0) && grid[i + 1][j - 1]) {
        neighbors++;
    }

    // Check down right
    if ((i < (size - 1)) && (j < (size - 1)) && grid[i + 1][j + 1]) {
        neighbors++;
    }

    // // check diagonal top left
    // if ((y > 0) && (x > 0) && grid[x - 1][y + 1]) {
    //     neighbors++;
    //     console.log(x + ' ' + y + ' tl');
    // }
    // // check top 
    // if ((y > 0) && grid[x][y + 1]) {
    //     neighbors++;
    //     console.log(x + ' ' + y + ' t');
    // }
    // // check diagonal top right
    // if ((y > 0) && (x < (size - 1)) && grid[x + 1][y + 1]) {
    //     neighbors++;
    //     console.log(x + ' ' + y + ' tr');
    // }

    // // check left
    // if ((x > 0) && grid[x - 1][y]) {
    //     neighbors++;
    //     console.log(x + ' ' + y + ' l');
    // }

    // // check right
    // if ((x < (size - 1)) && grid[x + 1][y]) {
    //     neighbors++;
    //     console.log(x + ' ' + y + ' r');
    // }

    // // check diagonal bottom left
    // if ((y < (size - 1)) && (x > 0) && grid[x - 1][y - 1]) {
    //     neighbors++;
    //     console.log(x + ' ' + y + ' bl');
    // }

    // // check bottom
    // if ((y < (size - 1)) && grid[x][y - 1]) {
    //     neighbors++;
    //     console.log(x + ' ' + y + ' b');
    // }

    // // check diagonal bottom right
    // if ((y < (size - 1)) && (x < (size - 1)) && grid[x + 1][y - 1]) {
    //     neighbors++;
    //     console.log(x + ' ' + y + 'br');
    // }

    // Rule 1: Any live cell with fewer than two live neighbours dies, as
    // if caused by underpopulation.
    if (neighbors < 2 && grid[i][j]) {
        nextGrid[i][j] = false;
    }
    // Rule 2: Any live cell with more than three live neighbors dies, as
    // if by overcrowding.
    else if (neighbors > 3 && grid[i][j]) {
        nextGrid[i][j] = false;
    }

    // Rule 3: Any live cell with two or three live neighbors’ lives
    // on to the next generation.
    else if ((neighbors == 2 || neighbors == 3) && grid[i][j]) {
        nextGrid[i][j] = true;
    }

    // Rule 4: Any dead cell with exactly three live neighbors becomes a
    // live cell.
    else if (neighbors == 3 && !grid[i][j]) {
        nextGrid[i][j] = true;
    }

}

// This flips the value of the cell clicked on by the user
function toggleCell(i, j) {
    grid[i][j] = !grid[i][j];
    updateCell(i, j);
    // console.log('toggle ' + i + ' ' + j);
}

// Updates the color of the table cell to reflect the state of a cell
function updateCell(i, j) {
    if (grid[i][j]) {
        $('#' + i + '-' + j).css("background-color", "black");
    }
    else {
        $('#' + i + '-' + j).css("background-color", "white");
    }
}

// Begins iterating infinitely until stopped
function tick() {

    speed = $('#speedField').val();

    if (!stop) {
        doGeneration(1);
        setTimeout(function() {
            requestAnimationFrame(tick);
        }, speed);
    }
}

function startAnimation() {
    if ( stop == true ) {
        stop = false;
        tick();       
    }
}

function stopAnimation() {
    stop = true;
}

function exportGrid() {
    var jsonGrid = {
        size: size,
        generation: generation,
        grid: grid
    };
    console.log(jsonGrid);
    $('#jsonBox').val(JSON.stringify(jsonGrid));
    $('#jsonBox').select();
}

function importGrid( pattern ) {
    
    var jsonGrid;
    
    if ( pattern === undefined ) {
        jsonGrid = JSON.parse($('#jsonBox').val());
    } else {

        $.ajax({
          url: 'patterns/' + pattern + '.json',
          success: function(result) {
              console.log(result)
              jsonGrid = result;
          },
          error: function(result) {
              alert('Could not fetch pattern JSON :(');
          },
          async: false
        });
    }

    size = jsonGrid.size;
    generation = jsonGrid.generation;
    grid = jsonGrid.grid;
    
    $('#sizeField').val(size)

    makeTable();
    updateTable();
}

function randomizeGrid() {
    
    stopAnimation();
    generation = 0;
    for (var i = 0; i < size; i++) {
        grid[i] = [];
        for (var j = 0; j < size; j++) {
            grid[i][j] = Math.random() >= 0.5;
        }
    }

    makeTable();
    updateTable();
}

$(document).ready(function() {

    makeGrid();

});