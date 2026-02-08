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
import { Loader2, RefreshCcw, Save } from "lucide-react";

export default function AdminPanel() {
  const { toast } = useToast();
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);

  const { data: releases, isLoading: releasesLoading } = useQuery<Release[]>({
    queryKey: ["/api/releases"],
  });

  const { data: status, isLoading: statusLoading } = useQuery<SystemStatus>({
    queryKey: ["/api/status"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (isUp: boolean) => {
      const res = await apiRequest("POST", "/api/admin/status", { isUp });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/status"] });
      toast({ title: "Status updated successfully" });
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

  if (releasesLoading || statusLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              Service is {status?.isUp ? "UP" : "DOWN"}
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: {status?.lastUpdated ? new Date(status.lastUpdated).toLocaleString() : "Never"}
            </p>
          </div>
          <Switch
            checked={status?.isUp}
            onCheckedChange={(checked) => updateStatusMutation.mutate(checked)}
            disabled={updateStatusMutation.isPending}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <h2 className="text-2xl font-semibold">Manage Releases</h2>
        {releases?.map((release) => (
          <Card key={release.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{release.title} ({release.version})</span>
                {release.isLatest && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
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
                      <Label>Version</Label>
                      <Input
                        value={editingRelease.version}
                        onChange={(e) => setEditingRelease({ ...editingRelease, version: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Download URL</Label>
                      <Input
                        value={editingRelease.downloadUrl}
                        onChange={(e) => setEditingRelease({ ...editingRelease, downloadUrl: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingRelease.isLatest || false}
                      onCheckedChange={(checked) => setEditingRelease({ ...editingRelease, isLatest: checked })}
                    />
                    <Label>Mark as Latest Release</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => updateReleaseMutation.mutate(editingRelease)}
                      disabled={updateReleaseMutation.isPending}
                    >
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingRelease(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    URL: {release.downloadUrl}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setEditingRelease(release)}>
                    Edit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
