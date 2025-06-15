
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Supplier Evaluation Tool</h1>
          <p className="text-gray-600">Manage and evaluate your supplier relationships</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Suppliers</p>
                <p className="text-2xl font-bold text-blue-900">{suppliers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Suppliers</p>
                <p className="text-2xl font-bold text-green-600">{activeSuppliers}</p>
              </div>
              <Star className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingSuppliers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4">
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
            <SelectTrigger className="w-40">
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
        <div className="flex gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            onClick={() => setView("grid")}
          >
            Grid View
          </Button>
          <Button
            variant={view === "matrix" ? "default" : "outline"}
            onClick={() => setView("matrix")}
          >
            Matrix View
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSuppliers.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  onClick={() => console.log(`Selected supplier: ${supplier.name}`)}
                />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <CriteriaWeights />
          </div>
        </div>
      ) : (
        <EvaluationMatrix />
      )}
    </div>
  );
};
