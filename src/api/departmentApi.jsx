import API from "./axios";

export const getDepartments =
  async () => {

    const res =
      await API.get(
        "/departments"
      );

    return res.data;
};

export const addDepartment =
  async (data) => {

    const res =
      await API.post(
        "/departments/add",
        data
      );

    return res.data;
};