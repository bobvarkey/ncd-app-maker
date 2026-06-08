import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ZoomableImage({ src, alt, className = "" }: ZoomableImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`group relative cursor-pointer overflow-hidden rounded-lg border border-border ${className}`}
          onClick={() => setOpen(true)}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-contain"
            draggable={false}
          />
          {/* Hover overlay — subtle zoom hint */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
            <ZoomIn className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-80 drop-shadow-lg" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 sm:p-4 bg-background border-border">
        <div className="flex items-center justify-center w-full h-full overflow-auto">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[85vh] object-contain rounded-md"
            draggable={false}
          />
        </div>
        <p className="text-xs text-center text-muted-foreground mt-1">{alt}</p>
      </DialogContent>
    </Dialog>
  );
}
