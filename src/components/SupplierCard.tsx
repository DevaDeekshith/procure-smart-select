
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Supplier } from "@/types/supplier";
import { MoreVertical, Edit, Trash2, Building2, MapPin, Calendar, Star, Award, X, Plus, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
  onClick?: (supplier: Supplier) => void;
}

export const SupplierCard = ({ supplier, onEdit, onDelete, onClick }: SupplierCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: supplier.name,
    description: supplier.description,
    contactPerson: supplier.contactPerson,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    industry: supplier.industry,
    establishedYear: supplier.establishedYear,
    status: supplier.status
  });
  const [certifications, setCertifications] = useState<string[]>(supplier.certifications);
  const [newCertification, setNewCertification] = useState("");

  console.log('SupplierCard rendering, isEditDialogOpen:', isEditDialogOpen);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      setCertifications(prev => [...prev, newCertification.trim()]);
      setNewCertification("");
    }
  };

  const removeCertification = (cert: string) => {
    setCertifications(prev => prev.filter(c => c !== cert));
  };

  const handleSubmit = () => {
    const updatedSupplier: Supplier = {
      ...supplier,
      ...formData,
      certifications,
      updatedAt: new Date()
    };

    console.log('Supplier updated, closing sheet');
    onEdit(updatedSupplier);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Supplier Updated",
      description: `${formData.name} has been successfully updated.`,
    });
  };

  const handleCancel = () => {
    console.log('Edit cancelled, closing sheet');
    setFormData({
      name: supplier.name,
      description: supplier.description,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      industry: supplier.industry,
      establishedYear: supplier.establishedYear,
      status: supplier.status
    });
    setCertifications(supplier.certifications);
    setNewCertification("");
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <Card 
        className="frosted-glass border-0 hover-glow smooth-transition cursor-pointer group overflow-hidden"
        onClick={() => onClick?.(supplier)}
      >
        <CardHeader className="pb-3 relative">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 smooth-transition">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="glass-card w-8 h-8 p-0 hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('More menu clicked');
                  }}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card border-0" align="end">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Edit clicked, opening sheet');
                    setIsEditDialogOpen(true);
                  }}
                  className="hover:bg-white/20"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(supplier.id);
                  }}
                  className="text-red-600 hover:bg-red-50/50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="glass-card p-3 rounded-2xl">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-bold text-gray-900 truncate">
                {supplier.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs font-medium border ${getStatusBadgeColor(supplier.status)} rounded-full px-3 py-1`}>
                  {supplier.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{supplier.industry}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{supplier.address || 'Address not provided'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>Since {supplier.establishedYear || new Date(supplier.createdAt).getFullYear()}</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Contact</span>
              <span className="text-sm text-gray-600">{supplier.contactPerson}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <span className="text-sm text-gray-600 truncate">{supplier.email}</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200/50">
            Click to evaluate this supplier
          </div>
        </CardContent>
      </Card>

      <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <SheetContent className="w-[600px] sm:w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-blue-900">Edit Supplier</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Supplier Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter supplier name"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="pharmaceutical">Pharmaceutical</SelectItem>
                      <SelectItem value="textiles">Textiles</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the supplier"
                  rows={3}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="Contact person name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Email address"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Complete address"
                  rows={2}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value))}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Certifications</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add certification (e.g., ISO 9001)"
                    onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                  />
                  <Button type="button" onClick={addCertification} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {cert}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeCertification(cert)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Documents & Certifications</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Drag & drop files here, or <Button variant="link" className="p-0 h-auto">browse</Button>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported: PDF, JPG, PNG, DOC (Max 10MB per file)
                </p>
              </div>
            </div>
          </div>

          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Update Supplier
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
