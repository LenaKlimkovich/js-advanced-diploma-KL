import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";

import Vampire from "./characters/Vampire";
import Undead from "./characters/Undead";
import Daemon from "./characters/Daemon";

import {
  generateTeam
} from "./generators";
import themes from "./themes";
import PositionedCharacter from "./PositionedCharacter";
import GameState from "./GameState";
import GamePlay from "./GamePlay";
import cursors from "./cursors";

export const characterClasses = {
  swordsman: Swordsman,
  bowman: Bowman,
  magician: Magician,
  daemon: Daemon,
  undead: Undead,
  vampire: Vampire
};

const players = [Bowman, Magician, Swordsman];
const enemies = [Daemon, Undead, Vampire];

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.positions = [];
    this.selectedCharacter = null;
    this.isAttacking = false;
    this.isLocked = false;
    this.themes = [
      themes.prairie,
      themes.desert,
      themes.arctic,
      themes.mountain
    ];
  }

  positionCharacters(team, columns) {
    const positions = [];
    for (const character of team) {
      let position;
      do {
        const row = Math.floor(Math.random() * this.gamePlay.boardSize);
        const col = columns[Math.floor(Math.random() * columns.length)];
        position = row * this.gamePlay.boardSize + col;
      } while (positions.some(p => p.position === position));

      positions.push(new PositionedCharacter(character, position));
    }
    return positions;
  }

  nextLevel() {
    this.gameState.level += 1;
    if (this.gameState.level > 4 && !this.positions.includes(p =>
      enemies.some(cls => p.character instanceof cls))) {
      this.gameState.gameOver = true;
      this.selectedCharacter = null;
      GamePlay.showMessage("Игра завершена");
      return;
    }
    const themeIndex = (this.gameState.level - 1) % this.themes.length;
    this.gameState.theme = this.themes[themeIndex];
    this.gamePlay.drawUi(this.themes[themeIndex]);

    const playerPositions = this.positions.filter(p =>
      players.some(cls => p.character instanceof cls)
    );
    playerPositions.forEach(p => p.character.levelUp());

    const enemyTeam = generateTeam(
      enemies,
      this.gameState.level,
      3
    );
    const positionedEnemies = this.positionCharacters(enemyTeam, [6, 7]);

    this.positions = [
      ...playerPositions,
      ...positionedEnemies
    ];
 
    this.gamePlay.redrawPositions(this.positions);
    this.gameState.positions = this.positions;
    this.stateService.save(this.gameState);
  }


  init() {
    try {
      this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
      this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
      this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));

      const saved = this.stateService.load();

      if (saved) {
        this.gameState = GameState.from(saved);

        this.positions = saved.positions.map(p => {
          const CharacterClass = characterClasses[p.type];
          const character = new CharacterClass(p.level);

          character.attack = p.attack;
          character.defence = p.defence;
          character.health = p.health;

          return new PositionedCharacter(character, p.position);
        });

        this.gameState.positions = this.positions;

        this.gamePlay.drawUi(themes[this.gameState.theme]);
        this.gamePlay.redrawPositions(this.positions);

        this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
        this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
        this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

        return;
      }

      // если сохранения нет — запускаем новую игру
      this.startNewGame();

    } catch (e) {
      this.gamePlay.showError("Ошибка загрузки");
    }
  }


  startNewGame() {
    this.gameState = new GameState();
    this.gamePlay.drawUi(themes.prairie);

    const playerTeam = generateTeam(players, 1, 3);
    const enemyTeam = generateTeam(enemies, 1, 3);

    const positionedPlayers = this.positionCharacters(playerTeam, [0, 1]);
    const positionedEnemies = this.positionCharacters(enemyTeam, [6, 7]);

    this.positions = [...positionedPlayers, ...positionedEnemies];
    this.gameState.positions = this.positions;
    this.gamePlay.redrawPositions(this.positions);
    this.stateService.save(this.gameState);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }


  async changeTurn() {
    this.gameState.currentPlayer =
            this.gameState.currentPlayer === "player" ? "enemy" : "player";
    const enemiesList = this.positions.filter(p =>
      enemies.some(cls => p.character instanceof cls)
    );

    if (enemiesList.length === 0) {
      this.nextLevel();
      this.gameState.positions = this.positions;
      this.stateService.save(this.gameState);
      return;
    }

    const enemy = enemiesList[Math.floor(Math.random() * enemiesList.length)];
    const target = this.findClosestPlayer(enemy);

    if (this.canAttack(enemy, target)) {
      await this.attack(enemy, target);
      this.gameState.currentPlayer = "player";
      const playersList = this.positions.filter(p =>
        players.some(cls => p.character instanceof cls)
      );
      if (playersList.length === 0) {
        GamePlay.showMessage("Вы проиграли");
        this.gameState.gameOver = true;
        this.gameState.positions = this.positions;
        this.stateService.save(this.gameState);
        return;
      }
      return;
    }

    const possibleMoves = [];
    for (let i = 0; i < this.gamePlay.cells.length; i++) {
      if (this.canMove(enemy, i)) possibleMoves.push(i);
    }

    if (possibleMoves.length > 0) {
      enemy.position =
                possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      this.gamePlay.redrawPositions(this.positions);
    }

    this.gameState.currentPlayer = "player";
    this.stateService.save(this.gameState);
  }


  async onCellClick(index) {
   if(this.isLocked) return;
    if (this.gameState.gameOver) {
      return;
    }
    const cell = this.positions.find(p => p.position === index);
    const selected = this.selectedCharacter;

    if (cell && players.some(cls => cell.character instanceof cls)) {
      this.gamePlay.cells.forEach(c => c.classList.remove("selected"));
      this.gamePlay.selectCell(index, "yellow");
      this.selectedCharacter = cell;

      this.gameState.positions = this.positions;
      this.stateService.save(this.gameState);
      return;
    }

    if (!selected) return;

    if (cell && enemies.some(cls => cell.character instanceof cls)) return;

    if (!cell && this.canMove(selected, index)) {
      selected.position = index;

      this.gamePlay.cells.forEach(c => c.classList.remove("selected"));
      this.selectedCharacter = null;
      this.gamePlay.redrawPositions(this.positions);

      await this.changeTurn();
      this.gameState.positions = this.positions;
      this.stateService.save(this.gameState);
      return;
    }
    GamePlay.showError("Недопустимый ход");
  }


  getMessage(character) {
    const {
      level,
      attack,
      defence,
      health
    } = character;
    return `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`;
  }

  canMove(selected, index) {
    if (!selected) return false;
    const start = selected.position;
    const startRow = Math.floor(start / this.gamePlay.boardSize);
    const startCol = start % this.gamePlay.boardSize;

    const targetRow = Math.floor(index / this.gamePlay.boardSize);
    const targetCol = index % this.gamePlay.boardSize;

    const rowDiff = Math.abs(startRow - targetRow);
    const colDiff = Math.abs(startCol - targetCol);

    if (start === index) return false;
    const moveRange = selected.character.distance;
  
    if (rowDiff <= moveRange && colDiff <= moveRange) {

      const occupied = this.positions.some(p => p.position === index);
      if (!occupied) return true;
    }
    return false;
  }

  canAttack(selected, target) {
    if (!selected || !target) return false;

    const boardSize = this.gamePlay.boardSize;

    const start = selected.position;
    const targetIndex = target.position;

    const startRow = Math.floor(start / boardSize);
    const startCol = start % boardSize;

    const targetRow = Math.floor(targetIndex / boardSize);
    const targetCol = targetIndex % boardSize;

    const rowDiff = Math.abs(startRow - targetRow);
    const colDiff = Math.abs(startCol - targetCol);

    const attackRange = selected.character.attackRange;

    if (start === targetIndex) return false;

    return rowDiff <= attackRange && colDiff <= attackRange;
  }

  async attack(attacker, target) {
    const damage = Math.max(
      attacker.character.attack - target.character.defence,
      attacker.character.attack * 0.1
    );
    target.character.health -= damage;
    await this.gamePlay.showDamage(target.position, damage);

    let died = false;

    if (target.character.health <= 0) {
      died = true;

      if (this.selectedCharacter === target) {
        this.gamePlay.deselectCell(target.position);
        this.selectedCharacter = null;
      }
      this.positions = this.positions.filter(p => p !== target);
    }
    this.gamePlay.redrawPositions(this.positions);
    this.gameState.positions = this.positions;
    this.stateService.save(this.gameState);

    return died;
  }


  findClosestPlayer(enemy) {

    const enemyRow = Math.floor(enemy.position / this.gamePlay.boardSize);
    const enemyCol = enemy.position % this.gamePlay.boardSize;;

    const playerCharacters = this.positions.filter(p =>
      players.includes(p.character.constructor)
    );

    let nearest = null;
    let minDist = Infinity;

    for (const player of playerCharacters) {
      const playerRow = Math.floor(player.position / this.gamePlay.boardSize);
      const playerCol = player.position % this.gamePlay.boardSize;

      const rowDiff = Math.abs(enemyRow - playerRow);
      const colDiff = Math.abs(enemyCol - playerCol);

      const dist = Math.max(rowDiff, colDiff); // расстояние по клеткам

      if (dist < minDist) {
        minDist = dist;
        nearest = player;
      }
    }

    return nearest;
  }

  async onCellEnter(index) {
 if(this.isLocked) return;
    if (this.gameState.gameOver) return;

    const positioned = this.positions.find(p => p.position === index);
    if (positioned) {
      const message = this.getMessage(positioned.character);
      this.gamePlay.showCellTooltip(message, index);
    }

    if (!this.selectedCharacter) {
      this.gamePlay.setCursor(
        positioned && players.some(cls => positioned.character instanceof cls) ?
          cursors.pointer :
          cursors.auto
      );
      return;
    }

    if (this.selectedCharacter && this.canMove(this.selectedCharacter, index)) {
      this.gamePlay.selectCell(index, "green");
      this.gamePlay.setCursor(cursors.pointer);
      return;
    } else {
      this.gamePlay.setCursor(cursors.notallowed);
    }

    if (positioned && players.some(cls => positioned.character instanceof cls)) {
      this.gamePlay.setCursor(cursors.pointer);
      return;
    }
    if (positioned && enemies.some(cls => positioned.character instanceof cls)) {

      if (this.canAttack(this.selectedCharacter, positioned)) {
        this.gamePlay.selectCell(index, "red");
        this.gamePlay.setCursor(cursors.crosshair);
        this.isAttacking = true;

        await this.attack(this.selectedCharacter, positioned);

        this.isAttacking = false;

        await this.changeTurn();
        this.stateService.save(this.gameState);


      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
      return;
    }
  }


  onCellLeave(index) {
     if(this.isLocked) return;
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.deselectCell(index);
    if (this.selectedCharacter && this.selectedCharacter.position === index) {

      this.gamePlay.selectCell(index, "yellow");
    }
    this.gamePlay.setCursor(cursors.auto);
  }

  onNewGameClick() {
    this.gameState.maxScore = Math.max(
      this.gameState.maxScore,
      this.gameState.score
    );
    this.startNewGame();
  }

  onSaveGameClick() {
    if (this.gameState.gameOver) return;

    this.gameState.positions = this.positions;
    this.stateService.save(this.gameState);
    this.isLocked = true;
    GamePlay.showMessage("Игра сохранена");
  }

  onLoadGameClick() {
    this.isLocked = false;
    const saved = this.stateService.load();

    if (!saved) {
      GamePlay.showError("Нет сохранённой игры");
      return;
    }

    this.gameState = GameState.from(saved);

    this.positions = saved.positions.map(p => {
      const CharacterClass = characterClasses[p.type];
      const character = new CharacterClass(p.level);

      character.attack = p.attack;
      character.defence = p.defence;
      character.health = p.health;

      return new PositionedCharacter(character, p.position);
    });
    this.gameState.positions = this.positions;
    this.gamePlay.drawUi(themes[this.gameState.theme]);
    this.gamePlay.redrawPositions(this.positions);


    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    GamePlay.showMessage("Игра загружена");

  }
} 
