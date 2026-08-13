/** Normalize related blog refs to ObjectId strings for API payloads. */
export function toRelatedBlogIds(related) {
  if (!Array.isArray(related)) {
    return related ? [typeof related === "string" ? related : related?._id].filter(Boolean) : [];
  }
  return related
    .map((item) => (typeof item === "string" ? item : item?._id || item?.id))
    .filter(Boolean)
    .map(String);
}

/** Strip mongoose subdocument noise before create/update. */
export function toSubSections(sections) {
  if (!Array.isArray(sections)) return [];
  return sections
    .filter((s) => s && (s.title || s.content))
    .map((s) => ({
      title: String(s.title || "").trim(),
      content: String(s.content || "").trim(),
    }));
}

/** SEO fields — always send trimmed strings so edits persist. */
export function toSeoFields(data = {}) {
  return {
    meta_title: String(data.meta_title || "").trim(),
    meta_description: String(data.meta_description || "").trim(),
    meta_keywords: String(data.meta_keywords || "").trim(),
    image_alt: String(data.image_alt || "").trim(),
  };
}

/** Resolve blog/article payload from GET /pages/blog/:id response shapes. */
export function unwrapContentEntity(responseData) {
  const data = responseData?.data;
  if (!data) return null;
  return data.blog || data.article || data.event || data.news || data;
}
