
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { SupplierDetailView } from "./SupplierDetailView";
import { Supplier } from "@/types/supplier";
import { Building2, Mail, Phone, Calendar, Award, Eye, Trash2 } from "lucide-react";

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
    <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group border border-gray-200" onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-blue-900 truncate">{supplier.name}</CardTitle>
            <p className="text-sm text-gray-600 truncate">{supplier.industry}</p>
          </div>
          <div className="flex-shrink-0">
            <Badge className={getStatusColor(supplier.status)}>
              {supplier.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{supplier.contactPerson}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{supplier.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{supplier.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Est. {supplier.establishedYear}</span>
          </div>
        </div>
        
        {supplier.certifications.length > 0 && (
          <div className="flex items-start text-sm text-gray-600">
            <Award className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-1 min-w-0">
              {supplier.certifications.slice(0, 2).map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs truncate max-w-[120px]">
                  {cert}
                </Badge>
              ))}
              {supplier.certifications.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{supplier.certifications.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <Eye className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">View</span>
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
            className="text-red-600 hover:text-red-700 px-2"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
