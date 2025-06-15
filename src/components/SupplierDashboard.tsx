
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
import { Search, Plus, Filter, Users, Star, TrendingUp, Calculator, BarChart3, Crown } from "lucide-react";

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
      <div className="min-h-screen bg-gray-50">
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
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header with Chanakya Branding */}
      <div className="text-center mb-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-amber-600" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-800 tracking-wide">
                CHANAKYA
              </h1>
              <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 rounded-full mt-2"></div>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto text-center px-4">
            Strategic Supplier Evaluation & Management Portal
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
              <Plus className="w-5 h-5 mr-2" />
              Add New Supplier
            </Button>
          </DialogTrigger>
          <AddSupplierForm
            onSubmit={handleAddSupplier}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-amber-200 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Suppliers</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-800">{suppliers.length}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Suppliers</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{activeSuppliers}</p>
              </div>
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1 border-yellow-200 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{pendingSuppliers}</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 border-amber-200 focus:border-amber-400 focus:ring-amber-400">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            onClick={() => setView("grid")}
            className={`flex-1 sm:flex-none ${view === "grid" ? "bg-amber-600 hover:bg-amber-700" : "border-amber-300 hover:bg-amber-50"}`}
          >
            Grid View
          </Button>
          <Button
            variant={view === "matrix" ? "default" : "outline"}
            onClick={() => setView("matrix")}
            className={`flex-1 sm:flex-none ${view === "matrix" ? "bg-amber-600 hover:bg-amber-700" : "border-amber-300 hover:bg-amber-50"}`}
          >
            Matrix View
          </Button>
          <Button
            variant={view === "analytics" ? "default" : "outline"}
            onClick={() => setView("analytics")}
            className={`flex-1 sm:flex-none ${view === "analytics" ? "bg-amber-600 hover:bg-amber-700" : "border-amber-300 hover:bg-amber-50"}`}
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            {filteredSuppliers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
              <Card className="p-8 text-center border-amber-200">
                <p className="text-gray-500">No suppliers found matching your criteria.</p>
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
        <div className="w-full overflow-x-auto">
          <EvaluationMatrix />
        </div>
      ) : view === "analytics" ? (
        <EvaluationAnalytics />
      ) : null}
    </div>
  );
};
