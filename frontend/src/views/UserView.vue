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
    
    <div class="buttons">
      <button class="delete-user" @click="deleteUser">
                  刪除使用者資料
      </button>
      <button class="opinion-poll" :disabled="userConfig?.voteTeam" @click="toVotePage">
        {{ userConfig?.voteTeam ? '你已經投過票了' : '參與民調！' }}
      </button>
    </div>
  </div>
  <page-loading v-else message="something wrong"/>
</template>

<script lang="ts">
import PageLoading from "@/components/PageLoading.vue";
import router from "@/router";
import {userConfigKey} from "@/injection_keys";
import {defineComponent, inject, ref} from "vue";
import {apiDeleteUser, checkEscape, getStationInfo, getTeamInfo, updateUserName} from "@/data/database";
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
      console.log(userConfig.value)
      getStationInfo(userConfig.value.stationId).then((info) => {
        stationInfo.value = info
      })
      
      if (userConfig.value?.voteTeam) {
        getTeamInfo(userConfig.value.voteTeam).then((info) => {
          teamInfo.value = info
        })
      }
    }
    
    function editUserName() {
      const userId = userConfig.value?.id
      if (!userId) {
        return
      }
      
      const newName = prompt('請輸入新的暱稱')
      if (newName && checkEscape(newName)) {
        updateUserName(userId, newName).then((config) => {
          userConfig.value = config
        })
      }
    }
    
    function deleteUser() {
      const userId = userConfig.value?.id
      if (!userId) {
        return
      }
      
      if (!confirm('你確定要刪除此帳號嗎？(此操作無法復原)')) {
        return
      }
      
      const password = prompt('確認密碼')
      if (password && checkEscape(password)) {
        apiDeleteUser(userId, password).then((result) => {
          if (result) {
            alert('刪除成功')
            userConfig.value = null
            router.replace('/')
          } else {
            alert('刪除失敗')
          }
        }).catch((error) => {
          console.log(error)
          alert('刪除失敗')
        })
      }
    }
    
    function toVotePage() {
      router.push('/vote')
    }
    
    return {
      userConfig,
      stationInfo, teamInfo,
      editUserName, deleteUser, toVotePage
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

.buttons {
  padding-inline: 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
}

.delete-user {
  width: 100%;
  border-radius: 8px;
  border: none;
  margin-top: 16px;
  margin-inline: auto;
  padding: 8px 16px;
  background: indianred;
  display: block;
  color: white;
  font-size: 2em;
  cursor: pointer;
  transition: background 0.2s;
}
.delete-user:hover {
  background: red;
}

.opinion-poll {
  width: 100%;
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
