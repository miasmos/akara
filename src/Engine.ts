import { Entity } from './entities/base/Entity';
import { Text } from './entities/Text';
import { Box } from './entities/Box';
import { Sprite } from './entities/Sprite';
import { EntityType, EntityEvent } from './entities/base/IEntity';
import { Time } from './structs/Time';
import { Canvas } from './Canvas';
import { Observer } from './Observer';
import { EntityManager } from './EntityManager';
import { Registry } from './Registry';
import { Game } from './entities/Game';
import { Group } from './entities/Group';
import { Debug } from './util/Util';
import { ErrorMessage } from './enum/ErrorMessage';
import { Color } from './structs/Color';
import { HexCode } from './enum/HexCode';
import { CollisionManager, CollisionEvent } from './CollisionManager';
import { Transform3Event } from './structs/Transform3';

export enum EngineEvent {
    Start = 'start',
    Preupdate = 'preupdate',
    Update = 'update',
    Postupdate = 'postupdate',
    Destroy = 'destroy',
    Collision = 'collision'
}

export interface IEngineConfig {
    width?: number;
    height?: number;
    backgroundColor?: string | Color;
    fps?: number;
}

export class Engine extends Observer {
    public fps: number = 60;
    public started: boolean = false;
    public canvas: Canvas;
    private entities: EntityManager = new EntityManager();
    private movedEntities: string[] = [];
    private collisions: CollisionManager;
    private registry: Registry;
    public game: Game;

    private intervals = {
        frame: undefined as number | undefined
    };

    public constructor(game: Game) {
        super();
        this.game = game;
    }

    public configure({
        width = 400,
        height = 400,
        backgroundColor = HexCode.Black,
        fps = 60
    }: IEngineConfig): void {
        this.canvas = new Canvas({
            width,
            height,
            backgroundColor
        });
        this.fps = fps;
        this.registry = new Registry(this);
        this.canvas.mount();
        this.collisions = new CollisionManager(this.game);
        this.collisions.configure({});
        this.collisions.on(CollisionEvent.Collision, this.collide.bind(this));
    }

    public start(): void {
        if (!this.started) {
            this.started = true;

            if (this.canvas.mounted) {
                this.intervals.frame = window.setInterval(this.frame.bind(this), 1000 / this.fps);
                this.emit(EngineEvent.Start);
            } else {
                Debug.error(ErrorMessage.CanvasMountError);
            }
        }
    }

    public stop(): void {
        if (this.started) {
            clearInterval(this.intervals.frame);
            this.intervals.frame = undefined;
        }
    }

    public add(entity: Entity): boolean {
        if (this.has(entity)) {
            return false;
        }

        this.collisions.addEntity(entity);
        this.entities.add(entity);
        this.registry.add(entity);
        entity.on(EntityEvent.Transform, this.onEntityTransformChange.bind(this));

        if (entity.type === EntityType.Group) {
            (entity as Group).children.map(child => this.add(child));
        }

        if (this.started) {
            if (EngineEvent.Start in entity) {
                entity[EngineEvent.Start].call(entity);
            }
        }
        return true;
    }

    public remove(entity: Entity): boolean {
        if (!this.has(entity)) {
            return false;
        }

        this.collisions.removeEntity(entity);
        this.entities.remove(entity);
        this.registry.remove(entity);
        entity.off(EntityEvent.Transform, this.onEntityTransformChange.bind(this));

        if (entity.type === EntityType.Group) {
            (entity as Group).children.map(child => this.remove(child));
        }

        if (EngineEvent.Destroy in entity) {
            entity[EngineEvent.Destroy].call(entity);
        }
        return true;
    }

    public getEntitiesByTag(tag: string): Entity[] {
        return this.entities.getTag(tag);
    }

    public getEntitiesByType(type: EntityType): Entity[] {
        return this.entities.getType(type);
    }

    public clear(): void {
        this.entities.clear();
    }

    public has(entity: Entity): boolean {
        return !!this.entities.get(entity.id);
    }

    private frame(): void {
        Time.next();
        this.clearMovedEntities();
        this.preupdate();
        this.update();
        this.postupdate();
    }

    private preupdate(): void {
        this.registry.call(EngineEvent.Preupdate);
    }

    private update(): void {
        this.registry.call(EngineEvent.Update);
        this.collisions.update();
        this.draw();
    }

    private postupdate(): void {
        this.registry.call(EngineEvent.Postupdate);
    }

    private collide(source: Entity, collided: Entity): void {
        this.registry.call(EngineEvent.Collision, source.id, collided);
        this.registry.call(EngineEvent.Collision, collided.id, source);
    }

    private draw(): void {
        this.canvas.clear();
        const scene = this.game.scene.active;
        if (this.game.debug.grid) {
            this.drawGrid(10, 1);
            this.drawGrid(5, 2);
        }

        if (scene) {
            scene.children.map(entity => this.render(entity));
        }
    }

    private render(entity: Entity): void {
        if (!entity.visible || !entity.renderable) {
            return;
        }

        const { width, height } = entity.world.size;
        let { x, y } = entity.world.origin;
        const { rotateX, rotateY, rotateZ, pivotX, pivotY } = entity.world;

        if (entity.alpha !== 1) {
            this.canvas.save();
            this.canvas.alpha = entity.alpha;
        }
        if (rotateX !== 0 || rotateY !== 0 || rotateZ !== 0) {
            this.canvas.save();
            this.canvas.translate(x + pivotX * width, y + pivotY * height);
            this.canvas.rotate(rotateX);
        }

        const camera = this.game.camera.active;
        if (camera) {
            x -= camera.x;
            y -= camera.y;
        }

        switch (entity.type) {
            case EntityType.Group:
                (entity as Group).children.map(child => this.render(child));
                break;
            case EntityType.Box:
                this.canvas.drawBox((entity as Box).backgroundColor, x, y, width, height);
                break;
            case EntityType.Text:
                this.canvas.drawText((entity as Text).text, (entity as Text).color, x, y);
                break;
            case EntityType.Sprite:
                this.canvas.drawImage((entity as Sprite).image, x, y, width, height);
                break;
            default:
        }

        this.canvas.restore();
        this.debug(entity);
    }

    private debug(entity: Entity): void {
        const { width, height } = entity.world._size;
        const { x, y } = entity.world._origin;

        const shouldDrawOutline = this.game.debug.outline;
        if (shouldDrawOutline) {
            const backgroundColor =
                entity.type === EntityType.Box
                    ? (entity as Box).backgroundColor
                    : this.canvas.backgroundColor;
            this.canvas.drawOutline(backgroundColor, new Color(HexCode.Green), x, y, width, height);
        }

        const shouldDrawPivot = this.game.debug.pivot;
        if (shouldDrawPivot) {
            const { _pivot: pivot } = entity.world;
            const radius = 2;
            this.canvas.drawBox(
                new Color(HexCode.Red),
                x + width * pivot.x - radius,
                y + height * pivot.y - radius,
                radius * 2,
                radius * 2
            );
        }
    }

    private drawGrid(resolution: number = 10, stroke: number = 1): void {
        const { width, height } = this.game;
        const linesX = Math.floor(width / resolution);
        const linesY = Math.floor(height / resolution);

        for (let index = 1; index <= linesY; index += 1) {
            const y = linesY * index;
            this.canvas.drawLine(new Color(HexCode.Gray), 0, y, width, y, stroke);
        }
        for (let index = 1; index <= linesX; index += 1) {
            const x = linesX * index;
            this.canvas.drawLine(new Color(HexCode.Gray), x, 0, x, height, stroke);
        }
    }

    public getMovedEntities(): string[] {
        return this.movedEntities;
    }

    public hasMovedEntity(entity: Entity): boolean {
        return this.movedEntities.includes(entity.id);
    }

    private addMovedEntity(entity: Entity): boolean {
        if (!this.hasMovedEntity(entity)) {
            this.movedEntities.push(entity.id);
            return true;
        }
        return false;
    }

    private clearMovedEntities(): void {
        this.movedEntities = [];
    }

    // #region events
    protected onEntityTransformChange(
        entity: Entity,
        previous: number,
        changed: Transform3Event
    ): void {
        switch (changed) {
            case Transform3Event.X:
            case Transform3Event.Y:
            case Transform3Event.Z:
            case Transform3Event.Width:
            case Transform3Event.Height:
            case Transform3Event.Depth:
            case Transform3Event.ScaleX:
            case Transform3Event.ScaleY:
            case Transform3Event.ScaleZ:
                this.addMovedEntity(entity);
                break;
            default:
        }
    }
    // #endregion
}
