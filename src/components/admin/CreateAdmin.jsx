import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "../ui/switch";
import { useCreateUser, useUpdateUser, useUserById } from "@/store/useUser";

const CreateAdmin = ({ open, onClose, adminId }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const isEdit = !!adminId;

  const { data: admin, isLoading } = useUserById(adminId, {
    enabled: isEdit,
  });
  const createAdmin = useCreateUser();
  const updateAdmin = useUpdateUser();

  const handleClose = () => {
    reset({
      name: "",
      email: "",
      phone: "",
      status: "active",
    });
    onClose();
  };
  useEffect(() => {
    if (open && !isEdit) {
      reset({
        name: "",
        email: "",
        phone: "",
        status: "active",
      });
    }
  }, [open, isEdit, reset]);

  useEffect(() => {
    if (admin?.data && isEdit) {
      setValue("name", admin?.data?.name);
      setValue("email", admin?.data?.email);
      setValue("phone", admin?.data?.phone);
      setValue("status", admin?.data?.status || "inactive");
    }
  }, [admin, isEdit, setValue]);

  const onSubmit = (submitData) => {
    const formData = {
      ...submitData,
      role: "admin",
    };
    if (isEdit) {
      updateAdmin.mutate(
        { id: adminId, data: formData },
        {
          onSuccess: () => {
            toast.success("Admin updated successfully!");
            reset();
            handleClose();
          },
          onError: (err) => {
            toast.error(err?.message || "Failed to update admin");
          },
        }
      );
    } else {
      createAdmin.mutate(formData, {
        onSuccess: () => {
          toast.success("Admin created successfully!");
          handleClose();
        },
        onError: (err) => {
          toast.error(err?.message || "Failed to create admin");
        },
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-[400px] p-6">
        <h2 className="text-xl font-bold">
          {isEdit ? "Edit Admin" : "Create a new Admin"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {isEdit ? "Update the admin details" : "Lets create a new admin"}
        </p>

        {isEdit && isLoading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                type="text"
                placeholder="Enter Name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="text"
                placeholder="Enter Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                type="text"
                placeholder="Enter Phone"
                {...register("phone", { required: "Phone is required" })}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
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

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createAdmin.isLoading || updateAdmin.isLoading}
              >
                {isEdit
                  ? updateAdmin.isLoading
                    ? "Updating..."
                    : "Update"
                  : createAdmin.isLoading
                  ? "Creating..."
                  : "Create"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateAdmin;
