
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, Info, User, Building2, Mail, Phone, MapPin, Calendar, Award, BarChart3 } from "lucide-react";
import { Supplier } from "@/types/supplier";
import { EvaluationScoring } from "./EvaluationScoring";
import { toast } from "@/hooks/use-toast";
import { supplierService, SupplierInsert } from "@/services/supplierService";

interface AddSupplierFormProps {
  onSubmit: (supplier: Supplier) => void;
  onCancel: () => void;
}

export const AddSupplierForm = ({ onSubmit, onCancel }: AddSupplierFormProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    industry: "",
    establishedYear: new Date().getFullYear(),
    status: "pending" as const,
    website: ""
  });
  
  const [evaluationScores, setEvaluationScores] = useState<Record<string, number>>({
    product_specifications_adherence: 0,
    defect_rate_quality_control: 0,
    quality_certifications_score: 0,
    unit_pricing_competitiveness: 0,
    payment_terms_flexibility: 0,
    total_cost_ownership: 0,
    ontime_delivery_performance: 0,
    lead_time_competitiveness: 0,
    emergency_response_capability: 0,
    communication_effectiveness: 0,
    contract_compliance_history: 0,
    business_stability_longevity: 0,
    environmental_certifications: 0,
    social_responsibility_programs: 0,
    sustainable_sourcing_practices: 0,
  });
  
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCertification, setNewCertification] = useState("");
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [showCredentials, setShowCredentials] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScoreChange = (criteria: string, score: number) => {
    setEvaluationScores(prev => ({ ...prev, [criteria]: score }));
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
    const validUsername = "admin";
    const validPassword = "supplier123";
    
    return adminCredentials.username === validUsername && adminCredentials.password === validPassword;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (!validateCredentials()) {
      toast({
        title: "Authentication Failed",
        description: "Invalid admin credentials. Please check your username and password.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const supplierData: SupplierInsert = {
        name: formData.name,
        description: formData.description,
        contact_person: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        industry: formData.industry,
        established_year: formData.establishedYear,
        status: formData.status,
        website: formData.website,
        certifications,
        ...evaluationScores
      };

      const newSupplier = await supplierService.createSupplier(supplierData);
      onSubmit(newSupplier);
      
      toast({
        title: "Supplier Added Successfully",
        description: `${formData.name} has been added to the platform with evaluation scores.`,
      });
    } catch (error) {
      console.error('Error creating supplier:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="max-w-5xl max-h-[90vh] overflow-y-auto glass-card border-0 shadow-2xl">
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto glass-card p-4 rounded-2xl mb-4 w-fit">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <DialogTitle className="text-2xl font-bold gradient-text">Add New Supplier</DialogTitle>
          <p className="text-gray-600 mt-2">Complete supplier information and evaluation scores</p>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="liquid-glass p-1 h-auto grid grid-cols-3 mb-6">
            <TabsTrigger value="basic" className="px-6 py-3 rounded-xl data-[state=active]:liquid-glass flex items-center gap-2">
              <User className="w-4 h-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="evaluation" className="px-6 py-3 rounded-xl data-[state=active]:liquid-glass flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Evaluation
            </TabsTrigger>
            <TabsTrigger value="verification" className="px-6 py-3 rounded-xl data-[state=active]:liquid-glass flex items-center gap-2">
              <Award className="w-4 h-4" />
              Verification
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-8">
            {/* Basic Information */}
            <div className="frosted-glass p-6 rounded-2xl space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="glass-card p-2 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Supplier Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter supplier company name"
                    className="glass-input border-0 h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Industry *
                  </Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger className="glass-input border-0 h-12 rounded-xl">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-0">
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
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Company Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the supplier's business and capabilities"
                  rows={3}
                  className="glass-input border-0 rounded-xl resize-none"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson" className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Contact Person *
                  </Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="Primary contact person name"
                    className="glass-input border-0 h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Contact phone number"
                    className="glass-input border-0 h-12 rounded-xl"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Primary email address"
                    className="glass-input border-0 h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="Company website URL"
                    className="glass-input border-0 h-12 rounded-xl"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Business Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Complete business address"
                  rows={2}
                  className="glass-input border-0 rounded-xl resize-none"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="establishedYear" className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Established Year
                  </Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value))}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="glass-input border-0 h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Quality Certifications
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="Add certification (e.g., ISO 9001)"
                      onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                      className="glass-input border-0 h-12 rounded-xl flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={addCertification} 
                      className="liquid-button text-white h-12 px-6 rounded-xl"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {certifications.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-4 frosted-glass rounded-xl">
                      {certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="glass-card border-0 px-3 py-1 flex items-center gap-2">
                          <Award className="w-3 h-3" />
                          {cert}
                          <X className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors" onClick={() => removeCertification(cert)} />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-6">
            <div className="frosted-glass p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="glass-card p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Evaluation Criteria</h3>
                  <p className="text-sm text-gray-600">Rate the supplier on each evaluation criteria (0-10 scale)</p>
                </div>
              </div>
              
              <EvaluationScoring 
                scores={evaluationScores}
                onScoreChange={handleScoreChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <div className="frosted-glass p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="glass-card p-2 rounded-lg">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Admin Verification</h3>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="glass-card border-0">
                      <p>Admin credentials required to authorize new supplier addition</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="glass-card border-0 hover-glow"
                >
                  {showCredentials ? 'Hide' : 'Show'} Credentials
                </Button>
              </div>
              
              {showCredentials && (
                <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm p-6 rounded-2xl space-y-4 border border-amber-200/30">
                  <p className="text-sm text-amber-800 font-medium">
                    Enter admin credentials to authorize adding this supplier:
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                      <Input
                        id="username"
                        value={adminCredentials.username}
                        onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="admin"
                        className="glass-input border-0 h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={adminCredentials.password}
                        onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password"
                        className="glass-input border-0 h-12 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="glass-card p-3 rounded-xl">
                    <p className="text-xs text-gray-600">
                      <strong>Demo credentials:</strong> Username: <code className="bg-gray-100 px-1 rounded">admin</code>, Password: <code className="bg-gray-100 px-1 rounded">supplier123</code>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-3 mt-8">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="glass-card border-0 hover-glow px-8 py-3 h-12 rounded-xl"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="liquid-button text-white px-8 py-3 h-12 rounded-xl hover-glow"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Supplier..." : "Add Supplier"}
          </Button>
        </DialogFooter>
      </div>
    </TooltipProvider>
  );
};
