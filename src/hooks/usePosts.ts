import { useEffect, useMemo, useState } from 'react';
import { fetchPosts, createPost, updatePost, deletePost, type Post, PostInput } from '../lib/api';

export function usePosts(searchTerm: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // 1. We use a simple counter to trigger refreshes without useCallback
  const [refreshTick, setRefreshTick] = useState(0);

  // Function to trigger a reload from the UI
  const reloadPosts = () => setRefreshTick(prev => prev + 1);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchPosts();
        if (active) setPosts(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Error');
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => { active = false; };
  }, [refreshTick]); // 2. This effect only re-runs when refreshTick changes

  // CRUD Functions (Defined as plain functions, no hooks used here)
  const createNewPost = async (input: PostInput) => {
    const newPost = await createPost(input);
    setPosts(prev => [newPost, ...prev]);
  };

  const editPost = async (id: PostInput["userId"], input: PostInput) => {
    const updated = await updatePost(id, input);
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const removePost = async (id: number) => {
    await deletePost(id);
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const filteredPosts = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return normalized 
      ? posts.filter(p => p.title.toLowerCase().includes(normalized)) 
      : posts;
  }, [posts, searchTerm]);

  return { posts, filteredPosts, loading, error, reloadPosts, createNewPost, editPost, removePost };
}