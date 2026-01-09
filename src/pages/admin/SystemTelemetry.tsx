
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, subDays, subMonths, subWeeks, startOfQuarter, subYears, isSameDay, eachDayOfInterval, startOfDay } from "date-fns";
import { Activity, Radio, MessageSquare, Calendar as CalendarIcon, Search, X, User, MapPin, Clock, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, BarChart3, PieChart, Zap, Server, Wifi, Smartphone, Building, Loader2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  getSystemSummary,
  getTelemetrySummary,
  getDailyStatistics,
  getDevicePerformance,
  getRoutePerformance,
  getRFIDFailures,
  getSMSFailures,
  getFailureReasons,
  type SystemSummary,
  type TelemetrySummary,
  type DailyStatistics,
  type DevicePerformance,
  type RoutePerformance,
  type RFIDFailure,
  type SMSFailure,
} from "@/services/telemetryApi";

// No mock data - using real API endpoints only

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type TimeRange = "day" | "week" | "month" | "quarter" | "year" | "custom";

const SystemTelemetry = () => {
  const [selectedTab, setSelectedTab] = useState<string>("analytics");
  const [dateRange, setDateRange] = useState<DateRange>({ from: subDays(new Date(), 7), to: new Date() });
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [searchQuery, setSearchQuery] = useState("");
  
  // API Data States
  const [systemSummary, setSystemSummary] = useState<SystemSummary | null>(null);
  const [telemetrySummary, setTelemetrySummary] = useState<TelemetrySummary | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStatistics[]>([]);
  const [devicePerformance, setDevicePerformance] = useState<DevicePerformance[]>([]);
  const [routePerformance, setRoutePerformance] = useState<RoutePerformance[]>([]);
  const [rfidFailures, setRfidFailures] = useState<RFIDFailure[]>([]);
  const [smsFailures, setSmsFailures] = useState<SMSFailure[]>([]);
  const [failureReasons, setFailureReasons] = useState<{ rfid: Array<{ name: string; value: number }>; sms: Array<{ name: string; value: number }> }>({ rfid: [], sms: [] });
  
  // Loading States
  const [loadingSystemSummary, setLoadingSystemSummary] = useState(true);
  const [loadingTelemetry, setLoadingTelemetry] = useState(true);
  const [loadingFailures, setLoadingFailures] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apply time range presets
  useEffect(() => {
    if (timeRange === "custom") return;

    const now = new Date();
    let fromDate: Date;

    switch (timeRange) {
      case "day":
        fromDate = subDays(now, 1);
        break;
      case "week":
        fromDate = subWeeks(now, 1);
        break;
      case "month":
        fromDate = subMonths(now, 1);
        break;
      case "quarter":
        fromDate = startOfQuarter(subMonths(now, 3));
        break;
      case "year":
        fromDate = subYears(now, 1);
        break;
      default:
        fromDate = subWeeks(now, 1);
    }

    setDateRange({ from: fromDate, to: now });
  }, [timeRange]);

  // Fetch System Summary (once on mount)
  useEffect(() => {
    const fetchSystemSummary = async () => {
      try {
        setLoadingSystemSummary(true);
        setError(null);
        const response = await getSystemSummary();
        if (response.success && response.data) {
          setSystemSummary(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch system summary:", err);
        setError(err instanceof Error ? err.message : "Failed to load system summary");
      } finally {
        setLoadingSystemSummary(false);
      }
    };

    fetchSystemSummary();
  }, []);

  // Fetch Telemetry Data (when date range changes)
  useEffect(() => {
    if (!dateRange.from || !dateRange.to) return;

    const fetchTelemetryData = async () => {
      try {
        setLoadingTelemetry(true);
        setError(null);
        
        const fromISO = dateRange.from.toISOString();
        const toISO = dateRange.to.toISOString();

        // Fetch all telemetry data in parallel, with error handling for placeholder endpoints
        const [telemetryResult, dailyResult, devicesResult, routesResult, failureReasonsResult] = await Promise.allSettled([
          getTelemetrySummary(fromISO, toISO, true),
          getDailyStatistics(fromISO, toISO),
          getDevicePerformance(fromISO, toISO),
          getRoutePerformance(fromISO, toISO),
          getFailureReasons(fromISO, toISO, "all").catch(() => ({ success: true, data: { rfid: [], sms: [] } })), // Handle placeholder gracefully
        ]);

        // Handle telemetry summary
        if (telemetryResult.status === "fulfilled" && telemetryResult.value.success && telemetryResult.value.data) {
          setTelemetrySummary(telemetryResult.value.data);
        } else if (telemetryResult.status === "rejected") {
          console.warn("Failed to fetch telemetry summary:", telemetryResult.reason);
        }

        // Handle daily statistics
        if (dailyResult.status === "fulfilled" && dailyResult.value.success && dailyResult.value.data) {
          setDailyStats(Array.isArray(dailyResult.value.data) ? dailyResult.value.data : []);
        } else if (dailyResult.status === "rejected") {
          console.warn("Failed to fetch daily statistics:", dailyResult.reason);
          setDailyStats([]);
        }

        // Handle device performance
        if (devicesResult.status === "fulfilled" && devicesResult.value.success && devicesResult.value.data) {
          setDevicePerformance(Array.isArray(devicesResult.value.data) ? devicesResult.value.data : []);
        } else if (devicesResult.status === "rejected") {
          console.warn("Failed to fetch device performance:", devicesResult.reason);
          setDevicePerformance([]);
        }

        // Handle route performance
        if (routesResult.status === "fulfilled" && routesResult.value.success && routesResult.value.data) {
          setRoutePerformance(Array.isArray(routesResult.value.data) ? routesResult.value.data : []);
        } else if (routesResult.status === "rejected") {
          console.warn("Failed to fetch route performance:", routesResult.reason);
          setRoutePerformance([]);
        }

        // Handle failure reasons (placeholder endpoint)
        if (failureReasonsResult.status === "fulfilled" && failureReasonsResult.value.success && failureReasonsResult.value.data) {
          setFailureReasons({
            rfid: Array.isArray(failureReasonsResult.value.data.rfid) 
              ? failureReasonsResult.value.data.rfid.map((r: any) => ({ name: r.reason, value: r.count }))
              : [],
            sms: Array.isArray(failureReasonsResult.value.data.sms)
              ? failureReasonsResult.value.data.sms.map((r: any) => ({ name: r.reason, value: r.count }))
              : [],
          });
        } else {
          // Default to empty arrays for placeholder endpoint
          setFailureReasons({ rfid: [], sms: [] });
        }
      } catch (err) {
        console.error("Failed to fetch telemetry data:", err);
        // Don't set error for individual endpoint failures, just log them
        // The component will gracefully handle missing data
        if (err instanceof Error && !err.message.includes("placeholder")) {
          setError(err.message || "Failed to load some telemetry data");
        }
      } finally {
        setLoadingTelemetry(false);
      }
    };

    fetchTelemetryData();
  }, [dateRange.from, dateRange.to]);

  // Fetch Failures (when tab changes or search query changes)
  useEffect(() => {
    if (!dateRange.from || !dateRange.to) return;

    const fetchFailures = async () => {
      try {
        setLoadingFailures(true);
        setError(null);
        
        const fromISO = dateRange.from?.toISOString();
        const toISO = dateRange.to?.toISOString();

        if (selectedTab === "rfid") {
          try {
            const response = await getRFIDFailures(fromISO, toISO, undefined, undefined, undefined, 1, 100, searchQuery || undefined);
            if (response.success && response.data) {
              setRfidFailures(Array.isArray(response.data.failures) ? response.data.failures : []);
            } else {
              setRfidFailures([]);
            }
          } catch (err) {
            // Handle placeholder endpoint - set empty array if endpoint not fully implemented
            console.warn("RFID failures endpoint may be a placeholder:", err);
            setRfidFailures([]);
          }
        } else if (selectedTab === "sms") {
          try {
            const response = await getSMSFailures(fromISO, toISO, undefined, undefined, 1, 100, searchQuery || undefined);
            if (response.success && response.data) {
              setSmsFailures(Array.isArray(response.data.failures) ? response.data.failures : []);
            } else {
              setSmsFailures([]);
            }
          } catch (err) {
            // Handle placeholder endpoint - set empty array if endpoint not fully implemented
            console.warn("SMS failures endpoint may be a placeholder:", err);
            setSmsFailures([]);
          }
        }
      } catch (err) {
        // This outer catch should rarely trigger since inner try-catches handle most cases
        console.error("Unexpected error fetching failures:", err);
        // Only set error if it's not related to placeholder endpoints
        if (err instanceof Error && !err.message.toLowerCase().includes("placeholder")) {
          setError(err.message || "Failed to load failures");
        }
      } finally {
        setLoadingFailures(false);
      }
    };

    fetchFailures();
  }, [dateRange.from, dateRange.to, selectedTab, searchQuery]);

  // Transform API failures to match existing data structure and apply search filter
  const transformedRFIDFailures = rfidFailures.map(failure => ({
    id: failure.id,
    deviceId: failure.deviceId,
    appVersion: failure.appVersion,
    busRegistration: failure.busRegistration,
    rfidTagId: failure.rfidTagId,
    student: {
      name: failure.student.name,
      photo: failure.student.photo,
      dateOfBirth: failure.student.dateOfBirth,
      age: failure.student.age,
    },
    minderName: failure.minderName,
    failureTime: new Date(failure.failureTime),
    failureReason: failure.failureReason,
  }));

  const transformedSMSFailures = smsFailures.map(failure => ({
    id: failure.id,
    parentName: failure.parentName,
    phoneNumber: failure.phoneNumber,
    tripNumber: failure.trip.number,
    trip: {
      number: failure.trip.number,
      route: failure.trip.route.name,
      startTime: format(new Date(failure.trip.startTime), "h:mm a"),
      endTime: format(new Date(failure.trip.endTime), "h:mm a"),
      status: failure.trip.status,
      driver: failure.trip.driver.name,
      busRegistration: failure.trip.bus.registrationNumber,
    },
    failureTime: new Date(failure.failureTime),
    failureReason: failure.failureReason,
  }));

  // Apply search filter if provided
  const filteredRFIDFailures = searchQuery
    ? transformedRFIDFailures.filter(failure =>
                          failure.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          failure.minderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          failure.busRegistration.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          failure.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (failure.rfidTagId && failure.rfidTagId.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : transformedRFIDFailures;

  const filteredSMSFailures = searchQuery
    ? transformedSMSFailures.filter(failure =>
                          failure.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          failure.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        failure.phoneNumber.includes(searchQuery)
      )
    : transformedSMSFailures;

  // Group failures by day for display
  const groupByDay = <T extends { failureTime: Date }>(data: T[]): Record<string, T[]> => {
    return data.reduce((grouped, item) => {
      const dateKey = format(item.failureTime, "yyyy-MM-dd");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(item);
      return grouped;
    }, {} as Record<string, T[]>);
  };

  const groupedRFIDFailures = groupByDay(filteredRFIDFailures);
  const groupedSmsFailures = groupByDay(filteredSMSFailures);

  // Reset filters
  const resetFilters = () => {
    setTimeRange("week");
    setDateRange({ from: subDays(new Date(), 7), to: new Date() });
    setSearchQuery("");
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Default empty structures for when API data is not yet loaded
  const defaultSystemSummary: SystemSummary = {
    schools: {
      total: 0,
      active: 0,
      inactive: 0,
      newThisMonth: 0,
      growthRate: 0,
    },
    customers: {
      total: 0,
      active: 0,
      inactive: 0,
      newThisMonth: 0,
      growthRate: 0,
      subscriptions: {
        active: 0,
        expired: 0,
        pending: 0,
      },
    },
    students: {
      total: 0,
      active: 0,
      inactive: 0,
      newThisMonth: 0,
      growthRate: 0,
      byGrade: [],
    },
    rfid: {
      totalTags: 0,
      activeTags: 0,
      inactiveTags: 0,
      assignedTags: 0,
      unassignedTags: 0,
      replacementTags: 0,
      averageTagAge: 0,
      tagsByStatus: {
        active: 0,
        inactive: 0,
        damaged: 0,
        lost: 0,
        pending: 0,
      },
    },
    buses: {
      total: 0,
      active: 0,
      inactive: 0,
      inService: 0,
      maintenance: 0,
      totalCapacity: 0,
      averageCapacity: 0,
    },
    routes: {
      total: 0,
      active: 0,
      inactive: 0,
      morningRoutes: 0,
      afternoonRoutes: 0,
    },
    drivers: {
      total: 0,
      active: 0,
      inactive: 0,
      licensed: 0,
      certified: 0,
    },
    minders: {
      total: 0,
      active: 0,
      inactive: 0,
      certified: 0,
    },
    parents: {
      total: 0,
      active: 0,
      inactive: 0,
      verified: 0,
      unverified: 0,
      newThisMonth: 0,
    },
  };

  const defaultTelemetrySummary: TelemetrySummary = {
    period: {
      from: dateRange.from?.toISOString() || new Date().toISOString(),
      to: dateRange.to?.toISOString() || new Date().toISOString(),
    },
    rfid: {
      totalAttempts: 0,
      successfulScans: 0,
      failures: 0,
      successRate: 0,
      averageScanTime: 0,
      peakHour: "00:00",
      totalDevices: 0,
      activeDevices: 0,
    },
    sms: {
      totalAttempts: 0,
      successfulDeliveries: 0,
      failures: 0,
      successRate: 0,
      averageDeliveryTime: 0,
      peakHour: "00:00",
      providers: [],
    },
    trips: {
      totalTrips: 0,
      completedTrips: 0,
      inProgressTrips: 0,
      cancelledTrips: 0,
      averageDuration: 0,
      totalStudentsTracked: 0,
      totalDistance: 0,
    },
    system: {
      uptime: 0,
      averageResponseTime: 0,
      apiErrors: 0,
      databaseQueries: 0,
      cacheHitRate: 0,
    },
  };

  // Transform daily statistics from API to time series format, or generate empty data if no API data yet
  const timeSeriesData = dailyStats.length > 0
    ? dailyStats.map(stat => ({
        date: format(new Date(stat.date), 'MMM dd'),
        fullDate: stat.date,
        rfidFailures: stat.rfid.failures,
        rfidAttempts: stat.rfid.attempts,
        rfidSuccesses: stat.rfid.successes,
        smsFailures: stat.sms.failures,
        smsAttempts: stat.sms.attempts,
        smsSuccesses: stat.sms.successes,
        totalFailures: stat.rfid.failures + stat.sms.failures,
        tripsCompleted: stat.trips.completed,
        tripsScheduled: stat.trips.scheduled,
      }))
    : (dateRange.from && dateRange.to ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to }).map(day => ({
        date: format(day, 'MMM dd'),
        fullDate: format(day, 'yyyy-MM-dd'),
        rfidFailures: 0,
        rfidAttempts: 0,
        rfidSuccesses: 0,
        smsFailures: 0,
        smsAttempts: 0,
        smsSuccesses: 0,
        totalFailures: 0,
        tripsCompleted: 0,
        tripsScheduled: 0,
      })) : []);

  // Use API data only - show loading or empty states if not available
  const displayDevicePerformance = devicePerformance;
  const displayRoutePerformance = routePerformance;
  const displaySystemSummary = systemSummary || defaultSystemSummary;
  const displayTelemetrySummary = telemetrySummary || defaultTelemetrySummary;
  
  // Calculate analytics metrics from API data
  const totalRFIDFailures = filteredRFIDFailures.length;
  const totalSMSFailures = filteredSMSFailures.length;
  const totalFailures = totalRFIDFailures + totalSMSFailures;
  
  // Update telemetry summary with actual filtered failures
  const rfidFailuresCount = displayTelemetrySummary.rfid.failures || totalRFIDFailures;
  const smsFailuresCount = displayTelemetrySummary.sms.failures || totalSMSFailures;
  
  // Calculate success rates with proper handling for zero values
  const rfidSuccessRate = displayTelemetrySummary.rfid.totalAttempts > 0
    ? displayTelemetrySummary.rfid.successRate.toFixed(1)
    : "0.0";
  const smsSuccessRate = displayTelemetrySummary.sms.totalAttempts > 0
    ? displayTelemetrySummary.sms.successRate.toFixed(1)
    : "0.0";
  const totalAttempts = displayTelemetrySummary.rfid.totalAttempts + displayTelemetrySummary.sms.totalAttempts;
  const totalSuccesses = displayTelemetrySummary.rfid.successfulScans + displayTelemetrySummary.sms.successfulDeliveries;
  const overallSuccessRate = totalAttempts > 0
    ? ((totalSuccesses / totalAttempts) * 100).toFixed(1)
    : "0.0";

  // Calculate trends from previous period data (if available from API)
  const previousPeriodRFID = displayTelemetrySummary.previousPeriod?.rfid;
  const previousPeriodSMS = displayTelemetrySummary.previousPeriod?.sms;
  
  const rfidTrend = previousPeriodRFID && previousPeriodRFID.failures > 0
    ? (((rfidFailuresCount - previousPeriodRFID.failures) / previousPeriodRFID.failures) * 100).toFixed(1)
    : rfidFailuresCount > 0 ? '100' : '0';
  const smsTrend = previousPeriodSMS && previousPeriodSMS.failures > 0
    ? (((smsFailuresCount - previousPeriodSMS.failures) / previousPeriodSMS.failures) * 100).toFixed(1)
    : smsFailuresCount > 0 ? '100' : '0';

  // timeSeriesData is already defined above from dailyStats

  // Use failure reasons from API, or calculate from filtered failures
  const getRFIDFailureReasonData = () => {
    if (failureReasons.rfid.length > 0) {
      return failureReasons.rfid.map(r => ({
        name: r.name,
        value: r.value,
        label: r.name.length > 30 ? r.name.substring(0, 30) + '...' : r.name,
      }));
    }
    const reasons = filteredRFIDFailures.reduce((acc, failure) => {
      acc[failure.failureReason] = (acc[failure.failureReason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(reasons).map(([reason, count]) => ({
      name: reason,
      value: count,
      label: reason.length > 30 ? reason.substring(0, 30) + '...' : reason,
    }));
  };

  const getSMSFailureReasonData = () => {
    if (failureReasons.sms.length > 0) {
      return failureReasons.sms.map(r => ({
        name: r.name,
        value: r.value,
        label: r.name.length > 30 ? r.name.substring(0, 30) + '...' : r.name,
      }));
    }
    const reasons = filteredSMSFailures.reduce((acc, failure) => {
      acc[failure.failureReason] = (acc[failure.failureReason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(reasons).map(([reason, count]) => ({
      name: reason,
      value: count,
      label: reason.length > 30 ? reason.substring(0, 30) + '...' : reason,
    }));
  };

  const rfidFailureReasonData = getRFIDFailureReasonData();
  const smsFailureReasonData = getSMSFailureReasonData();

  // Device/Bus breakdown - Use API device performance data
  const deviceBreakdown = filteredRFIDFailures.reduce((acc, failure) => {
    acc[failure.deviceId] = (acc[failure.deviceId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Enhanced device breakdown with API performance data
  const deviceBreakdownData = displayDevicePerformance.map(device => ({
    device: device.deviceId,
    bus: device.busRegistration,
    failures: deviceBreakdown[device.deviceId] || device.failures || 0,
    totalScans: device.totalScans,
    successRate: device.successRate,
    lastActive: device.lastActive,
  })).sort((a, b) => b.failures - a.failures);

  // Chart configurations
  const chartConfig = {
    rfidFailures: {
      label: "RFID Failures",
      color: "hsl(var(--chart-1))",
    },
    smsFailures: {
      label: "SMS Failures",
      color: "hsl(var(--chart-2))",
    },
    totalFailures: {
      label: "Total Failures",
      color: "hsl(var(--chart-3))",
    },
  };

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <TooltipProvider>
      <Layout>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              System Telemetry
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Monitor system failures and performance issues</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error loading data</p>
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-start md:items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center w-full md:w-auto">
              <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              {timeRange === "custom" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:min-w-[240px] justify-start text-left font-normal text-xs sm:text-sm">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={{
                        from: dateRange.from,
                        to: dateRange.to
                      }}
                      onSelect={(range) => setDateRange(range as DateRange)}
                      numberOfMonths={window.innerWidth < 640 ? 1 : 2}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search..."
                  className="pl-8 w-full md:w-[240px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <Tabs defaultValue="analytics" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full md:w-[600px] grid-cols-3">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="rfid" className="flex items-center gap-2">
                <Radio className="h-4 w-4" />
                RFID Failures
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS Failures
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="mt-6 space-y-6">
              {/* Loading State for System Summary */}
              {loadingSystemSummary ? (
                <Card>
                  <CardContent className="py-12">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                      <p className="text-sm text-gray-600">Loading system summary...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  {/* System-Wide Overview Metrics - Only show if data is available */}
                  {systemSummary && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      System-Wide Overview
                    </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Schools</CardTitle>
                      <Building className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{displaySystemSummary.schools.total}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-green-600">{displaySystemSummary.schools.active} active</span>
                        {displaySystemSummary.schools.newThisMonth > 0 && (
                          <span className="ml-2 text-blue-600">+{displaySystemSummary.schools.newThisMonth} this month</span>
                        )}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {displaySystemSummary.schools.growthRate > 0 ? (
                          <><TrendingUp className="h-3 w-3 text-green-600" /><span className="text-xs text-green-600">+{displaySystemSummary.schools.growthRate}% growth</span></>
                        ) : (
                          <><TrendingDown className="h-3 w-3 text-red-600" /><span className="text-xs text-red-600">{displaySystemSummary.schools.growthRate}%</span></>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Customers</CardTitle>
                      <User className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{displaySystemSummary.customers.total}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-green-600">{displaySystemSummary.customers.active} active</span>
                        <span className="ml-2">{displaySystemSummary.customers.subscriptions.active} subscriptions</span>
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {displaySystemSummary.customers.growthRate > 0 ? (
                          <><TrendingUp className="h-3 w-3 text-green-600" /><span className="text-xs text-green-600">+{displaySystemSummary.customers.growthRate}% growth</span></>
                        ) : (
                          <><TrendingDown className="h-3 w-3 text-red-600" /><span className="text-xs text-red-600">{displaySystemSummary.customers.growthRate}%</span></>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                      <User className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{displaySystemSummary.students.total.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-green-600">{displaySystemSummary.students.active.toLocaleString()} active</span>
                        {displaySystemSummary.students.newThisMonth > 0 && (
                          <span className="ml-2 text-blue-600">+{displaySystemSummary.students.newThisMonth} this month</span>
                        )}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {displaySystemSummary.students.growthRate > 0 ? (
                          <><TrendingUp className="h-3 w-3 text-green-600" /><span className="text-xs text-green-600">+{displaySystemSummary.students.growthRate}% growth</span></>
                        ) : (
                          <><TrendingDown className="h-3 w-3 text-red-600" /><span className="text-xs text-red-600">{displaySystemSummary.students.growthRate}%</span></>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active RFID Tags</CardTitle>
                      <Radio className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{displaySystemSummary.rfid.activeTags.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span>{displaySystemSummary.rfid.totalTags.toLocaleString()} total</span>
                        <span className="ml-2 text-green-600">{displaySystemSummary.rfid.assignedTags.toLocaleString()} assigned</span>
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {displaySystemSummary.rfid.totalTags > 0 
                            ? `${((displaySystemSummary.rfid.activeTags / displaySystemSummary.rfid.totalTags) * 100).toFixed(1)}% utilization`
                            : "No tags available"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Secondary Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Buses</CardTitle>
                      <Activity className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{displaySystemSummary.buses.total}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-green-600">{displaySystemSummary.buses.inService} in service</span>
                        <span className="ml-2">{displaySystemSummary.buses.maintenance} in maintenance</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total capacity: {displaySystemSummary.buses.totalCapacity.toLocaleString()} seats
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Routes</CardTitle>
                      <MapPin className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{displaySystemSummary.routes.total}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-green-600">{displaySystemSummary.routes.active} active</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {displaySystemSummary.routes.morningRoutes} morning • {displaySystemSummary.routes.afternoonRoutes} afternoon
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Parents</CardTitle>
                      <User className="h-4 w-4 text-cyan-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{displaySystemSummary.parents.total.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-green-600">{displaySystemSummary.parents.active.toLocaleString()} active</span>
                        <span className="ml-2">{displaySystemSummary.parents.verified.toLocaleString()} verified</span>
                      </p>
                      {displaySystemSummary.parents.newThisMonth > 0 && (
                        <p className="text-xs text-blue-600 mt-1">
                          +{displaySystemSummary.parents.newThisMonth} new this month
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Staff</CardTitle>
                      <User className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{displaySystemSummary.drivers.active + displaySystemSummary.minders.active}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {displaySystemSummary.drivers.active} drivers • {displaySystemSummary.minders.active} minders
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {displaySystemSummary.drivers.certified} certified drivers • {displaySystemSummary.minders.certified} certified minders
                      </p>
                    </CardContent>
                  </Card>
                </div>
                </div>
                  )}

                  {/* RFID Tags Breakdown */}
                  {systemSummary && (
                  <Card>
                    <CardHeader>
                      <CardTitle>RFID Tags Status Breakdown</CardTitle>
                      <CardDescription>Detailed breakdown of RFID tag statuses across the system</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.entries(displaySystemSummary.rfid.tagsByStatus).length > 0 ? (
                          Object.entries(displaySystemSummary.rfid.tagsByStatus).map(([status, count]) => (
                            <div key={status} className="text-center p-4 border rounded-lg">
                              <div className="text-2xl font-bold">{count.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground mt-1 capitalize">{status}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {displaySystemSummary.rfid.totalTags > 0 
                                  ? `${((count / displaySystemSummary.rfid.totalTags) * 100).toFixed(1)}%`
                                  : "0%"}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-5 text-center py-8 text-gray-500">
                            <Radio className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p>No RFID tag status data available</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Total Tags:</span>
                            <span className="ml-2 font-semibold">{displaySystemSummary.rfid.totalTags.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Average Tag Age:</span>
                            <span className="ml-2 font-semibold">{displaySystemSummary.rfid.averageTagAge} months</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tags Replaced This Month:</span>
                            <span className="ml-2 font-semibold text-orange-600">{displaySystemSummary.rfid.replacementTags}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  )}

                  {/* Students by Grade Breakdown */}
                  {systemSummary && (
                  <Card>
                  <CardHeader>
                    <CardTitle>Students Distribution by Grade</CardTitle>
                    <CardDescription>Number of students across different grade levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {displaySystemSummary.students.byGrade && displaySystemSummary.students.byGrade.length > 0 ? (
                      <>
                        <ChartContainer config={chartConfig} className="h-[300px]">
                          <BarChart data={displaySystemSummary.students.byGrade}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="grade" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ChartContainer>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                          {displaySystemSummary.students.byGrade.map((grade) => (
                            <div key={grade.grade} className="text-center p-3 border rounded-lg">
                              <div className="text-lg font-bold">{grade.count.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground mt-1">{grade.grade}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {displaySystemSummary.students.total > 0 
                                  ? `${((grade.count / displaySystemSummary.students.total) * 100).toFixed(1)}%`
                                  : "0%"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <User className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                          <p>No student distribution data available</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                  )}

                  {/* Performance Metrics */}
                  {loadingTelemetry ? (
                    <Card>
                      <CardContent className="py-12">
                        <div className="flex flex-col items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                          <p className="text-sm text-gray-600">Loading telemetry data...</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {telemetrySummary ? (
                        <div>
                          <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                              <Activity className="h-5 w-5 text-green-600" />
                              Performance Metrics
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                              <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Total Failures</CardTitle>
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">{totalFailures}</div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {totalRFIDFailures} RFID + {totalSMSFailures} SMS
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Overall Success Rate</CardTitle>
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">{overallSuccessRate}%</div>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                {parseFloat(overallSuccessRate) >= 95 ? (
                                  <><TrendingUp className="h-3 w-3 text-green-600" /> Excellent</>
                                ) : parseFloat(overallSuccessRate) >= 90 ? (
                                  <><TrendingUp className="h-3 w-3 text-yellow-600" /> Good</>
                                ) : (
                                  <><TrendingDown className="h-3 w-3 text-red-600" /> Needs attention</>
                                )}
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">RFID Success Rate</CardTitle>
                              <Radio className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">{rfidSuccessRate}%</div>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                {parseFloat(rfidTrend) > 0 ? (
                                  <><TrendingUp className="h-3 w-3 text-red-600" /> +{rfidTrend}% vs previous</>
                                ) : (
                                  <><TrendingDown className="h-3 w-3 text-green-600" /> {rfidTrend}% vs previous</>
                                )}
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">SMS Success Rate</CardTitle>
                              <MessageSquare className="h-4 w-4 text-orange-600" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">{smsSuccessRate}%</div>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                {parseFloat(smsTrend) > 0 ? (
                                  <><TrendingUp className="h-3 w-3 text-red-600" /> +{smsTrend}% vs previous</>
                                ) : (
                                  <><TrendingDown className="h-3 w-3 text-green-600" /> {smsTrend}% vs previous</>
                                )}
                              </p>
                            </CardContent>
                          </Card>
                            </div>
                          </div>

                          {/* Charts Row 1: Time Series */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Failures Over Time</CardTitle>
                            <CardDescription>Daily breakdown of failures in the selected period</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ChartContainer config={chartConfig} className="h-[300px]">
                              <AreaChart data={timeSeriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Area yAxisId="left" type="monotone" dataKey="rfidFailures" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="RFID Failures" />
                                <Area yAxisId="left" type="monotone" dataKey="smsFailures" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} name="SMS Failures" />
                                <Area yAxisId="right" type="monotone" dataKey="tripsCompleted" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Trips Completed" />
                              </AreaChart>
                            </ChartContainer>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Failure Trends</CardTitle>
                            <CardDescription>Line chart showing failure patterns</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ChartContainer config={chartConfig} className="h-[300px]">
                              <LineChart data={timeSeriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Line type="monotone" dataKey="rfidFailures" stroke="#ef4444" strokeWidth={2} name="RFID Failures" />
                                <Line type="monotone" dataKey="smsFailures" stroke="#f97316" strokeWidth={2} name="SMS Failures" />
                                <Line type="monotone" dataKey="totalFailures" stroke="#3b82f6" strokeWidth={2} name="Total Failures" />
                              </LineChart>
                            </ChartContainer>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Charts Row 2: Breakdowns */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>RFID Failure Reasons</CardTitle>
                            <CardDescription>Breakdown by failure type</CardDescription>
                          </CardHeader>
                          <CardContent>
                            {rfidFailureReasonData.length > 0 ? (
                              <ChartContainer config={chartConfig} className="h-[300px]">
                                <RechartsPieChart>
                                  <Pie
                                    data={rfidFailureReasonData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    {rfidFailureReasonData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <ChartTooltip content={<ChartTooltipContent />} />
                                </RechartsPieChart>
                              </ChartContainer>
                            ) : (
                              <div className="h-[300px] flex items-center justify-center text-gray-500">
                                No RFID failures in selected period
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>SMS Failure Reasons</CardTitle>
                            <CardDescription>Breakdown by failure type</CardDescription>
                          </CardHeader>
                          <CardContent>
                            {smsFailureReasonData.length > 0 ? (
                              <ChartContainer config={chartConfig} className="h-[300px]">
                                <RechartsPieChart>
                                  <Pie
                                    data={smsFailureReasonData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    {smsFailureReasonData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <ChartTooltip content={<ChartTooltipContent />} />
                                </RechartsPieChart>
                              </ChartContainer>
                            ) : (
                              <div className="h-[300px] flex items-center justify-center text-gray-500">
                                No SMS failures in selected period
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      {/* Charts Row 3: Device Breakdown */}
                      <Card>
                        <CardHeader>
                          <CardTitle>RFID Device Performance</CardTitle>
                          <CardDescription>Failures and success rates by device</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {deviceBreakdownData.length > 0 ? (
                            <ChartContainer config={chartConfig} className="h-[300px]">
                              <BarChart data={deviceBreakdownData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                  dataKey="device" 
                                  angle={-45}
                                  textAnchor="end"
                                  height={80}
                                  tick={{ fontSize: 12 }}
                                />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <ChartTooltip 
                                  content={<ChartTooltipContent />}
                                  formatter={(value: number, name: string) => {
                                    if (name === "successRate") return `${value}%`;
                                    return value;
                                  }}
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar yAxisId="left" dataKey="failures" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failures" />
                                <Bar yAxisId="right" dataKey="successRate" fill="#22c55e" radius={[4, 4, 0, 0]} name="Success Rate %" />
                              </BarChart>
                            </ChartContainer>
                          ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-500">
                              No device failure data in selected period
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Additional Metrics Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
                            <Smartphone className="h-4 w-4 text-blue-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{displayTelemetrySummary.rfid.activeDevices}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              of {displayTelemetrySummary.rfid.totalDevices} total RFID readers
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                            <Server className="h-4 w-4 text-green-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{displayTelemetrySummary.system.uptime}%</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Avg response: {displayTelemetrySummary.system.averageResponseTime}ms
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Trips Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-purple-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{displayTelemetrySummary.trips.completedTrips}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              of {displayTelemetrySummary.trips.totalTrips} scheduled
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Students Tracked</CardTitle>
                            <User className="h-4 w-4 text-orange-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{displayTelemetrySummary.trips.totalStudentsTracked}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Across all routes
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Route Performance Table */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Route Performance</CardTitle>
                          <CardDescription>Performance metrics by route for the selected period</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {displayRoutePerformance.length > 0 ? (
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Route</TableHead>
                                    <TableHead className="text-right">Trips</TableHead>
                                    <TableHead className="text-right">Avg Duration</TableHead>
                                    <TableHead className="text-right">On-Time Rate</TableHead>
                                    <TableHead className="text-right">Students Served</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {displayRoutePerformance.map((route) => (
                                    <TableRow key={route.routeId}>
                                      <TableCell className="font-medium">{route.routeName}</TableCell>
                                      <TableCell className="text-right">{route.trips}</TableCell>
                                      <TableCell className="text-right">{route.avgDuration} min</TableCell>
                                      <TableCell className="text-right">
                                        <Badge variant={route.onTimeRate >= 95 ? "default" : route.onTimeRate >= 90 ? "secondary" : "destructive"}>
                                          {route.onTimeRate}%
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-right">{route.studentsServed}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                              <p>No route performance data available for the selected period.</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Device Performance Table */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Device Performance</CardTitle>
                          <CardDescription>RFID reader performance metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {deviceBreakdownData.length > 0 ? (
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Device ID</TableHead>
                                    <TableHead>Bus Registration</TableHead>
                                    <TableHead className="text-right">Total Scans</TableHead>
                                    <TableHead className="text-right">Failures</TableHead>
                                    <TableHead className="text-right">Success Rate</TableHead>
                                    <TableHead>Last Active</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {deviceBreakdownData.map((device) => (
                                    <TableRow key={device.device}>
                                      <TableCell className="font-medium font-mono text-xs">{device.device}</TableCell>
                                      <TableCell>{device.bus}</TableCell>
                                      <TableCell className="text-right">{device.totalScans}</TableCell>
                                      <TableCell className="text-right">
                                        <Badge variant={device.failures === 0 ? "default" : device.failures <= 2 ? "secondary" : "destructive"}>
                                          {device.failures}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Badge variant={device.successRate >= 98 ? "default" : device.successRate >= 95 ? "secondary" : "destructive"}>
                                          {device.successRate}%
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-sm text-muted-foreground">
                                        {format(new Date(device.lastActive), "MMM dd, HH:mm")}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Smartphone className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                              <p>No device performance data available for the selected period.</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              )}

            </TabsContent>
            
            <TabsContent value="rfid" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-red-600" />
                    RFID Scan Failures
                  </CardTitle>
                  <CardDescription>
                    {loadingFailures ? (
                      "Loading failures..."
                    ) : (
                      `${filteredRFIDFailures.length} failures detected in the selected time period`
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingFailures ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : Object.entries(groupedRFIDFailures).length > 0 ? (
                    Object.entries(groupedRFIDFailures)
                      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                      .map(([date, failures]) => (
                        <div key={date} className="mb-8">
                          <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                            {format(new Date(date), "EEEE, MMMM d, yyyy")}
                            <Badge variant="outline" className="ml-2">
                              {failures.length} {failures.length === 1 ? "failure" : "failures"}
                            </Badge>
                            {isSameDay(new Date(date), new Date()) && (
                              <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Today</Badge>
                            )}
                          </h3>
                          <div className="hidden md:block overflow-x-auto -mx-2 sm:mx-0">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs sm:text-sm">Time</TableHead>
                                  <TableHead className="text-xs sm:text-sm">Device ID</TableHead>
                                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">App Version</TableHead>
                                  <TableHead className="text-xs sm:text-sm">Bus Reg. No.</TableHead>
                                  <TableHead className="text-xs sm:text-sm">RFID Tag</TableHead>
                                  <TableHead className="text-xs sm:text-sm">Student Name</TableHead>
                                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Minder</TableHead>
                                  <TableHead className="text-xs sm:text-sm">Failure Reason</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {failures.map((failure) => (
                                  <TableRow key={failure.id}>
                                    <TableCell className="text-xs sm:text-sm whitespace-nowrap">{format(failure.failureTime, "h:mm a")}</TableCell>
                                    <TableCell className="text-xs sm:text-sm">{failure.deviceId}</TableCell>
                                    <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{failure.appVersion}</TableCell>
                                    <TableCell className="text-xs sm:text-sm">{failure.busRegistration}</TableCell>
                                    <TableCell>
                                      <code className="text-xs bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                        {failure.rfidTagId}
                                      </code>
                                    </TableCell>
                                    <TableCell>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                                            {failure.student.name}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="p-4 max-w-sm">
                                          <div className="flex items-start gap-3">
                                            <Avatar className="w-16 h-16">
                                              <AvatarImage src={failure.student.photo} alt={failure.student.name} />
                                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                                <User className="w-8 h-8" />
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                              <h4 className="font-semibold text-lg">{failure.student.name}</h4>
                                              <p className="text-sm text-gray-600">
                                                <strong>Date of Birth:</strong> {format(new Date(failure.student.dateOfBirth), "MMM dd, yyyy")}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                <strong>Age:</strong> {calculateAge(failure.student.dateOfBirth)} years old
                                              </p>
                                            </div>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm hidden md:table-cell">{failure.minderName}</TableCell>
                                    <TableCell>
                                      <Badge variant="destructive" className="font-normal text-xs">
                                        {failure.failureReason}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          {/* Mobile Card View */}
                          <div className="md:hidden space-y-3">
                            {failures.map((failure) => (
                              <Card key={failure.id}>
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-xs font-medium text-gray-500">Time</div>
                                        <div className="text-sm font-medium text-gray-900">{format(failure.failureTime, "h:mm a")}</div>
                                      </div>
                                      <Badge variant="destructive" className="font-normal text-xs">
                                        {failure.failureReason}
                                      </Badge>
                                    </div>
                                    <div className="pt-2 border-t border-gray-100">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <div className="text-xs font-medium text-gray-500 mb-1">Device ID</div>
                                          <div className="text-sm text-gray-700">{failure.deviceId}</div>
                                        </div>
                                        <div>
                                          <div className="text-xs font-medium text-gray-500 mb-1">Bus Reg. No.</div>
                                          <div className="text-sm text-gray-700">{failure.busRegistration}</div>
                                        </div>
                                        <div className="col-span-2">
                                          <div className="text-xs font-medium text-gray-500 mb-1">RFID Tag</div>
                                          <code className="text-xs bg-gray-100 px-2 py-1 rounded block">{failure.rfidTagId}</code>
                                        </div>
                                        <div className="col-span-2">
                                          <div className="text-xs font-medium text-gray-500 mb-1">Student Name</div>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium text-sm">
                                                {failure.student.name}
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="p-4 max-w-sm">
                                              <div className="flex items-start gap-3">
                                                <Avatar className="w-16 h-16">
                                                  <AvatarImage src={failure.student.photo} alt={failure.student.name} />
                                                  <AvatarFallback className="bg-blue-100 text-blue-600">
                                                    <User className="w-8 h-8" />
                                                  </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                  <h4 className="font-semibold text-lg">{failure.student.name}</h4>
                                                  <p className="text-sm text-gray-600">
                                                    <strong>Date of Birth:</strong> {format(new Date(failure.student.dateOfBirth), "MMM dd, yyyy")}
                                                  </p>
                                                  <p className="text-sm text-gray-600">
                                                    <strong>Age:</strong> {calculateAge(failure.student.dateOfBirth)} years old
                                                  </p>
                                                </div>
                                              </div>
                                            </TooltipContent>
                                          </Tooltip>
                                        </div>
                                        <div>
                                          <div className="text-xs font-medium text-gray-500 mb-1">Minder</div>
                                          <div className="text-sm text-gray-700">{failure.minderName}</div>
                                        </div>
                                        <div>
                                          <div className="text-xs font-medium text-gray-500 mb-1">App Version</div>
                                          <div className="text-sm text-gray-700">{failure.appVersion}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Radio className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <p>No RFID scan failures found for the selected period.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sms" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-orange-600" />
                    SMS Delivery Failures
                  </CardTitle>
                  <CardDescription>
                    {loadingFailures ? (
                      "Loading failures..."
                    ) : (
                      `${filteredSMSFailures.length} failures detected in the selected time period`
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingFailures ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : Object.entries(groupedSmsFailures).length > 0 ? (
                    Object.entries(groupedSmsFailures)
                      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                      .map(([date, failures]) => (
                        <div key={date} className="mb-8">
                          <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                            {format(new Date(date), "EEEE, MMMM d, yyyy")}
                            <Badge variant="outline" className="ml-2">
                              {failures.length} {failures.length === 1 ? "failure" : "failures"}
                            </Badge>
                            {isSameDay(new Date(date), new Date()) && (
                              <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Today</Badge>
                            )}
                          </h3>
                          <div className="hidden md:block overflow-x-auto -mx-2 sm:mx-0">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs sm:text-sm">Time</TableHead>
                                  <TableHead className="text-xs sm:text-sm">Trip Number</TableHead>
                                  <TableHead className="text-xs sm:text-sm">Parent Name</TableHead>
                                  <TableHead className="text-xs sm:text-sm">Phone Number</TableHead>
                                  <TableHead className="text-xs sm:text-sm">Failure Reason</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {failures.map((failure) => (
                                  <TableRow key={failure.id}>
                                    <TableCell className="text-xs sm:text-sm whitespace-nowrap">{format(failure.failureTime, "h:mm a")}</TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                                            {failure.tripNumber}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="p-4 max-w-md">
                                          <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                              <MapPin className="w-4 h-4 text-blue-600" />
                                              <h4 className="font-semibold text-lg">{failure.trip.number}</h4>
                                            </div>
                                            <div className="space-y-2">
                                              <p className="text-sm">
                                                <strong>Route:</strong> {failure.trip.route}
                                              </p>
                                              <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm">
                                                  {failure.trip.startTime} - {failure.trip.endTime}
                                                </span>
                                              </div>
                                              <p className="text-sm">
                                                <strong>Driver:</strong> {failure.trip.driver}
                                              </p>
                                              <p className="text-sm">
                                                <strong>Bus:</strong> {failure.trip.busRegistration}
                                              </p>
                                              <div className="flex items-center gap-2">
                                                <span className="text-sm"><strong>Status:</strong></span>
                                                <Badge className={getStatusColor(failure.trip.status)}>
                                                  {failure.trip.status}
                                                </Badge>
                                              </div>
                                            </div>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">{failure.parentName}</TableCell>
                                    <TableCell className="text-xs sm:text-sm">{failure.phoneNumber}</TableCell>
                                    <TableCell>
                                      <Badge variant="destructive" className="font-normal text-xs">
                                        {failure.failureReason}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          {/* Mobile Card View */}
                          <div className="md:hidden space-y-3">
                            {failures.map((failure) => (
                              <Card key={failure.id}>
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-xs font-medium text-gray-500">Time</div>
                                        <div className="text-sm font-medium text-gray-900">{format(failure.failureTime, "h:mm a")}</div>
                                      </div>
                                      <Badge variant="destructive" className="font-normal text-xs">
                                        {failure.failureReason}
                                      </Badge>
                                    </div>
                                    <div className="pt-2 border-t border-gray-100">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <div className="text-xs font-medium text-gray-500 mb-1">Trip Number</div>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium text-sm">
                                                {failure.tripNumber}
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="p-4 max-w-md">
                                              <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                  <MapPin className="w-4 h-4 text-blue-600" />
                                                  <h4 className="font-semibold text-lg">{failure.trip.number}</h4>
                                                </div>
                                                <div className="space-y-2">
                                                  <p className="text-sm">
                                                    <strong>Route:</strong> {failure.trip.route}
                                                  </p>
                                                  <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm">
                                                      {failure.trip.startTime} - {failure.trip.endTime}
                                                    </span>
                                                  </div>
                                                  <p className="text-sm">
                                                    <strong>Driver:</strong> {failure.trip.driver}
                                                  </p>
                                                  <p className="text-sm">
                                                    <strong>Bus:</strong> {failure.trip.busRegistration}
                                                  </p>
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-sm"><strong>Status:</strong></span>
                                                    <Badge className={getStatusColor(failure.trip.status)}>
                                                      {failure.trip.status}
                                                    </Badge>
                                                  </div>
                                                </div>
                                              </div>
                                            </TooltipContent>
                                          </Tooltip>
                                        </div>
                                        <div>
                                          <div className="text-xs font-medium text-gray-500 mb-1">Parent Name</div>
                                          <div className="text-sm text-gray-700">{failure.parentName}</div>
                                        </div>
                                        <div className="col-span-2">
                                          <div className="text-xs font-medium text-gray-500 mb-1">Phone Number</div>
                                          <div className="text-sm text-gray-700">{failure.phoneNumber}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <p>No SMS delivery failures found for the selected period.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </TooltipProvider>
  );
};

export default SystemTelemetry;
