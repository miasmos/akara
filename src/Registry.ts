import { Entity } from './entities/base/Entity';
import { IEntities } from './EntityManager';
import { Engine, EngineEvent } from './Engine';

interface IRegisters {
    [key: string]: string[];
}

export class Registry {
    private engine: Engine;
    private registers: IRegisters = {};
    private entities: IEntities = {};

    public constructor(engine: Engine) {
        this.engine = engine;
        this.initialize();
    }

    private initialize(): void {
        for (const key in EngineEvent) {
            const method: string = EngineEvent[key];
            this.addRegister(method);
        }

        this.engine.on(EngineEvent.Start, this.onStart.bind(this));
        this.engine.on(EngineEvent.Preupdate, this.onPreupdate.bind(this));
        this.engine.on(EngineEvent.Update, this.onUpdate.bind(this));
        this.engine.on(EngineEvent.Postupdate, this.onPostupdate.bind(this));
        this.engine.on(EngineEvent.Destroy, this.onDestroy.bind(this));
    }

    public add(entity: Entity): boolean {
        if (!(entity.id in this.entities)) {
            this.entities[entity.id] = entity;
        } else {
            return false;
        }

        for (const method in this.registers) {
            if (method in entity && typeof entity[method] === 'function') {
                this.addEntityToRegister(entity, method);
            }
        }

        return true;
    }

    public remove(entity: Entity): boolean {
        if (!(entity.id in this.entities)) {
            return false;
        }

        delete this.entities[entity.id];

        for (const method in this.registers) {
            if (method in entity) {
                this.removeEntityFromRegister(entity, method);
            }
        }

        return true;
    }

    public getRegister(method: EngineEvent): string[] | undefined {
        if (method in this.registers) {
            return this.registers[method];
        }
        return undefined;
    }

    public call(method: EngineEvent): void {
        if (method in this.registers) {
            for (const key in this.registers[method]) {
                const id = this.registers[method][key];
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

    // #region events
    private onStart(): void {
        this.call(EngineEvent.Start);
    }

    private onPreupdate(): void {
        this.call(EngineEvent.Preupdate);
    }

    private onUpdate(): void {
        this.call(EngineEvent.Update);
    }

    private onPostupdate(): void {
        this.call(EngineEvent.Postupdate);
    }

    private onDestroy(): void {
        this.call(EngineEvent.Destroy);
    }
    // #endregion events
}
