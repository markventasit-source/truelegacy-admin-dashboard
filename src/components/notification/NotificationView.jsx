import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useNotificationById,
  useSendNotification,
} from "@/store/useNotification";
import Loader from "../ui/Loader";
import { Calendar, User, FileText } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";

const Badge = ({ children, variant }) => {
  const variants = {
    type: "bg-blue-100 text-blue-700",
    statusDrafted: "bg-amber-100 text-amber-700",
    statusSent: "bg-emerald-100 text-emerald-700",
    default: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-md ${
        variants[variant] || variants.default
      }`}
    >
      {children}
    </span>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2">
    {Icon && <Icon className="w-4 h-4 text-gray-500 mt-0.5" />}
    <div>
      <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
        {label}
      </p>
      <p className="text-sm text-gray-800 capitalize">{value}</p>
    </div>
  </div>
);

const NotificationView = ({ open, onClose, id }) => {
  const { data: notifications, isLoading } = useNotificationById(id);
  const { mutate: sendNotificationMutation, isPending } = useSendNotification();
  const [isSending, setIsSending] = useState(false);
  const notification = notifications?.data;

  const handleSendNotification = () => {
    setIsSending(true);
    sendNotificationMutation(
      { id },
      {
        onSuccess: (response) => {
          setIsSending(false);
          toast.success(response?.message || "Notification sent successfully!");
          onClose();
        },
        onError: (error) => {
          setIsSending(false);
          toast.error(
            error?.response?.data?.message || "Failed to send notification."
          );
        },
        onSettled: () => setIsSending(false),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl p-0 bg-white rounded-xl overflow-hidden flex flex-col max-h-[80vh]">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader />
          </div>
        ) : notification ? (
          <>
            <div className="px-6 py-4 border-b flex-shrink-0">
              <DialogHeader className="p-0">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {notification?.subject}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                <Badge
                  variant={
                    notification?.status === "drafted"
                      ? "statusDrafted"
                      : notification?.status === "sended"
                      ? "statusSent"
                      : "default"
                  }
                >
                  {notification?.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto px-6 py-5 space-y-5 custom-scrollbar"
              style={{
                scrollbarWidth: "thin",
                // scrollbarColor: "#CBD5E1 transparent",
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <InfoRow
                  icon={FileText}
                  label="Type"
                  value={
                    <div className="flex flex-wrap gap-2">
                      {notification?.type.map((t) => (
                        <Badge key={t} variant="type">
                          {t.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  }
                />
                <InfoRow
                  icon={User}
                  label="Target Role"
                  value={notification?.role}
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Description
                </p>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {notification?.content}
                  </p>
                </div>
              </div>
              {notification?.image && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                    Attached Image
                  </p>
                  <img
                    src={notification?.image}
                    alt="Notification"
                    className="rounded-md border max-h-48 object-contain"
                  />
                </div>
              )}
              <InfoRow
                icon={Calendar}
                label="Created"
                value={moment(notification?.createdAt).format(
                  "MMM DD, YYYY [at] hh:mm A"
                )}
              />
            </div>
            {notification?.status === "drafted" && (
              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end flex-shrink-0">
                <Button
                  onClick={handleSendNotification}
                  disabled={isSending || isPending}
                >
                  {isSending || isPending ? "Sending..." : "Send Notification"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileText className="w-8 h-8 text-gray-400 mb-3" />
            <p className="text-gray-600 font-medium">No notification found</p>
            <p className="text-sm text-gray-400">
              The notification you’re looking for doesn’t exist
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationView;
