import { Heart, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-card border-t border-border py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Developed with</span>
            <Heart className="w-4 h-4 text-accent fill-accent" />
            <span>by <strong className="text-foreground">Dev Patel</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <span>+91 6354236105</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
