
export default class GameState {
  constructor() {
    this.level = 1;
    this.positions = [];
    this.currentPlayer = "player";
    this.selectedPosition = null;
    this.isLocked = false;
    this.isAttacking = false;
    this.gameOver = false;
    this.theme = 0;
  }
  
  toJSON() {
    return {
      positions: this.positions.map(p => ({
        position: p.position,
        type: p.character.type,
        level: p.character.level,
        attack: p.character.attack,
        defence: p.character.defence,
        health: p.character.health
      })),
      currentPlayer: this.currentPlayer,
      level: this.level,
      gameOver: this.gameOver,
      score: this.score,
      maxScore: this.maxScore,
      theme: this.theme
    };
  }

  static from(object) {
    const state = new GameState();
    Object.assign(state, object);
    return state;
  }
}
