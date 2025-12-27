
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RouteDeactivationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  routeName: string;
  onConfirm: () => void;
}

interface DeactivationItem {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
}

export const RouteDeactivationDialog = ({ 
  isOpen, 
  onClose, 
  routeName, 
  onConfirm 
}: RouteDeactivationDialogProps) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [deactivationItems, setDeactivationItems] = useState<DeactivationItem[]>([
    {
      id: 'routes',
      label: 'Route',
      description: 'The route wont be available to use in the upcoming trips.',
      status: 'pending'
    }
  ]);

  const handleDeactivate = async () => {
    setIsProcessing(true);
    
    // Process each item one by one
    for (let i = 0; i < deactivationItems.length; i++) {
      const currentItem = deactivationItems[i];
      
      // Set current item to processing
      setDeactivationItems(prev => prev.map(item => 
        item.id === currentItem.id 
          ? { ...item, status: 'processing' }
          : item
      ));
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark as completed
      setDeactivationItems(prev => prev.map(item => 
        item.id === currentItem.id 
          ? { ...item, status: 'completed' }
          : item
      ));
    }
    
    // Complete the process
    setIsProcessing(false);
    onConfirm();
    toast({
      title: "Route Deactivated!",
      description: `Route ${routeName} has been successfully deactivated and will not be available for upcoming trips.`,
    });
    onClose();
    resetDialog();
  };

  const resetDialog = () => {
    setConfirmationText("");
    setIsProcessing(false);
    setDeactivationItems(prev => prev.map(item => ({ ...item, status: 'pending' })));
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      resetDialog();
    }
  };

  const isConfirmationValid = confirmationText === "DEACTIVATE";

  if (isProcessing) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Deactivating Route {routeName}</DialogTitle>
            <DialogDescription>
              Please wait while we deactivate the route and update all related systems...
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {deactivationItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {item.status === 'completed' && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {item.status === 'processing' && (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                    </div>
                  )}
                  {item.status === 'pending' && (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {item.status === 'processing' && 'Deactivating '}
                    {item.status === 'completed' && 'Deactivated '}
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Deactivate Route {routeName}
          </DialogTitle>
          <DialogDescription>
            This action will deactivate the route and affect related operations. Please review the impact below.
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Warning:</strong> Deactivating this route will affect next trips and scheduled operations.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">The following will be affected:</h4>
            <div className="space-y-3">
              {deactivationItems.map((item) => (
                <div key={item.id} className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                  <div className="font-medium text-red-900">{item.label}</div>
                  <div className="text-sm text-red-700 mt-1">{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="confirmation" className="text-sm font-medium">
              Type <span className="font-bold bg-red-100 px-1 rounded">DEACTIVATE</span> to confirm:
            </Label>
            <Input
              id="confirmation"
              placeholder="Type DEACTIVATE to confirm"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="border-red-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeactivate}
              disabled={!isConfirmationValid}
            >
              Deactivate Route
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
