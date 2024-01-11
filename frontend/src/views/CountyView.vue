<template>
  <div>
    <header>
      歷屆總統大選資料<br>
      > {{ countyName }}
    </header>
    <div>
    
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useRoute} from "vue-router";
import router from "@/router";

export default defineComponent({
  name: "CountyView",
  setup() {
    const params = useRoute().params
    const countyId = params.countyId
    
    if (!countyId) {
      router.push('/')
    }
    
    return {
      countyId,
      countyName: '台北市'
    }
  }
})
</script>
