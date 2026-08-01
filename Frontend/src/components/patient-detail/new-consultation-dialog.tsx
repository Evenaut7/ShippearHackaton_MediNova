"use client";

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upload } from "@vercel/blob/client";
import { audioApi, AUDIO_UPLOAD_TOKEN_URL, type GeneratedReport } from "@/lib/api";
import { useProfessionals } from "@/context/professionals-context";
import type { ConsultationFormValues } from "@/lib/types";

type Step = "cargar" | "procesando" | "revisar";

interface Draft {
  motivoConsulta: string;
  sintomas: string;
  diagnostico: string;
  indicaciones: string;
  notas: string;
  transcript?: string;
  audioPath?: string;
}

const emptyDraft: Draft = {
  motivoConsulta: "",
  sintomas: "",
  diagnostico: "",
  indicaciones: "",
  notas: "",
};

function toDraft(report: GeneratedReport): Draft {
  return {
    motivoConsulta: report.motivoConsulta,
    sintomas: report.sintomas.join(", "),
    diagnostico: report.diagnostico,
    indicaciones: report.indicaciones,
    notas: report.notas,
    transcript: report.transcript,
    audioPath: report.audioPath,
  };
}

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
  const { professionals } = useProfessionals();
  const [step, setStep] = useState<Step>("cargar");
  const [file, setFile] = useState<File | null>(null);
  const [professionalId, setProfessionalId] = useState(professionals[0]?.id ?? "");
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 16));
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  function reset() {
    setStep("cargar");
    setFile(null);
    setDraft(emptyDraft);
  }

  function handleDialogChange(nextOpen: boolean) {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  }

  async function handleGenerate(event: SubmitEvent) {
    event.preventDefault();
    if (!file) {
      toast.error("Seleccioná un archivo de audio.");
      return;
    }
    if (!professionalId) {
      toast.error("Seleccioná el profesional que atendió la consulta.");
      return;
    }

    setStep("procesando");
    try {
      const blob = await upload(file.name, file, {
        access: "private",
        handleUploadUrl: AUDIO_UPLOAD_TOKEN_URL,
      });
      const report = await audioApi.generateReport(blob.url);
      setDraft(toDraft(report));
      setStep("revisar");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo generar el reporte a partir del audio.",
      );
      setStep("cargar");
    }
  }

  function handleApprove() {
    onApprove({
      professionalId,
      fecha: new Date(fecha).toISOString(),
      motivoConsulta: draft.motivoConsulta,
      sintomas: draft.sintomas
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      diagnostico: draft.diagnostico,
      indicaciones: draft.indicaciones,
      notas: draft.notas,
      transcript: draft.transcript,
      audioPath: draft.audioPath,
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
                    {file?.name || "Hacé click para seleccionar un archivo de audio"}
                  </span>
                  <input
                    id="audio"
                    type="file"
                    accept="audio/*"
                    className="sr-only"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="profesional">Médico</Label>
                  {professionals.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No hay profesionales cargados.{" "}
                      <Link href="/profesionales" className="underline">
                        Creá uno primero
                      </Link>
                      .
                    </p>
                  ) : (
                    <Select value={professionalId} onValueChange={setProfessionalId}>
                      <SelectTrigger id="profesional" className="w-full">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {professionals.map((professional) => (
                          <SelectItem key={professional.id} value={professional.id}>
                            {professional.nombreCompleto}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
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
              <Button type="submit" disabled={professionals.length === 0}>
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
