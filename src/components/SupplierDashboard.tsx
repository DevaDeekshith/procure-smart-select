import { useState, useEffect } from 'react';
import { Building2, Users, CheckCircle, TrendingUp, Star, Grid, List, BarChart3, Settings, Trophy, Plus } from 'lucide-react';
import { SupplierCard } from '@/components/SupplierCard';
import { AddSupplierForm } from '@/components/AddSupplierForm';
import { GlobalSearch } from '@/components/GlobalSearch';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { EvaluationMatrix } from '@/components/EvaluationMatrix';
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics';
import { EvaluationAnalytics } from '@/components/EvaluationAnalytics';
import { CriteriaWeights } from '@/components/CriteriaWeights';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { Supplier } from '@/types/supplier';
import { ElevenLabsWidget } from './ElevenLabsWidget';

export const SupplierDashboard = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [activeTab, setActiveTab] = useState("suppliers");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddSupplierDialogOpen, setIsAddSupplierDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch suppliers from API or use dummy data
    const fetchSuppliers = async () => {
      // Replace with your actual data fetching logic
      const dummySuppliers: Supplier[] = [
        {
          id: '1',
          name: 'Acme Corp',
          description: 'Leading supplier of widgets',
          contactPerson: 'John Doe',
          email: 'john.doe@acme.com',
          phone: '123-456-7890',
          address: '123 Main St',
          industry: 'Manufacturing',
          establishedYear: 1990,
          certifications: ['ISO 9001', 'ISO 14001'],
          status: 'active',
          overallScore: 92,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Beta Industries',
          description: 'Innovative solutions for your business',
          contactPerson: 'Jane Smith',
          email: 'jane.smith@beta.com',
          phone: '987-654-3210',
          address: '456 Elm St',
          industry: 'Technology',
          establishedYear: 2005,
          certifications: ['SOC 2', 'ISO 27001'],
          status: 'active',
          overallScore: 88,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          name: 'Gamma Co',
          description: 'Your trusted partner for quality products',
          contactPerson: 'Mike Johnson',
          email: 'mike.johnson@gamma.com',
          phone: '555-123-4567',
          address: '789 Oak St',
          industry: 'Retail',
          establishedYear: 2010,
          certifications: ['BBB Accredited'],
          status: 'inactive',
          overallScore: 75,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '4',
          name: 'Delta Ltd',
          description: 'Providing reliable services since 1985',
          contactPerson: 'Alice Brown',
          email: 'alice.brown@delta.com',
          phone: '111-222-3333',
          address: '101 Pine St',
          industry: 'Services',
          establishedYear: 1985,
          certifications: ['N/A'],
          status: 'pending',
          overallScore: 68,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '5',
          name: 'Epsilon Group',
          description: 'Your go-to source for sustainable solutions',
          contactPerson: 'Bob Williams',
          email: 'bob.williams@epsilon.com',
          phone: '444-555-6666',
          address: '222 Cedar St',
          industry: 'Sustainability',
          establishedYear: 2015,
          certifications: ['Green Seal'],
          status: 'active',
          overallScore: 95,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setSuppliers(dummySuppliers);
    };

    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return supplier.name.toLowerCase().includes(searchLower) ||
           supplier.industry.toLowerCase().includes(searchLower);
  });

  const activeSuppliers = suppliers.filter((supplier) => supplier.status === 'active').length;
  const averageScore =
    suppliers.reduce((acc, supplier) => acc + (supplier.overallScore || 0), 0) / suppliers.length;
  const topPerformers = suppliers.filter((supplier) => (supplier.overallScore || 0) > 90).length;

  // Handler functions
  const handleSupplierSelect = (supplier: Supplier) => {
    console.log('Selected supplier:', supplier);
  };

  const handleCriteriaSelect = (criteria: any) => {
    console.log('Selected criteria:', criteria);
    setActiveTab('evaluation');
  };

  const handleAddSupplier = (newSupplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    const supplier: Supplier = {
      ...newSupplier,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSuppliers(prev => [...prev, supplier]);
    setIsAddSupplierDialogOpen(false);
  };

  const handleEditSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
  };

  const handleSearchChange = (searchValue: string) => {
    setSearchTerm(searchValue);
  };

  return (
    <div className="min-h-screen liquid-glass-bg">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Google-style Centered Header */}
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8">
          {/* Centered Logo and Title */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="liquid-glass p-6 rounded-3xl shadow-2xl hover-glow floating">
                <Building2 className="w-16 h-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-6xl font-bold gradient-text tracking-wide">CHANAKYA</h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">Strategic Supplier Evaluation & Management Portal</p>
          </div>
          
          {/* Centered Search and Actions */}
          <div className="w-full max-w-3xl space-y-4">
            <div className="liquid-glass p-6 rounded-3xl shadow-2xl hover-glow">
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <GlobalSearch 
                    suppliers={suppliers}
                    onSupplierSelect={handleSupplierSelect}
                    onCriteriaSelect={handleCriteriaSelect}
                    onViewChange={setActiveTab}
                  />
                </div>
                
                <Dialog open={isAddSupplierDialogOpen} onOpenChange={setIsAddSupplierDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="liquid-button text-white px-8 py-4 h-14 rounded-2xl hover-glow whitespace-nowrap">
                      <Plus className="w-5 h-5 mr-2" />
                      Add Supplier
                    </Button>
                  </DialogTrigger>
                  <DialogPortal>
                    <DialogOverlay />
                    <DialogContent className="liquid-glass border-0">
                      <AddSupplierForm 
                        onSubmit={handleAddSupplier}
                        onCancel={() => setIsAddSupplierDialogOpen(false)}
                      />
                    </DialogContent>
                  </DialogPortal>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="liquid-glass p-6 rounded-2xl shadow-lg hover-glow smooth-transition">
            <div className="flex items-center gap-4">
              <div className="liquid-glass p-3 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{suppliers.length}</h3>
                <p className="text-gray-600">Total Suppliers</p>
              </div>
            </div>
          </div>

          <div className="liquid-glass p-6 rounded-2xl shadow-lg hover-glow smooth-transition">
            <div className="flex items-center gap-4">
              <div className="liquid-glass p-3 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{activeSuppliers}</h3>
                <p className="text-gray-600">Active Suppliers</p>
              </div>
            </div>
          </div>

          <div className="liquid-glass p-6 rounded-2xl shadow-lg hover-glow smooth-transition">
            <div className="flex items-center gap-4">
              <div className="liquid-glass p-3 rounded-xl">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{Math.round(averageScore)}</h3>
                <p className="text-gray-600">Average Score</p>
              </div>
            </div>
          </div>

          <div className="liquid-glass p-6 rounded-2xl shadow-lg hover-glow smooth-transition">
            <div className="flex items-center gap-4">
              <div className="liquid-glass p-3 rounded-xl">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{topPerformers}</h3>
                <p className="text-gray-600">Top Performers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation and Filters */}
        <div className="liquid-glass p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
              <TabsList className="liquid-glass p-1 h-auto">
                <TabsTrigger value="suppliers" className="px-6 py-3 rounded-xl data-[state=active]:liquid-glass">
                  <Building2 className="w-4 h-4 mr-2" />
                  Suppliers
                </TabsTrigger>
                <TabsTrigger value="evaluation" className="px-6 py-3 rounded-xl data-[state=active]:liquid-glass">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Evaluation
                </TabsTrigger>
                <TabsTrigger value="analytics" className="px-6 py-3 rounded-xl data-[state=active]:liquid-glass">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="criteria" className="px-6 py-3 rounded-xl data-[state=active]:liquid-glass">
                  <Settings className="w-4 h-4 mr-2" />
                  Criteria
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              <AdvancedSearch 
                suppliers={suppliers}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                onSupplierSelect={handleSupplierSelect}
              />
              
              <div className="flex items-center gap-3">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="liquid-glass border-0"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="liquid-glass border-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="suppliers" className="space-y-6">
            {viewMode === 'grid' ? (
              <div className="responsive-supplier-grid">
                {filteredSuppliers.map((supplier) => (
                  <SupplierCard 
                    key={supplier.id} 
                    supplier={supplier}
                    onEdit={handleEditSupplier}
                    onDelete={handleDeleteSupplier}
                    onClick={handleSupplierSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSuppliers.map((supplier) => (
                  <SupplierCard 
                    key={supplier.id} 
                    supplier={supplier}
                    onEdit={handleEditSupplier}
                    onDelete={handleDeleteSupplier}
                    onClick={handleSupplierSelect}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-6">
            <EvaluationMatrix />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <AdvancedAnalytics suppliers={suppliers} />
              <div className="space-y-6">
                <EvaluationAnalytics suppliers={suppliers} />
                
                {/* Top Performing Suppliers */}
                <Card className="liquid-glass border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                      Top Performing Suppliers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {suppliers
                        .filter(s => s.overallScore && s.overallScore >= 85)
                        .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
                        .slice(0, 5)
                        .map((supplier, index) => (
                          <div key={supplier.id} className="flex items-center justify-between p-4 liquid-glass rounded-xl">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                                <p className="text-sm text-gray-600">{supplier.industry}</p>
                              </div>
                            </div>
                            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                              {supplier.overallScore}%
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="criteria" className="space-y-6">
            <CriteriaWeights />
          </TabsContent>
        </Tabs>
      </div>

      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};
