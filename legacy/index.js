export { Game } from './game'

import { Entity as Base, Sprite, Text, Box, Group, Scene } from './entity'
export const Entity = {
    Entity: Base, Sprite, Text, Box, Group, Scene
}

import { Observer, Util, Log } from './helpers'
export const Helpers = {
    Observer, Util, Log
}

import { Enum } from './helpers/enum'
export const TAG_NAMES = Enum.tagNames
export const MESSAGES = Enum.messages
export const EVENTS = Enum.events
export const ASSET_TYPES = Enum.assetTypes
export const ENTITY_TYPES = Enum.entityTypes
export const DIRECTION = Enum.direction
export const KEYS = Enum.keys