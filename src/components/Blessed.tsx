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
    // --- your originals ---
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
    'acts+1:8',
  
    // --- more OT (law/history) ---
    'genesis+1:27',
    'genesis+12:2-3',
    'genesis+50:20',
    'exodus+14:14',
    'exodus+20:3-17',
    'exodus+33:14',
    'exodus+34:6-7',
    'numbers+6:24-26',
    'numbers+23:19',
    'deuteronomy+6:4-5',
    'deuteronomy+7:9',
    'deuteronomy+30:19-20',
    'joshua+1:8',
    'joshua+24:15',
    'judges+21:25',
    'ruth+1:16-17',
    '1+samuel+12:24',
    '1+samuel+16:7',
    '2+samuel+22:31',
    '1+kings+19:12',
    '2+kings+6:16',
    '1+chronicles+16:34',
    '1+chronicles+28:20',
    '2+chronicles+7:14',
    '2+chronicles+16:9',
    'ezra+7:10',
    'ezra+8:22',
    'nehemiah+4:14',
    'nehemiah+8:10',
    'esther+4:14',
  
    // --- wisdom/poetry ---
    'job+1:21',
    'job+19:25-26',
    'job+38:4',
    'psalm+1:1-3',
    'psalm+16:11',
    'psalm+18:2',
    'psalm+19:1',
    'psalm+23:4',
    'psalm+27:1',
    'psalm+34:8',
    'psalm+37:4',
    'psalm+42:1',
    'psalm+46:1',
    'psalm+51:10',
    'psalm+55:22',
    'psalm+73:26',
    'psalm+84:10',
    'psalm+90:12',
    'psalm+91:1-2',
    'psalm+95:6',
    'psalm+100:4-5',
    'psalm+103:12',
    'psalm+118:24',
    'psalm+119:11',
    'psalm+121:1-2',
    'psalm+127:1',
    'psalm+139:13-14',
    'psalm+150:6',
    'proverbs+1:7',
    'proverbs+4:23',
    'proverbs+9:10',
    'proverbs+11:25',
    'proverbs+12:25',
    'proverbs+16:3',
    'proverbs+16:9',
    'proverbs+18:10',
    'proverbs+19:21',
    'proverbs+22:6',
    'proverbs+27:17',
    'ecclesiastes+3:1',
    'ecclesiastes+4:9-10',
    'ecclesiastes+7:14',
    'ecclesiastes+12:13',
    'song+of+songs+2:1',
    'song+of+songs+8:6-7',
  
    // --- major/minor prophets ---
    'isaiah+7:14',
    'isaiah+9:6',
    'isaiah+26:3',
    'isaiah+41:10',
    'isaiah+43:2',
    'isaiah+53:5',
    'isaiah+55:8-9',
    'jeremiah+9:23-24',
    'jeremiah+33:3',
    'lamentations+3:22-23',
    'ezekiel+36:26',
    'daniel+3:17-18',
    'daniel+6:10',
    'daniel+12:3',
    'hosea+6:6',
    'hosea+14:4',
    'joel+2:12-13',
    'joel+2:28',
    'amos+5:24',
    'amos+9:11',
    'obadiah+1:15',
    'jonah+2:2',
    'micah+6:8',
    'nahum+1:7',
    'habakkuk+2:4',
    'habakkuk+3:17-19',
    'zephaniah+2:3',
    'zephaniah+3:17',
    'haggai+2:9',
    'zechariah+4:6',
    'zechariah+9:9',
    'zechariah+14:9',
    'malachi+3:10',
    'malachi+4:2',
  
    // --- gospels (matthew–john) ---
    'matthew+4:4',
    'matthew+5:3-12',
    'matthew+5:14-16',
    'matthew+6:33',
    'matthew+7:7-8',
    'matthew+9:37-38',
    'matthew+16:24',
    'matthew+22:37-39',
    'matthew+28:20',
    'mark+1:15',
    'mark+8:34-36',
    'mark+10:45',
    'mark+12:30-31',
    'luke+1:37',
    'luke+2:10-11',
    'luke+6:31',
    'luke+9:23',
    'luke+10:27',
    'luke+12:32',
    'luke+15:7',
    'luke+23:34',
    'john+1:1-3',
    'john+1:14',
    'john+3:17',
    'john+7:38',
    'john+8:12',
    'john+10:10',
    'john+11:25-26',
    'john+13:34-35',
    'john+14:1-3',
    'john+14:27',
    'john+15:5',
    'john+16:33',
    'john+17:3',
    'john+20:29',
  
    // --- acts & paul’s letters ---
    'acts+2:38',
    'acts+4:12',
    'acts+20:24',
    'acts+16:31',
    'romans+1:16',
    'romans+3:23',
    'romans+5:8',
    'romans+6:23',
    'romans+8:31',
    'romans+8:35-37',
    'romans+8:38-39',
    'romans+10:9-10',
    'romans+12:1-2',
    'romans+15:13',
    '1+corinthians+6:19-20',
    '1+corinthians+10:13',
    '1+corinthians+13:13',
    '1+corinthians+15:3-4',
    '2+corinthians+4:16-18',
    '2+corinthians+5:7',
    '2+corinthians+5:17',
    '2+corinthians+12:9-10',
    'galatians+2:20',
    'galatians+3:28',
    'galatians+6:9',
    'ephesians+1:3-4',
    'ephesians+3:20-21',
    'ephesians+4:2',
    'ephesians+4:29',
    'ephesians+5:25',
    'ephesians+6:10-11',
    'philippians+1:6',
    'philippians+2:3-4',
    'philippians+3:13-14',
    'philippians+4:4',
    'philippians+4:6-7',
    'colossians+1:15-17',
    'colossians+2:6-7',
    'colossians+3:2',
    'colossians+3:12-14',
    '1+thessalonians+4:16-17',
    '1+thessalonians+5:16-18',
    '2+thessalonians+2:16-17',
    '2+thessalonians+3:3',
    '1+timothy+4:12',
    '1+timothy+6:12',
    '2+timothy+2:15',
    '2+timothy+4:7',
    'titus+2:11-12',
    'titus+3:5',
    'philemon+1:6',
  
    // --- general letters & revelation ---
    'hebrews+4:12',
    'hebrews+10:24-25',
    'hebrews+11:1',
    'hebrews+12:1-2',
    'hebrews+13:5-6',
    'james+1:2-4',
    'james+1:5',
    'james+4:7-8',
    '1+peter+1:3-4',
    '1+peter+2:9',
    '1+peter+3:15',
    '1+peter+5:7',
    '2+peter+1:3-4',
    '2+peter+3:9',
    '1+john+1:9',
    '1+john+3:1',
    '1+john+4:7-8',
    '1+john+4:18-19',
    '1+john+5:13-14',
    '2+john+1:6',
    '3+john+1:2',
    'jude+1:24-25',
    'revelation+1:8',
    'revelation+3:20',
    'revelation+12:11',
    'revelation+21:3-4',
    'revelation+22:13',
    'revelation+22:17'
  ];
  

  const fetchRandomVerse = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Pick a random verse from the list
      const randomVerse = popularVerses[Math.random() * popularVerses.length | 0];
      
      const response = await fetch(`https://bible-api.com/${randomVerse}?translation=kjv`);
      
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
