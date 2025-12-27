
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Check, X, Radio, MapPin, Phone, User, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useActiveTrip } from "../hooks/useActiveTrip";
import { ActiveTripStudent } from "../types/activeTrip";
import { rfidScanner, RFIDScanResult } from "../services/rfidService";

type ScanState = 'ready' | 'scanning' | 'success' | 'failed' | 'unauthorized';

const ScanStudentScreen = () => {
  const navigate = useNavigate();
  const { activeTrip, updateStudentStatus } = useActiveTrip();
  const [scanState, setScanState] = useState<ScanState>('ready');
  const [scannedStudent, setScannedStudent] = useState<ActiveTripStudent | null>(null);
  const [scanResult, setScanResult] = useState<RFIDScanResult | null>(null);
  const [isAutoScanning, setIsAutoScanning] = useState(true);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pendingStudents = activeTrip?.students.filter(s => s.status === 'pending') || [];
  const nextStudent = pendingStudents[0];

  useEffect(() => {
    console.log('ScanStudentScreen: activeTrip state:', activeTrip?.id || 'null');
    if (!activeTrip) {
      console.log('ScanStudentScreen: No active trip, navigating to home');
      navigate('/minders-mobile/home');
      return;
    }
    
    // Set the next student immediately when component loads
    if (nextStudent) {
      setScannedStudent(nextStudent);
    }

    // Start RFID scanning when component mounts
    if (isAutoScanning) {
      startRFIDScanning();
    }

    // Cleanup on unmount
    return () => {
      rfidScanner.stopScanning();
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, [activeTrip, navigate, nextStudent, isAutoScanning]);

  const handleBack = () => {
    console.log('ScanStudentScreen: Navigating back to home');
    navigate('/minders-mobile/home');
  };

  const startRFIDScanning = () => {
    rfidScanner.startScanning(async (tagId: string) => {
      console.log('RFID tag detected:', tagId);
      await processRFIDTag(tagId);
    });
  };

  const processRFIDTag = async (rfidTagId: string) => {
    if (!activeTrip || scanState === 'scanning') return;

    setScanState('scanning');
    setScanResult(null);

    try {
      // Get current location
      const location = activeTrip.currentLocation || {
        latitude: -1.2921,
        longitude: 36.8219,
      };

      // Determine event type based on student status
      const eventType = scannedStudent?.status === 'pending' ? 'entry' : 'exit';
    
      // Process RFID scan
      const result = await rfidScanner.processRFIDScan(
        rfidTagId,
        activeTrip.route,
        activeTrip.busRegistration,
        location,
        eventType
      );

      setScanResult(result);

      if (result.success && result.studentId) {
        // Check if this is the expected student
        const isExpectedStudent = scannedStudent?.id === result.studentId;

        if (isExpectedStudent) {
      setScanState('success');
      
          // Update student status
      if (scannedStudent) {
            const newStatus = eventType === 'entry' ? 'picked-up' : 'dropped-off';
            updateStudentStatus(scannedStudent.id, newStatus, true);
          }

          // Auto-advance to next student after 2 seconds
          scanTimeoutRef.current = setTimeout(() => {
            handleScanAnotherStudent();
          }, 2000);
        } else {
          // Wrong student scanned
          setScanState('unauthorized');
      }
    } else {
        setScanState('failed');
      }
    } catch (error) {
      console.error('RFID scan error:', error);
      setScanState('failed');
      setScanResult({
        success: false,
        eventType: 'entry',
        isExpected: false,
        message: 'Scan failed. Please try again.',
        timestamp: new Date(),
      });
    }
  };

  const handleManualScan = () => {
    // For testing: simulate RFID tag scan
    if (scannedStudent?.rfidTagId) {
      processRFIDTag(scannedStudent.rfidTagId);
    } else {
      // Show input dialog for manual tag entry
      const tagId = prompt('Enter RFID Tag ID:');
      if (tagId) {
        processRFIDTag(tagId);
      }
    }
  };

  const handleScanAnotherStudent = () => {
    // Reset states for next scan
    setScanState('fingerprint');
    setFingerprintStatus(null);
    
    // Get the next pending student
    const remainingStudents = activeTrip?.students.filter(s => s.status === 'pending') || [];
    if (remainingStudents.length > 0) {
      setScannedStudent(remainingStudents[0]);
    } else {
      // No more students, go back to home
      navigate('/minders-mobile/home');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const getGenderColor = (gender: string) => {
    return gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800';
  };

  if (!activeTrip) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-bold text-white">Scan Student</h1>
        <div className="w-20"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {pendingStudents.length === 0 ? (
          <Card className="w-full max-w-sm shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Check className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">All Students Picked Up!</h2>
              <p className="text-gray-600 mb-6">No more students to scan</p>
              <Button onClick={handleBack} className="w-full">
                Return to Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Scanning Interface */}
            <Card className="w-full max-w-sm shadow-2xl">
              <CardContent className="p-8 text-center">
                {scanState === 'ready' && (
                  <>
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <Radio className="w-16 h-16 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">RFID Scanning Active</h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Waiting for RFID tag scan for <strong>{scannedStudent?.name}</strong>
                    </p>

                    {scannedStudent?.rfidTagId ? (
                      <div className="bg-blue-50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-blue-700">
                          Expected Tag: <code className="font-mono">{scannedStudent.rfidTagId}</code>
                        </p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-yellow-700">
                          ⚠️ No RFID tag assigned to this student
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={handleManualScan}
                      variant="outline"
                      className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 py-3 rounded-2xl"
                    >
                      <Radio className="w-5 h-5 mr-2" />
                      Manual Scan
                    </Button>

                    <div className="mt-4 flex items-center justify-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isAutoScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                      <span className="text-xs text-gray-500">
                        {isAutoScanning ? 'Auto-scanning enabled' : 'Auto-scanning disabled'}
                      </span>
                    </div>
                  </>
                )}

                {scanState === 'scanning' && (
                  <>
                    <div className="mb-6">
                      <div className="relative">
                        <div className="w-32 h-32 border-4 border-blue-200 rounded-full mx-auto relative overflow-hidden">
                          <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping"></div>
                          <div className="absolute inset-4 bg-blue-100 rounded-full flex items-center justify-center">
                            <Radio className="w-12 h-12 text-blue-500 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Processing RFID Tag...</h3>
                    <p className="text-gray-600">Verifying student information</p>
                  </>
                )}

                {scanState === 'success' && scannedStudent && (
                  <>
                    {/* Student Avatar - Large */}
                    <Avatar className="w-32 h-32 mx-auto mb-6">
                      <AvatarImage src={scannedStudent.photoUrl} alt={scannedStudent.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold text-2xl">
                        {getInitials(scannedStudent.name)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Success Icon */}
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{scannedStudent.name}</h2>
                    <p className="text-green-600 font-medium mb-6">Successfully Picked Up!</p>

                    {/* Student Details */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3 text-left">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Admission: {scannedStudent.admissionNumber}</span>
                        <Badge variant="secondary" className={`text-xs ml-auto ${getGenderColor(scannedStudent.gender)}`}>
                          {scannedStudent.gender}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 truncate">{scannedStudent.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{scannedStudent.parentName} - {scannedStudent.parentPhone}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleScanAnotherStudent}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-semibold"
                    >
                      Scan Another Student
                    </Button>
                  </>
                )}

                {scanState === 'failed' && (
                  <>
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <X className="w-16 h-16 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Scan Failed</h3>
                    <p className="text-gray-600 mb-4">
                      {scanResult?.message || 'RFID tag not recognized. Please try again.'}
                    </p>
                    
                    <Button
                      onClick={() => {
                        setScanState('ready');
                        setScanResult(null);
                      }}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl"
                    >
                      <Radio className="w-5 h-5 mr-2" />
                      Try Again
                    </Button>
                  </>
                )}

                {scanState === 'unauthorized' && scanResult && (
                  <>
                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="w-16 h-16 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Wrong Student</h3>
                    <p className="text-gray-600 mb-4">
                      Scanned: <strong>{scanResult.studentName}</strong> ({scanResult.admissionNumber})
                    </p>
                    <p className="text-gray-600 mb-4">
                      Expected: <strong>{scannedStudent?.name}</strong>
                    </p>
                    
                    <Button
                      onClick={() => {
                        setScanState('ready');
                        setScanResult(null);
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl"
                    >
                      <Radio className="w-5 h-5 mr-2" />
                      Scan Correct Student
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Students Remaining Counter */}
            <div className="mt-8 text-center">
              <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2 text-lg">
                {pendingStudents.length} student{pendingStudents.length !== 1 ? 's' : ''} remaining
              </Badge>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScanStudentScreen;
