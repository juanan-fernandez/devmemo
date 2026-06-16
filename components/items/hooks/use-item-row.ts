'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function useItemRow() {
	const router = useRouter()
	const [isDeleted, setIsDeleted] = useState(false)
	const [showMessage, setShowMessage] = useState(false)
	const [sheetOpen, setSheetOpen] = useState(false)
	const [sheetSession, setSheetSession] = useState(0)

	const handleOpenSheet = useCallback(() => {
		setSheetSession(currentSession => currentSession + 1)
		setSheetOpen(true)
	}, [])

	const handleDelete = useCallback(() => {
		setSheetOpen(false)
		setIsDeleted(true)
		setShowMessage(true)

		setTimeout(() => {
			setShowMessage(false)
			router.refresh()
		}, 2000)
	}, [router])

	return {
		isDeleted,
		showMessage,
		sheetSession,
		sheetOpen,
		setSheetOpen,
		handleDelete,
		handleOpenSheet,
	}
}
