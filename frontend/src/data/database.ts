import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3000';

export type UserConfig = {
  id: string;
  name: string;
  voted: boolean;
  station: string;
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

export type Team = {
  president: string;
  vicePresident: string;
  party: string;
  total: number;
}

export async function getUserConfig(): Promise<UserConfig | null> {
  return Promise.resolve(null)
  // const response = await axios.get("/api/users");
  // console.log(response.data)
  // return response.data;
}

export async function getPollCounts(condition: Condition): Promise<Team[]> {
  // return Promise.resolve([])
  const response = await axios.post('/api/search_poll', condition)
  console.log(response.data)
  return response.data
}

export async function getDistricts(countyId: number): Promise<Area[]> {
  // return Promise.resolve([])
  const response = await axios.post('/api/search_district', {countyId})
  console.log(response.data)
  return response.data
}

export async function getVillages(condition: {countyId: number, districtId: number}): Promise<Area[]> {
  // return Promise.resolve([])
  const response = await axios.post('/api/search_village', condition)
  console.log(response.data)
  return response.data
}
