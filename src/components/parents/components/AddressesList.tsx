import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MapPin, Edit, Trash2, Home, Building2, Users } from "lucide-react";
import EditAddressDialog from "./EditAddressDialog";
import { toast } from "@/hooks/use-toast";

interface Address {
  id: string;
  addressType: string;
  location: string;
  longitude: number;
  latitude: number;
  status: string;
  isPrimary: boolean;
  // Legacy fields for backward compatibility
  type?: string;
}

interface AddressesListProps {
  addresses: Address[];
  onUpdateAddress: (updatedAddress: Address) => void;
  onDeleteAddress: (addressId: string) => void;
}

const AddressesList = ({
  addresses,
  onUpdateAddress,
  onDeleteAddress,
}: AddressesListProps) => {
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);

  const getStatusBadge = (status: string) => {
    const variant = status.toLowerCase() === "active" ? "success" : "secondary";
    return <Badge variant={variant}>{status}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("home")) {
      return <Home className="w-5 h-5 text-blue-600" />;
    } else if (lowerType.includes("office") || lowerType.includes("work")) {
      return <Building2 className="w-5 h-5 text-purple-600" />;
    } else if (lowerType.includes("relative")) {
      return <Users className="w-5 h-5 text-green-600" />;
    } else {
      return <MapPin className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleDelete = (address: Address) => {
    onDeleteAddress(address.id);
    setDeletingAddress(null);
    toast({
      title: "Address Deleted!",
      description: `${
        address.addressType || address.type
      } address has been removed.`,
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {addresses.map((address) => {
          const isInactive = address.status === "inactive";

          return (
            <Card
              key={address.id}
              className={`relative transition-all duration-200 hover:shadow-lg ${
                isInactive
                  ? "bg-gray-50 border-gray-200 opacity-75"
                  : "bg-white border-gray-200 hover:border-blue-300"
              }`}
            >
              {address.isPrimary && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 text-xs font-medium">
                    Primary
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold flex items-center space-x-3">
                    {getTypeIcon(address.addressType || address.type || "")}
                    <div>
                      <span
                        className={
                          isInactive ? "text-gray-500" : "text-gray-800"
                        }
                      >
                        {address.addressType || address.type}
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(address.status)}
                      </div>
                    </div>
                  </CardTitle>

                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingAddress(address)}
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingAddress(address)}
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Address</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this{" "}
                            {address.addressType || address.type} address? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(address)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isInactive ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Location
                      </p>
                      <p
                        className={`text-sm ${
                          isInactive ? "text-gray-500" : "text-gray-800"
                        }`}
                      >
                        {address.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <p
                      className={`text-xs font-medium ${
                        isInactive ? "text-gray-400" : "text-gray-500"
                      } uppercase tracking-wide`}
                    >
                      Longitude
                    </p>
                    <p
                      className={`text-sm font-mono ${
                        isInactive ? "text-gray-500" : "text-gray-700"
                      } mt-1`}
                    >
                      {address.longitude}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-xs font-medium ${
                        isInactive ? "text-gray-400" : "text-gray-500"
                      } uppercase tracking-wide`}
                    >
                      Latitude
                    </p>
                    <p
                      className={`text-sm font-mono ${
                        isInactive ? "text-gray-500" : "text-gray-700"
                      } mt-1`}
                    >
                      {address.latitude}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {editingAddress && (
        <EditAddressDialog
          address={editingAddress}
          isOpen={!!editingAddress}
          onClose={() => setEditingAddress(null)}
          onUpdate={onUpdateAddress}
        />
      )}
    </>
  );
};

export default AddressesList;
