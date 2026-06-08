"use client"

import { useState } from "react"
import {
  Archive,
  BookHeart,
  Code2,
  Columns3,
  FileText,
  FolderHeart,
  Image,
  LayoutList,
  Link,
  MoreHorizontal,
  NotebookPen,
  PinOff,
  Sparkles,
  Star,
  TerminalSquare,
  Trash2,
} from "lucide-react"
import {
  mockCollections,
  mockItems,
  mockItemTypes,
  type MockItemType,
} from "@/lib/mockdata"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
  "code-2": Code2,
  sparkles: Sparkles,
  "terminal-square": TerminalSquare,
  "notebook-pen": NotebookPen,
  "file-text": FileText,
  image: Image,
  link: Link,
}

function getItemTypeIcon(
  type: MockItemType | undefined,
  className?: string
) {
  if (!type) return <MoreHorizontal className={className} />
  const Icon = iconMap[type.icon] || MoreHorizontal
  return <Icon className={className} />
}

function getPredominantType(
  collectionId: string
): MockItemType | undefined {
  const collectionItems = mockItems.filter(
    (i) => i.collectionId === collectionId
  )
  if (collectionItems.length === 0) return undefined

  const typeCounts: Record<string, number> = {}
  collectionItems.forEach((i) => {
    typeCounts[i.typeId] = (typeCounts[i.typeId] || 0) + 1
  })
  const predominantTypeId = Object.entries(typeCounts).sort(
    ([, a], [, b]) => b - a
  )[0][0]
  return mockItemTypes.find((t) => t.id === predominantTypeId)
}

function getItemTypeById(typeId: string): MockItemType | undefined {
  return mockItemTypes.find((t) => t.id === typeId)
}

const summaryCards = [
  {
    label: "Total de elementos",
    value: mockItems.length,
    color: "#84CC16",
    icon: Archive,
  },
  {
    label: "Colecciones",
    value: mockCollections.length,
    color: "#06B6D4",
    icon: FolderHeart,
  },
  {
    label: "Elementos favoritos",
    value: mockItems.filter((i) => i.isFavorite).length,
    color: "#EC4899",
    icon: BookHeart,
  },
  {
    label: "Colecciones favoritas",
    value: mockCollections.filter((c) => c.isFavorite).length,
    color: "#F59E0B",
    icon: Star,
  },
]

const latestCollections = [...mockCollections]
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  .slice(0, 3)

const pinnedItems = mockItems.filter((i) => i.isPinned)

export default function DashboardPage() {
  const [pinnedView, setPinnedView] = useState<"card" | "list">("card")

  return (
    <div className="space-y-8 px-8 py-6 md:px-10 xl:px-12">
      {/* Row 1: Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5"
          >
            <div
              className="flex size-12 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${card.color}1A` }}
            >
              <card.icon className="size-6" style={{ color: card.color }} />
            </div>
            <div>
              <p
                className="text-2xl font-bold"
                style={{ color: card.color }}
              >
                {card.value}
              </p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Latest collections */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Últimas colecciones
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestCollections.map((col) => {
            const predominantType = getPredominantType(col.id)
            const typeColor = predominantType?.color ?? "#666"
            return (
              <div
                key={col.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: typeColor }}
                />
                <div className="space-y-2 p-4">
                  <div className="flex items-center gap-2">
                    <span style={{ color: typeColor }}>
                      {getItemTypeIcon(predominantType, "size-5")}
                    </span>
                    <h3 className="font-semibold text-foreground">
                      {col.name}
                    </h3>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {col.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      {
                        mockItems.filter((i) => i.collectionId === col.id)
                          .length
                      }{" "}
                      elementos
                    </span>
                    {col.isFavorite && (
                      <span className="flex items-center gap-1">
                        <Star className="size-3 fill-yellow-500 text-yellow-500" />
                        Favorita
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Row 3: Pinned items */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Elementos fijados
          </h2>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => setPinnedView("card")}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                pinnedView === "card"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Vista de tarjetas"
            >
              <Columns3 className="size-4" />
            </button>
            <button
              onClick={() => setPinnedView("list")}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                pinnedView === "list"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Vista de lista"
            >
              <LayoutList className="size-4" />
            </button>
          </div>
        </div>

        {pinnedItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay elementos fijados. Marca elementos como fijados para
            verlos aquí.
          </p>
        ) : pinnedView === "card" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pinnedItems.map((item) => {
              const type = getItemTypeById(item.typeId)
              return (
                <div
                  key={item.id}
                  className="group rounded-xl border border-border bg-card transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-start justify-between p-4">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <span
                        className="mt-0.5 shrink-0"
                        style={{ color: type?.color }}
                      >
                        {getItemTypeIcon(type, "size-5")}
                      </span>
                      <div className="min-w-0 space-y-1">
                        <h3 className="truncate text-sm font-medium text-foreground">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          {type && <span>{type.name}</span>}
                          {item.language && (
                            <>
                              <span>·</span>
                              <span>{item.language}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label="Favorito"
                      >
                        <Star
                          className={cn(
                            "size-4",
                            item.isFavorite && "fill-yellow-500 text-yellow-500"
                          )}
                        />
                      </button>
                      <button
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label="Desfijar"
                      >
                        <PinOff className="size-4" />
                      </button>
                      <button
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
            {pinnedItems.map((item) => {
              const type = getItemTypeById(item.typeId)
              return (
                <div
                  key={item.id}
                  className="group flex items-center gap-3 bg-card px-4 py-3 transition-colors hover:bg-accent/50"
                >
                  <span
                    className="shrink-0"
                    style={{ color: type?.color }}
                  >
                    {getItemTypeIcon(type, "size-4")}
                  </span>
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="truncate text-sm font-medium text-foreground">
                      {item.title}
                    </span>
                    {type && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {type.name}
                      </span>
                    )}
                    {item.language && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {item.language}
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      aria-label="Favorito"
                    >
                      <Star
                        className={cn(
                          "size-4",
                          item.isFavorite &&
                            "fill-yellow-500 text-yellow-500"
                        )}
                      />
                    </button>
                    <button
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      aria-label="Desfijar"
                    >
                      <PinOff className="size-4" />
                    </button>
                    <button
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
