"use client";

import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Time, Email, Phone, LocationPin, Edit } from "griddy-icons";

interface ContactInfo {
  hours: string;
  email: string;
  phone: string;
  address: string;
}

const DEFAULT: ContactInfo = {
  hours: "Monday – Friday: 8:00 AM – 5:00 PM\nSaturday: 8:00 AM – 12:00 PM\nSunday: Closed",
  email: "admin@alexahospital.com",
  phone: "+63 88 123 4567",
  address: "123 Corrales Ave., Cagayan de Oro City, Philippines 9000",
};

const fieldConfig = [
  { icon: Time, label: "Office Hours", field: "hours" as keyof ContactInfo, multiline: true },
  { icon: Email, label: "Email Address", field: "email" as keyof ContactInfo },
  { icon: Phone, label: "Phone Number", field: "phone" as keyof ContactInfo },
  { icon: LocationPin, label: "Address", field: "address" as keyof ContactInfo, multiline: true },
];

export default function ContactPage() {
  const { isAdmin } = useAdmin();
  const [info, setInfo] = useState<ContactInfo>(DEFAULT);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(info);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setInfo(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", padding: "48px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1a3d5c", margin: 0 }}>Contact Us</h1>
          <p style={{ color: "#666", marginTop: 8, fontSize: 16 }}>Reach AlexaHospital — we&apos;re here to help</p>
        </div>

        {saved && (
          <div style={{
            background: "#f6ffed", border: "1px solid #b7eb8f",
            borderRadius: 8, padding: "10px 20px", marginBottom: 24,
            color: "#52c41a", fontWeight: 600, textAlign: "center",
          }}>Contact info updated successfully!</div>
        )}

        {/* Info Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          {fieldConfig.map(({ icon: Icon, label, field }) => (
            <div key={field} style={{
              background: "#fff", borderRadius: 14, padding: 24,
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}>
              <Icon style={{ width: 28, height: 28, color: "#1677ff", marginBottom: 10 }} />
              <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#1a3d5c" }}>{label}</h3>
              <p style={{ margin: 0, color: "#555", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-line" }}>{info[field]}</p>
            </div>
          ))}
        </div>

        {/* Admin Edit Panel */}
        {isAdmin && (
          <div style={{
            background: "#fff", borderRadius: 14, padding: 28,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            border: "2px solid #00b96b",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: "#00b96b", fontWeight: 700, fontSize: 16 }}>
                Admin — Edit Contact Info
              </h3>
              {!editing && (
                <button
                  onClick={() => { setDraft(info); setEditing(true); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "#1677ff", color: "#fff", border: "none",
                    padding: "6px 18px", borderRadius: 8, fontWeight: 600,
                    fontSize: 13, cursor: "pointer",
                  }}
                >
                  <Edit style={{ width: 14, height: 14 }} /> Edit
                </button>
              )}
            </div>

            {editing ? (
              <>
                {fieldConfig.map(({ icon: Icon, label, field, multiline }) => (
                  <div key={field} style={{ marginBottom: 16 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 13, color: "#555", marginBottom: 6 }}>
                      <Icon style={{ width: 14, height: 14 }} /> {label}
                    </label>
                    {multiline ? (
                      <textarea
                        value={draft[field]}
                        onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                        style={{
                          width: "100%", padding: "10px 14px", borderRadius: 8,
                          border: "1.5px solid #1677ff", fontSize: 14, lineHeight: 1.7,
                          resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", outline: "none", minHeight: 80,
                        }}
                      />
                    ) : (
                      <input
                        value={draft[field]}
                        onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                        style={{
                          width: "100%", padding: "10px 14px", borderRadius: 8,
                          border: "1.5px solid #1677ff", fontSize: 14, boxSizing: "border-box", outline: "none",
                        }}
                      />
                    )}
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={handleSave} style={{
                    background: "#00b96b", color: "#fff", border: "none",
                    padding: "10px 28px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer",
                  }}>Save Changes</button>
                  <button onClick={() => setEditing(false)} style={{
                    background: "#f5f5f5", color: "#666", border: "1px solid #ddd",
                    padding: "10px 20px", borderRadius: 8, fontWeight: 500, fontSize: 14, cursor: "pointer",
                  }}>Cancel</button>
                </div>
              </>
            ) : (
              <p style={{ margin: 0, color: "#888", fontSize: 13 }}>
                Click Edit to update clinic hours, email, phone, or address.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
