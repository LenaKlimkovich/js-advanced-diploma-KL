/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Daemon from "./characters/Daemon";
import Magician from "./characters/Magician";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";

export const allowedTypes = [
  Bowman,
  Swordsman,
  Daemon,
  Magician, 
  Undead, 
  Vampire
];

export function* characterGenerator(allowedTypes, maxLevel) {
  while(true){
    const randomIndex = Math.floor(Math.random() * allowedTypes.length);
    const RandomType = allowedTypes[randomIndex];
    const level = Math.floor(Math.random() * maxLevel) + 1;
    yield new RandomType(level);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];
  for (let i = 0; i < characterCount; i++) {
    const generator = characterGenerator(allowedTypes, maxLevel);
    team.push(generator.next().value);
  }
  return team;
}
