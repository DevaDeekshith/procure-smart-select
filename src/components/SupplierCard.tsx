
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { SupplierDetailView } from "./SupplierDetailView";
import { Supplier } from "@/types/supplier";
import { Building2, Mail, Phone, Calendar, Award, Eye, Edit, Trash2 } from "lucide-react";

interface SupplierCardProps {
  supplier: Supplier;
  onEdit?: (supplier: Supplier) => void;
  onDelete?: (supplierId: string) => void;
  onClick?: () => void;
}

export const SupplierCard = ({ supplier, onEdit, onDelete, onClick }: SupplierCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  const handleEdit = (updatedSupplier: Supplier) => {
    if (onEdit) {
      onEdit(updatedSupplier);
    }
    setIsDetailOpen(false);
  };

  const handleDelete = (supplierId: string) => {
    if (onDelete && confirm('Are you sure you want to delete this supplier?')) {
      onDelete(supplierId);
    }
    setIsDetailOpen(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-blue-900">{supplier.name}</CardTitle>
            <p className="text-sm text-gray-600">{supplier.industry}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(supplier.status)}>
              {supplier.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Building2 className="w-4 h-4 mr-2" />
          {supplier.contactPerson}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          {supplier.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          {supplier.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          Est. {supplier.establishedYear}
        </div>
        {supplier.certifications.length > 0 && (
          <div className="flex items-start text-sm text-gray-600">
            <Award className="w-4 h-4 mr-2 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {supplier.certifications.slice(0, 3).map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
              {supplier.certifications.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{supplier.certifications.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
            </SheetTrigger>
            <SupplierDetailView
              supplier={supplier}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Sheet>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete && confirm('Are you sure you want to delete this supplier?')) {
                onDelete(supplier.id);
              }
            }}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
