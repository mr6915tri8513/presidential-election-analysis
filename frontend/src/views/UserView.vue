<template>
  <div>
    <div>
    
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject, ref} from "vue";
import {userConfigKey} from "@/injection_keys";
import router from "@/router";

export default defineComponent({
  name: "CountyView",
  setup() {
    const userConfig = inject(userConfigKey, ref())
    
    if (!userConfig.value) {
      router.push('/')
    }
    
    return {
      userConfig
    }
  }
})
</script>
