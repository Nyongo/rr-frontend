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
    loadLogs();
  }, [routeId, dateFilter]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, eventTypeFilter, verifiedFilter]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const response = await getRFIDScanHistory(routeId, dateFilter || undefined);
      if (response.success) {
        setLogs(response.data);
      }
    } catch (error) {
      console.error("Failed to load entry/exit logs:", error);
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
      ...filteredLogs.map((log) =>
        [
          format(parseISO(log.timestamp.toString()), "yyyy-MM-dd HH:mm:ss"),
          log.eventType,
          log.rfidTagId,
          log.studentId || "N/A",
          log.verified ? "Yes" : "No",
          `${log.location.latitude}, ${log.location.longitude}`,
        ].join(",")
      ),
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
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full min-w-[640px] sm:min-w-0">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-700">Timestamp</th>
                    <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-700">Event</th>
                    <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-700">RFID Tag</th>
                    <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-700 hidden sm:table-cell">Student</th>
                    <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-700 hidden md:table-cell">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">
                        <div>
                          <div className="font-medium whitespace-nowrap">
                            {format(parseISO(log.timestamp.toString()), "HH:mm:ss")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(parseISO(log.timestamp.toString()), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 sm:p-3">
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
                      <td className="p-2 sm:p-3 text-xs sm:text-sm font-mono">{log.rfidTagId}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm hidden sm:table-cell">
                        {log.studentId ? (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{log.studentId}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Unknown</span>
                        )}
                      </td>
                      <td className="p-2 sm:p-3">
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
                      <td className="p-2 sm:p-3 text-xs sm:text-sm hidden md:table-cell">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs">
                            {log.location.latitude.toFixed(4)}, {log.location.longitude.toFixed(4)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EntryExitLogs;

