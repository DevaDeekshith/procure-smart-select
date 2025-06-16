
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditSupplierForm } from "./EditSupplierForm";
import { Supplier } from "@/types/supplier";
import { MoreVertical, Edit, Trash2, Building2, MapPin, Calendar, Star, Award } from "lucide-react";

interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
  onClick?: (supplier: Supplier) => void;
}

export const SupplierCard = ({ supplier, onEdit, onDelete, onClick }: SupplierCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card border-0" align="end">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
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

      {isEditDialogOpen && (
        <EditSupplierForm
          supplier={supplier}
          onSubmit={(updatedSupplier) => {
            onEdit(updatedSupplier);
            setIsEditDialogOpen(false);
          }}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      )}
    </>
  );
};
