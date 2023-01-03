import type { Direction, Option } from './types';
import { DOWN, LEFT, RIGHT, UP } from './constants';

function log(item: unknown) {
  console.log(JSON.stringify(item, null, 2));
}

function random(upperBound: number, lowerBound = 0) {
  return Math.ceil(Math.random() * upperBound) + lowerBound;
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function inverse(direction: Direction) {
  const inverseMap = { [UP]: DOWN, [DOWN]: UP, [RIGHT]: LEFT, [LEFT]: RIGHT };
  const inverseDirection = inverseMap[direction] as Direction;
  return inverseDirection;
}

function randomizeOptions(options: Option[]) {
  const randomOptions = new Set<Option>();
  let amount = Math.ceil(random(options.length - 1));

  while (amount > 0) {
    const randomOption = randomElement(options);
    if (randomOptions.has(randomOption)) continue;
    randomOptions.add(randomOption);
    amount -= 1;
  }

  return Array.from(randomOptions);
}

export default { log, random, randomElement, inverse, randomizeOptions };
