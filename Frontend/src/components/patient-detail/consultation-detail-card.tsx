import { Badge } from "@/components/ui/badge";
import type { Consultation } from "@/lib/types";

interface ConsultationDetailCardProps {
  consultation: Consultation;
}

export function ConsultationDetailCard({ consultation }: ConsultationDetailCardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Motivo de consulta
        </p>
        <p className="mt-1 text-sm">{consultation.motivoConsulta}</p>
      </div>

      <div className="sm:col-span-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Síntomas
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {consultation.sintomas.map((sintoma, index) => (
            <Badge key={index} variant="secondary">
              {sintoma}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Diagnóstico
        </p>
        <p className="mt-1 text-sm">{consultation.diagnostico}</p>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Indicaciones
        </p>
        <p className="mt-1 text-sm">{consultation.indicaciones}</p>
      </div>

      {consultation.notas && (
        <div className="sm:col-span-2 rounded-md bg-muted/60 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Notas del médico
          </p>
          <p className="mt-1 text-sm text-foreground/90">{consultation.notas}</p>
        </div>
      )}
    </div>
  );
}
