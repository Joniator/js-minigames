class Board {
    constructor(rows, columns) {
        this.rows = [];
        this.rowCount = rows;
        this.columnCount = columns;
        for (let i = 0; i < rows; i++) {
            this.rows.push(new Row(columns));
        }
    }
    set(type, posX, posY, state) {
        if (posX < 0 ||
            posY < 0 ||
            posY >= this.rows.length ||
            posX >= this.rows[posY].length)
            return undefined;
        this.rows[posY].set(type, posX, state);
    }
    get(type, posX, posY) {
        if (posX < 0 ||
            posY < 0 ||
            posY >= this.rows.length ||
            posX >= this.rows[posY].length)
            return undefined;
        return this.rows[posY].get(type, posX);
    }
    setMined(posX, posY, state) {
        this.set("mined", posX, posY, state);
    }
    getMined(posX, posY) {
        return this.get("mined", posX, posY);
    }
    setRevealed(posX, posY, state) {
        this.set("revealed", posX, posY, state);
    }
    getRevealed(posX, posY) {
        return this.get("revealed", posX, posY);
    }
    setMarked(posX, posY, state) {
        this.set("marked", posX, posY, state);
    }
    getMarked(posX, posY) {
        return this.get("marked", posX, posY);
    }
    setBombCount(posX, posY, state) {
        this.set("bombCount", posX, posY, state);
    }
    getBombCount(posX, posY) {
        return this.get("bombCount", posX, posY);
    }
    incBombCount(posX, posY) {
        this.setBombCount(posX, posY, this.getBombCount(posX, posY) + 1);
    }
}
class Field {
    constructor() {
        this.bombCount = 0;
        this.marked = false;
        this.mined = false;
        this.revealed = false;
    }
}
class Game {
    constructor(canvas, bombs = 40, rows = 16, columns = 16, fieldHeight = 40, fieldWidth = 40) {
        /** @boolean Game only accepts input if running === true */
        this.running = false;
        /** @{x:number, y:number} Array containing the coordinates of every bomb */
        this.bombs = [];
        this.revealedFields = 0;
        this.fieldHeight = fieldHeight;
        this.fieldWidth = fieldWidth;
        this.canvas = canvas;
        this.canvas.height = fieldHeight * columns;
        this.canvas.width = fieldWidth * rows;
        this.ctx = canvas.getContext("2d");
        this.board = new Board(columns, rows);
        this.placeBombs(bombs, rows, columns);
        this.canvas.addEventListener("click", event => {
            if (this.running) {
                let coords = this.getClickedPosition(event);
                let x = coords.x;
                let y = coords.y;
                this.revealSurrounding(x, y);
                if (this.board.getMined(x, y))
                    this.gameOver();
                if (this.revealedFields === this.emptyFields)
                    this.win();
                this.drawBoard();
            }
        });
        this.canvas.addEventListener("contextmenu", event => {
            if (this.running) {
                let coords = this.getClickedPosition(event);
                let x = coords.x;
                let y = coords.y;
                this.board.setRevealed(x, y, true);
                this.board.setMarked(x, y, true);
                this.drawBoard();
                event.preventDefault();
            }
        });
    }
    getClickedPosition(event) {
        let relativeX = event.clientX -
            this.canvas.offsetLeft -
            document.documentElement.scrollLeft;
        let relativeY = event.clientY -
            this.canvas.offsetTop -
            document.documentElement.scrollTop;
        let clickX = Math.floor(relativeX / this.fieldWidth);
        let clickY = Math.floor(relativeY / this.fieldWidth);
        return { x: clickX, y: clickY };
    }
    placeBombs(bombs, fieldsX, fieldsY) {
        if ((fieldsX * fieldsY) / 4 < bombs) {
            bombs = (fieldsX * fieldsY) / 4;
        }
        this.bombs = [];
        for (let i = 0; i < bombs; i++) {
            let x;
            let y;
            do {
                x = Math.floor(Math.random() * fieldsX);
                y = Math.floor(Math.random() * fieldsY);
            } while (this.board.getMined(x, y));
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let debx = x + i;
                    let deby = y + j;
                    this.board.incBombCount(x + i, y + j);
                }
            }
            this.board.setMined(x, y, true);
            this.bombs.push({ x: x, y: y });
        }
    }
    revealSurrounding(x, y) {
        if (!this.board.getMined(x, y) &&
            this.board.getBombCount(x, y) === 0 &&
            !this.board.getRevealed(x, y)) {
            this.board.setRevealed(x, y, true);
            this.revealSurrounding(x + 1, y);
            this.revealSurrounding(x - 1, y);
            this.revealSurrounding(x, y + 1);
            this.revealSurrounding(x, y - 1);
        }
        this.board.setRevealed(x, y, true);
        this.revealedFields++;
    }
    gameOver() {
        this.running = false;
        this.bombs.forEach((val, i) => {
            this.board.setRevealed(val.x, val.y, true);
        });
        this.drawBoard();
        setTimeout(() => {
            alert("You lost");
        }, 250);
    }
    win() {
        this.running = false;
        this.bombs.forEach((val, i) => {
            this.board.setRevealed(val.x, val.y, true);
        });
        this.drawBoard();
        setTimeout(() => {
            alert("You win!");
        }, 250);
    }
    drawBoard() {
        let canvasX = 0;
        let canvasY = 0;
        for (let row = 0; row < this.board.rowCount; row++) {
            for (let column = 0; column < this.board.columnCount; column++) {
                let mined = this.board.getMined(column, row);
                let marked = this.board.getMarked(column, row);
                let revealed = this.board.getRevealed(column, row);
                let bombs = this.board.getBombCount(column, row);
                if (!revealed) {
                    this.drawHidden(column * this.fieldWidth, row * this.fieldHeight);
                }
                else if (marked) {
                    this.drawMarked(column * this.fieldWidth, row * this.fieldHeight);
                }
                else if (mined) {
                    this.drawMine(column * this.fieldWidth, row * this.fieldHeight);
                }
                else if (revealed) {
                    this.drawRevealed(column * this.fieldWidth, row * this.fieldHeight, bombs);
                }
            }
        }
    }
    drawBorder(x, y) {
        this.ctx.fillStyle = "gray";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, this.fieldWidth, this.fieldHeight);
    }
    drawMine(x, y) {
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(x, y, this.fieldWidth, this.fieldHeight);
        this.drawBorder(x, y);
    }
    drawMarked(x, y) {
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(x, y, this.fieldWidth, this.fieldHeight);
        this.drawBorder(x, y);
    }
    drawRevealed(x, y, bombs) {
        this.ctx.fillStyle = "darkgray";
        this.ctx.fillRect(x, y, this.fieldWidth, this.fieldHeight);
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(bombs, x + 5, y + 20);
        this.drawBorder(x, y);
    }
    drawHidden(x, y) {
        this.ctx.fillStyle = "lightgray";
        this.ctx.fillRect(x, y, this.fieldWidth, this.fieldHeight);
        this.drawBorder(x, y);
    }
}
class Menu {
    constructor() {
        this.menu = document.getElementById("divMenu");
        this.canvas = document.getElementById("gameCanvas");
        this.readSettings();
        this.newGame();
    }
    newGame() {
        try {
            this.game = new Game(this.canvas, this.bombs, this.rows, this.columns, this.height, this.width);
        }
        catch (error) {
            this.validated = false;
        }
        this.game.drawBoard();
    }
    getSetting(name) {
        let input = document.getElementById(name);
        return input.value;
    }
    readSettings() {
        this.height = this.getSetting("inputHeight");
        this.width = this.getSetting("inputWidth");
        this.rows = this.getSetting("inputRows");
        this.columns = this.getSetting("inputColumns");
        this.bombs = this.getSetting("inputBombs");
        this.validated = this.validateInput();
        this.newGame();
    }
    validateInput() {
        return ((this.rows * this.columns) / 4 > this.bombs &&
            (this.bombs <= 1000 && this.bombs >= 5) &&
            (this.height <= 100 && this.height >= 25) &&
            (this.width <= 100 && this.width >= 25) &&
            (this.rows <= 100 && this.rows >= 5) &&
            (this.columns <= 100 && this.columns >= 5));
    }
    clickPlay() {
        if (this.validated) {
            this.showMenu(false);
            this.newGame();
        }
        else {
            alert("Config invalid");
        }
    }
    showMenu(state) {
        this.menu.style.visibility = state ? "visible" : "hidden";
        this.game.running = true;
    }
}
class Row {
    constructor(fieldCount) {
        this.fields = [];
        for (let i = 0; i < fieldCount; i++) {
            this.fields.push(new Field());
        }
    }
    get length() {
        return this.fields.length;
    }
    set(type, pos, state) {
        if (pos >= this.fields.length)
            return undefined;
        this.fields[pos][type] = state;
    }
    get(type, pos) {
        if (pos >= this.fields.length)
            return undefined;
        return this.fields[pos][type];
    }
    setMined(pos, state) {
        this.set("mined", pos, state);
    }
    getMined(pos) {
        return this.get("mined", pos);
    }
    setRevealed(pos, state) {
        this.set("revealed", pos, state);
    }
    getRevealed(pos) {
        return this.get("revealed", pos);
    }
    setMarked(pos, state) {
        this.set("marked", pos, state);
    }
    getMarked(pos) {
        return this.get("marked", pos);
    }
    setBombCount(pos, state) {
        this.set("bombCount", pos, state);
    }
    getBombCount(pos) {
        return this.get("bombCount", pos);
    }
    incBombCount(pos) {
        this.setBombCount(pos, this.getBombCount(pos) + 1);
    }
}
let menu;
window.addEventListener("load", event => {
    menu = new Menu();
});
