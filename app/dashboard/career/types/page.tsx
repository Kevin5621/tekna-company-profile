"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CareerService, CareerType } from "@/lib/services/career";
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
import { Plus, Edit2, Trash2, Briefcase, Building2 } from "lucide-react";
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
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
          try {
            const positions = await careerService.getPositionsByType(type.id);
            return { ...type, positions_count: positions.length };
          } catch (error) {
            console.error(`Error getting positions for type ${type.id}:`, error);
            return { ...type, positions_count: 0 };
          }
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
      resetForm();
      loadTypes();
    } catch (error) {
      console.error("Error creating type:", error);
      toast.error("Failed to create type");
    }
  };

  const handleEdit = async (id: string) => {
    if (!formData.name.trim()) {
      toast.error("Type name is required");
      return;
    }

    try {
      await careerService.updateType(id, {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
      });

      toast.success("Type updated successfully");
      resetForm();
      loadTypes();
    } catch (error) {
      console.error("Error updating type:", error);
      toast.error("Failed to update type");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await careerService.deleteType(id);
      toast.success("Type deleted successfully");
      setShowDeleteConfirm(null);
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

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ name: "", description: "" });
  };

  const startAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  const confirmDelete = (type: Type) => {
    if (type.positions_count && type.positions_count > 0) {
      toast.error(
        `Cannot delete type. It has ${type.positions_count} positions.`
      );
      return;
    }
    setShowDeleteConfirm(type.id);
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
          { label: "Career", href: "/dashboard/career" },
          { label: "Career Types", href: "/dashboard/career/types" },
          { label: "Type Management", isCurrentPage: true },
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard/career" label="Back to Career" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Types</h1>
          <p className="text-muted-foreground">
            Manage employment types and arrangements
          </p>
        </div>
        <Button onClick={startAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Type
        </Button>
      </div>

      {/* Add/Edit Form */}
      <Dialog open={showAddForm || editingId !== null} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Job Type" : "Add New Job Type"}
            </DialogTitle>
            <DialogDescription>
              {editingId 
                ? "Update the job type information below."
                : "Create a new employment type for job positions."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Type Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Full-time, Part-time, Contract"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this employment type..."
                rows={3}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              onClick={() => editingId ? handleEdit(editingId) : handleAdd()}
              disabled={!formData.name.trim()}
            >
              {editingId ? "Update Type" : "Create Type"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm !== null} onOpenChange={() => setShowDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{types.find(t => t.id === showDeleteConfirm)?.name}&rdquo;? 
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

      {/* Types Grid */}
      {types.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {types.map((type) => (
            <Card key={type.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          <Building2 className="h-3 w-3 mr-1" />
                          {type.positions_count || 0} positions
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(type)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => confirmDelete(type)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      disabled={(type.positions_count || 0) > 0}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {type.description && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {type.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No job types yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create employment types to categorize your job positions by work arrangement.
                </p>
                <Button onClick={startAdd} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Type
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
