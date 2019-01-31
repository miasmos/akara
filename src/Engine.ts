import { Entity } from './entities/base/Entity';
import { Text } from './entities/Text';
import { Box } from './entities/Box';
import { Sprite } from './entities/Sprite';
import { EntityType } from './entities/base/IEntity';
import { Time } from './structs/Time';
import { Canvas } from './Canvas';
import { Observer } from './Observer';
import { EntityManager } from './EntityManager';
import { Registry } from './Registry';
import { Game } from './entities/Game';
import { SuperGroup } from './entities/SuperGroup';
import { Debug } from './util/Util';
import { ErrorMessage } from './enum/ErrorMessage';
import { Color } from './structs/Color';
import { HexCode } from './enum/HexCode';

export enum EngineEvent {
    Start = 'start',
    Preupdate = 'preupdate',
    Update = 'update',
    Postupdate = 'postupdate',
    Destroy = 'destroy'
}

export interface IEngineConfig {
    game: Game;
    width?: number;
    height?: number;
    backgroundColor?: string | Color;
    fps?: number;
}

export class Engine extends Observer {
    public readonly fps: number = 60;
    public started: boolean = false;
    public canvas: Canvas;
    private entities: EntityManager = new EntityManager();
    private registry: Registry;
    public game: Game;

    private intervals = {
        frame: undefined as number | undefined
    };

    public constructor({
        game,
        width = 400,
        height = 400,
        backgroundColor = HexCode.Black,
        fps = 60
    }: IEngineConfig) {
        super();
        this.game = game;
        this.canvas = new Canvas({
            width,
            height,
            backgroundColor
        });
        this.fps = fps;
        this.registry = new Registry(this);
        this.canvas.mount();
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

        this.entities.add(entity);
        this.registry.add(entity);

        if (entity.type === EntityType.Group) {
            for (let child of (entity as SuperGroup).children) {
                this.add(child);
            }
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

        this.entities.remove(entity);
        this.registry.remove(entity);

        if (entity.type === EntityType.Group) {
            for (let child of (entity as SuperGroup).children) {
                this.remove(child);
            }
        }

        if (EngineEvent.Destroy in entity) {
            entity[EngineEvent.Destroy].call(entity);
        }
        return true;
    }

    public clear(): void {
        this.entities.clear();
    }

    public has(entity: Entity): boolean {
        return !!this.entities.get(entity.id);
    }

    private frame(): void {
        Time.next();
        this.preupdate();
        this.update();
        this.postupdate();
    }

    private preupdate(): void {
        this.registry.call(EngineEvent.Preupdate);
    }

    private update(): void {
        this.registry.call(EngineEvent.Update);
        this.draw();
    }

    private postupdate(): void {
        this.registry.call(EngineEvent.Postupdate);
    }

    private draw(): void {
        this.canvas.clear();
        const scene = this.game.scene.active;
        if (this.game.debug.grid) {
            this.drawGrid(10, 1);
            this.drawGrid(5, 2);
        }

        if (!!scene) {
            for (let entity of scene.children) {
                this.render(entity);
            }
        }
    }

    private render(entity: Entity): void {
        if (!entity.visible || !entity.renderable) {
            return;
        }

        const { x, y, width, height } = entity.world;
        switch (entity.type) {
            case EntityType.Group:
                const groupEntity = entity as SuperGroup;
                for (let entity of groupEntity.children) {
                    this.render(entity);
                }
                break;
            case EntityType.Box:
                this.canvas.drawBox((entity as Box).backgroundColor, x, y, width, height);
                break;
            case EntityType.Text:
                const textEntity = entity as Text;
                this.canvas.drawText(textEntity.text, textEntity.color, x, y);
                break;
            case EntityType.Sprite:
                this.canvas.drawImage((entity as Sprite).image, x, y, width, height);
                break;
        }

        const outlines = this.game.debug.outlines;
        if (outlines) {
            const backgroundColor =
                entity.type === EntityType.Box
                    ? (entity as Box).backgroundColor
                    : this.canvas.backgroundColor;
            this.canvas.drawOutline(backgroundColor, new Color(HexCode.Green), x, y, width, height);
        }
    }

    private drawGrid(resolution: number = 10, stroke: number = 1): void {
        const { width, height } = this.game;
        const linesX = Math.floor(width / resolution),
            linesY = Math.floor(height / resolution);

        for (let index = 1; index <= linesY; index++) {
            const y = linesY * index;
            this.canvas.drawLine(new Color(HexCode.Gray), 0, y, width, y, stroke);
        }
        for (let index = 1; index <= linesX; index++) {
            const x = linesX * index;
            this.canvas.drawLine(new Color(HexCode.Gray), x, 0, x, height, stroke);
        }
    }
}
