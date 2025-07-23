
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supplierService, SupplierInsert } from '@/services/supplierService';
import { Supplier } from '@/types/supplier';

interface CSVUploadComponentProps {
  onUploadComplete: (suppliers: Supplier[]) => void;
  onCancel?: () => void;
  variant?: 'dialog' | 'standalone';
}

interface ParsedSupplier {
  data: SupplierInsert;
  errors: string[];
  rowIndex: number;
}

export const CSVUploadComponent = ({ onUploadComplete, onCancel, variant = 'dialog' }: CSVUploadComponentProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedSupplier[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const csvTemplate = `name,contact_person,email,phone,industry,status,description,address,website,established_year,product_specifications_adherence,defect_rate_quality_control,quality_certification_score,unit_pricing_competitiveness,payment_terms_flexibility,total_cost_ownership,ontime_delivery_performance,lead_time_competitiveness,emergency_response_capability,communication_effectiveness,contract_compliance_history,business_stability_longevity,environmental_certifications,social_responsibility_programs,sustainable_sourcing_practices
ABC Manufacturing,John Smith,john@abc.com,555-1234,Manufacturing,active,High-quality components,123 Main St,abc.com,2010,85,78,90,82,75,80,88,85,77,89,92,87,76,81,79
XYZ Electronics,Jane Doe,jane@xyz.com,555-5678,Electronics,pending,Electronic components supplier,456 Oak Ave,xyz.com,2015,75,82,85,78,80,75,90,88,82,85,88,90,72,78,81`;

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'supplier_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded to your device",
    });
  };

  const parseCSV = (csvText: string): ParsedSupplier[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const results: ParsedSupplier[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const errors: string[] = [];
      
      // Auto-detect and map columns
      const supplierData: Partial<SupplierInsert> = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        const lowerHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Map columns automatically
        if (lowerHeader.includes('name') && !lowerHeader.includes('contact')) {
          supplierData.name = value;
        } else if (lowerHeader.includes('contactperson') || lowerHeader.includes('contact_person')) {
          supplierData.contact_person = value;
        } else if (lowerHeader.includes('email')) {
          supplierData.email = value;
        } else if (lowerHeader.includes('phone')) {
          supplierData.phone = value;
        } else if (lowerHeader.includes('industry')) {
          supplierData.industry = value;
        } else if (lowerHeader.includes('status')) {
          supplierData.status = value as 'active' | 'inactive' | 'pending' | 'rejected';
        } else if (lowerHeader.includes('description')) {
          supplierData.description = value;
        } else if (lowerHeader.includes('address')) {
          supplierData.address = value;
        } else if (lowerHeader.includes('website')) {
          supplierData.website = value;
        } else if (lowerHeader.includes('establishedyear') || lowerHeader.includes('established_year')) {
          // Skip established_year as it's not in the database
        } else {
          // Map scoring fields
          const scoreField = header.toLowerCase().replace(/[^a-z]/g, '_');
          const numValue = value ? parseFloat(value) : 0;
          if (!isNaN(numValue)) {
            (supplierData as any)[scoreField] = numValue;
          }
        }
      });

      // Validate required fields
      if (!supplierData.name) errors.push('Name is required');
      if (!supplierData.contact_person) errors.push('Contact person is required');
      if (!supplierData.email) errors.push('Email is required');
      if (!supplierData.phone) errors.push('Phone is required');
      if (!supplierData.industry) errors.push('Industry is required');

      // Validate email format
      if (supplierData.email && !/\S+@\S+\.\S+/.test(supplierData.email)) {
        errors.push('Invalid email format');
      }

      // Set defaults
      if (!supplierData.status) supplierData.status = 'pending';

      results.push({
        data: supplierData as SupplierInsert,
        errors,
        rowIndex: i
      });
    }

    return results;
  };

  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile) return;

    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV or Excel file",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    
    try {
      const text = await selectedFile.text();
      const parsed = parseCSV(text);
      setParsedData(parsed);
      setShowPreview(true);
    } catch (error) {
      console.error('Error parsing file:', error);
      toast({
        title: "Parse Error",
        description: "Failed to parse the CSV file",
        variant: "destructive"
      });
    }
  };

  const handleUpload = async () => {
    if (!parsedData.length) return;

    const validSuppliers = parsedData.filter(item => item.errors.length === 0);
    
    if (validSuppliers.length === 0) {
      toast({
        title: "No Valid Data",
        description: "Please fix all errors before uploading",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const suppliersToInsert = validSuppliers.map(item => item.data);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const newSuppliers = await supplierService.bulkCreateSuppliers(suppliersToInsert);
      
      clearInterval(progressInterval);
      setProgress(100);

      toast({
        title: "Upload Successful",
        description: `${newSuppliers.length} suppliers imported successfully`,
      });

      onUploadComplete(newSuppliers);
      
      // Reset state
      setFile(null);
      setParsedData([]);
      setShowPreview(false);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to import suppliers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const validCount = parsedData.filter(item => item.errors.length === 0).length;
  const errorCount = parsedData.filter(item => item.errors.length > 0).length;

  return (
    <div className="space-y-6">
      <Card className="liquid-glass border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            CSV Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showPreview ? (
            <>
              <div className="flex items-center justify-between">
                <Label>Upload CSV File</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                  className="liquid-glass border-0"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>
              
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="liquid-glass border-0"
              />
              
              <div className="text-sm text-gray-600">
                <p>Supported formats: CSV, Excel (.xlsx, .xls)</p>
                <p>The system will auto-detect columns or you can use our template.</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">{file?.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowPreview(false);
                    setParsedData([]);
                    setFile(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-4">
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {validCount} Valid
                </Badge>
                {errorCount > 0 && (
                  <Badge className="bg-red-100 text-red-800">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errorCount} Errors
                  </Badge>
                )}
              </div>

              {errorCount > 0 && (
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {parsedData.filter(item => item.errors.length > 0).slice(0, 5).map((item, index) => (
                    <div key={index} className="text-sm p-2 bg-red-50 rounded border-l-2 border-red-300">
                      <p className="font-medium">Row {item.rowIndex}: {item.data.name || 'Unnamed'}</p>
                      <ul className="text-red-600 ml-2">
                        {item.errors.map((error, i) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {parsedData.filter(item => item.errors.length > 0).length > 5 && (
                    <p className="text-sm text-gray-500">...and {parsedData.filter(item => item.errors.length > 0).length - 5} more errors</p>
                  )}
                </div>
              )}

              {uploading && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center text-gray-600">Uploading suppliers...</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {showPreview && (
        <div className="flex gap-3">
          <Button
            onClick={handleUpload}
            disabled={uploading || validCount === 0}
            className="liquid-button text-white flex-1"
          >
            {uploading ? 'Uploading...' : `Import ${validCount} Suppliers`}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="liquid-glass border-0">
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
