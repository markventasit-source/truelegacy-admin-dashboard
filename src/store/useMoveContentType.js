import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosintercepter";
import { setContentType } from "@/utils/contentTypeRegistry";

/**
 * Moves a content item to a different type (blog / article / news / event)
 * by calling the shared PUT /pages/blog/:id endpoint with the new `type`
 * and updating the localStorage type registry so the list pages re-classify
 * the item immediately on query invalidation.
 */
export const useMoveContentType = (fromType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, toType, item }) => {
      const response = await axiosInstance.put(`/pages/blog/${id}`, {
        title: item.title,
        slug: item.slug,
        type: toType,
      });
      setContentType(id, toType);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all four list caches so the item moves instantly
      queryClient.invalidateQueries(["blogs"]);
      queryClient.invalidateQueries(["articles"]);
      queryClient.invalidateQueries(["news"]);
      queryClient.invalidateQueries(["events"]);
    },
  });
};
