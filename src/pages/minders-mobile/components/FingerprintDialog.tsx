
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Fingerprint, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface FingerprintDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (isVerified: boolean) => void;
  studentName: string;
}

type ScanStatus = 'ready' | 'scanning' | 'success' | 'failed' | 'error';

const FingerprintDialog = ({ open, onClose, onSuccess, studentName }: FingerprintDialogProps) => {
  const [scanStatus, setScanStatus] = useState<ScanStatus>('ready');
  const [isScanning, setIsScanning] = useState(false);

  // Reset status when dialog opens
  useEffect(() => {
    if (open) {
      setScanStatus('ready');
      setIsScanning(false);
    }
  }, [open]);

  const simulateFingerprintScan = async (): Promise<boolean> => {
    // Simulate fingerprint scanning process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate random success/failure (80% success rate)
    return Math.random() > 0.2;
  };

  const handleScanStart = async () => {
    setIsScanning(true);
    setScanStatus('scanning');

    try {
      const isVerified = await simulateFingerprintScan();
      
      if (isVerified) {
        setScanStatus('success');
        setTimeout(() => {
          onSuccess(true);
        }, 1500);
      } else {
        setScanStatus('failed');
      }
    } catch (error) {
      console.error('Fingerprint scan error:', error);
      setScanStatus('error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSkipVerification = () => {
    onSuccess(false);
  };

  const getStatusContent = () => {
    switch (scanStatus) {
      case 'ready':
        return {
          icon: <Fingerprint className="w-16 h-16 text-blue-500" />,
          title: 'Fingerprint Verification',
          description: `Place your finger on the sensor to verify pickup of ${studentName}`,
          iconBg: 'bg-blue-100'
        };
      case 'scanning':
        return {
          icon: <Fingerprint className="w-16 h-16 text-blue-500 animate-pulse" />,
          title: 'Scanning...',
          description: 'Keep your finger steady on the sensor',
          iconBg: 'bg-blue-100'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: 'Verification Successful!',
          description: `Fingerprint verified for ${studentName}`,
          iconBg: 'bg-green-100'
        };
      case 'failed':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Verification Failed',
          description: 'Fingerprint not recognized. Please try again.',
          iconBg: 'bg-red-100'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-16 h-16 text-orange-500" />,
          title: 'Scanner Error',
          description: 'Unable to access fingerprint scanner',
          iconBg: 'bg-orange-100'
        };
      default:
        return {
          icon: <Fingerprint className="w-16 h-16 text-gray-500" />,
          title: 'Ready',
          description: 'Preparing scanner...',
          iconBg: 'bg-gray-100'
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="h-full max-h-none w-full max-w-none p-0 m-0 rounded-none flex flex-col">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 pb-8 rounded-b-3xl shadow-lg flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-center">
            Student Verification
          </DialogTitle>
          <p className="text-blue-100 text-center mt-2">
            Secure pickup confirmation
          </p>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6">
          <Card className="w-full max-w-md shadow-lg border-0">
            <CardContent className="p-8 text-center">
              {/* Status Icon */}
              <div className={`w-24 h-24 ${statusContent.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                {statusContent.icon}
              </div>

              {/* Status Text */}
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {statusContent.title}
              </h3>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                {statusContent.description}
              </p>

              {/* Scanning Animation */}
              {scanStatus === 'scanning' && (
                <div className="mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 border-4 border-blue-200 rounded-full mx-auto relative overflow-hidden">
                      <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping"></div>
                      <div className="absolute inset-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <Fingerprint className="w-12 h-12 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {scanStatus === 'ready' && (
                  <>
                    <Button
                      onClick={handleScanStart}
                      disabled={isScanning}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl"
                    >
                      <Fingerprint className="w-5 h-5 mr-2" />
                      Start Scan
                    </Button>
                    <Button
                      onClick={handleSkipVerification}
                      variant="outline"
                      className="w-full py-3 rounded-2xl"
                    >
                      Skip Verification
                    </Button>
                  </>
                )}

                {scanStatus === 'failed' && (
                  <>
                    <Button
                      onClick={handleScanStart}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl"
                    >
                      <Fingerprint className="w-5 h-5 mr-2" />
                      Try Again
                    </Button>
                    <Button
                      onClick={handleSkipVerification}
                      variant="outline"
                      className="w-full py-3 rounded-2xl"
                    >
                      Continue Without Verification
                    </Button>
                  </>
                )}

                {scanStatus === 'error' && (
                  <Button
                    onClick={handleSkipVerification}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl"
                  >
                    Continue Without Scanner
                  </Button>
                )}

                {(scanStatus === 'scanning' || scanStatus === 'success') && (
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full py-3 rounded-2xl"
                    disabled={scanStatus === 'scanning'}
                  >
                    {scanStatus === 'success' ? 'Close' : 'Cancel'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FingerprintDialog;
