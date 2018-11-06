class Board {
  private rows: Row[] = [];
  public readonly rowCount: number;
  public readonly columnCount: number;

  constructor(rows: number, columns: number) {
    this.rowCount = rows;
    this.columnCount = columns;
    for (let i = 0; i < rows; i++) {
      this.rows.push(new Row(columns));
    }
  }

  set(type: string, posX: number, posY: number, state: any) {
    if (
      posX < 0 ||
      posY < 0 ||
      posY >= this.rows.length ||
      posX >= this.rows[posY].length
    )
      return undefined;
    this.rows[posY].set(type, posX, state);
  }

  get(type: string, posX: number, posY: number) {
    if (
      posX < 0 ||
      posY < 0 ||
      posY >= this.rows.length ||
      posX >= this.rows[posY].length
    )
      return undefined;
    return this.rows[posY].get(type, posX);
  }

  public setMined(posX: number, posY: number, state: boolean) {
    this.set("mined", posX, posY, state);
  }

  public getMined(posX: number, posY: number) {
    return this.get("mined", posX, posY);
  }

  public setRevealed(posX: number, posY: number, state: boolean) {
    this.set("revealed", posX, posY, state);
  }

  public getRevealed(posX: number, posY: number) {
    return this.get("revealed", posX, posY);
  }

  public setMarked(posX: number, posY: number, state: boolean) {
    this.set("marked", posX, posY, state);
  }

  public getMarked(posX: number, posY: number) {
    return this.get("marked", posX, posY);
  }

  public setBombCount(posX: number, posY: number, state: boolean) {
    this.set("bombCount", posX, posY, state);
  }

  public getBombCount(posX: number, posY: number) {
    return this.get("bombCount", posX, posY);
  }

  public incBombCount(posX: number, posY: number) {
    this.setBombCount(posX, posY, this.getBombCount(posX, posY) + 1);
  }
}
