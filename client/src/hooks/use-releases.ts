import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useReleases() {
  return useQuery({
    queryKey: [api.releases.list.path],
    queryFn: async () => {
      const res = await fetch(api.releases.list.path);
      if (!res.ok) throw new Error("Failed to fetch releases");
      return api.releases.list.responses[200].parse(await res.json());
    },
  });
}

export function useLatestRelease() {
  return useQuery({
    queryKey: [api.releases.getLatest.path],
    queryFn: async () => {
      const res = await fetch(api.releases.getLatest.path);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch latest release");
      return api.releases.getLatest.responses[200].parse(await res.json());
    },
  });
}

export function useTrackDownload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.releases.trackDownload.path, { id });
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error("Failed to track download");
      return api.releases.trackDownload.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.releases.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.releases.getLatest.path] });
    },
  });
}
