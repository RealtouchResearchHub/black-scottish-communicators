import { PageHero } from "@/components/PageHero";
import Script from "next/script";

export default function JoinPage() {
  return (
    <>
      <PageHero
        eyebrow="Join BSC"
        title="Create your profile."
        intro="Fill in the form below to join the BSC community - you'll get a welcome message and be connected with the team."
      />
      <section className="py-16 bg-parchment">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <div className="rounded-sm border border-ink/10 bg-white overflow-hidden">
            <iframe
              src="https://hlapi.espeakers.com/widget/survey/Ioc2glUY2Z7jRMjLfpeT"
              style={{ border: "none", width: "100%", minHeight: "900px" }}
              scrolling="no"
              id="Ioc2glUY2Z7jRMjLfpeT"
              title="Join BSC"
              data-cookie-consent="true"
              data-cookie-consent-provider="auto"
            />
          </div>
        </div>
      </section>
      <Script src="https://hlapi.espeakers.com/js/form_embed.js" strategy="afterInteractive" />
    </>
  );
}
