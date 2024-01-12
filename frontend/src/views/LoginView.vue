<template>
  <div class="login">
    <h1>{{ isLogin ? '登入' : '註冊' }}</h1>
    <label>
      <span>身分證字號</span>
      <input v-model="id" type="text" placeholder="請輸入身分證字號"/>
    </label>
    <label v-if="!isLogin">
      <span>暱稱</span>
      <input v-model="username" type="text" placeholder="請輸入暱稱"/>
    </label>
    <label>
      <span>密碼</span>
      <input v-model="password" type="password" placeholder="請輸入密碼"/>
    </label>
    
    <div v-if="!isLogin" class="station">
      <span>所屬投票所</span>
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
    
    <p v-if="isLogin">
      還沒有帳號嗎？ <a @click="isLogin = false">註冊</a>
    </p>
    <p v-else>
      已經有帳號了嗎？ <a @click="isLogin = true">登入</a>
    </p>
    <button @click="isLogin ? login() : signUp()">
      {{ isLogin ? '登入' : '註冊' }}
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject, ref, watch} from "vue";
import {userConfigKey} from "@/injection_keys";
import router from "@/router";
import {apiLogin, apiSignUp, getDistricts, getVillages} from "@/data/database";
import type {Area} from "@/data/database";

export default defineComponent({
  name: "LoginView",
  setup() {
    const userConfig = inject(userConfigKey, ref())
    const isLogin = ref(true)
    
    const id = ref('')
    const username = ref('')
    const password = ref('')
    
    const countyId = ref<number>(0)
    const districtId = ref<number>(0)
    const villageId = ref<number>(0)
    const counties = [
      {id: 0, name: '請選擇縣市'},
      {id: 1, name: '宜蘭縣'},
      {id: 2, name: '花蓮縣'},
      {id: 3, name: '金門縣'},
      {id: 4, name: '南投縣'},
      {id: 5, name: '屏東縣'},
      {id: 6, name: '苗栗縣'},
      {id: 7, name: '桃園市'},
      {id: 9, name: '高雄市'},
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
      {id: 22, name: '臺北市'},
      {id: 24, name: '臺東市'},
      {id: 25, name: '臺東縣'},
      {id: 26, name: '臺南市'},
      {id: 28, name: '澎湖縣'},
    ] as const
    const districts = ref<Area[]>([{id: 0, name: '請選擇鄉政市區'}])
    const villages = ref<Area[]>([{id: 0, name: '請選擇村里'}])
    
    if (userConfig.value) {
      router.push('/user/')
    }
    
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
    
    function checkId(): boolean {
      if (!id.value.match(/^[A-Z][12]\d{8}$/)) {
        alert('請輸入合法的身分證字號')
        return false
      }
      
      let sum = id.value.charCodeAt(0) - 55
      sum = ~~(sum / 10) + sum % 10 * 9;
      for (let i = 1; i < 9; i++) {
        sum += (id.value.charCodeAt(i) - 48) * (9 - i)
      }
      if (10 - sum % 10 !== id.value.charCodeAt(9) - 48) {
        alert('請輸入合法的身分證字號')
        return false
      }
      return true
    }
    
    function checkEscape(value: string) {
      if (/['"\\]/.test(value)) {
        alert('請勿輸入單引號或雙引號')
        return false
      }
      return true
    }
    
    function checkStation(): boolean {
      if (countyId.value === 0) {
        alert('請選擇縣市')
        return false
      }
      if (districtId.value === 0) {
        alert('請選擇鄉鎮市區')
        return false
      }
      if (villageId.value === 0) {
        alert('請選擇村里')
        return false
      }
      return true
    }
    
    function login() {
      if (!id.value) {
        alert('請輸入身分證字號')
        return
      }
      if (!checkEscape(id.value)) {
        return
      }
      if (!checkId()) return
      
      if (!password.value) {
        alert('請輸入密碼')
        return
      }
      if (!checkEscape(password.value)) {
        return
      }
      
      apiLogin(id.value, password.value).then((config) => {
        if (config === null) {
          alert('身分證字號或密碼不正確')
          return
        }
        
        userConfig.value = config
        router.replace('/user/')
      })
    }
    
    function signUp() {
      if (!id.value) {
        alert('請輸入身分證字號')
        return
      }
      if (!checkEscape(id.value)) {
        return
      }
      if (!checkId()) return
      
      if (!checkEscape(username.value)) {
        return
      }
      
      if (!password.value) {
        alert('請輸入密碼')
        return
      }
      if (!checkEscape(password.value)) {
        return
      }
      if (!checkStation()) {
        return
      }
      
      apiSignUp(id.value, username.value, password.value, villageId.value).then((config) => {
        if (config === null) {
          alert('此身分證字號已被註冊')
          return
        }
        
        userConfig.value = config
        router.replace('/user/')
      })
    }
    
    return {
      isLogin,
      id, username, password,
      countyId, districtId, villageId,
      counties, districts, villages,
      login, signUp
    }
  }
})
</script>

<style scoped>
.login {
  border-radius: 24px;
  padding: 16px 32px;
  background: white;
  font-size: 1.5em;
  text-align: center;
}
h1 {
  margin: 0;
}

label > span {
  display: block;
  margin-block: 16px;
  text-align: start;
  font-weight: bold;
}
label > input {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid lightgray;
}

.station {
  border-radius: 24px;
  padding: 16px;
  background: white;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  gap: 16px;
}
.station > span {
  font-weight: bold;
}
.station > label {
  display: flex;
  flex-direction: column;
}
.station > label > select {
  font-size: 1em;
  border-radius: 8px;
  border: none;
  background: #42b983;
  color: white;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.station > label > select:hover {
  background: #3daa7d;
}
.station > label > select:disabled {
  background: #ccc;
  cursor: not-allowed;
}

p {
  font-size: 0.8em;
  margin-block: 16px;
}
p > a {
  color: #42b983;
  cursor: pointer;
  text-decoration: underline;
}

button {
  width: 50%;
  border-radius: 8px;
  border: none;
  margin-inline: auto;
  padding: 8px 16px;
  background: #42b983;
  display: block;
  font-size: 1em;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: #3daa7d;
}
</style>
