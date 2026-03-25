import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp, ArrowUpRight } from "lucide-react";
import { menuItems } from "../../data/menu";
import useSearchStore from "../../store/useSearchStore";

export default function AdvancedSearch({ value, onChange, onSearch }) {
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  const recentSearches = useSearchStore((s) => s.recentSearches);
  const addRecentSearch = useSearchStore((s) => s.addRecentSearch);
  const removeRecentSearch = useSearchStore((s) => s.removeRecentSearch);
  const clearRecentSearches = useSearchStore((s) => s.clearRecentSearches);

  // Generate autocomplete suggestions
  useEffect(() => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      return;
    }

    const query = value.toLowerCase();
    const matches = [];

    menuItems.forEach((item) => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const descMatch = item.description.toLowerCase().includes(query);

      if (nameMatch || descMatch) {
        matches.push({
          id: item.id,
          name: item.name,
          category: item.category,
          type: nameMatch ? "name" : "description",
        });
      }
    });

    // Limit to 5 suggestions
    setSuggestions(matches.slice(0, 5));
  }, [value]);

  const handleSelect = (searchTerm) => {
    onChange(searchTerm);
    addRecentSearch(searchTerm);
    onSearch(searchTerm);
    setFocused(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      addRecentSearch(value);
      onSearch(value);
      inputRef.current?.blur();
    }
  };

  const showDropdown = focused && (value.length >= 2 || recentSearches.length > 0);

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for dishes, ingredients..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          className="w-full bg-white border border-gray-300 rounded-lg pl-11 pr-10 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-hilltop-green focus:border-transparent transition-all shadow-sm"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              onSearch("");
              inputRef.current?.focus();
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 z-10"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {/* Autocomplete Suggestions */}
            {suggestions.length > 0 && (
              <div className="border-b border-gray-100">
                <div className="px-4 py-2 bg-gray-50 flex items-center gap-2">
                  <TrendingUp size={14} className="text-hilltop-gray" />
                  <span className="text-xs font-semibold text-hilltop-gray uppercase tracking-wide">
                    Suggestions
                  </span>
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.name)}
                    className="w-full px-4 py-3 hover:bg-hilltop-green/5 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Search size={16} className="text-gray-400 group-hover:text-hilltop-green transition-colors" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-hilltop-charcoal group-hover:text-hilltop-green transition-colors">
                          {item.name}
                        </p>
                        <p className="text-xs text-hilltop-gray capitalize">
                          {item.category.replace("-", " ")}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && value.length < 2 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-hilltop-gray" />
                    <span className="text-xs font-semibold text-hilltop-gray uppercase tracking-wide">
                      Recent Searches
                    </span>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-hilltop-green hover:text-hilltop-green-hover font-medium"
                  >
                    Clear All
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center hover:bg-gray-50 transition-colors"
                  >
                    <button
                      onClick={() => handleSelect(search)}
                      className="flex-1 px-4 py-3 flex items-center gap-3 text-left"
                    >
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-sm text-hilltop-charcoal">{search}</span>
                    </button>
                    <button
                      onClick={() => removeRecentSearch(search)}
                      className="px-4 py-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {value.length >= 2 && suggestions.length === 0 && (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-hilltop-gray">No matches found for "{value}"</p>
                <p className="text-xs text-hilltop-gray-light mt-1">
                  Try searching for something else
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
