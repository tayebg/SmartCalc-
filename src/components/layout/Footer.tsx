
import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";

export default function Footer() { const { t } = useI18n();
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="font-semibold">SmartCalc+</span>
          </div>
          <p className="text-sm text-muted-foreground">{t('footer.tagline')}</p>
          <div className="mt-4 w-full flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-medium mb-1">{t('footer.quickLinks')}</p>
          <nav aria-label="Quick Links" className="grid grid-cols-2 gap-2">
            <Link className="story-link flex items-center gap-2 text-muted-foreground no-underline hover:opacity-80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm" to="/videos">
              <Icon name="play" size={16} />
              {t('footer.videos')}
            </Link>
            <Link className="story-link flex items-center gap-2 text-muted-foreground no-underline hover:opacity-80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm" to="/drives">
              <Icon name="harddrive" size={16} />
              {t('footer.drives')}
            </Link>
            <Link className="story-link flex items-center gap-2 text-muted-foreground no-underline hover:opacity-80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm" to="/calculs/L1">
              <Icon name="calculator" size={16} />
              {t('footer.calculations')}
            </Link>
            <Link className="story-link flex items-center gap-2 text-muted-foreground no-underline hover:opacity-80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm" to="/canevas">
              <Icon name="filetext" size={16} />
              {t('footer.canevas')}
            </Link>
          </nav>
        </div>
        <div>
          <p className="font-medium mb-1">{t('footer.contact')}</p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:tayebekk2004@gmail.com"
              aria-label="Email 1"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon name="mail" size={18} />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-secondary-foreground text-[10px] leading-5 text-center">1</span>
            </a>
            <a
              href="mailto:ilyesbakkar44@gmail.com"
              aria-label="Email 2"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon name="mail" size={18} />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-secondary-foreground text-[10px] leading-5 text-center">2</span>
            </a>
          </div>
          <Link to="/privacy" className="mt-3 inline-block text-sm underline underline-offset-2 hover:opacity-80">{t('footer.privacy')}</Link>
        </div>
      </div>
      <div className="border-t pt-6 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <p className="text-sm text-muted-foreground flex items-center gap-2 whitespace-nowrap">
              {t('footer.madeWith')} <Icon name="heart" size={16} className="text-red-500" />
              <span>by</span>
              <a 
                href="https://instagram.com/t04yeb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="no-underline hover:text-primary transition-colors"
              >
                Bekkouche Tayeb
              </a>
              <span aria-hidden="true" className="px-1">&amp;</span>
              <a 
                href="https://instagram.com/ilys_bkr_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="no-underline hover:text-primary transition-colors"
              >
                Bakkar Ilyes
              </a>
            </p>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} SmartCalc+</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
