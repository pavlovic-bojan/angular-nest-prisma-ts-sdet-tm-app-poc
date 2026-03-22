export const apiContext = {
  authToken: undefined as string | undefined,
  userId: undefined as string | undefined,
  projectId: undefined as string | undefined,
  taskId: undefined as string | undefined,
  /** Last REST response (axios shape: { data, status, headers }) */
  lastResponse: null as { data: unknown; status: number; headers: Record<string, string> } | null,
};

export function resolveUrl(url: string): string {
  return url
    .replace("$userId", apiContext.userId || "")
    .replace("$projectId", apiContext.projectId || "")
    .replace("$taskId", apiContext.taskId || "");
}
