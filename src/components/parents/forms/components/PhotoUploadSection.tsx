
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhotoUploadSectionProps {
  photoPreview: string;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
}

const PhotoUploadSection = ({ photoPreview, onPhotoUpload, onRemovePhoto }: PhotoUploadSectionProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="studentPhoto">Student Photo (Optional)</Label>
      <div className="flex justify-start">
        {!photoPreview ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center w-48">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload student photo</p>
            <Input
              id="studentPhoto"
              type="file"
              accept="image/*"
              onChange={onPhotoUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('studentPhoto')?.click()}
            >
              Choose Photo
            </Button>
          </div>
        ) : (
          <div className="relative">
            <img
              src={photoPreview}
              alt="Student preview"
              className="w-24 h-24 object-cover rounded-md border"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
              onClick={onRemovePhoto}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUploadSection;
