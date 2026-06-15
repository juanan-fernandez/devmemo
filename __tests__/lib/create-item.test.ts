import { describe, expect, it } from 'vitest'

import {
	createItemInputSchema,
	getCreateItemCapabilities,
	parseCreateItemTagsInput
} from '@/lib/items/create-item'

describe('create item helpers', () => {
	it('normalizes comma separated tags', () => {
		expect(parseCreateItemTagsInput(' react, nextjs,react,  , testing ')).toEqual([
			'react',
			'nextjs',
			'testing'
		])
	})

	it('trims optional fields and accepts snippet payloads', () => {
		const result = createItemInputSchema.parse({
			type: 'snippet',
			title: '  Mi snippet  ',
			description: '  Descripción  ',
			content: '  console.log()  ',
			language: '  TypeScript  ',
			url: null,
			collectionId: ' collection_123 ',
			tags: [' react ', ' nextjs ', 'react']
		})

		expect(result).toMatchObject({
			type: 'snippet',
			title: 'Mi snippet',
			description: 'Descripción',
			content: 'console.log()',
			language: 'TypeScript',
			collectionId: 'collection_123',
			tags: ['react', 'nextjs']
		})
	})

	it('requires a valid URL for url items', () => {
		const result = createItemInputSchema.safeParse({
			type: 'url',
			title: 'Guía',
			description: null,
			content: null,
			language: null,
			url: 'nota-valida',
			collectionId: null,
			tags: []
		})

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.url).toContain('La URL no es válida.')
		}
	})

	it('rejects unsupported fields for url items', () => {
		const result = createItemInputSchema.safeParse({
			type: 'url',
			title: 'Guía oficial',
			description: null,
			content: 'esto no debería enviarse',
			language: 'TypeScript',
			url: 'https://nextjs.org/docs',
			collectionId: null,
			tags: []
		})

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.content).toContain('El contenido no aplica a este tipo de item.')
			expect(result.error.flatten().fieldErrors.language).toContain('El lenguaje no aplica a este tipo de item.')
		}
	})

	it('returns create capabilities by canonical item type key', () => {
		expect(getCreateItemCapabilities('command')).toEqual({
			canCreateContent: true,
			canCreateLanguage: true,
			canCreateUrl: false
		})

		expect(getCreateItemCapabilities('url')).toEqual({
			canCreateContent: false,
			canCreateLanguage: false,
			canCreateUrl: true
		})
	})
})
