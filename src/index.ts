import { Game } from './entities/Game';
import { Debug } from './util/Util';
import { EntityFactory } from './EntityFactory';

if (Debug.isDebug) {
}

const game: Game = EntityFactory.game({ debug: { outline: true, grid: true, pivot: true } });
game.load.image('assets/gradient.jpg', 'gradient');
const group = game.entity.group({
    x: 80,
    y: 80,
    z: 2
});
const box = game.entity.box({
    x: 40,
    y: 40,
    z: 3,
    width: 40,
    height: 40
});
const gradient = game.entity.sprite({
    x: 80,
    y: 60,
    tag: 'group',
    alpha: 0.5,
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

setTimeout(() => {
    box.scaleX = 1.5;
    gradient.scaleX = 1.5;
}, 2000);

setTimeout(() => {
    gradient.z = 5;
}, 4000);
