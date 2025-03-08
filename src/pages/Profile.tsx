
import { useState } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Edit, 
  Save, 
  Camera, 
  Mail, 
  Key,
  LogOut
} from "lucide-react";

const Profile = () => {
  // User profile state
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    bio: "Writer, thinker, and avid traveler. I use this platform to reflect on my experiences and connect with others on similar journeys.",
    avatar: "", // URL would go here
    notifications: {
      comments: true,
      likes: true,
      mentions: true,
      newsletters: false,
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (key: keyof typeof profile.notifications) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };
  
  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to a backend
    console.log("Saving profile:", profile);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="page-container">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-semibold">Your Profile</h1>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-medium mb-1">{profile.name}</h2>
                <p className="text-gray-500 text-sm mb-4">{profile.email}</p>
                <div className="flex justify-center">
                  <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                </div>
              </div>
              
              <div className="glass-card p-6 mt-6">
                <h3 className="text-lg font-medium mb-4">Account</h3>
                <ul className="space-y-2">
                  <li>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" /> Personal Info
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" /> Privacy
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" /> Notifications
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" /> Settings
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive/90">
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
                      <span>Personal Information</span>
                      {!isEditing && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      )}
                    </h3>
                    
                    <div className="space-y-6">
                      {isEditing ? (
                        <>
                          <div className="flex flex-col mb-4">
                            <div className="mb-6">
                              <Label htmlFor="avatar" className="block mb-3">Profile Picture</Label>
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={profile.avatar} alt={profile.name} />
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {profile.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <Button variant="outline" size="sm" className="gap-2">
                                  <Camera className="h-4 w-4" /> Upload New
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="name">Name</Label>
                                <Input 
                                  id="name" 
                                  name="name" 
                                  value={profile.name}
                                  onChange={handleProfileChange}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                  id="email" 
                                  name="email" 
                                  type="email" 
                                  value={profile.email}
                                  onChange={handleProfileChange}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea 
                                  id="bio" 
                                  name="bio" 
                                  value={profile.bio}
                                  onChange={handleProfileChange}
                                  rows={4}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <Button onClick={handleSaveProfile}>
                              <Save className="h-4 w-4 mr-2" /> Save Changes
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                            <div>
                              <div className="text-sm font-medium text-gray-500 mb-1">Name</div>
                              <div>{profile.name}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-500 mb-1">Email</div>
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                {profile.email}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">Bio</div>
                            <p>{profile.bio}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="glass-card p-6 mt-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Key className="h-5 w-5" /> Security
                    </h3>
                    <div className="space-y-4">
                      <Button variant="outline">Change Password</Button>
                      <p className="text-sm text-gray-500">
                        We recommend using a strong, unique password that you don't use elsewhere.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="privacy">
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-medium mb-4">Privacy Preferences</h3>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Profile Visibility</h4>
                            <p className="text-sm text-gray-500">Control who can see your profile information</p>
                          </div>
                          <div>
                            <select className="p-2 rounded-md border border-gray-200">
                              <option>Public</option>
                              <option>Friends Only</option>
                              <option>Private</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Default Diary Privacy</h4>
                            <p className="text-sm text-gray-500">Set the default privacy for new diary entries</p>
                          </div>
                          <div>
                            <select className="p-2 rounded-md border border-gray-200">
                              <option>Private</option>
                              <option>Anonymous Public</option>
                              <option>Public</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Anonymous Sharing</h4>
                            <p className="text-sm text-gray-500">Allow your public entries to be shared anonymously</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Comment Permissions</h4>
                            <p className="text-sm text-gray-500">Control who can comment on your public entries</p>
                          </div>
                          <div>
                            <select className="p-2 rounded-md border border-gray-200">
                              <option>Everyone</option>
                              <option>Approved Users Only</option>
                              <option>Nobody</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100">
                        <Button>Save Privacy Settings</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications">
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Comments</h4>
                            <p className="text-sm text-gray-500">Receive notifications when someone comments on your entries</p>
                          </div>
                          <Switch
                            checked={profile.notifications.comments}
                            onCheckedChange={() => handleNotificationChange('comments')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Likes</h4>
                            <p className="text-sm text-gray-500">Receive notifications when someone likes your entries</p>
                          </div>
                          <Switch
                            checked={profile.notifications.likes}
                            onCheckedChange={() => handleNotificationChange('likes')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Mentions</h4>
                            <p className="text-sm text-gray-500">Receive notifications when you're mentioned in a comment</p>
                          </div>
                          <Switch
                            checked={profile.notifications.mentions}
                            onCheckedChange={() => handleNotificationChange('mentions')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Email Newsletter</h4>
                            <p className="text-sm text-gray-500">Receive weekly digests and updates</p>
                          </div>
                          <Switch
                            checked={profile.notifications.newsletters}
                            onCheckedChange={() => handleNotificationChange('newsletters')}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100">
                        <Button>Save Notification Preferences</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
