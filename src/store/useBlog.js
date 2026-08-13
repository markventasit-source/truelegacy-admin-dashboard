import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
} from "@/api/blogsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export const useGetBlogs = (filter) => {
  return useQuery({
    queryKey: ["blogs", filter],
    queryFn: () => getBlogs(filter),
    keepPreviousData: true,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateBlog(id, data),
    onSuccess: (responseData, variables) => {
      queryClient.invalidateQueries(["blogs"]);
      queryClient.invalidateQueries(["blog", variables.id]);
    },
  });
};
export const useBlogById = (id) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
    enabled: !!id,
  });
};
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
  });
};
