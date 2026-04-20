export default class GameState {
  constructor() {
    this.positions = [];
    this.currentPlayer = "player"; 
    this.level = 1;
    this.gameOver = false;
    this.score = 0;
    this.maxScore = 0;
    this.theme = "prairie"; 
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
