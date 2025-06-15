import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { Supplier } from "@/types/supplier";

interface AdvancedSearchProps {
  suppliers: Supplier[];
  onSearchChange: (searchTerm: string) => void;
  onSupplierSelect: (supplier: Supplier) => void;
  searchTerm: string;
}

export const AdvancedSearch = ({ suppliers, onSearchChange, onSupplierSelect, searchTerm }: AdvancedSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.industry.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 8); // Limit to 8 results

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    setIsOpen(value.length > 0);
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredSuppliers.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuppliers.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuppliers.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuppliers.length) {
          handleSupplierSelect(filteredSuppliers[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle supplier selection
  const handleSupplierSelect = (supplier: Supplier) => {
    onSupplierSelect(supplier);
    onSearchChange(supplier.name);
    setIsOpen(false);
    setSelectedIndex(-1);
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

  // Clear search
  const clearSearch = () => {
    onSearchChange('');
    setIsOpen(false);
    setSelectedIndex(-1);
    searchRef.current?.focus();
  };

  return (
    <div className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          ref={searchRef}
          placeholder="Search suppliers by name or industry..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(searchTerm.length > 0)}
          className="glass-input border-0 pl-12 pr-10 h-12 rounded-2xl text-base"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && filteredSuppliers.length > 0 && (
        <Card 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 py-2 z-50 shadow-lg border-0 bg-white/95 backdrop-blur-sm max-h-96 overflow-y-auto"
        >
          {filteredSuppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              onClick={() => handleSupplierSelect(supplier)}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex 
                  ? 'bg-blue-50 border-l-4 border-blue-500' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{supplier.name}</div>
                  <div className="text-sm text-gray-600">{supplier.industry}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={supplier.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {supplier.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
          
          {searchTerm && filteredSuppliers.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No suppliers found matching "{searchTerm}"</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
