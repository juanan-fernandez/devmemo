import {
	Code2,
	FileText,
	Image,
	Link as LinkIcon,
	MoreHorizontal,
	NotebookPen,
	Sparkles,
	TerminalSquare,
	type LucideIcon
} from 'lucide-react'
import { createElement } from 'react'

const ITEM_TYPE_ICON_REGISTRY: Record<string, LucideIcon> = {
	Braces: Code2,
	MessageSquare: Sparkles,
	Terminal: TerminalSquare,
	StickyNote: NotebookPen,
	FileText,
	Image,
	Link: LinkIcon,
	'code-2': Code2,
	sparkles: Sparkles,
	'terminal-square': TerminalSquare,
	'notebook-pen': NotebookPen,
	'file-text': FileText,
	image: Image,
	link: LinkIcon
}

export function getItemTypeIcon(iconName: string | null | undefined): LucideIcon {
	if (!iconName) {
		return MoreHorizontal
	}

	return ITEM_TYPE_ICON_REGISTRY[iconName] ?? MoreHorizontal
}

type ItemTypeIconProps = {
	iconName: string | null | undefined
	className?: string
	color?: string | null
}

export function ItemTypeIcon({ iconName, className, color }: ItemTypeIconProps) {
	return createElement(getItemTypeIcon(iconName), {
		className,
		style: color ? { color } : undefined
	})
}
