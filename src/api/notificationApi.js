import axiosInstance from "./axiosintercepter";

export const getNotifications = async (filter) => {
  try {
    const response = await axiosInstance.get(`/notification`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getNotificationById = async (id) => {
  try {
    const response = await axiosInstance.get(`/notification/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const createNotification = async (data) => {
  try {
    const response = await axiosInstance.post(`/notification`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const sendNotification = async (id, data) => {
  try {
    const response = await axiosInstance.post(`/notification/send/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const updateNotification = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/notification/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const deleteNotification = async (id) => {
  try {
    const response = await axiosInstance.delete(`/notification/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const bulkDelete = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/notification/bulk-delete`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
