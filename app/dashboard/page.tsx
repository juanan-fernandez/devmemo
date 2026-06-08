import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function DashboardPage() {
  return (
    <div className="flex h-dvh flex-col">
      <header className="flex shrink-0 items-center gap-4 px-6 py-3">
        <h1 className="font-heading text-lg font-bold text-foreground">
          DevMemo
        </h1>
        <div className="relative ml-auto max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar snippets, comandos, notas..."
            className="pl-9"
          />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-60 shrink-0 flex-col bg-sidebar p-6">
          <h2>Menu</h2>
        </aside>
        <main className="flex flex-1 flex-col items-center justify-center p-6">
          <h2>Main</h2>
        </main>
      </div>
    </div>
  )
}
