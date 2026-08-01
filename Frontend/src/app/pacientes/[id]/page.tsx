"use client";

import { use, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Mic } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PatientProfileCard } from "@/components/patient-detail/patient-profile-card";
import { ConsultationTimeline } from "@/components/patient-detail/consultation-timeline";
import { AIInsightPanel } from "@/components/patient-detail/ai-insight-panel";
import { NewConsultationDialog } from "@/components/patient-detail/new-consultation-dialog";
import { PatientFormDialog } from "@/components/patients/patient-form-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import {
  ProfileLoadingSkeleton,
  TimelineLoadingSkeleton,
} from "@/components/shared/loading-skeleton";
import { usePatients } from "@/context/patients-context";
import type { ConsultationFormValues, PatientFormValues } from "@/lib/types";

interface PatientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { id } = use(params);
  const { isLoading, getPatient, updatePatient, addConsultation } = usePatients();
  const [editOpen, setEditOpen] = useState(false);
  const [newConsultationOpen, setNewConsultationOpen] = useState(false);

  const patient = getPatient(id);

  function handleUpdatePatient(values: PatientFormValues) {
    updatePatient(id, values);
    toast.success("Datos del paciente actualizados.");
  }

  function handleApproveConsultation(values: ConsultationFormValues) {
    addConsultation(id, values);
    toast.success("Consulta guardada en el historial del paciente.");
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/pacientes"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a pacientes
        </Link>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
            <ProfileLoadingSkeleton />
            <TimelineLoadingSkeleton />
          </div>
        ) : !patient ? (
          <EmptyState
            title="Paciente no encontrado"
            description="Es posible que haya sido eliminado. Volvé al listado de pacientes."
            action={
              <Button asChild>
                <Link href="/pacientes">Ir al listado</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
            <PatientProfileCard patient={patient} onEdit={() => setEditOpen(true)} />

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Opinión de la IA sobre el historial</CardTitle>
                </CardHeader>
                <CardContent>
                  <AIInsightPanel insight={patient.aiInsight} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <CardTitle className="text-base">Historial de consultas</CardTitle>
                  <Button size="sm" onClick={() => setNewConsultationOpen(true)}>
                    <Mic className="h-4 w-4" />
                    Cargar audio de nueva consulta
                  </Button>
                </CardHeader>
                <CardContent>
                  <ConsultationTimeline consultations={patient.consultas} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {patient && (
        <>
          <PatientFormDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            patient={patient}
            onSubmit={handleUpdatePatient}
          />
          <NewConsultationDialog
            open={newConsultationOpen}
            onOpenChange={setNewConsultationOpen}
            onApprove={handleApproveConsultation}
          />
        </>
      )}
    </div>
  );
}
