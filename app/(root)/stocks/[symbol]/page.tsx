import TradingViewWidget from "@/components/tradingViewWidget";
import WatchlistButton from "@/components/watchlistButton";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";
import { WatchlistItem } from '@/database/models/watchlist.model';
import { getStocksDetails } from '@/lib/actions/finhub.actions';
import { getUserWatchlist } from '@/lib/actions/watchlist.actions';
import { notFound } from "next/navigation";


export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  const stockData = await getStocksDetails(symbol.toUpperCase());
  const watchlist = await getUserWatchlist();

  const isInWatchlist = watchlist.some(
    (item: WatchlistItem) => item.symbol === symbol.toUpperCase()
  );

  if (!stockData) notFound();

  return (
    <div className="container py-10">
      <div className="grid stock-details-container">
        <section className="lg:col-span-2 flex flex-col gap-6">
          {/* Left column */}
          <div className="w-full">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}symbol-info.js`}
              config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
              height={170}
            />
          </div>

          <div className="w-full">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}advanced-chart.js`}
              config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
              className="custom-chart"
              height={600}
            />
          </div>

          <div className="w-full">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}advanced-chart.js`}
              config={BASELINE_WIDGET_CONFIG(symbol)}
              className="custom-chart"
              height={600}
            />
          </div>
        </section>

        {/* Right column */}
        <section className="lg:col-span-1 flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between">
            <WatchlistButton symbol={symbol.toUpperCase()} company={stockData.company || symbol.toUpperCase()}
              isInWatchlist={isInWatchlist} />
          </div>

          <div className="w-full">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}technical-analysis.js`}
              config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
              height={400}
            />
          </div>

          <div className="w-full">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}symbol-profile.js`}
              config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
              height={440}
            />
          </div>

          <div className="w-full">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}financials.js`}
              config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
              height={464}
            />
          </div>
        </section>
      </div>
    </div>
  );
}