
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Check, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ParentStatusDialogsProps {
  isStatusWarningOpen: boolean;
  isActivateWarningOpen: boolean;
  onConfirmStatusChange: () => void;
  onConfirmActivateChange: () => void;
  onCancelStatusChange: () => void;
  onCancelActivateChange: () => void;
}

interface StatusItem {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
}

export const ParentStatusDialogs = ({
  isStatusWarningOpen,
  isActivateWarningOpen,
  onConfirmStatusChange,
  onConfirmActivateChange,
  onCancelStatusChange,
  onCancelActivateChange,
}: ParentStatusDialogsProps) => {
  // Deactivation state
  const [deactivationConfirmationText, setDeactivationConfirmationText] = useState("");
  const [isDeactivationProcessing, setIsDeactivationProcessing] = useState(false);
  const [deactivationItems, setDeactivationItems] = useState<StatusItem[]>([
    {
      id: 'parent',
      label: 'Parent',
      description: 'This will prevent the parent from accessing their account. The students associated with the parent will be deactivated, hidden from their assigned routes, and will not be able to access the school bus service on upcoming trips.',
      status: 'pending'
    }
  ]);

  // Activation state
  const [activationConfirmationText, setActivationConfirmationText] = useState("");
  const [isActivationProcessing, setIsActivationProcessing] = useState(false);
  const [activationItems, setActivationItems] = useState<StatusItem[]>([
    {
      id: 'parent',
      label: 'Parent',
      description: 'This will allow the parent to access their account again. The students associated with the parent will be activated, made visible on their assigned routes, and will be able to access the school bus service on upcoming trips.',
      status: 'pending'
    }
  ]);

  const handleDeactivate = async () => {
    setIsDeactivationProcessing(true);
    
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
    setIsDeactivationProcessing(false);
    onConfirmStatusChange();
    resetDeactivationDialog();
  };

  const handleActivate = async () => {
    setIsActivationProcessing(true);
    
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
    setIsActivationProcessing(false);
    onConfirmActivateChange();
    resetActivationDialog();
  };

  const resetDeactivationDialog = () => {
    setDeactivationConfirmationText("");
    setIsDeactivationProcessing(false);
    setDeactivationItems(prev => prev.map(item => ({ ...item, status: 'pending' })));
  };

  const resetActivationDialog = () => {
    setActivationConfirmationText("");
    setIsActivationProcessing(false);
    setActivationItems(prev => prev.map(item => ({ ...item, status: 'pending' })));
  };

  const handleDeactivationClose = () => {
    if (!isDeactivationProcessing) {
      onCancelStatusChange();
      resetDeactivationDialog();
    }
  };

  const handleActivationClose = () => {
    if (!isActivationProcessing) {
      onCancelActivateChange();
      resetActivationDialog();
    }
  };

  const isDeactivationConfirmationValid = deactivationConfirmationText === "DEACTIVATE";
  const isActivationConfirmationValid = activationConfirmationText === "ACTIVATE";

  return (
    <>
      {/* Deactivation Dialog */}
      {isDeactivationProcessing ? (
        <Dialog open={isStatusWarningOpen} onOpenChange={() => {}}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Deactivating Parent</DialogTitle>
              <DialogDescription>
                Please wait while we deactivate the parent and update all related systems...
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
      ) : (
        <Dialog open={isStatusWarningOpen} onOpenChange={handleDeactivationClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Deactivate Parent
              </DialogTitle>
              <DialogDescription>
                This action will deactivate the parent and affect related operations. Please review the impact below.
              </DialogDescription>
            </DialogHeader>

            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Warning:</strong> Deactivating this parent will affect ongoing operations and student access.
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
                <Label htmlFor="deactivation-confirmation" className="text-sm font-medium">
                  Type <span className="font-bold bg-red-100 px-1 rounded">DEACTIVATE</span> to confirm:
                </Label>
                <Input
                  id="deactivation-confirmation"
                  placeholder="Type DEACTIVATE to confirm"
                  value={deactivationConfirmationText}
                  onChange={(e) => setDeactivationConfirmationText(e.target.value)}
                  className="border-red-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={handleDeactivationClose}>
                  Cancel
                </Button>
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDeactivate}
                  disabled={!isDeactivationConfirmationValid}
                >
                  Deactivate Parent
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Activation Dialog */}
      {isActivationProcessing ? (
        <Dialog open={isActivateWarningOpen} onOpenChange={() => {}}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Activating Parent</DialogTitle>
              <DialogDescription>
                Please wait while we activate the parent and update all related systems...
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
      ) : (
        <Dialog open={isActivateWarningOpen} onOpenChange={handleActivationClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Activate Parent
              </DialogTitle>
              <DialogDescription>
                This action will activate the parent and enable related services. Please review the changes below.
              </DialogDescription>
            </DialogHeader>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Notice:</strong> Activating this parent will enable account access and student services.
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
                <Label htmlFor="activation-confirmation" className="text-sm font-medium">
                  Type <span className="font-bold bg-green-100 px-1 rounded">ACTIVATE</span> to confirm:
                </Label>
                <Input
                  id="activation-confirmation"
                  placeholder="Type ACTIVATE to confirm"
                  value={activationConfirmationText}
                  onChange={(e) => setActivationConfirmationText(e.target.value)}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={handleActivationClose}>
                  Cancel
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleActivate}
                  disabled={!isActivationConfirmationValid}
                >
                  Activate Parent
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
