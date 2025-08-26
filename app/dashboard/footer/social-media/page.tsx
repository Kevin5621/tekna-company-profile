'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit, Trash2, Share2, ArrowLeft } from "lucide-react"
import { FooterService } from "@/lib/services/footer"
import { SocialMedia } from "@/lib/services/footer"
import { toast } from "sonner"
import Link from "next/link"

export default function SocialMediaPage() {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSocial, setEditingSocial] = useState<SocialMedia | null>(null)
  const [formData, setFormData] = useState({
    platform: '',
    icon: '',
    url: '',
    color: '',
    sort_order: 0,
    is_active: true
  })

  const footerService = useMemo(() => new FooterService(), [])

  const loadSocialMedia = useCallback(async () => {
    try {
      const data = await footerService.getSocialMedia()
      setSocialMedia(data)
    } catch (error) {
      console.error('Error loading social media:', error)
      toast.error('Failed to load social media')
    } finally {
      setLoading(false)
    }
  }, [footerService])

  useEffect(() => {
    loadSocialMedia()
  }, [loadSocialMedia])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingSocial) {
        await footerService.updateSocialMedia(editingSocial.id, formData)
        toast.success('Social media updated successfully')
      } else {
        await footerService.createSocialMedia(formData)
        toast.success('Social media created successfully')
      }
      
      setDialogOpen(false)
      resetForm()
      loadSocialMedia()
    } catch (error) {
      console.error('Error saving social media:', error)
      toast.error('Failed to save social media')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social media?')) return

    try {
      await footerService.deleteSocialMedia(id)
      toast.success('Social media deleted successfully')
      loadSocialMedia()
    } catch (error) {
      console.error('Error deleting social media:', error)
      toast.error('Failed to delete social media')
    }
  }

  const resetForm = () => {
    setFormData({
      platform: '',
      icon: '',
      url: '',
      color: '',
      sort_order: 0,
      is_active: true
    })
    setEditingSocial(null)
  }

  const openEditDialog = (social: SocialMedia) => {
    setEditingSocial(social)
    setFormData({
      platform: social.platform,
      icon: social.icon,
      url: social.url,
      color: social.color || '',
      sort_order: social.sort_order,
      is_active: social.is_active
    })
    setDialogOpen(true)
  }

  const openCreateDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  if (loading) {
    return <div className="container mx-auto py-6">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/footer">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Footer Management
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Social Media</h1>
            <p className="text-muted-foreground">
              Manage social media platforms and links
            </p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Social Media
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSocial ? 'Edit Social Media' : 'Create New Social Media'}
              </DialogTitle>
              <DialogDescription>
                {editingSocial 
                  ? 'Update the social media details below'
                  : 'Fill in the details to create a new social media link'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Input
                    id="platform"
                    value={formData.platform}
                    onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                    placeholder="e.g., Facebook, Twitter, Instagram"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="Icon name (lucide-react)"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Color (optional)</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="e.g., #1DA1F2, blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSocial ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {socialMedia.map((social) => (
          <Card key={social.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ 
                      backgroundColor: social.color || '#6b7280',
                      color: 'white'
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{social.platform}</CardTitle>
                    <CardDescription>Order: {social.sort_order}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={social.is_active ? "default" : "secondary"}>
                    {social.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Icon:</span> {social.icon}
                </div>
                <div className="text-sm">
                  <span className="font-medium">URL:</span>{' '}
                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {social.url}
                  </a>
                </div>
                {social.color && (
                  <div className="text-sm">
                    <span className="font-medium">Color:</span> {social.color}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(social.created_at).toLocaleDateString()}
                  {social.updated_at && (
                    <>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      Updated: {new Date(social.updated_at).toLocaleDateString()}
                    </>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(social)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(social.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {socialMedia.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-12 text-center">
                <Share2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No social media found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first social media platform
                </p>
                <Button onClick={openCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Social Media
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
