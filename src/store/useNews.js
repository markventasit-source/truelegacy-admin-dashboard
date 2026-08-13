import {
  createNews,
  deleteNews,
  getNewsById,
  getNewsItems,
  updateNews,
} from "@/api/newsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetNews = (filter) => {
  return useQuery({
    queryKey: ["news", filter],
    queryFn: () => getNewsItems(filter),
    keepPreviousData: true,
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      queryClient.invalidateQueries(["news"]);
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateNews(id, data),
    onSuccess: (_responseData, variables) => {
      queryClient.invalidateQueries(["news"]);
      queryClient.invalidateQueries(["news", variables.id]);
    },
  });
};

export const useNewsById = (id) => {
  return useQuery({
    queryKey: ["news", id],
    queryFn: () => getNewsById(id),
    enabled: !!id,
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries(["news"]);
    },
  });
};
