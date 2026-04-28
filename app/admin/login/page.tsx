"use client";

import { useState } from "react";
import { Button, Card, Typography, notification } from "antd";
import { Lock, Eye, EyeOff, LogIn, Email as EmailIcon } from "griddy-icons";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("Dralexaadmin@gmail.com");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      notification.warning({ message: "Please enter your email and password.", placement: "topRight" });
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      notification.error({
        message: "Login Failed",
        description: error.message,
        placement: "topRight",
      });
    } else {
      notification.success({ message: "Welcome back!", placement: "topRight" });
      router.push("/admin");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0d1b2a 0%, #1a2e44 50%, #0f3460 100%)",
      }}
    >
      <Card
        style={{
          width: 420,
          borderRadius: 20,
          boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "8px 0",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1677ff, #4096ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 28,
              boxShadow: "0 8px 24px rgba(22,119,255,0.35)",
            }}
          >
            <Lock style={{ width: 28, height: 28, color: '#fff' }} />
          </div>
          <Title level={3} style={{ margin: 0, color: "#1a3d5c" }}>
            Admin Sign In
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            AlexaHospital Staff Access
          </Text>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Email */}
          <div>
            <label
              htmlFor="admin-email"
              style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 6 }}
            >
              <EmailIcon style={{ width: 13, height: 13 }} /> Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              style={{
                width: "100%",
                padding: "11px 14px",
                border: "1.5px solid #d1d5db",
                borderRadius: 10,
                fontSize: 14,
                color: "#1a1a1a",
                background: "#f9fafb",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#1677ff")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          {/* Password with show/hide toggle */}
          <div>
            <label
              htmlFor="admin-password"
              style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 6 }}
            >
              <Lock style={{ width: 13, height: 13 }} /> Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "11px 46px 11px 14px",
                  border: "1.5px solid #d1d5db",
                  borderRadius: 10,
                  fontSize: 14,
                  color: "#1a1a1a",
                  background: "#f9fafb",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1677ff")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
              {/* Eye toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#1677ff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#9ca3af")}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword
                  ? <EyeOff style={{ width: 20, height: 20 }} />
                  : <Eye style={{ width: 20, height: 20 }} />
                }
              </button>
            </div>
          </div>

          {/* Sign In button */}
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{
              height: 48,
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 10,
              marginTop: 4,
              background: "linear-gradient(135deg, #1677ff, #4096ff)",
              border: "none",
              boxShadow: "0 4px 16px rgba(22,119,255,0.35)",
            }}
            onClick={() => {
              const form = document.querySelector("form");
              form?.requestSubmit();
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <LogIn style={{ width: 16, height: 16 }} /> Sign In
            </span>
          </Button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Are you a patient?{" "}
            <a href="/" style={{ color: "#1677ff", fontWeight: 600 }}>
              Book an appointment →
            </a>
          </Text>
        </div>
      </Card>
    </div>
  );
}
