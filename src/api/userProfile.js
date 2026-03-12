import { http } from "./http";
import { API } from "./endpoints";

export const apiGetMyProfile = () => http.get(API.USERS.ME);
export const apiUpdateMyProfile = (payload) => http.put(API.USERS.UPDATE, payload);
