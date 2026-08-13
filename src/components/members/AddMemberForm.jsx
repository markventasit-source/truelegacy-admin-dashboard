import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "../ui/switch";
import { useCreateUser, useUpdateUser, useUserById } from "@/store/useUser";
import { CircleAlert, Copy, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
const generate_random_password = () => {
  const passwordLength = 10;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0, n = charset.length; i < passwordLength; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};

const AddMemberForm = () => {
  const params = useParams({ strict: false });
  const editId = params.id;
  const navigate = useNavigate();
  const { data: userData } = useUserById(editId);
  const updateUser = useUpdateUser();
  const addUser = useCreateUser();
  const [tempPassword, setTempPassword] = useState(generate_random_password());

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        status: user.status || "active",
      });
    }
  }, [userData, reset]);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      role: "member",
      email: data.email,
      phone: data.phone,
      status: data.status,
      password: tempPassword,
    };

    const action = editId ? updateUser : addUser;

    action.mutate(editId ? { id: editId, data: payload } : payload, {
      onSuccess: () => {
        toast.success(
          editId
            ? "Member updated successfully!"
            : "Member created successfully!"
        );
        reset();
        setTempPassword(generate_random_password());
        navigate({ to: "/members" });
      },
      onError: (err) => {
        toast.error(err?.message || "Failed to submit member");
      },
    });
  };

  const handleRegeneratePassword = () => {
    const newPassword = generate_random_password();
    setTempPassword(newPassword);
    toast.success("New password generated!");
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    toast.success("Password copied to clipboard!");
  };

  const handleCancel = () => {
    reset();
    setTempPassword(generate_random_password());
    navigate({ to: "/members" });
  };

  return (
    <div className="space-y-6 mt-4">
      <h1 className="text-xl font-semibold">
        {editId ? "Edit Member" : "Add New Member"}
      </h1>

      <Card className="max-w-2xl bg-white border rounded-sm shadow-xs pt-10">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                {...register("name", { required: "Name is required" })}
                className="mt-1"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                placeholder="Enter email"
                {...register("email", { required: "Email is required" })}
                className="mt-1"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                {...register("phone", { required: "Phone is required" })}
                className="mt-1"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between p-3 rounded-md">
              <Label>Status</Label>
              <Switch
                checked={watch("status") === "active"}
                onCheckedChange={(val) =>
                  setValue("status", val ? "active" : "inactive")
                }
              />
            </div>
            {!editId && (
              <div className="border border-[#FEE685] rounded-md p-5 bg-amber-50">
                <h3 className="text-md font-semibold text-[#7B3306] flex items-center gap-2 mb-2">
                  <CircleAlert className="w-4 h-4" /> Credential Generation
                </h3>
                <p className="text-sm text-[#BB4D00] mb-4">
                  Auto-generate secure login credentials for the new member
                </p>
                <div className="bg-white p-4 border rounded-md border-[#FEE685] ">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mb-5">
                    <div>
                      <Label className={"mb-2"}>Username</Label>
                      <Input
                        value={watch("email")}
                        disabled
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <Label className={"mb-2"}>Temporary Password</Label>
                      <div className="relative flex items-center">
                        <Input
                          value={tempPassword}
                          disabled
                          type="text"
                          className="pr-8"
                        />
                        <Copy
                          className="absolute right-2 w-4 h-4 text-gray-500 cursor-pointer"
                          onClick={handleCopyPassword}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 text-[#7B3306] border-[#BB4D00] hover:bg-amber-100 w-full"
                    onClick={handleRegeneratePassword}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Regenerate Password
                  </Button>
                </div>

                <div className="mt-4 text-sidebar text-base space-y-2">
                  <p className="font-medium">
                    Send credentials to user via email notification
                  </p>
                  <div className="bg-[#EFF6FF] p-3 rounded-md border border-[#BEDBFF]">
                    <p className="text-[#1C398E] text-sm">
                      <strong className="text-base">
                        User Dashboard Access:
                      </strong>
                      <br /> User can sign in using these credentials at the
                      Member Dashboard. They can reset their password anytime
                      after first login.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addUser.isPending || updateUser.isPending}
              >
                {editId
                  ? updateUser.isPending
                    ? "Updating..."
                    : "Update"
                  : addUser.isPending
                  ? "Creating..."
                  : "Save Member"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMemberForm;
