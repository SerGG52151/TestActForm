import { useEffect, useState } from 'react';
import { fetchCommentsByPost, type Comment } from '../lib/api';

export function useComments(postId: number | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (postId === null) {
      setComments([]);
      setError('');
      setLoading(false);
      return;
    }

    let active = true;

    async function loadComments() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchCommentsByPost(postId!);
        if (active) setComments(data);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Error al cargar comentarios');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadComments();

    return () => {
      active = false;
    };
  }, [postId]);

  return {
    comments,
    loading,
    error,
  };
}
