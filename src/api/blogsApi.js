import axiosInstance from "./axiosintercepter";
import {
  extractBlogId,
  filterByContentType,
  paginateItems,
  removeContentType,
  setContentType,
} from "@/utils/contentTypeRegistry";

const BLOG_TYPE = "blog";

export const getBlogs = async (filter = {}) => {
  try {
    const { page_no, limit, ...rest } = filter;
    const response = await axiosInstance.get(`/pages/blogs`, {
      params: { ...rest, type: BLOG_TYPE, page_no: 1, limit: 1000 },
    });
    const blogs = filterByContentType(response.data?.data, BLOG_TYPE);

    if (page_no == null && limit == null) {
      return {
        ...response.data,
        data: blogs,
        total_count: blogs.length,
      };
    }

    return {
      ...response.data,
      data: paginateItems(blogs, page_no || 1, limit || 10),
      total_count: blogs.length,
    };
  } catch (error) {
    throw error.response.data;
  }
};

export const getBlogById = async (id) => {
  try {
    const response = await axiosInstance.get(`/pages/blog/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createBlog = async (data) => {
  try {
    const response = await axiosInstance.post(`/pages/blog`, {
      ...data,
      type: BLOG_TYPE,
    });
    const id = extractBlogId(response.data);
    if (id) setContentType(id, BLOG_TYPE);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateBlog = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/pages/blog/${id}`, {
      ...data,
      type: BLOG_TYPE,
    });
    setContentType(id, BLOG_TYPE);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteBlog = async (id) => {
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
