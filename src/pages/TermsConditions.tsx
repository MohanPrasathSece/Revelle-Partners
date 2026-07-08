import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { CustomCursor } from "@/components/landing/CustomCursor";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";

export default function TermsConditions() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and utilizing the Revelle Partners website, research portal, and educational documents, you acknowledge that you have read, understood, and agreed to be bound by these Terms & Conditions. If you do not accept these terms, you must immediately terminate access to our portals.",
    },
    {
      title: "2. Eligibility",
      content:
        "You represent and warrant that you are at least 18 years of age and hold the capacity to enter binding contracts. Furthermore, to request proposals or utilize our onboarding services, you must qualify as an accredited investor, institutional entity, or qualified buyer in your relevant jurisdiction.",
    },
    {
      title: "3. Website Purpose",
      content:
        "The website is designed to provide institutional crypto market education, quantitative strategy summaries, and a portal for accredited clients to interact with our capital deployment desks. It does not constitute a direct portal for retail digital asset exchanges.",
    },
    {
      title: "4. User Responsibilities",
      content:
        "You are responsible for maintaining the confidentiality of your credentials (including portal access sessions) and for all actions occurring under your account. You agree to immediately notify us of any unauthorized session access or breach of credentials.",
    },
    {
      title: "5. Acceptable Use",
      content:
        "You agree to use our services and educational portal only for lawful research and onboarding purposes. You must not use the website to distribute malicious code, disrupt network infrastructure, or attempt unauthorized entry into the host database.",
    },
    {
      title: "6. Prohibited Activities",
      content:
        "Prohibited activities include using automated crawlers to harvest intellectual research materials without permission, reverse-engineering our database algorithms, using false emails for authentication, and executing DDoS attacks against the Vercel hosting nodes.",
    },
    {
      title: "7. Intellectual Property",
      content:
        "All content, graphics, charts, research whitepapers, branding, logos, and custom illustrations displayed on the website are the exclusive property of Revelle Partners and are protected by applicable trademark and copyright laws. You are prohibited from republishing materials without our consent.",
    },
    {
      title: "8. Accuracy of Information",
      content:
        "Although Revelle strives to provide accurate on-chain metrics, market indicators, and educational explanations, all contents are provided on an 'as-is' and 'as-available' basis without warranties of completeness or real-time precision.",
    },
    {
      title: "9. No Financial Advice",
      content:
        "The contents of the educational portal, market simulators, and historical statistics are for informational and academic purposes only. None of the materials constitute personal financial advice or specific investment suggestions.",
    },
    {
      title: "10. No Investment Advice",
      content:
        "No material displayed on our portals shall be interpreted as investment, legal, or tax advice. You must consult your own registered advisors, attorneys, and tax specialists before entering into any digital asset transaction or fund allocation.",
    },
    {
      title: "11. Cryptocurrency Risk Disclosure",
      content:
        "Digital assets are highly volatile and carry extreme financial risk. Allocating capital to cryptocurrencies, smart contract platforms, leverage options, and tokenized structures can result in the complete loss of your capital. You must evaluate your risk tolerance before committing capital.",
    },
    {
      title: "12. No Guarantee of Returns",
      content:
        "Historical return metrics, dynamic chart visuals, and backtested simulation models are not indicative of future performance. Soltera Finance does not guarantee, state, or imply that any allocation strategy will yield profitable returns or prevent drawdowns.",
    },
    {
      title: "13. Limitation of Liability",
      content:
        "In no event shall Soltera Finance, its affiliates, directors, or server providers be liable for any direct, indirect, special, incidental, or consequential losses resulting from data downtime, smart contract bugs, API submission failures, or digital asset market volatility.",
    },
    {
      title: "14. Indemnification",
      content:
        "You agree to indemnify, defend, and hold harmless Soltera Finance, its officers, and partners from and against any claims, losses, liability, costs, and expenses (including legal fees) arising from your breach of these Terms or your misuse of the Portal.",
    },
    {
      title: "15. Third-Party Links",
      content:
        "Our web pages may contain external links to blockchain explorers, regulatory authorities, or external resources. We have no control over those third-party services, do not endorse their content, and assume no responsibility for their operations.",
    },
    {
      title: "16. Privacy Policy Reference",
      content:
        "Your access and use of the website are also subject to our Privacy Policy, which details our data collection policies, Vercel Blob authentication structures, and third-party CRM lead integrations. The Privacy Policy is incorporated by reference herein.",
    },
    {
      title: "17. Suspension of Access",
      content:
        "We reserve the right, in our sole discretion, to suspend or terminate your access to the Educational Portal and our onboarding services at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to our platform security.",
    },
    {
      title: "18. Governing Law",
      content:
        "These Terms and Conditions shall be governed by, and construed in accordance with, the laws of the Republic of Cyprus (or your designated compliance jurisdiction), without regard to its conflict of law principles.",
    },
    {
      title: "19. Dispute Resolution",
      content:
        "Any dispute or claim arising out of or in connection with these Terms, including their existence, validity, or termination, shall be resolved through confidential arbitration or by courts of competent jurisdiction located in Limassol, Cyprus.",
    },
    {
      title: "20. Severability",
      content:
        "If any provision of these Terms is found to be invalid, illegal, or unenforceable by any court of competent jurisdiction, that provision shall be severed, and the remaining provisions shall continue in full force and effect.",
    },
    {
      title: "21. Changes to Terms",
      content:
        "We reserve the right to modify these Terms & Conditions at any time. We will indicate the date of the latest modification at the top of this page. Your continued use of the website after any revisions constitutes your acceptance of the new Terms.",
    },
    {
      title: "22. Contact Information",
      content:
        "If you have any questions or require clarification regarding these Terms & Conditions, please contact us at compliance@revellepartners.com.",
    },
  ];

  return (
    <SmoothScroll>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main className="grain min-h-screen bg-background text-foreground pt-36 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-2 block">
              Legal Agreement
            </span>
            <h1 className="text-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Terms &amp; Conditions
            </h1>
            <span className="font-mono text-xs text-muted-foreground/60 block mb-12">
              Last Updated: July 7, 2026
            </span>

            <div className="space-y-8">
              {sections.map((sec, idx) => (
                <div key={idx} className="border-b border-border/40 pb-6">
                  <h2 className="text-lg font-bold text-foreground mb-3 font-mono">{sec.title}</h2>
                  <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </SmoothScroll>
  );
}
