import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OptimizedDashboardLayout } from "@/components/optimized-dashboard-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/http";
import { Save, Upload } from "lucide-react";

const roles = [
  { id: "admin", name: "Admin" },
  { id: "manager", name: "Manager" },
  { id: "user", name: "User" },
];

export default function CreateAdmin() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [role, setRole] = useState(roles[0].id);
  const [employeeId, setEmployeeId] = useState("");
  const [profilePreview, setProfilePreview] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setProfileFile(f);
    if (f) {
      const r = new FileReader();
      r.onload = (ev) => setProfilePreview(String(ev.target?.result ?? ""));
      r.readAsDataURL(f);
    } else {
      setProfilePreview("");
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !mobileNumber) {
      toast({ title: "Validation", description: "Please fill required fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("firstName", firstName);
      form.append("lastName", lastName);
      form.append("email", email);
      form.append("password", password || "");
      form.append("mobileNumber", mobileNumber);
      form.append("roleId", role);
      form.append("employeeId", employeeId || "");
      if (profileFile) form.append("profilePicture", profileFile);

      const res: any = await api.post("/api/admins/create", { body: form });
      const data = res?.data ?? res;

      toast({ title: "Admin Created", description: "Admin account created successfully." });
      navigate("/dashboard/admins");
    } catch (e: any) {
      toast({ title: "Create Failed", description: e?.message || "Failed to create admin.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <OptimizedDashboardLayout title="Create Admin">
      <div className="max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>First Name</Label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="optional, will be emailed if left blank" />
          </div>
          <div>
            <Label>Mobile Number</Label>
            <Input value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
          </div>
          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Employee ID</Label>
            <Input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border rounded-md">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
              </label>
              {profilePreview ? (
                <img src={profilePreview} alt="preview" className="w-16 h-16 rounded-md object-cover" />
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-6">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-brand-600 hover:bg-brand-700" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />Create Admin
          </Button>
        </div>
      </div>
    </OptimizedDashboardLayout>
  );
}
