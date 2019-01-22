export class Enum {
    static get tagNames() {
        return {
            DIV: 'div',
            CANVAS: 'canvas'
        }
    }

    static get messages() {
        return {
            ASSET_MISSING: 'Sprite initialized with unknown asset %s.'
        }
    }

    static get events() {
        return {
            COLLISION: 'collision',
            LOAD_ASSET: 'load_asset',
            LOAD_COMPLETE: 'load_complete',
            RENDERED_CHANGE: 'rendered_change',
            POSITION_CHANGE: 'position_change',
            SIZE_CHANGE: 'size_change',
            KEY_DOWN: 'key_down',
            KEY_UP: 'key_up'
        }
    }

    static get assetTypes() {
        return {
            SOUND: 0,
            IMAGE: 1,
            SPRITESHEET: 2
        }
    }

    static get entityTypes() {
        return {
            NONE: 0,
            SPRITE: 1,
            TEXT: 2,
            BOX: 3,
            GROUP: 4,
            SCENE: 5
        }
    }

    static get direction() {
        return {
            NONE: 0,
            LEFT: 1,
            RIGHT: 2,
            UP: 3,
            DOWN: 4
        }
    }

    static get keys() {
        return {
            ARROW_UP: 38,
            ARROW_DOWN: 40,
            ARROW_LEFT: 37,
            ARROW_RIGHT: 39,
            SPACE: 32
        };
    }
}
