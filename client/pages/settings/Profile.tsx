import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Save } from "lucide-react";

export default function ProfileSettings() {
  const { toast } = useToast();
  const [name, setName] = useState("Yash Jain");
  const [email, setEmail] = useState("yash@ninjamap.com");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const save = () => {
    toast({ title: "Profile Saved", description: "Your profile changes have been saved." });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information and password.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="relative">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-[34px] text-muted-foreground"
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <Button onClick={save} className="inline-flex items-center">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
