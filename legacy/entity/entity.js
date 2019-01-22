import { Log, Util, Enum, Observer } from '../helpers'

export class Entity extends Observer {
    constructor(
        game,
        {
            x = 0,
            y = 0,
            width = 0,
            height = 0,
            resolution = 1,
            color = '#FFF',
            moveable = false,
            collision = false,
            render = true
        } = {}
    ) {
        super(!!game ? game.debug : false)
        this.local = {
            x: x / resolution,
            y: y / resolution,
            width: width / resolution,
            height: height / resolution
        };
        this.world = {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
        }

        this.moveable = moveable
        this.render = render
        this.rendered = render
        this.collision = collision
        this.resolution = resolution
        this.id = Util.uuid()
        this.type = this.constructor.name
        this.entityType = Enum.entityTypes.NONE
        this.color = color

        if (!!game) {
            this.game = game
        }
    }

    preload() {
        this.logger.log('preload()')
    }

    create() {
        this.logger.log('create()')
    }

    destroy() {
        this.logger.log('destroy()')
    }

    onEngineEvent(type, target) {
        switch (type) {
            case Enum.events.COLLISION:
                this.onCollision(target)
                break;
        }
    }

    onCollision(target) { }

    hide() {
        this.rendered = false
    }

    show() {
        this.rendered = true
    }

    noop() { }

    hitTest(entity) {
        return (
            this.x < entity.x + entity.width &&
            this.x + this.width > entity.x &&
            this.y < entity.y + entity.height &&
            this.y + this.height > entity.y
        );
    }



    set game(value) {
        if (!this._game) {
            this._game = value;
            this.engine = value.engine;
            this.logger = new Log(value.debug, this.type, this.id)
            value.engine.events.on(this.id, this.onEngineEvent.bind(this))
        }
    }

    get game() {
        return this._game
    }

    get x() {
        return this.local.x * this.resolution
    }

    set x(value) {
        if (this.moveable) {
            const normal = value / this.resolution
            if (this.local.x !== value) {
                this.local.x = normal
                if (!!this.parent) {
                    this.world.y = normal + this.parent.y
                }

                if (value > this.game.width || value + this.width < this.game.x) {
                    this.rendered = false
                } else {
                    if (this.render) {
                        this.rendered = true
                    }
                }
            }

            this.emit(Enum.events.POSITION_CHANGE, this)
        }
    }

    get y() {
        return this.local.y * this.resolution
    }

    set y(value) {
        if (this.moveable) {
            const normal = value / this.resolution
            if (this.local.y !== normal) {
                this.local.y = normal
                if (!!this.parent) {
                    this.world.y = normal + this.parent.y
                }

                if (value > this.game.height || value + this.height < this.game.y) {
                    this.rendered = false
                } else {
                    if (this.render) {
                        this.rendered = true
                    }
                }

                this.emit(Enum.events.POSITION_CHANGE, this)
            }
        }
    }

    get width() {
        return this.local.width * this.resolution
    }

    set width(value) {
        const normal = value / this.resolution
        if (this.local.width !== normal) {
            this.local.width = value / this.resolution
            this.world.width = this.width
            this.emit(Enum.events.SIZE_CHANGE, this)
        }
    }

    get height() {
        return this.local.height * this.resolution
    }

    set height(value) {
        const normal = value / this.resolution
        if (this.local.height !== normal) {
            this.local.height = value / this.resolution
            this.world.height = this.height
            this.emit(Enum.events.SIZE_CHANGE, this)
        }
    }

    set resolution(value) {
        this._resolution = value
        this.x = this.x
        this.y = this.y
        this.width = this.width
        this.height = this.height
    }

    get resolution() {
        return this._resolution
    }

    set rendered(value) {
        if (this._rendered !== value) {
            this._rendered = value
            this.emit(Enum.events.RENDERED_CHANGE, this)
        }
    }

    get rendered() {
        return this._rendered
    }

    set parent(value) {
        if (!!value) {
            this._parent = value
            this.world = {
                width: this.width,
                height: this.height,
                x: (value.x || 0) + this.x,
                y: (value.y || 0) + this.y
            }
        }
    }

    get parent() {
        return this._parent
    }
}
