'use client'
import { useEffect, useRef } from "react"

function useTradingViewWidget(scriptUrl: string, config: Record<string, unknown>, height = 600) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    if (containerEl.dataset.loaded) return;

    containerEl.innerHTML = `<div class="tradingview-widget-container__widget" style="width: 100%; height: ${height}px;"></div>`;

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.innerHTML = JSON.stringify(config);

    containerEl.appendChild(script);
    containerEl.dataset.loaded = "true";

    return () => {
      if (!containerEl) return;
      if (containerEl.contains(script)) {
        containerEl.removeChild(script);
      }
      containerEl.innerHTML = "";
      delete containerEl.dataset.loaded;
    };
  }, [scriptUrl, height, JSON.stringify(config)]);

  return containerRef;
}

export default useTradingViewWidget