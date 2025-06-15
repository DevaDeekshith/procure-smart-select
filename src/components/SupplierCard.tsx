
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";
import { Building2, Mail, Phone, Calendar, Award } from "lucide-react";

interface SupplierCardProps {
  supplier: Supplier;
  onClick?: () => void;
}

export const SupplierCard = ({ supplier, onClick }: SupplierCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-blue-900">{supplier.name}</CardTitle>
          <Badge className={getStatusColor(supplier.status)}>
            {supplier.status.toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{supplier.industry}</p>
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
              {supplier.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
