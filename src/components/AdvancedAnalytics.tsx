
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, FileText, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Supplier } from "@/types/supplier";
import { useQuery } from "@tanstack/react-query";
import { supplierService } from "@/services/supplierService";

const SCORING_SCALE = {
  EXCELLENT: { label: 'Excellent', minScore: 90 },
  GOOD: { label: 'Good', minScore: 75 },
  SATISFACTORY: { label: 'Satisfactory', minScore: 60 },
  NEEDS_IMPROVEMENT: { label: 'Needs Improvement', minScore: 40 },
  POOR: { label: 'Poor', minScore: 0 },
};

export const AdvancedAnalytics = () => {
  // Fetch suppliers from Supabase
  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: supplierService.getAllSuppliers,
  });

  // Performance distribution data
  const performanceDistribution = useMemo(() => {
    if (!suppliers.length) return [];
    
    return Object.entries(SCORING_SCALE).map(([key, scale]) => {
      const count = suppliers.filter((supplier) => {
        const score = supplier.overallScore || 0;
        if (key === 'EXCELLENT') return score >= 90;
        if (key === 'GOOD') return score >= 75 && score < 90;
        if (key === 'SATISFACTORY') return score >= 60 && score < 75;
        if (key === 'NEEDS_IMPROVEMENT') return score >= 40 && score < 60;
        if (key === 'POOR') return score < 40;
        return false;
      }).length;
      
      return {
        name: scale.label,
        count: count,
        percentage: suppliers.length > 0 ? (count / suppliers.length * 100) : 0,
        fill: key === 'EXCELLENT' ? '#10B981' : 
              key === 'GOOD' ? '#3B82F6' : 
              key === 'SATISFACTORY' ? '#F59E0B' : 
              key === 'NEEDS_IMPROVEMENT' ? '#EF4444' : '#8B5CF6'
      };
    }).filter(item => item.count > 0);
  }, [suppliers]);

  // Risk distribution data
  const riskDistribution = useMemo(() => {
    if (!suppliers.length) {
      return [
        { name: "High Risk", value: 0, percentage: 0, fill: '#EF4444' },
        { name: "Medium Risk", value: 0, percentage: 0, fill: '#F59E0B' },
        { name: "Low Risk", value: 0, percentage: 0, fill: '#10B981' },
      ];
    }

    const highRisk = suppliers.filter(s => (s.overallScore || 0) < 50).length;
    const mediumRisk = suppliers.filter(s => {
      const score = s.overallScore || 0;
      return score >= 50 && score < 75;
    }).length;
    const lowRisk = suppliers.filter(s => (s.overallScore || 0) >= 75).length;

    return [
      { name: "High Risk", value: highRisk, percentage: (highRisk / suppliers.length) * 100, fill: '#EF4444' },
      { name: "Medium Risk", value: mediumRisk, percentage: (mediumRisk / suppliers.length) * 100, fill: '#F59E0B' },
      { name: "Low Risk", value: lowRisk, percentage: (lowRisk / suppliers.length) * 100, fill: '#10B981' },
    ];
  }, [suppliers]);

  // Compliance status data
  const complianceData = useMemo(() => {
    if (!suppliers.length) {
      return [
        { name: "Compliant", value: 0, percentage: 0, fill: '#3B82F6' },
        { name: "Non-Compliant", value: 0, percentage: 0, fill: '#9CA3AF' },
      ];
    }

    const compliant = suppliers.filter(s => (s.overallScore || 0) > 60).length;
    const nonCompliant = suppliers.length - compliant;

    return [
      { name: "Compliant", value: compliant, percentage: (compliant / suppliers.length) * 100, fill: '#3B82F6' },
      { name: "Non-Compliant", value: nonCompliant, percentage: (nonCompliant / suppliers.length) * 100, fill: '#9CA3AF' },
    ];
  }, [suppliers]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
        className="drop-shadow-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="frosted-glass border-0 p-12 text-center">
          <div className="text-lg">Loading analytics data...</div>
        </Card>
      </div>
    );
  }

  if (!suppliers.length) {
    return (
      <div className="space-y-6">
        <Card className="frosted-glass border-0 p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No Suppliers Available</h2>
          <p className="text-gray-500 text-lg">Add suppliers to view analytics and performance metrics.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <Card className="glass-card border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            <FileText className="w-6 h-6 text-purple-500" />
            Advanced Analytics
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Tabs for different analytics views */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="bg-transparent p-0 border-0 flex justify-center">
          <TabsTrigger value="performance" className="data-[state=active]:bg-secondary data-[state=active]:text-foreground liquid-button text-white">
            Performance Trends
          </TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-secondary data-[state=active]:text-foreground liquid-button text-white">
            Risk Assessment
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-secondary data-[state=active]:text-foreground liquid-button text-white">
            Compliance Overview
          </TabsTrigger>
        </TabsList>

        {/* Performance Trends */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Performance Distribution */}
            <Card className="frosted-glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="glass-card p-2 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  Performance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {performanceDistribution.length > 0 ? (
                  <>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={performanceDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={100}
                            innerRadius={40}
                            fill="#8884d8"
                            dataKey="count"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth={2}
                          >
                            {performanceDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                              backdropFilter: 'blur(20px)'
                            }}
                            formatter={(value, name) => [
                              `${value} suppliers (${((value as number) / suppliers.length * 100).toFixed(1)}%)`,
                              'Count'
                            ]}
                          />
                          <Legend 
                            verticalAlign="bottom" 
                            height={36}
                            formatter={(value, entry) => (
                              <span style={{ color: entry.color, fontWeight: 'bold' }}>
                                {value}
                              </span>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {performanceDistribution.map((item, index) => (
                        <div key={index} className="glass-card p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {item.count} suppliers ({item.percentage.toFixed(1)}%)
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-gray-500">No performance data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Performing Suppliers */}
            <Card className="frosted-glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="glass-card p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  Top Performing Suppliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {suppliers
                    .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
                    .slice(0, 5)
                    .map((supplier) => (
                      <li key={supplier.id} className="glass-card p-3 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{supplier.name}</p>
                          <p className="text-sm text-gray-600">{supplier.industry}</p>
                        </div>
                        <div className="font-bold text-xl text-green-600">{(supplier.overallScore || 0).toFixed(1)}</div>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Assessment */}
        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Risk Distribution */}
            <Card className="frosted-glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="glass-card p-2 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(20px)'
                        }}
                        formatter={(value, name) => [
                          `${value} suppliers (${suppliers.length > 0 ? ((value as number) / suppliers.length * 100).toFixed(1) : 0}%)`,
                          'Count'
                        ]}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry) => (
                          <span style={{ color: entry.color, fontWeight: 'bold' }}>
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {riskDistribution.map((item, index) => (
                    <div key={index} className="glass-card p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.value} suppliers ({item.percentage.toFixed(1)}%)
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* High Risk Suppliers */}
            <Card className="frosted-glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="glass-card p-2 rounded-lg">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  High Risk Suppliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {suppliers
                    .filter(s => (s.overallScore || 0) < 50)
                    .sort((a, b) => (a.overallScore || 0) - (b.overallScore || 0))
                    .slice(0, 5)
                    .map((supplier) => (
                      <li key={supplier.id} className="glass-card p-3 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{supplier.name}</p>
                          <p className="text-sm text-gray-600">{supplier.industry}</p>
                        </div>
                        <div className="font-bold text-xl text-red-600">{(supplier.overallScore || 0).toFixed(1)}</div>
                      </li>
                    ))}
                </ul>
                {suppliers.filter(s => (s.overallScore || 0) < 50).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No high-risk suppliers found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Overview */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Compliance Status */}
            <Card className="frosted-glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="glass-card p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={complianceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {complianceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(20px)'
                        }}
                        formatter={(value, name) => [
                          `${value} suppliers (${suppliers.length > 0 ? ((value as number) / suppliers.length * 100).toFixed(1) : 0}%)`,
                          'Count'
                        ]}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry) => (
                          <span style={{ color: entry.color, fontWeight: 'bold' }}>
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {complianceData.map((item, index) => (
                    <div key={index} className="glass-card p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.value} suppliers ({item.percentage.toFixed(1)}%)
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Non-Compliant Suppliers */}
            <Card className="frosted-glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="glass-card p-2 rounded-lg">
                    <Users className="w-5 h-5 text-gray-500" />
                  </div>
                  Non-Compliant Suppliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {suppliers
                    .filter(s => (s.overallScore || 0) <= 60)
                    .sort((a, b) => (a.overallScore || 0) - (b.overallScore || 0))
                    .slice(0, 5)
                    .map((supplier) => (
                      <li key={supplier.id} className="glass-card p-3 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{supplier.name}</p>
                          <p className="text-sm text-gray-600">{supplier.industry}</p>
                        </div>
                        <div className="font-bold text-xl text-gray-500">{(supplier.overallScore || 0).toFixed(1)}</div>
                      </li>
                    ))}
                </ul>
                {suppliers.filter(s => (s.overallScore || 0) <= 60).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No non-compliant suppliers found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
