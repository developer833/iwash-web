import Image from "next/image";
import { site } from "@/lib/site";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

const label = "text-xs font-semibold uppercase tracking-[0.14em] text-iwash-tertiary";

/** Final conversion point: download the app from either store, plus the real contact channels. */
export function AppDownloadSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const { phone, phoneHref, email } = site.contact;
  const Heading = headingLevel;

  return (
    <section
      id="download"
      className="scroll-mt-16 bg-iwash-neutral py-28 text-white md:py-44"
      aria-labelledby="download-heading"
    >
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <Heading id="download-heading" className="display display-xl">
          <SplitText text="Get iWash on your phone." stagger={0.07} />
        </Heading>

        <Reveal delay={0.25} className="mt-12 grid gap-12 md:mt-20 md:grid-cols-2 md:gap-10">
          <div>
            <Image
              src={site.logo.src}
              alt=""
              width={site.logo.width}
              height={site.logo.height}
              className="h-12 w-auto rounded-[3px] bg-white p-2"
            />
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300">
              Book a pickup, choose your time slot and follow your order from the iWash app. We collect
              from your door anywhere in {site.region}, and bring it back finished.
            </p>
            <p className="mt-6 inline-flex rounded-full bg-iwash-primary px-4 py-2 text-sm font-bold">
              {site.offer.headline} in the app
            </p>
            <StoreBadges className="mt-6" />
            <p className="mt-4 text-sm text-slate-400">Available on Google Play and the App Store.</p>
          </div>

          <dl className="grid content-start gap-8 border-t border-white/15 pt-8 sm:grid-cols-2 md:border-t-0 md:pt-0">
            <div>
              <dt className={label}>Call</dt>
              <dd className="mt-2">
                <a href={phoneHref} className="font-display text-2xl font-semibold tracking-tight underline-offset-4 hover:underline">
                  {phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className={label}>Email</dt>
              <dd className="mt-2">
                <a href={`mailto:${email}`} className="text-lg font-medium underline-offset-4 hover:underline">
                  {email}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
