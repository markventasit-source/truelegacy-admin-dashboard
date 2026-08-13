import { useParams } from "@tanstack/react-router";
import { useEnquiryById, useUpdateEnquiry } from "@/store/useEnquiry";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, CheckCircle } from "lucide-react";
import moment from "moment";

const EnquiryView = () => {
  const params = useParams({ strict: false });
  const enquiryId = params.id;
  const { data: enquiryData, isLoading, error } = useEnquiryById(enquiryId);
  const { mutateAsync: updateEnquiry, isLoading: isUpdating } =
    useUpdateEnquiry();

  const [enquiry, setEnquiry] = useState(null);

  useEffect(() => {
    if (enquiryData?.data) setEnquiry(enquiryData.data);
  }, [enquiryData]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading enquiry...</p>
      </div>
    );

  if (error || !enquiry)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Unable to fetch enquiry details.</p>
      </div>
    );

  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="border-[0.8px] border-black/10 rounded-[14px] p-6 ">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-800">
                  Question About {enquiry.source || "General Enquiry"}
                </h2>
                <div className="flex gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full capitalize">
                    {enquiry.status}
                  </span>
                  <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full capitalize">
                    {enquiry.type}
                  </span>
                </div>
              </div>
            </div>

            <hr className="my-3 border-black/10" />

            <div className="grid grid-cols-2 gap-y-3 text-sm ">
              <div className="text-gray-500">From</div>
              <div className="font-medium text-gray-900">{enquiry.name}</div>

              <div className="text-gray-500">Email</div>
              <div className="font-medium text-gray-900">{enquiry.email}</div>

              <div className="text-gray-500">Phone</div>
              <div className="font-medium text-gray-900">{enquiry.phone}</div>

              <div className="text-gray-500">Submitted</div>
              <div className="font-medium text-gray-900">
                {moment(enquiry.created_at).format("lll")}
              </div>

              <div className="text-gray-500">Source</div>
              <div className="font-medium text-gray-900 capitalize ">
                {enquiry.type}
              </div>
            </div>
          </div>
          <div className="border-[0.8px] border-black/10 rounded-[14px] p-6 ">
            <h3 className="text-base font-medium text-gray-800 mb-3">
              Message
            </h3>
            <div className="bg-gray-50 border-none rounded-md p-4 text-sm text-gray-700 leading-relaxed">
              {enquiry.message || "No message provided."}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="border-[0.8px] border-black/10 rounded-[14px] p-6 ">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Status</h3>
            <select
              value={enquiry.status}
              disabled
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
            >
              <option value="new">New</option>
              <option value="progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div className="border-[0.8px] border-black/10 rounded-[14px] p-6 ">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                disabled={isUpdating || enquiry.status === "resolved"}
                onClick={async () => {
                  try {
                    await updateEnquiry({
                      id: enquiry._id,
                      data: { status: "resolved" },
                    });
                    toast.success("Enquiry marked as resolved");
                  } catch (error) {
                    toast.error(error?.message || "Failed to update status");
                  }
                }}
                className={`w-full flex items-center justify-center gap-2 border-[0.8px] border-black/10 rounded-[8px] p-3 text-sm transition ${
                  enquiry.status === "resolved"
                    ? "bg-green-100 text-green-700 border-green-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {isUpdating ? "Updating..." : "Mark as Resolved"}
              </button>

              <button
                onClick={() => window.open(`mailto:${enquiry.email}`)}
                className="w-full flex items-center justify-center gap-2 border-[0.8px] border-black/10 rounded-[8px] p-3 text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                <Mail className="w-4 h-4" /> Open Email Client
              </button>

              <button
                onClick={() => (window.location.href = `tel:${enquiry.phone}`)}
                className="w-full flex items-center justify-center gap-2 border-[0.8px] border-black/10 rounded-[8px] p-3 text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                <Phone className="w-4 h-4" /> Call {enquiry.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryView;
