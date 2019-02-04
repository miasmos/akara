import { Component, ComponentType } from './components/Component';
import { Observer } from './Observer';

export enum ComponentManagerEvent {
    Add = 'ComponentManagerEvent.Add',
    Remove = 'ComponentManagerEvent.Remove'
}

export interface IComponents {
    [key: string]: Component;
}

export class ComponentManager extends Observer {
    public components: Component[] = [];
    protected componentsById: IComponents = {};
    protected componentsByType: IComponents = {};

    public get(type: ComponentType): Component | undefined {
        if (type in this.componentsByType) {
            return this.componentsByType[type];
        }
        return undefined;
    }

    public add(component: Component): boolean {
        if (!(component.id in this.componentsById)) {
            this.components.push(component);
            this.componentsById[component.id] = component;
            this.componentsByType[component.type] = component;
            this.emit(ComponentManagerEvent.Add, component.type, component);
            return true;
        }
        return false;
    }

    public remove(component: Component): boolean {
        if (component.id in this.componentsById) {
            delete this.componentsById[component.id];
            delete this.componentsByType[component.type];
            this.components.splice(this.components.indexOf(component), 1);
            this.emit(ComponentManagerEvent.Remove, component.type, component);
            return true;
        }
        return false;
    }
}
