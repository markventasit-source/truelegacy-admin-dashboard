import { getLogById, getLogs } from "@/api/adminLogApi";
import { useQuery } from "@tanstack/react-query";
export const useGetLogs = (filter) => {
  return useQuery({
    queryKey: ["logs", filter],
    queryFn: () => getLogs(filter),
    keepPreviousData: true,
  });
};
export const useLogById = (id) => {
  return useQuery({
    queryKey: ["log", id],
    queryFn: () => getLogById(id),
    enabled: !!id,
  });
};
