import { Game } from './entities/Game';
import { Debug } from './util/Debug';
import { Sprite } from './entities/Sprite';
import { Group } from './entities/Group';

if (Debug.isDebug) {
}

const game: Game = new Game({ outlines: true });
game.load.image('assets/gradient.jpg', 'gradient');
const group = new Group(game, {
    x: 10,
    y: 10,
    z: 2
});
const group1 = new Group(game, {
    x: 10,
    y: 10,
    z: 3
});
const gradient = new Sprite(game, {
    asset: 'gradient',
    x: 10,
    y: 10
});

group.add(group1);
group1.add(gradient);
game.add(group);
game.start();
console.log(game);

setTimeout(() => (group1.x = 20), 1000);
