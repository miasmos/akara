import { IComponentConfig, Component, ComponentType } from './Component';

export enum ColliderEvent {}

export interface IColliderConfig extends IComponentConfig {
    id?: string;
}

export class Collider extends Component {
    public configure({  }: IColliderConfig): void {
        super.configure({ type: ComponentType.Collider });
    }

    public attach(): void {}
    public detach(): void {}
}
