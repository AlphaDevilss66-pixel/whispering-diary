
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Bell, 
  Globe, 
  Lock, 
  Shield, 
  Eye, 
  Smartphone, 
  FileText, 
  Mail,
  User
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || "",
    fullName: profile?.full_name || "",
    bio: profile?.bio || "",
    email: user?.email || "",
    notifications: true,
    darkMode: false,
    publicProfile: true
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await updateProfile({
        username: formData.username,
        full_name: formData.fullName,
        bio: formData.bio
      });
      
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteAccount = () => {
    // Show confirmation dialog before deleting
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast.error("This feature is not yet implemented", {
        description: "Account deletion will be available in a future update."
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F6F7]">
      <NavBar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="page-container">
          <div className="mb-8">
            <h1 className="text-3xl font-medium">Settings</h1>
            <p className="text-gray-600">Manage your account preferences</p>
          </div>
          
          <div className="grid md:grid-cols-[240px_1fr] gap-8">
            {/* Settings Navigation */}
            <div className="ios-card p-4 h-fit">
              <nav className="space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl text-primary"
                >
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl text-gray-600"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl text-gray-600"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Privacy
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl text-gray-600"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Security
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl text-gray-600"
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Appearance
                </Button>
              </nav>
            </div>
            
            {/* Settings Content */}
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="ios-card p-6">
                <h2 className="text-xl font-medium mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Username</label>
                      <Input 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="ios-input"
                        placeholder="Your username"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="ios-input"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="ios-input"
                      placeholder="Tell us about yourself"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              {/* Email Section */}
              <div className="ios-card p-6">
                <h2 className="text-xl font-medium mb-4">Email Address</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      name="email"
                      value={formData.email}
                      readOnly
                      className="ios-input bg-gray-100"
                    />
                    <p className="text-xs text-muted-foreground">
                      To change your email, please contact support
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Preferences Section */}
              <div className="ios-card p-6">
                <h2 className="text-xl font-medium mb-4">Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your account activity
                      </p>
                    </div>
                    <Switch 
                      checked={formData.notifications} 
                      onCheckedChange={(checked) => handleToggleChange("notifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Dark Mode</h3>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark theme
                      </p>
                    </div>
                    <Switch 
                      checked={formData.darkMode} 
                      onCheckedChange={(checked) => handleToggleChange("darkMode", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Public Profile</h3>
                      <p className="text-sm text-muted-foreground">
                        Allow others to view your profile
                      </p>
                    </div>
                    <Switch 
                      checked={formData.publicProfile} 
                      onCheckedChange={(checked) => handleToggleChange("publicProfile", checked)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                  variant="destructive"
                  className="rounded-xl"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl"
                    onClick={() => navigate("/profile")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 rounded-xl"
                    onClick={handleProfileUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
