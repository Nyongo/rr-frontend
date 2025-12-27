import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Radio,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { RouteData } from "./RoutesTab";
import { getRFIDScanHistory, subscribeToRFIDEvents, RFIDScanEvent } from "@/services/rfidApi";
import { format } from "date-fns";

interface RFIDTrackingDashboardProps {
  route: RouteData;
  busId?: string | null;
}

const RFIDTrackingDashboard = ({ route, busId }: RFIDTrackingDashboardProps) => {
  const [scanHistory, setScanHistory] = useState<RFIDScanEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  useEffect(() => {
    loadScanHistory();

    if (realTimeEnabled && busId) {
      const unsubscribe = subscribeToRFIDEvents(route.id.toString(), (event) => {
        setScanHistory((prev) => [event, ...prev].slice(0, 50)); // Keep last 50 events
        setLastUpdate(new Date());
      });

      return () => unsubscribe();
    }
  }, [route.id, busId, realTimeEnabled]);

  const loadScanHistory = async () => {
    setIsLoading(true);
    try {
      const response = await getRFIDScanHistory(route.id.toString());
      if (response.success) {
        setScanHistory(response.data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Failed to load RFID scan history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const entryScans = scanHistory.filter((e) => e.eventType === "entry");
  const exitScans = scanHistory.filter((e) => e.eventType === "exit");
  const verifiedScans = scanHistory.filter((e) => e.verified);
  const unverifiedScans = scanHistory.filter((e) => !e.verified);

  const getStatusColor = (event: RFIDScanEvent) => {
    if (!event.verified) return "bg-red-100 text-red-800";
    if (event.eventType === "entry") return "bg-green-100 text-green-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">RFID Tracking</h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Real-time monitoring for {route.routeName}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={loadScanHistory}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Badge
            variant={realTimeEnabled ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setRealTimeEnabled(!realTimeEnabled)}
          >
            {realTimeEnabled ? "Live" : "Paused"}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold">{scanHistory.length}</p>
              </div>
              <Radio className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entries</p>
                <p className="text-2xl font-bold text-green-600">
                  {entryScans.length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exits</p>
                <p className="text-2xl font-bold text-blue-600">
                  {exitScans.length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {verifiedScans.length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            {unverifiedScans.length > 0 && (
              <p className="text-xs text-red-600 mt-1">
                {unverifiedScans.length} unverified
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-xs text-gray-500">
            Last updated: {format(lastUpdate, "PPpp")}
          </p>
        </CardHeader>
        <CardContent>
          {scanHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Radio className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No RFID scans recorded yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {scanHistory.slice(0, 20).map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${getStatusColor(event)}`}
                    >
                      {event.eventType === "entry" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {event.eventType === "entry" ? "Entry" : "Exit"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Tag: {event.rfidTagId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-600">
                        {format(new Date(event.timestamp), "HH:mm:ss")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(event.timestamp), "MMM dd")}
                      </p>
                    </div>
                    {!event.verified && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RFIDTrackingDashboard;

