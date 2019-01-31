export enum ErrorMessage {
    ElementNotFound = 'Element was not found in the DOM.',
    CanvasInstantiationError = 'Rendering context not found.',
    CanvasMountError = 'Error while mounting canvas.',
    SceneNotFound = 'Scene not found.',
    TriedToAddToEmptyScene = 'Tried to add entity to an empty scene. Set an active scene first.',
    CannotAddScene = 'Cannot add a scene using game.add(), use game.scene.load() instead.',
    CannotRemoveScene = 'Cannot remove a scene using game.remove(), use game.scene.unload() instead.',
    NoActiveScene = 'There is no active scene.',
    CannotAddEntitySelf = 'Cannot add entity. An entity cannot add itself.',
    CannotAddEntityContains = 'Cannot add entity. Already exists in tree.'
}
