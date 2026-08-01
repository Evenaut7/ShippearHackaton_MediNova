"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Patient } from "@/lib/types";
import { formatDate, getInitials } from "@/lib/format";

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export function PatientTable({ patients, onEdit, onDelete }: PatientTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Última consulta</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
            const ultimaConsulta = [...patient.consultas].sort(
              (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
            )[0];
            return (
              <TableRow key={patient.id}>
                <TableCell>
                  <Link
                    href={`/pacientes/${patient.id}`}
                    className="flex items-center gap-3 font-medium hover:underline"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                        {getInitials(patient.nombreCompleto)}
                      </AvatarFallback>
                    </Avatar>
                    {patient.nombreCompleto}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{patient.documento}</TableCell>
                <TableCell className="text-muted-foreground">
                  {ultimaConsulta ? formatDate(ultimaConsulta.fecha) : "Sin consultas"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" asChild title="Ver historial">
                      <Link href={`/pacientes/${patient.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Editar paciente"
                      onClick={() => onEdit(patient)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Eliminar paciente"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(patient)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
