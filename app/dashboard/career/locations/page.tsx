"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CareerService, CareerLocation } from "@/lib/services/career";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Plus, Save, X, MapPin, Wifi } from "lucide-react";
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
          const positions = await careerService.getPositionsByLocation(
            location.id
          );
          return {
            ...location,
            positions_count: positions.length,
          };
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
        timezone: formData.timezone.trim() || "UTC",
        is_remote: formData.is_remote,
      });

      toast.success("Location created successfully");
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        country: "",
        timezone: "",
        is_remote: false,
      });
      setShowAddForm(false);
      loadLocations();
    } catch (error) {
      console.error("Error creating location:", error);
      toast.error("Failed to create location");
    }
  };

  const handleEdit = async (id: string) => {
    const location = locations.find((l) => l.id === id);
    if (!location) return;

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
        timezone: formData.timezone.trim() || "UTC",
        is_remote: formData.is_remote,
      });

      toast.success("Location updated successfully");
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
      loadLocations();
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location");
    }
  };

  const handleDelete = async (id: string) => {
    const location = locations.find((l) => l.id === id);
    if (!location) return;

    if (location.positions_count && location.positions_count > 0) {
      toast.error(
        `Cannot delete location. It has ${location.positions_count} positions.`
      );
      return;
    }

    if (!confirm(`Are you sure you want to delete "${location.name}"?`)) return;

    try {
      await careerService.deleteLocation(id);
      toast.success("Location deleted successfully");
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

  const cancelEdit = () => {
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
          { label: "Karir", href: "/dashboard/career" },
          { label: "Lokasi Karir", href: "/dashboard/career/locations" },
          { label: "Manajemen Lokasi", isCurrentPage: true },
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard/career" label="Kembali ke Career" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Career Locations
          </h1>
          <p className="text-muted-foreground">
            Manage job locations and remote work settings
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Location</CardTitle>
            <CardDescription>
              Create a new job position location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-name">Name *</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter location name"
                />
              </div>
              <div>
                <Label htmlFor="add-city">City *</Label>
                <Input
                  id="add-city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Enter city"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-state">State/Province</Label>
                <Input
                  id="add-state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  placeholder="Enter state or province"
                />
              </div>
              <div>
                <Label htmlFor="add-country">Country *</Label>
                <Input
                  id="add-country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  placeholder="Enter country"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="add-address">Address</Label>
              <Textarea
                id="add-address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Enter full address (optional)"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-timezone">Timezone</Label>
                <Input
                  id="add-timezone"
                  value={formData.timezone}
                  onChange={(e) =>
                    setFormData({ ...formData, timezone: e.target.value })
                  }
                  placeholder="e.g., UTC, Asia/Jakarta"
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="add-remote"
                  checked={formData.is_remote}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_remote: checked === true })
                  }
                />
                <Label htmlFor="add-remote" className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  Remote location
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAdd} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
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
                }}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locations List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editingId === location.id ? (
                    <div className="space-y-3">
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Location name"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          placeholder="City"
                        />
                        <Input
                          value={formData.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              country: e.target.value,
                            })
                          }
                          placeholder="Country"
                        />
                      </div>
                      <Input
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        placeholder="State/Province"
                      />
                      <Input
                        value={formData.timezone}
                        onChange={(e) =>
                          setFormData({ ...formData, timezone: e.target.value })
                        }
                        placeholder="Timezone"
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-remote-${location.id}`}
                          checked={formData.is_remote}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              is_remote: checked === true,
                            })
                          }
                        />
                        <Label
                          htmlFor={`edit-remote-${location.id}`}
                          className="flex items-center gap-2"
                        >
                          <Wifi className="h-3 w-3" />
                          Remote
                        </Label>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-lg">
                          {location.name}
                        </CardTitle>
                        {location.is_remote && (
                          <Badge variant="secondary" className="text-xs">
                            <Wifi className="h-3 w-3 mr-1" />
                            Remote
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {location.city}
                        {location.state && `, ${location.state}`}
                        {`, ${location.country}`}
                        {location.timezone && (
                          <div className="text-xs mt-1">
                            Timezone: {location.timezone}
                          </div>
                        )}
                      </CardDescription>
                    </>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  {editingId === location.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(location.id)}
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(location)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(location.id)}
                        disabled={Boolean(
                          location.positions_count &&
                            location.positions_count > 0
                        )}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  {location.positions_count || 0} positions
                </Badge>
                <Badge variant={location.is_active ? "default" : "secondary"}>
                  {location.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {locations.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground">No locations found.</p>
              <Button onClick={startAdd} className="mt-4">
                Add your first location
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
