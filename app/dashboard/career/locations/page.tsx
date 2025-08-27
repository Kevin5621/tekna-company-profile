"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CareerService, CareerLocation } from "@/lib/services/career";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit2, Trash2, MapPin, Building2, Wifi } from "lucide-react";
import { toast } from "sonner";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import BackButton from "@/components/ui/back-button";

interface Location extends CareerLocation {
  positions_count?: number;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    timezone: "",
    is_remote: false,
  });

  const careerService = useMemo(() => new CareerService(), []);

  const loadLocations = useCallback(async () => {
    try {
      const data = await careerService.getAllLocations();
      // Get position counts for each location
      const locationsWithCounts = await Promise.all(
        data.map(async (location: CareerLocation) => {
          try {
            const positions = await careerService.getPositionsByLocation(location.id);
            return { ...location, positions_count: positions.length };
          } catch (error) {
            console.error(`Error getting positions for location ${location.id}:`, error);
            return { ...location, positions_count: 0 };
          }
        })
      );
      setLocations(locationsWithCounts);
    } catch (error) {
      console.error("Error loading locations:", error);
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  }, [careerService]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const handleAdd = async () => {
    if (
      !formData.name.trim() ||
      !formData.city.trim() ||
      !formData.country.trim()
    ) {
      toast.error("Name, city, and country are required");
      return;
    }

    try {
      await careerService.createLocation({
        name: formData.name.trim(),
        address: formData.address.trim() || null,
        city: formData.city.trim(),
        state: formData.state.trim() || null,
        country: formData.country.trim(),
        timezone: formData.timezone.trim(),
        is_remote: formData.is_remote,
      });

      toast.success("Location created successfully");
      resetForm();
      loadLocations();
    } catch (error) {
      console.error("Error creating location:", error);
      toast.error("Failed to create location");
    }
  };

  const handleEdit = async (id: string) => {
    if (
      !formData.name.trim() ||
      !formData.city.trim() ||
      !formData.country.trim()
    ) {
      toast.error("Name, city, and country are required");
      return;
    }

    try {
      await careerService.updateLocation(id, {
        name: formData.name.trim(),
        address: formData.address.trim() || null,
        city: formData.city.trim(),
        state: formData.state.trim() || null,
        country: formData.country.trim(),
        timezone: formData.timezone.trim(),
        is_remote: formData.is_remote,
      });

      toast.success("Location updated successfully");
      resetForm();
      loadLocations();
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await careerService.deleteLocation(id);
      toast.success("Location deleted successfully");
      setShowDeleteConfirm(null);
      loadLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location");
    }
  };

  const startEdit = (location: Location) => {
    setEditingId(location.id);
    setFormData({
      name: location.name,
      address: location.address || "",
      city: location.city,
      state: location.state || "",
      country: location.country,
      timezone: location.timezone,
      is_remote: location.is_remote,
    });
    setShowAddForm(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      timezone: "",
      is_remote: false,
    });
  };

  const startAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      timezone: "",
      is_remote: false,
    });
  };

  const confirmDelete = (location: Location) => {
    if (location.positions_count && location.positions_count > 0) {
      toast.error(
        `Cannot delete location. It has ${location.positions_count} positions.`
      );
      return;
    }
    setShowDeleteConfirm(location.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb
        items={[
          { label: "Career", href: "/dashboard/career" },
          { label: "Career Locations", href: "/dashboard/career/locations" },
          { label: "Location Management", isCurrentPage: true },
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard/career" label="Back to Career" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Locations</h1>
          <p className="text-muted-foreground">
            Manage work locations and remote options
          </p>
        </div>
        <Button onClick={startAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Location
        </Button>
      </div>

      {/* Add/Edit Form */}
      <Dialog open={showAddForm || editingId !== null} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Location" : "Add New Location"}
            </DialogTitle>
            <DialogDescription>
              {editingId 
                ? "Update the location information below."
                : "Create a new work location for job positions."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Location Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Jakarta Office"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., Jakarta"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g., DKI Jakarta"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g., Indonesia"
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address (optional)"
                rows={2}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                placeholder="e.g., Asia/Jakarta"
                className="mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_remote"
                checked={formData.is_remote}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, is_remote: checked as boolean })
                }
              />
              <Label htmlFor="is_remote">Remote work available</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              onClick={() => editingId ? handleEdit(editingId) : handleAdd()}
              disabled={!formData.name.trim() || !formData.city.trim() || !formData.country.trim()}
            >
              {editingId ? "Update Location" : "Create Location"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm !== null} onOpenChange={() => setShowDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{locations.find(l => l.id === showDeleteConfirm)?.name}&rdquo;? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Locations Grid */}
      {locations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Card key={location.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {location.city}, {location.country}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          <Building2 className="h-3 w-3 mr-1" />
                          {location.positions_count || 0} positions
                        </Badge>
                        {location.is_remote && (
                          <Badge variant="outline" className="text-xs">
                            <Wifi className="h-3 w-3 mr-1" />
                            Remote
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(location)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => confirmDelete(location)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      disabled={(location.positions_count || 0) > 0}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-muted-foreground">
                  {location.address && (
                    <p className="line-clamp-2">{location.address}</p>
                  )}
                  {location.timezone && (
                    <p>Timezone: {location.timezone}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No locations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create work locations to organize your job positions by geography.
                </p>
                <Button onClick={startAdd} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Location
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
