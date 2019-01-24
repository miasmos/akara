import { Engine } from './Engine';
import { Environment } from './util/Environment';
import { Debug } from './util/Debug';
import { Input } from './Input';
import * as mobx from 'mobx';
import { Loader, LoaderEvents, Asset } from './Loader';

const engine: Engine = new Engine();
engine.start();

Debug.log('test');
Debug.log(Debug.isDebug, Environment.isProduction());
const load: Loader = new Loader();
load.image('assets/realestate.jpg');
load.on(LoaderEvents.Load, (asset: Asset) => {
    console.log(asset);
});
load.start();
