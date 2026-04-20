import { characterGenerator, generateTeam } from "../generators";
import Character from "../Character";
import { allowedTypes } from "../generators";

test("characterGenerator() works correctly", () => {
  const character = characterGenerator(allowedTypes, 4);
  for (let i = 0; i < 7; i++) {
    const { value, done } = character.next();

    expect(done).toBe(false);
    expect(value).toBeInstanceOf(Character);

   
    const typeNames = allowedTypes.map(t => t.name.toLowerCase());
    expect(typeNames).toContain(value.type);

  
    expect(value.level).toBeGreaterThanOrEqual(1);
    expect(value.level).toBeLessThanOrEqual(4);
  }
});


test("generateTeam() works correctly", () => {
  const team = generateTeam(allowedTypes, 4, 5);
  expect(team.length).toBe(5);
  for (const character of team) {
    
    expect(character).toBeInstanceOf(Character);

    const typeNames = allowedTypes.map(t => t.name.toLowerCase());
    expect(typeNames).toContain(character.type);

    expect(character.level).toBeGreaterThanOrEqual(1);
    expect(character.level).toBeLessThanOrEqual(4);
  }

});
