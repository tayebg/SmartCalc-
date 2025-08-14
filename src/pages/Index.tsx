
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BaseModal } from "@/components/ui/BaseModal";
import { motion } from "framer-motion";
import FeatureCards from "@/components/ui/FeatureCards";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n/I18nProvider";
import { Icon } from "@/components/ui/Icon";

const FORM_ENDPOINT_1 = "https://formsubmit.co/ajax/tayebekk2004@gmail.com";
const FORM_ENDPOINT_2 = "https://formsubmit.co/ajax/ilyesbakkar44@gmail.com";

const Index = () => {
  const [openWelcome, setOpenWelcome] = useState(false);
  const [openTutorials, setOpenTutorials] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const onSubscribeTutorials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Veuillez saisir un email valide", variant: "destructive" as any });
      return;
    }
    try {
      setLoading(true);
      const fd1 = new FormData();
      fd1.append("email", email);
      fd1.append("_subject", "SmartCalc+ Notify: Tutorials");
      fd1.append("_autoresponse", window.location.origin + "/notify-autoresponse.html");

      const fd2 = new FormData();
      fd2.append("email", email);
      fd2.append("_subject", "SmartCalc+ Notify: Tutorials");
      fd2.append("_autoresponse", window.location.origin + "/notify-autoresponse.html");

      const [res1, res2] = await Promise.all([
        fetch(FORM_ENDPOINT_1, { method: "POST", headers: { Accept: "application/json" }, body: fd1 }),
        fetch(FORM_ENDPOINT_2, { method: "POST", headers: { Accept: "application/json" }, body: fd2 })
      ]);

      if (res1.ok && res2.ok) {
        toast({ title: (<span className="inline-flex items-center gap-2"><Icon name="checkcircle" size={18} />Message sent successfully!</span>) });
        setOpenTutorials(false);
        setEmail("");
      } else if (res1.ok || res2.ok) {
        toast({ title: "Message sent partially - one recipient received it successfully" });
        setOpenTutorials(false);
        setEmail("");
      } else {
        toast({ title: "Oops! Something went wrong. 😅", variant: "destructive" as any });
      }
    } catch (err) {
      toast({ title: "Oops! Something went wrong. 😅", variant: "destructive" as any });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[70vh]">
      <div className="container mx-auto px-4 py-16">
        <section className="text-center space-y-6">
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-3xl md:text-4xl font-bold">
            {t('home.title')}
          </motion.h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t('home.subtitle')}</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button onClick={() => setOpenWelcome(true)} className="gradient-primary text-primary-foreground ripple ripple-primary">{t('home.ctaStart')}</Button>
            <Button variant="outline" onClick={() => setOpenTutorials(true)}>{t('home.watch')}</Button>
          </div>
        </section>

        {/* Ad placeholder - uncomment when ads approved
        <AdBanner dataAdSlot={import.meta.env.VITE_AD_SLOT_HOMEPAGE} />
        */}
      </div>

      <FeatureCards />

      <BaseModal
        open={openWelcome}
        onOpenChange={setOpenWelcome}
        title={t('modals.welcome.title')}
        description={t('modals.welcome.desc')}
      >
        <div className="text-center mt-4 w-full max-w-full px-4">
          <p className="text-sm text-muted-foreground break-words text-center leading-relaxed">
            اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ ﷺ
          </p>
        </div>
      </BaseModal>

      <BaseModal
        open={openTutorials}
        onOpenChange={setOpenTutorials}
        title={t('modals.tutorials.title')}
        description={t('modals.tutorials.desc')}
      >
        <form onSubmit={onSubscribeTutorials} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="notify-email" className="text-sm">{t('contact.email')}</label>
            <input
              id="notify-email"
              type="email"
              required
              className="w-full rounded-md border bg-background text-foreground placeholder:text-muted-foreground px-3 py-2"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpenTutorials(false)}>{t('actions.cancel')}</Button>
            <Button type="submit" className="gradient-primary text-primary-foreground hover-scale" disabled={loading}>
              {loading ? t('states.sending') : t('actions.notifyMe')}
            </Button>
          </div>
        </form>
      </BaseModal>
    </main>
  );
};

export default Index;
