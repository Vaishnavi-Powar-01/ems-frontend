import API from "./axios";

export const assignPermissions =
  async (data) => {

    const res =
      await API.post(
        "/permissions/assign",
        data
      );

    return res.data;
};