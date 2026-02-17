import {
  BookOpen,
  UserCheck,
  Laptop,
  Award,
  Target,
  Users,
  Globe,
  Lightbulb,
  Heart,
  DollarSign,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  UserCheck,
  Laptop,
  Award,
  Target,
  Users,
  Globe,
  Lightbulb,
  Heart,
  DollarSign,
};

export const getIcon = (name: string): LucideIcon => iconMap[name] || BookOpen;
