import "./globals.css";
import { AuthProvider } from "../context/authcontext";
import { ThemeProvider } from "../context/themecontext";
import { Toaster } from "react-hot-toast";

export const metadata = { title: "CampusPortal", description: "Administrative Services Management" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme') || 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            } catch(e) {}
          })();
        `}} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-right" toastOptions={{
              style: { background:"var(--bg-2)", color:"var(--text-primary)", border:"1px solid var(--border)" }
            }}/>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}