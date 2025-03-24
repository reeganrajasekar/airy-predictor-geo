
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, MapPin } from 'lucide-react';
import { searchLocation } from '@/utils/api';

interface SearchLocationProps {
  onLocationSelect: (latitude: number, longitude: number, city: string, country: string) => void;
}

const SearchLocation: React.FC<SearchLocationProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ latitude: number; longitude: number; city: string; country: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const locations = await searchLocation(query);
      setResults(locations);
      setIsDropdownOpen(locations.length > 0);
    } catch (error) {
      console.error('Error searching for location:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };
  
  const handleLocationClick = (latitude: number, longitude: number, city: string, country: string) => {
    onLocationSelect(latitude, longitude, city, country);
    setQuery(`${city}, ${country}`);
    setIsDropdownOpen(false);
  };
  
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="w-full max-w-md mx-auto relative" ref={searchRef}>
      <div className="relative">
        <div className="flex items-center glass-card rounded-full pl-4 pr-2 h-12 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 h-full"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="h-8 w-8 rounded-full"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={handleSearch}
            size="sm"
            className="rounded-full h-8"
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>
      
      {isDropdownOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl shadow-lg overflow-hidden z-20 animate-fade-in">
          <ul className="py-2 max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <li key={index}>
                <button
                  className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-primary/5 transition-colors"
                  onClick={() => handleLocationClick(result.latitude, result.longitude, result.city, result.country)}
                  type="button"
                >
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <div className="font-medium">{result.city}</div>
                    <div className="text-sm text-muted-foreground">{result.country}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchLocation;
