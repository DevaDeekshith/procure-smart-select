import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { SupplierCard } from "./SupplierCard";
import { EvaluationMatrix } from "./EvaluationMatrix";
import { EvaluationAnalytics } from "./EvaluationAnalytics";
import { SupplierScoring } from "./SupplierScoring";
import { CriteriaWeights } from "./CriteriaWeights";
import { AddSupplierForm } from "./AddSupplierForm";
import { mockSuppliers } from "@/data/mockData";
import { Supplier, SupplierScore } from "@/types/supplier";
import { Search, Plus, Filter, Users, Star, TrendingUp, Calculator, BarChart3, Crown, Sparkles } from "lucide-react";

export const SupplierDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"grid" | "matrix" | "analytics" | "scoring">("grid");
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSupplierForScoring, setSelectedSupplierForScoring] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const pendingSuppliers = suppliers.filter(s => s.status === 'pending').length;

  const handleAddSupplier = (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: `SUP${String(suppliers.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSuppliers(prev => [...prev, newSupplier]);
    setIsAddDialogOpen(false);
  };

  const handleEditSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(prev => 
      prev.map(supplier => 
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier
      )
    );
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierId));
  };

  const handleScoreSubmit = (scores: SupplierScore[]) => {
    console.log('Scores submitted:', scores);
    setSelectedSupplierForScoring(null);
    setView("matrix");
  };

  const handleSupplierClick = (supplier: Supplier) => {
    if (view === "grid") {
      setSelectedSupplierForScoring(supplier);
      setView("scoring");
    }
  };

  if (selectedSupplierForScoring && view === "scoring") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <SupplierScoring
          supplier={selectedSupplierForScoring}
          onScoreSubmit={handleScoreSubmit}
          onCancel={() => {
            setSelectedSupplierForScoring(null);
            setView("grid");
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="space-y-8 p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Hero Header with Liquid Glass Effect */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl floating"></div>
          </div>
          <div className="relative z-10 glass-card p-8 mx-auto max-w-4xl">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="flex items-center justify-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-lg opacity-75"></div>
                  <div className="relative glass-card p-4">
                    <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-amber-600" />
                  </div>
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-pulse" />
                </div>
                <div className="text-center">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text tracking-wide">
                    CHANAKYA
                  </h1>
                  <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 rounded-full mt-3 mx-auto w-48"></div>
                </div>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto text-center px-4 font-medium">
                Strategic Supplier Evaluation & Management Portal
              </p>
            </div>
          </div>
        </div>

        {/* Action Button with Liquid Glass */}
        <div className="flex justify-center mb-8">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="liquid-button text-white px-8 py-4 text-lg rounded-2xl shadow-xl hover-glow">
                <Plus className="w-6 h-6 mr-3" />
                Add New Supplier
              </Button>
            </DialogTrigger>
            <AddSupplierForm
              onSubmit={handleAddSupplier}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </Dialog>
        </div>

        {/* Stats Cards with Frosted Glass */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="frosted-glass border-0 hover-glow smooth-transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Suppliers</p>
                  <p className="text-3xl font-bold gradient-text">{suppliers.length}</p>
                </div>
                <div className="glass-card p-3 rounded-2xl">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="frosted-glass border-0 hover-glow smooth-transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active Suppliers</p>
                  <p className="text-3xl font-bold text-green-600">{activeSuppliers}</p>
                </div>
                <div className="glass-card p-3 rounded-2xl">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2 lg:col-span-1 frosted-glass border-0 hover-glow smooth-transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Pending Review</p>
                  <p className="text-3xl font-bold text-orange-600">{pendingSuppliers}</p>
                </div>
                <div className="glass-card p-3 rounded-2xl">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls with Glass Design */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input border-0 pl-12 h-12 rounded-2xl text-base"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="glass-input border-0 w-full sm:w-48 h-12 rounded-2xl">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="glass-card border-0">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant={view === "grid" ? "default" : "outline"}
                onClick={() => setView("grid")}
                className={`flex-1 sm:flex-none h-12 rounded-2xl smooth-transition ${
                  view === "grid" ? "liquid-button text-white" : "frosted-glass border-0 hover-glow"
                }`}
              >
                Grid View
              </Button>
              <Button
                variant={view === "matrix" ? "default" : "outline"}
                onClick={() => setView("matrix")}
                className={`flex-1 sm:flex-none h-12 rounded-2xl smooth-transition ${
                  view === "matrix" ? "liquid-button text-white" : "frosted-glass border-0 hover-glow"
                }`}
              >
                Matrix View
              </Button>
              <Button
                variant={view === "analytics" ? "default" : "outline"}
                onClick={() => setView("analytics")}
                className={`flex-1 sm:flex-none h-12 rounded-2xl smooth-transition ${
                  view === "analytics" ? "liquid-button text-white" : "frosted-glass border-0 hover-glow"
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3">
              {filteredSuppliers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredSuppliers.map((supplier) => (
                    <SupplierCard
                      key={supplier.id}
                      supplier={supplier}
                      onEdit={handleEditSupplier}
                      onDelete={handleDeleteSupplier}
                      onClick={() => handleSupplierClick(supplier)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="frosted-glass border-0 p-12 text-center">
                  <p className="text-gray-500 text-lg">No suppliers found matching your criteria.</p>
                </Card>
              )}
            </div>
            <div className="xl:col-span-1">
              <div className="sticky top-6">
                <CriteriaWeights />
              </div>
            </div>
          </div>
        ) : view === "matrix" ? (
          <div className="w-full overflow-hidden rounded-2xl">
            <EvaluationMatrix />
          </div>
        ) : view === "analytics" ? (
          <EvaluationAnalytics />
        ) : null}
      </div>
    </div>
  );
};
