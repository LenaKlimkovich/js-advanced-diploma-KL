
export default class GameState {
  constructor() {
    this.level = 1;
    this.theme = 0; // индекс темы
    this.currentPlayer = "player"; // или 'enemy'
    this.positions = []; // массив PositionedCharacter
    this.selectedPosition = null;
    this.isLocked = false;
    this.isAttacking = false;
  }

  // Создание объекта для сохранения
  toJSON() {
    return {
      level: this.level,
      theme: this.theme,
      currentPlayer: this.currentPlayer,
      selectedPosition: this.selectedPosition,
      isLocked: this.isLocked,
      isAttacking: this.isAttacking,

  
      positions: this.positions.map(p => ({
        type: p.character.type,
        level: p.character.level,
        attack: p.character.attack,
        defence: p.character.defence,
        health: p.character.health,
        position: p.position,
      })),
    };
  }

  static from(obj) {
    const state = new GameState();

    state.level = obj.level;
    state.theme = obj.theme;
    state.currentPlayer = obj.currentPlayer;
    state.selectedPosition = obj.selectedPosition;
    state.isLocked = obj.isLocked;
    state.isAttacking = obj.isAttacking;
    state.positions = obj.positions;

    return state;
  }
}
