import { expect, assert } from 'chai';
import 'mocha';
import { ComponentFactory } from '../src/ComponentFactory';
import { EntityFactory } from '../src/EntityFactory';
import { Collider } from '../src/components/Collider';
import { Transform } from '../src/components/Transform';
import { ComponentType, Component } from '../src/components/Component';

describe('ComponentFactory', () => {
    describe('configure()', () => {
        it('should set accept a game parameter', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            expect(factory.game).to.not.be.a('undefined');
        });
    });

    describe('get()', () => {
        it('should return a transform', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const component: Transform = factory.get(ComponentType.Transform, {}) as Transform;
            expect(component instanceof Transform).to.equal(true);
        });

        it('should accept a transform config', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const component: Transform = factory.get(ComponentType.Transform, {
                movable: false
            }) as Transform;
            expect(component.movable).to.equal(false);
        });

        it('should return a collider', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const component: Collider = factory.get(ComponentType.Collider, {}) as Collider;
            expect(component instanceof Collider).to.equal(true);
        });

        it('should accept a collider config', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const component: Collider = factory.get(ComponentType.Collider, {
                collidable: false
            }) as Collider;
            expect(component.collidable).to.equal(false);
        });

        it('should return a component', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const component: Component = factory.get(ComponentType.Component, {}) as Component;
            expect(component instanceof Component).to.equal(true);
        });

        it('should accept a component config', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const component: Collider = factory.get(ComponentType.Collider, {
                type: ComponentType.Collider
            }) as Collider;
            expect(component.type).to.equal(ComponentType.Collider);
        });
    });

    describe('static get()', () => {
        it('should return a transform', () => {
            const game = EntityFactory.game({});
            const component: Transform = ComponentFactory.get(
                game,
                ComponentType.Transform,
                {}
            ) as Transform;
            expect(component instanceof Transform).to.equal(true);
        });

        it('should accept a transform config', () => {
            const game = EntityFactory.game({});
            const component: Transform = ComponentFactory.get(game, ComponentType.Transform, {
                movable: false
            }) as Transform;
            expect(component.movable).to.equal(false);
        });

        it('should return a collider', () => {
            const game = EntityFactory.game({});
            const component: Collider = ComponentFactory.get(
                game,
                ComponentType.Collider,
                {}
            ) as Collider;
            expect(component instanceof Collider).to.equal(true);
        });

        it('should accept a collider config', () => {
            const game = EntityFactory.game({});
            const component: Collider = ComponentFactory.get(game, ComponentType.Collider, {
                collidable: false
            }) as Collider;
            expect(component.collidable).to.equal(false);
        });

        it('should return a component', () => {
            const game = EntityFactory.game({});
            const component: Component = ComponentFactory.get(
                game,
                ComponentType.Component,
                {}
            ) as Component;
            expect(component instanceof Component).to.equal(true);
        });

        it('should accept a component config', () => {
            const game = EntityFactory.game({});
            const component: Component = ComponentFactory.get(game, ComponentType.Component, {
                type: ComponentType.Collider
            }) as Component;
            expect(component.type).to.equal(ComponentType.Collider);
        });
    });

    describe('collider()', () => {
        it('should return a collider', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const result = factory.collider({});
            expect(result instanceof Collider).to.equal(true);
        });

        it('should set the game property', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const result = factory.collider({});
            expect(result.game).to.not.be.a('undefined');
        });

        it('should accept a config', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const result = factory.collider({
                collidable: false
            });
            expect(result.collidable).to.equal(false);
        });
    });

    describe('static collider()', () => {
        it('should return a collider', () => {
            const game = EntityFactory.game({});
            const result = ComponentFactory.collider(game, {});
            expect(result instanceof Collider).to.equal(true);
        });

        it('should set the game property', () => {
            const game = EntityFactory.game({});
            const result = ComponentFactory.collider(game, {});
            expect(result.game).to.not.be.a('undefined');
        });

        it('should accept a config', () => {
            const game = EntityFactory.game({});
            const result = ComponentFactory.collider(game, { collidable: false });
            expect(result.collidable).to.equal(false);
        });
    });

    describe('transform()', () => {
        it('should return a transform', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const result = factory.transform({});
            expect(result instanceof Transform).to.equal(true);
        });

        it('should set the game property', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const result = factory.transform({});
            expect(result.game).to.not.be.a('undefined');
        });

        it('should accept a config', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const result = factory.transform({
                movable: false
            });
            expect(result.movable).to.equal(false);
        });
    });

    describe('static transform()', () => {
        it('should return a transform', () => {
            const game = EntityFactory.game({});
            const result = ComponentFactory.transform(game, {});
            expect(result instanceof Transform).to.equal(true);
        });

        it('should set the game property', () => {
            const game = EntityFactory.game({});
            const result = ComponentFactory.transform(game, {});
            expect(result.game).to.not.be.a('undefined');
        });

        it('should accept a config', () => {
            const game = EntityFactory.game({});
            const result = ComponentFactory.transform(game, { movable: false });
            expect(result.movable).to.equal(false);
        });
    });

    describe('component()', () => {
        it('should return a component', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const result = factory.component({});
            expect(result instanceof Component).to.equal(true);
        });

        it('should set the game property', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const result = factory.component({});
            expect(result.game).to.not.be.a('undefined');
        });

        it('should accept a config', () => {
            const game = EntityFactory.game({});
            const factory = new ComponentFactory();
            factory.configure({ game });
            const result = factory.component({
                type: ComponentType.Collider
            });
            expect(result.type).to.equal(ComponentType.Collider);
        });
    });

    describe('static component()', () => {
        it('should return a component', () => {
            const game = EntityFactory.game({});
            const result = ComponentFactory.component(game, {});
            expect(result instanceof Component).to.equal(true);
        });

        it('should set the game property', () => {
            const game = EntityFactory.game({});
            const result = ComponentFactory.component(game, {});
            expect(result.game).to.not.be.a('undefined');
        });

        it('should accept a config', () => {
            const game = EntityFactory.game({});
            const result = ComponentFactory.component(game, { type: ComponentType.Collider });
            expect(result.type).to.equal(ComponentType.Collider);
        });
    });
});
