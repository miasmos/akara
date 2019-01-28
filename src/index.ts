import { Game } from './entities/Game';
import { Environment } from './util/Environment';
import { Debug } from './util/Debug';
import { LoaderEvents } from './loader/Loader';
import { Asset } from './loader/assets/Asset';
import { Box } from './entities/Box';
import { HexCode } from './enum/HexCode';
import { Time } from './structs/Time';
import { Random } from './util/Random';

class Test extends Box {
    private direction: number = 1;

    public update(): void {
        if (this.x > this.game.width) {
            this.direction = -1;
        } else if (this.x + this.width < this.game.x) {
            this.direction = 1;
        }
        this.x += 1 * Time.Instance.deltaTime * this.direction;
    }
}

const game: Game = new Game({});
for (let index = 0; index < 2000; index++) {
    game.add(
        new Test(game, {
            x: Random.range(-400, 800),
            y: Random.range(-400, 800),
            width: 50,
            height: 50,
            backgroundColor: HexCode.Blue
        })
    );
}

Debug.log('test');
Debug.log(Debug.isDebug, Environment.isProduction());
game.load.image('assets/realestate.jpg');
game.load.sound('assets/test.mp3');
game.load.on(LoaderEvents.Load, (asset: Asset) => {
    console.log(asset);
});
console.log(game);

game.start();
