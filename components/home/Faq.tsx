import { site } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";
import { FaqList } from "@/components/home/FaqList";
import { WhatsAppIcon, whatsappHref } from "@/components/site/WhatsAppButton";

/** Plain questions with direct answers, in an animated one-at-a-time accordion. */
export function Faq() {
  const chat = whatsappHref("Hi iWash, I have a question about your laundry service.");

  return (
    <section
      id="faq"
      className="relative scroll-mt-16 overflow-hidden bg-white py-20 md:py-32"
      aria-labelledby="faq-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-iwash-tertiary/40 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-[1680px] gap-10 px-5 md:grid-cols-[1fr_1.5fr] md:gap-16 md:px-10">
        <Reveal>
          <div className="md:sticky md:top-28">
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-heading" className="display display-md mt-4 text-iwash-neutral">
              Good to{" "}
              <span className="bg-linear-to-r from-iwash-primary to-iwash-secondary bg-clip-text text-transparent">
                know.
              </span>
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-iwash-ink-soft">
              Quick answers to what people ask us most. Tap a question to open it.
            </p>

            <div className="mt-8 max-w-sm rounded-3xl bg-iwash-neutral p-6 text-white">
              <p className="font-display text-lg font-extrabold tracking-tight">Still have a question?</p>
              <p className="mt-1 text-sm text-white/70">We usually reply within minutes.</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
                {chat ? (
                  <a
                    href={chat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-iwash-neutral transition-transform hover:scale-[1.04]"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    WhatsApp us
                  </a>
                ) : null}
                <a
                  href={site.contact.phoneHref}
                  className="inline-flex items-center rounded-full px-4 py-2.5 ring-1 ring-white/40 transition-colors hover:bg-white/10"
                >
                  Call {site.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <FaqList items={site.faqs} />
      </div>
    </section>
  );
}
