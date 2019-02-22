import { expect, assert } from 'chai';
import 'mocha';
import { ComponentManager, ComponentManagerEvent } from '../src/ComponentManager';
import { ComponentType, Component } from '../src/components/Component';
import { ComponentFactory } from '../src/ComponentFactory';
import { EntityFactory } from '../src/EntityFactory';
import { Collider } from '../src/components/Collider';
import { Game } from '../src/entities/Game';

describe('ComponentManager()', () => {
    describe('configure()', () => {
        it('should accept a game parameter', () => {
            const manager = new ComponentManager();
            const result = manager.configure({
                game: EntityFactory.game({})
            });
            expect(manager.game instanceof Game).to.equal(true);
        });
    });

    describe('get()', () => {
        it("should return undefined if the type doesn't exist", () => {
            const manager = new ComponentManager();
            const result = manager.get(ComponentType.Collider);
            expect(result).to.be.a('undefined');
        });

        it('should return a given component type', () => {
            const game = EntityFactory.game({});
            const manager = new ComponentManager();
            manager.add(ComponentFactory.get(game, ComponentType.Collider, {}));
            const result = manager.get(ComponentType.Collider);
            expect(result instanceof Collider).to.equal(true);
        });
    });

    describe('has()', () => {
        it('should return true if component exists', () => {
            const game = EntityFactory.game({});
            const manager = new ComponentManager();
            manager.add(ComponentFactory.get(game, ComponentType.Collider, {}));
            const result = manager.has(ComponentType.Collider);
            expect(result).to.equal(true);
        });

        it('should return false if component does not exist', () => {
            const game = EntityFactory.game({});
            const manager = new ComponentManager();
            const result = manager.has(ComponentType.Collider);
            expect(result).to.equal(false);
        });
    });

    describe('add()', () => {
        it('should add a component given a ComponentType', () => {
            const game = EntityFactory.game({});
            const manager = new ComponentManager();
            manager.configure(game);
            const result = manager.add(ComponentType.Collider);
            expect(result instanceof Collider).to.equal(true);
        });

        it('should add a component given a Component', () => {
            const game = EntityFactory.game({});
            const manager = new ComponentManager();
            const result = manager.add(ComponentFactory.get(game, ComponentType.Collider, {}));
            expect(result instanceof Collider).to.equal(true);
        });

        it('should return false if Component already exists', () => {
            const game = EntityFactory.game({});
            const manager = new ComponentManager();
            manager.configure(game);
            manager.add(ComponentType.Collider);
            const result = manager.add(ComponentType.Collider);
            expect(result).to.equal(false);
        });

        it('should emit an event on successful add', done => {
            const game = EntityFactory.game({});
            const manager = new ComponentManager();
            manager.configure(game);
            manager.on(ComponentManagerEvent.Add, (type: ComponentType, component: Component) => {
                done();
            });
            manager.add(ComponentType.Collider);
        }).timeout(10);

        it('should not emit an event when add fails', () => {
            const game = EntityFactory.game({});
            const manager = new ComponentManager();
            manager.configure(game);
            manager.add(ComponentType.Collider);
            manager.on(ComponentManagerEvent.Add, (type: ComponentType, component: Component) => {
                assert.fail();
            });
            manager.add(ComponentType.Collider);
        });
    });

    describe('remove()', () => {
        it('should remove a component given a ComponentType', () => {
            const game = EntityFactory.game({});
            const manager = new ComponentManager();
            manager.configure(game);
            manager.add(ComponentType.Collider);
            manager.remove(ComponentType.Collider);
            expect(manager.has(ComponentType.Collider)).to.equal(false);
        });

        it('should remove a component given a Component', () => {
            const game = EntityFactory.game({});
            const manager = new ComponentManager();
            const component = ComponentFactory.get(game, ComponentType.Collider, {});
            manager.add(component);
            manager.remove(component);
            expect(manager.has(ComponentType.Collider)).to.equal(false);
        });

        it("should return false if Component didn't exist", () => {
            const game = EntityFactory.game({});
            const manager = new ComponentManager();
            manager.configure(game);
            const result = manager.remove(ComponentType.Collider);
            expect(result).to.equal(false);
        });

        it('should emit an event on successful removal', done => {
            const game = EntityFactory.game({});
            const manager = new ComponentManager();
            manager.configure(game);
            manager.on(
                ComponentManagerEvent.Remove,
                (type: ComponentType, component: Component) => {
                    done();
                }
            );
            manager.add(ComponentType.Collider);
            manager.remove(ComponentType.Collider);
        });

        it('should not emit an event when removal fails', () => {
            const game = EntityFactory.game({});
            const manager = new ComponentManager();
            manager.configure(game);
            manager.on(
                ComponentManagerEvent.Remove,
                (type: ComponentType, component: Component) => {
                    assert.fail();
                }
            );
            manager.remove(ComponentType.Collider);
        });
    });
});
