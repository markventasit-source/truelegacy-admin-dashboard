
import { toast } from "sonner";
import axiosInstance from "./axiosintercepter";

export const upload = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axiosInstance.post(`upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "An error occurred during file upload";
    toast.error(errorMsg);
    throw error;
  }
};
