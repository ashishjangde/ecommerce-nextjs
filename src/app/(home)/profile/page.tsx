import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Edit,
  User,
  ShoppingBag,
  CreditCard,
  Bell,
  Lock,
  MapPin,
  Heart,
  LogOut,
  Settings,
  Gift
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="container mt-16 mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="/api/placeholder/150/150"
                alt="Profile"
                className="rounded-full w-24 h-24 object-cover border-4 border-white shadow-lg"
              />
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute bottom-0 right-0 rounded-full"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sarah Anderson</h1>
              <p className="text-gray-500">Member since 2023</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Premium Member</Badge>
                <Badge variant="outline">Verified</Badge>
              </div>
            </div>
          </div>
          <Button variant={'default'} className="flex items-center bg-[#F31260] hover:bg-[#F31260]  gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid grid-cols-5 gap-4 w-full">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Wishlist
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue="Sarah Anderson" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="sarah@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>Manage your shipping addresses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge>Default</Badge>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="font-medium">Home</p>
                  <p className="text-sm text-gray-500">
                    123 Market Street
                    <br />
                    San Francisco, CA 94105
                    <br />
                    United States
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  <MapPin className="w-4 h-4 mr-2" />
                  Add New Address
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Order Updates</div>
                      <div className="text-sm text-gray-500">Receive updates about your orders</div>
                    </div>
                    <Button variant="outline" size="icon">
                      <Bell className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Promotions</div>
                      <div className="text-sm text-gray-500">Get notified about special offers</div>
                    </div>
                    <Button variant="outline" size="icon">
                      <Gift className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Enable Two-Factor Authentication
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>View and manage your orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((order) => (
                  <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Order #{Math.random().toString(36).substr(2, 9)}</p>
                      <p className="text-sm text-gray-500">Placed on {new Date().toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline">View Details</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
        {/* Other tab contents would go here */}
      </div>
   
  );
}