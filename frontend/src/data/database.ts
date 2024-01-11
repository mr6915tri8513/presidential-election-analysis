import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3000';

export type UserConfig = {
  id: string;
  name: string;
}

export async function getUserConfig(): Promise<UserConfig | null> {
  const response = await axios.get("/api/users");
  console.log(response.data)
  return response.data;
}