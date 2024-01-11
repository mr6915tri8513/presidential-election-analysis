<template>
  <div>
    <header>
      歷屆總統大選資料 - {{ countyName }} - {{ villageName }}
    </header>
    <div>
      {{ villageId }}
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "VillageView"
})

</script>

<style scoped>

</style>