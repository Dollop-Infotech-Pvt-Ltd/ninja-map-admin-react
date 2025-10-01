import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordVerify from "./pages/ForgotPasswordVerify";
import ResetPassword from "./pages/ResetPassword";
import OptimizedDashboard from "./pages/OptimizedDashboard";
import ProtectedRoute from "@/components/protected-route";
import UserManagement from "./pages/UserManagement";
import AdminManagement from "./pages/AdminManagement";
import CreateAdmin from "./pages/admins/CreateAdmin";
import AddUser from "./pages/AddUser";
import ProfileUpdate from "./pages/ProfileUpdate";
import RoleManagement from "./pages/RoleManagement";
import PermissionsManagement from "./pages/PermissionsManagement";
import BlogManagement from "./pages/BlogManagement";
import Queries from "./pages/Queries";
import NotFound from "./pages/NotFound";
import SettingsLayout from "./pages/settings/SettingsLayout";
import ProfileSettings from "./pages/settings/Profile";
import PrivacyPolicy from "./pages/settings/Privacy";
import TermsAndConditions from "./pages/settings/Tnc";
import FAQ from "./pages/settings/Faq";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="ninja-map-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password/verify" element={<ForgotPasswordVerify />} />
            <Route path="/forgot-password/reset" element={<ResetPassword />} />
            <Route path="/dashboard" element={
              // <ProtectedRoute>
              <OptimizedDashboard />
              // </ProtectedRoute>
            } />
            <Route path="/dashboard/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/dashboard/admins" element={<ProtectedRoute><AdminManagement /></ProtectedRoute>} />
            <Route path="/dashboard/admins/create" element={<ProtectedRoute><CreateAdmin /></ProtectedRoute>} />
            <Route path="/dashboard/users/add" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><ProfileUpdate /></ProtectedRoute>} />
            <Route path="/dashboard/roles" element={<ProtectedRoute><RoleManagement /></ProtectedRoute>} />
            <Route path="/dashboard/permissions" element={<ProtectedRoute><PermissionsManagement /></ProtectedRoute>} />
            <Route path="/dashboard/blogs" element={<ProtectedRoute><BlogManagement /></ProtectedRoute>} />
            <Route path="/dashboard/queries" element={<ProtectedRoute><Queries /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<ProfileSettings />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="tnc" element={<TermsAndConditions />} />
              <Route path="faq" element={<FAQ />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
