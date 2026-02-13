import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Release, SystemStatus } from "@shared/schema";
import { Loader2, RefreshCcw, Save, Trash2, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminPanel() {
  const { toast } = useToast();
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newRelease, setNewRelease] = useState<Partial<Release>>({
    version: "",
    title: "",
    description: "",
    downloadUrl: "",
    executorType: "velocity",
    isLatest: false
  });

  const { data: releases, isLoading: releasesLoading } = useQuery<Release[]>({
    queryKey: ["/api/releases"],
  });

  const { data: velocityStatus, isLoading: velocityLoading } = useQuery<SystemStatus>({
    queryKey: ["/api/status", { executorType: "velocity" }],
    queryFn: async () => {
      const res = await fetch("/api/status?executorType=velocity");
      if (!res.ok) throw new Error("Failed to fetch status");
      return res.json();
    }
  });

  const { data: xenoStatus, isLoading: xenoLoading } = useQuery<SystemStatus>({
    queryKey: ["/api/status", { executorType: "xeno" }],
    queryFn: async () => {
      const res = await fetch("/api/status?executorType=xeno");
      if (!res.ok) throw new Error("Failed to fetch status");
      return res.json();
    }
  });

  const createReleaseMutation = useMutation({
    mutationFn: async (data: Partial<Release>) => {
      const res = await apiRequest("POST", "/api/releases", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/releases"] });
      setIsCreating(false);
      setNewRelease({
        version: "",
        title: "",
        description: "",
        downloadUrl: "",
        executorType: "velocity",
        isLatest: false
      });
      toast({ title: "Release created successfully" });
    },
  });

  const deleteReleaseMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/releases/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/releases"] });
      toast({ title: "Release deleted successfully" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ executorType, isUp }: { executorType: string; isUp: boolean }) => {
      const res = await apiRequest("POST", "/api/admin/status", { executorType, isUp });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/status", { executorType: variables.executorType }] });
      toast({ title: `${variables.executorType.toUpperCase()} status updated` });
    },
  });

  const updateReleaseMutation = useMutation({
    mutationFn: async (data: Partial<Release> & { id: number }) => {
      const { id, ...update } = data;
      const res = await apiRequest("PATCH", `/api/admin/releases/${id}`, update);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/releases"] });
      setEditingRelease(null);
      toast({ title: "Release updated successfully" });
    },
  });

  if (releasesLoading || velocityLoading || xenoLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Velocity API Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Service is {velocityStatus?.isUp ? "UP" : "DOWN"}
              </p>
              <p className="text-sm text-muted-foreground text-xs">
                Last updated: {velocityStatus?.lastUpdated ? new Date(velocityStatus.lastUpdated).toLocaleString() : "Never"}
              </p>
            </div>
            <Switch
              checked={velocityStatus?.isUp}
              onCheckedChange={(checked) => updateStatusMutation.mutate({ executorType: "velocity", isUp: checked })}
              disabled={updateStatusMutation.isPending}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Xeno API Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Service is {xenoStatus?.isUp ? "UP" : "DOWN"}
              </p>
              <p className="text-sm text-muted-foreground text-xs">
                Last updated: {xenoStatus?.lastUpdated ? new Date(xenoStatus.lastUpdated).toLocaleString() : "Never"}
              </p>
            </div>
            <Switch
              checked={xenoStatus?.isUp}
              onCheckedChange={(checked) => updateStatusMutation.mutate({ executorType: "xeno", isUp: checked })}
              disabled={updateStatusMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Manage Releases</h2>
          <Button onClick={() => setIsCreating(true)}>Create New Release</Button>
        </div>

        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>New Release</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Executor Type</Label>
                  <Select 
                    value={newRelease.executorType} 
                    onValueChange={(value) => setNewRelease({ ...newRelease, executorType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select API" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="velocity">Velocity</SelectItem>
                      <SelectItem value="xeno">Xeno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Version</Label>
                  <Input
                    value={newRelease.version}
                    onChange={(e) => setNewRelease({ ...newRelease, version: e.target.value })}
                    placeholder="e.g. v1.2.0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newRelease.title}
                  onChange={(e) => setNewRelease({ ...newRelease, title: e.target.value })}
                  placeholder="e.g. Security Update"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={newRelease.description}
                  onChange={(e) => setNewRelease({ ...newRelease, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Download URL</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('new-file-upload')?.click()}
                  >
                    {newRelease.downloadUrl ? `Selected: ${newRelease.downloadUrl.split('/').pop()}` : 'Browse File'}
                  </Button>
                  <input
                    id="new-file-upload"
                    type="file"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append("file", file);
                      try {
                        const res = await fetch("/api/admin/upload", {
                          method: "POST",
                          body: formData,
                        });
                        const data = await res.json();
                        setNewRelease({ ...newRelease, downloadUrl: data.url });
                        toast({ title: "File uploaded" });
                      } catch (err) {
                        toast({ title: "Upload failed", variant: "destructive" });
                      }
                    }}
                  />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newRelease.isLatest ?? false}
                  onCheckedChange={(checked) => setNewRelease({ ...newRelease, isLatest: checked })}
                />
                <Label>Mark as Latest for this API</Label>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => createReleaseMutation.mutate(newRelease)}
                  disabled={createReleaseMutation.isPending}
                >
                  Create Release
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {releases?.map((release) => (
          <Card key={release.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-muted">
                    {release.executorType}
                  </span>
                  <span>{release.title} ({release.version})</span>
                </div>
                {release.isLatest && (
                  <span className="text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded-full uppercase font-bold">
                    Latest
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingRelease?.id === release.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Executor Type</Label>
                      <Select 
                        value={editingRelease.executorType} 
                        onValueChange={(value) => setEditingRelease({ ...editingRelease, executorType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="velocity">Velocity</SelectItem>
                          <SelectItem value="xeno">Xeno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Version</Label>
                      <Input
                        value={editingRelease.version}
                        onChange={(e) => setEditingRelease({ ...editingRelease, version: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editingRelease.title}
                      onChange={(e) => setEditingRelease({ ...editingRelease, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={editingRelease.description}
                      onChange={(e) => setEditingRelease({ ...editingRelease, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Download URL</Label>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById(`file-upload-${editingRelease.id}`)?.click()}
                      >
                        {editingRelease.downloadUrl ? `Selected: ${editingRelease.downloadUrl.split('/').pop()}` : 'Browse File'}
                      </Button>
                      <input
                        id={`file-upload-${editingRelease.id}`}
                        type="file"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append("file", file);
                          try {
                            const res = await fetch("/api/admin/upload", {
                              method: "POST",
                              body: formData,
                            });
                            const data = await res.json();
                            setEditingRelease({ ...editingRelease, downloadUrl: data.url });
                            toast({ title: "File uploaded" });
                          } catch (err) {
                            toast({ title: "Upload failed", variant: "destructive" });
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => updateReleaseMutation.mutate(editingRelease)}
                      disabled={updateReleaseMutation.isPending}
                    >
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setEditingRelease(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      URL: {release.downloadUrl}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Downloads: {release.downloadCount}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!release.isLatest && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateReleaseMutation.mutate({ id: release.id, isLatest: true })}
                      >
                        Make Latest
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setEditingRelease(release)}>
                      Edit Release
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => {
                        if (confirm("Are you sure?")) {
                          deleteReleaseMutation.mutate(release.id);
                        }
                      }}
                      disabled={deleteReleaseMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
