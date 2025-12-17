import { BookOpen, Phone } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-gradient-to-r from-primary via-accent to-secondary p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* School Name */}
          <div className="flex items-center gap-3 animate-float">
            <div className="bg-card/20 backdrop-blur-sm p-2 rounded-xl">
              <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground drop-shadow-md">
                જડીયાણા પ્રાથમિક શાળા
              </h1>
              <p className="text-primary-foreground/80 text-sm md:text-base">
                ગુજરાતી શબ્દ રમત
              </p>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="bg-card/20 backdrop-blur-sm rounded-xl px-4 py-2 text-primary-foreground text-sm">
            <p className="font-medium">Developed by: Dev Patel</p>
            <p className="flex items-center gap-1 text-primary-foreground/80">
              <Phone className="w-3 h-3" />
              +91 6354236105
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
