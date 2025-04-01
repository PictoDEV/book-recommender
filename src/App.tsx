import React, { useState } from 'react';
import { Search, Book, X, ExternalLink } from 'lucide-react';

// Available book categories/tags
const bookTags = [
  'Fiction', 'Non-Fiction', 'Science', 'History', 'Biography',
  'Fantasy', 'Romance', 'Mystery', 'Technology', 'Self-Help',
  'Business', 'Poetry', 'Art', 'Cooking', 'Travel', 'Young adult', 'Horror'
];

interface BookResult {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail: string;
    };
    description?: string;
    publishedDate?: string;
    previewLink?: string;
    infoLink?: string;
  };
}

function App() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<BookResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSearch = async () => {
    if (selectedTags.length === 0) return;

    setIsLoading(true);
    const query = selectedTags.join('+subject:');
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${query}&maxResults=20`
      );
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Book className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">ReadMore</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <h1 className="text-3xl font-bold text-center text-white mb-12 tracking-tight">
          Find your next great pick
        </h1>

        {/* Tags Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Select Categories:</h2>
          <div className="flex flex-wrap gap-2">
            {bookTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedTags.includes(tag)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleSearch}
            disabled={selectedTags.length === 0 || isLoading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium
              ${selectedTags.length === 0
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
              }`}
          >
            <Search className="h-5 w-5" />
            <span>{isLoading ? 'Searching...' : 'Search Books'}</span>
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map(book => (
            <a
              key={book.id}
              href={book.volumeInfo.infoLink || book.volumeInfo.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-700 group-hover:border-purple-500 group-hover:scale-[1.02]">
                <div className="aspect-[3/4] relative">
                  <img
                    src={book.volumeInfo.imageLinks?.thumbnail || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80'}
                    alt={book.volumeInfo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center">
                    <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-100 group-hover:text-purple-400 transition-colors">
                    {book.volumeInfo.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {book.volumeInfo.description || 'No description available.'}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Empty State */}
        {searchResults.length === 0 && !isLoading && (
          <div className="text-center text-gray-400 mt-8">
            <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select categories and click search to find books</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;