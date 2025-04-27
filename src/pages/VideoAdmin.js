import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const initialForm = {
  title: '',
  description: '',
  url: '',
  doctor_id: ''
};

const VideoAdmin = () => {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.title || !form.url || !form.doctor_id) {
      setError('Başlık, video linki ve doktor ID zorunludur.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('videos').insert([form]);
    if (error) {
      setError('Video eklenemedi: ' + error.message);
    } else {
      setSuccess('Video başarıyla eklendi!');
      setForm(initialForm);
      fetchVideos();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Video Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block font-semibold">Başlık</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Açıklama</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Video Linki (url)</label>
          <input type="text" name="url" value={form.url} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Doktor ID</label>
          <input type="text" name="doctor_id" value={form.doctor_id} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Ekleniyor...' : 'Video Ekle'}
        </button>
      </form>

      <h2 className="text-xl font-bold mt-8 mb-4">Ekli Videolar</h2>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <ul className="space-y-2">
          {videos.map(video => (
            <li key={video.id} className="bg-background-light p-3 rounded shadow">
              <div className="font-semibold">{video.title}</div>
              <div className="text-sm text-gray-600">{video.description}</div>
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Videoyu İzle
              </a>
              <div className="text-xs text-gray-400">Doktor ID: {video.doctor_id}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VideoAdmin; 