import type { Comment, Post } from '../lib/api';

type PostDetailProps = {
  post: Post | null;
  comments: Comment[];
  commentsLoading: boolean;
  commentsError: string;
};

export default function PostDetail({ post, comments, commentsLoading, commentsError }: PostDetailProps) {
  if (!post) {
    return (
      <section className="panel detail-panel empty-state">
        <h2>Selecciona una publicacion</h2>
        <p>Haz clic en una tarjeta para ver el contenido completo y sus comentarios.</p>
      </section>
    );
  }

  return (
    <section className="panel detail-panel">
      <span className="post-card-id">Post #{post.id} | Usuario #{post.userId}</span>
      <h2>{post.title}</h2>
      <p className="detail-body">{post.body}</p>

      <div className="comments-header">
        <h3>Comentarios</h3>
        <span>{comments.length}</span>
      </div>

      {commentsLoading ? <p>Cargando comentarios...</p> : null}
      {commentsError ? <p className="error-text">{commentsError}</p> : null}

      {!commentsLoading && !commentsError ? (
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-card">
              <strong>{comment.name}</strong>
              <span>{comment.email}</span>
              <p>{comment.body}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
