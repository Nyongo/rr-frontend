import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Radio,
  Search,
  Filter,
  Download,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getRFIDScanHistory, RFIDScanEvent } from "@/services/rfidApi";
import { format, parseISO } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EntryExitLogsProps {
  routeId: string;
}

const EntryExitLogs = ({ routeId }: EntryExitLogsProps) => {
  const [logs, setLogs] = useState<RFIDScanEvent[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<RFIDScanEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<"all" | "entry" | "exit">("all");
  const [verifiedFilter, setVerifiedFilter] = useState<"all" | "verified" | "unverified">("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  useEffect(() => {
    if (routeId) {
      loadLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId, dateFilter]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, eventTypeFilter, verifiedFilter]);

  // Helper function to safely parse timestamp (handles both Date objects and ISO strings)
  const parseTimestamp = (timestamp: Date | string): Date => {
    if (timestamp instanceof Date) {
      return isNaN(timestamp.getTime()) ? new Date() : timestamp;
    }
    if (typeof timestamp === 'string') {
      const parsed = parseISO(timestamp);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }
    return new Date();
  };

  const loadLogs = async () => {
    if (!routeId) {
      console.warn("RouteId is required to load logs");
      return;
    }
    setIsLoading(true);
    try {
      const response = await getRFIDScanHistory(routeId, dateFilter || undefined);
      if (response.success) {
        // Normalize timestamps - convert string timestamps to Date objects
        const normalizedLogs = response.data.map(log => ({
          ...log,
          timestamp: parseTimestamp(log.timestamp)
        }));
        setLogs(normalizedLogs);
      }
    } catch (error) {
      console.error("Failed to load entry/exit logs:", error);
      setLogs([]); // Set empty array on error to prevent rendering issues
    } finally {
      setIsLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.rfidTagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Event type filter
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter((log) => log.eventType === eventTypeFilter);
    }

    // Verified filter
    if (verifiedFilter !== "all") {
      filtered = filtered.filter(
        (log) => log.verified === (verifiedFilter === "verified")
      );
    }

    setFilteredLogs(filtered);
  };

  const exportLogs = () => {
    const csv = [
      ["Timestamp", "Event Type", "RFID Tag", "Student ID", "Verified", "Location"].join(","),
      ...filteredLogs.map((log) => {
        // Timestamps are already normalized to Date objects, but add safety check
        const timestamp = log.timestamp instanceof Date ? log.timestamp : parseTimestamp(log.timestamp);
        return [
          format(timestamp, "yyyy-MM-dd HH:mm:ss"),
          log.eventType,
          log.rfidTagId,
          log.studentId || "N/A",
          log.verified ? "Yes" : "No",
          `${log.location.latitude}, ${log.location.longitude}`,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `entry-exit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Entry/Exit Logs</h2>
          <p className="text-xs sm:text-sm text-gray-600">Track all student entry and exit events</p>
        </div>
        <Button onClick={exportLogs} variant="outline" size="sm" className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by tag or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={eventTypeFilter} onValueChange={(value: any) => setEventTypeFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="entry">Entry Only</SelectItem>
                <SelectItem value="exit">Exit Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={verifiedFilter} onValueChange={(value: any) => setVerifiedFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Verification Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Unverified Only</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Logs ({filteredLogs.length} of {logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Radio className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No logs found</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {filteredLogs.map((log, index) => {
                  const timestamp = log.timestamp instanceof Date ? log.timestamp : parseTimestamp(log.timestamp);
                  return (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Primary info - Timestamp and Event Type */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-medium text-gray-500 mb-1">Timestamp</div>
                              <div className="text-sm font-medium text-gray-900">
                                {format(timestamp, "HH:mm:ss")}
                              </div>
                              <div className="text-xs text-gray-500">
                                {format(timestamp, "MMM dd, yyyy")}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge
                                className={
                                  log.eventType === "entry"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }
                              >
                                {log.eventType === "entry" ? (
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                ) : (
                                  <XCircle className="w-3 h-3 mr-1" />
                                )}
                                <span className="text-xs">{log.eventType.toUpperCase()}</span>
                              </Badge>
                              <Badge
                                className={
                                  log.verified
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                <span className="text-xs">{log.verified ? "Verified" : "Unverified"}</span>
                              </Badge>
                            </div>
                          </div>

                          {/* Secondary info */}
                          <div className="pt-2 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs font-medium text-gray-500 mb-1">RFID Tag</div>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded block font-mono text-gray-700">
                                  {log.rfidTagId}
                                </code>
                              </div>
                              {log.studentId && (
                                <div>
                                  <div className="text-xs font-medium text-gray-500 mb-1">Student</div>
                                  <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <User className="w-3 h-3 text-gray-400" />
                                    <span>{log.studentId}</span>
                                  </div>
                                </div>
                              )}
                              <div className="col-span-2">
                                <div className="text-xs font-medium text-gray-500 mb-1">Location</div>
                                <div className="flex items-center gap-1 text-sm text-gray-700">
                                  <MapPin className="w-3 h-3" />
                                  <span className="text-xs">
                                    {log.location.latitude.toFixed(4)}, {log.location.longitude.toFixed(4)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block relative overflow-x-auto -mx-2 sm:mx-0 rounded-lg border border-gray-200" style={{ WebkitOverflowScrolling: 'touch' }}>
                <table className="w-full min-w-[640px] sm:min-w-0 text-xs sm:text-sm bg-white">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700">Timestamp</th>
                      <th className="text-left px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700">Event</th>
                      <th className="text-left px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700">RFID Tag</th>
                      <th className="text-left px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">Student</th>
                      <th className="text-left px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLogs.map((log, index) => {
                      // Timestamps are already normalized to Date objects in loadLogs, but add safety check
                      const timestamp = log.timestamp instanceof Date ? log.timestamp : parseTimestamp(log.timestamp);
                      return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">
                          <div>
                            <div className="font-medium whitespace-nowrap">
                              {format(timestamp, "HH:mm:ss")}
                            </div>
                            <div className="text-xs text-gray-500">
                              {format(timestamp, "MMM dd, yyyy")}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3">
                          <Badge
                            className={
                              log.eventType === "entry"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {log.eventType === "entry" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            <span className="text-xs">{log.eventType.toUpperCase()}</span>
                          </Badge>
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-mono text-gray-600">{log.rfidTagId}</td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell text-gray-600">
                          {log.studentId ? (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span>{log.studentId}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">Unknown</span>
                          )}
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3">
                          <Badge
                            className={
                              log.verified
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            <span className="text-xs">{log.verified ? "Verified" : "Unverified"}</span>
                          </Badge>
                        </td>
                        <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="text-xs">
                              {log.location.latitude.toFixed(4)}, {log.location.longitude.toFixed(4)}
                            </span>
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EntryExitLogs;

