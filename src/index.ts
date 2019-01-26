import { Game } from './entities/Game';
import { Environment } from './util/Environment';
import { Debug } from './util/Debug';
import { LoaderEvents } from './loader/Loader';
import { Asset } from './loader/assets/Asset';

const game: Game = new Game({});
game.start();

Debug.log('test');
Debug.log(Debug.isDebug, Environment.isProduction());
game.load.image('assets/realestate.jpg');
game.load.sound('assets/test.mp3');
game.load.on(LoaderEvents.Load, (asset: Asset) => {
    console.log(asset);
});
