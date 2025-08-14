
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

const features = [
  {
    title: "Calculations",
    description: "Advanced calculation tools for all academic levels",
    href: "/calculs/L1",
    icon: "calculator" as const,
  },
  {
    title: "Drives",
    description: "Comprehensive collection of educational resources",
    href: "/drives",
    icon: "harddrive" as const,
  },
  {
    title: "Videos",
    description: "Interactive learning through visual content",
    href: "/videos",
    icon: "play" as const,
  },
];

export default function FeatureCards() {
  return (
    <section className="container mx-auto px-4 py-16 motion-safe:animate-drop-in">
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              to={feature.href}
              className="group block p-6 rounded-lg border bg-card hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon name={feature.icon} size={20} className="group-hover:text-primary transition-colors" />
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
