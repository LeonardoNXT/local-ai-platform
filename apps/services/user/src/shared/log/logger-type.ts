export interface LogEntry {
  level: "info" | "error" | "warn";
  timestamp: string;
  context: string;
  message: string;
  details?: Record<string, unknown>;
}
