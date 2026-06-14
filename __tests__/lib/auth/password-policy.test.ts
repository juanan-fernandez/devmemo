import { describe, it, expect } from 'vitest'
import {
	isValidPassword,
	validatePassword,
	PASSWORD_ERROR_MESSAGE
} from '@/lib/auth/password-policy'

describe('isValidPassword', () => {
	it('accepts passwords with at least 8 chars and a digit', () => {
		expect(isValidPassword('password1')).toBe(true)
		expect(isValidPassword('12345678')).toBe(true)
	})

	it('accepts passwords with special characters', () => {
		expect(isValidPassword('password!')).toBe(true)
		expect(isValidPassword('p@ssword')).toBe(true)
	})

	it('accepts passwords with underscores', () => {
		expect(isValidPassword('pass_word')).toBe(true)
	})

	it('rejects passwords shorter than 8 characters', () => {
		expect(isValidPassword('pw1')).toBe(false)
		expect(isValidPassword('1234567')).toBe(false)
	})

	it('rejects passwords with only letters and no digits or symbols', () => {
		expect(isValidPassword('abcdefgh')).toBe(false)
		expect(isValidPassword('Password')).toBe(false)
	})
})

describe('validatePassword', () => {
	it('returns null for valid passwords', () => {
		expect(validatePassword('password1')).toBeNull()
		expect(validatePassword('p@ssword')).toBeNull()
	})

	it('returns Spanish empty message for empty string', () => {
		expect(validatePassword('')).toBe('Escribe una contraseña.')
	})

	it('returns Spanish policy message for invalid passwords', () => {
		expect(validatePassword('abc')).toBe(PASSWORD_ERROR_MESSAGE)
		expect(validatePassword('abcdefgh')).toBe(PASSWORD_ERROR_MESSAGE)
	})
})