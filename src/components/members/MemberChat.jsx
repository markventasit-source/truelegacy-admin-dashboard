import MemberCard from "./MemberCard";

const MemberChat = () => {
  return (
    <div className="grid grid-cols-12 gap-6 mt-6">
      <div className="col-span-12 md:col-span-4">
        <MemberCard />
      </div>
      <div className="col-span-12 md:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Chat Section
        </h2>
        <p className="text-gray-500 text-sm">
          This area can contain chat messages or other related content.
        </p>
      </div>
    </div>
  );
};

export default MemberChat;
