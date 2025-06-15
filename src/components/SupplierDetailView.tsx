
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EditSupplierForm } from "./EditSupplierForm";
import { Supplier } from "@/types/supplier";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Edit, 
  Trash2,
  FileText,
  Download
} from "lucide-react";

interface SupplierDetailViewProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
}

export const SupplierDetailView = ({ supplier, onEdit, onDelete }: SupplierDetailViewProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (updatedSupplier: Supplier) => {
    onEdit(updatedSupplier);
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">{supplier.name}</h1>
          <p className="text-gray-600">{supplier.industry}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusColor(supplier.status)}>
            {supplier.status.toUpperCase()}
          </Badge>
          <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </SheetTrigger>
            <EditSupplierForm
              supplier={supplier}
              onSubmit={handleEdit}
              onCancel={() => setIsEditOpen(false)}
            />
          </Sheet>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(supplier.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {supplier.description && (
            <div>
              <p className="text-sm font-medium text-gray-700">Description</p>
              <p className="text-gray-600">{supplier.description}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Contact Person</p>
                <p className="text-gray-600">{supplier.contactPerson}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Established</p>
                <p className="text-gray-600">{supplier.establishedYear}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-600">{supplier.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="text-gray-600">{supplier.phone}</p>
              </div>
            </div>
          </div>
          {supplier.address && (
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Address</p>
                <p className="text-gray-600">{supplier.address}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certifications */}
      {supplier.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {supplier.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  <FileText className="w-3 h-3 mr-1" />
                  {cert}
                  <Download className="w-3 h-3 ml-1 cursor-pointer" />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Audit Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Created:</span>
            <span>{new Date(supplier.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Last Updated:</span>
            <span>{new Date(supplier.updatedAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
