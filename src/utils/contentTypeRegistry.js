const STORAGE_KEY = "truelegacy_content_types";

const readRegistry = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const writeRegistry = (registry) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
};

export const setContentType = (id, type) => {
  if (!id || !type) return;
  const registry = readRegistry();
  registry[id] = type;
  writeRegistry(registry);
};

export const removeContentType = (id) => {
  if (!id) return;
  const registry = readRegistry();
  delete registry[id];
  writeRegistry(registry);
};

const KNOWN_TYPES = ["blog", "article", "event", "news"];

export const getContentType = (item) => {
  if (!item) return "blog";
  if (KNOWN_TYPES.includes(item.type)) return item.type;
  const registry = readRegistry();
  return registry[item._id] || "blog";
};

export const extractBlogId = (responseData) =>
  responseData?.data?.blog?._id ||
  responseData?.data?.article?._id ||
  responseData?.data?.event?._id ||
  responseData?.data?.news?._id ||
  responseData?.data?._id ||
  responseData?._id;

export const filterByContentType = (items, type) =>
  (items || []).filter((item) => getContentType(item) === type);

export const paginateItems = (items, pageNo = 1, limit = 10) => {
  const start = (pageNo - 1) * limit;
  return items.slice(start, start + limit);
};
