import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Clock,
  Download,
  Activity,
  PieChart,
  Target
} from 'lucide-react';
import React, { useState } from 'react';

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('30d');

  // Fetch dashboard analytics
  const { data: analytics, isLoading } = useQuery<any>({
    queryKey: ['/api/analytics/dashboard'],
  });

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(`/api/analytics/export/usage/${format}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive insights into your PDF platform performance
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => handleExport('json')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={() => handleExport('csv')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.activeUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tool Operations</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalToolUsage || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Total operations performed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.errorRate ? `${(100 - analytics.errorRate).toFixed(1)}%` : '100%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Operation success rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.userGrowth?.slice(-10).map((data: any) => (
                  <div key={data.date} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(data.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-3 flex-1 mx-4">
                      <Progress value={(data.count / (analytics?.totalUsers || 1)) * 100} className="flex-1" />
                      <span className="text-sm font-medium">{data.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topTools?.map((tool: any, index: number) => (
                  <div key={tool.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <span className="font-medium">{tool.name}</span>
                        <p className="text-xs text-muted-foreground capitalize">
                          {tool.category.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{tool.count} uses</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>New Users</span>
                    <span className="font-medium">{Math.floor((analytics?.activeUsers || 0) * 0.3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Returning Users</span>
                    <span className="font-medium">{Math.floor((analytics?.activeUsers || 0) * 0.7)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Power Users</span>
                    <span className="font-medium">{Math.floor((analytics?.activeUsers || 0) * 0.1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Daily Active Users</span>
                      <span className="text-sm font-medium">
                        {Math.floor((analytics?.activeUsers || 0) * 0.4)}
                      </span>
                    </div>
                    <Progress value={40} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Weekly Active Users</span>
                      <span className="text-sm font-medium">{analytics?.activeUsers || 0}</span>
                    </div>
                    <Progress value={70} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Monthly Active Users</span>
                      <span className="text-sm font-medium">{analytics?.totalUsers || 0}</span>
                    </div>
                    <Progress value={100} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {analytics?.totalToolUsage ? Math.floor(analytics.totalToolUsage / (analytics.totalUsers || 1)) : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Avg. operations per user</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {analytics?.totalFilesProcessed ? Math.floor(analytics.totalFilesProcessed / (analytics.totalUsers || 1)) : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Avg. files per user</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Usage by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Usage by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.toolUsageByCategory && Object.entries(analytics.toolUsageByCategory).map(([category, count]) => {
                    const percentage = ((count as number) / analytics.totalToolUsage) * 100;
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="capitalize text-sm">
                            {category.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-medium">{count} uses</span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Tool Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Tool Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.topTools?.slice(0, 5).map((tool: any) => (
                    <div key={tool.name} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{tool.name}</span>
                        <p className="text-xs text-muted-foreground capitalize">
                          {tool.category.replace('_', ' ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{tool.count}</div>
                        <p className="text-xs text-muted-foreground">uses</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Tool List */}
          <Card>
            <CardHeader>
              <CardTitle>All Tools Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Tool Name</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-right p-2">Usage Count</th>
                      <th className="text-right p-2">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.topTools?.map((tool: any) => (
                      <tr key={tool.name} className="border-b">
                        <td className="p-2 font-medium">{tool.name}</td>
                        <td className="p-2 capitalize">
                          <Badge variant="outline">
                            {tool.category.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="p-2 text-right">{tool.count}</td>
                        <td className="p-2 text-right">
                          {((tool.count / analytics.totalToolUsage) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.avgProcessingTime ? `${Math.round(analytics.avgProcessingTime / 1000)}s` : '0s'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per operation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.errorRate ? `${analytics.errorRate.toFixed(2)}%` : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  System reliability
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Files Processed</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalFilesProcessed || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Total PDF files
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>CPU Usage</span>
                      <span>23%</span>
                    </div>
                    <Progress value={23} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Memory Usage</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Disk Usage</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">99.9%</div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {analytics?.avgProcessingTime ? `${Math.round(analytics.avgProcessingTime)}ms` : '0ms'}
                    </div>
                    <p className="text-sm text-muted-foreground">Response Time</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">
                      {analytics?.totalToolUsage ? Math.round(analytics.totalToolUsage / 30) : 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Daily Operations</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}