const apiEndPoint = "https://training.digimal.uonbi.ac.ke/api";
import axios from "axios";
const AxionInstance = axios.create({
  baseURL: apiEndPoint,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});
const ke_org_id = "HfVjCurKXH2";

const getAuth = async () => {
  const logindata = {
    id_no: 38499180,
    password: "Muyucha12@",
  };
  const data = await AxionInstance.post("/login", logindata);

  //store token in local storage
  localStorage.setItem("token", data.data.token);
  return data;
};

const get_sub_counties_list = async (parent_id) => {
  const data = await AxionInstance.get(
    `/get_sub_counties_list?parent_id=${parent_id}`
  );
  return data?.data.message;
};

const Distribution_Post = async () => {
  const data = await AxionInstance.get("/post_data");
  return data?.data || [];
};

const CountyVillages = async (county_id) => {
  const data = await AxionInstance.get(
    `/administrative_unit?county_id=${county_id}`
  );
  return data;
};

const SubCountyVillages = async (sub_county_id) => {
  const data = await AxionInstance.get(
    `get_org_unit_with_children?subcounty_id=${sub_county_id}`
  );
  return data;
};

const WardVillages = async (ward_id) => {
  const data = await AxionInstance.get(
    `get_org_unit_with_children?ward_id=${ward_id}`
  );
  return data;
};

const LocationVillages = async (location_id) => {
  const data = await AxionInstance.get(
    `get_org_unit_with_children?location_id=${location_id}`
  );
  return data;
};

const SubLocationVillages = async (sub_location_id) => {
  const data = await AxionInstance.get(
    `get_org_unit_with_children?sub_location_id=${sub_location_id}`
  );
  return data;
};

const VillageData = async (village_id) => {
  const data = await AxionInstance.get(
    `get_org_unit_with_children?sublocation_id=${village_id}`
  );
  return data;
};

const PostVillageCoordinates = async (_data) => {
  const data = await AxionInstance.post("village_coordinates", _data);
  return data;
};

const retrive_Org_units = async () => {
  const county_org_data = await get_sub_counties_list(ke_org_id);
  return county_org_data;
};
const homabay_org_sub_county = async () => {
  const data = await get_sub_counties_list("nK0A12Q7MvS");
  return data;
};

const get_county_data = async (county_id) => {
  const sub_county = [];
  const word = [];
  const location = [];
  const sub_location = [];

  const sub_county_data = await AxionInstance.get(
    `get_org_unit_with_children?parent_id=${county_id}`
  );
  sub_county.push(sub_county_data.data.message);

  for (let i = 0; i < sub_county_data.data.message.length; i++) {
    const sub_county_id = sub_county_data.data.message[i].org_id;
    const word_data = await AxionInstance.get(
      `get_org_unit_with_children?parent_id=${sub_county_id}`
    );
    word.push(word_data);
    for (let j = 0; j < word_data?.data.message.length; j++) {
      const ward_id = word_data?.data.message[j].org_id;
      const location_data = await AxionInstance.get(
        `get_org_unit_with_children?parent_id=${ward_id}`
      );
      location.push( location_data.data.message)

      for (let k = 0; k < location_data?.data.message.length; k++) {
        const location_id = location_data?.data.message[k].org_id;
        const sub_location_data = await AxionInstance.get(
          `get_org_unit_with_children?parent_id=${location_id}`
        );
        sub_location.push(sub_location_data?.data.message)

        for (let l = 0; l < sub_location_data?.data.message; l++) {
          const village_id = sub_location_data?.data.message[l].org_id;
          const village_data = await AxionInstance.get(
            `get_org_unit_with_children?parent_id=${village_id}`
          );
          sub_location.push(village_data?.data?.message)
        }
      }
    }
  }

  return {
    sub_county,
    word,
    location,
    sub_location,
  };
};

const api = {
  getAuth,
  get_sub_counties_list,
  Distribution_Post,
  CountyVillages,
  PostVillageCoordinates,
  SubCountyVillages,
  WardVillages,
  LocationVillages,
  SubLocationVillages,
  VillageData,
  AxionInstance,
  retrive_Org_units,
  homabay_org_sub_county,
  get_county_data,
};

export default api;
