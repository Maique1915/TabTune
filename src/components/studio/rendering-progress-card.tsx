"use client";

import { useAppContext } from "@/app/context/app--context";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function RenderingProgressCard() {
  const { isRendering, renderProgress, setRenderCancelRequested } = useAppContext();

  if (!isRendering) {
    return null;
  }

  const isComplete = renderProgress >= 100;

  const handleCancel = () => {
    setRenderCancelRequested(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isComplete ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                Renderização Concluída
              </>
            ) : (
              "Renderizando Vídeo..."
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            {isComplete
              ? "Seu vídeo foi renderizado com sucesso!"
              : "Aguarde, isso pode levar alguns minutos."}
          </p>
          <Progress value={renderProgress} className="w-full" />
          {!isComplete && (
            <p className="text-right text-sm font-bold mt-1">{Math.round(renderProgress)}%</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {!isComplete && (
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
