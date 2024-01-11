import type {InjectionKey, Ref} from "vue";
import type {UserConfig} from "@/data/database";

export const userConfigKey: InjectionKey<Ref<UserConfig | null | undefined>> =
  Symbol("updatePath");