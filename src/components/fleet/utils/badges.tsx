
import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  const variant = status === "Active" ? "success" : "danger";
  return <Badge variant={variant}>{status}</Badge>;
};

export const getTypeBadge = (type: string) => {
  const variant = type === "Big Bus" ? "bustype" : "minibus";
  return <Badge variant={variant}>{type}</Badge>;
};
