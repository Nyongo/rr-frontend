import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Edit, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCustomers } from "@/hooks/useCustomers";

const schoolSchema = z.object({
  schoolLogo: z.any().optional(), // Changed to any to handle File objects
  schoolName: z.string().min(1, "School name is required"),
  customerId: z.number().min(1, "Customer selection is required"),
  schoolUrl: z.string().optional(),
  schoolAddress: z.string().min(1, "School address is required"),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
  principalName: z.string().min(1, "Principal name is required"),
  principalEmail: z.string().email("Invalid principal email address"),
  principalPhone: z.string().min(1, "Principal phone number is required"),
  emailAddress: z.string().email("Invalid school email address"),
  phoneNumber: z.string().min(1, "School phone number is required"),
  status: z.enum(["active", "inactive"]),
});

type SchoolFormData = z.infer<typeof schoolSchema>;

interface SchoolFormProps {
  school?: any;
  onSubmit: (data: SchoolFormData) => void;
  trigger?: React.ReactNode;
}

export const SchoolForm = ({ school, onSubmit, trigger }: SchoolFormProps) => {
  const [open, setOpen] = useState(false);
  const { customers, loading: customersLoading } = useCustomers();

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      schoolLogo: school?.schoolLogo || undefined,
      schoolName: school?.name || "",
      customerId: school?.customerId || 0,
      schoolUrl: school?.schoolUrl || "",
      schoolAddress: school?.address || "",
      longitude: school?.longitude || "",
      latitude: school?.latitude || "",
      principalName: school?.principalName || "",
      principalEmail: school?.principalEmail || "",
      principalPhone: school?.principalPhone || "",
      emailAddress: school?.email || "",
      phoneNumber: school?.phone || "",
      status: school?.status?.toLowerCase() || "active",
    },
  });

  const handleSubmit = (data: SchoolFormData) => {
    onSubmit(data);
    setOpen(false);
    form.reset();
  };

  // Auto-generate school URL based on school name
  const handleSchoolNameChange = (value: string) => {
    const urlFriendlyName = value
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");
    form.setValue("schoolUrl", `${urlFriendlyName}.rocketroll.solutions`);
  };

  // Mock function to simulate address-based coordinate lookup
  const handleAddressChange = (value: string) => {
    // In a real app, this would use a geocoding service
    // For now, we'll use mock coordinates
    form.setValue("longitude", "-87.6298");
    form.setValue("latitude", "41.8781");
  };

  const defaultTrigger = school ? (
    <Button variant="outline" size="sm">
      <Edit className="w-4 h-4 mr-2" />
      Edit
    </Button>
  ) : (
    <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white">
      <Plus className="w-4 h-4 mr-2" />
      Add School
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{school ? "Edit School" : "Add New School"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="schoolLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Logo (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file || undefined);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-gray-500 text-sm">
                          PNG, JPG or JPEG (MAX. 5MB)
                        </p>
                        {field.value && (
                          <p className="text-green-600 text-sm mt-2">
                            Selected: {field.value.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter school name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleSchoolNameChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            customersLoading
                              ? "Loading customers..."
                              : "Select customer"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem
                          key={customer.id}
                          value={customer.id.toString()}
                        >
                          {customer.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schoolUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="schoolname.rocketroll.solutions"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schoolAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Address *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter complete school address"
                      className="min-h-[80px]"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleAddressChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Longitude will be autofilled"
                        disabled
                        className="bg-gray-50 text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Latitude will be autofilled"
                        disabled
                        className="bg-gray-50 text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="principalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principal Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter principal's full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="principalEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="principal@school.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="principalPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="+254700123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="principal@school.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 555-0123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {school ? "Update School" : "Add School"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SchoolForm;
