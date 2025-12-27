// API service for RFID tracking
const API_BASE_URL = "http://localhost:3000";

export interface RFIDScanEvent {
  rfidTagId: string;
  studentId?: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
  };
  eventType: 'entry' | 'exit';
  routeId: string;
  busId: string;
  verified: boolean;
}

export interface RFIDScanResponse {
  success: boolean;
  data: {
    studentId: string;
    studentName: string;
    admissionNumber: string;
    eventType: 'entry' | 'exit';
    timestamp: Date;
    location: {
      latitude: number;
      longitude: number;
    };
    isExpected: boolean;
    message: string;
  };
}

export interface StudentRFIDTag {
  studentId: string;
  rfidTagId: string;
  assignedAt: string;
  isActive: boolean;
  lastScannedAt?: string;
}

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

// Mock data for RFID tags and students
const mockRFIDStudentMap: Record<string, { studentId: string; studentName: string; admissionNumber: string }> = {
  "RFID-001-ABC123": { studentId: "student-001", studentName: "Kevin Mwangi", admissionNumber: "STUD001" },
  "RFID-002-XYZ789": { studentId: "student-002", studentName: "Diana Achieng", admissionNumber: "STUD002" },
  "RFID-003-DEF456": { studentId: "student-003", studentName: "Brian Otieno", admissionNumber: "STUD003" },
  "RFID-004-GHI789": { studentId: "student-004", studentName: "Irene Wanjiku", admissionNumber: "STUD004" },
  "RFID-005-JKL012": { studentId: "student-005", studentName: "Michael Kimani", admissionNumber: "STUD005" },
};

// Scan RFID tag and process entry/exit
export const scanRFIDTag = async (
  rfidTagId: string,
  routeId: string,
  busId: string,
  location: { latitude: number; longitude: number },
  eventType: 'entry' | 'exit'
): Promise<RFIDScanResponse> => {
  // Mock implementation - in production, this would call the actual API
  const mockStudent = mockRFIDStudentMap[rfidTagId.toUpperCase()];
  
  if (mockStudent) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        studentId: mockStudent.studentId,
        studentName: mockStudent.studentName,
        admissionNumber: mockStudent.admissionNumber,
        eventType,
        timestamp: new Date(),
        location,
        isExpected: true,
        message: `${eventType === 'entry' ? 'Entry' : 'Exit'} recorded successfully`,
      },
    };
  }

  // Tag not found
  throw new Error("RFID tag not recognized");
};

// Get student by RFID tag ID
export const getStudentByRFIDTag = async (
  rfidTagId: string
): Promise<{ success: boolean; data: StudentRFIDTag }> => {
  // Mock implementation
  const mockStudent = mockRFIDStudentMap[rfidTagId.toUpperCase()];
  
  if (mockStudent) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: {
        studentId: mockStudent.studentId,
        rfidTagId: rfidTagId.toUpperCase(),
        assignedAt: new Date().toISOString(),
        isActive: true,
        lastScannedAt: new Date().toISOString(),
      },
    };
  }

  throw new Error("RFID tag not found");
};

// Assign RFID tag to student
export const assignRFIDTagToStudent = async (
  studentId: string,
  rfidTagId: string
): Promise<{ success: boolean; data: StudentRFIDTag }> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Add to mock map
  mockRFIDStudentMap[rfidTagId.toUpperCase()] = {
    studentId,
    studentName: "Student Name", // Would come from API
    admissionNumber: "STUDXXX", // Would come from API
  };
  
  return {
    success: true,
    data: {
      studentId,
      rfidTagId: rfidTagId.toUpperCase(),
      assignedAt: new Date().toISOString(),
      isActive: true,
    },
  };
};

// Get RFID scan history for a route
export const getRFIDScanHistory = async (
  routeId: string,
  date?: string
): Promise<{
  success: boolean;
  data: RFIDScanEvent[];
}> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mockEvents: RFIDScanEvent[] = [
    {
      rfidTagId: "RFID-001-ABC123",
      studentId: "student-001",
      timestamp: new Date(new Date().setHours(8, 30, 0)),
      location: { latitude: -1.2921, longitude: 36.8219 },
      eventType: "entry",
      routeId,
      busId: "bus-001",
      verified: true,
    },
    {
      rfidTagId: "RFID-002-XYZ789",
      studentId: "student-002",
      timestamp: new Date(new Date().setHours(8, 35, 0)),
      location: { latitude: -1.2930, longitude: 36.8220 },
      eventType: "entry",
      routeId,
      busId: "bus-001",
      verified: true,
    },
    {
      rfidTagId: "RFID-001-ABC123",
      studentId: "student-001",
      timestamp: new Date(new Date().setHours(16, 15, 0)),
      location: { latitude: -1.2921, longitude: 36.8219 },
      eventType: "exit",
      routeId,
      busId: "bus-001",
      verified: true,
    },
  ];

  return {
    success: true,
    data: mockEvents,
  };
};

// Get real-time RFID events (WebSocket or polling)
export const subscribeToRFIDEvents = (
  routeId: string,
  callback: (event: RFIDScanEvent) => void
): (() => void) => {
  // For now, implement polling. In production, use WebSocket
  const interval = setInterval(async () => {
    try {
      const response = await getRFIDScanHistory(routeId);
      if (response.success && response.data.length > 0) {
        response.data.forEach((event) => callback(event));
      }
    } catch (error) {
      console.error("Error fetching RFID events:", error);
    }
  }, 5000); // Poll every 5 seconds

  return () => clearInterval(interval);
};

