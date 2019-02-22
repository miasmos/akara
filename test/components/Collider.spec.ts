import { expect } from 'chai';
import 'mocha';
import { ComponentType } from '../../src/components/Component';
import { Entity } from '../../src/entities/base/Entity';
import { EntityFactory } from '../../src/EntityFactory';
import { Collider } from '../../src/components/Collider';
import { Game } from '../../src/entities/Game';

describe('Collider', () => {
    it("should have it's type property set by default", () => {
        const result = new Collider();
        expect(result.type).to.equal(ComponentType.Component);
    });

    describe('configure()', () => {
        it('should accept a collidable parameter', () => {
            const result = new Collider();
            result.configure({
                collidable: false
            });
            expect(result.collidable).to.equal(false);
        });

        it('should set collidable to true by default', () => {
            const result = new Collider();
            result.configure({});
            expect(result.collidable).to.equal(true);
        });
    });

    describe('addCollision()', () => {
        it('should return true if entity was added', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            result.attach(EntityFactory.box(game, {}));
            const result1 = EntityFactory.box(game, {});
            const result2 = result.addCollision(result1);
            expect(result2).to.equal(true);
        });

        it('should return false if entity already exists', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            result.attach(EntityFactory.box(game, {}));

            const result1 = EntityFactory.box(game, {});
            result.addCollision(result1);
            const result2 = result.addCollision(result1);
            expect(result2).to.equal(false);
        });

        it('should return false if parent is not set', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            const result1 = result.addCollision(EntityFactory.box(game, {}));
            expect(result1).to.equal(false);
        });

        it('should return false if supplied entity is our parent', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            const entity = EntityFactory.box(game, {});
            result.attach(entity);
            const result1 = result.addCollision(entity);
            expect(result1).to.equal(false);
        });
    });

    describe('removeCollision()', () => {
        it('should return true if entity was removed', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            result.attach(EntityFactory.box(game, {}));
            const entity = EntityFactory.box(game, {});
            result.addCollision(entity);
            const result1 = result.removeCollision(entity);
            expect(result1).to.equal(true);
        });

        it('should return false if entity is not added', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            result.attach(EntityFactory.box(game, {}));

            const result1 = EntityFactory.box(game, {});
            const result2 = result.removeCollision(result1);
            expect(result2).to.equal(false);
        });

        it('should return false if parent is not set', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            const entity = EntityFactory.box(game, {});
            const result1 = result.removeCollision(entity);
            expect(result1).to.equal(false);
        });

        it('should return false if supplied entity is our parent', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            const entity = EntityFactory.box(game, {});
            result.attach(entity);
            const result1 = result.removeCollision(entity);
            expect(result1).to.equal(false);
        });
    });

    describe('hasCollision()', () => {
        it('should return true if collision exists', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            const entity = EntityFactory.box(game, {});
            result.attach(entity);

            const collidedEntity = EntityFactory.box(game, {});
            result.addCollision(collidedEntity);
            const result1 = result.hasCollision(collidedEntity);
            expect(result1).to.equal(true);
        });
    });

    describe('test2()', () => {
        it('should return false if parent is not set', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            const entity = EntityFactory.box(game, {});
            const result1 = result.test2(entity);
            expect(result1).to.equal(false);
        });

        it('should return false if parent is not collidable', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            result.attach(EntityFactory.entity(game, {}));
            const entity = EntityFactory.box(game, { collidable: true });
            const result1 = result.test2(entity);
            expect(result1).to.equal(false);
        });

        it('should return false if supplied entity is not collidable', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            result.attach(EntityFactory.box(game, { collidable: true }));
            const entity = EntityFactory.entity(game, {});
            const result1 = result.test2(entity);
            expect(result1).to.equal(false);
        });

        it('should return true if parent and supplied entity overlap in 2d space', () => {
            const game = EntityFactory.game({});
            const entity1 = EntityFactory.box(game, {
                x: 5,
                y: 0,
                width: 10,
                height: 10
            });
            const entity2 = EntityFactory.box(game, {
                x: 0,
                y: 0,
                width: 10,
                height: 10
            });
            if (entity1.collider) {
                const result1 = entity1.collider.test2(entity2);
                expect(result1).to.equal(true);
            }
        });
    });

    describe('test3()', () => {
        it('should return false if parent is not set', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            const entity = EntityFactory.box(game, {});
            const result1 = result.test3(entity);
            expect(result1).to.equal(false);
        });

        it('should return false if parent is not collidable', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            result.attach(EntityFactory.entity(game, {}));
            const entity = EntityFactory.box(game, { collidable: true });
            const result1 = result.test3(entity);
            expect(result1).to.equal(false);
        });

        it('should return false if supplied entity is not collidable', () => {
            const result = new Collider();
            const game = EntityFactory.game({});
            result.attach(EntityFactory.box(game, { collidable: true }));
            const entity = EntityFactory.entity(game, {});
            const result1 = result.test3(entity);
            expect(result1).to.equal(false);
        });

        it('should return true if parent and supplied entity overlap in 3d space', () => {
            const game = EntityFactory.game({});
            const entity1 = EntityFactory.box(game, {
                x: 5,
                y: 0,
                z: 0,
                width: 10,
                height: 10,
                depth: 10
            });
            const entity2 = EntityFactory.box(game, {
                x: 0,
                y: 0,
                z: 0,
                width: 10,
                height: 10,
                depth: 10
            });
            if (entity1.collider) {
                const result1 = entity1.collider.test3(entity2);
                expect(result1).to.equal(true);
            }
        });
    });

    describe('attach()', () => {
        it('should set the parent property to the given entity', () => {
            const game = EntityFactory.game({});
            const result = new Collider();
            const result1 = EntityFactory.box(game, {});
            result.attach(result1);
            expect(result.parent).to.not.be.a('undefined');
        });
    });

    describe('detach()', () => {
        it('should set the parent property to undefined', () => {
            const game = EntityFactory.game({});
            const result = new Collider();
            const result1 = EntityFactory.box(game, {});
            result.attach(result1);
            result.detach();
            expect(result.parent).to.be.a('undefined');
        });
    });
});
