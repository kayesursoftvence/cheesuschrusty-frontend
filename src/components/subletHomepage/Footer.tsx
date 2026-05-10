export default function Footer() {
  return (
    <footer className="border-t border-border py-16 mt-20 text-white text-sm">
      <div className="container mx-auto px-6 text-center">
        <p className="mb-8">&copy; 2026 ProntoCorso. All rights reserved.</p>
        
        <div className="pt-8 border-t border-border text-xs text-white text-justify md:text-center space-y-4 max-w-4xl mx-auto">
          <p>
            <strong>Disclaimer:</strong> ProntoCorso is an independent educational platform designed to help students prepare for the CILS B1 Cittadinanza Exam. 
            We are <strong>NOT</strong> affiliated, associated, authorized, endorsed by, or in any way officially connected with the 
            <em> Università per Stranieri di Siena</em>, the CILS certification board, or any of their subsidiaries or affiliates.
          </p>
          <p>
            The official CILS website can be found at <a href="https://cils.unistrasi.it/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">cils.unistrasi.it</a>. 
            The name "CILS" as well as related names, marks, emblems, and images are registered trademarks of their respective owners. 
          </p>
        </div>
      </div>
    </footer>
  );
}
