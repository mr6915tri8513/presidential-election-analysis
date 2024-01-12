<template>
  <header>
    <span class="title" @click="toHomePage">歷屆總統大選資料</span>
    <button @click="toUserPage">嗨 {{ (userConfig?.name ?? '訪客') || userConfig?.id }}</button>
  </header>
  <router-view/>
</template>

<script lang="ts">
import PageLoading from "@/components/PageLoading.vue";
import router from "@/router";
import {userConfigKey} from "@/injection_keys";
import {defineComponent, provide, ref} from "vue";
import type {UserConfig} from "@/data/database";

export default defineComponent({
  name: "App",
  components: {PageLoading},
  setup() {
    const path = ref("首頁")
    const userConfig = ref<UserConfig | null>(null)
    
    function toUserPage() {
      if (userConfig.value) {
        router.push("/user")
      } else {
        router.push("/login")
      }
    }
    
    function toHomePage() {
      router.push("/")
    }
    
    provide(userConfigKey, userConfig)
    
    return {path, userConfig, toHomePage, toUserPage}
  }
})
</script>

<style>

html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
  background: lightgray;
}

#app {
  box-sizing: border-box;
  height: 100%;
  padding: 16px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 16px 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

header {
  border-radius: 24px;
  padding: 16px 32px;
  background: white;
  display: grid;
  grid-template-columns: 1fr auto;
}
header .title {
  font-size: 3em;
  cursor: pointer;
}
header button {
  font-size: 1.5em;
  border-radius: 8px;
  border: none;
  background: #42b983;
  color: white;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
}
header button:hover {
  background: #3daa7d;
}
</style>
