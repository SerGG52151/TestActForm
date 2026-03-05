import { useMemo, useState } from 'react';
import SearchBar from './components/SearchBar';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm'; // Import your form
import { useComments } from './hooks/useComments';
import { usePosts } from './hooks/usePosts';
import type { Post } from './lib/api';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // 1. Control if the form is visible and if we are editing
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);

  const { 
    filteredPosts, posts, loading, error, 
    createNewPost, editPost, removePost 
  } = usePosts(searchTerm);

  const { comments, loading: commentsLoading, error: commentsError } = useComments(selectedPost?.id ?? null);

  // 2. Centralized Submit Handler
  const handleFormSubmit = async (data: { title: string; body: string; userId: number }) => {
    if (postToEdit) {
      await editPost(postToEdit.id, data);
    } else {
      await createNewPost(data);
    }
    // Cleanup: Close form and reset edit state
    setIsFormOpen(false);
    setPostToEdit(null);
  };

  const stats = useMemo(() => ({
    totalPosts: posts.length,
    filteredPosts: filteredPosts.length,
    selectedPostId: selectedPost?.id ?? 'Ninguno',
  }), [posts.length, filteredPosts.length, selectedPost]);

  return (
    <main className="app-shell">
      <header className="hero">
        <h1>Explorador de publicaciones</h1>
        <button onClick={() => { setIsFormOpen(true); setPostToEdit(null); }}>
          + Nuevo Post
        </button>
      </header>

      {/* 3. Conditional Rendering of the Form */}
      {isFormOpen && (
        <section className="modal-overlay">
          <div className="modal-content">
            <h2>{postToEdit ? 'Editar Post' : 'Nuevo Post'}</h2>
            <PostForm 
              initialValues={postToEdit ? { title: postToEdit.title, body: postToEdit.body, userId: postToEdit.userId } : undefined}
              onSubmit={handleFormSubmit}
              submitLabel={postToEdit ? 'Guardar Cambios' : 'Crear'}
              loading={loading}
            />
            <button onClick={() => setIsFormOpen(false)}>Cancelar</button>
          </div>
        </section>
      )}

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total de posts</span>
          <strong>{stats.totalPosts}</strong>
        </article>
        {/* ... other stats ... */}
      </section>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <section className="layout">
        <PostList
          posts={filteredPosts}
          selectedPostId={selectedPost?.id ?? null}
          onSelectPost={setSelectedPost}
          loading={loading}
          error={error}
          onEdit={(post) => { setPostToEdit(post); setIsFormOpen(true); }}
          onDelete={(id) => removePost(id)}
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