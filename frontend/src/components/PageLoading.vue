<template>
  <div class="loading" v-show="isLoading">
    {{ message }}
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "PageLoading",
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: "載入中..."
    }
  }
})
</script>

<style scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  color: black;
}
</style>