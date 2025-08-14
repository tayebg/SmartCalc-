
import { LucideIcon } from "lucide-react";
import { 
  Globe, 
  Calculator, 
  HardDrive, 
  Play, 
  GraduationCap, 
  BookOpen, 
  StickyNote, 
  Mail, 
  Phone, 
  Linkedin,
  Heart,
  Menu,
  X,
  FileText,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const iconMap = {
  globe: Globe,
  calculator: Calculator,
  harddrive: HardDrive,
  play: Play,
  graduationcap: GraduationCap,
  bookopen: BookOpen,
  stickynote: StickyNote,
  mail: Mail,
  phone: Phone,
  linkedin: Linkedin,
  heart: Heart,
  menu: Menu,
  x: X,
  filetext: FileText,
  checkcircle: CheckCircle,
  alerttriangle: AlertTriangle
} as const;

interface IconProps {
  name: keyof typeof iconMap;
  size?: number;
  className?: string;
}

export const Icon = ({ name, size = 20, className = "" }: IconProps) => {
  const IconComponent = iconMap[name] as LucideIcon;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent 
      size={size} 
      className={`text-current ${className}`}
      strokeWidth={2}
    />
  );
};
