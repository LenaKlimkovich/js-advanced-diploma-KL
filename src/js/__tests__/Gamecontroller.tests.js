import Vampire from "../characters/Vampire";
import Undead from "../characters/Undead";
import Bowman from "../characters/Bowman";
import GameController from "../GameController";
import GamePlay from "../GamePlay";
import StateService from "../GameStateService";
import PositionedCharacter from "../PositionedCharacter";


jest.mock("../GamePlay", () => {
  return jest.fn().mockImplementation(() => ({
    showDamage: jest.fn(),
    selectCell: jest.fn(),
    deselectCell: jest.fn(),
    setCursor: jest.fn(),
    addCellEnterListener: jest.fn(),
    addCellLeaveListener: jest.fn(),
    addCellClickListener: jest.fn(),
    redrawPositions: jest.fn(),
  }));
});

let gamePlay;
let stateService;
let gameController;
let vampire;
let localStorageMock;


beforeEach(() => {
  gamePlay = new GamePlay();
  localStorageMock  = {
    data: {},
    setItem(key, value) { this.data[key] = value; },
    getItem(key) { return this.data[key]; },
    clear() { this.data = {}; }
  };
  stateService = new StateService(localStorageMock);
  gameController = new GameController(gamePlay, stateService);
  vampire = new Vampire(1);
});


describe("getMessage() in Controller", () => {
  test("getMessage(character) works correctly", () => {
    const result = gameController.getMessage(vampire);
    expect(result).toBe("\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}50");
  });
});

describe("GameController.attack()", () => {
  let gamePlayMock;
  let stateServiceMock;
  let controller;

  beforeEach(() => {
    gamePlayMock = {
      boardSize: 8,
      showDamage: jest.fn(() => Promise.resolve()),
      redrawPositions: jest.fn(),
      deselectCell: jest.fn(),
    };

    stateServiceMock = {
      save: jest.fn(),
      load: jest.fn(),
    };

    controller = new GameController(gamePlayMock, stateServiceMock);
  });

  test("attack deals correct damage", async () => {
    const attackerChar = new Bowman(1);
    attackerChar.attack = 40;

    const targetChar = new Undead(1);
    targetChar.defence = 10;
    targetChar.health = 100;

    const attacker = new PositionedCharacter(attackerChar, 0);
    const target = new PositionedCharacter(targetChar, 1);

    controller.positions = [attacker, target];

    await controller.attack(attacker, target);

    expect(target.character.health).toBe(70);
    expect(gamePlayMock.showDamage).toHaveBeenCalledWith(1, 30);
    expect(gamePlayMock.redrawPositions).toHaveBeenCalled();
  });

  test("attack kills target and removes it from positions", async () => {
    const attackerChar = new Bowman(1);
    attackerChar.attack = 50;

    const targetChar = new Undead(1);
    targetChar.defence = 10;
    targetChar.health = 20;

    const attacker = new PositionedCharacter(attackerChar, 0);
    const target = new PositionedCharacter(targetChar, 1);

    controller.positions = [attacker, target];

    await controller.attack(attacker, target);

    expect(gamePlayMock.redrawPositions).toHaveBeenCalled();
  });
});
