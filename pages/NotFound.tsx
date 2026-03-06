import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // ── Capture UTMs from URL and persist to sessionStorage ──
    const UTM_KEYS = ["utm_source","utm_campaign","utm_medium","utm_content","utm_term","src","sck"];
    const urlParams = new URLSearchParams(window.location.search);
    const storedUtms: Record<string, string> = JSON.parse(sessionStorage.getItem("utms") || "{}");
    let foundUtm = false;
    UTM_KEYS.forEach(k => { if (urlParams.has(k)) { storedUtms[k] = urlParams.get(k)!; foundUtm = true; } });
    if (foundUtm) sessionStorage.setItem("utms", JSON.stringify(storedUtms));

    if (!document.querySelector('script[data-utmify-pixel]')) {
      (window as Window & { pixelId?: string }).pixelId = "699fed529f103cff7458c6ae";
      const a = document.createElement("script");
      a.setAttribute("async", "");
      a.setAttribute("defer", "");
      a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
      a.setAttribute("data-utmify-pixel", "");
      document.head.appendChild(a);
    }
    if (!document.querySelector('script[src="https://cdn.utmify.com.br/scripts/utms/latest.js"]')) {
      const b = document.createElement("script");
      b.src = "https://cdn.utmify.com.br/scripts/utms/latest.js";
      b.setAttribute("data-utmify-prevent-xcod-sck", "");
      b.setAttribute("data-utmify-prevent-subids", "");
      b.async = true;
      b.defer = true;
      document.head.appendChild(b);
    }
  }, []);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
