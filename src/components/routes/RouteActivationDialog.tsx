
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Check, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RouteActivationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  routeName: string;
  onConfirm: () => void;
}

interface ActivationItem {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
}

export const RouteActivationDialog = ({ 
  isOpen, 
  onClose, 
  routeName, 
  onConfirm 
}: RouteActivationDialogProps) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activationItems, setActivationItems] = useState<ActivationItem[]>([
    {
      id: 'route',
      label: 'Route',
      description: 'The route will be available to use in the upcoming trips.',
      status: 'pending'
    }
  ]);

  const handleActivate = async () => {
    setIsProcessing(true);
    
    // Process each item one by one
    for (let i = 0; i < activationItems.length; i++) {
      const currentItem = activationItems[i];
      
      // Set current item to processing
      setActivationItems(prev => prev.map(item => 
        item.id === currentItem.id 
          ? { ...item, status: 'processing' }
          : item
      ));
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark as completed
      setActivationItems(prev => prev.map(item => 
        item.id === currentItem.id 
          ? { ...item, status: 'completed' }
          : item
      ));
    }
    
    // Complete the process
    setIsProcessing(false);
    onConfirm();
    toast({
      title: "Route Activated!",
      description: `Route ${routeName} has been successfully activated and is now available for upcoming trips.`,
    });
    onClose();
    resetDialog();
  };

  const resetDialog = () => {
    setConfirmationText("");
    setIsProcessing(false);
    setActivationItems(prev => prev.map(item => ({ ...item, status: 'pending' })));
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      resetDialog();
    }
  };

  const isConfirmationValid = confirmationText === "ACTIVATE";

  if (isProcessing) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activating Route {routeName}</DialogTitle>
            <DialogDescription>
              Please wait while we activate the route and update all related systems...
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {activationItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {item.status === 'completed' && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {item.status === 'processing' && (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    </div>
                  )}
                  {item.status === 'pending' && (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {item.status === 'processing' && 'Activating '}
                    {item.status === 'completed' && 'Activated '}
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
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            Activate Route {routeName}
          </DialogTitle>
          <DialogDescription>
            This action will activate the route and make it available for service. Please review the changes below.
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Notice:</strong> Activating this route will make it available for next trips and operations.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">The following will be enabled:</h4>
            <div className="space-y-3">
              {activationItems.map((item) => (
                <div key={item.id} className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                  <div className="font-medium text-green-900">{item.label}</div>
                  <div className="text-sm text-green-700 mt-1">{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="confirmation" className="text-sm font-medium">
              Type <span className="font-bold bg-green-100 px-1 rounded">ACTIVATE</span> to confirm:
            </Label>
            <Input
              id="confirmation"
              placeholder="Type ACTIVATE to confirm"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="border-green-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleActivate}
              disabled={!isConfirmationValid}
            >
              Activate Route
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
