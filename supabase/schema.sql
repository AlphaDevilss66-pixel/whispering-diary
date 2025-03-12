
-- Create diary_entries table
CREATE TABLE diary_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_private BOOLEAN DEFAULT TRUE,
  is_anonymous BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 100)
);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diary_entry_id UUID NOT NULL REFERENCES diary_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create likes table (to prevent multiple likes by the same user)
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  diary_entry_id UUID NOT NULL REFERENCES diary_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(diary_entry_id, user_id)
);

-- Create profiles table for user profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies

-- Diary entries policies
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- Users can view their own entries
CREATE POLICY "Users can view own entries" 
ON diary_entries FOR SELECT 
USING (auth.uid() = user_id);

-- Users can view public entries
CREATE POLICY "Anyone can view public entries" 
ON diary_entries FOR SELECT 
USING (NOT is_private);

-- Users can insert their own entries
CREATE POLICY "Users can insert own entries" 
ON diary_entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own entries
CREATE POLICY "Users can update own entries" 
ON diary_entries FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own entries
CREATE POLICY "Users can delete own entries" 
ON diary_entries FOR DELETE 
USING (auth.uid() = user_id);

-- Comments policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view comments on public entries
CREATE POLICY "Anyone can view comments on public entries" 
ON comments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM diary_entries 
    WHERE diary_entries.id = comments.diary_entry_id 
    AND NOT diary_entries.is_private
  )
);

-- Users can view comments on their own entries
CREATE POLICY "Users can view comments on own entries" 
ON comments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM diary_entries 
    WHERE diary_entries.id = comments.diary_entry_id 
    AND diary_entries.user_id = auth.uid()
  )
);

-- Users can insert comments
CREATE POLICY "Users can insert comments" 
ON comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments" 
ON comments FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" 
ON comments FOR DELETE 
USING (auth.uid() = user_id);

-- Likes policies
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Anyone can view likes count
CREATE POLICY "Anyone can view likes" 
ON likes FOR SELECT 
USING (true);

-- Users can insert likes
CREATE POLICY "Users can insert likes" 
ON likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete own likes" 
ON likes FOR DELETE 
USING (auth.uid() = user_id);

-- Profiles policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view profiles
CREATE POLICY "Anyone can view profiles" 
ON profiles FOR SELECT 
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create trigger to create profile after user signup
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_user();
