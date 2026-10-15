import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const { address, contact, app } = site;
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} is operated by ${site.legalName}, based in ${address.locality}, ${address.region}, India. Orders are placed in the mobile app or by phone.`,
    "",
    "## Pages",
    "",
    `- [Home](${site.url}/): Services, how it works, service areas and FAQ`,
    `- [Prices](${site.url}/prices): Current price list per item, GST included`,
    `- [Get the app](${site.url}/download): Download the app and schedule a pickup`,
    "",
    "## Service areas",
    "",
    ...site.areas.map((a) => `- [${a.name}](${site.url}/locations/${a.slug}): ${a.blurb}`),
    "",
    "## Services",
    "",
    ...site.services.map((s) => `- ${s.name}: ${s.summary}`),
    "",
    "## How it works",
    "",
    ...site.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.text}`),
    "",
    "## FAQ",
    "",
    ...site.faqs.flatMap((f) => [`### ${f.q}`, f.a, ""]),
    "## Contact",
    "",
    `- Phone: ${contact.phone}`,
    `- Email: ${contact.email}`,
    `- Address: ${address.street}, ${address.locality}, ${address.region} ${address.postalCode}`,
    `- Google Play: ${app.stores.android.href}`,
    `- App Store: ${app.stores.ios.href}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
