import API from "./axios";

export const getRoles =
  async () => {

    const res =
      await API.get(
        "/roles"
      );

    return res.data;
};

export const addRole =
  async (data) => {

    const res =
      await API.post(
        "/roles/add",
        data
      );

    return res.data;
};