import {
  bulkDelete,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "@/api/userApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUsers = (filter) => {
  return useQuery({
    queryKey: ["users", filter],
    queryFn: () => getUsers(filter),
    keepPreviousData: true,
  });
};
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

export const useUserById = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id ,data}) => updateUser(id,data),
    onSuccess: (responseData, variables) => {
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["user", variables.id]);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

export const useBulkDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDelete,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};
