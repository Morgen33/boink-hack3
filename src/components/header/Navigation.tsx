
import { navigationItems } from "@/constants/navigation";

interface NavigationProps {
  onNavClick: (href: string) => void;
}

const Navigation = ({ onNavClick }: NavigationProps) => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navigationItems.map((item) => (
        <button
          key={item.name}
          onClick={() => onNavClick(item.href)}
          className="text-foreground/70 hover:text-foreground transition-colors duration-200 font-medium bg-transparent border-none cursor-pointer"
        >
          {item.name}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
