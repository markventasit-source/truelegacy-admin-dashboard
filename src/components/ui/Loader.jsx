import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0  flex flex-col items-center justify-center z-50">
      <Loader2 className="w-8 h-8 animate-spin text-black mb-3" />
      <span className="text-black text-sm">{text}</span>
    </div>
  );
};

export default Loader;
