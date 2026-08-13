import axiosInstance from "./axiosintercepter";
import {
  extractBlogId,
  filterByContentType,
  paginateItems,
  removeContentType,
  setContentType,
} from "@/utils/contentTypeRegistry";

const EVENT_TYPE = "event";

export const getEvents = async (filter = {}) => {
  try {
    const { page_no, limit, ...rest } = filter;
    const response = await axiosInstance.get(`/pages/blogs`, {
      params: { ...rest, type: EVENT_TYPE, page_no: 1, limit: 1000 },
    });
    const events = filterByContentType(response.data?.data, EVENT_TYPE);

    if (page_no == null && limit == null) {
      return {
        ...response.data,
        data: events,
        total_count: events.length,
      };
    }

    return {
      ...response.data,
      data: paginateItems(events, page_no || 1, limit || 10),
      total_count: events.length,
    };
  } catch (error) {
    throw error.response.data;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await axiosInstance.get(`/pages/blog/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createEvent = async (data) => {
  try {
    const response = await axiosInstance.post(`/pages/blog`, {
      ...data,
      type: EVENT_TYPE,
    });
    const id = extractBlogId(response.data);
    if (id) setContentType(id, EVENT_TYPE);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateEvent = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/pages/blog/${id}`, {
      ...data,
      type: EVENT_TYPE,
    });
    setContentType(id, EVENT_TYPE);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteEvent = async (id) => {
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
