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
    x: 0,
    y: 0,
    z: 2
});
// const group1 = new Group(game, {
//     x: 10,
//     y: 10,
//     z: 3
// });
// const gradient = new Sprite(game, {
//     asset: 'gradient',
//     x: 10,
//     y: 10
// });

const box = new Box(game, {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    backgroundColor: HexCode.White,
    update: () => {
        console.log('update');
    }
});
group.add(box);
game.add(group);
game.start();
console.log(game);

setTimeout(() => {
    box.x = 40;
    box.y = 40;
}, 1000);
