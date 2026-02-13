import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Release, InsertRelease, SystemStatus } from "@shared/schema";
import { api, buildUrl } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReleaseSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash2, Upload, Plus } from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const { data: releases, isLoading: releasesLoading } = useQuery<Release[]>({
    queryKey: [api.releases.list.path],
  });

  const { data: status } = useQuery<SystemStatus>({
    queryKey: ["/api/status"],
  });

  const form = useForm<InsertRelease>({
    resolver: zodResolver(insertReleaseSchema),
    defaultValues: {
      version: "",
      title: "",
      description: "",
      downloadUrl: "",
      executorType: "velocity",
      isLatest: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertRelease) => {
      const res = await fetch(api.releases.list.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create release");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.releases.list.path] });
      toast({ title: "Success", description: "Release created successfully" });
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/releases/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete release");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.releases.list.path] });
      toast({ title: "Success", description: "Release deleted" });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (isUp: boolean) => {
      const res = await fetch("/api/admin/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isUp }),
      });
      if (!res.ok) throw new Error("Failed to update status");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/status"] });
      toast({ title: "Success", description: "System status updated" });
    },
  });

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      form.setValue("downloadUrl", url);
      toast({ title: "Success", description: "File uploaded successfully" });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Upload failed" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-24 px-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-display font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4 bg-card p-4 rounded-lg border">
          <span className="font-medium">System Status:</span>
          <Switch 
            checked={!!status?.isUp} 
            onCheckedChange={(val: boolean) => statusMutation.mutate(val)}
          />
          <span className={status?.isUp ? "text-green-500" : "text-red-500"}>
            {status?.isUp ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Create New Release</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="executorType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Executor Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="velocity">Velocity API</SelectItem>
                          <SelectItem value="xeno">Xeno API</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl><Input placeholder="v1.0.0" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl><Input placeholder="Update Title" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea placeholder="What's new?" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel>Download File</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input 
                        placeholder="/uploads/file.zip" 
                        {...form.register("downloadUrl")} 
                      />
                    </FormControl>
                    <div className="relative">
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={onFileUpload}
                        disabled={isUploading}
                      />
                      <Button type="button" variant="outline" size="icon" disabled={isUploading}>
                        {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
                      </Button>
                    </div>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="isLatest"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <FormLabel>Mark as Latest</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="mr-2 animate-spin" />}
                  <Plus className="mr-2" /> Create Release
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Manage Releases</CardTitle>
          </CardHeader>
          <CardContent>
            {releasesLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : (
              <div className="space-y-4">
                {releases?.map((release) => (
                  <div key={release.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{release.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">
                          {release.executorType}
                        </span>
                        {release.isLatest && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-500">Latest</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">Version: {release.version}</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteMutation.mutate(release.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
