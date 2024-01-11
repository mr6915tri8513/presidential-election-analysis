import {InjectionKey} from "vue";

export const updatePathKey: InjectionKey<(path: string) => void> = Symbol("updatePath");