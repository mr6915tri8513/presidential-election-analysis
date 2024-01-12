<template>
  <div>
    <div class="info">
      <a target="_blank" href="https://eebulletin.cec.gov.tw/113/01%E7%AC%AC16%E4%BB%BB%E7%B8%BD%E7%B5%B1%E5%89%AF%E7%B8%BD%E7%B5%B1%E9%81%B8%E8%88%89/%E7%AC%AC16%E4%BB%BB%E7%B8%BD%E7%B5%B1%E5%89%AF%E7%B8%BD%E7%B5%B1%E9%81%B8%E8%88%89%E9%81%B8%E8%88%89%E5%85%AC%E5%A0%B1.pdf">
        <h1>選舉公報</h1>
      </a>
    </div>
    
    <div class="vote">
      <h1>我要投給</h1>
      <label v-for="teamInfo in teamInfos">
        <input type="radio" name="vote" :value="teamInfo.team" v-model="teamId">
        <span>{{ teamInfo.party }} ({{ teamInfo.president }}, {{ teamInfo.vicePresident }})</span>
      </label>
      <button :disabled="!teamId" @click="vote()">投票</button>
    </div>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import {userConfigKey} from "@/injection_keys";
import {defineComponent, inject, ref} from "vue";
import {checkEscape, getVoteTeams, apiVote} from "@/data/database";
import type {VoteTeamInfo} from "@/data/database";

export default defineComponent({
  name: "VoteView",
  setup() {
    const userConfig = inject(userConfigKey, ref())
    const teamInfos = ref<VoteTeamInfo[]>([])
    const teamId = ref<string | undefined>(undefined)
    
    if (!userConfig.value) {
      router.replace('/login')
    } else if (userConfig.value?.voteTeam) {
      router.replace('/user')
    }
    
    getVoteTeams().then((teams) => {
      teamInfos.value = teams
    })
    
    function vote() {
      if (!teamId.value || !userConfig.value) {
        return
      }
      
      if (!confirm('確定要投給這個政黨嗎？(不可更改)')) {
        return
      }
      
      const password = prompt('確認密碼')
      if (password && checkEscape(password)) {
        apiVote(userConfig.value.id, password, teamId.value).then(() => {
          if (userConfig.value && teamId.value) {
            userConfig.value.voteTeam = teamId.value
          }
          alert('投票成功')
          router.replace('/user')
        }).catch(() => {
          alert('投票失敗')
        })
      }
    }
    
    return {teamInfos, teamId, vote}
  }
})
</script>

<style scoped>
.info {
  border-radius: 24px;
  padding: 16px 32px;
  background: white;
}

.vote {
  border-radius: 24px;
  padding: 16px 32px 32px;
  background: white;
  margin-top: 16px;
}
.vote > label {
  margin: 8px 0;
  display: flex;
  font-size: 2em;
  column-gap: 8px;
}
.vote > button {
  border-radius: 8px;
  border: none;
  padding: 8px 16px;
  margin-top: 16px;
  background: #42b983;
  display: block;
  color: white;
  font-size: 2em;
  cursor: pointer;
  transition: background 0.2s;
}
.vote > button:enabled:hover {
  background: #3daa7d;
}
.vote > button:disabled {
  background: lightgray;
  cursor: not-allowed;
}
</style>
