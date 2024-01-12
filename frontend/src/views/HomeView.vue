<template>
  <div class="home">
    <div class="conditions">
      <span>篩選條件</span>
      <label>
        <select v-model="term">
          <option v-for="t in [9, 10, 11, 12, 13, 14, 15]" :value="t">
            第 {{ t }} 屆
          </option>
        </select>
      </label>
      
      <label>
        <select v-model="countyId">
          <option v-for="county in counties" :value="county.id">
            {{ county.name }}
          </option>
        </select>
      </label>
      
      <label>
        <select v-model="districtId" :disabled="countyId === 0">
          <option v-for="district in districts" :value="district.id">
            {{ district.name }}
          </option>
        </select>
      </label>
      
      <label>
        <select v-model="villageId" :disabled="districtId === 0">
          <option v-for="village in villages" :value="village.id">
            {{ village.name }}
          </option>
        </select>
      </label>
    </div>
    
    <table>
      <thead>
      <tr>
        <th>政黨名稱</th>
        <th>總統參選人</th>
        <th>副總統參選人</th>
        <th>得票數</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="team in teams" :key="team.party">
        <td>{{ team.party || '公民投票' }}</td>
        <td>{{ team.president }}</td>
        <td>{{ team.vicePresident }}</td>
        <td>{{ team.total }}</td>
      </tr>
      </tbody>
    </table>
    
    <button class="opinion-poll">
      參與民調！
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from "vue";
import {getDistricts, getPollCounts, getVillages, Team} from "@/data/database";
import type {Area} from "@/data/database";

export default defineComponent({
  name: "HomeView",
  setup() {
    const term = ref<number>(9)
    const countyId = ref<number>(0)
    const districtId = ref<number>(0)
    const villageId = ref<number>(0)
    
    const terms = [9, 10, 11, 12, 13, 14, 15, 16] as const
    const counties = [
      {id: 0, name: '全部'},
      {id: 1, name: '宜蘭縣'},
      {id: 2, name: '花蓮縣'},
      {id: 3, name: '金門縣'},
      {id: 4, name: '南投縣'},
      {id: 5, name: '屏東縣'},
      {id: 6, name: '苗栗縣'},
      {id: 7, name: '桃園市'},
      {id: 8, name: '桃園縣'},
      {id: 9, name: '高雄市'},
      {id: 10, name: '高雄縣'},
      {id: 11, name: '基隆市'},
      {id: 12, name: '連江縣'},
      {id: 13, name: '雲林縣'},
      {id: 14, name: '新北市'},
      {id: 15, name: '新竹市'},
      {id: 16, name: '新竹縣'},
      {id: 17, name: '嘉義市'},
      {id: 18, name: '嘉義縣'},
      {id: 19, name: '彰化縣'},
      {id: 20, name: '臺中市'},
      {id: 21, name: '臺中縣'},
      {id: 22, name: '臺北市'},
      {id: 23, name: '臺北縣'},
      {id: 24, name: '臺東市'},
      {id: 25, name: '臺東縣'},
      {id: 26, name: '臺南市'},
      {id: 27, name: '臺南縣'},
      {id: 28, name: '澎湖縣'},
    ] as const
    const districts = ref<Area[]>([{id: 0, name: '全部'}])
    const villages = ref<Area[]>([{id: 0, name: '全部'}])
    
    const teams = ref<Team[] | undefined>(undefined)
    
    getPollCounts({
      term: 15,
      countyId: 0,
      districtId: 0,
      villageId: 0
    }).then((data) => {
      teams.value = data
    })
    
    watch(term, () => {
      console.log('term', countyId.value)
      countyId.value = 0
    })
    watch(countyId, async () => {
      console.log('district', districtId.value, countyId.value)
      districtId.value = 0
      if (countyId.value !== 0) {
      	districts.value = [{id: 0, name: '全部'}].concat(await getDistricts(countyId.value))
      }
    })
    watch(districtId, async () => {
      console.log('village', villageId.value)
      villageId.value = 0
      if (countyId.value !== 0 && districtId.value !== 0) {
        villages.value = [{id: 0, name: '全部'}].concat(await getVillages({districtId: districtId.value, countyId: countyId.value}))
      }
    })
    watch(villageId, async () => {
      console.log('update')
      teams.value = await getPollCounts({
        term: term.value,
        countyId: countyId.value,
        districtId: districtId.value,
        villageId: villageId.value
      })
    })
    return {term, countyId, districtId, villageId, terms, counties, districts, villages, teams}
  }
})
</script>

<style scoped>
.home {
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  justify-content: center;
  gap: 16px;
  overflow: auto;
}

.conditions {
  grid-column: 1 / 3;
  border-radius: 24px;
  padding: 16px;
  background: white;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.conditions > span {
  grid-column: 1 / 5;
  font-size: 2em;
}
.conditions > label {
  display: flex;
  flex-direction: column;
}
.conditions > label > select {
  font-size: 1.5em;
  border-radius: 8px;
  border: none;
  background: #42b983;
  color: white;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

table {
  border-radius: 24px;
  padding: 16px;
  background: white;
  font-size: 1.5em;
  text-align: center;
}

.opinion-poll {
  grid-column: 1 / 3;
  font-size: 2em;
  border-radius: 8px;
  border: none;
  background: #42b983;
  color: white;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.opinion-poll:hover {
  background: #3daa7d;
}
</style>
