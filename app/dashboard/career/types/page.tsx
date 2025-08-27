"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CareerService, CareerType } from "@/lib/services/career";
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
import { Pencil, Trash2, Plus, Save, X, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import BackButton from "@/components/ui/back-button";

interface Type extends CareerType {
  positions_count?: number;
}

export default function TypesPage() {
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const careerService = useMemo(() => new CareerService(), []);

  const loadTypes = useCallback(async () => {
    try {
      const data = await careerService.getAllTypes();
      // Get position counts for each type
      const typesWithCounts = await Promise.all(
        data.map(async (type: CareerType) => {
          const positions = await careerService.getPositionsByType(type.id);
          return {
            ...type,
            positions_count: positions.length,
          };
        })
      );
      setTypes(typesWithCounts);
    } catch (error) {
      console.error("Error loading types:", error);
      toast.error("Failed to load types");
    } finally {
      setLoading(false);
    }
  }, [careerService]);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      toast.error("Type name is required");
      return;
    }

    try {
      await careerService.createType({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
      });

      toast.success("Type created successfully");
      setFormData({ name: "", description: "" });
      setShowAddForm(false);
      loadTypes();
    } catch (error) {
      console.error("Error creating type:", error);
      toast.error("Failed to create type");
    }
  };

  const handleEdit = async (id: string) => {
    const type = types.find((t) => t.id === id);
    if (!type) return;

    try {
      await careerService.updateType(id, {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
      });

      toast.success("Type updated successfully");
      setEditingId(null);
      setFormData({ name: "", description: "" });
      loadTypes();
    } catch (error) {
      console.error("Error updating type:", error);
      toast.error("Failed to update type");
    }
  };

  const handleDelete = async (id: string) => {
    const type = types.find((t) => t.id === id);
    if (!type) return;

    if (type.positions_count && type.positions_count > 0) {
      toast.error(
        `Cannot delete type. It has ${type.positions_count} positions.`
      );
      return;
    }

    if (!confirm(`Are you sure you want to delete "${type.name}"?`)) return;

    try {
      await careerService.deleteType(id);
      toast.success("Type deleted successfully");
      loadTypes();
    } catch (error) {
      console.error("Error deleting type:", error);
      toast.error("Failed to delete type");
    }
  };

  const startEdit = (type: Type) => {
    setEditingId(type.id);
    setFormData({
      name: type.name,
      description: type.description || "",
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  const startAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading types...</p>
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
          { label: "Tipe Karir", href: "/dashboard/career/types" },
          { label: "Manajemen Tipe", isCurrentPage: true },
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard/career" label="Kembali ke Career" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Career Types</h1>
          <p className="text-muted-foreground">
            Manage job employment types (Full-time, Part-time, Contract, etc.)
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Type
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Type</CardTitle>
            <CardDescription>Create a new job position type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="add-name">Name *</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter type name (e.g., Full-time, Part-time)"
              />
            </div>
            <div>
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter type description (optional)"
                rows={3}
              />
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
                  setFormData({ name: "", description: "" });
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

      {/* Types List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {types.map((type) => (
          <Card key={type.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editingId === type.id ? (
                    <div className="space-y-2">
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Type name"
                      />
                      <Textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Type description (optional)"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-lg">{type.name}</CardTitle>
                      </div>
                      {type.description && (
                        <CardDescription>{type.description}</CardDescription>
                      )}
                    </>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  {editingId === type.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(type.id)}
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
                        onClick={() => startEdit(type)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(type.id)}
                        disabled={Boolean(
                          type.positions_count && type.positions_count > 0
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
                  {type.positions_count || 0} positions
                </Badge>
                <Badge variant={type.is_active ? "default" : "secondary"}>
                  {type.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {types.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground">No types found.</p>
              <Button onClick={startAdd} className="mt-4">
                Add your first type
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
