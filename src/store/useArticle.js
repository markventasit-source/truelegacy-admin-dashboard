import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticles,
  updateArticle,
} from "@/api/articlesApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetArticles = (filter) => {
  return useQuery({
    queryKey: ["articles", filter],
    queryFn: () => getArticles(filter),
    keepPreviousData: true,
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries(["articles"]);
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateArticle(id, data),
    onSuccess: (_responseData, variables) => {
      queryClient.invalidateQueries(["articles"]);
      queryClient.invalidateQueries(["article", variables.id]);
    },
  });
};

export const useArticleById = (id) => {
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id),
    enabled: !!id,
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries(["articles"]);
    },
  });
};
