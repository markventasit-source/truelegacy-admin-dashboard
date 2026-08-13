import { toast } from "sonner";
import axiosInstance from "./axiosintercepter";

export const loginAdmin = async (data) => {
  try {
    const response = await axiosInstance.post(`/auth/login`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getProfile=async()=>{
  try {
    const response = await axiosInstance.get(`/user/profile`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}