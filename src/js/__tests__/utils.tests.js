import { calcTileType } from "../utils";

test("index = 0 boardSize = 8", () => {
  const result = calcTileType(0, 8);
  expect(result).toBe("top-left");
});

test("index = 6 boardSize = 8", () => {
  const result = calcTileType(6, 8);
  expect(result).toBe("top");
}); 

test("index = 7 boardSize = 8", () => {
  const result = calcTileType(7, 8);
  expect(result).toBe("top-right");
}); 

test("index = 63 boardSize = 8", () => {
  const result = calcTileType(63, 8);
  expect(result).toBe("bottom-right");
});

test("index = 56 boardSize = 8", () => {
  const result = calcTileType(56, 8);
  expect(result).toBe("bottom-left");
});


test("index = 40 boardSize = 8", () => {
  const result = calcTileType(40, 8);
  expect(result).toBe("left");
});


test("index = 47 boardSize = 8", () => {
  const result = calcTileType(47, 8);
  expect(result).toBe("right");
});


test("index = 53 boardSize = 8", () => {
  const result = calcTileType(53, 8);
  expect(result).toBe("center");
});

test("index = 58 boardSize = 8", () => {
  const result = calcTileType(58, 8);
  expect(result).toBe("bottom");
});
