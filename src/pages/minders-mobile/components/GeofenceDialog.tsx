
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Loader2, CheckCircle, AlertCircle, Navigation } from "lucide-react";
import { geofenceService, GeofenceResult } from "../services/geofenceService";

interface GeofenceDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  zoneId: string;
  zoneName: string;
}

const GeofenceDialog = ({ open, onClose, onSuccess, zoneId, zoneName }: GeofenceDialogProps) => {
  const [status, setStatus] = useState<'checking' | 'success' | 'failed' | 'permission-denied'>('checking');
  const [geofenceResult, setGeofenceResult] = useState<GeofenceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkGeofence = async () => {
    setIsLoading(true);
    setStatus('checking');
    
    try {
      // First request location permission
      const hasPermission = await geofenceService.requestLocationPermission();
      if (!hasPermission) {
        setStatus('permission-denied');
        setIsLoading(false);
        return;
      }

      // Check geofence
      const result = await geofenceService.checkGeofence(zoneId);
      setGeofenceResult(result);
      
      if (result.isWithinGeofence) {
        setStatus('success');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Geofence check failed:', error);
      setStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      checkGeofence();
    }
  }, [open]);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-12 h-12 text-red-500" />;
      case 'permission-denied':
        return <Navigation className="w-12 h-12 text-orange-500" />;
      default:
        return <MapPin className="w-12 h-12 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'checking':
        return {
          title: 'Checking Location',
          description: 'Verifying you are within the designated zone...'
        };
      case 'success':
        return {
          title: 'Location Verified!',
          description: `You are within the ${zoneName}. Starting trip...`
        };
      case 'failed':
        return {
          title: 'Location Check Failed',
          description: geofenceResult?.distance 
            ? `You are ${Math.round(geofenceResult.distance)}m away from ${zoneName}. Please move to the designated zone.`
            : `You are not within the ${zoneName}. Please move to the designated zone.`
        };
      case 'permission-denied':
        return {
          title: 'Location Permission Required',
          description: 'Please allow location access to verify you are in the correct zone.'
        };
      default:
        return {
          title: 'Checking Location',
          description: 'Please wait...'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="h-full max-h-none w-full max-w-none p-0 m-0 rounded-none flex flex-col">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 pb-8 rounded-b-3xl shadow-lg flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-center">
            Zone Verification
          </DialogTitle>
          <p className="text-green-100 text-center mt-2">
            Confirming your location
          </p>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-6">
          <Card className="w-full max-w-md shadow-lg border-0">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                {getStatusIcon()}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {statusInfo.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {statusInfo.description}
              </p>

              {geofenceResult && status !== 'success' && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Distance:</span>
                    <span className="font-medium">
                      {geofenceResult.distance ? `${Math.round(geofenceResult.distance)}m` : 'Unknown'}
                    </span>
                  </div>
                  {geofenceResult.accuracy && (
                    <div className="flex justify-between items-center mt-2">
                      <span>Accuracy:</span>
                      <span className="font-medium">±{Math.round(geofenceResult.accuracy)}m</span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {status === 'failed' && (
                  <Button
                    onClick={checkGeofence}
                    disabled={isLoading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 mr-2" />
                        Check Again
                      </>
                    )}
                  </Button>
                )}
                
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full py-3 rounded-2xl"
                  disabled={isLoading && status === 'checking'}
                >
                  {status === 'success' ? 'Close' : 'Cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeofenceDialog;
