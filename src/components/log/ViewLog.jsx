import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import moment from "moment";
import { useLogById } from "@/store/useLogs";

function formatJson(obj) {
  if (!obj) return "-";
  return JSON.stringify(obj, null, 2);
}

const StatusPill = ({ value }) => {
  let bgColor, textColor;
  const val = value?.toString().toLowerCase();
  const code = Number(val);

  if (!isNaN(code) && code >= 100 && code < 600) {
    if (code >= 100 && code < 200) {
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
    } else if (code >= 200 && code < 300) {
      bgColor = code === 204 ? "bg-gray-200" : "bg-green-100";
      textColor = code === 204 ? "text-gray-700" : "text-green-800";
    } else if (code >= 300 && code < 400) {
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
    } else if (code >= 400 && code < 500) {
      bgColor = "bg-red-100";
      textColor = "text-red-800";
    } else if (code >= 500 && code < 600) {
      bgColor = "bg-red-200";
      textColor = "text-red-900";
    }
  } else {
    switch (val) {
      case "get":
        bgColor = "bg-blue-100";
        textColor = "text-blue-700";
        break;
      case "post":
        bgColor = "bg-green-100";
        textColor = "text-green-700";
        break;
      case "delete":
        bgColor = "bg-red-100";
        textColor = "text-red-700";
        break;
      case "put":
        bgColor = "bg-orange-100";
        textColor = "text-orange-700";
        break;
      case "patch":
        bgColor = "bg-purple-100";
        textColor = "text-purple-700";
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-600";
    }
  }

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium min-w-[50px] text-center capitalize ${bgColor} ${textColor}`}
    >
      {value?.toString()}
    </span>
  );
};


const ViewLog = ({ open, onClose, id }) => {
  const { data: logs, isLoading } = useLogById(id);
  const log = logs?.data;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full !max-w-4xl max-h-[95vh] overflow-y-auto text-[#334155]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600 mb-3" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-medium flex items-center justify-between">
                View Log
              </DialogTitle>
            </DialogHeader>

            <div className="rounded-lg overflow-hidden min-h-[300px] max-h-[600px] overflow-y-auto">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={log?.user?.image} />
                        <AvatarFallback className="bg-gradient-to-r from-black to-gray-800 text-white">
                          {log?.user_name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium mb-1">
                          {log?.user_name || "Unknown User"}
                        </h3>
                        <p className="text-sm ">{log?.user_type}</p>
                      </div>
                    </div>
                    <div className="border-b border-gray-200 my-4"></div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium">Action:</span>{" "}
                        {log?.action || "-"}
                      </div>
                      <div>
                        <span className="font-medium">Method:</span>{" "}
                        <StatusPill value={log?.method} />
                      </div>
                      <div>
                        <span className="font-medium">Route:</span>{" "}
                        {log?.route || "-"}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{" "}
                        <StatusPill value={log?.status_code} />
                      </div>

                      {log?.error_message && (
                        <div className="text-red-400">
                          <span className="font-medium">Error:</span>{" "}
                          {log?.error_message}
                        </div>
                      )}

                      <div>
                        <span className="font-medium">IP:</span>{" "}
                        {log?.ip || "-"}
                      </div>
                      <div className="leading-relaxed">
                        <span className="font-medium">User Agent:</span>{" "}
                        {log?.user_agent || "-"}
                      </div>
                      <div>
                        <span className="font-medium">Created At:</span>{" "}
                        {log?.createdAt
                          ? moment(log?.createdAt).format("lll")
                          : "-"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block w-px bg-gray-200 mx-4 self-stretch" />

                <div className="flex-1 p-6">
                  <h3 className="text-sm font-semibold mb-3">Request Body</h3>
                  <div className="rounded-lg p-4 max-h-96 overflow-auto">
                    <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                      {log?.request_body
                        ? formatJson(log?.request_body)
                        : "No request body"}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewLog;
