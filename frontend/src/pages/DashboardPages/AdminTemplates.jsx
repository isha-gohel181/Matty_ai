import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTemplates, createTemplate } from '@/redux/slice/template/template.slice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, LayoutTemplate, Edit, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

const AdminTemplates = () => {
  const dispatch = useDispatch();
  const { templates, loading } = useSelector((state) => state.template);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    tags: '',
    excalidrawJSON: '',
    thumbnail: null,
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    dispatch(getTemplates());
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.excalidrawJSON || !formData.thumbnail) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await dispatch(createTemplate(formData)).unwrap();
      toast.success('Template created successfully!');
      setIsCreateDialogOpen(false);
      setFormData({
        title: '',
        category: 'General',
        tags: '',
        excalidrawJSON: '',
        thumbnail: null,
      });
      setThumbnailPreview(null);
    } catch (error) {
      toast.error(error.message || 'Failed to create template');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'General',
      tags: '',
      excalidrawJSON: '',
      thumbnail: null,
    });
    setThumbnailPreview(null);
  };

  if (loading && templates.length === 0) {
    return (
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Template Management</h1>
            <p className="text-muted-foreground">
              Create and manage templates for users
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter template title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="Enter tags separated by commas"
                  />
                </div>

                <div>
                  <Label htmlFor="thumbnail">Thumbnail *</Label>
                  <div className="mt-2">
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Label htmlFor="thumbnail" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        {thumbnailPreview ? (
                          <div className="space-y-2">
                            <img
                              src={thumbnailPreview}
                              alt="Thumbnail preview"
                              className="max-w-full max-h-32 mx-auto rounded"
                            />
                            <p className="text-sm text-gray-600">Click to change thumbnail</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-600">Click to upload thumbnail</p>
                          </div>
                        )}
                      </div>
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="excalidrawJSON">Excalidraw JSON *</Label>
                  <Textarea
                    id="excalidrawJSON"
                    value={formData.excalidrawJSON}
                    onChange={(e) => handleInputChange('excalidrawJSON', e.target.value)}
                    placeholder="Paste your Excalidraw JSON data here"
                    rows={10}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Export your design from Excalidraw and paste the JSON here
                  </p>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Template'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template._id}
            className="transition-transform hover:scale-105"
          >
            <Card>
              <CardContent className="p-0 relative">
                <Link to={`/dashboard/editor?template=${template._id}`}>
                  <img
                    src={template.thumbnailUrl.secure_url}
                    alt={template.title}
                    className="rounded-t-lg aspect-video object-cover"
                  />
                </Link>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/80 hover:bg-white/90 h-8 w-8 p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Implement edit functionality
                      toast.info('Edit functionality coming soon');
                    }}
                  >
                    <Edit className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/80 hover:bg-white/90 h-8 w-8 p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Implement delete functionality
                      toast.info('Delete functionality coming soon');
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
              <div className="p-4">
                <h3 className="font-semibold truncate mb-2">{template.title}</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                  {template.tags && template.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Created {new Date(template.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {templates.length === 0 && !loading && (
        <div className="text-center py-20 flex flex-col items-center">
          <LayoutTemplate className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold">No Templates Yet</h2>
          <p className="text-muted-foreground mt-2 mb-4 max-w-md">
            Start by creating your first template to help users get started with their designs.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create First Template
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminTemplates;