"use client";

import { Badge } from "@/components/ui/badge";
import { IconWifi, IconWifiOff } from "@tabler/icons-react";

interface RealtimeStatusProps {
  isConnected: boolean;
  showLabel?: boolean;
}

export function RealtimeStatus({
  isConnected,
  showLabel = false,
}: RealtimeStatusProps) {
  return (
    <Badge
      variant={isConnected ? "default" : "secondary"}
      className="flex items-center gap-1"
    >
      {isConnected ? (
        <>
          <IconWifi className="h-3 w-3" />
          {showLabel && "Live"}
        </>
      ) : (
        <>
          <IconWifiOff className="h-3 w-3" />
          {showLabel && "Offline"}
        </>
      )}
    </Badge>
  );
}
