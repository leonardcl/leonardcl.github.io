import React, { useState, useEffect } from 'react';
import Navbar from './NavBar';

interface BibleVerse {
  reference: string;
  text: string;
  translation_name: string;
}

const Blessed: React.FC = () => {
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verseColor, setVerseColor] = useState<'pink' | 'blue'>('pink');

  // Popular Bible verses for random selection
  const popularVerses = [
    'john+3:16',
    'psalm+23:1',
    'matthew+28:19',
    'genesis+1:1',
    'romans+8:28',
    'philippians+4:13',
    'jeremiah+29:11',
    'proverbs+3:5-6',
    'isaiah+40:31',
    'galatians+5:22-23',
    'ephesians+2:8-9',
    'colossians+3:23',
    '1+corinthians+13:4-7',
    '2+timothy+1:7',
    'joshua+1:9',
    'deuteronomy+31:6',
    'psalm+119:105',
    'matthew+11:28-30',
    'john+14:6',
    'acts+1:8'
  ];

  const fetchRandomVerse = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Pick a random verse from the list
      const randomVerse = popularVerses[Math.random() * popularVerses.length | 0];
      
      const response = await fetch(`https://bible-api.com/${randomVerse}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch verse');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setVerse({
        reference: data.reference,
        text: data.text.trim(),
        translation_name: data.translation_name
      });
      
      // Set random color for the verse
      setVerseColor(Math.random() > 0.5 ? 'pink' : 'blue');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch verse');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomVerse();
  }, []);

  const handleNewVerse = () => {
    fetchRandomVerse();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading blessed verse...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg mb-4">Error loading verse: {error}</p>
          <button
            onClick={fetchRandomVerse}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App bg-gray-950">
      <Navbar />
      <div id="blessed" className="min-h-screen w-full font-quicksand">
        <div className="flex flex-col items-center justify-center min-h-screen p-10 pt-40 md:pt-40 pb-40 md:p-40 md:pb-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl xs:text-7xl sm:text-8xl font-bold text-gray-100 font-sans mb-4">
              <span className="text-cyan-400">B</span>lessed
            </h1>
            <p className="text-xl text-gray-400 font-sans font-quicksand">
              A random Bible verse to bless your day
            </p>
          </div>

          {/* Verse Display */}
          {verse && (
            <div className="bg-gray-900 rounded-2xl p-8 md:p-12 mb-8 border border-gray-800">
              <div className="mb-6">
                <h2 className={`text-2xl md:text-3xl font-semibold mb-4 ${
                  verseColor === 'pink' ? 'text-pink-400' : 'text-blue-400'
                }`}>
                  {verse.reference}
                </h2>
                <p className={`text-lg md:text-xl leading-relaxed ${
                  verseColor === 'pink' ? 'text-pink-300' : 'text-blue-300'
                }`}>
                  "{verse.text}"
                </p>
              </div>
              
              <div className="text-sm text-gray-400">
                {verse.translation_name}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleNewVerse}
              className="bg-inhirit tracking-[.40em] text-gray-200 px-6 py-3 mt-4 hover:bg-cyan-400 border-b-2 border-cyan-400 hover:font-semibold transition-all duration-250 ease-in-out bg-inhirit group"
            >
              <span className="w-full text-left transition-colors duration-150 ease-in-out group-hover:text-gray-800">
                GET ANOTHER VERSE
              </span>
            </button>
            
            <div className="text-gray-400 text-sm mt-4">
              <p>Click to receive a new blessing</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-gray-500 text-sm">
            <p>May these words bring peace and encouragement to your heart</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Blessed;
