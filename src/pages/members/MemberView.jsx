import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemberChat from "@/components/members/MemberChat";

const MemberView = () => {
  const [activeTab, setActiveTab] = useState("Chat with Member");

  useEffect(() => {
    const savedTab = localStorage.getItem("member-active-tab");
    if (savedTab) setActiveTab(savedTab);
  }, []);

  const handleTabChange = (value) => {
    setActiveTab(value);
    localStorage.setItem("member-active-tab", value);
  };

  return (
    <div className="w-full space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="bg-[#F4F4F5] rounded-lg p-1 mt-4">
          <TabsTrigger
            value="Chat with Member"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium"
          >
           Chat with Member
          </TabsTrigger>
          <TabsTrigger
            value="Uploaded Will"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium"
          >
          Uploaded Will
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Chat with Member" className="mt-4">
            <MemberChat/>
        </TabsContent>
        <TabsContent value="Uploaded Will" className="mt-4"></TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberView;
