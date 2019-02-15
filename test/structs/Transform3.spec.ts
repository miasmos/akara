import { Transform3, Transform3Event } from '../../src/structs/Transform3';
import { expect } from 'chai';
import 'mocha';
import { Point3 } from '../../src/structs/Point3';
import { Pivot2 } from '../../src/structs/Pivot2';
import { Size3 } from '../../src/structs/Size3';

describe('Transform3', () => {
    describe('constructor()', () => {
        it('should accept an x parameter', () => {
            const result = new Transform3({
                x: 1
            });
            expect(result.x).to.equal(1);
        });

        it('should accept a y parameter', () => {
            const result = new Transform3({
                y: 1
            });
            expect(result.y).to.equal(1);
        });

        it('should accept a z parameter', () => {
            const result = new Transform3({
                z: 1
            });
            expect(result.z).to.equal(1);
        });

        it('should accept a width parameter', () => {
            const result = new Transform3({
                width: 1
            });
            expect(result.width).to.equal(1);
        });

        it('should accept a height parameter', () => {
            const result = new Transform3({
                height: 1
            });
            expect(result.height).to.equal(1);
        });

        it('should accept a depth parameter', () => {
            const result = new Transform3({
                depth: 1
            });
            expect(result.depth).to.equal(1);
        });

        it('should accept a scaleX parameter', () => {
            const result = new Transform3({
                scaleX: 1
            });
            expect(result.scaleX).to.equal(1);
        });

        it('should accept a scaleY parameter', () => {
            const result = new Transform3({
                scaleY: 1
            });
            expect(result.scaleY).to.equal(1);
        });

        it('should accept a scaleZ parameter', () => {
            const result = new Transform3({
                scaleZ: 1
            });
            expect(result.scaleZ).to.equal(1);
        });

        it('should accept a rotateX parameter', () => {
            const result = new Transform3({
                rotateX: 1
            });
            expect(result.rotateX).to.equal(1);
        });

        it('should accept a rotateY parameter', () => {
            const result = new Transform3({
                rotateY: 1
            });
            expect(result.rotateY).to.equal(1);
        });

        it('should accept a rotateZ parameter', () => {
            const result = new Transform3({
                rotateZ: 1
            });
            expect(result.rotateZ).to.equal(1);
        });

        it('should accept a pivotX parameter', () => {
            const result = new Transform3({
                pivotX: 1
            });
            expect(result.pivotX).to.equal(1);
        });

        it('should accept a pivotY parameter', () => {
            const result = new Transform3({
                pivotY: 1
            });
            expect(result.pivotY).to.equal(1);
        });
    });

    describe('rotation', () => {
        it('should be set as a result of the constructor', () => {
            const result = new Transform3({
                rotateX: 1,
                rotateY: 1,
                rotateZ: 1
            });
            expect(result.rotation.x).to.equal(1);
            expect(result.rotation.y).to.equal(1);
            expect(result.rotation.z).to.equal(1);
        });

        it('should accept a Point3 to be set to', () => {
            const result = new Transform3({});
            result.rotation = new Point3(1, 1, 1);
            expect(result.rotation.x).to.equal(1);
            expect(result.rotation.y).to.equal(1);
            expect(result.rotation.z).to.equal(1);
        });
    });

    describe('origin', () => {
        it('should accept a Point3 to be set to', () => {
            const result = new Transform3({});
            result.origin = new Point3(1, 1, 1);
            expect(result.x).to.equal(1);
            expect(result.y).to.equal(1);
            expect(result.z).to.equal(1);
        });

        it('should return Point3 of x,y,z', () => {
            const result = new Transform3({ x: 1, y: 1, z: 1 });
            expect(result.origin.x).to.equal(1);
            expect(result.origin.y).to.equal(1);
            expect(result.origin.z).to.equal(1);
        });
    });

    describe('size', () => {
        it('should accept a Size3 to be set to', () => {
            const result = new Transform3({});
            result.size = new Size3(1, 1, 1);
            expect(result.width).to.equal(1);
            expect(result.height).to.equal(1);
            expect(result.depth).to.equal(1);
        });
    });

    describe('pivot', () => {
        it('should accept a Pivot2 to be set to', () => {
            const result = new Transform3({});
            result.pivot = new Pivot2(1, 1);
            expect(result.pivotX).to.equal(1);
            expect(result.pivotY).to.equal(1);
        });
    });

    describe('scale', () => {
        it('should accept a Point3 to be set to', () => {
            const result = new Transform3({});
            result.scale = new Point3(1, 1, 1);
            expect(result.scaleX).to.equal(1);
            expect(result.scaleY).to.equal(1);
        });
    });

    describe('x', () => {
        it('should set x value', () => {
            const result = new Transform3({});
            result.x = 1;
            expect(result.x).to.equal(1);
        });

        it('should emit an event', done => {
            const result = new Transform3({});
            result.on(Transform3Event.X, (previous: number) => {
                expect(previous).to.equal(0);
                done();
            });
            result.x = 1;
        }).timeout(10);
    });

    describe('y', () => {
        it('should set y value', () => {
            const result = new Transform3({});
            result.y = 1;
            expect(result.y).to.equal(1);
        });

        it('should emit an event', done => {
            const result = new Transform3({});
            result.on(Transform3Event.Y, (previous: number) => {
                expect(previous).to.equal(0);
                done();
            });
            result.y = 1;
        }).timeout(10);
    });

    describe('z', () => {
        it('should set z value', () => {
            const result = new Transform3({});
            result.z = 1;
            expect(result.z).to.equal(1);
        });

        it('should emit an event', done => {
            const result = new Transform3({});
            result.on(Transform3Event.Z, (previous: number) => {
                expect(previous).to.equal(0);
                done();
            });
            result.z = 1;
        }).timeout(10);
    });

    describe('width', () => {
        it('should set width value', () => {
            const result = new Transform3({});
            result.width = 1;
            expect(result.width).to.equal(1);
        });

        it('should emit an event', done => {
            const result = new Transform3({});
            result.on(Transform3Event.Width, (previous: number) => {
                expect(previous).to.equal(0);
                done();
            });
            result.width = 1;
        }).timeout(10);
    });

    describe('height', () => {
        it('should set height value', () => {
            const result = new Transform3({});
            result.height = 1;
            expect(result.height).to.equal(1);
        });

        it('should emit an event', done => {
            const result = new Transform3({});
            result.on(Transform3Event.Height, (previous: number) => {
                expect(previous).to.equal(0);
                done();
            });
            result.height = 1;
        }).timeout(10);
    });

    describe('depth', () => {
        it('should set depth value', () => {
            const result = new Transform3({});
            result.depth = 1;
            expect(result.depth).to.equal(1);
        });

        it('should emit an event', done => {
            const result = new Transform3({});
            result.on(Transform3Event.Depth, (previous: number) => {
                expect(previous).to.equal(0);
                done();
            });
            result.depth = 1;
        }).timeout(10);
    });

    describe('scaleX', () => {
        it('should set scaleX value', () => {
            const result = new Transform3({});
            result.scaleX = 2;
            expect(result.scaleX).to.equal(2);
        });

        it('should emit an event', done => {
            const result = new Transform3({});
            result.on(Transform3Event.ScaleX, (previous: number) => {
                expect(previous).to.equal(1);
                done();
            });
            result.scaleX = 2;
        }).timeout(10);
    });

    describe('scaleY', () => {
        it('should set scaleY value', () => {
            const result = new Transform3({});
            result.scaleY = 2;
            expect(result.scaleY).to.equal(2);
        });

        it('should emit an event', done => {
            const result = new Transform3({});
            result.on(Transform3Event.ScaleY, (previous: number) => {
                expect(previous).to.equal(1);
                done();
            });
            result.scaleY = 2;
        }).timeout(10);
    });

    describe('scaleZ', () => {
        it('should set scaleZ value', () => {
            const result = new Transform3({});
            result.scaleZ = 2;
            expect(result.scaleZ).to.equal(2);
        });

        it('should emit an event', done => {
            const result = new Transform3({});
            result.on(Transform3Event.ScaleZ, (previous: number) => {
                expect(previous).to.equal(1);
                done();
            });
            result.scaleZ = 2;
        }).timeout(10);
    });

    describe('pivotX', () => {
        it('should set pivotX value', () => {
            const result = new Transform3({});
            result.pivotX = 1;
            expect(result.pivotX).to.equal(1);
        });

        it('should emit an event', done => {
            const result = new Transform3({});
            result.on(Transform3Event.PivotX, (previous: number) => {
                expect(previous).to.equal(0);
                done();
            });
            result.pivotX = 1;
        }).timeout(10);
    });

    describe('pivotY', () => {
        it('should set pivotY value', () => {
            const result = new Transform3({});
            result.pivotY = 1;
            expect(result.pivotY).to.equal(1);
        });

        it('should emit an event', done => {
            const result = new Transform3({});
            result.on(Transform3Event.PivotY, (previous: number) => {
                expect(previous).to.equal(0);
                done();
            });
            result.pivotY = 1;
        }).timeout(10);
    });

    describe('rotateX', () => {
        it('should set rotateX value', () => {
            const result = new Transform3({});
            result.rotateX = 1;
            expect(result.rotateX).to.equal(1);
        });

        it('should emit an event', done => {
            const result = new Transform3({});
            result.on(Transform3Event.RotateX, (previous: number) => {
                expect(previous).to.equal(0);
                done();
            });
            result.rotateX = 1;
        }).timeout(10);
    });

    describe('rotateY', () => {
        it('should set rotateY value', () => {
            const result = new Transform3({});
            result.rotateY = 1;
            expect(result.rotateY).to.equal(1);
        });

        it('should emit an event', done => {
            const result = new Transform3({});
            result.on(Transform3Event.RotateY, (previous: number) => {
                expect(previous).to.equal(0);
                done();
            });
            result.rotateY = 1;
        }).timeout(10);
    });

    describe('rotateZ', () => {
        it('should set rotateZ value', () => {
            const result = new Transform3({});
            result.rotateZ = 1;
            expect(result.rotateZ).to.equal(1);
        });

        it('should emit an event', done => {
            const result = new Transform3({});
            result.on(Transform3Event.RotateZ, (previous: number) => {
                expect(previous).to.equal(0);
                done();
            });
            result.rotateZ = 1;
        }).timeout(10);
    });

    describe('add()', () => {
        it('should add x,y,z,width,height,depth', () => {
            let result = new Transform3({
                x: 1,
                y: 1,
                z: 1,
                width: 1,
                height: 1,
                depth: 1
            });
            result = result.add(
                new Transform3({
                    x: 1,
                    y: 1,
                    z: 1,
                    width: 1,
                    height: 1,
                    depth: 1
                })
            );
            expect(result.x).to.equal(2);
            expect(result.y).to.equal(2);
            expect(result.z).to.equal(2);
            expect(result.width).to.equal(2);
            expect(result.height).to.equal(2);
            expect(result.depth).to.equal(2);
        });

        it('should retain scaleX,scaleY,scaleZ', () => {
            const result = new Transform3({
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1
            });
            result.add(
                new Transform3({
                    scaleX: 1,
                    scaleY: 1,
                    scaleZ: 1
                })
            );
            expect(result.scaleX).to.equal(1);
            expect(result.scaleY).to.equal(1);
            expect(result.scaleZ).to.equal(1);
        });
    });

    describe('static add()', () => {
        it('should add x,y,z,width,height,depth', () => {
            const result = new Transform3({
                x: 1,
                y: 1,
                z: 1,
                width: 1,
                height: 1,
                depth: 1
            });
            const result1 = new Transform3({
                x: 1,
                y: 1,
                z: 1,
                width: 1,
                height: 1,
                depth: 1
            });
            const result2 = Transform3.add(result, result1);
            expect(result2.x).to.equal(2);
            expect(result2.y).to.equal(2);
            expect(result2.z).to.equal(2);
            expect(result2.width).to.equal(2);
            expect(result2.height).to.equal(2);
            expect(result2.depth).to.equal(2);
        });

        it('should retain scaleX,scaleY,scaleZ', () => {
            const result = new Transform3({
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1
            });
            const result1 = new Transform3({
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1
            });
            const result2 = Transform3.add(result, result1);
            expect(result.scaleX).to.equal(1);
            expect(result.scaleY).to.equal(1);
            expect(result.scaleZ).to.equal(1);
        });
    });

    describe('subtract()', () => {
        it('should subtract x,y,z,width,height,depth', () => {
            let result = new Transform3({
                x: 1,
                y: 1,
                z: 1,
                width: 1,
                height: 1,
                depth: 1
            });
            result = result.subtract(
                new Transform3({
                    x: 1,
                    y: 1,
                    z: 1,
                    width: 1,
                    height: 1,
                    depth: 1
                })
            );
            expect(result.x).to.equal(0);
            expect(result.y).to.equal(0);
            expect(result.z).to.equal(0);
            expect(result.width).to.equal(0);
            expect(result.height).to.equal(0);
            expect(result.depth).to.equal(0);
        });

        it('should retain scaleX,scaleY,scaleZ', () => {
            const result = new Transform3({
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1
            });
            result.add(
                new Transform3({
                    scaleX: 1,
                    scaleY: 1,
                    scaleZ: 1
                })
            );
            expect(result.scaleX).to.equal(1);
            expect(result.scaleY).to.equal(1);
            expect(result.scaleZ).to.equal(1);
        });
    });

    describe('static subtract()', () => {
        it('should subtract x,y,z,width,height,depth', () => {
            const result = new Transform3({
                x: 1,
                y: 1,
                z: 1,
                width: 1,
                height: 1,
                depth: 1
            });
            const result1 = new Transform3({
                x: 1,
                y: 1,
                z: 1,
                width: 1,
                height: 1,
                depth: 1
            });
            const result2 = Transform3.subtract(result, result1);
            expect(result2.x).to.equal(0);
            expect(result2.y).to.equal(0);
            expect(result2.z).to.equal(0);
            expect(result2.width).to.equal(0);
            expect(result2.height).to.equal(0);
            expect(result2.depth).to.equal(0);
        });

        it('should retain scaleX,scaleY,scaleZ', () => {
            const result = new Transform3({
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1
            });
            const result1 = new Transform3({
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1
            });
            const result2 = Transform3.subtract(result, result1);
            expect(result.scaleX).to.equal(1);
            expect(result.scaleY).to.equal(1);
            expect(result.scaleZ).to.equal(1);
        });
    });

    describe('distance()', () => {
        it('should find distance between x,y,z,width,height,depth', () => {
            let result = new Transform3({
                x: -1,
                y: -1,
                z: -1,
                width: -1,
                height: -1,
                depth: -1
            });
            result = result.distance(
                new Transform3({
                    x: 1,
                    y: 1,
                    z: 1,
                    width: 1,
                    height: 1,
                    depth: 1
                })
            );
            expect(result.x).to.equal(2);
            expect(result.y).to.equal(2);
            expect(result.z).to.equal(2);
            expect(result.width).to.equal(2);
            expect(result.height).to.equal(2);
            expect(result.depth).to.equal(2);
        });

        it('should retain scaleX,scaleY,scaleZ', () => {
            const result = new Transform3({
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1
            });
            result.distance(
                new Transform3({
                    scaleX: 1,
                    scaleY: 1,
                    scaleZ: 1
                })
            );
            expect(result.scaleX).to.equal(1);
            expect(result.scaleY).to.equal(1);
            expect(result.scaleZ).to.equal(1);
        });
    });

    describe('static distance()', () => {
        it('should find distance between x,y,z,width,height,depth', () => {
            const result = new Transform3({
                x: -1,
                y: -1,
                z: -1,
                width: -1,
                height: -1,
                depth: -1
            });
            const result1 = new Transform3({
                x: 1,
                y: 1,
                z: 1,
                width: 1,
                height: 1,
                depth: 1
            });
            const result2 = Transform3.distance(result, result1);
            expect(result2.x).to.equal(2);
            expect(result2.y).to.equal(2);
            expect(result2.z).to.equal(2);
            expect(result2.width).to.equal(2);
            expect(result2.height).to.equal(2);
            expect(result2.depth).to.equal(2);
        });

        it('should retain scaleX,scaleY,scaleZ', () => {
            const result = new Transform3({
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1
            });
            const result1 = new Transform3({
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1
            });
            const result2 = Transform3.distance(result, result1);
            expect(result.scaleX).to.equal(1);
            expect(result.scaleY).to.equal(1);
            expect(result.scaleZ).to.equal(1);
        });
    });

    describe('equals()', () => {
        it('should return true if x,y,z,width,height,depth are equal', () => {
            const result = new Transform3({
                x: 1,
                y: 1,
                z: 1,
                width: 1,
                height: 1,
                depth: 1
            });
            const result1 = result.equals(
                new Transform3({
                    x: 1,
                    y: 1,
                    z: 1,
                    width: 1,
                    height: 1,
                    depth: 1
                })
            );
            expect(result1).to.equal(true);
        });
    });

    describe('static equals()', () => {
        it('should return true if x,y,z,width,height,depth are equal', () => {
            const result = new Transform3({
                x: 1,
                y: 1,
                z: 1,
                width: 1,
                height: 1,
                depth: 1
            });
            const result1 = new Transform3({
                x: 1,
                y: 1,
                z: 1,
                width: 1,
                height: 1,
                depth: 1
            });
            const result2 = Transform3.equals(result, result1);
            expect(result2).to.equal(true);
        });
    });
});
