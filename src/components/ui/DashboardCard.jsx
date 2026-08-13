const DashboardCard = ({ title, value, change, isPositive, Icon }) => {
  return (
    <div className="p-5 border border-[#E4E4E7] rounded-xl shadow-xs bg-white flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <p className="text-sm text-[#09090B]">{title}</p>
        {Icon && <Icon className="w-4 h-4 text-[#71717A]" />}
      </div>
      <div className="mt-2">
        <h2 className="text-2xl font-semibold text-[#09090B]">{value}</h2>
        <p
          className={`text-xs ${
            isPositive ? "text-[#49BA6C]" : "text-red-600"
          }`}
        >
          {change}
        </p>
      </div>
    </div>
  );
};

export default DashboardCard;
