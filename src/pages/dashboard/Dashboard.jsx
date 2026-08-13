import { getDashboard } from "@/api/dashboardApi";
import LineChartCard from "@/components/dashboard/LineChartCard";
import NotificationSummary from "@/components/dashboard/NotificationSummary";
import PieChartCard from "@/components/dashboard/PieChartCard";
import DashboardCard from "@/components/ui/DashboardCard";

import {
  ShieldQuestionMark,
  Upload,
  UserRoundPenIcon,
  UsersRound,
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await getDashboard();
      setDashboard(res?.data);
    };
    fetchDashboard();
  }, []);
  const pieData = [
    { name: "Resolved", value: dashboard?.enquiries?.resolved || 0 },
    { name: "In Progress", value: dashboard?.enquiries?.progress || 0 },
  ];
  const convertActivityChart = (chartData) => {
    if (!chartData) return [];

    const order = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    return order.map((day) => {
      const item = chartData[day] || {};
      return {
        day: day.substring(0, 3),
        admin: item.admin_actions || 0,
        login: item.user_logins || 0,
        documents: item.documents_uploaded || 0,
      };
    });
  };
  const lineChartData = convertActivityChart(
    dashboard?.activity_overview_chart
  );

  return (
    <>
      <div className="mt-4 grid lg:grid-cols-4 grid-cols-2 gap-4 mb-6">
        <DashboardCard
          title="Total Members"
          value={dashboard?.active_users || "0"}
          change={dashboard?.total_members + " Active" || "0"}
          isPositive={true}
          Icon={UserRoundPenIcon}
        />

        <DashboardCard
          title="Total Guests"
          value={dashboard?.total_guest || "0"}
          change={moment().format("MMM YYYY") || "0"}
          isPositive={true}
          Icon={UsersRound}
        />

        <DashboardCard
          title="Total Enquiries"
          value={dashboard?.total_enquiries || "0"}
          change={dashboard?.todays_enquiries + " today" || "0"}
          isPositive={dashboard?.todays_enquiries > 0}
          Icon={ShieldQuestionMark}
        />

        <DashboardCard
          title="Documents Uploaded"
          value="0"
          change="0 this week"
          isPositive={true}
          Icon={Upload}
        />
      </div>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
        <LineChartCard
          title="Activity Overview"
          subtitle="Weekly trends for user engagement and platform activity"
          data={lineChartData}
        />

        <PieChartCard
          title="Enquiries Breakdown"
          subtitle="January - June 2024"
          data={pieData}
        />
        <NotificationSummary
          data={{
            total_sent: dashboard?.total_notifications,
            success: dashboard?.sucess_notifications,
            scheduled: dashboard?.scheduled_notifications,
            failed: dashboard?.failed_notifications,
          }}
        />
      </div>
    </>
  );
};

export default Dashboard;
