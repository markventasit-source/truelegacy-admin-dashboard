import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CalendarDays, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { upload } from "@/api/uploadApi";
import {
  useCreateNotification,
  useNotificationById,
  useUpdateNotification,
} from "@/store/useNotification";
import { Switch } from "../ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import moment from "moment";

const NotificationForm = ({ onSuccessSubmit, editId }) => {
  const { data: notificationData, isLoading: isLoadingNotification } =
    useNotificationById(editId);
  const updateNotification = useUpdateNotification();

  const addNotification = useCreateNotification();
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "all",
      type: {
        email: true,
        inApp: true,
      },
      subject: "",
      content: "",
      image: null,
    },
  });

  const imageFile = watch("image");

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(imageFile);
    } else {
      setPreviewImage(null);
    }
  }, [imageFile]);
  useEffect(() => {
    if (notificationData?.data) {
      const notif = notificationData.data;

      reset({
        role: notif.role || "all",
        type: {
          email: notif.type?.includes("email") || false,
          inApp: notif.type?.includes("in-app") || false,
        },
        subject: notif.subject || "",
        content: notif.content || "",
        image: null,
        schedule: !!notif.send_date,
        send_date: notif.send_date ? new Date(notif.send_date) : null,
      });

      setPreviewImage(notif.image || null);
    }
  }, [notificationData, reset]);

  const onSubmit = async (data) => {
    let imageUrl = "";
    if (data.image) {
      try {
        const response = await upload(data.image);
        imageUrl = response?.data || "";
      } catch (error) {
        toast.error("Failed to upload image");
        return;
      }
    }

    const selectedTypes = Object.entries(data.type)
      .filter(([_, checked]) => checked)
      .map(([key]) => (key === "inApp" ? "in-app" : key));

    const payload = {
      role: data.role,
      type: ["email"],
      subject: data.subject,
      content: data.content,
      ...(imageUrl && { image: imageUrl }),
      ...(data.schedule && { send_date: data.send_date }),
    };

    const action = editId ? updateNotification : addNotification;

    action.mutate(editId ? { id: editId, data: payload } : payload, {
      onSuccess: () => {
        toast.success(
          editId
            ? "Notification updated successfully!"
            : "Notification created successfully!"
        );
        reset();
        setPreviewImage(null);
        onSuccessSubmit();
      },
      onError: (err) => {
        toast.error(err?.message || "Failed to submit notification");
      },
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1 * 1024 * 1024) {
      setValue("image", file);
    } else {
      toast.error("File must be under 1MB");
    }
  };

  const handleCancel = () => {
    reset();
    setPreviewImage(null);
  };

  return (
    <Card className="max-w-2xl bg-white border rounded-sm shadow-xs pt-10">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Recipient *</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {/* <div>
            <Label>Notification Type</Label>
            <div className="flex flex-wrap gap-6 mt-2">
              {[
                { key: "email", label: "Email" },
                { key: "inApp", label: "In-app" },
              ].map((item) => (
                <div key={item.key} className="flex items-center space-x-2">
                  <Controller
                    name={`type.${item.key}`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id={item.key}
                      />
                    )}
                  />
                  <Label htmlFor={item.key}>{item.label}</Label>
                </div>
              ))}
            </div>
          </div> */}
          <div>
            <Label htmlFor="subject">Notification Title *</Label>
            <Input
              id="subject"
              placeholder="Please enter your heading"
              {...register("subject", { required: "Heading is required" })}
              className="mt-1"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="content">Message Body</Label>
            <Textarea
              id="content"
              placeholder="Enter description"
              {...register("content", { required: "Description is required" })}
              className="mt-1 min-h-[120px]"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>
          <div>
            <Label>Image (Optional)</Label>
            <div className="border border-dashed border-gray-300 rounded-lg mt-2 p-6 flex flex-col items-center justify-center text-center">
              <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                Click to Upload
              </p>
              <p className="text-xs text-gray-500 mb-2">
                or drop file here (SVG, PNG, JPG, GIF – max 1MB)
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer text-sm font-medium text-black underline"
              >
                Select from storage
              </label>

              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-3 w-32 h-32 object-cover rounded-md"
                />
              )}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="schedule">Schedule Notification</Label>
            <Controller
              name="schedule"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Switch
                  id="schedule"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {watch("schedule") && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="send_date">Select Send Date</Label>
              <Controller
                name="send_date"
                control={control}
                rules={{
                  required: watch("schedule")
                    ? "Send date is required when scheduling"
                    : false,
                }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between text-left font-normal mt-1"
                      >
                        {field.value
                          ? moment(field.value).format("DD-MM-YYYY")
                          : "Select date"}
                        <CalendarDays className="mr-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.send_date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.send_date.message}
                </p>
              )}
            </div>
          )}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Clear
            </Button>
            <Button type="submit" disabled={addNotification.isLoading}>
              {addNotification.isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotificationForm;
