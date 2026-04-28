"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hospital, Lock } from "griddy-icons";

export default function Navbar() {
  const pathname = usePathname();

  // Hide the entire navbar on admin pages (admin has its own sidebar layout)
  const isAdminPage = pathname?.startsWith("/admin");
  if (isAdminPage) return null;

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <nav style={{
      background: "#1a3d5c",
      padding: "0 32px",
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <Hospital style={{ width: 28, height: 28, color: "#40c2f7" }} />
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: "-0.3px" }}>
          Alexa<span style={{ color: "#40c2f7" }}>Hospital</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: pathname === link.href ? "#40c2f7" : "#cde8fa",
              textDecoration: "none",
              padding: "7px 18px",
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 15,
              border: `1px solid ${pathname === link.href ? "#40c2f7" : "transparent"}`,
              transition: "all 0.2s",
            }}
          >
            {link.label}
          </Link>
        ))}

        {/* Admin Sign In — goes directly to the login page */}
        <Link
          href="/admin/login"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#1677ff",
            color: "#fff",
            padding: "8px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            marginLeft: 8,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(22,119,255,0.4)",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#0958d9")}
          onMouseLeave={e => (e.currentTarget.style.background = "#1677ff")}
        >
          <Lock style={{ width: 15, height: 15 }} />
          Admin Sign In
        </Link>
      </div>
    </nav>
  );
}
