import axiosInstance from "./axiosintercepter";
import {
  extractBlogId,
  filterByContentType,
  paginateItems,
  removeContentType,
  setContentType,
} from "@/utils/contentTypeRegistry";

const ARTICLE_TYPE = "article";

export const getArticles = async (filter = {}) => {
  try {
    const { page_no, limit, ...rest } = filter;
    const response = await axiosInstance.get(`/pages/blogs`, {
      params: { ...rest, type: ARTICLE_TYPE, page_no: 1, limit: 1000 },
    });
    const articles = filterByContentType(response.data?.data, ARTICLE_TYPE);

    if (page_no == null && limit == null) {
      return {
        ...response.data,
        data: articles,
        total_count: articles.length,
      };
    }

    return {
      ...response.data,
      data: paginateItems(articles, page_no || 1, limit || 10),
      total_count: articles.length,
    };
  } catch (error) {
    throw error.response.data;
  }
};

export const getArticleById = async (id) => {
  try {
    const response = await axiosInstance.get(`/pages/blog/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createArticle = async (data) => {
  try {
    const response = await axiosInstance.post(`/pages/blog`, {
      ...data,
      type: ARTICLE_TYPE,
    });
    const id = extractBlogId(response.data);
    if (id) setContentType(id, ARTICLE_TYPE);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateArticle = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/pages/blog/${id}`, {
      ...data,
      type: ARTICLE_TYPE,
    });
    setContentType(id, ARTICLE_TYPE);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteArticle = async (id) => {
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
