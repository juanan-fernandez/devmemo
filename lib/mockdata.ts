export type MockUser = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export type MockItemType = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
  userId: string | null;
};

export type MockCollection = {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type MockTag = {
  id: string;
  name: string;
  userId: string;
};

export type MockItem = {
  id: string;
  title: string;
  contentType: "text" | "file";
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  url: string | null;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  language: string | null;
  userId: string;
  typeId: string;
  collectionId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MockItemTag = {
  itemId: string;
  tagId: string;
};

export type MockDatabase = {
  user: MockUser;
  itemTypes: MockItemType[];
  collections: MockCollection[];
  tags: MockTag[];
  items: MockItem[];
  itemTags: MockItemTag[];
};

const userId = "user_demo_001";

const timestamps = {
  createdAt: "2026-06-08T09:00:00.000Z",
  updatedAt: "2026-06-08T09:00:00.000Z",
} as const;

export const mockUser: MockUser = {
  id: userId,
  email: "demo@devmemo.app",
  password: "hashed_demo_password",
  ...timestamps,
};

export const mockItemTypes: MockItemType[] = [
  {
    id: "type_snippets",
    name: "Snippets",
    icon: "code-2",
    color: "#84CC16",
    isSystem: true,
    userId: null,
  },
  {
    id: "type_prompts",
    name: "Prompts",
    icon: "sparkles",
    color: "#8B5CF6",
    isSystem: true,
    userId: null,
  },
  {
    id: "type_comandos",
    name: "Comandos",
    icon: "terminal-square",
    color: "#F97316",
    isSystem: true,
    userId: null,
  },
  {
    id: "type_notas",
    name: "Notas",
    icon: "notebook-pen",
    color: "#06B6D4",
    isSystem: true,
    userId: null,
  },
  {
    id: "type_archivos",
    name: "Archivos",
    icon: "file-text",
    color: "#F59E0B",
    isSystem: true,
    userId: null,
  },
  {
    id: "type_imagenes",
    name: "Imágenes",
    icon: "image",
    color: "#EC4899",
    isSystem: true,
    userId: null,
  },
  {
    id: "type_enlaces",
    name: "Enlaces",
    icon: "link",
    color: "#3B82F6",
    isSystem: true,
    userId: null,
  },
];

export const mockCollections: MockCollection[] = [
  {
    id: "collection_react_patterns",
    name: "Patrones de React",
    description: "Snippets y notas para componentes, hooks y composición.",
    isFavorite: true,
    userId,
    ...timestamps,
  },
  {
    id: "collection_prompts_ia",
    name: "Prompts de IA",
    description: "Prompts reutilizables para código, revisión y documentación.",
    isFavorite: true,
    userId,
    ...timestamps,
  },
  {
    id: "collection_devops_tools",
    name: "DevOps y CLI",
    description: "Comandos de terminal, despliegue y utilidades del día a día.",
    isFavorite: false,
    userId,
    ...timestamps,
  },
  {
    id: "collection_product_docs",
    name: "Documentación de producto",
    description: "Notas y recursos sobre roadmap, requisitos y descubrimiento.",
    isFavorite: false,
    userId,
    ...timestamps,
  },
  {
    id: "collection_design_assets",
    name: "Diseño y recursos",
    description: "Archivos, imágenes y enlaces visuales de referencia.",
    isFavorite: false,
    userId,
    ...timestamps,
  },
];

export const mockTags: MockTag[] = [
  { id: "tag_react", name: "react", userId },
  { id: "tag_nextjs", name: "nextjs", userId },
  { id: "tag_ai", name: "ia", userId },
  { id: "tag_cli", name: "cli", userId },
  { id: "tag_docs", name: "docs", userId },
  { id: "tag_ui", name: "ui", userId },
  { id: "tag_backend", name: "backend", userId },
  { id: "tag_productividad", name: "productividad", userId },
];

export const mockItems: MockItem[] = [
  {
    id: "item_001",
    title: "Hook useDebounce en TypeScript",
    contentType: "text",
    content:
      "export function useDebounce<T>(value: T, delay = 300) { /* implementación */ }",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Snippet para retrasar búsquedas en inputs y filtros.",
    isFavorite: true,
    isPinned: true,
    language: "typescript",
    userId,
    typeId: "type_snippets",
    collectionId: "collection_react_patterns",
    ...timestamps,
  },
  {
    id: "item_002",
    title: "Prompt para revisar pull requests",
    contentType: "text",
    content:
      "Actúa como reviewer senior y evalúa legibilidad, bugs, accesibilidad y mantenibilidad.",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Prompt base para revisiones técnicas consistentes.",
    isFavorite: true,
    isPinned: false,
    language: null,
    userId,
    typeId: "type_prompts",
    collectionId: "collection_prompts_ia",
    ...timestamps,
  },
  {
    id: "item_003",
    title: "Comando para limpiar ramas locales",
    contentType: "text",
    content: "git branch --merged | grep -v '\*\|main\|develop' | xargs -n 1 git branch -d",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Elimina ramas ya integradas en local.",
    isFavorite: false,
    isPinned: true,
    language: "bash",
    userId,
    typeId: "type_comandos",
    collectionId: "collection_devops_tools",
    ...timestamps,
  },
  {
    id: "item_004",
    title: "Notas de arquitectura hexagonal",
    contentType: "text",
    content:
      "Separar dominio, aplicación e infraestructura reduce acoplamiento y mejora testabilidad.",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Resumen corto de principios y capas.",
    isFavorite: true,
    isPinned: false,
    language: null,
    userId,
    typeId: "type_notas",
    collectionId: "collection_product_docs",
    ...timestamps,
  },
  {
    id: "item_005",
    title: "Plantilla base de README",
    contentType: "file",
    content: null,
    fileUrl: "https://cdn.devmemo.app/files/readme-template.md",
    fileName: "readme-template.md",
    fileSize: 18432,
    url: null,
    description: "Archivo reutilizable para documentar repositorios nuevos.",
    isFavorite: false,
    isPinned: false,
    language: "markdown",
    userId,
    typeId: "type_archivos",
    collectionId: "collection_design_assets",
    ...timestamps,
  },
  {
    id: "item_006",
    title: "Referencia visual dashboard oscuro",
    contentType: "file",
    content: null,
    fileUrl: "https://cdn.devmemo.app/images/dashboard-dark.png",
    fileName: "dashboard-dark.png",
    fileSize: 512000,
    url: null,
    description: "Mockup de referencia para la pantalla principal.",
    isFavorite: true,
    isPinned: true,
    language: null,
    userId,
    typeId: "type_imagenes",
    collectionId: "collection_design_assets",
    ...timestamps,
  },
  {
    id: "item_007",
    title: "Guía oficial de App Router",
    contentType: "text",
    content: null,
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: "https://nextjs.org/docs/app",
    description: "Enlace directo a la documentación de Next.js App Router.",
    isFavorite: false,
    isPinned: false,
    language: null,
    userId,
    typeId: "type_enlaces",
    collectionId: "collection_react_patterns",
    ...timestamps,
  },
  {
    id: "item_008",
    title: "Snippet Prisma para búsqueda por tags",
    contentType: "text",
    content:
      "const items = await prisma.item.findMany({ where: { tags: { some: { tag: { name: { in: tags } } } } } });",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Consulta para filtrar items por múltiples etiquetas.",
    isFavorite: true,
    isPinned: false,
    language: "typescript",
    userId,
    typeId: "type_snippets",
    collectionId: "collection_react_patterns",
    ...timestamps,
  },
  {
    id: "item_009",
    title: "Prompt para generar user stories",
    contentType: "text",
    content:
      "Genera historias de usuario con criterio INVEST, criterios de aceptación y edge cases.",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Útil en fases de discovery y definición funcional.",
    isFavorite: false,
    isPinned: true,
    language: null,
    userId,
    typeId: "type_prompts",
    collectionId: "collection_prompts_ia",
    ...timestamps,
  },
  {
    id: "item_010",
    title: "Comando para analizar bundle en Next.js",
    contentType: "text",
    content: "ANALYZE=true npm run build",
    fileUrl: null,
    fileName: null,
    fileSize: null,
    url: null,
    description: "Atajo para revisar el peso del bundle durante optimización.",
    isFavorite: false,
    isPinned: false,
    language: "bash",
    userId,
    typeId: "type_comandos",
    collectionId: "collection_devops_tools",
    ...timestamps,
  },
];

export const mockItemTags: MockItemTag[] = [
  { itemId: "item_001", tagId: "tag_react" },
  { itemId: "item_001", tagId: "tag_productividad" },
  { itemId: "item_002", tagId: "tag_ai" },
  { itemId: "item_002", tagId: "tag_docs" },
  { itemId: "item_003", tagId: "tag_cli" },
  { itemId: "item_004", tagId: "tag_backend" },
  { itemId: "item_004", tagId: "tag_docs" },
  { itemId: "item_005", tagId: "tag_docs" },
  { itemId: "item_006", tagId: "tag_ui" },
  { itemId: "item_007", tagId: "tag_nextjs" },
  { itemId: "item_008", tagId: "tag_nextjs" },
  { itemId: "item_008", tagId: "tag_backend" },
  { itemId: "item_009", tagId: "tag_ai" },
  { itemId: "item_010", tagId: "tag_cli" },
];

export const mockData: MockDatabase = {
  user: mockUser,
  itemTypes: mockItemTypes,
  collections: mockCollections,
  tags: mockTags,
  items: mockItems,
  itemTags: mockItemTags,
};

export default mockData;
