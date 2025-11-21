import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import {
  generateApiKey,
  getApiKeys,
  deleteApiKey,
  toggleApiKey,
  selectApiKeys,
  selectApiKeyLoading,
  selectApiKeyError,
  clearError,
} from "@/redux/slice/apiKey/apiKey.slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Copy, Trash2, Eye, EyeOff, Plus, Key } from "lucide-react";
import CustomAlert from "@/components/CustomAlert/CustomAlert";
import { toast } from "sonner";

// Zod schema for API key generation
const apiKeySchema = z.object({
  name: z.string().min(1, "API key name is required").max(50, "Name must be less than 50 characters"),
});

const ApiKeysTab = () => {
  const dispatch = useDispatch();
  const apiKeys = useSelector(selectApiKeys);
  const loading = useSelector(selectApiKeyLoading);
  const error = useSelector(selectApiKeyError);
  const [showKey, setShowKey] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form for API key generation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(apiKeySchema),
  });

  // Fetch API keys on component mount
  useEffect(() => {
    dispatch(getApiKeys());
    return () => dispatch(clearError());
  }, [dispatch]);

  // Handle API key generation
  const onSubmit = (data) => {
    dispatch(generateApiKey(data)).then((result) => {
      if (generateApiKey.fulfilled.match(result)) {
        toast.success("API key generated successfully!");
        reset();
        setDialogOpen(false);
      }
    });
  };

  // Handle API key deletion
  const handleDelete = (keyId) => {
    dispatch(deleteApiKey(keyId)).then((result) => {
      if (deleteApiKey.fulfilled.match(result)) {
        toast.success("API key deleted successfully!");
      }
    });
  };

  // Handle API key toggle
  const handleToggle = (keyId) => {
    dispatch(toggleApiKey(keyId)).then((result) => {
      if (toggleApiKey.fulfilled.match(result)) {
        toast.success("API key status updated!");
      }
    });
  };

  // Copy API key to clipboard
  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard!");
  };

  // Toggle key visibility
  const toggleKeyVisibility = (keyId) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  return (
    <div className="space-y-6">
      {error && <CustomAlert type="error" message={error} onClose={() => dispatch(clearError())} />}

      {/* Header with Generate Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">API Keys</h3>
          <p className="text-sm text-muted-foreground">
            Manage your API keys for external integrations
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Generate API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New API Key</DialogTitle>
              <DialogDescription>
                Create a new API key to access Matty AI features from external applications.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">API Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., My App Integration"
                  {...register("name")}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Generating..." : "Generate Key"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Key className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No API keys yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Generate your first API key to start integrating with external applications.
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Generate API Key
              </Button>
            </CardContent>
          </Card>
        ) : (
          apiKeys.map((apiKey) => (
            <Card key={apiKey._id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">{apiKey.name}</CardTitle>
                      <CardDescription>
                        Created {new Date(apiKey.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                      {apiKey.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(apiKey._id)}
                      disabled={loading}
                    >
                      {apiKey.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                      {showKey[apiKey._id] ? apiKey.key : `${apiKey.key.substring(0, 20)}...`}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleKeyVisibility(apiKey._id)}
                    >
                      {showKey[apiKey._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.key)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Used {apiKey.usageCount} times
                    </span>
                    {apiKey.lastUsed && (
                      <span className="text-sm text-muted-foreground">
                        • Last used {new Date(apiKey.lastUsed).toLocaleDateString()}
                      </span>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this API key? This action cannot be undone.
                            Any applications using this key will lose access.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(apiKey._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* API Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Documentation</CardTitle>
          <CardDescription>Complete guide to integrate Matty AI into your applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Base URL */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Base URL</h4>
            <code className="bg-muted px-2 py-1 rounded text-sm block">
              {window.location.origin.replace('5173', '3000')}/api/v1
            </code>
          </div>

          {/* Authentication */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Authentication</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Include your API key in the <code className="bg-muted px-1 py-0.5 rounded text-xs">X-API-Key</code> header:
            </p>
            <div className="bg-muted p-3 rounded-md overflow-x-auto">
              <code className="text-xs">
                X-API-Key: your-api-key-here
              </code>
            </div>
          </div>

          {/* Available Endpoints */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Available Endpoints</h4>
            <div className="space-y-4">
              {/* AI Suggestions */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" className="text-xs">POST</Badge>
                  <code className="text-xs font-mono">/ai/suggestions</code>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Generate AI design suggestions based on text prompts</p>
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium mb-2">View Example</summary>
                  <div className="bg-muted p-2 rounded mt-2">
                    <p className="mb-1 font-semibold">Request:</p>
                    <pre className="overflow-x-auto">{`curl -X POST \\
  ${window.location.origin.replace('5173', '3000')}/api/v1/ai/suggestions \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-key" \\
  -d '{"prompt": "Modern tech poster"}'`}</pre>
                  </div>
                </details>
              </div>

              {/* Color Palette */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" className="text-xs">POST</Badge>
                  <code className="text-xs font-mono">/ai/palette</code>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Extract color palette from uploaded image</p>
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium mb-2">View Example</summary>
                  <div className="bg-muted p-2 rounded mt-2">
                    <p className="mb-1 font-semibold">Request (multipart/form-data):</p>
                    <pre className="overflow-x-auto">{`curl -X POST \\
  ${window.location.origin.replace('5173', '3000')}/api/v1/ai/palette \\
  -H "X-API-Key: your-key" \\
  -F "image=@/path/to/image.jpg"`}</pre>
                  </div>
                </details>
              </div>

              {/* Design Management */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">GET</Badge>
                  <code className="text-xs font-mono">/designs</code>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Get all your designs</p>
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium mb-2">View Example</summary>
                  <div className="bg-muted p-2 rounded mt-2">
                    <pre className="overflow-x-auto">{`curl -X GET \\
  ${window.location.origin.replace('5173', '3000')}/api/v1/designs \\
  -H "X-API-Key: your-key"`}</pre>
                  </div>
                </details>
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" className="text-xs">POST</Badge>
                  <code className="text-xs font-mono">/designs</code>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Create a new design</p>
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium mb-2">View Example</summary>
                  <div className="bg-muted p-2 rounded mt-2">
                    <p className="mb-1 font-semibold">Request (multipart/form-data):</p>
                    <pre className="overflow-x-auto">{`curl -X POST \\
  ${window.location.origin.replace('5173', '3000')}/api/v1/designs \\
  -H "X-API-Key: your-key" \\
  -F "title=My Design" \\
  -F "excalidrawJSON={\"elements\":[]}" \\
  -F "thumbnail=@/path/to/image.jpg"`}</pre>
                  </div>
                </details>
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">GET</Badge>
                  <code className="text-xs font-mono">/designs/:id</code>
                </div>
                <p className="text-xs text-muted-foreground">Get specific design by ID</p>
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">PUT</Badge>
                  <code className="text-xs font-mono">/designs/:id</code>
                </div>
                <p className="text-xs text-muted-foreground">Update existing design</p>
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive" className="text-xs">DELETE</Badge>
                  <code className="text-xs font-mono">/designs/:id</code>
                </div>
                <p className="text-xs text-muted-foreground">Delete a design</p>
              </div>
            </div>
          </div>

          {/* Response Format */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Response Format</h4>
            <p className="text-xs text-muted-foreground mb-2">All responses are in JSON format:</p>
            <div className="bg-muted p-3 rounded-md">
              <pre className="text-xs overflow-x-auto">{`{
  "success": true,
  "data": {...},
  "remainingRequests": 4
}`}</pre>
            </div>
          </div>

          {/* Rate Limits */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Rate Limits</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Free Tier: 5 AI suggestions / month</p>
              <p>• Free Tier: 3 color palettes / month</p>
              <p>• Premium: Unlimited requests</p>
            </div>
          </div>

          {/* SDK Examples */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Code Examples</h4>
            <div className="space-y-2">
              <details className="text-xs">
                <summary className="cursor-pointer font-medium">JavaScript / Node.js</summary>
                <div className="bg-muted p-2 rounded mt-2">
                  <pre className="overflow-x-auto">{`const response = await fetch('${window.location.origin.replace('5173', '3000')}/api/v1/ai/suggestions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({
    prompt: 'Create a modern poster'
  })
});
const data = await response.json();`}</pre>
                </div>
              </details>

              <details className="text-xs">
                <summary className="cursor-pointer font-medium">Python</summary>
                <div className="bg-muted p-2 rounded mt-2">
                  <pre className="overflow-x-auto">{`import requests

response = requests.post(
  '${window.location.origin.replace('5173', '3000')}/api/v1/ai/suggestions',
  headers={'X-API-Key': 'your-api-key'},
  json={'prompt': 'Create a modern poster'}
)
data = response.json()`}</pre>
                </div>
              </details>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeysTab;