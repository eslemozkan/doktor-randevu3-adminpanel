import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const fetchImageAsBlob = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], 'tahlil.jpg', { type: blob.type });
};

const TestResultSummary = ({ isOpen, onClose, testImage }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeTest = async (file) => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('http://localhost:3001/api/analyze-test', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Tahlil analizi sırasında bir hata oluştu');
      }
      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
      console.error('Error analyzing test:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && testImage) {
      if (typeof testImage === 'string') {
        fetchImageAsBlob(testImage).then(file => {
          analyzeTest(file);
        });
      } else {
        analyzeTest(testImage);
      }
    }
  }, [isOpen, testImage]);

  if (!isOpen) return null;
  if (!testImage) {
    return <div className="text-gray-500 text-center py-4">Tahlil görseli bulunamadı.</div>;
  }

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2 text-primary-dark">AI Tahlil Özeti</h4>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-3 text-gray-600">Tahlil analiz ediliyor...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      ) : (
        <div className="prose max-w-none">
          {summary.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestResultSummary; 