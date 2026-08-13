import { deleteEnquiry, getEnquiries, getEnquiryById, updateEnquiry } from "@/api/enquiryApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export const useGetEnquiries = (filter) => {
  return useQuery({
    queryKey: ["enquiries", filter],
    queryFn: () => getEnquiries(filter),
    keepPreviousData: true,
  });
};

export const useUpdateEnquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateEnquiry(id, data),
    onSuccess: (responseData, variables) => {
      queryClient.invalidateQueries(["enquiries"]);
      queryClient.invalidateQueries(["enquiry", variables.id]);
    },
  });
};
export const useEnquiryById = (id) => {
  return useQuery({
    queryKey: ["enquiry", id],
    queryFn: () => getEnquiryById(id),
    enabled: !!id,
  });
};
export const useDeleteEnquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEnquiry,
    onSuccess: () => {
      queryClient.invalidateQueries(["enquiries"]);
    },
  });
};
