import { useState, useEffect, useCallback } from 'react';

export const useInfiniteScroll = (fetchData, initialCursor = null) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentCursor, setCurrentCursor] = useState(initialCursor);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const response = await fetchData(currentCursor);
      
      const { posts, pagination } = response.data;
      
      setItems(prev => [...prev, ...posts]);
      setHasMore(pagination.hasNextPage);
      setCurrentCursor(pagination.nextCursor);
      
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [currentCursor, fetchData, hasMore, loading]);

  const reset = useCallback(() => {
    setItems([]);
    setCurrentCursor(null);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    reset
  };
};