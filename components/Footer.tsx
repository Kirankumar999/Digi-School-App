export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/60 px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-slate-400">Copyright &copy; 2024 DigiSchool Portal</p>
        <div className="flex items-center gap-4">
          {["Home", "Links", "Contacts", "Footer"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs text-slate-400 hover:text-teal transition"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
