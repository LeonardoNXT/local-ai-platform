function isPrivateIp(ip: string): boolean {
  return (
    ip === "unknown" ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

export function resolveClientIp(ip: string): string {
  const mockIp = process.env.MOCK_PUBLIC_IP;
  const isLocalEnv = process.env.NODE_ENV !== "production";

  if (isLocalEnv && mockIp && isPrivateIp(ip)) {
    return mockIp;
  }

  return ip;
}
