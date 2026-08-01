import Link from "next/link";
import { Stethoscope } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/pacientes" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/15">
            <Stethoscope className="h-5 w-5" />
          </span>
          <span className="text-lg">MediNova</span>
        </Link>
        <nav className="ml-6 flex items-center gap-1 text-sm">
          <Link
            href="/pacientes"
            className="rounded-md px-3 py-2 font-medium text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            Pacientes
          </Link>
        </nav>
      </div>
    </header>
  );
}
