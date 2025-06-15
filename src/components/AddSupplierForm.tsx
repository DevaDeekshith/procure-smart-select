
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Supplier } from "@/types/supplier";
import { toast } from "@/components/ui/use-toast";

interface AddSupplierFormProps {
  onSubmit: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const AddSupplierForm = ({ onSubmit, onCancel }: AddSupplierFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    industry: "",
    establishedYear: new Date().getFullYear(),
    status: "pending" as const
  });
  
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCertification, setNewCertification] = useState("");
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [showCredentials, setShowCredentials] = useState(false);

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

  const validateForm = () => {
    const requiredFields = ['name', 'contactPerson', 'email', 'phone', 'industry'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const validateCredentials = () => {
    // Simple credential check - in a real app, this would be more secure
    const validUsername = "admin";
    const validPassword = "supplier123";
    
    return adminCredentials.username === validUsername && adminCredentials.password === validPassword;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    if (!validateCredentials()) {
      toast({
        title: "Authentication Failed",
        description: "Invalid admin credentials. Please check your username and password.",
        variant: "destructive"
      });
      return;
    }

    const supplierData = {
      ...formData,
      certifications
    };

    onSubmit(supplierData);
    
    toast({
      title: "Supplier Added Successfully",
      description: `${formData.name} has been added to the platform for review.`,
    });
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-blue-900">Add New Supplier</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
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

        {/* Admin Credentials */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Admin Verification</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCredentials(!showCredentials)}
            >
              {showCredentials ? 'Hide' : 'Show'} Credentials
            </Button>
          </div>
          
          {showCredentials && (
            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <p className="text-sm text-yellow-800">
                Enter admin credentials to authorize adding this supplier:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={adminCredentials.username}
                    onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="admin"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Demo credentials: Username: <code>admin</code>, Password: <code>supplier123</code>
              </p>
            </div>
          )}
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
          Add Supplier
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
