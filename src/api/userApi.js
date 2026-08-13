import axiosInstance from "./axiosintercepter";

export const getUsers = async (filter) => {
  try {
    const response = await axiosInstance.get(`/user`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};



export const updateUser = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/user/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateStatus= async (id) => {
  try {
    const response = await axiosInstance.put(`/user/suspend/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const bulkDelete = async (data) => {
  try {
    const response = await axiosInstance.post(`/user/bulk-delete`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const createUser = async (data) => {
  try {
    const response = await axiosInstance.post(`/auth/user-signup`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};