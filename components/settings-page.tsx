"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getUserByEmail, updateUserByEmail } from "@/actions";
import BottomNav from "./bottomNav";

interface SettingsPageProps {
  onLogout: () => void;
  onNavigate: (
    page: "home" | "transfers" | "invest" | "analytics" | "settings"
  ) => void;
}

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function SettingsPage({
  onLogout,
  onNavigate,
}: SettingsPageProps) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    gender: "",
    dateOfBirth: "",
    occupation: "",
    employerName: "",
    maritalStatus: "",
    ssn: "",
    hasPaidTransferFee: false,
    profileImageUrl: "",
  });

  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch user data on mount
  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      if (typeof window === "undefined") return;

      const identifier = localStorage.getItem("identifier");
      if (!identifier) {
        toast.error("No user identifier found");
        setLoading(false);
        return;
      }

      try {
        const data = await getUserByEmail(identifier);
        if (!data?.user) {
          throw new Error("User not found");
        }

        const user = data.user;
        if (!mounted) return;

        setUserData(user);

        setForm({
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          middleName: user.middleName ?? "",
          phone: user.phone ?? "",
          email: user.email ?? "",
          address: user.address ?? "",
          city: user.city ?? "",
          state: user.state ?? "",
          country: user.country ?? "",
          gender: user.gender ?? "",
          dateOfBirth: user.dateOfBirth
            ? new Date(user.dateOfBirth).toISOString().split("T")[0]
            : "",
          occupation: user.occupation ?? "",
          employerName: user.employerName ?? "",
          maritalStatus: user.maritalStatus ?? "",
          ssn: user.ssn ?? "",
          hasPaidTransferFee: user.hasPaidTransferFee ?? false,
          profileImageUrl: user.profileImageUrl ?? "",
        });
      } catch (err) {
        console.error(err);
        if (mounted) {
          toast.error("Failed to load user data");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();
    return () => {
      mounted = false;
    };
  }, []);

  // Upload image to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Instant local preview only (not sent to server)
    const reader = new FileReader();
    reader.onload = () => {
      // Store preview separately to avoid sending base64 to server
      const previewUrl = reader.result as string;
      setForm((prev) => ({ ...prev, profileImageUrl: previewUrl }));
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
    const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudinaryPreset || !cloudinaryCloudName) {
      toast.error("Cloudinary configuration missing");
      setUploading(false);
      return;
    }

    formData.append("upload_preset", cloudinaryPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();

      // Update form with Cloudinary URL (this is safe to send to server)
      handleChange("profileImageUrl", data.secure_url);

      // Immediately save the image URL to backend
      if (typeof window !== "undefined") {
        const identifier = localStorage.getItem("identifier");
        if (identifier) {
          await updateUserByEmail(identifier, {
            profileImageUrl: data.secure_url,
          });
          setUserData((prev) => ({
            ...prev,
            profileImageUrl: data.secure_url,
          }));
        }
      }

      toast.success("Profile image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
      // Revert to previous image
      handleChange("profileImageUrl", userData?.profileImageUrl ?? "");
    } finally {
      setUploading(false);
    }
  };

  // Validate email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Save all editable fields
  const handleSave = async () => {
    if (typeof window === "undefined") return;

    const identifier = localStorage.getItem("identifier");
    if (!identifier) {
      toast.error("No user identifier found");
      return;
    }

    // Validate required fields
    if (!form.firstName || !form.lastName) {
      toast.error("First name and last name are required");
      return;
    }

    if (!form.email || !isValidEmail(form.email)) {
      toast.error("Valid email is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        dateOfBirth: form.dateOfBirth
          ? new Date(form.dateOfBirth).toISOString()
          : null,
      };

      const updated = await updateUserByEmail(identifier, payload);

      if (!updated) {
        throw new Error("Update failed");
      }

      setUserData(updated);

      // Update identifier if email changed
      if (form.email !== identifier) {
        localStorage.setItem("identifier", form.email);
      }

      toast.success("Settings updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Show loading state while fetching initial data
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingOverlay />
      </div>
    );
  }

  // Show error state if no user data
  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">User Not Found</h2>
          <p className="text-muted-foreground">Unable to load your settings.</p>
          <Button onClick={onLogout} variant="outline">
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32 relative">
      {(saving || uploading) && <LoadingOverlay />}

      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
          <Button
            onClick={onLogout}
            variant="outline"
            className="h-10 text-sm bg-transparent"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="relative group">
                {form.profileImageUrl ? (
                  <img
                    src={form.profileImageUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow-lg transition-all group-hover:border-primary/40"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm text-muted-foreground border-4 border-primary/10">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <label htmlFor="profile-image-upload" className="cursor-pointer">
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  {uploading ? "Uploading..." : "Change Profile Image"}
                </div>
              </label>
            </div>

            {/* Editable fields */}
            <div>
              <Label className="mb-1">First Name *</Label>
              <Input
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                disabled={saving}
              />
            </div>

            <div>
              <Label className="mb-1">Last Name *</Label>
              <Input
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                disabled={saving}
              />
            </div>

            {[
              { field: "middleName", label: "Middle Name" },
              { field: "phone", label: "Phone" },
              { field: "email", label: "Email *" },
              { field: "address", label: "Address" },
              { field: "city", label: "City" },
              { field: "state", label: "State" },
              { field: "country", label: "Country" },
              { field: "gender", label: "Gender" },
              { field: "occupation", label: "Occupation" },
              { field: "employerName", label: "Employer Name" },
              { field: "maritalStatus", label: "Marital Status" },
              { field: "ssn", label: "SSN" },
            ].map(({ field, label }) => (
              <div key={field}>
                <Label className="mb-1">{label}</Label>
                <Input
                  value={(form as any)[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  disabled={saving}
                />
              </div>
            ))}

            {/* Date of Birth */}
            <div>
              <Label className="mb-1">Date of Birth</Label>
              <Input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                disabled={saving}
              />
            </div>

            {/* Boolean toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.hasPaidTransferFee}
                onChange={(e) =>
                  handleChange("hasPaidTransferFee", e.target.checked)
                }
                disabled={saving}
              />
              <Label>Has Paid Transfer Fee</Label>
            </div>

            {/* Read-only fields */}
            <div>
              <Label className="mb-1">Account Number</Label>
              <Input
                value={userData.accountNumber ?? ""}
                readOnly
                className="bg-muted"
              />
            </div>
            <div>
              <Label className="mb-1">Account Type</Label>
              <Input
                value={userData.accountType ?? ""}
                readOnly
                className="bg-muted"
              />
            </div>

            <Button
              className="w-full mt-4"
              onClick={handleSave}
              disabled={saving || uploading}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
