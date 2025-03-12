
export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_private: boolean;
  is_anonymous: boolean;
  likes: number;
  comments: number;
  user_id: string;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  diary_entry_id: string;
  user_id: string;
  user?: {
    username: string | null;
    avatar_url: string | null;
    full_name: string | null;
  };
}

export interface Like {
  id: string;
  created_at: string;
  diary_entry_id: string;
  user_id: string;
}

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
