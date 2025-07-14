
import { navigationItems } from "@/constants/navigation";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

interface NavigationProps {
  onNavClick: (href: string) => void;
}

const Navigation = ({ onNavClick }: NavigationProps) => {
  const { user } = useSimpleAuth();
  
  const authRequiredItems = ['Daily Matches', 'My Matches', 'Discover'];
  
  const filteredItems = navigationItems.filter(item => {
    if (authRequiredItems.includes(item.name)) {
      return user !== null;
    }
    return true;
  });

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {filteredItems.map((item) => (
        item.external ? (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/70 hover:text-foreground transition-colors duration-200 font-medium"
          >
            {item.name}
          </a>
        ) : (
          <button
            key={item.name}
            onClick={() => onNavClick(item.href)}
            className="text-foreground/70 hover:text-foreground transition-colors duration-200 font-medium bg-transparent border-none cursor-pointer"
          >
            {item.name}
          </button>
        )
      ))}
    </nav>
  );
};

export default Navigation;
