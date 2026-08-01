"use client";

import { CalendarDays, Stethoscope } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmptyState } from "@/components/shared/empty-state";
import { ConsultationDetailCard } from "@/components/patient-detail/consultation-detail-card";
import type { Consultation } from "@/lib/types";
import { formatDate } from "@/lib/format";

interface ConsultationTimelineProps {
  consultations: Consultation[];
}

export function ConsultationTimeline({ consultations }: ConsultationTimelineProps) {
  if (consultations.length === 0) {
    return (
      <EmptyState
        icon={Stethoscope}
        title="Sin consultas registradas"
        description="Cuando se cargue el audio de una consulta, el reporte generado por la IA va a aparecer acá."
      />
    );
  }

  const ordered = [...consultations].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  );

  return (
    <Accordion type="single" collapsible defaultValue={ordered[0]?.id}>
      {ordered.map((consultation) => (
        <AccordionItem key={consultation.id} value={consultation.id}>
          <AccordionTrigger>
            <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 pr-2 text-left">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                {formatDate(consultation.fecha)}
              </span>
              <span className="text-sm text-foreground/80">{consultation.motivoConsulta}</span>
              <span className="ml-auto text-xs text-muted-foreground">{consultation.medico}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ConsultationDetailCard consultation={consultation} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
