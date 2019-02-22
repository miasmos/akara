import { expect, assert } from 'chai';
import 'mocha';
import { Canvas } from '../src/Canvas';
import { HexCode } from '../src/enum/Enum';
import { Color } from '../src/structs/Color';

describe('Canvas', () => {
    describe('constructor()', () => {
        it('should accept a width parameter', () => {
            const canvas = new Canvas({
                width: 1
            });
            expect(canvas.width).to.equal(1);
        });

        it('should set width to 400 by default', () => {
            const canvas = new Canvas({});
            expect(canvas.width).to.equal(400);
        });

        it('should accept a height parameter', () => {
            const canvas = new Canvas({
                height: 1
            });
            expect(canvas.height).to.equal(1);
        });

        it('should set height to 400 by default', () => {
            const canvas = new Canvas({});
            expect(canvas.height).to.equal(400);
        });

        it('should accept a backgroundColor parameter as a string', () => {
            const canvas = new Canvas({
                backgroundColor: 'FFF'
            });
            expect(canvas.backgroundColor.toString()).to.equal('#ffffff');
        });

        it('should accept a backgroundColor parameter as a Color', () => {
            const canvas = new Canvas({
                backgroundColor: new Color('FFF')
            });
            expect(canvas.backgroundColor.toString()).to.equal('#ffffff');
        });

        it('should set backgroundColor to 000 by default', () => {
            const canvas = new Canvas({});
            expect(canvas.backgroundColor.toString()).to.equal('#000000');
        });
    });

    describe('mount()', () => {
        it('should mount as a child of the given element', () => {
            const canvas = new Canvas({});
            const div: HTMLDivElement = document.createElement('div');
            div.setAttribute('id', 'test');
            document.getElementsByTagName('body')[0].appendChild(div);
            canvas.mount('test');
            expect(document.querySelector('#test > canvas')).to.not.be.null;
        });

        it('should return the context when mounted', () => {
            const canvas = new Canvas({});
            const div: HTMLDivElement = document.createElement('div');
            div.setAttribute('id', 'test');
            document.getElementsByTagName('body')[0].appendChild(div);
            const context = canvas.mount('test');
            expect(context).to.not.be.a('undefined');
        });

        it('should mount as a child of body when not given an id', () => {
            const canvas = new Canvas({});
            canvas.mount();
            expect(document.querySelector('body > canvas')).to.not.be.null;
        });
    });

    describe('width()', () => {
        it('should return width', () => {
            const canvas = new Canvas({ width: 1 });
            expect(canvas.width).to.equal(1);
        });

        it('should set width', () => {
            const canvas = new Canvas({ width: 1 });
            canvas.width = 2;
            expect(canvas.width).to.equal(2);
        });

        it('should set element width', () => {
            const canvas = new Canvas({ width: 1 });
            const div: HTMLDivElement = document.createElement('div');
            div.setAttribute('id', 'test');
            document.getElementsByTagName('body')[0].appendChild(div);
            const context = canvas.mount('test');
            canvas.width = 2;
            if (canvas.element) {
                expect(canvas.element.width).to.equal(2);
            } else {
                assert.fail();
            }
        });
    });

    describe('height()', () => {
        it('should return height', () => {
            const canvas = new Canvas({ height: 1 });
            expect(canvas.height).to.equal(1);
        });

        it('should set height', () => {
            const canvas = new Canvas({ height: 1 });
            canvas.height = 2;
            expect(canvas.height).to.equal(2);
        });

        it('should set element height', () => {
            const canvas = new Canvas({ height: 1 });
            const div: HTMLDivElement = document.createElement('div');
            div.setAttribute('id', 'test');
            document.getElementsByTagName('body')[0].appendChild(div);
            const context = canvas.mount('test');
            canvas.height = 2;
            if (canvas.element) {
                expect(canvas.element.height).to.equal(2);
            } else {
                assert.fail();
            }
        });
    });

    describe('y()', () => {
        it('should return y', () => {
            const canvas = new Canvas({});
            canvas.mount();
            expect(canvas.y).to.equal(0);
        });
    });

    describe('x()', () => {
        it('should return x', () => {
            const canvas = new Canvas({});
            canvas.mount();
            expect(canvas.x).to.equal(0);
        });
    });

    describe('resize()', () => {
        it('should set width', () => {
            const canvas = new Canvas({});
            canvas.mount();
            canvas.resize(10, 10);
            expect(canvas.width).to.equal(10);
        });

        it('should set height', () => {
            const canvas = new Canvas({});
            canvas.mount();
            canvas.resize(10, 10);
            expect(canvas.height).to.equal(10);
        });
    });

    describe('translate()', () => {
        it('should return true if context exists', () => {
            const canvas = new Canvas({});
            canvas.mount();
            const result = canvas.translate(10, 10);
            expect(result).to.equal(true);
        });

        it('should return false if context does not exist', () => {
            const canvas = new Canvas({});
            const result = canvas.translate(10, 10);
            expect(result).to.equal(false);
        });
    });

    describe('save()', () => {
        it('should return true when saved is false', () => {
            const canvas = new Canvas({});
            canvas.mount();
            const result = canvas.save();
            expect(result).to.equal(true);
        });

        it('should return false when saved is true', () => {
            const canvas = new Canvas({});
            canvas.mount();
            canvas.save();
            const result = canvas.save();
            expect(result).to.equal(false);
        });
    });

    describe('restore()', () => {
        it('should return true when saved is true', () => {
            const canvas = new Canvas({});
            canvas.mount();
            canvas.save();
            const result = canvas.restore();
            expect(result).to.equal(true);
        });

        it('should return false when saved is false', () => {
            const canvas = new Canvas({});
            canvas.mount();
            const result = canvas.restore();
            expect(result).to.equal(false);
        });
    });

    describe('rotate()', () => {
        it('should return true if context exists', () => {
            const canvas = new Canvas({});
            canvas.mount();
            const result = canvas.rotate(30);
            expect(result).to.equal(true);
        });

        it('should return true if context does not exist', () => {
            const canvas = new Canvas({});
            const result = canvas.rotate(30);
            expect(result).to.equal(false);
        });
    });

    describe('clear()', () => {
        it('should return true if context exists', () => {
            const canvas = new Canvas({});
            canvas.mount();
            const result = canvas.clear();
            expect(result).to.equal(true);
        });

        it('should return true if context does not exist', () => {
            const canvas = new Canvas({});
            const result = canvas.clear();
            expect(result).to.equal(false);
        });
    });

    describe('alpha()', () => {
        it('should set alpha', () => {
            const canvas = new Canvas({});
            canvas.mount();
            canvas.alpha = 0.5;
            expect(canvas.alpha).to.equal(0.5);
        });

        it('should return alpha', () => {
            const canvas = new Canvas({});
            canvas.mount();
            canvas.alpha = 0.5;
            expect(canvas.alpha).to.equal(0.5);
        });

        it('should return 1 if context does not exist', () => {
            const canvas = new Canvas({});
            canvas.alpha = 0.5;
            expect(canvas.alpha).to.equal(1);
        });
    });

    describe('drawText()', () => {
        it('should return true if context exists', () => {
            const canvas = new Canvas({});
            canvas.mount();
            const result = canvas.drawText('test', new Color(), 0, 0);
            expect(result).to.equal(true);
        });

        it('should return true if context does not exist', () => {
            const canvas = new Canvas({});
            const result = canvas.drawText('test', new Color(), 0, 0);
            expect(result).to.equal(false);
        });
    });

    describe('drawBox()', () => {
        it('should return true if context exists', () => {
            const canvas = new Canvas({});
            canvas.mount();
            const result = canvas.drawBox(new Color(), 0, 0, 0, 0);
            expect(result).to.equal(true);
        });

        it('should return true if context does not exist', () => {
            const canvas = new Canvas({});
            const result = canvas.drawBox(new Color(), 0, 0, 0, 0);
            expect(result).to.equal(false);
        });
    });

    describe('drawOutline()', () => {
        it('should return true if context exists', () => {
            const canvas = new Canvas({});
            canvas.mount();
            const result = canvas.drawOutline(new Color(), new Color(), 0, 0, 0, 0);
            expect(result).to.equal(true);
        });

        it('should return true if context does not exist', () => {
            const canvas = new Canvas({});
            const result = canvas.drawOutline(new Color(), new Color(), 0, 0, 0, 0);
            expect(result).to.equal(false);
        });
    });

    describe('drawLine()', () => {
        it('should return true if context exists', () => {
            const canvas = new Canvas({});
            canvas.mount();
            const result = canvas.drawLine(new Color(), 0, 0, 0, 0, 1);
            expect(result).to.equal(true);
        });

        it('should return true if context does not exist', () => {
            const canvas = new Canvas({});
            const result = canvas.drawLine(new Color(), 0, 0, 0, 0, 1);
            expect(result).to.equal(false);
        });
    });
});
