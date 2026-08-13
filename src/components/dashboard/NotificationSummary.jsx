import { ShieldCheck, Clock, ShieldX, Navigation } from "lucide-react";

const NotificationSummary = ({ data }) => {
  return (
    <div className="p-5 border border-[#E4E4E7] rounded-xl shadow-xs">
      <h2 className="text-base font-semibold">Notifications Summary</h2>
      <p className="text-xs text-gray-500 mt-1 mb-4">
        Email delivery and notification tracking
      </p>

      <div className="flex flex-col gap-4 text-xs">
        <div className="p-4 border rounded-xl flex justify-between items-center">
          <div>
            <p className="text-gray-600">Total Sent</p>
            <p className="text-xl font-bold">{data?.total_sent || 0}</p>
          </div>
          <Navigation className="text-gray-400 w-4 h-4" />
        </div>
        <div className="p-4 border rounded-xl flex justify-between items-center">
          <div>
            <p className="text-gray-600">Successfully Sent</p>
            <p className="text-xl font-bold">{data?.success || 0}</p>
          </div>
          <ShieldCheck className="text-[#1EAF01] w-4 h-4" />
        </div>
        <div className="p-4 border rounded-xl flex justify-between items-center">
          <div>
            <p className="text-gray-600">Scheduled</p>
            <p className="text-xl font-bold">{data?.scheduled || 0}</p>
          </div>
          <Clock className="text-[#AD830E] w-4 h-4" />
        </div>
        <div className="p-4 border rounded-xl flex justify-between items-center">
          <div>
            <p className="text-gray-600">Failed</p>
            <p className="text-xl font-bold">{data?.failed || 0}</p>
          </div>
          <ShieldX className="text-[#F1090D] w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default NotificationSummary;
