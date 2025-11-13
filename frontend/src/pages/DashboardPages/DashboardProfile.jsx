import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  updateUserProfile,
  changeCurrentPassword,
  updateUserAvatar,
  selectProfileLoading,
  selectPasswordLoading,
  selectAvatarLoading,
  selectError,
  clearError,
} from "@/redux/slice/user/user.slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera } from "lucide-react";
import CustomAlert from "@/components/CustomAlert/CustomAlert";
import { toast } from "sonner";

// Zod schemas for validation
const profileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email(), // Email is read-only, but still good to have in schema
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const DashboardProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const error = useSelector(selectError);
  const profileLoading = useSelector(selectProfileLoading);
  const passwordLoading = useSelector(selectPasswordLoading);
  const avatarLoading = useSelector(selectAvatarLoading);

  const fileInputRef = useRef(null);

  // Form for Profile Information
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    setValue,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", email: "", phone: "" },
  });

  // Form for Password Change
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm({ resolver: zodResolver(passwordSchema) });

  // Populate form with user data on load
  useEffect(() => {
    if (user) {
      setValue("fullName", user.fullName);
      setValue("email", user.email);
      setValue("phone", String(user.phone));
    }
    return () => dispatch(clearError());
  }, [user, setValue, dispatch]);

  // Handlers for form submissions and avatar change
  const onProfileSubmit = (data) => {
    dispatch(updateUserProfile(data)).then((result) => {
      if (updateUserProfile.fulfilled.match(result)) {
        toast.success("Profile updated successfully!");
      }
    });
  };

  const onPasswordSubmit = (data) => {
    dispatch(changeCurrentPassword(data)).then((result) => {
      if (changeCurrentPassword.fulfilled.match(result)) {
        resetPasswordForm();
        toast.success("Password updated successfully!");
      }
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(updateUserAvatar(file));
    }
  };
  
  const getInitials = (name) => {
    if (!name) return "";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {error && <CustomAlert type="error" message={error} onClose={() => dispatch(clearError())} />}
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: AVATAR & INFO */}
        <div className="lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="relative mb-4">
            <Avatar className="w-40 h-40 border-4 border-muted">
              <AvatarImage src={user?.avatar?.secure_url} alt={user?.fullName} />
              <AvatarFallback className="text-5xl">{getInitials(user?.fullName)}</AvatarFallback>
            </Avatar>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            <Button
              size="icon"
              className="absolute bottom-2 right-2 rounded-full h-10 w-10"
              onClick={() => fileInputRef.current.click()}
              disabled={avatarLoading}
              type="button"
            >
              <Camera className="w-5 h-5" />
            </Button>
          </div>
          {avatarLoading && <p className="text-sm text-muted-foreground animate-pulse">Uploading...</p>}
          <h2 className="text-2xl font-semibold">{user?.fullName}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
          <p className="text-sm text-muted-foreground mt-2">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>

        {/* RIGHT COLUMN: TABS FOR FORMS */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Profile Information Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Make changes to your personal details here. Click save when you're done.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" {...registerProfile("fullName")} />
                      {profileErrors.fullName && <p className="text-sm text-destructive">{profileErrors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address (Read-only)</Label>
                      <Input id="email" type="email" {...registerProfile("email")} readOnly className="focus-visible:ring-0 cursor-not-allowed" />
                       {profileErrors.email && <p className="text-sm text-destructive">{profileErrors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" {...registerProfile("phone")} />
                      {profileErrors.phone && <p className="text-sm text-destructive">{profileErrors.phone.message}</p>}
                    </div>
                    <Button type="submit" disabled={profileLoading}>
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security / Password Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your security credentials. It's a good practice to use a strong password.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" {...registerPassword("currentPassword")} />
                      {passwordErrors.currentPassword && <p className="text-sm text-destructive">{passwordErrors.currentPassword.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" {...registerPassword("newPassword")} />
                      {passwordErrors.newPassword && <p className="text-sm text-destructive">{passwordErrors.newPassword.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" {...registerPassword("confirmPassword")} />
                      {passwordErrors.confirmPassword && <p className="text-sm text-destructive">{passwordErrors.confirmPassword.message}</p>}
                    </div>
                    <Button type="submit" disabled={passwordLoading}>
                      {passwordLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;