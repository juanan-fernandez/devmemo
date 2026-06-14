import { describe, expect, it } from 'vitest'

import {
	getEditableItemCapabilities,
	isAllowedItemLanguage,
	parseTagsInput,
	updateItemInputSchema
} from '@/lib/items/editable-item'

describe('editable item helpers', () => {
	it('normalizes comma separated tags', () => {
		expect(parseTagsInput(' react, nextjs,react,  , testing ')).toEqual(['react', 'nextjs', 'testing'])
	})

	it('trims optional text fields in the schema', () => {
		const result = updateItemInputSchema.parse({
			itemId: 'item_123',
			title: '  Mi item  ',
			description: '  Descripción  ',
			content: '  console.log()  ',
			url: '  https://example.com  ',
			language: '  TypeScript  ',
			tags: [' react ', ' nextjs ', 'react']
		})

		expect(result).toMatchObject({
			title: 'Mi item',
			description: 'Descripción',
			content: 'console.log()',
			url: 'https://example.com',
			language: 'TypeScript',
			tags: ['react', 'nextjs']
		})
	})

	it('returns editable capabilities by canonical item type key', () => {
		expect(getEditableItemCapabilities('snippet')).toEqual({
			canEditContent: true,
			canEditLanguage: true,
			canEditUrl: false
		})

		expect(getEditableItemCapabilities('url')).toEqual({
			canEditContent: false,
			canEditLanguage: false,
			canEditUrl: true
		})
	})

	it('validates the small supported language list', () => {
		expect(isAllowedItemLanguage('TypeScript')).toBe(true)
		expect(isAllowedItemLanguage('Rust')).toBe(false)
	})
})
