import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, ZoomIn } from "lucide-react";
import ZoomableImage from "@/components/ZoomableImage";

export default function VitaminD() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="outline" className="text-sm px-4 py-1 border-amber-400/40 text-amber-400">
          Vitamin D
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Vitamin D Clinical Guide</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Assessment, supplementation, and management of vitamin D deficiency — 
          covering screening indications, dosing protocols, and monitoring.
        </p>
      </div>

      {/* Reference Image */}
      <Card className="border-border/60 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-400" />
            Vitamin D Reference Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ZoomableImage
            src="/images/vitamin-d.png"
            alt="Vitamin D Clinical Reference"
            className="w-full h-auto rounded-lg border border-border/40"
          />
        </CardContent>
      </Card>
    </div>
  );
}
