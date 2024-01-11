<template>
  <template v-if="userConfig !== undefined">
    <header>
      <span class="title">歷屆總統大選資料</span>
      <button @click="toUserPage">嗨 {{ userConfig?.name ?? '訪客' }}</button>
    </header>
    <router-view/>
  </template>
  <page-loading v-else/>
</template>

<script lang="ts">
import PageLoading from "@/components/PageLoading.vue";
import router from "@/router";
import {defineComponent, provide, ref} from "vue";
import {getUserConfig} from "@/data/database";
import type {UserConfig} from "@/data/database";

export default defineComponent({
  name: "App",
  components: {PageLoading},
  setup() {
    const path = ref("首頁")
    const userConfig = ref<UserConfig | null | undefined>(undefined)
    
    getUserConfig().then(config => {
      userConfig.value = config
    })
    
    function toUserPage() {
      router.push("/user/")
    }
    
    return {path, userConfig, toUserPage}
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  margin: 0;
  background: lightgray;
}

header {
  border-radius: 24px;
  margin: 16px;
  padding: 16px 32px;
  background: white;
  display: grid;
  grid-template-columns: 1fr auto;
}
header .title {
  font-size: 3em;
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
</style>
