import axiosInstance from "./axiosintercepter";

export const getLogs = async (filter) => {
  try {
    const response = await axiosInstance.get(`/logs`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getLogById = async (id) => {
  try {
    const response = await axiosInstance.get(`/logs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
