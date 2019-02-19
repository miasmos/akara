import { expect } from 'chai';
import 'mocha';
import { Transform, TransformEvent } from '../../src/components/Transform';
import { ComponentType, ComponentEvent } from '../../src/components/Component';
import { Transform3, Transform3Event } from '../../src/structs/Transform3';
import { EntityFactory } from '../../src/EntityFactory';
import { Point3 } from '../../src/structs/Point3';
import { Point2 } from '../../src/structs/Point2';

describe('Transform', () => {
    describe('configure()', () => {
        it('should accept an x parameter', () => {
            const result = new Transform();
            result.configure({
                x: 1
            });
            expect(result.local.x).to.equal(1);
        });

        it('should set x to 0 by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.local.x).to.equal(0);
        });

        it('should accept a y parameter', () => {
            const result = new Transform();
            result.configure({
                y: 1
            });
            expect(result.local.y).to.equal(1);
        });

        it('should set y to 0 by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.local.y).to.equal(0);
        });

        it('should accept a z parameter', () => {
            const result = new Transform();
            result.configure({
                z: 1
            });
            expect(result.local.z).to.equal(1);
        });

        it('should set z to 0 by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.local.z).to.equal(0);
        });

        it('should accept a width parameter', () => {
            const result = new Transform();
            result.configure({
                width: 1
            });
            expect(result.local.width).to.equal(1);
        });

        it('should set width to 0 by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.local.width).to.equal(0);
        });

        it('should accept a height parameter', () => {
            const result = new Transform();
            result.configure({
                height: 1
            });
            expect(result.local.height).to.equal(1);
        });

        it('should set height to 0 by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.local.height).to.equal(0);
        });

        it('should accept a depth parameter', () => {
            const result = new Transform();
            result.configure({
                depth: 1
            });
            expect(result.local.depth).to.equal(1);
        });

        it('should set depth to 0 by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.local.depth).to.equal(0);
        });

        it('should accept a scaleX parameter', () => {
            const result = new Transform();
            result.configure({
                scaleX: 2
            });
            expect(result.local.scaleX).to.equal(2);
        });

        it('should set scaleX to 1 by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.local.scaleX).to.equal(1);
        });

        it('should accept a scaleY parameter', () => {
            const result = new Transform();
            result.configure({
                scaleY: 2
            });
            expect(result.local.scaleY).to.equal(2);
        });

        it('should set scaleY to 1 by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.local.scaleY).to.equal(1);
        });

        it('should accept a scaleZ parameter', () => {
            const result = new Transform();
            result.configure({
                scaleZ: 2
            });
            expect(result.local.scaleZ).to.equal(2);
        });

        it('should set scaleZ to 1 by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.local.scaleZ).to.equal(1);
        });

        it('should accept a pivotX parameter', () => {
            const result = new Transform();
            result.configure({
                pivotX: 1
            });
            expect(result.local.pivotX).to.equal(1);
        });

        it('should set pivotX to 0 by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.local.pivotX).to.equal(0);
        });

        it('should accept a pivotY parameter', () => {
            const result = new Transform();
            result.configure({
                pivotY: 1
            });
            expect(result.local.pivotY).to.equal(1);
        });

        it('should set pivotY to 0 by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.local.pivotY).to.equal(0);
        });

        it('should accept a rotateX parameter', () => {
            const result = new Transform();
            result.configure({
                rotateX: 1
            });
            expect(result.local.rotateX).to.equal(1);
        });

        it('should set rotateX to 0 by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.local.rotateX).to.equal(0);
        });

        it('should accept a rotateY parameter', () => {
            const result = new Transform();
            result.configure({
                rotateY: 1
            });
            expect(result.local.rotateY).to.equal(1);
        });

        it('should set rotateY to 0 by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.local.rotateY).to.equal(0);
        });

        it('should accept a rotateZ parameter', () => {
            const result = new Transform();
            result.configure({
                rotateZ: 1
            });
            expect(result.local.rotateZ).to.equal(1);
        });

        it('should set rotateZ to 0 by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.local.rotateZ).to.equal(0);
        });

        it('should accept a movable parameter', () => {
            const result = new Transform();
            result.configure({
                movable: false
            });
            expect(result.movable).to.equal(false);
        });

        it('should set movable to true by default', () => {
            const result = new Transform();
            result.configure({});
            expect(result.movable).to.equal(true);
        });

        it('should set the world transform', () => {
            const result = new Transform();
            result.configure({
                x: 1,
                y: 1,
                z: 1
            });
            expect(result.world.x).to.equal(1);
            expect(result.world.y).to.equal(1);
            expect(result.world.z).to.equal(1);
        });

        it('should set type to Transform', () => {
            const result = new Transform();
            result.configure({});
            expect(result.type).to.equal(ComponentType.Transform);
        });
    });

    describe('get world()', () => {
        it('should return the world transform', () => {
            const result = new Transform();
            result.configure({
                x: 1,
                y: 1,
                z: 1
            });
            expect(result.world.x).to.equal(1);
            expect(result.world.y).to.equal(1);
            expect(result.world.z).to.equal(1);
        });
    });

    describe('set world()', () => {
        it('should set the world transform', () => {
            const result = new Transform();
            result.configure({});
            result.world = new Transform3({
                x: 1,
                y: 1,
                z: 1
            });
            expect(result.world.x).to.equal(1);
            expect(result.world.y).to.equal(1);
            expect(result.world.z).to.equal(1);
        });
    });

    describe('get local()', () => {
        it('should return the local transform', () => {
            const result = new Transform();
            result.configure({
                x: 1,
                y: 1,
                z: 1
            });
            expect(result.local.x).to.equal(1);
            expect(result.local.y).to.equal(1);
            expect(result.local.z).to.equal(1);
        });
    });

    describe('set local()', () => {
        it('should set the local transform', () => {
            const result = new Transform();
            result.configure({});
            result.local = new Transform3({
                x: 1,
                y: 1,
                z: 1
            });
            expect(result.local.x).to.equal(1);
            expect(result.local.y).to.equal(1);
            expect(result.local.z).to.equal(1);
        });
    });

    describe('get scale()', () => {
        it('should return the scale', () => {
            const result = new Transform();
            result.configure({
                scaleX: 2,
                scaleY: 2,
                scaleZ: 2
            });
            expect(result.scale.x).to.equal(2);
            expect(result.scale.y).to.equal(2);
            expect(result.scale.z).to.equal(2);
        });
    });

    describe('set scale()', () => {
        it('should set the scale', () => {
            const result = new Transform();
            result.configure({});
            result.scale = new Point3(2, 2, 2);
            expect(result.scale.x).to.equal(2);
            expect(result.scale.y).to.equal(2);
            expect(result.scale.z).to.equal(2);
        });
    });

    describe('get rotation()', () => {
        it('should return the rotation', () => {
            const result = new Transform();
            result.configure({
                rotateX: 2,
                rotateY: 2,
                rotateZ: 2
            });
            expect(result.rotation.x).to.equal(2);
            expect(result.rotation.y).to.equal(2);
            expect(result.rotation.z).to.equal(2);
        });
    });

    describe('set rotation()', () => {
        it('should set the rotation', () => {
            const result = new Transform();
            result.configure({});
            result.rotation = new Point3(2, 2, 2);
            expect(result.rotation.x).to.equal(2);
            expect(result.rotation.y).to.equal(2);
            expect(result.rotation.z).to.equal(2);
        });
    });

    describe('get pivot()', () => {
        it('should return the pivot', () => {
            const result = new Transform();
            result.configure({
                pivotX: 1,
                pivotY: 1
            });
            expect(result.pivot.x).to.equal(1);
            expect(result.pivot.y).to.equal(1);
        });
    });

    describe('set pivot()', () => {
        it('should set the pivot', () => {
            const result = new Transform();
            result.configure({});
            result.pivot = new Point2(1, 1);
            expect(result.pivot.x).to.equal(1);
            expect(result.pivot.y).to.equal(1);
        });
    });

    describe('attach()', () => {
        it('should set the parent property to the given entity', () => {
            const game = EntityFactory.game({});
            const result = new Transform();
            const result1 = EntityFactory.box(game, {});
            result.attach(result1);
            expect(result.parent).to.not.be.a('undefined');
        });
    });

    describe('detach()', () => {
        it('should set the parent property to undefined', () => {
            const game = EntityFactory.game({});
            const result = new Transform();
            const result1 = EntityFactory.box(game, {});
            result.attach(result1);
            result.detach();
            expect(result.parent).to.be.a('undefined');
        });
    });

    describe('onTransformChange()', () => {
        it('should emit an event when width changes', done => {
            const result = new Transform();
            result.configure({});
            result.on(
                ComponentEvent.Transform,
                (
                    event: TransformEvent,
                    transform: Transform,
                    previous: number,
                    changed: Transform3Event
                ) => {
                    expect(changed).to.equal(Transform3Event.Width);
                    expect(previous).to.equal(0);
                    expect(transform.local.width).to.equal(1);
                    done();
                }
            );
            result.local.width = 1;
        }).timeout(10);

        it('should update world width when width changes', () => {
            const result = new Transform();
            result.configure({ width: 1 });
            expect(result.world.width).to.equal(1);
        });

        it('should emit an event when height changes', done => {
            const result = new Transform();
            result.configure({});
            result.on(
                ComponentEvent.Transform,
                (
                    event: TransformEvent,
                    transform: Transform,
                    previous: number,
                    changed: Transform3Event
                ) => {
                    expect(changed).to.equal(Transform3Event.Height);
                    expect(previous).to.equal(0);
                    expect(transform.local.height).to.equal(1);
                    done();
                }
            );
            result.local.height = 1;
        }).timeout(10);

        it('should update world height when height changes', () => {
            const result = new Transform();
            result.configure({ height: 1 });
            expect(result.world.height).to.equal(1);
        });

        it('should emit an event when depth changes', done => {
            const result = new Transform();
            result.configure({});
            result.on(
                ComponentEvent.Transform,
                (
                    event: TransformEvent,
                    transform: Transform,
                    previous: number,
                    changed: Transform3Event
                ) => {
                    expect(changed).to.equal(Transform3Event.Depth);
                    expect(previous).to.equal(0);
                    expect(transform.local.depth).to.equal(1);
                    done();
                }
            );
            result.local.depth = 1;
        }).timeout(10);

        it('should update world depth when depth changes', () => {
            const result = new Transform();
            result.configure({ depth: 1 });
            expect(result.world.depth).to.equal(1);
        });

        it('should emit an event when scaleX changes', done => {
            const result = new Transform();
            result.configure({});
            result.on(
                ComponentEvent.Transform,
                (
                    event: TransformEvent,
                    transform: Transform,
                    previous: number,
                    changed: Transform3Event
                ) => {
                    expect(changed).to.equal(Transform3Event.ScaleX);
                    expect(previous).to.equal(1);
                    expect(transform.local.scaleX).to.equal(2);
                    done();
                }
            );
            result.local.scaleX = 2;
        }).timeout(10);

        it('should update world scaleX when scaleX changes', () => {
            const result = new Transform();
            result.configure({ scaleX: 2 });
            expect(result.world.scaleX).to.equal(2);
        });

        it('should emit an event when scaleY changes', done => {
            const result = new Transform();
            result.configure({});
            result.on(
                ComponentEvent.Transform,
                (
                    event: TransformEvent,
                    transform: Transform,
                    previous: number,
                    changed: Transform3Event
                ) => {
                    expect(changed).to.equal(Transform3Event.ScaleY);
                    expect(previous).to.equal(1);
                    expect(transform.local.scaleY).to.equal(2);
                    done();
                }
            );
            result.local.scaleY = 2;
        }).timeout(10);

        it('should update world scaleY when scaleY changes', () => {
            const result = new Transform();
            result.configure({ scaleY: 2 });
            expect(result.world.scaleY).to.equal(2);
        });

        it('should emit an event when scaleZ changes', done => {
            const result = new Transform();
            result.configure({});
            result.on(
                ComponentEvent.Transform,
                (
                    event: TransformEvent,
                    transform: Transform,
                    previous: number,
                    changed: Transform3Event
                ) => {
                    expect(changed).to.equal(Transform3Event.ScaleZ);
                    expect(previous).to.equal(1);
                    expect(transform.local.scaleZ).to.equal(2);
                    done();
                }
            );
            result.local.scaleZ = 2;
        }).timeout(10);

        it('should update world scaleZ when scaleZ changes', () => {
            const result = new Transform();
            result.configure({ scaleZ: 2 });
            expect(result.world.scaleZ).to.equal(2);
        });

        it('should emit an event when pivotX changes', done => {
            const result = new Transform();
            result.configure({});
            result.on(
                ComponentEvent.Transform,
                (
                    event: TransformEvent,
                    transform: Transform,
                    previous: number,
                    changed: Transform3Event
                ) => {
                    expect(changed).to.equal(Transform3Event.PivotX);
                    expect(previous).to.equal(0);
                    expect(transform.local.pivotX).to.equal(1);
                    done();
                }
            );
            result.local.pivotX = 1;
        }).timeout(10);

        it('should update world pivotX when pivotX changes', () => {
            const result = new Transform();
            result.configure({ pivotX: 1 });
            expect(result.world.pivotX).to.equal(1);
        });

        it('should emit an event when pivotY changes', done => {
            const result = new Transform();
            result.configure({});
            result.on(
                ComponentEvent.Transform,
                (
                    event: TransformEvent,
                    transform: Transform,
                    previous: number,
                    changed: Transform3Event
                ) => {
                    expect(changed).to.equal(Transform3Event.PivotY);
                    expect(previous).to.equal(0);
                    expect(transform.local.pivotY).to.equal(1);
                    done();
                }
            );
            result.local.pivotY = 1;
        }).timeout(10);

        it('should update world pivotY when pivotY changes', () => {
            const result = new Transform();
            result.configure({ pivotY: 1 });
            expect(result.world.pivotY).to.equal(1);
        });

        it('should emit an event when rotateX changes', done => {
            const result = new Transform();
            result.configure({});
            result.on(
                ComponentEvent.Transform,
                (
                    event: TransformEvent,
                    transform: Transform,
                    previous: number,
                    changed: Transform3Event
                ) => {
                    expect(changed).to.equal(Transform3Event.RotateX);
                    expect(previous).to.equal(0);
                    expect(transform.local.rotateX).to.equal(1);
                    done();
                }
            );
            result.local.rotateX = 1;
        }).timeout(10);

        it('should update world rotateX when rotateX changes', () => {
            const result = new Transform();
            result.configure({ rotateX: 1 });
            expect(result.world.rotateX).to.equal(1);
        });

        it('should emit an event when rotateY changes', done => {
            const result = new Transform();
            result.configure({});
            result.on(
                ComponentEvent.Transform,
                (
                    event: TransformEvent,
                    transform: Transform,
                    previous: number,
                    changed: Transform3Event
                ) => {
                    expect(changed).to.equal(Transform3Event.RotateY);
                    expect(previous).to.equal(0);
                    expect(transform.local.rotateY).to.equal(1);
                    done();
                }
            );
            result.local.rotateY = 1;
        }).timeout(10);

        it('should update world rotateY when rotateY changes', () => {
            const result = new Transform();
            result.configure({ rotateY: 1 });
            expect(result.world.rotateY).to.equal(1);
        });

        it('should emit an event when rotateZ changes', done => {
            const result = new Transform();
            result.configure({});
            result.on(
                ComponentEvent.Transform,
                (
                    event: TransformEvent,
                    transform: Transform,
                    previous: number,
                    changed: Transform3Event
                ) => {
                    expect(changed).to.equal(Transform3Event.RotateZ);
                    expect(previous).to.equal(0);
                    expect(transform.local.rotateZ).to.equal(1);
                    done();
                }
            );
            result.local.rotateZ = 1;
        }).timeout(10);

        it('should update world rotateZ when rotateZ changes', () => {
            const result = new Transform();
            result.configure({ rotateZ: 1 });
            expect(result.world.rotateZ).to.equal(1);
        });
    });
});
