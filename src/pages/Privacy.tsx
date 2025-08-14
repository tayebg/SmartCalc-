
import { useI18n } from "@/i18n/I18nProvider";

export default function Privacy() {
  const { t } = useI18n();
  return (
    <main className="container mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">{t('privacy.title')}</h1>
      <section className="space-y-6 text-sm">
        <div>
          <p>{t('privacy.description')}</p>
        </div>
      </section>
      <footer className="border-t pt-6 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>© {new Date().getFullYear()} SmartCalc+</span>
          <span>{t('privacy.title')}</span>
        </div>
      </footer>
    </main>
  );
}
