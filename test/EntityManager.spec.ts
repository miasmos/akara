import { expect, assert } from 'chai';
import 'mocha';
import { EntityManager } from '../src/EntityManager';
import { EntityFactory } from '../src/EntityFactory';
import { EntityType } from '../src/entities/base/IEntity';

describe('EntityManager', () => {
    it("should update an entity if it's tag changes", () => {
        const game = EntityFactory.game({});
        const manager = new EntityManager();
        const entity = EntityFactory.box(game, { tag: 'test' });
        manager.add(entity);
        entity.tag = 'test1';
        expect(manager.getTag('test1').length).to.equal(1);
        expect(manager.getTag('test').length).to.equal(0);
    });

    describe('add()', () => {
        it('should add an Entity', () => {
            const game = EntityFactory.game({});
            const manager = new EntityManager();
            const entity = EntityFactory.entity(game, {});
            manager.add(entity);
            expect(manager.get(entity.id)).to.equal(entity);
        });

        it('should return true when an Entity is added', () => {
            const game = EntityFactory.game({});
            const manager = new EntityManager();
            const entity = EntityFactory.entity(game, {});
            const result = manager.add(entity);
            expect(result).to.equal(true);
        });

        it('should return false when an Entity is not added', () => {
            const game = EntityFactory.game({});
            const manager = new EntityManager();
            const entity = EntityFactory.entity(game, {});
            manager.add(entity);
            const result = manager.add(entity);
            expect(result).to.equal(false);
        });
    });

    describe('remove()', () => {
        it('should remove an Entity', () => {
            const game = EntityFactory.game({});
            const manager = new EntityManager();
            const entity = EntityFactory.box(game, {});
            manager.add(entity);
            manager.remove(entity);
            expect(manager.get(entity.id)).to.equal(undefined);
        });

        it('should return true when an Entity is removed', () => {
            const game = EntityFactory.game({});
            const manager = new EntityManager();
            const entity = EntityFactory.entity(game, {});
            manager.add(entity);
            const result = manager.remove(entity);
            expect(result).to.equal(true);
        });

        it('should return false when an Entity is not removed', () => {
            const game = EntityFactory.game({});
            const manager = new EntityManager();
            const entity = EntityFactory.entity(game, {});
            const result = manager.remove(entity);
            expect(result).to.equal(false);
        });
    });

    describe('clear()', () => {
        it('should clear all entities', () => {
            const game = EntityFactory.game({});
            const manager = new EntityManager();
            const entity = EntityFactory.entity(game, {});
            manager.add(entity);
            manager.clear();
            expect(manager.count).to.equal(0);
        });
    });

    describe('get()', () => {
        it('should return an entity with the supplied id', () => {
            const game = EntityFactory.game({});
            const manager = new EntityManager();
            const entity = EntityFactory.entity(game, {});
            manager.add(entity);
            expect(manager.get(entity.id)).to.equal(entity);
        });

        it('should return undefined when the entity is not found', () => {
            const manager = new EntityManager();
            expect(manager.get('test')).to.equal(undefined);
        });
    });

    describe('getTag()', () => {
        it('should return all entities with the supplied tag', () => {
            const game = EntityFactory.game({});
            const manager = new EntityManager();
            manager.add(EntityFactory.entity(game, { tag: 'test' }));
            manager.add(EntityFactory.entity(game, { tag: 'test1' }));
            expect(manager.getTag('test').length).to.equal(1);
        });

        it('should return an empty array if the supplied tag does not exist', () => {
            const manager = new EntityManager();
            expect(manager.getTag('test').length).to.equal(0);
        });
    });

    describe('getType()', () => {
        it('should return all entities with the supplied type', () => {
            const game = EntityFactory.game({});
            const manager = new EntityManager();
            manager.add(EntityFactory.entity(game, {}));
            manager.add(EntityFactory.box(game, {}));
            expect(manager.getType(EntityType.Box).length).to.equal(1);
        });

        it('should return an empty array if the supplied type does not exist', () => {
            const manager = new EntityManager();
            expect(manager.getType(EntityType.Box).length).to.equal(0);
        });
    });
});
