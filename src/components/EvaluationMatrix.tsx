
import { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { DEFAULT_CRITERIA, SCORING_SCALE, Supplier } from "@/types/supplier";
import { supplierService } from "@/services/supplierService";
import { TrendingUp, TrendingDown, Minus, Search, SortAsc, SortDesc, Filter, Crown, Medal, Award, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  searchTerm: string;
  scoreRange: [number, number];
  selectedCriteria: string[];
  industryFilter: string;
  statusFilter: string;
  rankingTier: string;
}

export const EvaluationMatrix = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'overallScore', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCriteria, setVisibleCriteria] = useState<string[]>(DEFAULT_CRITERIA.map(c => c.id));
  const [filters, setFilters] = useState<FilterConfig>({
    searchTerm: '',
    scoreRange: [0, 100],
    selectedCriteria: DEFAULT_CRITERIA.map(c => c.id),
    industryFilter: 'all',
    statusFilter: 'active',
    rankingTier: 'all'
  });

  // Fetch suppliers from Supabase
  const { data: suppliers = [], isLoading, error } = useQuery({
    queryKey: ['suppliers'],
    queryFn: supplierService.getAllSuppliers,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading suppliers",
        description: "Failed to fetch supplier data from database",
        variant: "destructive"
      });
    }
  }, [error]);

  // Debug logging for scores
  useEffect(() => {
    if (suppliers.length > 0) {
      console.log('EvaluationMatrix: Suppliers loaded with scores:');
      suppliers.forEach(supplier => {
        console.log(`${supplier.name}:`, {
          overallScore: supplier.overallScore,
          scores: supplier.scores,
          rawScoreValues: Object.entries(supplier.scores || {}).map(([key, value]) => `${key}: ${value}`)
        });
      });
    }
  }, [suppliers]);

  const suppliersWithScores = useMemo(() => {
    if (!suppliers.length) return [];

    return suppliers
      .filter(supplier => supplier.status === filters.statusFilter || filters.statusFilter === 'all')
      .map(supplier => ({
        ...supplier,
        totalScore: supplier.overallScore || 0
      }))
      .filter(supplier => {
        const matchesSearch = supplier.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                             supplier.industry.toLowerCase().includes(filters.searchTerm.toLowerCase());
        const matchesScoreRange = supplier.totalScore >= filters.scoreRange[0] && supplier.totalScore <= filters.scoreRange[1];
        const matchesIndustry = filters.industryFilter === 'all' || supplier.industry === filters.industryFilter;
        
        return matchesSearch && matchesScoreRange && matchesIndustry;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'overallScore' || sortConfig.key === 'totalScore') {
          return sortConfig.direction === 'desc' ? b.totalScore - a.totalScore : a.totalScore - b.totalScore;
        }
        if (sortConfig.key === 'name') {
          return sortConfig.direction === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
        }
        if (sortConfig.key === 'industry') {
          return sortConfig.direction === 'desc' ? b.industry.localeCompare(a.industry) : a.industry.localeCompare(b.industry);
        }
        
        // Handle criteria-specific sorting using scores object
        const criteriaName = DEFAULT_CRITERIA.find(c => c.id === sortConfig.key)?.name;
        if (criteriaName) {
          const scoreA = a.scores?.[criteriaName] || 0;
          const scoreB = b.scores?.[criteriaName] || 0;
          return sortConfig.direction === 'desc' ? scoreB - scoreA : scoreA - scoreB;
        }
        
        return 0;
      })
      .filter(supplier => {
        if (filters.rankingTier === 'all') return true;
        const rank = suppliersWithScores.indexOf(supplier) + 1;
        if (filters.rankingTier === 'top3') return rank <= 3;
        if (filters.rankingTier === 'top10') return rank <= 10;
        if (filters.rankingTier === 'bottom') return rank > suppliersWithScores.length * 0.8;
        return true;
      });
  }, [suppliers, filters, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getRankBadge = (index: number, totalScore: number) => {
    const rank = index + 1;
    if (rank === 1) return <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold shadow-lg"><Crown className="w-3 h-3 mr-1" />1st</Badge>;
    if (rank === 2) return <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-white text-xs font-bold shadow-lg"><Medal className="w-3 h-3 mr-1" />2nd</Badge>;
    if (rank === 3) return <Badge className="bg-gradient-to-r from-orange-400 to-orange-600 text-white text-xs font-bold shadow-lg"><Award className="w-3 h-3 mr-1" />3rd</Badge>;
    if (rank <= 5) return <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs"><Star className="w-3 h-3 mr-1" />Top 5</Badge>;
    if (rank <= 10) return <Badge className="bg-blue-100 text-blue-800 text-xs">Top 10</Badge>;
    return <Badge variant="outline" className="text-xs">#{rank}</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-600";
    if (score >= 8) return "text-blue-600";
    if (score >= 7) return "text-yellow-600";
    if (score >= 6) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    const displayScore = score; // Score is already 0-100 scale
    const scaleEntry = Object.entries(SCORING_SCALE).find(([_, scale]) => 
      displayScore >= scale.min && displayScore <= scale.max
    );
    
    if (!scaleEntry) return null;
    
    const [key, scale] = scaleEntry;
    const colorMap = {
      EXCELLENT: "bg-green-100 text-green-800 border-green-200",
      GOOD: "bg-blue-100 text-blue-800 border-blue-200", 
      SATISFACTORY: "bg-yellow-100 text-yellow-800 border-yellow-200",
      NEEDS_IMPROVEMENT: "bg-orange-100 text-orange-800 border-orange-200",
      UNACCEPTABLE: "bg-red-100 text-red-800 border-red-200"
    };
    
    return (
      <Badge className={`${colorMap[key as keyof typeof colorMap] || "bg-gray-100 text-gray-800"} text-xs border`}>
        {scale.label}
      </Badge>
    );
  };

  const getPerformanceIcon = (score: number) => {
    if (score >= 85) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (score >= 70) return <Minus className="w-4 h-4 text-yellow-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'desc' ? 
        <SortDesc className="w-4 h-4 ml-1" /> : 
        <SortAsc className="w-4 h-4 ml-1" />;
    }
    return null;
  };

  const uniqueIndustries = Array.from(new Set(suppliers.map(s => s.industry)));

  if (isLoading) {
    return (
      <Card className="frosted-glass border-0">
        <CardContent className="p-6">
          <div className="text-center">Loading supplier data...</div>
        </CardContent>
      </Card>
    );
  }

  if (!suppliers.length) {
    return (
      <Card className="frosted-glass border-0">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No Suppliers Available</h3>
            <p className="text-gray-600">Add suppliers to see them in the evaluation matrix.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="frosted-glass border-0 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold gradient-text">Advanced Supplier Comparison Matrix</CardTitle>
            <p className="text-gray-600 mt-1">Comprehensive performance analysis with detailed criteria scoring</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="frosted-glass border-0 hover-glow"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              {suppliersWithScores.length} suppliers shown
            </Badge>
          </div>
        </div>

        {showFilters && (
          <div className="glass-card p-4 rounded-xl mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Search Suppliers</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name or industry..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="glass-input border-0 pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Industry Filter</label>
                <Select value={filters.industryFilter} onValueChange={(value) => setFilters(prev => ({ ...prev, industryFilter: value }))}>
                  <SelectTrigger className="glass-input border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-0">
                    <SelectItem value="all">All Industries</SelectItem>
                    {uniqueIndustries.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status Filter</label>
                <Select value={filters.statusFilter} onValueChange={(value) => setFilters(prev => ({ ...prev, statusFilter: value }))}>
                  <SelectTrigger className="glass-input border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-0">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Score Range: {filters.scoreRange[0]} - {filters.scoreRange[1]}
              </label>
              <Slider
                value={filters.scoreRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, scoreRange: value as [number, number] }))}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Visible Criteria</label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_CRITERIA.map(criteria => (
                  <div key={criteria.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={criteria.id}
                      checked={visibleCriteria.includes(criteria.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setVisibleCriteria(prev => [...prev, criteria.id]);
                        } else {
                          setVisibleCriteria(prev => prev.filter(id => id !== criteria.id));
                        }
                      }}
                    />
                    <label htmlFor={criteria.id} className="text-sm text-gray-600 cursor-pointer">
                      {criteria.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[2000px]">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200/50">
                  <TableHead className="w-16 text-center sticky left-0 bg-white/80 backdrop-blur-sm z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('rank')}
                      className="text-xs font-medium"
                    >
                      Rank {getSortIcon('rank')}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[200px] sticky left-16 bg-white/80 backdrop-blur-sm z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('name')}
                      className="text-sm font-medium"
                    >
                      Supplier {getSortIcon('name')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-center min-w-[140px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('overallScore')}
                      className="text-sm font-medium"
                    >
                      Overall Score {getSortIcon('overallScore')}
                    </Button>
                  </TableHead>
                  {DEFAULT_CRITERIA.filter(criteria => visibleCriteria.includes(criteria.id)).map(criteria => (
                    <TableHead key={criteria.id} className="text-center min-w-[120px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort(criteria.id)}
                        className="text-sm font-medium"
                      >
                        {criteria.name} ({criteria.weight}%) {getSortIcon(criteria.id)}
                      </Button>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliersWithScores.map((supplier, index) => (
                  <TableRow key={supplier.id} className="hover:bg-gray-50/50 border-gray-200/30">
                    <TableCell className="text-center sticky left-0 bg-white/80 backdrop-blur-sm">
                      {getRankBadge(index, supplier.totalScore)}
                    </TableCell>
                    <TableCell className="sticky left-16 bg-white/80 backdrop-blur-sm">
                      <div className="space-y-1 min-w-0">
                        <div className="font-semibold text-blue-900 flex items-center gap-2">
                          <span className="truncate">{supplier.name}</span>
                          {getPerformanceIcon(supplier.totalScore)}
                        </div>
                        <div className="text-sm text-gray-500 truncate">{supplier.industry}</div>
                        <div className="text-xs text-gray-400">Est. {supplier.establishedYear}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-2">
                        <div className={`text-xl font-bold ${getScoreColor(supplier.totalScore / 10)}`}>
                          {supplier.totalScore.toFixed(1)}
                        </div>
                        <Progress value={supplier.totalScore} className="w-20 mx-auto" />
                        {getScoreBadge(supplier.totalScore)}
                      </div>
                    </TableCell>
                    {DEFAULT_CRITERIA.filter(criteria => visibleCriteria.includes(criteria.id)).map(criteria => {
                      const scoreValue = supplier.scores?.[criteria.name] || 0;
                      console.log(`Rendering score for ${supplier.name} - ${criteria.name}: ${scoreValue}`);
                      return (
                        <TableCell key={criteria.id} className="text-center">
                          <div className="space-y-1">
                            <div className={`text-lg font-semibold ${getScoreColor(scoreValue / 10)}`}>
                              {scoreValue.toFixed(1)}
                            </div>
                            <Progress value={scoreValue} className="w-16 mx-auto" />
                            <div className="text-xs text-gray-500">
                              {scoreValue > 0 ? `${scoreValue.toFixed(0)}%` : 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {suppliersWithScores.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mx-6 mb-6">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Analytics Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="glass-card p-3 rounded-lg">
                <span className="font-medium text-gray-700">Top Performer:</span>
                <div className="mt-1 text-blue-700 font-semibold">
                  {suppliersWithScores[0]?.name} ({suppliersWithScores[0]?.totalScore.toFixed(1)})
                </div>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <span className="font-medium text-gray-700">Average Score:</span>
                <div className="mt-1 text-blue-700 font-semibold">
                  {(suppliersWithScores.reduce((sum, s) => sum + s.totalScore, 0) / suppliersWithScores.length).toFixed(1)}
                </div>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <span className="font-medium text-gray-700">Score Range:</span>
                <div className="mt-1 text-blue-700 font-semibold">
                  {Math.min(...suppliersWithScores.map(s => s.totalScore)).toFixed(1)} - {Math.max(...suppliersWithScores.map(s => s.totalScore)).toFixed(1)}
                </div>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <span className="font-medium text-gray-700">Last Updated:</span>
                <div className="mt-1 text-blue-700 font-semibold">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
