class Menu {
  game: Game;
  canvas: HTMLCanvasElement;
  menu: HTMLElement;
  height: number;
  width: number;
  rows: number;
  columns: number;
  bombs: number;
  validated: boolean;

  constructor() {
    this.menu = document.getElementById("divMenu");
    this.canvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
    this.readSettings();
    this.newGame();
  }

  newGame() {
    try {
      this.game = new Game(
        this.canvas,
        this.bombs,
        this.rows,
        this.columns,
        this.height,
        this.width
      );
    } catch (error) {
      this.validated = false;
    }
    this.game.drawBoard();
  }

  getSetting(name: string): any {
    let input = <HTMLInputElement>document.getElementById(name);
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
    return (
      (this.rows * this.columns) / 4 > this.bombs &&
      (this.bombs <= 1000 && this.bombs >= 5) &&
      (this.height <= 100 && this.height >= 25) &&
      (this.width <= 100 && this.width >= 25) &&
      (this.rows <= 100 && this.rows >= 5) &&
      (this.columns <= 100 && this.columns >= 5)
    );
  }

  clickPlay() {
    if (this.validated) {
      this.showMenu(false);
      this.newGame();
    } else {
      alert("Config invalid");
    }
  }

  showMenu(state: boolean) {
    this.menu.style.visibility = state ? "visible" : "hidden";
    this.game.running = true;
  }
}
