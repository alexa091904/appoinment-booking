"use client";

import React from "react";
import Link from "next/link";
import {
  Hospital, Heart, HealthCross, ShieldCheck, User,
  CheckCircle, Calendar, LocationPin, ArrowRight,
} from "griddy-icons";

const reasons = [
  {
    icon: User,
    color: "#1677ff",
    bg: "rgba(22,119,255,0.08)",
    title: "Expert Care",
    desc: "Our team, led by dedicated professionals like Dr. Alexa, specializes in general medicine and comprehensive patient wellness.",
  },
  {
    icon: Calendar,
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    title: "Patient-Centric Technology",
    desc: "We utilize a streamlined digital booking system so you can schedule visits with ease and view real-time physician availability.",
  },
  {
    icon: LocationPin,
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
    title: "Comprehensive Facilities",
    desc: "Located at Ace Hospital, we offer a modern environment equipped to handle your primary health concerns with precision and care.",
  },
  {
    icon: Heart,
    color: "#e11d48",
    bg: "rgba(225,29,72,0.08)",
    title: "Accepting New Patients",
    desc: "We are committed to growing our community and always ready to welcome new individuals and families into our care network.",
  },
];

const values = [
  { icon: ShieldCheck, label: "Trust & Transparency" },
  { icon: Heart, label: "Compassionate Care" },
  { icon: HealthCross, label: "Clinical Excellence" },
  { icon: CheckCircle, label: "Patient‑First Approach" },
];

export default function AboutClient() {
  return (
    <>
      {/* Page wrapper */}
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #eef4ff 0%, #f5f9ff 50%, #eaf5f2 100%)",
        position: "relative",
        overflow: "hidden",
        paddingBottom: 80,
      }}>

        {/* Background orbs */}
        <div style={orb({ top: -100, right: -80, size: 380, color: "rgba(22,119,255,0.10)" })} />
        <div style={orb({ bottom: "5%", left: -80, size: 300, color: "rgba(5,150,105,0.09)" })} />
        <div style={orb({ top: "40%", right: "3%", size: 220, color: "rgba(139,92,246,0.07)" })} />

        {/* ── HERO BANNER ── */}
        <div style={{
          background: "linear-gradient(135deg, #0d1b2a 0%, #1a3d5c 60%, #0f3460 100%)",
          padding: "72px 24px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Hero orbs */}
          <div style={{ position: "absolute", top: -60, left: "10%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(22,119,255,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, right: "8%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(64,194,247,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
            {/* Icon badge */}
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "2px solid rgba(64,194,247,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 0 0 12px rgba(22,119,255,0.08)",
            }}>
              <Hospital style={{ width: 34, height: 34, color: "#40c2f7" }} />
            </div>

            <div style={{
              display: "inline-block",
              background: "rgba(64,194,247,0.12)",
              border: "1px solid rgba(64,194,247,0.3)",
              borderRadius: 20, padding: "5px 18px",
              fontSize: 12, fontWeight: 700, color: "#40c2f7",
              letterSpacing: 1.5, textTransform: "uppercase",
              marginBottom: 16,
            }}>
              About Us
            </div>

            <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.8px", lineHeight: 1.15 }}>
              Alexa <span style={{ color: "#40c2f7" }}>Hospital</span>
            </h1>

            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.75, margin: 0 }}>
              Where professional expertise meets a patient-first approach to healthcare.
              We believe accessing quality medical care should be seamless,
              transparent, and built on a foundation of trust.
            </p>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 0", position: "relative", zIndex: 1 }}>

          {/* Our Mission */}
          <div style={{ ...glassCard, padding: "36px 40px", marginBottom: 24, display: "flex", gap: 28, alignItems: "flex-start" }}>
            <div style={{
              width: 54, height: 54, borderRadius: 16,
              background: "rgba(22,119,255,0.1)",
              border: "1.5px solid rgba(22,119,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 16px rgba(22,119,255,0.12)",
            }}>
              <HealthCross style={{ width: 26, height: 26, color: "#1677ff" }} />
            </div>
            <div>
              <div style={sectionEyebrow}>Our Mission</div>
              <h2 style={sectionTitle}>Accessible, High-Quality Primary Care</h2>
              <p style={bodyText}>
                Our mission is to provide accessible, high-quality primary care through a blend of advanced medical
                technology and compassionate service. We aim to simplify the healthcare journey — starting from the
                moment you book your appointment.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ ...sectionEyebrow, justifyContent: "center" }}>Why Choose Us</div>
              <h2 style={{ ...sectionTitle, textAlign: "center" }}>Everything You Need, All in One Place</h2>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}>
              {reasons.map(({ icon: Icon, color, bg, title, desc }) => (
                <div key={title} style={{
                  ...glassCard,
                  padding: "24px 22px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(22,60,120,0.12)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(22,60,120,0.07)";
                  }}
                >
                  <div style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: bg, border: `1.5px solid ${color}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 14,
                  }}>
                    <Icon style={{ width: 22, height: 22, color }} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f2744", margin: "0 0 8px" }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "#5a7fa8", lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Our Approach */}
          <div style={{
            ...glassCard,
            padding: "36px 40px",
            marginBottom: 24,
            background: "linear-gradient(135deg, rgba(22,119,255,0.05) 0%, rgba(255,255,255,0.75) 100%)",
            borderLeft: "4px solid #1677ff",
          }}>
            <div style={sectionEyebrow}>Our Approach</div>
            <h2 style={sectionTitle}>You Aren't Just a Number on a Schedule</h2>
            <p style={{ ...bodyText, marginBottom: 20 }}>
              At Alexa Hospital, we focus on clear communication and personalized treatment plans.
              Whether you are visiting for a routine check-up or a specific health concern, our goal is to
              provide a supportive environment where your health is our highest priority.
            </p>
            <p style={{ ...bodyText, margin: 0, fontStyle: "italic", color: "#1677ff", fontWeight: 600 }}>
              &ldquo;Experience healthcare designed around you.&rdquo;
            </p>
          </div>

          {/* Core Values */}
          <div style={{ ...glassCard, padding: "32px 40px", marginBottom: 32 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ ...sectionEyebrow, justifyContent: "center" }}>What We Stand For</div>
              <h2 style={{ ...sectionTitle, textAlign: "center", marginBottom: 0 }}>Our Core Values</h2>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              {values.map(({ icon: Icon, label }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "rgba(22,119,255,0.06)",
                  border: "1px solid rgba(22,119,255,0.15)",
                  borderRadius: 40, padding: "10px 20px",
                }}>
                  <Icon style={{ width: 18, height: 18, color: "#1677ff" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#0f2744" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            ...glassCard,
            padding: "40px",
            textAlign: "center",
            background: "linear-gradient(135deg, #0d1b2a, #1a3d5c)",
            border: "1px solid rgba(64,194,247,0.2)",
          }}>
            <Hospital style={{ width: 36, height: 36, color: "#40c2f7", marginBottom: 12 }} />
            <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.3px" }}>
              Ready to Take the Next Step?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, margin: "0 0 24px", lineHeight: 1.6 }}>
              Head over to our booking page to schedule your consultation with Dr. Alexa.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #1677ff, #4f86ff)",
                color: "#fff", textDecoration: "none",
                padding: "13px 28px", borderRadius: 12,
                fontWeight: 700, fontSize: 15,
                boxShadow: "0 0 0 4px rgba(22,119,255,0.2), 0 8px 24px rgba(22,119,255,0.35)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
            >
              <ArrowRight style={{ width: 16, height: 16 }} />
              Book an Appointment
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .about-reasons { grid-template-columns: 1fr !important; }
        }
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
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 32px rgba(22,60,120,0.07), 0 2px 8px rgba(22,119,255,0.04)",
};

const sectionEyebrow: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  fontSize: 11, fontWeight: 700, color: "#1677ff",
  textTransform: "uppercase", letterSpacing: 1.5,
  marginBottom: 8,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 22, fontWeight: 800, color: "#0f2744",
  margin: "0 0 12px", letterSpacing: "-0.3px",
};

const bodyText: React.CSSProperties = {
  fontSize: 15, color: "#4a6780", lineHeight: 1.75,
  margin: "0 0 0",
};
