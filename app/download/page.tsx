import type { Metadata } from "next";
import { site } from "@/lib/site";
import { AppDownloadSection } from "@/components/home/AppDownloadSection";

export const metadata: Metadata = {
  title: "Download the iWash app",
  description: `Download the ${site.name} app from Google Play or the App Store to book laundry and dry cleaning pickup and delivery all over ${site.region}.`,
  alternates: { canonical: "/download" },
};

export default function DownloadPage() {
  return <AppDownloadSection headingLevel="h1" />;
}
