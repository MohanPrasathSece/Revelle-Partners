import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { CustomCursor } from "@/components/landing/CustomCursor";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Introduction",
      content:
        "Welcome to Revelle Partners. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at compliance@revellepartners.com.",
    },
    {
      title: "2. Definitions",
      content:
        "In this Privacy Policy, 'Personal Information' refers to any information relating to an identified or identifiable natural person. 'Service' refers to the Revelle Partners website, educational portal, and client onboarding desk.",
    },
    {
      title: "3. Information We Collect",
      content:
        "We collect personal information that you voluntarily provide to us when registering for the educational portal, requesting an investment proposal, or sending enquiries. We also collect certain technical data automatically when you navigate our website.",
    },
    {
      title: "4. Information You Voluntarily Provide",
      content:
        "The personal information we collect depends on the context of your interactions. This includes your Full Name, Email Address, and Phone Number. If you submit a contact enquiry, we will also collect any message details you choose to provide.",
    },
    {
      title: "5. Automatically Collected Information",
      content:
        "We automatically collect certain information when you visit, use, or navigate the website. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, and referring URLs.",
    },
    {
      title: "6. Purpose of Data Collection",
      content:
        "We collect and use your data to operate and improve our investment portals, process your investment desk onboarding requests, authenticate your login session without passwords via secure Vercel Blob records, and communicate performance updates.",
    },
    {
      title: "7. Legal Basis for Processing",
      content:
        "We process your personal information only when we have a valid legal reason to do so. Under applicable laws, this includes your explicit consent, the performance of contractual onboarding requirements, compliance with legal obligations, and our legitimate commercial interests.",
    },
    {
      title: "8. How Personal Information Is Used",
      content:
        "We use the information we collect to manage user accounts, authenticate your access to the Educational Portal, securely transmit onboarding leads to our CRM desk, resolve customer support tickets, and send compliance alerts or required financial statements.",
    },
    {
      title: "9. CRM & Third-Party Service Providers",
      content:
        "We securely submit lead registration data (Name, Email, and Phone Number) to our third-party CRM Endpoint (inwo.crmcore.me) to process investment desk onboarding. The connection is handled using secure server-side API routes, and we never expose CRM access tokens to the frontend browser.",
    },
    {
      title: "10. Cookies",
      content:
        "We use cookies to analyze user trends, capture session authentications, and maintain portal stability. You can control or reset your cookie configurations directly within your web browser settings.",
    },
    {
      title: "11. Tracking Technologies",
      content:
        "In addition to cookies, we may use web beacons, pixel tags, and local storage (such as localStorage for maintaining user login credentials) to measure portal engagement and verify user sessions.",
    },
    {
      title: "12. Data Security",
      content:
        "We have implemented appropriate organizational and technical security measures designed to protect the security of any personal information we process. All data transfers are encrypted in transit, and credentials/secrets are strictly kept server-side.",
    },
    {
      title: "13. Data Retention",
      content:
        "We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Policy, unless a longer retention period is required or permitted by law (such as tax, accounting, or anti-money laundering requirements).",
    },
    {
      title: "14. International Data Transfers",
      content:
        "Your information, including Personal Data, may be transferred to and maintained on computers located outside of your state, province, or country where data protection laws may differ. By using our services, you consent to these secure transfers.",
    },
    {
      title: "15. User Rights",
      content:
        "Depending on your jurisdiction, you may have the right to request access to your personal information, request corrections, request deletion, restrict processing, or object to data portability. To exercise these rights, please submit an enquiry.",
    },
    {
      title: "16. Marketing Communications",
      content:
        "We may use your personal information to contact you with newsletter updates, market trend analysis, or administrative notifications. You can opt-out of marketing communications at any time using the unsubscribe link provided in our emails.",
    },
    {
      title: "17. Children's Privacy",
      content:
        "Our services are strictly directed to institutional and accredited individual investors who are at least 18 years of age. We do not knowingly collect personal information from individuals under the age of 18.",
    },
    {
      title: "18. Third-Party Websites",
      content:
        "Our website may contain links to third-party portals or digital asset exchanges. We are not responsible for the privacy practices or contents of those external websites, and encourage you to review their terms directly.",
    },
    {
      title: "19. Policy Updates",
      content:
        "We may update this Privacy Policy from time to time to reflect changes in our operational, legal, or regulatory practices. Any updates will be posted on this page with a revised 'Last Updated' date.",
    },
    {
      title: "20. Contact Information",
      content:
        "If you have any questions or comments about this policy, please contact our compliance desk at compliance@soltera.finance or send an enquiry directly through our portal.",
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
              Legal Documentation
            </span>
            <h1 className="text-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Privacy Policy
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
