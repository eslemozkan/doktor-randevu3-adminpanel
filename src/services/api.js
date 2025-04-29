import { supabase } from '../lib/supabase';

// Video işlemleri
export const getVideos = async () => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteVideo = async (id) => {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Blog işlemleri
export const getBlogs = async () => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
  return data;
};

export const getBlogById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const createBlog = async (blogData) => {
  const { data, error } = await supabase
    .from('blogs')
    .insert([{
      ...blogData,
      created_at: new Date().toISOString()
    }])
    .select();

  if (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
  return data[0];
};

export const updateBlog = async (id, blogData) => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .update({
        ...blogData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating blog:', error);
      return null;
    }
    return data[0];
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const deleteBlog = async (id) => {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
}; 