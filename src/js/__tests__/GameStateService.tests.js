import GameController from "../GameController";

describe("GameController.load()", () => {
  let gamePlayMock;
  let stateServiceMock;
  let controller;

  beforeEach(() => {
    global.alert = jest.fn;
    gamePlayMock = {
      drawUi: jest.fn(),
      redrawPositions: jest.fn(),
      showError: jest.fn(),
      addCellEnterListener: jest.fn(),
      addCellLeaveListener: jest.fn(),
      addCellClickListener: jest.fn(),
      addNewGameListener: jest.fn(),
      addSaveGameListener: jest.fn(),
      addLoadGameListener: jest.fn
    };

    stateServiceMock = {
      load: jest.fn(),
      save: jest.fn(),
    };

    controller = new GameController(gamePlayMock, stateServiceMock);
  });

  test("load() works correctly", () => {
    const savedState = {
      level: 1,
      theme: "prairie",
      positions: [],
    };

    stateServiceMock.load.mockReturnValue(savedState);

    controller.init(); 

    expect(gamePlayMock.showError).not.toHaveBeenCalled();
    expect(gamePlayMock.drawUi).toHaveBeenCalled();
    expect(gamePlayMock.redrawPositions).toHaveBeenCalled();
  });

  test("error of load()", () => {
    stateServiceMock.load.mockImplementation(() => {
      throw new Error("load error");
    });

    controller.init();

    expect(gamePlayMock.showError).toHaveBeenCalled();
  });
});
