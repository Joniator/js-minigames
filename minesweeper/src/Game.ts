class Game {
  ctx: CanvasRenderingContext2D;
  board: Board;
  canvas: HTMLCanvasElement;
  fieldHeight: number;
  fieldWidth: number;
  /** @boolean Game only accepts input if running === true */
  running: boolean = false;
  /** @{x:number, y:number} Array containing the coordinates of every bomb */
  bombs: { x: number; y: number }[] = [];
  /** @number Amount of fields that are revealed */
  revealedFields: number;
  /** @number Amount of fields without bombs*/
  emptyFields: number;

  constructor(
    canvas: HTMLCanvasElement,
    bombs: number = 40,
    rows: number = 16,
    columns: number = 16,
    fieldHeight: number = 40,
    fieldWidth: number = 40
  ) {
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

        if (this.board.getMined(x, y)) this.gameOver();
        if (this.revealedFields === this.emptyFields) this.win();
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

  getClickedPosition(event: MouseEvent): { x: number; y: number } {
    let relativeX =
      event.clientX -
      this.canvas.offsetLeft -
      document.documentElement.scrollLeft;
    let relativeY =
      event.clientY -
      this.canvas.offsetTop -
      document.documentElement.scrollTop;

    let clickX = Math.floor(relativeX / this.fieldWidth);
    let clickY = Math.floor(relativeY / this.fieldWidth);

    return { x: clickX, y: clickY };
  }

  placeBombs(bombs: number, fieldsX: number, fieldsY: number) {
    if ((fieldsX * fieldsY) / 4 < bombs) {
      bombs = (fieldsX * fieldsY) / 4;
    }
    this.bombs = [];

    for (let i = 0; i < bombs; i++) {
      let x: number;
      let y: number;
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

  revealSurrounding(x: number, y: number): void {
    if (
      !this.board.getMined(x, y) &&
      this.board.getBombCount(x, y) === 0 &&
      !this.board.getRevealed(x, y)
    ) {
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

  win(): any {
    this.running = false;

    this.bombs.forEach((val, i) => {
      this.board.setRevealed(val.x, val.y, true);
    });
    this.drawBoard();

    setTimeout(() => {
      alert("You win!");
    }, 250);
  }

  public drawBoard(): void {
    let canvasX: number = 0;
    let canvasY: number = 0;
    for (let row = 0; row < this.board.rowCount; row++) {
      for (let column = 0; column < this.board.columnCount; column++) {
        let mined = this.board.getMined(column, row);
        let marked = this.board.getMarked(column, row);
        let revealed = this.board.getRevealed(column, row);
        let bombs = this.board.getBombCount(column, row);

        if (!revealed) {
          this.drawHidden(column * this.fieldWidth, row * this.fieldHeight);
        } else if (marked) {
          this.drawMarked(column * this.fieldWidth, row * this.fieldHeight);
        } else if (mined) {
          this.drawMine(column * this.fieldWidth, row * this.fieldHeight);
        } else if (revealed) {
          this.drawRevealed(
            column * this.fieldWidth,
            row * this.fieldHeight,
            bombs
          );
        }
      }
    }
  }

  drawBorder(x: number, y: number) {
    this.ctx.fillStyle = "gray";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, this.fieldWidth, this.fieldHeight);
  }

  drawMine(x: number, y: number) {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(x, y, this.fieldWidth, this.fieldHeight);
    this.drawBorder(x, y);
  }

  drawMarked(x: number, y: number) {
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(x, y, this.fieldWidth, this.fieldHeight);
    this.drawBorder(x, y);
  }

  drawRevealed(x: number, y: number, bombs) {
    this.ctx.fillStyle = "darkgray";
    this.ctx.fillRect(x, y, this.fieldWidth, this.fieldHeight);
    this.ctx.fillStyle = "white";
    this.ctx.font = "16px Arial";
    this.ctx.fillText(bombs, x + 5, y + 20);
    this.drawBorder(x, y);
  }

  drawHidden(x: number, y: number): any {
    this.ctx.fillStyle = "lightgray";
    this.ctx.fillRect(x, y, this.fieldWidth, this.fieldHeight);
    this.drawBorder(x, y);
  }
}
