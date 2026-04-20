/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */



export default class Character {
  constructor(level, type = "generic") {

    if (new.target === Character) {
      throw new Error("Нельзя создавать объекты класса Character напрямую");
    }
  
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    
    
    for (let i = 1; i <= level; i++) {
      this.levelUp();
    }

    const allowedTypes = [
      "bowman",
      "swordsman",
      "magician",
      "daemon",
      "undead",
      "vampire"
    ];

    if (!allowedTypes.includes(type)) {
      throw new Error(`Недопустимый тип персонажа: ${type}`);
    }
    
    if (new.target === Character){
      throw new Error("Нельзя создавать объекты класса Character напрямую");
    }
  }

  levelUp() {
    this.level += 1;

    this.health = Math.min(100, this.health + 80);

    this.attack = Math.max(
      this.attack,
      Math.floor(this.attack * (80 + this.health) / 100)
    );

    this.defence = Math.max(
      this.defence,
      Math.floor(this.defence * (80 + this.health) / 100)
    );
  }


}
