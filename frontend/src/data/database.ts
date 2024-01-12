import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3000';

export type UserConfig = {
  id: string;
  name: string;
  voteTeam?: string;
  stationId: string;
}

export type Area = {
  id: number
  name: string
}

export type Condition = {
  term: number;
  countyId: number;
  districtId: number;
  villageId: number;
}

export type TeamInfo = {
  president: string;
  vicePresident: string;
  party: string;
}

export type Team = TeamInfo & {
  total: number;
}

export type VoteTeamInfo = TeamInfo & {
  team: string;
}

export type StationInfo = {
  county: string;
  district: string;
  village: string;
}

export async function getUserConfig(): Promise<UserConfig | null> {
  // return Promise.resolve(null)
  const response = await axios.get("/api/users");
  console.log(response.data)
  return response.data;
}

export async function getPollCounts(condition: Condition): Promise<Team[]> {
  // return Promise.resolve([{president: '蔡英文', vicePresident: '賴清德', party: '民進黨', total: 100}, {president: '韓國瑜', vicePresident: '張善政', party: '中國國民黨', total: 50}, {president: '宋楚瑜', vicePresident: '余湘', party: '親民黨', total: 30}])
  const response = await axios.post('/api/search_poll', condition)
  console.log(response.data)
  return response.data
}

export async function getDistricts(countyId: number): Promise<Area[]> {
  // return Promise.resolve([{id: 1, name: '台北市'}, {id: 2, name: '新北市'}, {id: 3, name: '桃園市'}])
  const response = await axios.post('/api/search_district', {countyId})
  console.log(response.data)
  return response.data
}

export async function getVillages(condition: {countyId: number, districtId: number}): Promise<Area[]> {
  // return Promise.resolve([{id: 1, name: '中正里'}, {id: 2, name: '中山里'}, {id: 3, name: '中和里'}])
  const response = await axios.post('/api/search_village', condition)
  console.log(response.data)
  return response.data
}

export async function apiLogin(id: string, password: string): Promise<UserConfig | null> {
  // return Promise.resolve(null)
  const response = await axios.post('/api/login', {id, password})
  console.log(response.data)
  return response.data[0] || null
}

export async function apiSignUp(id: string, name: string, password: string, stationId: number): Promise<UserConfig | null> {
  // return Promise.resolve(null)
  const response = await axios.post('/api/signup', {id, name, password, stationId})
  console.log(response.data)
  return response.data[0] || null
}

export async function getStationInfo(stationId: string): Promise<StationInfo> {
  // return Promise.resolve({county: '台北市', district: '中正區', village: '中正里'})
  const response = await axios.post('/api/get_station_info', {stationId})
  console.log(response.data)
  return response.data[0]
}

export async function getTeamInfo(team: string): Promise<TeamInfo> {
  // return Promise.resolve({president: '蔡英文', vicePresident: '賴清德', party: '民進黨'})
  const response = await axios.post('/api/get_team_info', {team})
  console.log(response.data)
  return response.data[0]
}

export async function updateUserName(id: string, name: string): Promise<UserConfig> {
  const response = await axios.post('/api/update_username', {id, name})
  console.log(response.data)
  return response.data[0]
}

export async function getVoteTeams(): Promise<VoteTeamInfo[]> {
  // return Promise.resolve([
  //   {team: '1', president: '蔡英文', vicePresident: '賴清德', party: '民進黨'},
  //   {team: '2', president: '韓國瑜', vicePresident: '張善政', party: '中國國民黨'},
  //   {team: '3', president: '宋楚瑜', vicePresident: '余湘', party: '親民黨'}
  // ])
  const response = await axios.get('/api/get_vote_teams')
  console.log(response.data)
  return response.data
}

export async function apiVote(id: string, team: string): Promise<boolean> {
  // return Promise.resolve(true)
  const response = await axios.post('/api/vote', {id, team})
  console.log(response.data)
  return response.data[0]
}