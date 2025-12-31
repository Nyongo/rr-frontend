
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
import { format, subDays, subMonths, subWeeks, startOfQuarter, subYears, isSameDay } from "date-fns";
import { Activity, Radio, MessageSquare, Calendar as CalendarIcon, Search, X, User, MapPin, Clock } from "lucide-react";

// Mock RFID scan failures data
const mockRFIDFailures = [
  {
    id: 1,
    deviceId: "RFID-Reader-001",
    appVersion: "2.4.0",
    busRegistration: "KBU 253J",
    rfidTagId: "RFID-001-ABC123",
    student: {
      name: "Kevin Mwangi",
      photo: "/placeholder.svg",
      dateOfBirth: "2010-03-15",
      age: 14
    },
    minderName: "Faith Wangari",
    failureTime: new Date(new Date().setHours(8, 30, 0, 0)),
    failureReason: "RFID tag not detected"
  },
  {
    id: 2,
    deviceId: "RFID-Reader-002",
    appVersion: "2.4.0",
    busRegistration: "KCK 187B",
    rfidTagId: "RFID-002-XYZ789",
    student: {
      name: "Diana Achieng",
      photo: "/placeholder.svg",
      dateOfBirth: "2009-07-22",
      age: 15
    },
    minderName: "Grace Muthoni",
    failureTime: new Date(new Date().setHours(16, 15, 0, 0)),
    failureReason: "RFID reader connection error"
  },
  {
    id: 3,
    deviceId: "RFID-Reader-003",
    appVersion: "2.4.0",
    busRegistration: "KDD 456Z",
    rfidTagId: "RFID-003-DEF456",
    student: {
      name: "Brian Otieno",
      photo: "/placeholder.svg",
      dateOfBirth: "2011-01-08",
      age: 13
    },
    minderName: "Esther Wambui",
    failureTime: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(7, 45, 0, 0)),
    failureReason: "RFID tag not assigned to student"
  },
  {
    id: 4,
    deviceId: "RFID-Reader-002",
    appVersion: "2.4.0",
    busRegistration: "KCK 187B",
    rfidTagId: "RFID-004-GHI789",
    student: {
      name: "Irene Wanjiku",
      photo: "/placeholder.svg",
      dateOfBirth: "2010-11-30",
      age: 13
    },
    minderName: "Grace Muthoni",
    failureTime: new Date(new Date().setHours(12, 45, 0, 0)),
    failureReason: "RFID reader malfunction"
  },
  {
    id: 5,
    deviceId: "RFID-Reader-004",
    appVersion: "2.4.0",
    busRegistration: "KBY 721M",
    rfidTagId: "RFID-005-JKL012",
    student: {
      name: "Michael Kimani",
      photo: "/placeholder.svg",
      dateOfBirth: "2009-09-12",
      age: 15
    },
    minderName: "Mercy Akinyi",
    failureTime: new Date(new Date(new Date().setDate(new Date().getDate() - 2)).setHours(15, 20, 0, 0)),
    failureReason: "RFID tag damaged or unreadable"
  }
];

// Mock SMS failures with current dates and trip numbers
const mockSMSFailures = [
  {
    id: 1,
    parentName: "Peter Mwangi",
    phoneNumber: "+254 712 345 678",
    tripNumber: "TR001",
    trip: {
      number: "TR001",
      route: "Westlands - Sunshine Elementary",
      startTime: "07:30 AM",
      endTime: "08:00 AM",
      status: "Completed",
      driver: "Joseph Kamau",
      busRegistration: "KBU 253J"
    },
    failureTime: new Date(new Date().setHours(8, 35, 0, 0)),
    failureReason: "Network timeout"
  },
  {
    id: 2,
    parentName: "Jane Achieng",
    phoneNumber: "+254 723 456 789",
    tripNumber: "TR002",
    trip: {
      number: "TR002",
      route: "Karen - Sunshine Elementary",
      startTime: "07:45 AM",
      endTime: "08:15 AM",
      status: "In Progress",
      driver: "Daniel Omondi",
      busRegistration: "KCK 187B"
    },
    failureTime: new Date(new Date().setHours(16, 20, 0, 0)),
    failureReason: "Invalid phone number"
  },
  {
    id: 3,
    parentName: "James Otieno",
    phoneNumber: "+254 734 567 890",
    tripNumber: "TR003",
    trip: {
      number: "TR003",
      route: "Kilimani - Sunshine Elementary",
      startTime: "08:00 AM",
      endTime: "08:30 AM",
      status: "Completed",
      driver: "Samuel Kipchoge",
      busRegistration: "KDD 456Z"
    },
    failureTime: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(7, 50, 0, 0)),
    failureReason: "SMS gateway error"
  },
  {
    id: 4,
    parentName: "Sarah Wanjiku",
    phoneNumber: "+254 745 678 901",
    tripNumber: "TR004",
    trip: {
      number: "TR004",
      route: "Langata - Sunshine Elementary",
      startTime: "07:15 AM",
      endTime: "07:45 AM",
      status: "Scheduled",
      driver: "George Njoroge",
      busRegistration: "KBY 721M"
    },
    failureTime: new Date(new Date().setHours(9, 15, 0, 0)),
    failureReason: "Message quota exceeded"
  },
  {
    id: 5,
    parentName: "David Kimani",
    phoneNumber: "+254 756 789 012",
    tripNumber: "TR005",
    trip: {
      number: "TR005",
      route: "Eastlands - Sunshine Elementary",
      startTime: "07:00 AM",
      endTime: "07:30 AM",
      status: "Cancelled",
      driver: "Peter Wanjiku",
      busRegistration: "KAA 890P"
    },
    failureTime: new Date(new Date(new Date().setDate(new Date().getDate() - 2)).setHours(14, 5, 0, 0)),
    failureReason: "Carrier blocked message"
  }
];

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type TimeRange = "day" | "week" | "month" | "quarter" | "year" | "custom";

const SystemTelemetry = () => {
  const [selectedTab, setSelectedTab] = useState<string>("rfid");
  const [dateRange, setDateRange] = useState<DateRange>({ from: subDays(new Date(), 7), to: new Date() });
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [rfidFailures, setRfidFailures] = useState(mockRFIDFailures);
  const [smsFailures, setSmsFailures] = useState(mockSMSFailures);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter data based on date range and search query
  const filteredRFIDFailures = rfidFailures.filter(failure => {
    const inDateRange = (!dateRange.from || failure.failureTime >= dateRange.from) && 
                        (!dateRange.to || failure.failureTime <= dateRange.to);
    
    const matchesSearch = searchQuery === "" || 
                          failure.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          failure.minderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          failure.busRegistration.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          failure.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (failure.rfidTagId && failure.rfidTagId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return inDateRange && matchesSearch;
  });

  const filteredSmsFailures = smsFailures.filter(failure => {
    const inDateRange = (!dateRange.from || failure.failureTime >= dateRange.from) && 
                        (!dateRange.to || failure.failureTime <= dateRange.to);
    
    const matchesSearch = searchQuery === "" || 
                          failure.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          failure.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          failure.phoneNumber.includes(searchQuery);
    
    return inDateRange && matchesSearch;
  });

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
  const groupedSmsFailures = groupByDay(filteredSmsFailures);

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

          <Tabs defaultValue="rfid" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="rfid" className="flex items-center gap-2">
                <Radio className="h-4 w-4" />
                RFID Failures
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS Failures
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="rfid" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-red-600" />
                    RFID Scan Failures
                  </CardTitle>
                  <CardDescription>
                    {filteredRFIDFailures.length} failures detected in the selected time period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.entries(groupedRFIDFailures).length > 0 ? (
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
                    {filteredSmsFailures.length} failures detected in the selected time period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.entries(groupedSmsFailures).length > 0 ? (
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
