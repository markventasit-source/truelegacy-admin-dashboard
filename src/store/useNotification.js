import {
  bulkDelete,
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotifications,
  sendNotification,
  updateNotification,
} from "@/api/notificationApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetNotifications = (filter) => {
  return useQuery({
    queryKey: ["notifications", filter],
    queryFn: () => getNotifications(filter),
    keepPreviousData: true,
  });
};

export const useNotificationById = (id) => {
  return useQuery({
    queryKey: ["notification", id],
    queryFn: () => getNotificationById(id),
    enabled: !!id,
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });
};

export const useSendNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => sendNotification(id),
    onSuccess: (responseData, variables) => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["notification", variables.id]);
    },
  });
};
export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateNotification(id, data),
    onSuccess: (responseData, variables) => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["notification", variables.id]);
    },
  });
};
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });
};
export const useBulkDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDelete,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });
};
