import { EntityFactory } from './EntityFactory';
import { Game, IGameConfig } from './entities/Game';

interface IAkara {
    game(config: IGameConfig): Game;
}
export const Akara: IAkara = {
    game: EntityFactory.game
};

declare global {
    interface Window {
        Akara: IAkara;
    }
}
window.Akara = Akara;
