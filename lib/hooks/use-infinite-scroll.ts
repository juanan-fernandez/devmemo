'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type UseInfiniteScrollOptions<T> = {
	/** Initial items loaded server-side */
	initialItems: T[]
	/** Cursor for the next page (null if no more pages) */
	initialNextCursor: string | null
	/** Function to call to load the next page. Receives the current cursor, returns new items + next cursor */
	loadMore: (cursor: string | null) => Promise<{ items: T[]; nextCursor: string | null }>
	/** Optional: called when items are reset (e.g. sort change) */
}

type InfiniteScrollState<T> = {
	items: T[]
	isLoadingMore: boolean
	hasMore: boolean
	/** Ref to attach to the sentinel element at the bottom of the list */
	sentinelRef: React.RefObject<HTMLDivElement | null>
	/** Call to reset the list with new initial data (e.g. when sort changes) */
	reset: (initialItems: T[], nextCursor: string | null) => void
}

export function useInfiniteScroll<T>({
	initialItems,
	initialNextCursor,
	loadMore
}: UseInfiniteScrollOptions<T>): InfiniteScrollState<T> {
	const [items, setItems] = useState<T[]>(initialItems)
	const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const hasMore = nextCursor !== null
	const sentinelRef = useRef<HTMLDivElement | null>(null)
	const loadingRef = useRef(false)
	const loadMoreRef = useRef(loadMore)

	useEffect(() => {
		loadMoreRef.current = loadMore
	}, [loadMore])

	const fetchNextPage = useCallback(async () => {
		if (loadingRef.current || nextCursor === null) return

		loadingRef.current = true
		setIsLoadingMore(true)

		try {
			const result = await loadMoreRef.current(nextCursor)
			setItems(current => [...current, ...result.items])
			setNextCursor(result.nextCursor)
		} finally {
			loadingRef.current = false
			setIsLoadingMore(false)
		}
	}, [nextCursor])

	useEffect(() => {
		const sentinel = sentinelRef.current
		if (!sentinel) return

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0]?.isIntersecting && hasMore && !loadingRef.current) {
					fetchNextPage()
				}
			},
			{ threshold: 0.1 }
		)

		observer.observe(sentinel)
		return () => observer.disconnect()
	}, [fetchNextPage, hasMore])

	const reset = useCallback(
		(newInitialItems: T[], newNextCursor: string | null) => {
			setItems(newInitialItems)
			setNextCursor(newNextCursor)
			setIsLoadingMore(false)
			loadingRef.current = false
		},
		[]
	)

	return { items, isLoadingMore, hasMore, sentinelRef: sentinelRef as React.RefObject<HTMLDivElement | null>, reset }
}
