
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X, Filter, FileText, Users, Target, TrendingUp } from "lucide-react";
import { Supplier } from "@/types/supplier";
import { DEFAULT_CRITERIA } from "@/types/supplier";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'supplier' | 'criteria' | 'report';
  data: any;
  score?: number;
}

interface GlobalSearchProps {
  suppliers: Supplier[];
  onSupplierSelect: (supplier: Supplier) => void;
  onCriteriaSelect: (criteria: any) => void;
}

export const GlobalSearch = ({ suppliers, onSupplierSelect, onCriteriaSelect }: GlobalSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeFilter, setActiveFilter] = useState<'all' | 'suppliers' | 'criteria' | 'reports'>('all');
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Advanced search algorithm with fuzzy matching
  const fuzzyMatch = (text: string, searchTerm: string): number => {
    const textLower = text.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    if (textLower.includes(searchLower)) {
      return textLower.indexOf(searchLower) === 0 ? 100 : 80;
    }
    
    // Character-by-character matching for typos
    let score = 0;
    let j = 0;
    for (let i = 0; i < textLower.length && j < searchLower.length; i++) {
      if (textLower[i] === searchLower[j]) {
        score += 1;
        j++;
      }
    }
    
    return (score / searchLower.length) * 60;
  };

  // Generate search results
  const generateSearchResults = (): SearchResult[] => {
    if (!searchTerm.trim()) return [];

    const results: SearchResult[] = [];

    // Search suppliers
    if (activeFilter === 'all' || activeFilter === 'suppliers') {
      suppliers.forEach(supplier => {
        const nameScore = fuzzyMatch(supplier.name, searchTerm);
        const industryScore = fuzzyMatch(supplier.industry, searchTerm);
        const maxScore = Math.max(nameScore, industryScore);
        
        if (maxScore > 30) {
          results.push({
            id: `supplier-${supplier.id}`,
            title: supplier.name,
            subtitle: supplier.industry,
            description: `${supplier.status} supplier established in ${supplier.establishedYear}`,
            type: 'supplier',
            data: supplier,
            score: maxScore
          });
        }
      });
    }

    // Search criteria
    if (activeFilter === 'all' || activeFilter === 'criteria') {
      DEFAULT_CRITERIA.forEach(criteria => {
        const nameScore = fuzzyMatch(criteria.name, searchTerm);
        const descScore = fuzzyMatch(criteria.description, searchTerm);
        const categoryScore = fuzzyMatch(criteria.category, searchTerm);
        const maxScore = Math.max(nameScore, descScore, categoryScore);
        
        if (maxScore > 30) {
          results.push({
            id: `criteria-${criteria.id}`,
            title: criteria.name,
            subtitle: `${criteria.category} • ${criteria.weight}% weight`,
            description: criteria.description,
            type: 'criteria',
            data: criteria,
            score: maxScore
          });
        }
      });
    }

    // Search reports (mock data)
    if (activeFilter === 'all' || activeFilter === 'reports') {
      const mockReports = [
        { id: 'report-1', name: 'Supplier Performance Analysis', category: 'Performance', description: 'Comprehensive performance analytics and trends' },
        { id: 'report-2', name: 'Risk Assessment Report', category: 'Risk', description: 'Detailed risk evaluation and mitigation strategies' },
        { id: 'report-3', name: 'Industry Benchmarking', category: 'Benchmarking', description: 'Comparative analysis across industries' }
      ];

      mockReports.forEach(report => {
        const nameScore = fuzzyMatch(report.name, searchTerm);
        const categoryScore = fuzzyMatch(report.category, searchTerm);
        const descScore = fuzzyMatch(report.description, searchTerm);
        const maxScore = Math.max(nameScore, categoryScore, descScore);
        
        if (maxScore > 30) {
          results.push({
            id: `report-${report.id}`,
            title: report.name,
            subtitle: report.category,
            description: report.description,
            type: 'report',
            data: report,
            score: maxScore
          });
        }
      });
    }

    return results.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 10);
  };

  const searchResults = generateSearchResults();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(value.length > 0);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < searchResults.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : searchResults.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleResultSelect(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    if (result.type === 'supplier') {
      onSupplierSelect(result.data);
    } else if (result.type === 'criteria') {
      onCriteriaSelect(result.data);
    }
    setSearchTerm(result.title);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'supplier': return <Users className="w-4 h-4 text-blue-600" />;
      case 'criteria': return <Target className="w-4 h-4 text-green-600" />;
      case 'report': return <FileText className="w-4 h-4 text-purple-600" />;
      default: return <Search className="w-4 h-4 text-gray-600" />;
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(-1);
    searchRef.current?.focus();
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          ref={searchRef}
          placeholder="Search suppliers, criteria, reports..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(searchTerm.length > 0)}
          className="glass-input border-0 pl-12 pr-20 h-14 rounded-2xl text-base shadow-lg"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <Filter className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mt-3">
        {(['all', 'suppliers', 'criteria', 'reports'] as const).map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-xl smooth-transition ${
              activeFilter === filter 
                ? "liquid-button text-white" 
                : "frosted-glass border-0 hover-glow"
            }`}
          >
            {filter === 'all' && <TrendingUp className="w-3 h-3 mr-1" />}
            {filter === 'suppliers' && <Users className="w-3 h-3 mr-1" />}
            {filter === 'criteria' && <Target className="w-3 h-3 mr-1" />}
            {filter === 'reports' && <FileText className="w-3 h-3 mr-1" />}
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
        ))}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchResults.length > 0 && (
        <Card 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 py-3 z-50 shadow-2xl border-0 frosted-glass max-h-96 overflow-y-auto"
        >
          <div className="px-4 py-2 border-b border-white/20">
            <p className="text-sm text-gray-600 font-medium">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </p>
          </div>
          {searchResults.map((result, index) => (
            <div
              key={result.id}
              onClick={() => handleResultSelect(result)}
              className={`px-4 py-4 cursor-pointer transition-all duration-200 ${
                index === selectedIndex 
                  ? 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-l-4 border-blue-500' 
                  : 'hover:bg-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="glass-card p-2 rounded-lg">
                  {getResultIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">{result.title}</h4>
                    <Badge 
                      variant="outline" 
                      className="text-xs glass-card border-0"
                    >
                      {result.type}
                    </Badge>
                    {result.score && result.score > 80 && (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                        Exact match
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-blue-600 font-medium mb-1">{result.subtitle}</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{result.description}</p>
                </div>
              </div>
            </div>
          ))}
          
          {searchTerm && searchResults.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No results found</p>
              <p className="text-sm mt-1">Try adjusting your search terms or filters</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
