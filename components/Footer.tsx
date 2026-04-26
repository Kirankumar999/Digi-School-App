export function Footer() {
  return (
    <footer
      className="px-7 py-4"
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border-soft)",
      }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs" style={{ color: "var(--text-mute)" }}>
          &copy; {new Date().getFullYear()} PradnyaShala · Intelligent School Portal
        </p>
        <div className="flex items-center gap-5">
          {["Privacy", "Terms", "Help", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs transition"
              style={{ color: "var(--text-mute)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-1)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-mute)")}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
