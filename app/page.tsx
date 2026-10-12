import { getPriceList } from "@/lib/pricing";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { HomeEstimator } from "@/components/home/HomeEstimator";
import { Services } from "@/components/home/Services";
import { HowItWorks } from "@/components/home/HowItWorks";
import { OfferBand } from "@/components/home/OfferBand";
import { BehindTheScenes } from "@/components/home/BehindTheScenes";
import { WhoItsFor } from "@/components/home/WhoItsFor";
import { Areas } from "@/components/home/Areas";
import { Faq } from "@/components/home/Faq";
import { AppDownloadSection } from "@/components/home/AppDownloadSection";

/**
 * One job per section, in the order a visitor's questions arise: what is
 * it, can I trust it, what will it cost, what do you do, how does it work,
 * what do I get for trying it, who is behind it, is it for me, does it
 * reach me, anything else, and finally the download.
 */
export default async function Home() {
  const priceList = await getPriceList();

  return (
    <>
      <Hero />
      <TrustStrip />
      <HomeEstimator priceList={priceList} />
      <Services />
      <HowItWorks />
      <OfferBand />
      <BehindTheScenes />
      <WhoItsFor />
      <Areas />
      <Faq />
      <AppDownloadSection />
    </>
  );
}
