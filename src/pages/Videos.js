import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, 
  faTrash, 
  faPlus,
  faCalendarAlt,
  faUser,
  faFolder
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../lib/supabase';

const initialForm = {
  title: '',
  description: '',
  url: '',
  thumbnail: ''
};

const Videos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setVideos(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.url) {
      setError('Başlık ve video linki zorunludur.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('videos').insert([form]);
    if (error) {
      setError('Video eklenemedi: ' + error.message);
    } else {
      setIsModalOpen(false);
      setForm(initialForm);
      fetchVideos();
    }
    setLoading(false);
  };

  const handleDeleteVideo = async (id) => {
    setLoading(true);
    await supabase.from('videos').delete().eq('id', id);
    fetchVideos();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary-dark">Videolar</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-primary-light transition-colors shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
              <span>Yeni Video Ekle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-background-light rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={video.thumbnail || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef'} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <FontAwesomeIcon icon={faPlay} className="w-5 h-5 text-primary" />
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-gray-500 flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3 mr-1" />
                      {video.date || (video.created_at && video.created_at.split('T')[0])}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary-dark mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                    </div>
                    <button 
                      onClick={() => handleDeleteVideo(video.id)}
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

      {/* Yeni Video Ekleme Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-primary-dark mb-4">Yeni Video Ekle</h3>
            <form onSubmit={handleAddVideo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <input
                  type="text"
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  name="thumbnail"
                  value={form.thumbnail}
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

export default Videos; 