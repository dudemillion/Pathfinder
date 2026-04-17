const pathfindButton = document.getElementById("pathfind");
const startxy = document.getElementById("start");
const endxy = document.getElementById("end");
const reset = document.getElementById("reset");
class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isWall = false;
    this.isStart = false;
    this.isEnd = false;
    this.isPath = false;
    this.visited = false;
    this.parent = null;
  }
  toggleWall() {
    if (!this.isStart && !this.isEnd) {
      this.isWall = !this.isWall;
    }
  }
  setStart() {
    this.isStart = true;
    this.isWall = false;
  }
  setEnd() {
    this.isEnd = true;
    this.isWall = false;
  }
  reset() {
    this.isWall = false;
    this.isStart = false;
    this.isEnd = false;
    this.isPath = false;
    this.visited = false;
    this.parent = null;
  }
}

class Grid {
  constructor() {
    this.rows = 10;
    this.cols = 10;
    this.cells = [];
    this.startCell = null;
    this.endCell = null;
    this.createGrid();
  }
  createGrid() {
    for (let y = 0; y < this.cols; y++) {
      let row = [];
      for (let x = 0; x < this.rows; x++) {
        row.push(new Cell(x, y));
      }
      this.cells.push(row);
    }
  }
  getCell(x, y) {
    if (!this.isValidCoordinate(x, y)) {
      return null;
    }
    return this.cells[x][y];
  }
  isValidCoordinate(x, y) {
    return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
  }
  setStart(x, y) {
    const cell = this.getCell(x, y);
    if (!cell || cell.isWall || cell.isEnd) {
      return false;
    }
    if (this.startCell) {
      this.startCell.isStart = false;
    }
    cell.isStart = true;
    this.startCell = cell;
    return true;
  }
  setEnd(x, y) {
    const cell = this.getCell(x, y);
    if (!cell || cell.isWall || cell.isStart) {
      return false;
    }

    if (this.endCell) {
      this.endCell.isEnd = false;
    }

    cell.isEnd = true;
    this.endCell = cell;
    return true;
  }
  resetPath() {
    for (let row of this.cells) {
      for (let cell of row) {
        cell.isPath = false;
        cell.visited = false;
        cell.parent = null;
      }
    }
  }
  resetAll() {
    for (let row of this.cells) {
      for (let cell of row) {
        cell.reset();
      }
    }
    this.startCell = null;
    this.endCell = null;
  }
}

class UIControl {
    updateCellVisual(div, cell) {
        div.classList.remove("wall");
        div.classList.remove("start");
        div.classList.remove("end");
        div.classList.remove("path")
        if (cell.isWall) {
          div.classList.add("wall");
        } else if (cell.isStart) {
          div.classList.add("start");
        } else if (cell.isEnd) {
          div.classList.add("end");
        } else if (cell.isPath) {
          div.classList.add("path");
        }
        }
    renderGrid(grid) {
        const gridElement = document.getElementById("grid");
        gridElement.innerHTML = "";
        for (let y = 0; y < grid.rows; y++) {
            for (let x = 0; x < grid.cols; x++) {
            const cell = grid.getCell(x, y);
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            this.updateCellVisual(cellDiv, cell);              
            cellDiv.addEventListener("click", () => {
              if (cell.isEnd || cell.isStart) {
                alert("This cannot be a wall. Change this start/end cell first.")
              } else {
                cell.toggleWall();
                this.updateCellVisual(cellDiv, cell);
              }
            });
            gridElement.appendChild(cellDiv);
            }
        }
    }

}
class Pathfinder {
  findPath(grid) {
    if (!grid.startCell || !grid.endCell) {
      return null;
    }
    grid.resetPath();
    let queue = [];
    let start = grid.startCell;
    let end = grid.endCell;
    start.visited = true;
    queue.push(start);
    while (queue.length > 0) {
      let currentcell = queue.shift();
      if (currentcell === end) {
        return this.buildPath(end);
      }
      let currentcellneighbors = this.getNeighbors(grid, currentcell);
      for (let neighbor of currentcellneighbors) {
        if (!neighbor.visited && !neighbor.isWall) {
          neighbor.visited = true;
          neighbor.parent = currentcell;
          queue.push(neighbor);
        }
      }
    }
    return null;
  }
  findPathAStar(grid) {
    // Not Implemented
  }
  getNeighbors(grid, cell) {
    let cellneighbors = [];
    let posdirections = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (let [x, y] of posdirections) {
      let newposx = cell.x + x;
      let newposy = cell.y + y;
      if (grid.isValidCoordinate(newposx, newposy)) {
        cellneighbors.push(grid.getCell(newposx, newposy));
      }
    }
    return cellneighbors;
  }
  buildPath(endCell) {
    let path = [];
    let currentcell = endCell;
    while (currentcell !== null) {
      path.push(currentcell);
      currentcell = currentcell.parent;
    }
    path.reverse();
    return path;
  }
}
let thegrid = new Grid();
let UI = new UIControl();
UI.renderGrid(thegrid);
startxy.addEventListener("input", function() {
  let input = startxy.value;
  let test = input.match(/\d,\d/i);
  if (test) {
    const x = test[0][0];
    const y = test[0][2];
    const startcoord = thegrid.setStart(x, y);
    if (!startcoord) {
      alert("This coordinate cannot be the start.");
      return;
    }
    UI.renderGrid(thegrid);
  } else {
    console.log("input does not match regex." + input);
  }
})
endxy.addEventListener("input", function() {
  let input = endxy.value;
  let test = input.match(/\d,\d/i);
  if (test) {
    const x = test[0][0];
    const y = test[0][2];
    const endcoord = thegrid.setEnd(x, y);
    if (!endcoord) {
      alert("This coordinate cannot be the end.");
      return;
    }
    UI.renderGrid(thegrid);
  } else {
    console.log("input does not match regex.")
  }
})
pathfindButton.addEventListener("click", function() {
  let pathfinder = new Pathfinder();
  let path = pathfinder.findPath(thegrid);
  if (path) {
    for (let cell of path) {
      if (!cell.isStart && !cell.isEnd) {
        console.log("Added path cell!");
        console.log(thegrid.getCell(cell.x, cell.y));
        cell.isPath = true;
      }
    }
    UI.renderGrid(thegrid);
  } else {
    alert("This path is impossible! Make sure you defined a start and end and the walls aren't blocking all possible paths.")
  }
})
reset.addEventListener("click", function() {
  thegrid.resetAll();
  startxy.value = "";
  endxy.value = "";
  UI.renderGrid(thegrid);
})