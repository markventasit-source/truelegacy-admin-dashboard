const MemberCard = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 flex flex-col items-center text-center">
      <div className="w-36 h-36 rounded-full bg-[#EBCB7A] flex items-center justify-center text-2xl font-semibold text-gray-800">
        EB
      </div>

      <h2 className="mt-4 text-lg font-semibold text-sidebar">Elsa Ebrahim</h2>
      <span className="mt-1 inline-block bg-sidebar text-primary-text text-xs px-3 py-0.5 rounded-full">
        Member
      </span>

      <p className="mt-3 text-secondaryText text-sm font-medium">+91 6282359916</p>
      <p className="text-secondaryText text-sm">example@gmail.com</p>

      <hr className="my-4 w-full border-gray-200" />

      <div className="w-full text-left">
        <h3 className="font-semibold text-base text-sidebar mb-2">
          Session Information
        </h3>

        <div className="flex justify-between text-sm mb-3">
          <span className="text-secondaryText">Join Date</span>
          <span className="font-medium text-sidebar">
            Oct 31, 2025 9:15 AM
          </span>
        </div>

        <div className="flex justify-between text-sm mb-3">
          <span className="text-secondaryText">Created By</span>
          <span className="font-medium text-sidebar">John Doe</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-secondaryText">Last Login</span>
          <span className="font-medium text-sidebar">
            Oct 29, 2025 2:30 PM
          </span>
        </div>
      </div>

      <hr className="my-4 w-full border-gray-200" />

      <p className="text-base text-secondaryText text-center">
        Messages sent here will appear in the member's chat dashboard.
        Attachments are view-only for members.
      </p>
    </div>
  );
};

export default MemberCard;
