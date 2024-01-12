<template>
  <div v-if="userConfig && stationInfo">
    <div class="user-info">
      <h1>我的暱稱</h1>
      <div class="user-name">
        <span>{{ userConfig.name ?? '訪客' }}</span>
        <button @click="editUserName">修改</button>
      </div>
      
      <h1>所屬投票所</h1>
      <div class="user-station">
        <span>{{ stationInfo.county }} > {{ stationInfo.district }} > {{ stationInfo.village }}</span>
      </div>
      
      <h1>我會投給</h1>
      <div v-if="teamInfo" class="user-vote">
        <span>{{ teamInfo.party }} ({{ teamInfo.president }}, {{ teamInfo.vicePresident }})</span>
      </div>
      <div v-else class="user-vote">
        <span>尚未選擇</span>
      </div>
    </div>
    
    <button class="opinion-poll" :disabled="userConfig?.voteTeam" @click="toVotePage">
      {{ userConfig?.voteTeam ? '你已經投過票了' : '參與民調！' }}
    </button>
  </div>
  <page-loading v-else message="something wrong"/>
</template>

<script lang="ts">
import PageLoading from "@/components/PageLoading.vue";
import router from "@/router";
import {userConfigKey} from "@/injection_keys";
import {defineComponent, inject, ref} from "vue";
import {getStationInfo, getTeamInfo, updateUserName} from "@/data/database";
import type {StationInfo, TeamInfo} from "@/data/database";

export default defineComponent({
  name: "CountyView",
  components: {PageLoading},
  setup() {
    const userConfig = inject(userConfigKey, ref())
    const stationInfo = ref<StationInfo | undefined>(undefined)
    const teamInfo = ref<TeamInfo | undefined>(undefined)
    
    if (!userConfig.value) {
      router.replace('/login')
    } else {
      getStationInfo(userConfig.value.stationId).then((info) => {
        stationInfo.value = info
      })
      
      if (userConfig.value?.voteTeam) {
        getTeamInfo(userConfig.value.id).then((info) => {
          teamInfo.value = info
        })
      }
    }
    
    function checkEscape(value: string) {
      if (/['"\\]/.test(value)) {
        alert('請勿輸入單引號或雙引號')
        return false
      }
      return true
    }
    
    function editUserName() {
      const userId = userConfig.value?.id
      if (!userId) {
        return
      }
      
      const newName = prompt('請輸入新的暱稱')
      if (newName && checkEscape(newName)) {
        updateUserName(userId, newName)
      }
    }
    
    function toVotePage() {
      router.push('/vote')
    }
    
    return {
      userConfig,
      stationInfo, teamInfo,
      editUserName, toVotePage
    }
  }
})
</script>

<style scoped>
.user-info {
  border-radius: 24px;
  background: white;
  padding: 16px 32px;
}
.user-name {
  display: flex;
  align-items: center;
  column-gap: 16px;
}
.user-name > span {
  font-size: 1.5em;
}
.user-name > button {
  border-radius: 8px;
  border: none;
  padding: 8px 16px;
  background: #42b983;
  color: white;
  font-size: 1.5em;
  cursor: pointer;
  transition: background 0.2s;
}
.user-name > button:hover {
  background: #3daa7d;
}

.user-station {
  display: flex;
  align-items: center;
  column-gap: 16px;
}
.user-station > span {
  font-size: 1.5em;
}

.user-vote {
  display: flex;
  align-items: center;
  column-gap: 16px;
}
.user-vote > span {
  font-size: 1.5em;
}

.opinion-poll {
  width: 50%;
  border-radius: 8px;
  border: none;
  margin-top: 16px;
  margin-inline: auto;
  padding: 8px 16px;
  background: #42b983;
  display: block;
  color: white;
  font-size: 2em;
  cursor: pointer;
  transition: background 0.2s;
}
.opinion-poll:enabled:hover {
  background: #3daa7d;
}
.opinion-poll:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
