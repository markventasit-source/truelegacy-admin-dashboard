import axiosInstance from "./axiosintercepter";

export const getEnquiries = async (filter) => {
  try {
    const response = await axiosInstance.get(`/enquiries`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getEnquiryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/enquiries/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateEnquiry = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/enquiries/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const deleteEnquiry = async (id) => {
  try {
    const response = await axiosInstance.delete(`/enquiries/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
