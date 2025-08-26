'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { CareerService, CareerLevel } from '@/lib/services/career'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, Plus, Save, X, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { DashboardBreadcrumb } from '@/components/ui/dashboard-breadcrumb';
import BackButton from '@/components/ui/back-button';

interface Level extends CareerLevel {
  positions_count?: number
}

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    years_min: '',
    years_max: ''
  })

  const careerService = useMemo(() => new CareerService(), [])

  const loadLevels = useCallback(async () => {
    try {
      const data = await careerService.getAllLevels()
      // Get position counts for each level
      const levelsWithCounts = await Promise.all(
        data.map(async (level: CareerLevel) => {
          const positions = await careerService.getPositionsByLevel(level.id)
          return {
            ...level,
            positions_count: positions.length
          }
        })
      )
      setLevels(levelsWithCounts)
    } catch (error) {
      console.error('Error loading levels:', error)
      toast.error('Failed to load levels')
    } finally {
      setLoading(false)
    }
  }, [careerService])

  useEffect(() => {
    loadLevels()
  }, [loadLevels])

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.years_min.trim()) {
      toast.error('Level name and minimum years are required')
      return
    }

    const yearsMin = parseInt(formData.years_min)
    const yearsMax = formData.years_max ? parseInt(formData.years_max) : null

    if (isNaN(yearsMin) || yearsMin < 0) {
      toast.error('Minimum years must be a valid number')
      return
    }

    if (yearsMax !== null && (isNaN(yearsMax) || yearsMax < yearsMin)) {
      toast.error('Maximum years must be greater than minimum years')
      return
    }

    try {
      await careerService.createLevel({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        years_min: yearsMin,
        years_max: yearsMax
      })
      
      toast.success('Level created successfully')
      setFormData({ name: '', description: '', years_min: '', years_max: '' })
      setShowAddForm(false)
      loadLevels()
    } catch (error) {
      console.error('Error creating level:', error)
      toast.error('Failed to create level')
    }
  }

  const handleEdit = async (id: string) => {
    const level = levels.find(l => l.id === id)
    if (!level) return

    if (!formData.name.trim() || !formData.years_min.trim()) {
      toast.error('Level name and minimum years are required')
      return
    }

    const yearsMin = parseInt(formData.years_min)
    const yearsMax = formData.years_max ? parseInt(formData.years_max) : null

    if (isNaN(yearsMin) || yearsMin < 0) {
      toast.error('Minimum years must be a valid number')
      return
    }

    if (yearsMax !== null && (isNaN(yearsMax) || yearsMax < yearsMin)) {
      toast.error('Maximum years must be greater than minimum years')
      return
    }

    try {
      await careerService.updateLevel(id, {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        years_min: yearsMin,
        years_max: yearsMax
      })

      toast.success('Level updated successfully')
      setEditingId(null)
      setFormData({ name: '', description: '', years_min: '', years_max: '' })
      loadLevels()
    } catch (error) {
      console.error('Error updating level:', error)
      toast.error('Failed to update level')
    }
  }

  const handleDelete = async (id: string) => {
    const level = levels.find(l => l.id === id)
    if (!level) return

    if (level.positions_count && level.positions_count > 0) {
      toast.error(`Cannot delete level. It has ${level.positions_count} positions.`)
      return
    }

    if (!confirm(`Are you sure you want to delete "${level.name}"?`)) return

    try {
      await careerService.deleteLevel(id)
      toast.success('Level deleted successfully')
      loadLevels()
    } catch (error) {
      console.error('Error deleting level:', error)
      toast.error('Failed to delete level')
    }
  }

  const startEdit = (level: Level) => {
    setEditingId(level.id)
    setFormData({
      name: level.name,
      description: level.description || '',
      years_min: level.years_min.toString(),
      years_max: level.years_max?.toString() || ''
    })
    setShowAddForm(false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ name: '', description: '', years_min: '', years_max: '' })
  }

  const startAdd = () => {
    setShowAddForm(true)
    setEditingId(null)
    setFormData({ name: '', description: '', years_min: '', years_max: '' })
  }

  const formatExperience = (yearsMin: number, yearsMax?: number | null) => {
    if (yearsMax) {
      return `${yearsMin}-${yearsMax} years`
    }
    return `${yearsMin}+ years`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading levels...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <DashboardBreadcrumb 
        items={[
          { label: "Karir", href: "/dashboard/career" },
          { label: "Level Karir", href: "/dashboard/career/levels" },
          { label: "Manajemen Level", isCurrentPage: true }
        ]}
      />

      {/* Back Button */}
      <div className="flex items-center gap-4">
        <BackButton href="/dashboard/career" label="Kembali ke Career" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Career Levels</h1>
          <p className="text-muted-foreground">
            Manage job experience levels and seniority
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Level
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Level</CardTitle>
            <CardDescription>Create a new job position level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="add-name">Name *</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter level name (e.g., Entry Level, Senior)"
              />
            </div>
            <div>
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter level description (optional)"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-years-min">Minimum Years of Experience *</Label>
                <Input
                  id="add-years-min"
                  type="number"
                  min="0"
                  value={formData.years_min}
                  onChange={(e) => setFormData({ ...formData, years_min: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="add-years-max">Maximum Years of Experience</Label>
                <Input
                  id="add-years-max"
                  type="number"
                  min="0"
                  value={formData.years_max}
                  onChange={(e) => setFormData({ ...formData, years_max: e.target.value })}
                  placeholder="Leave empty for no maximum"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" onClick={() => {
                setShowAddForm(false)
                setFormData({ name: '', description: '', years_min: '', years_max: '' })
              }} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Levels List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {levels.map((level) => (
          <Card key={level.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editingId === level.id ? (
                    <div className="space-y-2">
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Level name"
                      />
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Level description (optional)"
                        rows={2}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={formData.years_min}
                          onChange={(e) => setFormData({ ...formData, years_min: e.target.value })}
                          placeholder="Min years"
                        />
                        <Input
                          type="number"
                          min="0"
                          value={formData.years_max}
                          onChange={(e) => setFormData({ ...formData, years_max: e.target.value })}
                          placeholder="Max years"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-lg">{level.name}</CardTitle>
                      </div>
                      <CardDescription>
                        {formatExperience(level.years_min, level.years_max)}
                        {level.description && (
                          <div className="mt-1">{level.description}</div>
                        )}
                      </CardDescription>
                    </>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  {editingId === level.id ? (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(level.id)}>
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => startEdit(level)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(level.id)}
                        disabled={Boolean(level.positions_count && level.positions_count > 0)}
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
                  {level.positions_count || 0} positions
                </Badge>
                <Badge variant={level.is_active ? "default" : "secondary"}>
                  {level.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {levels.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground">No levels found.</p>
              <Button onClick={startAdd} className="mt-4">
                Add your first level
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
