import { useRef } from "react";
import { Button } from "@/components/ui/button";

export default function BusinessProfileImageUpload({
  imageUrl,
  onFileChange,
  disabled = false,
}: {
  imageUrl: string;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFileDialog = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  return (
    <div
      className={`flex items-center gap-4 mb-6${
        disabled ? " opacity-50 cursor-not-allowed" : ""
      }`}
      id="business-profile-media"
    >
      <div
        className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer"
        onClick={openFileDialog}
        title="Cambiar imagen de perfil"
        style={disabled ? { pointerEvents: "none" } : {}}
      >
        <img src={imageUrl} alt="" className="object-cover w-full h-full" />
      </div>
      <div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="avatar-upload"
          ref={fileInputRef}
          onChange={(e) => {
            if (!disabled) {
              const file = e.target.files?.[0] || null;
              onFileChange(file);
            }
          }}
          disabled={disabled}
        />
        <Button
          type="button"
          onClick={openFileDialog}
          className="btn"
          disabled={disabled}
        >
          Browse...
        </Button>
        <div className="text-xs text-slate-400 mt-1">
          JPG, Webp, Avif, GIF or PNG. Max size of 800K
        </div>
      </div>
    </div>
  );
}
