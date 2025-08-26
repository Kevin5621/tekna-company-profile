'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { 
  Briefcase, 
  Plus, 
  Search, 
  Star, 
  Clock, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  MapPin,
  Settings,
  TrendingUp,
  FileText,
  ArrowLeft
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { 
  CareerService, 
  CareerPosition, 
  CareerCategory
} from '@/lib/services/career'
import { DashboardBreadcrumb } from '@/components/ui/dashboard-breadcrumb';
import BackButton from '@/components/ui/back-button';

export default function CareerManagementPage() {
  const [positions, setPositions] = useState<CareerPosition[]>([])
  const [categories, setCategories] = useState<CareerCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  const careerService = useMemo(() => new CareerService(), [])

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [
        positionsData, 
        categoriesData
      ] = await Promise.all([
        careerService.getAllPositions(),
        careerService.getAllCategories()
      ])

      setPositions(positionsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Failed to load career data:', error)
    } finally {
      setLoading(false)
    }
  }, [careerService])

  useEffect(() => {
    loadData()
  }, [loadData])

  const stats = useMemo(() => {
    return {
      totalPositions: positions.length,
      openPositions: positions.filter(p => p.status === 'open').length,
      totalApplications: positions.reduce((sum, p) => sum + p.applications_count, 0),
      featuredPositions: positions.filter(p => p.featured).length
    }
  }, [positions])

  const filteredPositions = useMemo(() => {
    return positions.filter((position) => {
      const matchesSearch = position.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           position.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || position.status === filterStatus
      const matchesCategory = filterCategory === 'all' || position.category_id === filterCategory
      
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [positions, searchQuery, filterStatus, filterCategory])

  const handleToggleFeatured = async (positionId: string, currentFeatured: boolean) => {
    try {
      await careerService.updatePosition(positionId, { featured: !currentFeatured })
      await loadData()
    } catch (error) {
      console.error('Failed to toggle featured status:', error)
    }
  }

  const handleDeletePosition = async (positionId: string) => {
    if (confirm('Are you sure you want to delete this position?')) {
      try {
        await careerService.deletePosition(positionId)
        await loadData()
      } catch (error) {
        console.error('Failed to delete position:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
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
          { label: "Manajemen Karir", isCurrentPage: true }
        ]}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Career Management</h1>
          <p className="text-muted-foreground">
            Manage job positions, categories, and applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/career/categories">
              <Settings className="h-4 w-4 mr-2" />
              Categories
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/career/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Position
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPositions}</div>
            <p className="text-xs text-muted-foreground">
              All job positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openPositions}</div>
            <p className="text-xs text-muted-foreground">
              Currently accepting applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              All applications received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuredPositions}</div>
            <p className="text-xs text-muted-foreground">
              Featured positions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Link href="/dashboard/career/applications">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage job applications
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/career/categories">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage job categories
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/career/locations">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage work locations
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/career/types">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Briefcase className="mr-2 h-4 w-4" />
                Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage job types
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/career/levels">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage career levels
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-md transition-shadow cursor-pointer opacity-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search positions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Positions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Positions ({filteredPositions.length})</CardTitle>
          <CardDescription>
            Manage all job positions in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPositions.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No positions found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by creating a new position'}
              </p>
              {!searchQuery && filterStatus === 'all' && filterCategory === 'all' && (
                <div className="mt-6">
                  <Link href="/dashboard/career/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Position
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPositions.map((position) => (
                  <TableRow key={position.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{position.title}</span>
                          {position.featured && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {position.urgent && (
                            <Badge variant="destructive">Urgent</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {position.category?.name} • {position.location?.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          position.status === 'open' ? 'default' : 
                          position.status === 'closed' ? 'secondary' : 
                          position.status === 'filled' ? 'outline' : 'destructive'
                        }
                      >
                        {position.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{position.type?.name || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {position.applications_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        {position.views_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(position.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/career/${position.slug}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Public
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/career/edit/${position.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleFeatured(position.id, position.featured)}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            {position.featured ? 'Remove Featured' : 'Make Featured'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeletePosition(position.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
