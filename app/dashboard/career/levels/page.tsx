"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CareerService, CareerLevel } from "@/lib/services/career";
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
import { Plus, Edit2, Trash2, TrendingUp, Building2, Clock } from "lucide-react";
import { toast } from "sonner";
import { DashboardBreadcrumb } from "@/components/ui/dashboard-breadcrumb";
import BackButton from "@/components/ui/back-button";

interface Level extends CareerLevel {
  positions_count?: number;
}

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    years_min: "",
    years_max: "",
  });

  const careerService = useMemo(() => new CareerService(), []);

  const loadLevels = useCallback(async () => {
    try {
      const data = await careerService.getAllLevels();
      // Get position counts for each level
      const levelsWithCounts = await Promise.all(
        data.map(async (level: CareerLevel) => {
          try {
            const positions = await careerService.getPositionsByLevel(level.id);
            return { ...level, positions_count: positions.length };
          } catch (error) {
            console.error(`Error getting positions for level ${level.id}:`, error);
            return { ...level, positions_count: 0 };
          }
        })
      );
      setLevels(levelsWithCounts);
    } catch (error) {
      console.error("Error loading levels:", error);
      toast.error("Failed to load levels");
    } finally {
      setLoading(false);
    }
  }, [careerService]);

  useEffect(() => {
    loadLevels();
  }, [loadLevels]);

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.years_min.trim()) {
      toast.error("Level name and minimum years are required");
      return;
    }

    const yearsMin = parseInt(formData.years_min);
    const yearsMax = formData.years_max ? parseInt(formData.years_max) : null;

    if (isNaN(yearsMin) || yearsMin < 0) {
      toast.error("Minimum years must be a valid number");
      return;
    }

    if (yearsMax !== null && (isNaN(yearsMax) || yearsMax < yearsMin)) {
      toast.error("Maximum years must be greater than minimum years");
      return;
    }

    try {
      await careerService.createLevel({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        years_min: yearsMin,
        years_max: yearsMax,
      });

      toast.success("Level created successfully");
      resetForm();
      loadLevels();
    } catch (error) {
      console.error("Error creating level:", error);
      toast.error("Failed to create level");
    }
  };

  const handleEdit = async (id: string) => {
    if (!formData.name.trim() || !formData.years_min.trim()) {
      toast.error("Level name and minimum years are required");
      return;
    }

    const yearsMin = parseInt(formData.years_min);
    const yearsMax = formData.years_max ? parseInt(formData.years_max) : null;

    if (isNaN(yearsMin) || yearsMin < 0) {
      toast.error("Minimum years must be a valid number");
      return;
    }

    if (yearsMax !== null && (isNaN(yearsMax) || yearsMax < yearsMin)) {
      toast.error("Maximum years must be greater than minimum years");
      return;
    }

    try {
      await careerService.updateLevel(id, {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        years_min: yearsMin,
        years_max: yearsMax,
      });

      toast.success("Level updated successfully");
      resetForm();
      loadLevels();
    } catch (error) {
      console.error("Error updating level:", error);
      toast.error("Failed to update level");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await careerService.deleteLevel(id);
      toast.success("Level deleted successfully");
      setShowDeleteConfirm(null);
      loadLevels();
    } catch (error) {
      console.error("Error deleting level:", error);
      toast.error("Failed to delete level");
    }
  };

  const startEdit = (level: Level) => {
    setEditingId(level.id);
    setFormData({
      name: level.name,
      description: level.description || "",
      years_min: level.years_min.toString(),
      years_max: level.years_max?.toString() || "",
    });
    setShowAddForm(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ name: "", description: "", years_min: "", years_max: "" });
  };

  const startAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({ name: "", description: "", years_min: "", years_max: "" });
  };

  const confirmDelete = (level: Level) => {
    if (level.positions_count && level.positions_count > 0) {
      toast.error(
        `Cannot delete level. It has ${level.positions_count} positions.`
      );
      return;
    }
    setShowDeleteConfirm(level.id);
  };

  const formatExperience = (yearsMin: number, yearsMax?: number | null) => {
    if (yearsMax) {
      return `${yearsMin}-${yearsMax} years`;
    }
    return `${yearsMin}+ years`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading levels...</p>
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
          { label: "Career Levels", href: "/dashboard/career/levels" },
          { label: "Level Management", isCurrentPage: true },
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard/career" label="Back to Career" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Career Levels</h1>
          <p className="text-muted-foreground">
            Manage career progression levels and experience requirements
          </p>
        </div>
        <Button onClick={startAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Level
        </Button>
      </div>

      {/* Add/Edit Form */}
      <Dialog open={showAddForm || editingId !== null} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Career Level" : "Add New Career Level"}
            </DialogTitle>
            <DialogDescription>
              {editingId 
                ? "Update the career level information below."
                : "Create a new career level with experience requirements."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Level Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Junior, Senior, Principal"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="years_min">Minimum Years *</Label>
                <Input
                  id="years_min"
                  type="number"
                  min="0"
                  value={formData.years_min}
                  onChange={(e) => setFormData({ ...formData, years_min: e.target.value })}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="years_max">Maximum Years</Label>
                <Input
                  id="years_max"
                  type="number"
                  min="0"
                  value={formData.years_max}
                  onChange={(e) => setFormData({ ...formData, years_max: e.target.value })}
                  placeholder="Optional"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this career level..."
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
              disabled={!formData.name.trim() || !formData.years_min.trim()}
            >
              {editingId ? "Update Level" : "Create Level"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm !== null} onOpenChange={() => setShowDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Career Level</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{levels.find(l => l.id === showDeleteConfirm)?.name}&rdquo;? 
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

      {/* Levels Grid */}
      {levels.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {levels.map((level) => (
            <Card key={level.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{level.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {formatExperience(level.years_min, level.years_max)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          <Building2 className="h-3 w-3 mr-1" />
                          {level.positions_count || 0} positions
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(level)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => confirmDelete(level)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      disabled={(level.positions_count || 0) > 0}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {level.description && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {level.description}
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
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No career levels yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create career levels to define progression paths and experience requirements.
                </p>
                <Button onClick={startAdd} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Level
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
