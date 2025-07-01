"use client";

import { useState, useMemo } from "react";
import { 
  CreditCard, 
  AlertCircle, 
  Calendar, 
  TrendingUp,
  DollarSign,
  Clock,
  FileText,
  Search,
  Download,
  Filter
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

// Import AR aging data
import arAgingData from "@/data/mock/financial/ar-aging.json";

interface ARAgingProps {
  userRole: string;
  projectData: any;
}

// AR Aging item interface
interface ARAgingItem {
  project_id: number;
  project_name: string;
  project_manager: string;
  percent_complete: number;
  balance_to_finish: number;
  retainage: number;
  total_ar: number;
  current: number;
  days_1_30: number;
  days_31_60: number;
  days_60_plus: number;
  comments: string;
}

export default function ARAgingCard({ userRole, projectData }: ARAgingProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter AR aging data to single project (2525840 - Palm Beach Luxury Estate)
  const filteredARData = useMemo(() => {
    return (arAgingData as ARAgingItem[]).filter(item => item.project_id === 2525840);
  }, []);

  // Apply search filter
  const processedARData = useMemo(() => {
    let data = [...filteredARData];

    if (searchTerm) {
      data = data.filter(item =>
        item.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.project_manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.comments.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return data;
  }, [filteredARData, searchTerm]);

  // Calculate totals for each aging category
  const totals = useMemo(() => {
    return processedARData.reduce((acc, item) => ({
      balance_to_finish: acc.balance_to_finish + item.balance_to_finish,
      retainage: acc.retainage + item.retainage,
      total_ar: acc.total_ar + item.total_ar,
      current: acc.current + item.current,
      days_1_30: acc.days_1_30 + item.days_1_30,
      days_31_60: acc.days_31_60 + item.days_31_60,
      days_60_plus: acc.days_60_plus + item.days_60_plus
    }), {
      balance_to_finish: 0,
      retainage: 0,
      total_ar: 0,
      current: 0,
      days_1_30: 0,
      days_31_60: 0,
      days_60_plus: 0
    });
  }, [processedARData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const exportToCSV = () => {
    const headers = [
      "Project Name",
      "Project Manager", 
      "% Complete",
      "Balance to Finish",
      "Retainage",
      "Total AR",
      "Current",
      "1-30 Days",
      "31-60 Days",
      "60+ Days",
      "Comments"
    ];

    const csvContent = [
      headers.join(","),
      ...processedARData.map(item => [
        `"${item.project_name}"`,
        `"${item.project_manager}"`,
        item.percent_complete,
        item.balance_to_finish,
        item.retainage,
        item.total_ar,
        item.current,
        item.days_1_30,
        item.days_31_60,
        item.days_60_plus,
        `"${item.comments}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "ar_aging_analysis.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get row styling based on aging status
  const getRowStyling = (item: ARAgingItem) => {
    if (item.days_60_plus > 0) {
      return "bg-red-50 border-l-4 border-l-red-500"; // Red highlight for 60+ days
    }
    if (item.days_1_30 > 0 || item.days_31_60 > 0) {
      return "bg-yellow-50 border-l-4 border-l-yellow-500"; // Yellow highlight for 1-60 days
    }
    return ""; // Default styling
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Accounts Receivable Aging – Project 2525840
              </CardTitle>
              <CardDescription>
                AR aging analysis for Palm Beach Luxury Estate project
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="px-3 py-1">
                  {processedARData.length} Record{processedARData.length !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-600 border-blue-200">
                  DEMO
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={exportToCSV} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search Controls */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search project, manager, or comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">
                  {formatCurrency(totals.total_ar)}
                </div>
                <div className="text-sm text-blue-600">Total AR</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrency(totals.current)}
                </div>
                <div className="text-sm text-green-600">Current</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-4 text-center">
                <Clock className="h-5 w-5 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-900">
                  {formatCurrency(totals.days_1_30 + totals.days_31_60)}
                </div>
                <div className="text-sm text-yellow-600">1-60 Days</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-4 text-center">
                <AlertCircle className="h-5 w-5 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-900">
                  {formatCurrency(totals.days_60_plus)}
                </div>
                <div className="text-sm text-red-600">60+ Days</div>
              </CardContent>
            </Card>
          </div>

          {/* AR Aging Table */}
          <div className="rounded-md border">
            <div className="overflow-auto max-h-[600px]">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b-2 border-border/50 shadow-lg">
                  <TableRow className="bg-background/95 backdrop-blur-md">
                    <TableHead className="min-w-[200px]">Project Details</TableHead>
                    <TableHead className="text-right w-[120px]">% Complete</TableHead>
                    <TableHead className="text-right w-[120px]">Balance to Finish</TableHead>
                    <TableHead className="text-right w-[120px]">Retainage</TableHead>
                    <TableHead className="text-right w-[120px]">Total AR</TableHead>
                    <TableHead className="text-right w-[120px]">Current</TableHead>
                    <TableHead className="text-right w-[120px]">1-30 Days</TableHead>
                    <TableHead className="text-right w-[120px]">31-60 Days</TableHead>
                    <TableHead className="text-right w-[120px]">60+ Days</TableHead>
                    <TableHead className="min-w-[150px]">Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedARData.map((item, index) => (
                    <TableRow key={index} className={`hover:bg-muted/50 ${getRowStyling(item)}`}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{item.project_name}</div>
                          <div className="text-xs text-muted-foreground">
                            PM: {item.project_manager}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        <Badge variant="outline" className="text-xs">
                          {formatPercentage(item.percent_complete)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(item.balance_to_finish)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(item.retainage)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-medium">
                        {formatCurrency(item.total_ar)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(item.current)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        <span className={item.days_1_30 > 0 ? "text-yellow-600 font-medium" : ""}>
                          {formatCurrency(item.days_1_30)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        <span className={item.days_31_60 > 0 ? "text-yellow-600 font-medium" : ""}>
                          {formatCurrency(item.days_31_60)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        <span className={item.days_60_plus > 0 ? "text-red-600 font-bold" : ""}>
                          {formatCurrency(item.days_60_plus)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm max-w-[150px] truncate">
                        {item.comments || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell className="font-bold">Totals</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">
                      {formatCurrency(totals.balance_to_finish)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">
                      {formatCurrency(totals.retainage)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">
                      {formatCurrency(totals.total_ar)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">
                      {formatCurrency(totals.current)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">
                      <span className={totals.days_1_30 > 0 ? "text-yellow-600" : ""}>
                        {formatCurrency(totals.days_1_30)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">
                      <span className={totals.days_31_60 > 0 ? "text-yellow-600" : ""}>
                        {formatCurrency(totals.days_31_60)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">
                      <span className={totals.days_60_plus > 0 ? "text-red-600" : ""}>
                        {formatCurrency(totals.days_60_plus)}
                      </span>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>

          {/* Data Quality Notice */}
          {processedARData.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No AR aging records found{searchTerm ? " matching your search" : " for this project"}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 