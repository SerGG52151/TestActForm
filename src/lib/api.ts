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
  title: string;
  body: string;
  userId: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

async function handleResponse<T>(response: Response, defaultMessage: string): Promise<T> {
  if (!response.ok) {
    throw new Error(defaultMessage);
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


export async function createPost(post: PostInput): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  return handleResponse<Post>(response, 'No se pudo crear la publicación');
}

export async function updatePost(postId: number, post: PostInput): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'PUT', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  return handleResponse<Post>(response, 'No se pudo actualizar la publicación');
}

export async function deletePost(postId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(response, 'No se pudo eliminar la publicación');
}
