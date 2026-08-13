import NotificationForm from "@/components/notification/NotificationForm";
import NotificationLog from "@/components/notification/NotificationLog";
import { useEffect, useState } from "react";

const Notification = () => {
  const [activeTab, setActiveTab] = useState("notifications");
  const [editId, setEditId] = useState(null);
  useEffect(() => {
    const savedTab = localStorage.getItem("notification-active-tab");
    if (savedTab) setActiveTab(savedTab);
  }, []);

  const handleTabChange = (value) => {
    setActiveTab(value);
    localStorage.setItem("notification-active-tab", value);
       if (value !== "notifications") {
      setEditId(null);
    }
  };
  const handleEdit = (id) => {
    setEditId(id);
    handleTabChange("notifications");
  };

  const handleFormSuccess = () => {
    setEditId(null);
    handleTabChange("logs");
  };
  return (
    <div className="w-full">
      <div className="flex border-b">
        <div
          onClick={() => handleTabChange("notifications")}
          className={`cursor-pointer px-4 py-2 text-sm font-medium ${
            activeTab === "notifications"
              ? "border-b-2 border-black text-black font-semibold"
              : "text-gray-500"
          }`}
        >
          Notifications
        </div>
        <div
          onClick={() => handleTabChange("logs")}
          className={`cursor-pointer px-4 py-2 text-sm font-medium ${
            activeTab === "logs"
              ? "border-b-2 border-black text-black font-semibold"
              : "text-gray-500"
          }`}
        >
          Notification Logs
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "notifications" && (
          <NotificationForm
            onSuccessSubmit={handleFormSuccess}
            editId={editId}
          />
        )}
        {activeTab === "logs" && <NotificationLog  onEdit={handleEdit}/>}
      </div>
    </div>
  );
};

export default Notification;
