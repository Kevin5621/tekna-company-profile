"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { FooterService } from "@/lib/services/footer";
import { ContactInfo } from "@/lib/services/footer";
import { toast } from "sonner";
import Link from "next/link";

export default function ContactInfoPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(
    null
  );
  const [formData, setFormData] = useState({
    type: "",
    icon: "",
    label: "",
    value: "",
    href: "",
    sort_order: 0,
    is_active: true,
  });

  const footerService = useMemo(() => new FooterService(), []);

  const loadContactInfo = useCallback(async () => {
    try {
      const data = await footerService.getContactInfo();
      setContactInfo(data);
    } catch (error) {
      console.error("Error loading contact info:", error);
      toast.error("Failed to load contact information");
    } finally {
      setLoading(false);
    }
  }, [footerService]);

  useEffect(() => {
    loadContactInfo();
  }, [loadContactInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingContact) {
        await footerService.updateContactInfo(editingContact.id, formData);
        toast.success("Contact info updated successfully");
      } else {
        await footerService.createContactInfo(formData);
        toast.success("Contact info created successfully");
      }

      setDialogOpen(false);
      resetForm();
      loadContactInfo();
    } catch (error) {
      console.error("Error saving contact info:", error);
      toast.error("Failed to save contact info");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact info?")) return;

    try {
      await footerService.deleteContactInfo(id);
      toast.success("Contact info deleted successfully");
      loadContactInfo();
    } catch (error) {
      console.error("Error deleting contact info:", error);
      toast.error("Failed to delete contact info");
    }
  };

  const resetForm = () => {
    setFormData({
      type: "",
      icon: "",
      label: "",
      value: "",
      href: "",
      sort_order: 0,
      is_active: true,
    });
    setEditingContact(null);
  };

  const openEditDialog = (contact: ContactInfo) => {
    setEditingContact(contact);
    setFormData({
      type: contact.type,
      icon: contact.icon,
      label: contact.label,
      value: contact.value,
      href: contact.href || "",
      sort_order: contact.sort_order,
      is_active: contact.is_active,
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "phone":
        return Phone;
      case "email":
        return Mail;
      case "address":
        return MapPin;
      default:
        return Phone;
    }
  };

  if (loading) {
    return <div className="container mx-auto py-6">Loading...</div>;
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
            <h1 className="text-3xl font-bold tracking-tight">
              Contact Information
            </h1>
            <p className="text-muted-foreground">
              Manage contact details displayed in the footer
            </p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact Info
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingContact
                  ? "Edit Contact Info"
                  : "Create New Contact Info"}
              </DialogTitle>
              <DialogDescription>
                {editingContact
                  ? "Update the contact information details below"
                  : "Fill in the details to create new contact information"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, type: e.target.value }))
                    }
                    placeholder="e.g., phone, email, address"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, icon: e.target.value }))
                    }
                    placeholder="Icon name (lucide-react)"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="label">Label</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
                    placeholder="e.g., Phone, Email, Address"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    placeholder="The actual contact value"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="href">Link (optional)</Label>
                  <Input
                    id="href"
                    value={formData.href}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, href: e.target.value }))
                    }
                    placeholder="tel:+1234567890, mailto:email@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sort_order: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_active: checked }))
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingContact ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contactInfo.map((contact) => {
          const IconComponent = getTypeIcon(contact.type);
          return (
            <Card key={contact.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{contact.label}</CardTitle>
                      <CardDescription>
                        Type: {contact.type} • Order: {contact.sort_order}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={contact.is_active ? "default" : "secondary"}
                    >
                      {contact.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Value:</span> {contact.value}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Icon:</span> {contact.icon}
                  </div>
                  {contact.href && (
                    <div className="text-sm">
                      <span className="font-medium">Link:</span>{" "}
                      <a
                        href={contact.href}
                        className="text-blue-600 hover:underline break-all"
                      >
                        {contact.href}
                      </a>
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(contact.created_at).toLocaleDateString()}
                    {contact.updated_at && (
                      <>
                        <Separator
                          orientation="vertical"
                          className="mx-2 h-4"
                        />
                        Updated:{" "}
                        {new Date(contact.updated_at).toLocaleDateString()}
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(contact)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {contactInfo.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-12 text-center">
                <Phone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No contact information found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first contact information
                </p>
                <Button onClick={openCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact Info
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
