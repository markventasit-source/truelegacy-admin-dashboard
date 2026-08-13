import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "@/api/eventsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetEvents = (filter) => {
  return useQuery({
    queryKey: ["events", filter],
    queryFn: () => getEvents(filter),
    keepPreviousData: true,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateEvent(id, data),
    onSuccess: (_responseData, variables) => {
      queryClient.invalidateQueries(["events"]);
      queryClient.invalidateQueries(["event", variables.id]);
    },
  });
};

export const useEventById = (id) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id),
    enabled: !!id,
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });
};
