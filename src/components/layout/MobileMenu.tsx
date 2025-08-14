
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();

  const menuItems = [
    { to: "/calculs/L1", label: t('navbar.calculations'), icon: "calculator" as const },
    { to: "/drives", label: t('navbar.drives'), icon: "harddrive" as const },
    { to: "/videos", label: t('navbar.videos'), icon: "play" as const },
    { to: "/tutorials", label: t('navbar.pfe'), icon: "graduationcap" as const },
    { to: "/doctorat", label: t('navbar.doctorat'), icon: "bookopen" as const },
    { to: "/canevas", label: t('navbar.canevas'), icon: "filetext" as const },
    { to: "/notes", label: t('navbar.notes'), icon: "stickynote" as const },
    { to: "/contact", label: t('navbar.contact'), icon: "phone" as const },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md hover:bg-muted transition-colors"
        aria-label="Toggle menu"
      >
        <Icon name={isOpen ? "x" : "menu"} size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/20 z-40"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 22, stiffness: 170 }}
              className="fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-background/95 backdrop-blur border-l z-50"
            >
              <div className="p-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors text-sm"
                  >
                    <Icon name={item.icon} size={18} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
