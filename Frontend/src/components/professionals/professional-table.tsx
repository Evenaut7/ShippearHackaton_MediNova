"use client";

import { Pencil, Trash2 } from "lucide-react";
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
import type { Professional } from "@/lib/types";
import { getInitials } from "@/lib/format";

interface ProfessionalTableProps {
  professionals: Professional[];
  onEdit: (professional: Professional) => void;
  onDelete: (professional: Professional) => void;
}

export function ProfessionalTable({ professionals, onEdit, onDelete }: ProfessionalTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profesional</TableHead>
            <TableHead>Especialidad</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professionals.map((professional) => (
            <TableRow key={professional.id}>
              <TableCell>
                <div className="flex items-center gap-3 font-medium">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                      {getInitials(professional.nombreCompleto)}
                    </AvatarFallback>
                  </Avatar>
                  {professional.nombreCompleto}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {professional.especialidad || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {professional.email || professional.telefono || "—"}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Editar profesional"
                    onClick={() => onEdit(professional)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Eliminar profesional"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(professional)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
