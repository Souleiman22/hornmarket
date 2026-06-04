import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="font-extrabold text-lg mb-2 flex items-center gap-2">
            <span className="bg-orange-500 text-white text-xs font-black px-2 py-0.5 rounded-lg">HM</span>
            <span><span className="text-orange-500">Horn</span><span className="text-white">Market</span></span>
          </p>
          <p className="text-sm leading-relaxed text-gray-400">
            Le marché en ligne pour acheter et vendre près de chez vous — gratuitement.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Catégories</h4>
          <ul className="text-sm space-y-2">
            {["Véhicules", "Immobilier", "Électronique", "Mode", "Emploi"].map((c) => (
              <li key={c}>
                <Link href={`/annonces?category=${c.toLowerCase()}`} className="hover:text-orange-500 transition">{c}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Aide</h4>
          <ul className="text-sm space-y-2">
            <li><span className="hover:text-orange-500 transition cursor-pointer">Comment ça marche</span></li>
            <li><span className="hover:text-orange-500 transition cursor-pointer">Conseils de sécurité</span></li>
            <li><span className="hover:text-orange-500 transition cursor-pointer">Contact</span></li>
            <li><Link href="/annonces/new" className="hover:text-orange-500 transition">Déposer une annonce</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Légal</h4>
          <ul className="text-sm space-y-2">
            <li><span className="hover:text-orange-500 transition cursor-pointer">CGU</span></li>
            <li><span className="hover:text-orange-500 transition cursor-pointer">Confidentialité</span></li>
            <li><span className="hover:text-orange-500 transition cursor-pointer">Cookies</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center text-xs py-4 text-gray-600">
        © {new Date().getFullYear()} HornMarket — Tous droits réservés
      </div>
    </footer>
  );
}
