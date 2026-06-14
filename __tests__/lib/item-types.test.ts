import { describe, it, expect } from 'vitest'
import {
	getCanonicalItemTypeBySlug,
	getCanonicalItemType,
	getItemTypeHref,
	toAppItemType,
	CANONICAL_SYSTEM_ITEM_TYPES
} from '@/lib/item-types'

describe('getItemTypeHref', () => {
	it('strips diacritics and lowercases', () => {
		expect(getItemTypeHref('Imágenes')).toBe('/items/imagenes')
		expect(getItemTypeHref('Comandos')).toBe('/items/comandos')
	})

	it('produces kebab-case slugs', () => {
		expect(getItemTypeHref('Snippets')).toBe('/items/snippets')
		expect(getItemTypeHref('Notas')).toBe('/items/notas')
	})

	it('handles simple names without diacritics', () => {
		expect(getItemTypeHref('Snippets')).toBe('/items/snippets')
		expect(getItemTypeHref('Enlaces')).toBe('/items/enlaces')
	})
})

describe('getCanonicalItemTypeBySlug', () => {
	it('returns the correct canonical type for system slugs', () => {
		const snippet = getCanonicalItemTypeBySlug('snippets')
		expect(snippet).not.toBeNull()
		expect(snippet!.key).toBe('snippet')
		expect(snippet!.dbName).toBe('Snippet')
		expect(snippet!.gender).toBe('masculine')
	})

	it('returns the feminine type for "notas"', () => {
		const nota = getCanonicalItemTypeBySlug('notas')
		expect(nota).not.toBeNull()
		expect(nota!.key).toBe('note')
		expect(nota!.gender).toBe('feminine')
		expect(nota!.singularLabel).toBe('Nota')
	})

	it('returns the feminine type for "imagenes"', () => {
		const imagen = getCanonicalItemTypeBySlug('imagenes')
		expect(imagen).not.toBeNull()
		expect(imagen!.key).toBe('image')
		expect(imagen!.gender).toBe('feminine')
	})

	it('returns null for unknown slugs', () => {
		expect(getCanonicalItemTypeBySlug('nonexistent')).toBeNull()
		expect(getCanonicalItemTypeBySlug('foobar')).toBeNull()
	})
})

describe('getCanonicalItemType', () => {
	it('returns the correct type by dbName', () => {
		const snippet = getCanonicalItemType('Snippet')
		expect(snippet).not.toBeNull()
		expect(snippet!.key).toBe('snippet')
	})

	it('returns null for unknown dbName', () => {
		expect(getCanonicalItemType('UnknownType')).toBeNull()
	})
})

describe('CANONICAL_SYSTEM_ITEM_TYPES', () => {
	it('has 7 system item types', () => {
		expect(CANONICAL_SYSTEM_ITEM_TYPES).toHaveLength(7)
	})

	it('every type has required fields', () => {
		for (const type of CANONICAL_SYSTEM_ITEM_TYPES) {
			expect(type.key).toBeTruthy()
			expect(type.dbName).toBeTruthy()
			expect(type.singularLabel).toBeTruthy()
			expect(type.href).toMatch(/^\/items\//)
			expect(type.gender).toMatch(/^(masculine|feminine)$/)
		}
	})
})

describe('toAppItemType', () => {
	it('enriches a system type source with canonical data', () => {
		const result = toAppItemType({
			id: 'db-id-1',
			name: 'Snippet',
			icon: 'code-2',
			color: '#84CC16',
			isSystem: true,
			userId: null
		})

		expect(result.label).toBe('Snippet')
		expect(result.href).toBe('/items/snippets')
	})

	it('falls back to name-based label for custom types', () => {
		const result = toAppItemType({
			id: 'db-id-2',
			name: 'CustomType',
			icon: 'star',
			color: '#123456',
			isSystem: false,
			userId: 'user-1'
		})

		expect(result.label).toBe('CustomType')
		expect(result.href).toBe('/items/customtype')
	})
})