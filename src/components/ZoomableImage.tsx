import { useState, CSSProperties } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";

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
  const [zoom, setZoom] = useState(1);

  const zoomLevels = [1, 2, 3];
  const cycleZoom = () => {
    setZoom((prev) => {
      const idx = zoomLevels.indexOf(prev);
      return zoomLevels[(idx + 1) % zoomLevels.length];
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setZoom(1); }}>
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
            className="max-w-full max-h-[85vh] object-contain rounded-md transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
            draggable={false}
          />
        </div>
        <div className="flex items-center justify-center gap-3 mt-1">
          <button
            type="button"
            onClick={cycleZoom}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            {zoom === 1 ? <ZoomIn className="h-3.5 w-3.5" /> : zoom === 3 ? <ZoomOut className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
            {zoom}×
          </button>
          <p className="text-xs text-muted-foreground">{alt}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
