import type { Post } from '../lib/api';

type PostListProps = {
  posts: Post[];
  selectedPostId: number | null;
  onSelectPost: (post: Post) => void;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  loading: boolean;
  error: string;
};

export default function PostList({ posts, selectedPostId, onSelectPost, onEdit, onDelete, loading, error }: PostListProps) {
  if (loading) {
    return <section className="panel"><p>Cargando publicaciones...</p></section>;
  }

  if (error) {
    return <section className="panel"><p className="error-text">{error}</p></section>;
  }

  if (!posts.length) {
    return <section className="panel"><p>No hay publicaciones que coincidan con la busqueda.</p></section>;
  }

  return (
    <section className="panel post-list">
      {posts.map((post) => (
        <button
          key={post.id}
          type="button"
          className={`post-card ${selectedPostId === post.id ? 'selected' : ''}`}
          onClick={() => onSelectPost(post)}
        >
          <span className="post-card-id">Post #{post.id}</span>
          <strong>{post.title}</strong>
          <p>{post.body.slice(0, 110)}...</p>
          <div className="post-card-actions">
            <button
              type="button"
              className="btn-edit"
              onClick={(e) => { e.stopPropagation(); onEdit(post); }}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn-delete"
              onClick={(e) => { e.stopPropagation(); onDelete(post.id); }}
            >
              Eliminar
            </button>
          </div>
        </button>
      ))}
    </section>
  );
}
