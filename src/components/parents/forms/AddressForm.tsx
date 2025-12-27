import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MapPin, Edit3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

interface Address {
  id: string;
  type?: string;
  location: string;
  longitude: number;
  latitude: number;
  status: string;
  isPrimary: boolean;
}

interface AddressFormProps {
  onAddAddress: (address: Address) => void;
  addresses: Address[];
}

const AddressForm = ({ onAddAddress, addresses }: AddressFormProps) => {
  console.log("🔵 AddressForm component rendered");

  const [isOpen, setIsOpen] = useState(false);
  const [inputMethod, setInputMethod] = useState<"search" | "manual">("search");
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  const [newAddress, setNewAddress] = useState({
    type: "",
    location: "",
    longitude: "",
    latitude: "",
    status: "active",
    isPrimary: addresses.length === 0 ? "true" : "false",
  });

  // Debug: Log state changes
  useEffect(() => {
    console.log("📝 [STATE CHANGE] newAddress updated:", newAddress);
  }, [newAddress]);

  // Log when dialog opens/closes
  useEffect(() => {
    console.log(`🔵 Dialog state changed: isOpen = ${isOpen}`);
    if (isOpen) {
      console.log("🔵 Dialog is now OPEN");
    } else {
      console.log("🔵 Dialog is now CLOSED");
    }
  }, [isOpen]);

  // Load Google Maps API
  useEffect(() => {
    console.log("🟢 [STEP 1] Google Maps loader useEffect triggered");
    console.log(
      "🟢 [STEP 2] Checking if window.google exists:",
      !!window.google
    );
    console.log(
      "🟢 [STEP 3] Checking if script in DOM:",
      !!document.querySelector('script[src*="maps.googleapis.com"]')
    );

    // Check if already loaded
    if (window.google?.maps?.places) {
      console.log("✅ [STEP 4A] Google Maps ALREADY loaded! Setting state.");
      setIsGoogleMapsLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      console.log("⏳ [STEP 4B] Script exists, waiting for load...");
      return;
    }

    // Create new script
    console.log("🟢 [STEP 4C] NO script found. Creating NEW script...");
    const script = document.createElement("script");
    const apiKey = "AIzaSyD15fDdmqNVINe8CtDWJkUJD3TNVIbg_B8";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("✅ [STEP 5] Script.onload FIRED!");
      if (window.google?.maps?.places) {
        console.log("✅ [STEP 6] Google Maps loaded successfully!");
        setIsGoogleMapsLoaded(true);
      } else {
        console.error(
          "❌ [STEP 6] Script loaded but window.google not available!"
        );
      }
    };

    script.onerror = (error) => {
      console.error("❌ [ERROR] Script failed to load:", error);
      toast({
        title: "Map Loading Error",
        description: "Could not load Google Maps. Please use manual entry.",
        variant: "destructive",
      });
    };

    console.log("🟢 [STEP 7] Appending script to document.head...");
    document.head.appendChild(script);
    console.log("✅ [STEP 8] Script appended! Src:", script.src);

    // Verify after a moment
    setTimeout(() => {
      const found = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      console.log("🔍 [VERIFY] Script in DOM after 100ms?", !!found);
      if (found) {
        console.log("🔍 [VERIFY] Script element:", found);
      }
    }, 100);
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    // Only proceed if dialog is open, Google Maps loaded, and we're on search tab
    if (!isOpen || !isGoogleMapsLoaded || inputMethod !== "search") {
      return;
    }

    // Check if Places API is available
    if (!window.google?.maps?.places) {
      console.error("❌ Places API not available!");
      return;
    }

    // Use a more aggressive approach - wait for input to be available
    const initAutocomplete = () => {
      const inputElement = document.getElementById(
        "search-location"
      ) as HTMLInputElement;

      if (!inputElement) {
        setTimeout(initAutocomplete, 100);
        return;
      }

      try {
        // Clear any existing autocomplete and event listeners
        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(inputElement);
        }

        // Remove any existing event listeners
        const newInputElement = inputElement.cloneNode(
          true
        ) as HTMLInputElement;
        inputElement.parentNode?.replaceChild(newInputElement, inputElement);
        const cleanInputElement = document.getElementById(
          "search-location"
        ) as HTMLInputElement;
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          cleanInputElement,
          {
            types: ["geocode", "establishment"],
            componentRestrictions: { country: "ke" },
          }
        );

        console.log(
          "✅ [AUTOCOMPLETE] Autocomplete instance created:",
          autocompleteRef.current
        );
        console.log("✅ [AUTOCOMPLETE] Input element:", cleanInputElement);
        console.log("✅ [AUTOCOMPLETE] Input value:", cleanInputElement.value);
        console.log(
          "✅ [AUTOCOMPLETE] Input element ID:",
          cleanInputElement.id
        );
        console.log(
          "✅ [AUTOCOMPLETE] Input element classes:",
          cleanInputElement.className
        );

        // Test if autocomplete is working by checking for suggestions
        setTimeout(() => {
          console.log("🔍 [AUTOCOMPLETE] Testing if suggestions work...");
          cleanInputElement.value = "Westlands, Nairobi";
          cleanInputElement.dispatchEvent(
            new Event("input", { bubbles: true })
          );

          // Check after a delay if place_changed would fire
          setTimeout(() => {
            const place = autocompleteRef.current.getPlace();
            console.log("🔍 [AUTOCOMPLETE] Test place data:", place);
            if (place && place.geometry) {
              console.log("✅ [AUTOCOMPLETE] Autocomplete is working!");
            } else {
              console.log(
                "⚠️ [AUTOCOMPLETE] Autocomplete not responding to input"
              );
            }
          }, 2000);
        }, 1000);

        // Add place_changed listener with better error handling
        const placeChangedListener = autocompleteRef.current.addListener(
          "place_changed",
          () => {
            console.log("🎯 [PLACE CHANGED] Event triggered!");

            // Hide the suggestions immediately
            const pacContainer = document.querySelector(".pac-container");
            if (pacContainer) {
              (pacContainer as HTMLElement).style.display = "none";
              console.log("🎯 [PLACE CHANGED] Hiding suggestions container");
            }

            try {
              const place = autocompleteRef.current?.getPlace();
              console.log("🎯 [PLACE CHANGED] Full place object:", place);

              // Check if place has valid data
              if (!place || !place.geometry || !place.geometry.location) {
                console.warn("⚠️ [PLACE CHANGED] No geometry data in place");
                console.warn("⚠️ [PLACE CHANGED] Place object:", place);
                return;
              }

              const lng = place.geometry.location.lng();
              const lat = place.geometry.location.lat();
              const formattedAddress =
                place.formatted_address || place.name || "";

              console.log("🎯 [PLACE CHANGED] Raw coordinates:", { lng, lat });
              console.log(
                "🎯 [PLACE CHANGED] Formatted address:",
                formattedAddress
              );

              // Update form state with selected place data
              setNewAddress((prev) => {
                const newData = {
                  ...prev,
                  location: formattedAddress,
                  longitude: lng.toString(),
                  latitude: lat.toString(),
                };

                console.log("🔄 [PLACE CHANGED] Updated state:", newData);
                return newData;
              });

              // Show success message
              toast({
                title: "Location Selected",
                description: `${formattedAddress} - Coordinates: ${lat}, ${lng}`,
              });

              console.log(
                "✅ [PLACE CHANGED] Successfully updated form with selected location"
              );
            } catch (error) {
              console.error(
                "❌ [PLACE CHANGED] Error processing place:",
                error
              );
              toast({
                title: "Selection Error",
                description: "Could not process selected location",
                variant: "destructive",
              });
            }
          }
        );

        console.log(
          "✅ [AUTOCOMPLETE] Place changed listener added:",
          placeChangedListener
        );

        // Add additional event listeners to catch selection events
        const handleSelection = () => {
          console.log("🎯 [SELECTION] Selection event detected");

          // Hide the suggestions immediately
          const pacContainer = document.querySelector(".pac-container");
          if (pacContainer) {
            (pacContainer as HTMLElement).style.display = "none";
            console.log("🎯 [SELECTION] Hiding suggestions container");
          }

          // Wait a moment for the autocomplete to process
          setTimeout(() => {
            const place = autocompleteRef.current?.getPlace();
            console.log("🎯 [SELECTION] Place from getPlace():", place);

            // If getPlace() returns undefined, try a different approach
            if (!place || !place.geometry || !place.geometry.location) {
              console.log(
                "🎯 [SELECTION] getPlace() returned undefined, trying alternative approach"
              );

              // Get the current input value and try to geocode it
              const inputValue = cleanInputElement.value;
              console.log("🎯 [SELECTION] Input value:", inputValue);

              if (inputValue && inputValue.length >= 3) {
                console.log(
                  "🎯 [GEOCODER] Starting geocoding for:",
                  inputValue
                );

                // Use the geocoding service to get coordinates for the input value
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode(
                  {
                    address: inputValue + ", Kenya", // Add Kenya for better results
                    region: "KE", // Restrict to Kenya
                  },
                  (results, status) => {
                    console.log("🎯 [GEOCODER] Geocoding results:", results);
                    console.log("🎯 [GEOCODER] Status:", status);

                    if (status === "OK" && results && results.length > 0) {
                      const result = results[0];
                      const location = result.geometry.location;
                      const lng = location.lng();
                      const lat = location.lat();
                      const formattedAddress =
                        result.formatted_address || inputValue;

                      console.log("🎯 [GEOCODER] Found coordinates:", {
                        lng,
                        lat,
                        formattedAddress,
                      });

                      // Force update the state immediately
                      setNewAddress((prev) => {
                        const newData = {
                          ...prev,
                          location: formattedAddress,
                          longitude: lng.toString(),
                          latitude: lat.toString(),
                        };

                        console.log("🔄 [GEOCODER] Updated state:", newData);
                        console.log("🔄 [GEOCODER] Previous state was:", prev);
                        return newData;
                      });

                      toast({
                        title: "Location Selected",
                        description: `${formattedAddress} - Coordinates: ${lat}, ${lng}`,
                      });
                    } else {
                      console.warn("🎯 [GEOCODER] Geocoding failed:", status);
                      console.warn("🎯 [GEOCODER] Results:", results);

                      // Try with just the input value without Kenya
                      console.log(
                        "🎯 [GEOCODER] Retrying without Kenya suffix..."
                      );
                      geocoder.geocode(
                        { address: inputValue },
                        (results2, status2) => {
                          console.log("🎯 [GEOCODER] Retry results:", results2);
                          console.log("🎯 [GEOCODER] Retry status:", status2);

                          if (
                            status2 === "OK" &&
                            results2 &&
                            results2.length > 0
                          ) {
                            const result = results2[0];
                            const location = result.geometry.location;
                            const lng = location.lng();
                            const lat = location.lat();
                            const formattedAddress =
                              result.formatted_address || inputValue;

                            setNewAddress((prev) => ({
                              ...prev,
                              location: formattedAddress,
                              longitude: lng.toString(),
                              latitude: lat.toString(),
                            }));

                            toast({
                              title: "Location Selected (Retry)",
                              description: `${formattedAddress} - Coordinates: ${lat}, ${lng}`,
                            });
                          } else {
                            toast({
                              title: "Selection Failed",
                              description: `Could not find coordinates for "${inputValue}"`,
                              variant: "destructive",
                            });
                          }
                        }
                      );
                    }
                  }
                );
              } else {
                console.log(
                  "🎯 [SELECTION] Input value too short:",
                  inputValue
                );
              }
              return;
            }

            // Original logic for when getPlace() works
            const lng = place.geometry.location.lng();
            const lat = place.geometry.location.lat();
            const formattedAddress =
              place.formatted_address || place.name || "";

            console.log("🎯 [SELECTION] Processing place data:", {
              lng,
              lat,
              formattedAddress,
            });

            setNewAddress((prev) => {
              const newData = {
                ...prev,
                location: formattedAddress,
                longitude: lng.toString(),
                latitude: lat.toString(),
              };

              console.log("🔄 [SELECTION] Updated state:", newData);
              return newData;
            });

            toast({
              title: "Location Selected",
              description: `${formattedAddress} - Coordinates: ${lat}, ${lng}`,
            });
          }, 100);
        };

        // Add multiple event listeners to catch different selection methods
        cleanInputElement.addEventListener("blur", handleSelection);
        cleanInputElement.addEventListener("change", handleSelection);

        // Listen for keyboard events that might indicate selection
        cleanInputElement.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === "Tab") {
            console.log(
              "🎯 [KEYBOARD] Enter/Tab pressed, checking for selection"
            );
            handleSelection();
          }
        });

        // Add click listener to detect clicks on suggestion items
        document.addEventListener("click", (e) => {
          const target = e.target as HTMLElement;

          // Check if the click is on a Google Places suggestion item
          if (
            target.classList.contains("pac-item") ||
            target.closest(".pac-item")
          ) {
            console.log("🎯 [CLICK] Clicked on suggestion item:", target);

            // Wait a moment for the autocomplete to process the click
            setTimeout(() => {
              handleSelection();
            }, 50);
          }
        });

        // Listen for input changes to update the location field immediately
        cleanInputElement.addEventListener("input", (e) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          console.log("🎯 [INPUT] Input changed to:", value);

          // Update the location field immediately as user types
          setNewAddress((prev) => ({
            ...prev,
            location: value,
            // Clear coordinates when user is typing (not selecting)
            longitude: "",
            latitude: "",
          }));
        });

        console.log("✅ [AUTOCOMPLETE] Additional event listeners added");
      } catch (error) {
        console.error("❌ [AUTOCOMPLETE] Error:", error);
        toast({
          title: "Autocomplete Error",
          description: "Could not initialize search. Please use manual entry.",
          variant: "destructive",
        });
      }
    };

    // Start initialization
    setTimeout(initAutocomplete, 200);

    // Cleanup function
    return () => {
      const inputElement = document.getElementById(
        "search-location"
      ) as HTMLInputElement;
      if (inputElement && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(inputElement);
      }
      autocompleteRef.current = null;
    };
  }, [isOpen, isGoogleMapsLoaded, inputMethod]);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🔍 [FORM SUBMIT] Current newAddress state:", newAddress);
    console.log("🔍 [FORM SUBMIT] Input method:", inputMethod);

    // Comprehensive validation
    const validationErrors: string[] = [];

    // 1. Validate address type
    if (!newAddress.type || newAddress.type.trim() === "") {
      validationErrors.push("Address type is required");
    }

    // 2. Validate location
    if (!newAddress.location || newAddress.location.trim() === "") {
      validationErrors.push("Location is required");
    }

    // 3. Validate coordinates based on input method
    if (inputMethod === "search") {
      // For search method, coordinates should be automatically populated
      if (!newAddress.longitude || !newAddress.latitude) {
        validationErrors.push(
          "Coordinates are missing. Please select a location from the suggestions or use manual entry."
        );
      }
    } else if (inputMethod === "manual") {
      // For manual method, validate coordinate format
      if (!newAddress.longitude || !newAddress.latitude) {
        validationErrors.push(
          "Both longitude and latitude are required for manual entry"
        );
      } else {
        // Validate coordinate ranges
        const longitude = parseFloat(newAddress.longitude);
        const latitude = parseFloat(newAddress.latitude);

        if (isNaN(longitude) || isNaN(latitude)) {
          validationErrors.push("Longitude and latitude must be valid numbers");
        } else {
          // Validate longitude range (-180 to 180)
          if (longitude < -180 || longitude > 180) {
            validationErrors.push("Longitude must be between -180 and 180");
          }

          // Validate latitude range (-90 to 90)
          if (latitude < -90 || latitude > 90) {
            validationErrors.push("Latitude must be between -90 and 90");
          }

          // Validate Kenyan coordinates (approximate bounds)
          if (
            longitude < 33.5 ||
            longitude > 42.0 ||
            latitude < -4.8 ||
            latitude > 5.5
          ) {
            console.warn(
              "⚠️ [VALIDATION] Coordinates appear to be outside Kenya bounds"
            );
            // This is just a warning, not an error
          }
        }
      }
    }

    // 4. Validate location length
    if (newAddress.location && newAddress.location.length < 5) {
      validationErrors.push(
        "Location description is too short (minimum 5 characters)"
      );
    }

    // 5. Validate status
    if (!newAddress.status || newAddress.status.trim() === "") {
      validationErrors.push("Status is required");
    }

    // Show validation errors if any
    if (validationErrors.length > 0) {
      console.error("❌ [FORM SUBMIT] Validation errors:", validationErrors);
      toast({
        title: "Validation Failed",
        description: validationErrors.join(". ") + ".",
        variant: "destructive",
      });
      return;
    }

    // Additional coordinate validation for final submission
    const longitude = parseFloat(newAddress.longitude);
    const latitude = parseFloat(newAddress.latitude);

    if (isNaN(longitude) || isNaN(latitude)) {
      console.error("❌ [FORM SUBMIT] Invalid coordinate values:", {
        longitude: newAddress.longitude,
        latitude: newAddress.latitude,
      });
      toast({
        title: "Invalid Coordinates",
        description: "Longitude and latitude must be valid numbers.",
        variant: "destructive",
      });
      return;
    }

    console.log("✅ [FORM SUBMIT] Validation passed, submitting address");

    const address = {
      id: `temp-${Date.now()}`,
      ...newAddress,
      longitude: longitude,
      latitude: latitude,
      isPrimary: newAddress.isPrimary === "true",
    };

    onAddAddress(address);

    // Reset form
    setNewAddress({
      type: "",
      location: "",
      longitude: "",
      latitude: "",
      status: "active",
      isPrimary: "false",
    });
    setIsOpen(false);

    toast({
      title: "Address Added!",
      description: `Address "${address.location}" has been successfully added.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription>
            Search for a location using Google Maps or enter coordinates
            manually.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddAddress} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">
              Address Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={newAddress.type}
              onValueChange={(value) =>
                setNewAddress({ ...newAddress, type: value })
              }
            >
              <SelectTrigger
                className={
                  newAddress.type ? "border-green-500" : "border-red-500"
                }
              >
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="Office">Office / Work</SelectItem>
                <SelectItem value="Relative">Relative</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {!newAddress.type && (
              <p className="text-sm text-red-500">
                Please select an address type
              </p>
            )}
          </div>

          <Tabs
            value={inputMethod}
            onValueChange={(value) =>
              setInputMethod(value as "search" | "manual")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="search"
                className="flex items-center space-x-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Search Location</span>
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                className="flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Manual Entry</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="search-location">
                  Search for Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    key={`search-input-${isOpen ? "open" : "closed"}`}
                    ref={searchInputRef}
                    id="search-location"
                    placeholder="Start typing an address (e.g., Westlands, Nairobi)..."
                    value={newAddress.location}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, location: e.target.value })
                    }
                    className={`pl-10 ${
                      newAddress.location &&
                      newAddress.location.length >= 5 &&
                      newAddress.longitude &&
                      newAddress.latitude
                        ? "border-green-500"
                        : newAddress.location && newAddress.location.length >= 5
                        ? "border-yellow-500"
                        : "border-red-500"
                    }`}
                    required
                  />
                </div>
                {!newAddress.location && (
                  <p className="text-sm text-red-500">
                    Please enter a location
                  </p>
                )}
                {newAddress.location && newAddress.location.length < 5 && (
                  <p className="text-sm text-yellow-500">
                    Location description is too short (minimum 5 characters)
                  </p>
                )}
                {newAddress.location &&
                  newAddress.location.length >= 5 &&
                  !newAddress.longitude && (
                    <p className="text-sm text-yellow-500">
                      Select a location from the suggestions to get coordinates
                    </p>
                  )}
                {newAddress.location &&
                  newAddress.longitude &&
                  newAddress.latitude && (
                    <p className="text-sm text-green-500">
                      ✓ Location and coordinates are ready
                    </p>
                  )}
                {!isGoogleMapsLoaded ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <p className="text-xs text-amber-800 font-medium">
                      ⏳ Loading Google Maps... If this takes too long, please
                      use Manual Entry tab.
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-xs text-green-800 font-medium">
                      ✅ Google Maps Ready! Start typing to see suggestions.
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Type an address and select from the suggestions. Coordinates
                  will be automatically populated when you select a suggestion.
                  If no suggestions appear, use the "Manual Entry" tab or the
                  "Lookup Coords" button below.
                </p>

                {/* API Status Warning */}
                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                  <p className="text-blue-800 font-medium">
                    ℹ️ Autocomplete Status
                  </p>
                  <p className="text-blue-600">
                    If suggestions don't appear, the Google Maps API may have
                    restrictions. Use the "Manual Entry" tab as an alternative.
                  </p>
                </div>

                {/* Coordinate status indicator */}
                {newAddress.longitude && newAddress.latitude ? (
                  <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                    <p className="text-green-800 font-medium">
                      ✅ Coordinates Detected
                    </p>
                    <p className="text-green-600">
                      Lat: {newAddress.latitude}, Lng: {newAddress.longitude}
                    </p>
                  </div>
                ) : (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    <p className="text-yellow-800 font-medium">
                      ⚠️ No Coordinates Yet
                    </p>
                    <p className="text-yellow-600">
                      Select a location from the dropdown to get coordinates
                    </p>
                  </div>
                )}

                {/* Current form state display */}
                <div className="p-2 bg-gray-50 border border-gray-200 rounded text-xs">
                  <p className="text-gray-800 font-medium">
                    📋 Current Form State:
                  </p>
                  <div className="mt-1 space-y-1 text-gray-600">
                    <p>
                      <strong>Location:</strong>{" "}
                      {newAddress.location || "Not set"}
                    </p>
                    <p>
                      <strong>Longitude:</strong>{" "}
                      {newAddress.longitude || "Not set"}
                    </p>
                    <p>
                      <strong>Latitude:</strong>{" "}
                      {newAddress.latitude || "Not set"}
                    </p>
                    <p>
                      <strong>Type:</strong> {newAddress.type || "Not set"}
                    </p>
                  </div>
                </div>

                {/* Manual coordinate lookup button */}
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      console.log("🧪 [TEST] Testing autocomplete manually...");
                      const input = document.getElementById(
                        "search-location"
                      ) as HTMLInputElement;
                      if (input && autocompleteRef.current) {
                        console.log("🧪 [TEST] Input element found:", input);
                        console.log(
                          "🧪 [TEST] Autocomplete ref:",
                          autocompleteRef.current
                        );

                        // Try to get the current place
                        const place = autocompleteRef.current.getPlace();
                        console.log("🧪 [TEST] Current place:", place);

                        if (
                          place &&
                          place.geometry &&
                          place.geometry.location
                        ) {
                          const lng = place.geometry.location.lng();
                          const lat = place.geometry.location.lat();
                          const formattedAddress =
                            place.formatted_address || place.name || "";

                          setNewAddress((prev) => ({
                            ...prev,
                            location: formattedAddress,
                            longitude: lng.toString(),
                            latitude: lat.toString(),
                          }));

                          toast({
                            title: "Manual Test Success",
                            description: `Found: ${formattedAddress} - ${lat}, ${lng}`,
                          });
                        } else {
                          // If getPlace() doesn't work, try geocoding the input value
                          const inputValue = input.value;
                          console.log(
                            "🧪 [TEST] Trying geocoding for:",
                            inputValue
                          );

                          if (inputValue && inputValue.length >= 3) {
                            const geocoder = new window.google.maps.Geocoder();
                            geocoder.geocode(
                              { address: inputValue },
                              (results, status) => {
                                console.log(
                                  "🧪 [TEST] Geocoding results:",
                                  results
                                );

                                if (
                                  status === "OK" &&
                                  results &&
                                  results.length > 0
                                ) {
                                  const result = results[0];
                                  const location = result.geometry.location;
                                  const lng = location.lng();
                                  const lat = location.lat();
                                  const formattedAddress =
                                    result.formatted_address || inputValue;

                                  setNewAddress((prev) => ({
                                    ...prev,
                                    location: formattedAddress,
                                    longitude: lng.toString(),
                                    latitude: lat.toString(),
                                  }));

                                  toast({
                                    title: "Geocoding Test Success",
                                    description: `Found: ${formattedAddress} - ${lat}, ${lng}`,
                                  });
                                } else {
                                  toast({
                                    title: "Test Failed",
                                    description:
                                      "Could not geocode the address",
                                    variant: "destructive",
                                  });
                                }
                              }
                            );
                          } else {
                            toast({
                              title: "Manual Test",
                              description:
                                "No place data available. Try typing and selecting a suggestion first.",
                              variant: "destructive",
                            });
                          }
                        }
                      } else {
                        toast({
                          title: "Manual Test",
                          description: "Autocomplete not initialized",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    🧪 Test Selection
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      console.log("🧹 [CLEAR] Clearing form state...");
                      setNewAddress({
                        addressType: "",
                        location: "",
                        longitude: "",
                        latitude: "",
                        status: "Active",
                        isPrimary: false,
                      });

                      // Clear the input field
                      const input = document.getElementById(
                        "search-location"
                      ) as HTMLInputElement;
                      if (input) {
                        input.value = "";
                      }

                      toast({
                        title: "Form Cleared",
                        description: "All form fields have been reset",
                      });
                    }}
                    className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    🧹 Clear Form
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      console.log(
                        "🌐 [GEOCODE] Looking up coordinates for:",
                        newAddress.location
                      );
                      if (
                        newAddress.location &&
                        newAddress.location.length > 3
                      ) {
                        // Use a CORS-friendly geocoding service
                        const encodedLocation = encodeURIComponent(
                          newAddress.location + ", Kenya"
                        );

                        // Try multiple geocoding services for better reliability
                        const geocodingServices = [
                          `https://api.geoapify.com/v1/geocode/search?text=${encodedLocation}&apiKey=YOUR_API_KEY&limit=1`,
                          `https://geocode.maps.co/search?q=${encodedLocation}&limit=1`,
                          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0&localityLanguage=en`,
                        ];

                        // For now, let's use a simple hardcoded approach for common Kenyan locations
                        const knownLocations = {
                          "Westlands, Nairobi": {
                            lat: "-1.2674",
                            lon: "36.8083",
                          },
                          Nairobi: { lat: "-1.2921", lon: "36.8219" },
                          Mombasa: { lat: "-4.0435", lon: "39.6682" },
                          Kisumu: { lat: "-0.0917", lon: "34.7680" },
                          Nakuru: { lat: "-0.3072", lon: "36.0800" },
                          Eldoret: { lat: "0.5143", lon: "35.2698" },
                          Thika: { lat: "-1.0333", lon: "37.0833" },
                          Malindi: { lat: "-3.2175", lon: "40.1191" },
                        };

                        // Check if we have a known location
                        const locationKey = Object.keys(knownLocations).find(
                          (key) =>
                            newAddress.location
                              .toLowerCase()
                              .includes(key.toLowerCase())
                        );

                        if (locationKey) {
                          const coords = knownLocations[locationKey];
                          setNewAddress((prev) => ({
                            ...prev,
                            longitude: coords.lon,
                            latitude: coords.lat,
                          }));
                          toast({
                            title: "Coordinates Found",
                            description: `Found coordinates for ${locationKey}`,
                          });
                          console.log(
                            "🌐 [GEOCODE] Using known location:",
                            coords
                          );
                        } else {
                          // Fallback: try a simple fetch with CORS proxy
                          const proxyUrl = `https://cors-anywhere.herokuapp.com/https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}&limit=1`;

                          fetch(proxyUrl, {
                            headers: {
                              "X-Requested-With": "XMLHttpRequest",
                            },
                          })
                            .then((response) => {
                              if (!response.ok) {
                                throw new Error("Network response was not ok");
                              }
                              return response.json();
                            })
                            .then((data) => {
                              console.log("🌐 [GEOCODE] Response:", data);
                              if (data && data.length > 0) {
                                const result = data[0];
                                setNewAddress((prev) => ({
                                  ...prev,
                                  longitude: result.lon,
                                  latitude: result.lat,
                                }));
                                toast({
                                  title: "Coordinates Found",
                                  description: `Found coordinates for ${newAddress.location}`,
                                });
                              } else {
                                throw new Error("No results found");
                              }
                            })
                            .catch((error) => {
                              console.error("❌ [GEOCODE] Error:", error);
                              toast({
                                title: "Geocoding Not Available",
                                description:
                                  "Please use Manual Entry tab or contact support for coordinates",
                                variant: "destructive",
                              });
                            });
                        }
                      } else {
                        toast({
                          title: "Enter Location First",
                          description:
                            "Please enter a location before looking up coordinates",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="px-3 py-1 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  >
                    🌐 Manual Lookup
                  </button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="manual-location">
                  Full Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="manual-location"
                  placeholder="Enter the complete address"
                  value={newAddress.location}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, location: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="longitude">
                    Longitude <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 36.8219"
                    value={newAddress.longitude}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        longitude: e.target.value,
                      })
                    }
                    className={`${
                      newAddress.longitude &&
                      !isNaN(parseFloat(newAddress.longitude)) &&
                      parseFloat(newAddress.longitude) >= -180 &&
                      parseFloat(newAddress.longitude) <= 180
                        ? "border-green-500"
                        : newAddress.longitude &&
                          (isNaN(parseFloat(newAddress.longitude)) ||
                            parseFloat(newAddress.longitude) < -180 ||
                            parseFloat(newAddress.longitude) > 180)
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    East-West position (-180 to 180)
                  </p>
                  {newAddress.longitude &&
                    isNaN(parseFloat(newAddress.longitude)) && (
                      <p className="text-sm text-red-500">
                        Please enter a valid number
                      </p>
                    )}
                  {newAddress.longitude &&
                    !isNaN(parseFloat(newAddress.longitude)) &&
                    (parseFloat(newAddress.longitude) < -180 ||
                      parseFloat(newAddress.longitude) > 180) && (
                      <p className="text-sm text-red-500">
                        Longitude must be between -180 and 180
                      </p>
                    )}
                  {newAddress.longitude &&
                    !isNaN(parseFloat(newAddress.longitude)) &&
                    parseFloat(newAddress.longitude) >= 33.5 &&
                    parseFloat(newAddress.longitude) <= 42.0 && (
                      <p className="text-sm text-green-500">
                        ✓ Valid Kenyan longitude
                      </p>
                    )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude">
                    Latitude <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g., -1.2921"
                    value={newAddress.latitude}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, latitude: e.target.value })
                    }
                    className={`${
                      newAddress.latitude &&
                      !isNaN(parseFloat(newAddress.latitude)) &&
                      parseFloat(newAddress.latitude) >= -90 &&
                      parseFloat(newAddress.latitude) <= 90
                        ? "border-green-500"
                        : newAddress.latitude &&
                          (isNaN(parseFloat(newAddress.latitude)) ||
                            parseFloat(newAddress.latitude) < -90 ||
                            parseFloat(newAddress.latitude) > 90)
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    North-South position (-90 to 90)
                  </p>
                  {newAddress.latitude &&
                    isNaN(parseFloat(newAddress.latitude)) && (
                      <p className="text-sm text-red-500">
                        Please enter a valid number
                      </p>
                    )}
                  {newAddress.latitude &&
                    !isNaN(parseFloat(newAddress.latitude)) &&
                    (parseFloat(newAddress.latitude) < -90 ||
                      parseFloat(newAddress.latitude) > 90) && (
                      <p className="text-sm text-red-500">
                        Latitude must be between -90 and 90
                      </p>
                    )}
                  {newAddress.latitude &&
                    !isNaN(parseFloat(newAddress.latitude)) &&
                    parseFloat(newAddress.latitude) >= -4.8 &&
                    parseFloat(newAddress.latitude) <= 5.5 && (
                      <p className="text-sm text-green-500">
                        ✓ Valid Kenyan latitude
                      </p>
                    )}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-xs text-blue-800">
                  <strong>Tip:</strong> You can find coordinates by
                  right-clicking on Google Maps and selecting "What's here?"
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Show coordinates preview when using search method */}
          {inputMethod === "search" &&
            (newAddress.longitude || newAddress.latitude) && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-800 font-medium mb-1">
                  📍 Coordinates Detected:
                </p>
                <p className="text-xs text-green-700">
                  Longitude: {newAddress.longitude} | Latitude:{" "}
                  {newAddress.latitude}
                </p>
              </div>
            )}

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={newAddress.status}
              onValueChange={(value) =>
                setNewAddress({ ...newAddress, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Primary Address</Label>
            <RadioGroup
              value={newAddress.isPrimary}
              onValueChange={(value) =>
                setNewAddress({ ...newAddress, isPrimary: value })
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="primary-yes" />
                <Label
                  htmlFor="primary-yes"
                  className="text-sm font-normal cursor-pointer"
                >
                  Yes, make this primary
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="primary-no" />
                <Label
                  htmlFor="primary-no"
                  className="text-sm font-normal cursor-pointer"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Validation Status Indicator */}
          {(() => {
            const validationErrors: string[] = [];

            if (!newAddress.type || newAddress.type.trim() === "") {
              validationErrors.push("Address type is required");
            }
            if (!newAddress.location || newAddress.location.trim() === "") {
              validationErrors.push("Location is required");
            }
            if (newAddress.location && newAddress.location.length < 5) {
              validationErrors.push("Location description is too short");
            }
            if (!newAddress.longitude || !newAddress.latitude) {
              validationErrors.push("Coordinates are required");
            } else {
              const longitude = parseFloat(newAddress.longitude);
              const latitude = parseFloat(newAddress.latitude);

              if (isNaN(longitude) || isNaN(latitude)) {
                validationErrors.push("Invalid coordinate format");
              } else {
                if (longitude < -180 || longitude > 180) {
                  validationErrors.push("Longitude out of range");
                }
                if (latitude < -90 || latitude > 90) {
                  validationErrors.push("Latitude out of range");
                }
              }
            }

            if (validationErrors.length === 0) {
              return (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-800 font-medium">
                    ✅ Form is ready to submit
                  </p>
                  <p className="text-xs text-green-700">
                    All required fields are filled and valid
                  </p>
                </div>
              );
            } else {
              return (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800 font-medium">
                    ⚠️ Form validation errors:
                  </p>
                  <ul className="text-xs text-red-700 mt-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              );
            }
          })()}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            disabled={(() => {
              return (
                !newAddress.type ||
                !newAddress.location ||
                newAddress.location.length < 5 ||
                !newAddress.longitude ||
                !newAddress.latitude ||
                isNaN(parseFloat(newAddress.longitude)) ||
                isNaN(parseFloat(newAddress.latitude)) ||
                parseFloat(newAddress.longitude) < -180 ||
                parseFloat(newAddress.longitude) > 180 ||
                parseFloat(newAddress.latitude) < -90 ||
                parseFloat(newAddress.latitude) > 90
              );
            })()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressForm;
