import { http } from "./http";
import { API } from "./endpoints";

// GET all saved locations
export const apiGetMySavedLocations = async () => {
  const res = await http.get(API.SAVED_LOCATIONS.MINE);
  return res.data;
};

// CREATE saved location
export const apiCreateSavedLocation = async (payload) => {
  const res = await http.post(API.SAVED_LOCATIONS.CREATE, payload);
  return res.data;
};

// UPDATE saved location
export const apiUpdateSavedLocation = async (id, payload) => {
  const res = await http.put(API.SAVED_LOCATIONS.UPDATE(id), payload);
  return res.data;
};
