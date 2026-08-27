import React, { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadCloud, Trash2, CircleX } from "lucide-react";
import { toast } from "sonner";
import { upload } from "@/api/uploadApi";
import {
  useEventById,
  useCreateEvent,
  useUpdateEvent,
} from "@/store/useEvent";
import { getEvents } from "@/api/eventsApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useNavigate, useParams } from "@tanstack/react-router";
import SeoFields from "./SeoFields";
import MarkdownEditor from "./MarkdownEditor";
import {
  toFaqs,
  toRelatedBlogIds,
  toSeoFields,
  toSubSections,
  unwrapContentEntity,
} from "@/utils/contentFormUtils";

const generateSlug = (title) =>
  title
    ?.toLowerCase()
    ?.trim()
    ?.replace(/[^\w\s-]/g, "")
    ?.replace(/\s+/g, "-");

const EventForm = () => {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const editId = params.id;
  const { data: eventData } = useEventById(editId);
  const updateEvent = useUpdateEvent();
  const addEvent = useCreateEvent();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const hydratedIdRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      dark_content: "",
      faded_content: "",
      image: null,
      image_alt: "",
      related_blogs: [],
      sub_sections: [],
      faqs: [],
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sub_sections",
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: "faqs",
  });

  const imageFile = watch("image");
  const titleValue = watch("title");

  useEffect(() => {
    const fetchArticles = async () => {
      setLoadingEvents(true);
      try {
        const res = await getEvents();
        setEvents(res?.data || []);
      } catch (error) {
        toast.error(error?.message || "Failed to fetch events");
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    if (imageFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(imageFile);
    } else if (typeof imageFile === "string" && imageFile) {
      setPreviewImage(imageFile);
    }
  }, [imageFile]);

  useEffect(() => {
    const event = unwrapContentEntity(eventData);
    if (!editId || !event) return;
    if (hydratedIdRef.current === editId) return;
    hydratedIdRef.current = editId;
    reset({
      title: event.title || "",
      slug: event.slug || "",
      dark_content: event.dark_content || "",
      faded_content: event.faded_content || "",
      image_alt: event.image_alt || "",
      related_blogs: toRelatedBlogIds(event.related_blogs),
      sub_sections: event.sub_sections || [],
      faqs: event.faqs || [],
      meta_title: event.meta_title || "",
      meta_description: event.meta_description || "",
      meta_keywords: event.meta_keywords || "",
    });
    setPreviewImage(event.image || null);
  }, [eventData, editId, reset]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1 * 1024 * 1024) {
      setValue("image", file);
    } else {
      toast.error("File must be under 1MB");
    }
  };

  const onSubmit = async (data) => {
    let imageUrl = typeof previewImage === "string" ? previewImage : null;
    if (data.image instanceof File) {
      try {
        const uploadResponse = await upload(data.image);
        imageUrl = uploadResponse?.data;
        if (!imageUrl) {
          toast.error("Image upload failed");
          return;
        }
      } catch (error) {
        toast.error("Failed to upload image");
        return;
      }
    }

    const slug = data.slug?.trim()
      ? generateSlug(data.slug)
      : generateSlug(data.title);

    const payload = {
      title: data.title,
      slug,
      dark_content: data.dark_content || "",
      faded_content: data.faded_content || "",
      sub_sections: toSubSections(data.sub_sections),
      faqs: toFaqs(data.faqs),
      related_blogs: toRelatedBlogIds(data.related_blogs),
      ...toSeoFields(data),
      ...(imageUrl && { image: imageUrl }),
    };

    const action = editId ? updateEvent : addEvent;
    action.mutate(editId ? { id: editId, data: payload } : payload, {
      onSuccess: () => {
        toast.success(
          editId
            ? "Event updated successfully!"
            : "Event created successfully!"
        );
        reset();
        setPreviewImage(null);
        navigate({ to: "/pages/events" });
      },
      onError: (err) => {
        toast.error(err?.message || "Failed to submit event");
      },
    });
  };

  const handleCancel = () => {
    reset();
    setPreviewImage(null);
    navigate({ to: "/pages/events" });
  };

  return (
    <div className="space-y-6 mt-4">
      <h1 className="text-xl font-semibold">
        {editId ? "Edit Event" : "Add New Event"}
      </h1>

      <Card className="max-w-2xl bg-white border rounded-sm shadow-xs pt-10">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter hero title"
                {...register("title", { required: "Title is required" })}
                className="mt-1"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input
                id="slug"
                placeholder={
                  generateSlug(titleValue) || "auto-generated-from-title"
                }
                {...register("slug")}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave blank to auto-generate from the title.
              </p>
            </div>

            <div>
              <Label>Featured Image (Optional)</Label>
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
                    alt={watch("image_alt") || "Preview"}
                    className="mt-3 w-32 h-32 object-cover rounded-md"
                  />
                )}
              </div>
              <div className="mt-3">
                <Label htmlFor="image_alt">Featured image alt text</Label>
                <Input
                  id="image_alt"
                  placeholder="Describe the featured image"
                  {...register("image_alt")}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dark_content">Dark Content</Label>
              <MarkdownEditor
                value={watch("dark_content")}
                onChange={(value) => setValue("dark_content", value)}
                placeholder="Write dark content here..."
              />
            </div>

            <div>
              <Label htmlFor="faded_content">Faded Content</Label>
              <MarkdownEditor
                value={watch("faded_content")}
                onChange={(value) => setValue("faded_content", value)}
                placeholder="Write faded content here..."
              />
            </div>

            <div className="space-y-2">
              <Label>Related Events</Label>
              <div className="border border-gray-300 rounded-md p-2">
                <Select
                  onValueChange={(value) => {
                    const selected = watch("related_blogs") || [];
                    if (selected.includes(value)) {
                      setValue(
                        "related_blogs",
                        selected.filter((v) => v !== value)
                      );
                    } else {
                      setValue("related_blogs", [...selected, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select related events" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingEvents ? (
                      <SelectItem disabled value="loading">
                        Loading...
                      </SelectItem>
                    ) : (
                      (() => {
                        const filtered = events.filter(
                          (i) => i._id !== editId
                        );
                        return filtered.length > 0 ? (
                          filtered.map((i) => (
                            <SelectItem
                              key={i._id}
                              value={i._id}
                              className={
                                (watch("related_blogs") || []).includes(i._id)
                                  ? "bg-gray-100"
                                  : ""
                              }
                            >
                              {i.title}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled value="no-data">
                            No data available
                          </SelectItem>
                        );
                      })()
                    )}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(watch("related_blogs") || []).map((id) => {
                    const relatedItem = events.find((a) => a._id === id);
                    return (
                      <div
                        key={id}
                        className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-sm"
                      >
                        <span>{relatedItem?.title || "Unknown"}</span>
                        <button
                          type="button"
                          className="ml-2 text-gray-500 hover:text-red-500"
                          onClick={() =>
                            setValue(
                              "related_blogs",
                              (watch("related_blogs") || []).filter(
                                (v) => v !== id
                              )
                            )
                          }
                        >
                          <CircleX className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-lg font-medium">Sections</Label>
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="border rounded-md p-4 mt-4 space-y-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800">
                      Section {index + 1}
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-5 w-5 text-gray-500" />
                    </Button>
                  </div>

                  <div>
                    <Label>Title</Label>
                    <Input
                      placeholder="Enter section title"
                      {...register(`sub_sections.${index}.title`, {
                        required: "Section title is required",
                      })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Content</Label>
                    <MarkdownEditor
                      value={watch(`sub_sections.${index}.content`) || ""}
                      onChange={(value) =>
                        setValue(`sub_sections.${index}.content`, value)
                      }
                      placeholder="Write section content..."
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-center mt-6 ">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => append({ title: "", content: "" })}
                >
                  + Add Section
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-lg font-medium">FAQs</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Optional. Shown as an accordion on the public resource page.
              </p>
              {faqFields.map((item, index) => (
                <div
                  key={item.id}
                  className="border rounded-md p-4 mt-4 space-y-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800">
                      FAQ {index + 1}
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFaq(index)}
                    >
                      <Trash2 className="h-5 w-5 text-gray-500" />
                    </Button>
                  </div>

                  <div>
                    <Label>Question</Label>
                    <Input
                      placeholder="Enter FAQ question"
                      {...register(`faqs.${index}.question`, {
                        required: "FAQ question is required",
                      })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Answer</Label>
                    <textarea
                      placeholder="Enter FAQ answer"
                      {...register(`faqs.${index}.answer`, {
                        required: "FAQ answer is required",
                      })}
                      className="mt-1 flex min-h-[96px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-center mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => appendFaq({ question: "", answer: "" })}
                >
                  + Add FAQ
                </Button>
              </div>
            </div>

            <SeoFields register={register} errors={errors} />
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addEvent.isPending || updateEvent.isPending}
              >
                {addEvent.isPending || updateEvent.isPending
                  ? "Submitting..."
                  : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventForm;
