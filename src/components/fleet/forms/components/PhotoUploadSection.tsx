
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, X } from "lucide-react";

interface PhotoUploadSectionProps {
  photoPreview: string;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
  type: "driver" | "minder";
}

const PhotoUploadSection = ({ photoPreview, onPhotoUpload, onRemovePhoto, type }: PhotoUploadSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>{type === "driver" ? "Driver" : "Minder"} Photo</Label>
      <div className="flex flex-col items-center space-y-3">
        {photoPreview ? (
          <div className="relative">
            <img 
              src={photoPreview} 
              alt={`${type} photo`}
              className="w-32 h-32 rounded-md object-cover border-2 border-gray-200"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={onRemovePhoto}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-md bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
            <Camera className="w-10 h-10 text-gray-400" />
          </div>
        )}
        
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={onPhotoUpload}
            className="hidden"
            id="photo-upload"
          />
          <Label 
            htmlFor="photo-upload" 
            className="cursor-pointer bg-white border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            {photoPreview ? "Change Photo" : "Upload Photo"}
          </Label>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadSection;
