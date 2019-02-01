import { Game } from './entities/Game';
import { Debug } from './util/Util';
import { Sprite } from './entities/Sprite';
import { Group } from './entities/Group';
import { Box } from './entities/Box';
import { HexCode } from './enum/Enum';

if (Debug.isDebug) {
}

const game: Game = new Game({ debug: { outlines: true, grid: true } });
game.load.image('assets/gradient.jpg', 'gradient');
const group = new Group(game, {
    x: 80,
    y: 80,
    z: 2
});
const box = new Box(game, {
    x: -40,
    y: 40,
    z: 3,
    width: 40,
    height: 40
});
const gradient = new Sprite(game, {
    x: 80,
    y: 80,
    asset: 'gradient'
});

group.add(box);
group.add(gradient);
game.add(group);
game.start();
console.log(game);
console.log(group);
console.log(box);

game.load.image('assets/gradient.jpg', 'gradient');
