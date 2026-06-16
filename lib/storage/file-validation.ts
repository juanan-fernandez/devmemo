export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024
export const SERVER_UPLOAD_SIZE_LIMIT_BYTES = 4_500_000

const FILE_UPLOAD_TYPE_KEYS = ['file', 'image'] as const

const FILE_RULES = {
	file: {
		accept: 'text/*,application/*,image/*,audio/*,video/*',
		allowedContentTypes: ['text/*', 'application/*', 'image/*', 'audio/*', 'video/*'],
		label: 'archivo'
	},
	image: {
		accept: 'image/*',
		allowedContentTypes: ['image/*'],
		label: 'imagen'
	}
} as const

export type UploadItemTypeKey = (typeof FILE_UPLOAD_TYPE_KEYS)[number]

export type FileUploadSelection = {
	name: string
	size: number
	type: string
	typeKey: UploadItemTypeKey
}

export function isUploadItemTypeKey(typeKey: string): typeKey is UploadItemTypeKey {
	return FILE_UPLOAD_TYPE_KEYS.includes(typeKey as UploadItemTypeKey)
}

export function getFileValidationConfig(typeKey: UploadItemTypeKey) {
	return FILE_RULES[typeKey]
}

export function shouldUseClientUpload(fileSize: number) {
	return fileSize > SERVER_UPLOAD_SIZE_LIMIT_BYTES
}

export function validateFileUploadSelection(selection: FileUploadSelection) {
	const config = getFileValidationConfig(selection.typeKey)

	if (!selection.name.trim()) {
		return {
			success: false as const,
			error: `Selecciona un ${config.label} válido.`
		}
	}

	if (selection.size <= 0) {
		return {
			success: false as const,
			error: `El ${config.label} no puede estar vacío.`
		}
	}

	if (selection.size > MAX_UPLOAD_SIZE_BYTES) {
		return {
			success: false as const,
			error: `El ${config.label} no puede superar los 10 MB.`
		}
	}

	if (!matchesAllowedContentType(selection.type, config.allowedContentTypes)) {
		return {
			success: false as const,
			error:
				typeKeyToInvalidTypeMessage(selection.typeKey)
		}
	}

	return { success: true as const }
}

export function formatBytes(bytes: number) {
	if (bytes < 1024) {
		return `${bytes} B`
	}

	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(1)} KB`
	}

	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function sanitizeUploadFilename(fileName: string) {
	const normalized = fileName
		.normalize('NFKD')
		.replace(/[^a-zA-Z0-9._-]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')

	return normalized || 'archivo'
}

export function buildUploadPathname(params: {
	fileName: string
	typeKey: UploadItemTypeKey
	uploadId: string
	userId: string
}) {
	return `items/${params.typeKey}/${params.userId}/${params.uploadId}/${sanitizeUploadFilename(params.fileName)}`
}

export function getUploadIdFromPathname(pathname: string) {
	const segments = pathname.split('/').filter(Boolean)
	return segments[3] ?? null
}

function matchesAllowedContentType(contentType: string, allowedContentTypes: readonly string[]) {
	if (!contentType) {
		return false
	}

	return allowedContentTypes.some(allowedContentType => {
		if (allowedContentType.endsWith('/*')) {
			return contentType.startsWith(allowedContentType.slice(0, -1))
		}

		return contentType === allowedContentType
	})
}

function typeKeyToInvalidTypeMessage(typeKey: UploadItemTypeKey) {
	return typeKey === 'image'
		? 'Selecciona un archivo de imagen compatible.'
		: 'Selecciona un archivo compatible.'
}
