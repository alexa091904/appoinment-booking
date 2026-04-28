"use client";

import React, { useState, useEffect } from "react";
import { Form, Select, DatePicker, TimePicker, notification } from "antd";
import { User, Time, Calendar, LocationPin, ArrowRight, InfoCircle, Phone, Email as EmailIcon, ClipboardList } from "griddy-icons";
import { createClient } from "@/utils/supabase/client";
import dayjs from "dayjs";

const { Option } = Select;

export default function BookingForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState({
    location: "Cagayan de Oro Branch",
    date: "2026-04-30",
    time: "10:00 AM",
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (data && !error) {
        setAnnouncement({ location: data.location, date: data.date, time: data.time });
      }
    };
    fetchAnnouncement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values: Record<string, any>) => {
    setLoading(true);
    try {
      const preferredDate = values.preferred_date
        ? dayjs(values.preferred_date).format("MMMM D, YYYY")
        : "Not specified";
      const preferredTime = values.preferred_time
        ? dayjs(values.preferred_time).format("h:mm A")
        : "Not specified";

      const { error: dbError } = await supabase.from("appointments").insert([{
        patient_name: values.name,
        email: values.email,
        contact_number: values.contact,
        type: values.appointmentType,
        purpose: values.purpose,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        status: "Pending",
      }]);
      if (dbError) throw dbError;

      try {
        const emailRes = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: values.email,
            subject: "Appointment Received — Dr. Alexa Clinic",
            html: `
              <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#f8fafc;border-radius:12px;">
                <h1 style="color:#1a3d5c;margin:0 0 8px;font-size:24px;">🏥 Appointment Received</h1>
                <p style="color:#607d8b;font-size:14px;margin:0 0 20px;">Dr. Alexa Clinic</p>
                <p style="color:#2c3e50;font-size:15px;">Hi <strong>${values.name}</strong>,</p>
                <p style="color:#2c3e50;font-size:15px;">We received your <strong>${values.appointmentType}</strong> appointment request. Our secretary will confirm your slot shortly.</p>
                <div style="background:#fff;border:1px solid #bee3f8;border-radius:10px;padding:20px;margin:24px 0;">
                  <table style="width:100%;font-size:14px;color:#4a5568;border-collapse:collapse;">
                    <tr><td style="padding:6px 0;color:#718096;width:40%;">Patient Name:</td><td style="font-weight:600;">${values.name}</td></tr>
                    <tr><td style="padding:6px 0;color:#718096;">Email:</td><td>${values.email}</td></tr>
                    <tr><td style="padding:6px 0;color:#718096;">Contact:</td><td>${values.contact}</td></tr>
                    <tr><td style="padding:6px 0;color:#718096;">Appointment Type:</td><td style="font-weight:600;">${values.appointmentType}</td></tr>
                    <tr style="background:#eff6ff;"><td style="padding:6px 4px;color:#1e40af;font-weight:600;">📅 Preferred Date:</td><td style="color:#1677ff;font-weight:700;">${preferredDate}</td></tr>
                    <tr style="background:#eff6ff;"><td style="padding:6px 4px;color:#1e40af;font-weight:600;">🕐 Preferred Time:</td><td style="color:#1677ff;font-weight:700;">${preferredTime}</td></tr>
                    <tr><td style="padding:6px 0;color:#718096;">Purpose:</td><td>${values.purpose}</td></tr>
                    <tr><td style="padding:6px 0;color:#718096;">Status:</td><td><span style="background:#fff7ed;color:#c05621;padding:2px 10px;border-radius:20px;font-weight:600;font-size:13px;">Pending</span></td></tr>
                  </table>
                </div>
                <p style="color:#90a4ae;font-size:12px;text-align:center;margin-top:24px;border-top:1px solid #e2e8f0;padding-top:16px;">Dr. Alexa Clinic — Medical Appointment System</p>
              </div>`,
          }),
        });
        if (!emailRes.ok) {
          notification.warning({ message: "Appointment Submitted!", description: "Saved but email could not be sent.", placement: "topRight", duration: 7 });
        } else {
          notification.success({ message: "Appointment Submitted!", description: `Confirmation sent to ${values.email}.`, placement: "topRight" });
        }
      } catch {
        notification.success({ message: "Appointment Submitted!", description: "Your appointment was saved.", placement: "topRight" });
      }

      form.resetFields();
    } catch (err: unknown) {
      notification.error({ message: "Submission Failed", description: err instanceof Error ? err.message : "Please try again.", placement: "topRight" });
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = dayjs(announcement.date, "YYYY-MM-DD").isValid()
    ? dayjs(announcement.date, "YYYY-MM-DD").format("MMMM D, YYYY")
    : announcement.date;

  return (
    <>
      {/* Page wrapper */}
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #eef4ff 0%, #f5f9ff 50%, #eaf5f2 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative orbs */}
        <div style={orb({ top: -100, right: -80, size: 360, color: "rgba(22,119,255,0.10)" })} />
        <div style={orb({ bottom: "8%", left: -80, size: 280, color: "rgba(5,150,105,0.09)" })} />
        <div style={orb({ top: "45%", right: "4%", size: 200, color: "rgba(139,92,246,0.07)" })} />

        {/* Two-column wrapper */}
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "48px 24px 72px",
          display: "flex",
          gap: 32,
          alignItems: "flex-start",
          position: "relative",
          zIndex: 1,
        }}
          className="booking-layout"
        >

          {/* ═══════════════════════════════════════
              LEFT COLUMN — Doctor info (40%)
          ════════════════════════════════════════ */}
          <div style={{ width: "40%", position: "sticky", top: 24, flexShrink: 0 }}
            className="booking-left"
          >
            {/* Doctor profile card */}
            <div style={{ ...glassCard, padding: "28px 24px", marginBottom: 16 }}>
              {/* Avatar */}
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                border: "3px solid rgba(22,119,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
                boxShadow: "0 6px 20px rgba(22,119,255,0.18)",
              }}>
                <User style={{ width: 34, height: 34, color: "#1677ff" }} />
              </div>

              {/* Name & title */}
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0f2744", letterSpacing: "-0.4px" }}>
                Dr. Alexa
              </div>
              <div style={{ fontSize: 14, color: "#5a7fa8", marginTop: 4, marginBottom: 16 }}>
                General Physician
              </div>

              {/* Available badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.25)",
                borderRadius: 20, padding: "5px 14px", marginBottom: 20,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                <span style={{ fontSize: 13, color: "#059669", fontWeight: 600 }}>Accepting new patients</span>
              </div>

              {/* Info list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: EmailIcon, label: "Dralexaadmin@gmail.com" },
                  { icon: Phone, label: "Contact via booking form" },
                  { icon: LocationPin, label: announcement.location },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: "rgba(22,119,255,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon style={{ width: 15, height: 15, color: "#1677ff" }} />
                    </div>
                    <span style={{ fontSize: 13, color: "#4a6780", lineHeight: 1.4 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Schedule card */}
            <div style={{ ...glassCard, padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "rgba(22,119,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <InfoCircle style={{ width: 15, height: 15, color: "#1677ff" }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#0f2744" }}>Upcoming Schedule</span>
              </div>

              <p style={{ fontSize: 13, color: "#5a7fa8", margin: "0 0 14px" }}>
                Dr. Alexa will be available at:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: Time, text: announcement.time, label: "Time" },
                  { icon: Calendar, text: formattedDate, label: "Date" },
                  { icon: LocationPin, text: announcement.location, label: "Location" },
                ].map(({ icon: Icon, text, label }) => (
                  <div key={label} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(22,119,255,0.12)",
                    borderRadius: 10, padding: "10px 14px",
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: "rgba(22,119,255,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon style={{ width: 15, height: 15, color: "#1677ff" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#8fa8c8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
                      <div style={{ fontSize: 14, color: "#0f2744", fontWeight: 600, marginTop: 1 }}>{text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════
              RIGHT COLUMN — Booking form (60%)
          ════════════════════════════════════════ */}
          <div style={{ flex: 1, minWidth: 0 }} className="booking-right">

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ color: "#0f2744", fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
                Book an Appointment
              </h2>
              <p style={{ color: "#5a7fa8", fontSize: 15, marginTop: 6, marginBottom: 0 }}>
                Fill in your details and we&apos;ll confirm your slot shortly.
              </p>
              <div style={{ width: 52, height: 3, background: "linear-gradient(90deg, #1677ff, #6366f1)", marginTop: 14, borderRadius: 4 }} />
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>

              {/* Personal Information */}
              <div style={{ ...floatingPanel, marginBottom: 14 }}>
                <div style={panelLabel}>
                  <User style={{ width: 13, height: 13 }} /> Personal Information
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Form.Item label={<span style={fieldLabel}>Full Name</span>} name="name" rules={[{ required: true, message: "Required" }]} style={{ marginBottom: 0 }}>
                    <input id="field-name" placeholder="E.g. Juan dela Cruz" style={glassInput} onFocus={onFocusInput} onBlur={onBlurInput} />
                  </Form.Item>
                  <Form.Item label={<span style={fieldLabel}>Contact Number</span>} name="contact" rules={[{ required: true, message: "Required" }]} style={{ marginBottom: 0 }}>
                    <input id="field-contact" placeholder="E.g. 09123456789" style={glassInput} onFocus={onFocusInput} onBlur={onBlurInput} />
                  </Form.Item>
                </div>
              </div>

              {/* Email */}
              <div style={{ ...floatingPanel, marginBottom: 14 }}>
                <div style={panelLabel}>
                  <EmailIcon style={{ width: 13, height: 13 }} /> Contact Details
                </div>
                <Form.Item label={<span style={fieldLabel}>Email Address</span>} name="email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]} style={{ marginBottom: 0 }}>
                  <input id="field-email" type="email" placeholder="E.g. juan@example.com" style={glassInput} onFocus={onFocusInput} onBlur={onBlurInput} />
                </Form.Item>
              </div>

              {/* Appointment Type */}
              <div style={{ ...floatingPanel, marginBottom: 14 }}>
                <div style={panelLabel}>
                  <ClipboardList style={{ width: 13, height: 13 }} /> Appointment Details
                </div>
                <Form.Item label={<span style={fieldLabel}>Appointment Type</span>} name="appointmentType" rules={[{ required: true, message: "Please select a type" }]} style={{ marginBottom: 0 }}>
                  <Select placeholder="Select type of appointment" size="large" style={{ width: "100%" }}>
                    <Option value="General Check-up">General Check-up</Option>
                    <Option value="Consultation">Consultation</Option>
                    <Option value="Follow-up">Follow-up</Option>
                    <Option value="Lab Result Review">Lab / Test Result Review</Option>
                    <Option value="Prescription Refill">Prescription Refill</Option>
                    <Option value="Urgent Care">Urgent Care</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Preferred Schedule */}
              <div style={{ ...floatingPanel, marginBottom: 14 }}>
                <div style={panelLabel}>
                  <Calendar style={{ width: 13, height: 13 }} /> Preferred Schedule
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Form.Item label={<span style={fieldLabel}>Preferred Date</span>} name="preferred_date" rules={[{ required: true, message: "Required" }]} style={{ marginBottom: 0 }}>
                    <DatePicker size="large" style={{ width: "100%", borderRadius: 10 }} placeholder="Select date" disabledDate={(d) => d && d.isBefore(dayjs().startOf("day"))} />
                  </Form.Item>
                  <Form.Item label={<span style={fieldLabel}>Preferred Time</span>} name="preferred_time" rules={[{ required: true, message: "Required" }]} style={{ marginBottom: 0 }}>
                    <TimePicker use12Hours format="h:mm A" size="large" style={{ width: "100%", borderRadius: 10 }} placeholder="Select time" />
                  </Form.Item>
                </div>
              </div>

              {/* Purpose */}
              <div style={{ ...floatingPanel, marginBottom: 28 }}>
                <div style={panelLabel}>
                  <ClipboardList style={{ width: 13, height: 13 }} /> Purpose / Concerns
                </div>
                <Form.Item label={<span style={fieldLabel}>Specific Purpose / Concerns</span>} name="purpose" rules={[{ required: true, message: "Please describe your concern" }]} style={{ marginBottom: 0 }}>
                  <textarea
                    id="field-purpose"
                    placeholder="Please provide details about your concerns or symptoms..."
                    style={{ ...glassInput, minHeight: 110, resize: "vertical", lineHeight: 1.7 }}
                    onFocus={onFocusInput}
                    onBlur={onBlurInput}
                  />
                </Form.Item>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "15px 24px",
                  background: loading ? "rgba(22,119,255,0.5)" : "linear-gradient(135deg, #1677ff, #4f86ff)",
                  border: "1.5px solid rgba(255,255,255,0.5)",
                  borderRadius: 14, color: "#fff",
                  fontWeight: 700, fontSize: 16,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  boxShadow: loading ? "none" : "0 0 0 4px rgba(22,119,255,0.15), 0 8px 32px rgba(22,119,255,0.35)",
                  transition: "all 0.25s",
                  letterSpacing: "0.2px",
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    const btn = e.currentTarget as HTMLButtonElement;
                    btn.style.transform = "translateY(-2px)";
                    btn.style.boxShadow = "0 0 0 6px rgba(22,119,255,0.2), 0 12px 40px rgba(22,119,255,0.45)";
                  }
                }}
                onMouseLeave={e => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.transform = "translateY(0)";
                  btn.style.boxShadow = "0 0 0 4px rgba(22,119,255,0.15), 0 8px 32px rgba(22,119,255,0.35)";
                }}
              >
                <ArrowRight style={{ width: 18, height: 18 }} />
                {loading ? "Submitting..." : "Submit Appointment Request"}
              </button>

              <p style={{ textAlign: "center", color: "#8fa8c8", fontSize: 12, marginTop: 14, marginBottom: 0 }}>
                Your request will be reviewed and confirmed via{" "}
                <span style={{ color: "#1677ff", fontWeight: 600 }}>email</span> or contact number.
              </p>

            </Form>
          </div>
        </div>
      </div>

      {/* Responsive + Ant Design overrides */}
      <style>{`
        .booking-layout {
          flex-direction: row;
        }
        .booking-left {
          width: 40%;
        }
        .booking-right {
          flex: 1;
        }

        @media (max-width: 768px) {
          .booking-layout {
            flex-direction: column !important;
            padding: 24px 16px 48px !important;
            gap: 20px !important;
          }
          .booking-left {
            width: 100% !important;
            position: static !important;
          }
          .booking-right {
            width: 100% !important;
          }
        }

        .ant-form-item-label > label { color: #1a3d5c !important; font-weight: 600 !important; font-size: 13px !important; }
        .ant-select-selector { border-radius: 10px !important; border-color: rgba(22,119,255,0.2) !important; background: rgba(255,255,255,0.7) !important; }
        .ant-picker { border-radius: 10px !important; border-color: rgba(22,119,255,0.2) !important; background: rgba(255,255,255,0.7) !important; }
        .ant-picker:hover, .ant-select-selector:hover { border-color: #1677ff !important; }
        .ant-picker-focused, .ant-select-focused .ant-select-selector { border-color: #1677ff !important; box-shadow: 0 0 0 3px rgba(22,119,255,0.12) !important; }
      `}</style>
    </>
  );
}

/* ── Design tokens ── */

const orb = ({ top, bottom, left, right, size, color }: {
  top?: number | string; bottom?: number | string;
  left?: number | string; right?: number | string;
  size: number; color: string;
}): React.CSSProperties => ({
  position: "absolute",
  ...(top !== undefined ? { top } : {}),
  ...(bottom !== undefined ? { bottom } : {}),
  ...(left !== undefined ? { left } : {}),
  ...(right !== undefined ? { right } : {}),
  width: size, height: size,
  borderRadius: "50%",
  background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
  pointerEvents: "none",
});

const glassCard: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderRadius: 20,
  border: "1px solid rgba(255, 255, 255, 0.9)",
  boxShadow: "0 8px 32px rgba(22, 60, 120, 0.08), 0 2px 8px rgba(22,119,255,0.05)",
};

const floatingPanel: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.75)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  borderRadius: 16,
  border: "1px solid rgba(255, 255, 255, 0.92)",
  boxShadow: "0 4px 24px rgba(22, 60, 120, 0.07), 0 1px 4px rgba(22,119,255,0.04)",
  padding: "20px 22px",
};

const panelLabel: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  fontSize: 11, fontWeight: 700, color: "#1677ff",
  textTransform: "uppercase", letterSpacing: 1.2,
  marginBottom: 14,
};

const fieldLabel: React.CSSProperties = {
  color: "#1a3d5c", fontSize: 13, fontWeight: 600,
};

const glassInput: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  background: "rgba(255, 255, 255, 0.65)",
  border: "1.5px solid rgba(22, 119, 255, 0.18)",
  borderRadius: 10, color: "#0f2744", fontSize: 14,
  outline: "none", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color 0.2s, box-shadow 0.2s",
};

const onFocusInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "#1677ff";
  e.target.style.boxShadow = "0 0 0 3px rgba(22,119,255,0.12)";
  e.target.style.background = "rgba(255,255,255,0.95)";
};

const onBlurInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "rgba(22,119,255,0.18)";
  e.target.style.boxShadow = "none";
  e.target.style.background = "rgba(255,255,255,0.65)";
};
