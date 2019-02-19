import { expect } from 'chai';
import 'mocha';
import { EntityFactory } from '../src/EntityFactory';
import { CameraManager } from '../src/CameraManager';
import { Camera } from '../src/entities/Camera';
import { Sizing } from '../src/enum/Sizing';

describe('CameraManager', () => {
    it('should resize active camera according to game size when active camera sizing is set to auto', () => {
        const game = EntityFactory.game({});
        const manager = new CameraManager(game);
        const camera = EntityFactory.camera(game, { sizing: Sizing.Auto });
        manager.active = camera;
        game.width = 5;
        game.height = 5;
        expect(camera.width).to.equal(5);
        expect(camera.height).to.equal(5);
    });

    it("should not resize active camera according to game size when it's sizing is set to manual", () => {
        const game = EntityFactory.game({});
        const manager = new CameraManager(game);
        const camera = EntityFactory.camera(game, { sizing: Sizing.Manual });
        manager.active = camera;
        game.width = 5;
        game.height = 5;
        expect(camera.width).to.equal(0);
        expect(camera.height).to.equal(0);
    });

    it('should unbind a formerly actively camera from game sizing', () => {
        const game = EntityFactory.game({});
        const manager = new CameraManager(game);
        const camera = EntityFactory.camera(game, { sizing: Sizing.Auto });
        manager.active = camera;
        const camera1 = EntityFactory.camera(game, { sizing: Sizing.Auto });
        manager.active = camera1;
        game.width = 5;
        game.height = 5;
        expect(camera.width).to.equal(0);
        expect(camera.height).to.equal(0);
    });

    describe('constructor()', () => {
        it('should set the game property', () => {
            const game = EntityFactory.game({});
            const result = new CameraManager(game);
            expect(result.game).to.not.be.a('undefined');
        });
    });

    describe('active()', () => {
        it('should set the active camera', () => {
            const game = EntityFactory.game({});
            const manager = new CameraManager(game);
            const camera = EntityFactory.camera(game, {});
            manager.active = camera;
            expect(manager.active).to.equal(camera);
        });
    });

    describe('add()', () => {
        it('should add a camera', () => {
            const game = EntityFactory.game({});
            const manager = new CameraManager(game);
            const camera = EntityFactory.camera(game, {});
            manager.add(camera);
            expect(manager.get(camera.id)).to.equal(camera);
        });
    });

    describe('remove()', () => {
        it('should remove a camera', () => {
            const game = EntityFactory.game({});
            const manager = new CameraManager(game);
            const camera = EntityFactory.camera(game, {});
            manager.add(camera);
            manager.remove(camera);
            expect(manager.get(camera.id)).to.be.a('undefined');
        });
    });
});
