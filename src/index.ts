import { Game } from './entities/Game';
import { Environment } from './util/Environment';
import { Debug } from './util/Debug';
import { LoaderEvents } from './loader/Loader';
import { Asset } from './loader/assets/Asset';
import { Box } from './entities/Box';
import { HexCode } from './enum/HexCode';
import { Time } from './structs/Time';
import { Random } from './util/Random';
import { Sprite } from './entities/Sprite';
import { Group } from './entities/Group';

class Test extends Box {
    private direction: number = 1;

    public update(): void {
        if (this.x > this.game.width) {
            this.direction = -1;
        } else if (this.x + this.width < this.game.x) {
            this.direction = 1;
        }
        this.x += 1 * Time.deltaTime * this.direction;
    }
}

const game: Game = new Game({});
game.load.image('assets/gradient.jpg', 'gradient');
const gradient = new Sprite(game, {
    asset: 'gradient',
    x: 20,
    y: 20
});
const group = new Group(game, {
    x: 50,
    y: 50,
    z: 2
});
const group1 = new Group(game, {
    x: 60,
    y: 60,
    z: 1
});
group.add(gradient);
group1.add(new Test(game, {}));
game.add([group, group1]);
console.log(game);

game.start();
