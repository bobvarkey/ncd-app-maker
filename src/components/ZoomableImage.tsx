import { useState, CSSProperties } from "react";
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
  style?: CSSProperties;
  wrapperClassName?: string;
  loading?: "lazy" | "eager";
}

export default function ZoomableImage({
  src,
  alt,
  className = "",
  style,
  wrapperClassName = "",
  loading = "lazy",
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`Zoom: ${alt}`}
          className={`group relative cursor-zoom-in block w-full overflow-hidden ${wrapperClassName}`}
          onClick={() => setOpen(true)}
        >
          <img
            src={src}
            alt={alt}
            loading={loading}
            className={className}
            style={style}
            draggable={false}
          />
          <span className="pointer-events-none absolute top-2 right-2 rounded-full bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-4 w-4 text-white" />
          </span>
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
