import Character from "../Character";
import Bowman from "../characters/Bowman";
import Daemon from "../characters/Daemon";
import Magician from "../characters/Magician";
import Swordsman from "../characters/Swordsman";
import Undead from "../characters/Undead";
import Vampire from "../characters/Vampire";
import PositionedCharacter from "../PositionedCharacter";

describe("Character inheritance rules", () => {

  test("Character instance error", () => {
    expect(() => {
      new Character(1);
    }).toThrow("Нельзя создавать объекты класса Character напрямую");
  });

  test("no error when creating Bowman", () => {
    expect(() => {
      new Bowman(1);
    }).not.toThrow();
  });

  test("no error when creating Swordsman", () => {
    expect(() => {
      new Swordsman(1);
    }).not.toThrow();
  });

  test("no error when creating Magician", () => {
    expect(() => {
      new Magician(1);
    }).not.toThrow();
  });

  test("no error when creating Daemon", () => {
    expect(() => {
      new Daemon(1);
    }).not.toThrow();
  });

  test("no error when creating Undead", () => {
    expect(() => {
      new Undead(1);
    }).not.toThrow();
  });

  test("no error when creating Vampire", () => {
    expect(() => {
      new Vampire(1);
    }).not.toThrow();
  });
});


describe("Level 1 characteristics", () => {
  test("new Bowman(1)", () => {
    const bowman = new Bowman(1);
    expect(bowman.level).toBe(1);
    expect(bowman.attack).toBe(25);
    expect(bowman.defence).toBe(25);
    expect(bowman.health).toBe(50);
    expect(bowman.type).toBe("bowman");
  });
  test("new Swordsman(1)", () => {
    const swordsman = new Swordsman(1);
    expect(swordsman.level).toBe(1);
    expect(swordsman.attack).toBe(40);
    expect(swordsman.defence).toBe(10);
    expect(swordsman.health).toBe(50);
    expect(swordsman.type).toBe("swordsman");
  });

  test("new Magician(1)", () => {
    const magician = new Magician(1);
    expect(magician.level).toBe(1);
    expect(magician.attack).toBe(10);
    expect(magician.defence).toBe(40);
    expect(magician.health).toBe(50);
    expect(magician.type).toBe("magician");
  });

  test("new Daemon(1)", () => {
    const daemon = new Daemon(1);
    expect(daemon.level).toBe(1);
    expect(daemon.attack).toBe(10);
    expect(daemon.defence).toBe(10);
    expect(daemon.health).toBe(50);
    expect(daemon.type).toBe("daemon");
  });

  test("new Undead(1)", () => {
    const undead = new Undead(1);
    expect(undead.level).toBe(1);
    expect(undead.attack).toBe(40);
    expect(undead.defence).toBe(10);
    expect(undead.health).toBe(50);
    expect(undead.type).toBe("undead");
  });

  test("new Vampire(1)", () => {
    const vampire = new Vampire(1);
    expect(vampire.level).toBe(1);
    expect(vampire.attack).toBe(25);
    expect(vampire.defence).toBe(25);
    expect(vampire.health).toBe(50);
    expect(vampire.type).toBe("vampire");
  });
});

describe("Movement and attack ranges", () => {
  test("Bowman has correct movement and attack range", () => {
    const bowman = new Bowman(1);
    const positionedBowman = new PositionedCharacter(bowman, 1);
    expect(positionedBowman.character.distance).toBe(2);
    expect(positionedBowman.character.attackRange).toBe(2);
  });

  test("Swordsman has correct movement and attack range", () => {
    const swordsman = new Swordsman(1);
    const positionedSwordsman = new PositionedCharacter(swordsman, 1);
    expect(positionedSwordsman.character.distance).toBe(4);
    expect(positionedSwordsman.character.attackRange).toBe(1);
  });

  test("Magician has correct movement and attack range", () => {
    const magician = new Magician(1);
    const positionedMagician = new PositionedCharacter(magician, 1);
    expect(positionedMagician.character.distance).toBe(1);
    expect(positionedMagician.character.attackRange).toBe(4);
  });

  test("Daemon has correct movement and attack range", () => {
    const daemon = new Daemon(1);
    const positionedDaemon = new PositionedCharacter(daemon, 1);
    expect(positionedDaemon.character.distance).toBe(1);
    expect(positionedDaemon.character.attackRange).toBe(4);
  });

  test("Undead has correct movement and attack range", () => {
    const undead = new Undead(1);
    const positionedUndead = new PositionedCharacter(undead, 1);
    expect(positionedUndead.character.distance).toBe(4);
    expect(positionedUndead.character.attackRange).toBe(1);
  });

  test("Vampire has correct movement and attack range", () => {
    const vampire = new Vampire(1);
    const positionedVampire = new PositionedCharacter(vampire, 1);
    expect(positionedVampire.character.distance).toBe(2);
    expect(positionedVampire.character.attackRange).toBe(2);
  });
});

