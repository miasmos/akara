import { Engine } from './Engine';
import { Debug, Environment } from './util';
import { Input } from './Input';
import * as mobx from 'mobx';

const engine: Engine = new Engine();
engine.start();

Debug.log('test');
Debug.log(Debug.isDebug, Environment.isProduction());
