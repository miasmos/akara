import { Entity } from './entities/Entity';
import { Time } from './structs/Time';
import { Canvas } from './Canvas';
import { Observer } from './Observer';
import { EntityManager } from './EntityManager';
import { Registry } from './Registry';
import { Game } from './entities/Game';

export enum EngineEvents {
    Start = 'start',
    Preupdate = 'preupdate',
    Update = 'update',
    Postupdate = 'postupdate',
    Draw = 'draw',
    Destroy = 'destroy'
}

export class Engine extends Observer {
    public readonly fps: number = 60;
    public started: boolean = false;
    public canvas: Canvas = new Canvas();
    private time: Time = Time.Instance;
    private entities: EntityManager = new EntityManager();
    private registry: Registry;
    public game: Game;

    private intervals = {
        frame: undefined as number | undefined
    };

    public constructor(fps: number = 60) {
        super();
        this.fps = fps;
        this.initialize();
    }

    private initialize(): void {
        this.registry = new Registry(this);
    }

    public start(): void {
        if (!this.started) {
            this.intervals.frame = window.setInterval(this.frame.bind(this), this.fps);
            this.started = true;
            this.emit(EngineEvents.Start);
        }
    }

    public stop(): void {
        if (this.started) {
            clearInterval(this.intervals.frame);
            this.intervals.frame = undefined;
        }
    }

    private frame(): void {
        this.time.next();
        this.preupdate();
        this.update();
        this.postupdate();
    }

    private preupdate(): void {
        this.registry.call(EngineEvents.Preupdate);
    }

    private update(): void {
        this.registry.call(EngineEvents.Update);
        this.canvas.clear();
        this.draw();
    }

    private postupdate(): void {
        this.registry.call(EngineEvents.Postupdate);
    }

    private draw(): void {
        const ids = this.registry.getRegister(EngineEvents.Draw);

        if (!!ids) {
            for (let id of ids) {
                const entity = this.entities.get(id);
                if (!!entity) {
                    this.render(entity);
                }
            }
        }
    }

    private render(entity: Entity): void {
        if (!entity.renderable) {
            return;
        }
    }

    public add(entity: Entity): boolean {
        const wasAddedToEntityManager = this.entities.add(entity);
        const wasAddedToRegistry = this.registry.add(entity);
        const added = wasAddedToEntityManager && wasAddedToRegistry;

        if (!added) {
            return false;
        }

        if (this.started) {
            entity.start();
        }
        return true;
    }

    public remove(entity: Entity): boolean {
        const wasRemovedFromEntityManager = this.entities.remove(entity);
        const wasRemovedFromRegistry = this.registry.remove(entity);
        const removed = wasRemovedFromEntityManager && wasRemovedFromRegistry;

        if (!removed) {
            return false;
        }

        entity.destroy();
        return true;
    }

    public has(entity: Entity): boolean {
        return !!this.entities.get(entity.id);
    }
}
