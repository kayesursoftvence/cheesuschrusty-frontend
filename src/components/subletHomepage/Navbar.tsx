
export default function Navbar() {
  return (
    <nav className="border-b border-border py-6">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="text-xl font-extrabold text-white tracking-tight">
          Pronto<span className="text-primary">Corso</span>
        </div>
        <div className="text-sm text-slate-400 flex items-center gap-2">
          Beta Access: <span className="text-emerald-500 font-semibold">Open</span>
        </div>
      </div>
    </nav>
  );
}
