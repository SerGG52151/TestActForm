# Solucion de referencia - Refactor a CRUD

Este archivo contiene una propuesta funcional para resolver la practica.
Usala como referencia cuando te atoras, no como copia directa.

## 1) `src/lib/api.ts`

```ts
export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export type PostInput = {
  userId: number;
  title: string;
  body: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

async function handleResponse<T>(response: Response, defaultMessage: string): Promise<T> {
  if (!response.ok) {
    throw new Error(defaultMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(`${API_BASE_URL}/posts`);
  return handleResponse<Post[]>(response, 'No se pudieron cargar las publicaciones');
}

export async function fetchCommentsByPost(postId: number): Promise<Comment[]> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
  return handleResponse<Comment[]>(response, 'No se pudieron cargar los comentarios');
}

export async function createPost(input: PostInput): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return handleResponse<Post>(response, 'No se pudo crear la publicacion');
}

export async function updatePost(postId: number, input: PostInput): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return handleResponse<Post>(response, 'No se pudo actualizar la publicacion');
}

export async function deletePost(postId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
  });

  await handleResponse<void>(response, 'No se pudo eliminar la publicacion');
}
```

## 2) `src/hooks/usePosts.ts`

```ts
import { useEffect, useMemo, useState } from 'react';
import {
  createPost,
  deletePost,
  fetchPosts,
  type Post,
  type PostInput,
  updatePost,
} from '../lib/api';

export function usePosts(searchTerm: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function reloadPosts() {
    try {
      setLoading(true);
      setError('');
      const data = await fetchPosts();
      setPosts(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Error al cargar posts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reloadPosts();
  }, []);

  async function createNewPost(input: PostInput) {
    try {
      setSaving(true);
      setError('');
      const created = await createPost(input);
      setPosts((prev) => [created, ...prev]);
      return created;
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Error al crear post');
      throw saveError;
    } finally {
      setSaving(false);
    }
  }

  async function editPost(postId: number, input: PostInput) {
    try {
      setSaving(true);
      setError('');
      const updated = await updatePost(postId, input);
      setPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
      return updated;
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Error al editar post');
      throw saveError;
    } finally {
      setSaving(false);
    }
  }

  async function removePost(postId: number) {
    try {
      setSaving(true);
      setError('');
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Error al eliminar post');
      throw saveError;
    } finally {
      setSaving(false);
    }
  }

  const filteredPosts = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return posts;

    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(normalized) ||
        post.body.toLowerCase().includes(normalized)
      );
    });
  }, [posts, searchTerm]);

  return {
    posts,
    filteredPosts,
    loading,
    saving,
    error,
    reloadPosts,
    createNewPost,
    editPost,
    removePost,
  };
}
```

## 3) `src/components/PostForm.tsx`

```tsx
import { useEffect, useState } from 'react';
import type { PostInput } from '../lib/api';

type PostFormProps = {
  initialValues?: PostInput;
  submitLabel: string;
  loading: boolean;
  onSubmit: (input: PostInput) => Promise<void>;
  onCancel?: () => void;
};

const DEFAULT_VALUES: PostInput = {
  userId: 1,
  title: '',
  body: '',
};

export default function PostForm({
  initialValues,
  submitLabel,
  loading,
  onSubmit,
  onCancel,
}: PostFormProps) {
  const [values, setValues] = useState<PostInput>(initialValues ?? DEFAULT_VALUES);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setValues(initialValues ?? DEFAULT_VALUES);
    setFormError('');
  }, [initialValues]);

  function updateField<K extends keyof PostInput>(key: K, value: PostInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.title.trim() || !values.body.trim()) {
      setFormError('Titulo y contenido son obligatorios.');
      return;
    }

    setFormError('');
    await onSubmit({
      ...values,
      title: values.title.trim(),
      body: values.body.trim(),
    });

    if (!initialValues) {
      setValues(DEFAULT_VALUES);
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h3>{submitLabel}</h3>
      <label>
        Usuario
        <input
          type="number"
          min={1}
          value={values.userId}
          onChange={(event) => updateField('userId', Number(event.target.value) || 1)}
        />
      </label>

      <label>
        Titulo
        <input
          value={values.title}
          onChange={(event) => updateField('title', event.target.value)}
        />
      </label>

      <label>
        Contenido
        <textarea
          rows={5}
          value={values.body}
          onChange={(event) => updateField('body', event.target.value)}
        />
      </label>

      {formError ? <p className="error-text">{formError}</p> : null}

      <div>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : submitLabel}
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
```

## 4) `src/components/PostList.tsx` (con acciones)

```tsx
import type { Post } from '../lib/api';

type PostListProps = {
  posts: Post[];
  selectedPostId: number | null;
  onSelectPost: (post: Post) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (post: Post) => void;
  loading: boolean;
  error: string;
  saving: boolean;
};

export default function PostList({
  posts,
  selectedPostId,
  onSelectPost,
  onEditPost,
  onDeletePost,
  loading,
  error,
  saving,
}: PostListProps) {
  if (loading) return <section className="panel"><p>Cargando publicaciones...</p></section>;
  if (error) return <section className="panel"><p className="error-text">{error}</p></section>;
  if (!posts.length) {
    return <section className="panel"><p>No hay publicaciones que coincidan.</p></section>;
  }

  return (
    <section className="panel post-list">
      {posts.map((post) => (
        <article key={post.id} className={`post-card ${selectedPostId === post.id ? 'selected' : ''}`}>
          <button type="button" onClick={() => onSelectPost(post)}>
            <span className="post-card-id">Post #{post.id}</span>
            <strong>{post.title}</strong>
            <p>{post.body.slice(0, 110)}...</p>
          </button>

          <div>
            <button type="button" onClick={() => onEditPost(post)} disabled={saving}>
              Editar
            </button>
            <button type="button" onClick={() => onDeletePost(post)} disabled={saving}>
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
```

## 5) `src/App.tsx` (integracion CRUD)

```tsx
import { useMemo, useState } from 'react';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import SearchBar from './components/SearchBar';
import { useComments } from './hooks/useComments';
import { usePosts } from './hooks/usePosts';
import type { Post, PostInput } from './lib/api';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const {
    posts,
    filteredPosts,
    loading,
    saving,
    error,
    createNewPost,
    editPost,
    removePost,
  } = usePosts(searchTerm);

  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
  } = useComments(selectedPost?.id ?? null);

  const stats = useMemo(() => {
    return {
      totalPosts: posts.length,
      filteredPosts: filteredPosts.length,
      selectedPostId: selectedPost?.id ?? 'Ninguno',
    };
  }, [posts.length, filteredPosts.length, selectedPost]);

  async function handleCreate(input: PostInput) {
    await createNewPost(input);
  }

  async function handleEdit(input: PostInput) {
    if (!editingPost) return;
    const updated = await editPost(editingPost.id, input);
    setSelectedPost(updated);
    setEditingPost(null);
  }

  async function handleDelete(post: Post) {
    const confirmed = window.confirm(`Eliminar el post #${post.id}?`);
    if (!confirmed) return;

    await removePost(post.id);

    if (selectedPost?.id === post.id) {
      setSelectedPost(null);
    }

    if (editingPost?.id === post.id) {
      setEditingPost(null);
    }
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Practica React + TypeScript</p>
        <h1>Explorador de publicaciones (CRUD)</h1>
      </header>

      <section className="stats-grid">
        <article className="stat-card"><span>Total de posts</span><strong>{stats.totalPosts}</strong></article>
        <article className="stat-card"><span>Posts filtrados</span><strong>{stats.filteredPosts}</strong></article>
        <article className="stat-card"><span>Post seleccionado</span><strong>{stats.selectedPostId}</strong></article>
      </section>

      <PostForm submitLabel="Crear publicacion" loading={saving} onSubmit={handleCreate} />

      {editingPost ? (
        <PostForm
          initialValues={{
            userId: editingPost.userId,
            title: editingPost.title,
            body: editingPost.body,
          }}
          submitLabel={`Guardar cambios #${editingPost.id}`}
          loading={saving}
          onSubmit={handleEdit}
          onCancel={() => setEditingPost(null)}
        />
      ) : null}

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <section className="layout">
        <PostList
          posts={filteredPosts}
          selectedPostId={selectedPost?.id ?? null}
          onSelectPost={setSelectedPost}
          onEditPost={setEditingPost}
          onDeletePost={handleDelete}
          loading={loading}
          error={error}
          saving={saving}
        />

        <PostDetail
          post={selectedPost}
          comments={comments}
          commentsLoading={commentsLoading}
          commentsError={commentsError}
        />
      </section>
    </main>
  );
}
```

## 6) Consejos para destrabarte por etapas

1. Si no funciona `POST`, verifica `Content-Type: application/json`.
2. Si no ves cambios tras editar/eliminar, revisa si actualizas el estado local (`setPosts`).
3. Si el detalle queda "fantasma" tras eliminar, limpia `selectedPost`.
4. Si hay errores raros con ids, revisa tipos (`number` vs `string`).

## 7) Verificacion rapida

- Crear post nuevo desde UI.
- Editar post existente.
- Eliminar post.
- Recargar navegador y confirmar persistencia en `db.json`.
