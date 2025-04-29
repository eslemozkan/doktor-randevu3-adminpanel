import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrash, 
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../lib/supabase';

const initialForm = {
  title: '',
  category: '',
  content: '',
  image_url: ''
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('id', { ascending: false });

    if (!error) {
      setBlogs(data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.category || !form.content) {
      setError('Başlık, kategori ve içerik alanları zorunludur.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('blog_posts').insert([form]);

    if (error) {
      setError('Blog eklenemedi: ' + error.message);
    } else {
      setIsModalOpen(false);
      setForm(initialForm);
      fetchBlogs();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) {
      setLoading(true);
      await supabase.from('blog_posts').delete().eq('id', id);
      fetchBlogs();
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary-dark">Blog Yazıları</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-primary-light transition-colors shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
              <span>Yeni Blog Yazısı</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-background-light rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                {blog.image_url && (
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-primary-light text-primary px-2 py-1 rounded-full text-xs">
                      {blog.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary-dark mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {blog.content}
                  </p>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-primary-dark mb-4">Yeni Blog Yazısı</h3>
            <form onSubmit={handleAddBlog} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[100px]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                <input
                  type="text"
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Ekleniyor...' : 'Ekle'}
                </button>
              </div>
              {error && <div className="text-red-600 mt-2">{error}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs; 