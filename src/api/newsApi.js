import axiosInstance from "./axiosintercepter";
import {
  extractBlogId,
  filterByContentType,
  paginateItems,
  removeContentType,
  setContentType,
} from "@/utils/contentTypeRegistry";

const NEWS_TYPE = "news";

export const getNewsItems = async (filter = {}) => {
  try {
    const { page_no, limit, ...rest } = filter;
    const response = await axiosInstance.get(`/pages/blogs`, {
      params: { ...rest, type: NEWS_TYPE, page_no: 1, limit: 1000 },
    });
    const newsItems = filterByContentType(response.data?.data, NEWS_TYPE);

    if (page_no == null && limit == null) {
      return {
        ...response.data,
        data: newsItems,
        total_count: newsItems.length,
      };
    }

    return {
      ...response.data,
      data: paginateItems(newsItems, page_no || 1, limit || 10),
      total_count: newsItems.length,
    };
  } catch (error) {
    throw error.response.data;
  }
};

export const getNewsById = async (id) => {
  try {
    const response = await axiosInstance.get(`/pages/blog/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createNews = async (data) => {
  try {
    const response = await axiosInstance.post(`/pages/blog`, {
      ...data,
      type: NEWS_TYPE,
    });
    const id = extractBlogId(response.data);
    if (id) setContentType(id, NEWS_TYPE);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateNews = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/pages/blog/${id}`, {
      ...data,
      type: NEWS_TYPE,
    });
    setContentType(id, NEWS_TYPE);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteNews = async (id) => {
  try {
    const response = await axiosInstance.delete(`/pages/blog/${id}`);
    if (Array.isArray(id)) {
      id.forEach(removeContentType);
    } else {
      removeContentType(id);
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
