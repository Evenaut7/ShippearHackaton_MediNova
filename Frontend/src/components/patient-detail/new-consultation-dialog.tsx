"use client";

import { useState, type SubmitEvent } from "react";
import { FileAudio, Loader2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ConsultationFormValues } from "@/lib/types";

type Step = "cargar" | "procesando" | "revisar";

const draftTemplate = {
  motivoConsulta: "Control por síntomas referidos durante la grabación",
  sintomas: "Dolor localizado, malestar general",
  diagnostico: "A completar por el médico tras revisar el audio transcripto",
  indicaciones: "A definir según evaluación clínica",
  notas: "Reporte generado automáticamente a partir del audio. Revisar y ajustar antes de aprobar.",
};

interface NewConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (values: ConsultationFormValues) => void;
}

export function NewConsultationDialog({
  open,
  onOpenChange,
  onApprove,
}: NewConsultationDialogProps) {
  const [step, setStep] = useState<Step>("cargar");
  const [fileName, setFileName] = useState("");
  const [medico, setMedico] = useState("Dra. Valentina Cruz");
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 16));
  const [draft, setDraft] = useState(draftTemplate);

  function reset() {
    setStep("cargar");
    setFileName("");
    setDraft(draftTemplate);
  }

  function handleDialogChange(nextOpen: boolean) {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  }

  function handleGenerate(event: SubmitEvent) {
    event.preventDefault();
    setStep("procesando");
    setTimeout(() => {
      setDraft(draftTemplate);
      setStep("revisar");
    }, 1600);
  }

  function handleApprove() {
    onApprove({
      fecha: new Date(fecha).toISOString(),
      medico,
      motivoConsulta: draft.motivoConsulta,
      sintomas: draft.sintomas
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      diagnostico: draft.diagnostico,
      indicaciones: draft.indicaciones,
      notas: draft.notas,
    });
    handleDialogChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-lg">
        {step === "cargar" && (
          <form onSubmit={handleGenerate}>
            <DialogHeader>
              <DialogTitle>Cargar audio de nueva consulta</DialogTitle>
              <DialogDescription>
                Subí el audio grabado durante la consulta. La IA va a generar un reporte
                estructurado para que lo revises antes de guardarlo.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="audio">Audio de la consulta</Label>
                <label
                  htmlFor="audio"
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-8 text-center hover:bg-muted/60"
                >
                  <FileAudio className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {fileName || "Hacé click para seleccionar un archivo de audio"}
                  </span>
                  <input
                    id="audio"
                    type="file"
                    accept="audio/*"
                    className="sr-only"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="medico">Médico</Label>
                  <Input id="medico" value={medico} onChange={(e) => setMedico(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fechaConsulta">Fecha y hora</Label>
                  <Input
                    id="fechaConsulta"
                    type="datetime-local"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Sparkles className="h-4 w-4" />
                Generar reporte con IA
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "procesando" && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="font-medium">Generando reporte con IA…</p>
            <p className="text-sm text-muted-foreground">
              Transcribiendo audio y estructurando la consulta.
            </p>
          </div>
        )}

        {step === "revisar" && (
          <>
            <DialogHeader>
              <DialogTitle>Revisar reporte generado</DialogTitle>
              <DialogDescription>
                Editá lo que haga falta y aprobá para guardarlo en el historial del paciente.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="draftMotivo">Motivo de consulta</Label>
                <Textarea
                  id="draftMotivo"
                  value={draft.motivoConsulta}
                  onChange={(e) => setDraft({ ...draft, motivoConsulta: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="draftSintomas">Síntomas (separados por coma)</Label>
                <Input
                  id="draftSintomas"
                  value={draft.sintomas}
                  onChange={(e) => setDraft({ ...draft, sintomas: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="draftDiagnostico">Diagnóstico</Label>
                <Textarea
                  id="draftDiagnostico"
                  value={draft.diagnostico}
                  onChange={(e) => setDraft({ ...draft, diagnostico: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="draftIndicaciones">Indicaciones</Label>
                <Textarea
                  id="draftIndicaciones"
                  value={draft.indicaciones}
                  onChange={(e) => setDraft({ ...draft, indicaciones: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="draftNotas">Notas</Label>
                <Textarea
                  id="draftNotas"
                  value={draft.notas}
                  onChange={(e) => setDraft({ ...draft, notas: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep("cargar")}>
                Volver
              </Button>
              <Button type="button" onClick={handleApprove}>
                Aprobar y guardar en historial
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
