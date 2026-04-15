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
    for (let y = 0; y < this.rows; y++) {
      let row = [];
      for (let x = 0; x < this.cols; x++) {
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
  clearWalls() {
    for (let row of this.cells) {
      for (let cell of row) {
        cell.isWall = false;
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
    updateCellVisual(div) {
        if (div.classList.contains("cell")) {
            if (!div.isWall) {
                div.isWall = true;
                div.classList.remove("cell");
                div.classList.add("wall");
            } else if (div.isWall) {
                div.isWall = false;
                div.classList.remove("wall");
                div.classList.add("cell");
            }
        }
    }
    renderGrid(grid) {
        const gridElement = document.getElementById("grid");
        for (let y = 0; y < grid.cells.length; y++) {
            for (let x = 0; x < grid.cells[y].length; x++) {
            const cell = grid.getCell(x, y);
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            cellDiv.dataset.x = x;
            cellDiv.dataset.y = y;
            cellDiv.addEventListener("click", () => {
                cell.toggleWall();
                this.updateCellVisual(cellDiv);
            });
            gridElement.appendChild(cellDiv);
            }
        }
    }

}
let thegrid = new Grid();
let UI = new UIControl();
UI.renderGrid(thegrid);