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

const gradient = new Sprite(game, {
    x: 0,
    y: 0,
    z: 3,
    width: 50,
    height: 50,
    asset: 'gradient',
    load: () => {
        console.log('load');
    },
    start: () => {
        console.log('start');
    },
    preupdate: () => {
        console.log('preupdate');
    },
    update: () => {
        console.log('update');
    },
    postupdate: () => {
        console.log('postupdate');
    }
});
group.add(gradient);
game.add(group);
game.start();
console.log(game);

setTimeout(() => {
    gradient.x = 50;
    gradient.y = 50;
}, 1000);
