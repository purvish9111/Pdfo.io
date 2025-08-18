import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BarChart3, 
  FileText, 
  Settings,
  TrendingUp,
  Download,
  Eye,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import { BlogPostEditor } from '@/components/BlogPostEditor';
import React, { useState } from 'react';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  // Fetch dashboard analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery<any>({
    queryKey: ['/api/analytics/dashboard'],
  });

  // Fetch all blog posts for admin
  const { data: blogPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['/api/blog/posts'],
  });

  // Fetch blog categories
  const { data: categories } = useQuery({
    queryKey: ['/api/blog/categories'],
  });

  // Delete blog post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/blog/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
    },
  });

  const handleExportData = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(`/api/analytics/export/usage/${format}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `usage-report.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (analyticsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your PDF platform, analytics, and content
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="blog">Blog Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.activeUsers || 0} active this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tool Usage</CardTitle>
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
                <CardTitle className="text-sm font-medium">Files Processed</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalFilesProcessed || 0}</div>
                <p className="text-xs text-muted-foreground">
                  PDF files processed
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
                  {analytics?.errorRate ? `${analytics.errorRate.toFixed(1)}%` : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  System reliability
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topTools?.map((tool: any, index: number) => (
                  <div key={tool.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <span>{tool.name}</span>
                      <Badge variant="secondary">{tool.category}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {tool.count} uses
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Analytics & Reports</h2>
            <div className="space-x-2">
              <Button onClick={() => handleExportData('json')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button onClick={() => handleExportData('csv')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Tool Usage by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Usage by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.toolUsageByCategory && Object.entries(analytics.toolUsageByCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="capitalize">{category.replace('_', ' ')}</span>
                    <Badge variant="outline">{count} uses</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics?.userGrowth?.slice(-7).map((data: any) => (
                  <div key={data.date} className="flex items-center justify-between">
                    <span className="text-sm">{new Date(data.date).toLocaleDateString()}</span>
                    <span className="text-sm font-medium">{data.count} users</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blog Management Tab */}
        <TabsContent value="blog" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Blog Management</h2>
            <Button onClick={() => setShowBlogEditor(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>

          {showBlogEditor && (
            <BlogPostEditor
              post={editingPost}
              categories={categories || []}
              onSave={() => {
                setShowBlogEditor(false);
                setEditingPost(null);
                queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
              }}
              onCancel={() => {
                setShowBlogEditor(false);
                setEditingPost(null);
              }}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle>All Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div>Loading posts...</div>
              ) : (
                <div className="space-y-4">
                  {blogPosts?.map((post: any) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {post.status} • {post.viewCount || 0} views
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created: {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingPost(post);
                            setShowBlogEditor(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePostMutation.mutate(post.id)}
                          disabled={deletePostMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">File Retention Policy</h3>
                    <p className="text-sm text-muted-foreground">
                      Files are automatically deleted after 1 hour
                    </p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Analytics Collection</h3>
                    <p className="text-sm text-muted-foreground">
                      Track usage statistics and performance metrics
                    </p>
                  </div>
                  <Badge>Enabled</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SEO Blog System</h3>
                    <p className="text-sm text-muted-foreground">
                      Content management for search optimization
                    </p>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}