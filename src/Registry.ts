import { Entity } from './entities/Entity';
import { IEntities } from './EntityManager';
import { EntityEvents } from './entities/Entity';
import { Engine, EngineEvents } from './Engine';

interface IRegisters {
    [key: string]: string[];
}

export class Registry {
    private engine: Engine;
    private registers: IRegisters = {};
    private entities: IEntities = {};

    public constructor(engine: Engine) {
        this.initialize();
        this.engine = engine;
    }

    private initialize(): void {
        for (let key in EngineEvents) {
            const method: string = EngineEvents[key];
            this.addRegister(method);
        }

        this.engine.on(EngineEvents.Start, this.onStart.bind(this));
        this.engine.on(EngineEvents.Preupdate, this.onPreupdate.bind(this));
        this.engine.on(EngineEvents.Update, this.onUpdate.bind(this));
        this.engine.on(EngineEvents.Postupdate, this.onPostupdate.bind(this));
        this.engine.on(EngineEvents.Draw, this.onDraw.bind(this));
        this.engine.on(EngineEvents.Destroy, this.onDestroy.bind(this));
    }

    public add(entity: Entity): boolean {
        if (!(entity.id in this.entities)) {
            this.entities[entity.id] = entity;
        } else {
            return false;
        }

        entity.on(EntityEvents.Rendered, this.onRenderedChange.bind(this));

        for (let method in this.registers) {
            if (method in entity && typeof entity[method] === 'function') {
                let shouldRegister = false;

                switch (method) {
                    case 'draw':
                        shouldRegister = entity.renderable;
                        break;
                    default:
                        shouldRegister = true;
                        break;
                }

                if (shouldRegister) {
                    this.addEntityToRegister(entity, method);
                }
            }
        }

        return true;
    }

    public remove(entity: Entity): boolean {
        if (!(entity.id in this.entities)) {
            return false;
        } else {
            delete this.entities[entity.id];
        }

        entity.off(EntityEvents.Rendered, this.onRenderedChange.bind(this));

        for (let method in this.registers) {
            if (method in entity) {
                this.removeEntityFromRegister(entity, method);
            }
        }

        return true;
    }

    public getRegister(method: EngineEvents): string[] | undefined {
        if (method in this.registers) {
            return this.registers[method];
        }
        return undefined;
    }

    public call(method: EngineEvents): void {
        if (method in this.registers) {
            for (let id in this.registers[method]) {
                const entity = this.entities[id];

                if (method in entity && typeof entity[method] === 'function') {
                    entity[method].call(entity);
                }
            }
        }
    }

    private addRegister(register: string): boolean {
        if (!(register in this.registers)) {
            this.registers[register] = [];
            return true;
        }
        return false;
    }

    private addEntityToRegister(entity: Entity, register: string): boolean {
        const ref = this.registers[register];
        if (!ref.includes(entity.id)) {
            ref.push(entity.id);
            return true;
        }

        return false;
    }

    private removeEntityFromRegister(entity: Entity, register: string): boolean {
        const ref = this.registers[register];
        if (ref.includes(entity.id)) {
            ref.splice(ref.indexOf(entity.id), 1);
            return true;
        }

        return false;
    }

    //#region events
    private onRenderedChange(entity: Entity): void {
        if (!entity.renderable) {
            this.removeEntityFromRegister(entity, EngineEvents.Draw);
        } else {
            this.addEntityToRegister(entity, EngineEvents.Draw);
        }
    }

    private onStart(): void {
        this.call(EngineEvents.Start);
    }

    private onPreupdate(): void {
        this.call(EngineEvents.Preupdate);
    }

    private onUpdate(): void {
        this.call(EngineEvents.Update);
    }

    private onPostupdate(): void {
        this.call(EngineEvents.Postupdate);
    }

    private onDraw(): void {
        this.call(EngineEvents.Draw);
    }

    private onDestroy(): void {
        this.call(EngineEvents.Destroy);
    }
    //#endregion events
}
