import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faPlus,
  faCalendarAlt,
  faUser,
  faFolder
} from '@fortawesome/free-solid-svg-icons';

const Blog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: 'Diyabet ve Beslenme',
      content: 'Diyabet hastaları için beslenme önerileri ve dikkat edilmesi gerekenler...',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
      author: 'Dr. Ahmet Yılmaz',
      date: '15 Mart 2024',
      category: 'Diyabet'
    },
    {
      id: 2,
      title: 'Tiroid Hastalıkları',
      content: 'Tiroid hastalıklarının belirtileri ve tedavi yöntemleri hakkında bilgiler...',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
      author: 'Dr. Ayşe Demir',
      date: '14 Mart 2024',
      category: 'Endokrinoloji'
    }
  ]);

  const handleAddPost = (newPost) => {
    setBlogPosts([...blogPosts, { ...newPost, id: blogPosts.length + 1 }]);
    setIsModalOpen(false);
  };

  const handleDeletePost = (id) => {
    setBlogPosts(blogPosts.filter(post => post.id !== id));
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-background-light rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-primary-light text-primary text-xs rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3 mr-1" />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary-dark mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-primary hover:text-primary-light transition-colors">
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Yeni Blog Yazısı Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-primary-dark mb-4">Yeni Blog Yazısı</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
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
                  onClick={() => handleAddPost({
                    title: 'Yeni Blog Yazısı',
                    content: 'Blog yazısı içeriği...',
                    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
                    author: 'Dr. Ahmet Yılmaz',
                    date: new Date().toLocaleDateString('tr-TR'),
                    category: 'Genel'
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

export default Blog; 