import { Component, ComponentType } from './components/Component';
import { Observer } from './Observer';
import { ComponentFactory } from './ComponentFactory';
import { Game } from './entities/Game';

export enum ComponentManagerEvent {
    Add = 'ComponentManagerEvent.Add',
    Remove = 'ComponentManagerEvent.Remove'
}

export interface IComponents {
    [key: string]: Component;
}

export class ComponentManager extends Observer {
    public components: Component[] = [];
    public game: Game;
    protected componentsById: IComponents = {};
    protected componentsByType: IComponents = {};

    public get(type: ComponentType): Component | undefined {
        if (type in this.componentsByType) {
            return this.componentsByType[type];
        }
        return undefined;
    }

    public has(type: ComponentType): boolean {
        return !!this.get(type);
    }

    public add(component: Component | ComponentType): Component | boolean {
        if (!(component instanceof Component)) {
            component = ComponentFactory.get(this.game, component, {});
        }
        if (!(component.type in this.componentsByType)) {
            this.components.push(component);
            this.componentsById[component.id] = component;
            this.componentsByType[component.type] = component;
            this.emit(ComponentManagerEvent.Add, component.type, component);
            return component;
        }
        return false;
    }

    public remove(component: Component | ComponentType): Component | boolean {
        const type = component instanceof Component ? component.type : component;
        if (type in this.componentsByType) {
            component = this.componentsByType[type];
            delete this.componentsById[component.id];
            delete this.componentsByType[component.type];
            this.components.splice(this.components.indexOf(component), 1);
            this.emit(ComponentManagerEvent.Remove, component.type, component);
            return component;
        }
        return false;
    }
}
