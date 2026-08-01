import { AlertTriangle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import type { AIInsight } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

interface AIInsightPanelProps {
  insight?: AIInsight;
}

export function AIInsightPanel({ insight }: AIInsightPanelProps) {
  if (!insight) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Todavía no hay una opinión de IA"
        description="Se necesitan al menos dos consultas registradas para que la IA pueda detectar patrones en el historial."
      />
    );
  }

  const isAlerta = insight.nivel === "alerta";

  return (
    <div
      className={
        isAlerta
          ? "rounded-lg border-2 border-destructive/40 bg-destructive/5 p-5"
          : "rounded-lg border-2 border-primary/30 bg-accent p-5"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={
              isAlerta
                ? "flex h-9 w-9 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                : "flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
            }
          >
            {isAlerta ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </span>
          <div>
            <p className="font-semibold leading-tight">Opinión de la IA sobre el historial</p>
            <p className="text-xs text-muted-foreground">
              Generado el {formatDateTime(insight.generadoEl)}
            </p>
          </div>
        </div>
        <Badge variant={isAlerta ? "destructive" : "default"}>
          {isAlerta ? "Hallazgo relevante" : "Análisis IA"}
        </Badge>
      </div>

      <p className="mt-4 text-sm leading-relaxed">{insight.resumen}</p>

      <ul className="mt-4 space-y-2">
        {insight.hallazgos.map((hallazgo, index) => (
          <li key={index} className="flex gap-2 text-sm">
            <span
              className={
                isAlerta
                  ? "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive"
                  : "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              }
            />
            <span className="text-foreground/90">{hallazgo}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
