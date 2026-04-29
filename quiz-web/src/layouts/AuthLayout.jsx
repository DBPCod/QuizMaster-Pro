import HeaderAuth from "../pages/HeaderAuth";

export default function AuthLayout({ children }) {
  return (
    <div className="layout-container">
      <HeaderAuth></HeaderAuth>
      {/* <main>{children}</main> */}
      <footer>2026 My App</footer>
    </div>
  );
}
