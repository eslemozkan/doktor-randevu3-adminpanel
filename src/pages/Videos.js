import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, 
  faTrash, 
  faPlus,
  faCalendarAlt,
  faUser,
  faFolder
} from '@fortawesome/free-solid-svg-icons';

const Videos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'Diyabet Tedavisi',
      description: 'Diyabet tedavisinde güncel yaklaşımlar ve tedavi yöntemleri...',
      thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
      author: 'Dr. Ahmet Yılmaz',
      date: '15 Mart 2024',
      category: 'Diyabet',
      duration: '12:34'
    },
    {
      id: 2,
      title: 'Tiroid Hastalıkları',
      description: 'Tiroid hastalıklarının teşhis ve tedavi süreçleri...',
      thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
      author: 'Dr. Ayşe Demir',
      date: '14 Mart 2024',
      category: 'Endokrinoloji',
      duration: '15:20'
    }
  ]);

  const handleAddVideo = (newVideo) => {
    setVideos([...videos, { ...newVideo, id: videos.length + 1 }]);
    setIsModalOpen(false);
  };

  const handleDeleteVideo = (id) => {
    setVideos(videos.filter(video => video.id !== id));
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
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <FontAwesomeIcon icon={faPlay} className="w-5 h-5 text-primary" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-primary-light text-primary text-xs rounded-full">
                      {video.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3 mr-1" />
                      {video.date}
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
                      <span>{video.author}</span>
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleAddVideo({
                    title: 'Yeni Video',
                    description: 'Video açıklaması...',
                    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
                    author: 'Dr. Ahmet Yılmaz',
                    date: new Date().toLocaleDateString('tr-TR'),
                    category: 'Genel',
                    duration: '00:00'
                  })}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos; 