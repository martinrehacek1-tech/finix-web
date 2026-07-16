import {
  Home, House, Heart, TrendingUp, Car, Shield, ShieldCheck, PiggyBank, Wallet,
  Landmark, Calculator, Umbrella, Users, FileText, CreditCard,
  Building2, HeartHandshake, GraduationCap, Plane, Briefcase,
  RefreshCw, Ambulance, HouseHeart, Scale, ChartNoAxesCombined, HeartPulse,
  HelpCircle, HousePlus, BriefcaseBusiness,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  house: House,
  heart: Heart,
  "trending-up": TrendingUp,
  car: Car,
  shield: Shield,
  "shield-check": ShieldCheck,
  "piggy-bank": PiggyBank,
  wallet: Wallet,
  landmark: Landmark,
  calculator: Calculator,
  umbrella: Umbrella,
  users: Users,
  "file-text": FileText,
  "credit-card": CreditCard,
  building: Building2,
  "heart-handshake": HeartHandshake,
  "graduation-cap": GraduationCap,
  plane: Plane,
  briefcase: Briefcase,
  "refresh-cw": RefreshCw,
  ambulance: Ambulance,
  "house-heart": HouseHeart,
  scale: Scale,
  "chart-no-axes-combined": ChartNoAxesCombined,
  "heart-pulse": HeartPulse,
  "house-plus": HousePlus,
  "briefcase-business": BriefcaseBusiness,


};

export default function ServiceIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = (name && iconMap[name]) || HelpCircle;
  return <Icon className={className} />;
}