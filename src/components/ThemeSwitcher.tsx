export type Theme = "dark" | "bright" | "system";

export function ThemeSwitcher({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  return (
    <div className="theme-switcher" aria-label="Theme selector">
      {(["bright", "dark", "system"] as Theme[]).map((item) => (
        <button key={item} type="button" className={theme === item ? "active" : ""} onClick={() => setTheme(item)}>
          {item[0].toUpperCase() + item.slice(1)}
        </button>
      ))}
    </div>
  );
}
