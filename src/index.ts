import { Engine } from './Engine';
import { Logger, Debug, Environment } from './util';
import * as mobx from 'mobx';

const engine: Engine = new Engine();
engine.start();

Logger.log('test');
Logger.log(Debug.isDebug, Environment.isProduction());
