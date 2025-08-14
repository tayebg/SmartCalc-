import { Link, NavLink } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import ThemeSwitcher from "./ThemeSwitcher";
import MobileMenu from "./MobileMenu";
import { useI18n } from "@/i18n/I18nProvider";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navbar() {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [hidden, setHidden] = useState(false); // controls header visibility on mobile
  const lastY = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const ticking = useRef(false);

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm transition-smooth ${isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/60"}`;

  // Mobile: hide on scroll down, show on scroll up; also respond to swipe gestures
  useEffect(() => {
    if (!isMobile) {
      setHidden(false);
      return;
    }

    lastY.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        if (y < 10) {
          setHidden(false); // always show near the top
        } else {
          if (delta > 2) setHidden(true); // scrolling down
          else if (delta < -2) setHidden(false); // scrolling up
        }
        lastY.current = y;
        ticking.current = false;
      });
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY.current == null) return;
      const currentY = e.touches[0]?.clientY ?? 0;
      const dy = currentY - touchStartY.current;
      if (Math.abs(dy) > 24) {
        if (dy < 0) setHidden(true); // swipe up → hide
        else setHidden(false); // swipe down → show
        touchStartY.current = currentY;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [isMobile]);

  const headerClasses = `fixed top-0 left-0 right-0 z-50 w-full border-b glass-navbar backdrop-blur transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`;

  return (
    <header className={headerClasses}>
      <nav className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="hover-scale transition-transform">
          <span className="font-semibold">SmartCalc+</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/calculs/L1" className={navCls} end>
            <div className="flex items-center gap-2">
              <Icon name="calculator" size={16} />
              {t('navbar.calculations')}
            </div>
          </NavLink>
          <NavLink to="/drives" className={navCls} end>
            <div className="flex items-center gap-2">
              <Icon name="harddrive" size={16} />
              {t('navbar.drives')}
            </div>
          </NavLink>
          <NavLink to="/videos" className={navCls} end>
            <div className="flex items-center gap-2">
              <Icon name="play" size={16} />
              {t('navbar.videos')}
            </div>
          </NavLink>
          <NavLink to="/tutorials" className={navCls} end>
            <div className="flex items-center gap-2">
              <Icon name="graduationcap" size={16} />
              {t('navbar.pfe')}
            </div>
          </NavLink>
          <NavLink to="/doctorat" className={navCls} end>
            <div className="flex items-center gap-2">
              <Icon name="bookopen" size={16} />
              {t('navbar.doctorat')}
            </div>
          </NavLink>
          <NavLink to="/canevas" className={navCls} end>
            <div className="flex items-center gap-2">
              <Icon name="filetext" size={16} />
              {t('navbar.canevas')}
            </div>
          </NavLink>
          <NavLink to="/notes" className={navCls} end>
            <div className="flex items-center gap-2">
              <Icon name="stickynote" size={16} />
              {t('navbar.notes')}
            </div>
          </NavLink>
          <NavLink to="/contact" className={navCls} end>
            <div className="flex items-center gap-2">
              <Icon name="phone" size={16} />
              {t('navbar.contact')}
            </div>
          </NavLink>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
