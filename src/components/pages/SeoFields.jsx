import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SeoFields = ({ register, errors }) => {
  return (
    <div className="space-y-4 border rounded-md p-4">
      <Label className="text-lg font-medium">SEO Details</Label>
      <div>
        <Label htmlFor="meta_title">Meta Title</Label>
        <Input
          id="meta_title"
          placeholder="Enter meta title"
          {...register("meta_title")}
          className="mt-1"
        />
        {errors?.meta_title && (
          <p className="text-red-500 text-sm mt-1">{errors.meta_title.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="meta_description">Meta Description</Label>
        <Textarea
          id="meta_description"
          placeholder="Enter meta description"
          {...register("meta_description")}
          className="mt-1"
          rows={3}
        />
        {errors?.meta_description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.meta_description.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="meta_keywords">Meta Keywords</Label>
        <Input
          id="meta_keywords"
          placeholder="Enter keywords separated by commas"
          {...register("meta_keywords")}
          className="mt-1"
        />
        {errors?.meta_keywords && (
          <p className="text-red-500 text-sm mt-1">
            {errors.meta_keywords.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SeoFields;
