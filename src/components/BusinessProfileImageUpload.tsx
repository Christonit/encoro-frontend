import { useRef } from "react";
import { Button } from "@/components/ui/button";

export default function BusinessProfileImageUpload({
  imageUrl,
  onFileChange,
}: {
  imageUrl: string;
  onFileChange: (file: File | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFileDialog = () => {
    console.log("openFileDialog");
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-4 mb-6" id="business-profile-media">
      <button
        className="w-40 h-40 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer"
        onClick={openFileDialog}
        title="Cambiar imagen de perfil"
      >
        <img
          src={imageUrl}
          alt="Business profile"
          className="object-cover w-full h-full"
        />
      </button>
      <div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="business-profile-avatar-upload"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            onFileChange(file);
          }}
        />
        <Button type="button" onClick={openFileDialog}>
          Browse...
        </Button>
        <div className="text-xs text-slate-400 mt-1">
          JPG, Webp, Avif, GIF or PNG. Max size of 800K
        </div>
      </div>
    </div>
  );
}
