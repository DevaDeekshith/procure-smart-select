
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { SupplierCard } from "./SupplierCard";
import { EvaluationMatrix } from "./EvaluationMatrix";
import { CriteriaWeights } from "./CriteriaWeights";
import { AddSupplierForm } from "./AddSupplierForm";
import { mockSuppliers } from "@/data/mockData";
import { Supplier } from "@/types/supplier";
import { Search, Plus, Filter, Users, Star, TrendingUp } from "lucide-react";

export const SupplierDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"grid" | "matrix">("grid");
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Supplier Evaluation Tool</h1>
          <p className="text-gray-600 mt-1">Manage and evaluate your supplier relationships</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
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
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Suppliers</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">{suppliers.length}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
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
        <Card className="sm:col-span-2 lg:col-span-1">
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
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
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
            className="flex-1 sm:flex-none"
          >
            Grid View
          </Button>
          <Button
            variant={view === "matrix" ? "default" : "outline"}
            onClick={() => setView("matrix")}
            className="flex-1 sm:flex-none"
          >
            Matrix View
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
                    onClick={() => console.log(`Selected supplier: ${supplier.name}`)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
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
      ) : (
        <div className="w-full overflow-x-auto">
          <EvaluationMatrix />
        </div>
      )}
    </div>
  );
};
