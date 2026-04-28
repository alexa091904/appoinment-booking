import type { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
  title: "About Us | Alexa Hospital",
  description: "Learn about Alexa Hospital — where professional expertise meets a patient-first approach to healthcare.",
};

export default function AboutPage() {
  return <AboutClient />;
}
