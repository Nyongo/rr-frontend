// RFID Service for mobile app
import { scanRFIDTag, getStudentByRFIDTag, RFIDScanResponse } from "@/services/rfidApi";

export interface RFIDScanResult {
  success: boolean;
  studentId?: string;
  studentName?: string;
  admissionNumber?: string;
  eventType: 'entry' | 'exit';
  isExpected: boolean;
  message: string;
  timestamp: Date;
}

// Simulate RFID scanner hardware integration
export class RFIDScannerService {
  private isScanning = false;
  private scanListeners: Array<(tagId: string) => void> = [];

  // Start listening for RFID tags
  startScanning(onTagDetected: (tagId: string) => void): void {
    if (this.isScanning) {
      console.warn("RFID scanner is already scanning");
      return;
    }

    this.isScanning = true;
    this.scanListeners.push(onTagDetected);

    // Simulate RFID tag detection
    // In production, this would connect to actual RFID hardware
    console.log("RFID Scanner: Started scanning...");
  }

  // Stop listening for RFID tags
  stopScanning(): void {
    this.isScanning = false;
    this.scanListeners = [];
    console.log("RFID Scanner: Stopped scanning");
  }

  // Simulate manual tag scan (for testing or manual entry)
  simulateTagScan(tagId: string): void {
    if (this.isScanning) {
      this.scanListeners.forEach((listener) => listener(tagId));
    }
  }

  // Process RFID tag scan
  async processRFIDScan(
    rfidTagId: string,
    routeId: string,
    busId: string,
    location: { latitude: number; longitude: number },
    eventType: 'entry' | 'exit'
  ): Promise<RFIDScanResult> {
    try {
      const response = await scanRFIDTag(
        rfidTagId,
        routeId,
        busId,
        location,
        eventType
      );

      if (response.success) {
        return {
          success: true,
          studentId: response.data.studentId,
          studentName: response.data.studentName,
          admissionNumber: response.data.admissionNumber,
          eventType: response.data.eventType,
          isExpected: response.data.isExpected,
          message: response.data.message,
          timestamp: new Date(response.data.timestamp),
        };
      }

      return {
        success: false,
        eventType,
        isExpected: false,
        message: "RFID tag not recognized",
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("RFID scan error:", error);
      return {
        success: false,
        eventType,
        isExpected: false,
        message: error instanceof Error ? error.message : "Scan failed",
        timestamp: new Date(),
      };
    }
  }

  // Get student information by RFID tag
  async getStudentByTag(rfidTagId: string) {
    try {
      const response = await getStudentByRFIDTag(rfidTagId);
      return response.data;
    } catch (error) {
      console.error("Error fetching student by RFID tag:", error);
      return null;
    }
  }
}

// Singleton instance
export const rfidScanner = new RFIDScannerService();

