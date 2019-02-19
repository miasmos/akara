import { expect } from 'chai';
import 'mocha';
import { Component, ComponentType } from '../../src/components/Component';
import { Entity } from '../../src/entities/base/Entity';
import { EntityFactory } from '../../src/EntityFactory';

describe('Component', () => {
    it("should have it's type property set by default", () => {
        const result = new Component();
        expect(result.type).to.equal(ComponentType.Component);
    });

    describe('configure()', () => {
        it('should accept a type parameter', () => {
            const result = new Component();
            result.configure({
                type: ComponentType.Collider
            });
            expect(result.type).to.equal(ComponentType.Collider);
        });

        it('should set the type by default', () => {
            const result = new Component();
            result.configure({
                type: ComponentType.Collider
            });
            result.configure({});
            expect(result.type).to.equal(ComponentType.Component);
        });
    });

    describe('attach()', () => {
        it('should set the parent property to the given entity', () => {
            const game = EntityFactory.game({});
            const result = new Component();
            const result1 = EntityFactory.entity(game, {});
            result.attach(result1);
            expect(result.parent).to.not.be.a('undefined');
        });
    });

    describe('detach()', () => {
        it('should set the parent property to undefined', () => {
            const game = EntityFactory.game({});
            const result = new Component();
            const result1 = EntityFactory.entity(game, {});
            result.attach(result1);
            result.detach();
            expect(result.parent).to.be.a('undefined');
        });
    });
});
