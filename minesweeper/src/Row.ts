class Row {
  private fields: Field[] = [];

  get length(): number {
    return this.fields.length;
  }

  constructor(fieldCount: number) {
    for (let i = 0; i < fieldCount; i++) {
      this.fields.push(new Field());
    }
  }

  set(type: string, pos: number, state: any) {
    if (pos >= this.fields.length) return undefined;
    this.fields[pos][type] = state;
  }

  get(type: string, pos: number) {
    if (pos >= this.fields.length) return undefined;
    return this.fields[pos][type];
  }

  public setMined(pos: number, state: boolean) {
    this.set("mined", pos, state);
  }

  public getMined(pos: number) {
    return this.get("mined", pos);
  }

  public setRevealed(pos: number, state: boolean) {
    this.set("revealed", pos, state);
  }

  public getRevealed(pos: number) {
    return this.get("revealed", pos);
  }

  public setMarked(pos: number, state: boolean) {
    this.set("marked", pos, state);
  }

  public getMarked(pos: number) {
    return this.get("marked", pos);
  }

  public setBombCount(pos: number, state: boolean) {
    this.set("bombCount", pos, state);
  }

  public getBombCount(pos: number) {
    return this.get("bombCount", pos);
  }

  public incBombCount(pos: number) {
    this.setBombCount(pos, this.getBombCount(pos) + 1);
  }
}
