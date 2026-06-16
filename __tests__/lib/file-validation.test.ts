import { describe, expect, it } from 'vitest'

import {
	MAX_UPLOAD_SIZE_BYTES,
	SERVER_UPLOAD_SIZE_LIMIT_BYTES,
	buildUploadPathname,
	getUploadIdFromPathname,
	shouldUseClientUpload,
	validateFileUploadSelection
} from '@/lib/storage/file-validation'

describe('file upload validation helpers', () => {
	it('sends files larger than the server limit through the client flow', () => {
		expect(shouldUseClientUpload(SERVER_UPLOAD_SIZE_LIMIT_BYTES)).toBe(false)
		expect(shouldUseClientUpload(SERVER_UPLOAD_SIZE_LIMIT_BYTES + 1)).toBe(true)
	})

	it('rejects files larger than 10 MB', () => {
		const result = validateFileUploadSelection({
			name: 'video.mp4',
			size: MAX_UPLOAD_SIZE_BYTES + 1,
			type: 'video/mp4',
			typeKey: 'file'
		})

		expect(result).toEqual({
			success: false,
			error: 'El archivo no puede superar los 10 MB.'
		})
	})

	it('rejects non image content for image items', () => {
		const result = validateFileUploadSelection({
			name: 'documento.pdf',
			size: 1024,
			type: 'application/pdf',
			typeKey: 'image'
		})

		expect(result).toEqual({
			success: false,
			error: 'Selecciona un archivo de imagen compatible.'
		})
	})

	it('builds stable pathnames that preserve the upload id', () => {
		const pathname = buildUploadPathname({
			fileName: 'Mi mockup final.png',
			typeKey: 'image',
			uploadId: 'upload_123',
			userId: 'user_456'
		})

		expect(pathname).toBe('items/image/user_456/upload_123/Mi-mockup-final.png')
		expect(getUploadIdFromPathname(pathname)).toBe('upload_123')
	})
})
