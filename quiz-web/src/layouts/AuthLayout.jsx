export default function AuthLayout({ children }) {
  return (
    <div className="layout-container">
      <header>My Website Header</header>
      <main>{children}</main>
      <footer>2026 My App</footer>
    </div>
  );
}
