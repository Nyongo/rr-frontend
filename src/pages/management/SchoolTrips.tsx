import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import TripForm from "@/components/trips/TripForm";
import TripsList from "@/components/trips/TripsList";
import { Trip } from "@/services/tripsApi";

const SchoolTrips = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddTrip = () => {
    setEditingTrip(null);
    setIsFormOpen(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTrip(null);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingTrip(null);
    // Trigger refresh of trips list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              School Trips
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Schedule and manage school trips
            </p>
          </div>
          <Button
            onClick={handleAddTrip}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Trip
          </Button>
        </div>

        {/* Trips List */}
        <TripsList
          onEditTrip={handleEditTrip}
          refreshTrigger={refreshTrigger}
        />

        {/* Trip Form Dialog */}
        {isFormOpen && (
          <TripForm
            trip={editingTrip}
            isOpen={isFormOpen}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </Layout>
  );
};

export default SchoolTrips;
