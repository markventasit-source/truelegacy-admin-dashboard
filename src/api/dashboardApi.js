import axiosInstance from "./axiosintercepter";

export const getDashboard = async (filter) => {
  try {
    const response = await axiosInstance.get(`/dashboard`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
