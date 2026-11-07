import type { MarketKey, MarketInfo, PricedItem } from "../types";
import { testIds } from "../testIds";

type ShoppingListPanelProps = {
  pricedItems: PricedItem[];
  selectedMarket: MarketKey;
  marketOrder: MarketKey[];
  marketPrices: Record<MarketKey, MarketInfo>;
  totalsPerMarket: Record<MarketKey, number>;
  cheapestMarket: MarketKey;
  selectedTotal: number;
  savings: number;
  mostExpensive: { key: MarketKey; val: number };
  hoveredItem: string | null;
  onSelectMarket: (market: MarketKey) => void;
  onAddWholeWeek: () => void;
  onCopyList: () => void;
  onHoverItem: (item: string | null) => void;
  onRemoveItem: (item: PricedItem) => void;
  onClearList: () => void;
  copied: boolean;
  copyFailed: boolean;
};

export function ShoppingListPanel({
  pricedItems,
  selectedMarket,
  marketOrder,
  marketPrices,
  totalsPerMarket,
  cheapestMarket,
  selectedTotal,
  savings,
  mostExpensive,
  hoveredItem,
  onSelectMarket,
  onAddWholeWeek,
  onCopyList,
  onHoverItem,
  onRemoveItem,
  onClearList,
  copied,
  copyFailed,
}: ShoppingListPanelProps) {
  const hasPrices = pricedItems.some((item) => item.prices !== null);

  return (
    <div className="rounded-[20px] sm:rounded-[22px] bg-card border border-rim shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden min-w-0">
      <div className="px-6 sm:px-8 py-6 sm:py-7 min-w-0">
        <div className="flex items-center justify-between gap-3 min-w-0">
          <h3 className="font-instrument text-[18px] text-ink-primary">Grocery &amp; shopping</h3>
          <span data-testid={testIds.itemCountBadge} className="font-dm text-[11px] font-medium tracking-[0.12em] uppercase text-ink-secondary bg-page border border-rim rounded-full px-3 py-1 tabular shrink-0">
            {pricedItems.length} items · {hasPrices ? `AED ${selectedTotal.toFixed(2)}` : "No prices"}
          </span>
        </div>

        <div className="mt-5 -mx-1">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1 snap-x snap-mandatory">
            {marketOrder.map((mk) => {
              const market = marketPrices[mk];
              const isSelected = selectedMarket === mk;
              const isCheapest = mk === cheapestMarket && hasPrices;

              return (
                <button
                  key={mk}
                  data-testid={testIds.marketPill(mk)}
                  onClick={() => onSelectMarket(mk)}
                  className={`snap-start shrink-0 h-[42px] rounded-full border px-4 flex items-center gap-2.5 transition-all active:scale-[0.98] ${
                    isSelected
                      ? "bg-ink-primary border-ink-primary text-page shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
                      : "bg-rim border-rim-hover text-ink-secondary hover:border-rim-deep hover:text-ink-primary"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-dm font-bold tracking-[0.02em] ${isSelected ? "bg-page text-ink-primary" : "text-white border border-rim-hover"}`}
                    style={!isSelected ? { background: market.color } : undefined}
                  >
                    {market.logo}
                  </span>
                  <span className="font-dm text-[11px] font-medium tracking-[0.08em] uppercase tabular whitespace-nowrap">{market.name}</span>
                  <span className="hidden sm:inline font-dm text-[10px] tracking-[0.06em] uppercase tabular whitespace-nowrap text-ink-muted">
                    {market.delivery}
                  </span>
                  {isCheapest && (
                    <span data-testid={testIds.cheapestLabel} className={`ml-1 text-[9px] font-dm font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full ${isSelected ? "bg-page text-ink-primary" : "bg-ink-primary text-page"}`}>
                      cheapest
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {hasPrices && (
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
            {marketOrder.map((mk) => {
              const market = marketPrices[mk];
              const total = totalsPerMarket[mk];
              const isSelected = selectedMarket === mk;
              const isCheap = mk === cheapestMarket;

              return (
                <button
                  key={mk}
                  data-testid={testIds.marketCard(mk)}
                  onClick={() => onSelectMarket(mk)}
                  className={`text-left rounded-[14px] border p-3 transition-all active:scale-[0.98] ${
                    isSelected ? "bg-rim border-ink-primary/30 shadow-[0_6px_18px_rgba(0,0,0,0.25)]" : "bg-page border-rim hover:border-rim-hover"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: market.color }}>
                        {market.logo}
                      </span>
                      <span className="font-dm text-[11px] font-medium tracking-[0.08em] uppercase text-ink-secondary truncate">{market.name.split(" ")[0]}</span>
                    </span>
                    {isCheap && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] shrink-0" />}
                  </div>
                  <div className={`font-dm text-[16px] font-medium tabular-nums mt-2 ${isSelected ? "text-ink-primary" : "text-ink-secondary"}`}>
                    AED {total.toFixed(2)}
                  </div>
                  <div className="font-dm text-[10px] tracking-[0.06em] uppercase text-ink-muted mt-0.5 whitespace-nowrap">
                    {market.fee} fee
                  </div>
                  <div className="font-dm text-[10px] tracking-[0.06em] uppercase text-ink-muted whitespace-nowrap">
                    {market.delivery}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {hasPrices && (
          <p className="mt-2 font-dm text-[10px] leading-[1.5] text-ink-muted">
            Estimated ingredient quantities only; delivery fees are not included.
            {pricedItems.some((item) => !item.prices) && " Unpriced ingredients are excluded from these totals."}
          </p>
        )}

        {hasPrices && savings > 0.01 && (
          <div data-testid={testIds.savingsBanner} className="mt-3 rounded-[12px] bg-[#1a2e1e]/60 border border-[#2a4a2e]/60 px-4 py-2.5 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#2a5a30] flex items-center justify-center text-[11px] text-emerald-200">↘</span>
            <span className="font-dm text-[11px] tracking-[0.04em] text-emerald-200/90">
              Save <span className="font-medium tabular-nums text-emerald-100">AED {savings.toFixed(2)}</span> vs {marketPrices[mostExpensive.key].name} · cheapest is {marketPrices[cheapestMarket].name}
            </span>
          </div>
        )}

        <div className="mt-5 flex gap-2 min-w-0">
          <button data-testid={testIds.addWeekBtn} onClick={onAddWholeWeek} className="flex-1 h-[44px] sm:h-[36px] rounded-full bg-ink-primary text-page hover:bg-ink-cta font-dm text-[11px] font-medium tracking-[0.12em] uppercase transition shadow-[0_8px_20px_rgba(0,0,0,0.25)] active:scale-[0.98] min-w-0">
            Add week
          </button>
          <button data-testid={testIds.copyBtn} aria-live="polite" onClick={onCopyList} className="h-[44px] sm:h-[36px] px-5 rounded-full bg-page border border-rim font-dm text-[11px] font-medium tracking-[0.12em] uppercase text-ink-secondary hover:bg-rim transition tabular active:scale-[0.98] shrink-0">
            {copyFailed ? "Copy failed" : copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="px-3 pb-3 min-w-0">
        {pricedItems.length === 0 ? (
          <div data-testid={testIds.emptyState} className="rounded-[18px] border border-dashed border-rim bg-page/60 p-5 sm:p-6 mx-1 min-w-0">
            <div className="font-instrument text-[16px] text-ink-secondary mb-2 tracking-[-0.01em] break-words">Soft &amp; empty</div>
            <div className="font-dm text-[13px] text-ink-muted leading-[1.8] break-words">
              Select ingredients or add a whole week. Prices are static Dubai estimates, not live retailer prices. Reference: Sep 2026.
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {marketOrder.map((mk) => {
                const market = marketPrices[mk];
                return (
                  <span key={mk} className="inline-flex items-center gap-1.5 rounded-full bg-rim border border-rim-hover px-3 py-1 font-dm text-[10px] tracking-[0.08em] uppercase text-ink-secondary">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white" style={{ background: market.color }}>
                      {market.logo}
                    </span>
                    {market.name}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-[18px] bg-page border border-rim overflow-hidden divide-y divide-rim/70 min-w-0">
            {pricedItems.map((item, idx) => {
              const selectedPrice = item.prices?.[selectedMarket];
              const prices = item.prices;
              const cheapestPrice = prices
                ? Math.min(...marketOrder.map((marketKey) => prices[marketKey]))
                : null;
              const isHovered = hoveredItem === item.id;
              const comparisonId = `market-comparison-${idx}`;

              return (
                <div key={item.id} data-testid={testIds.listItem} data-item-id={item.id} className="relative p-4 group hover:bg-white/[0.03] transition min-w-0" onMouseEnter={() => onHoverItem(item.id)} onMouseLeave={() => onHoverItem(null)}>
                  <div className="flex gap-3 min-w-0">
                    <span className="font-newsreader text-[11px] text-ink-muted mt-[2px] italic tabular shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 min-w-0">
                        <span className="font-dm text-[13px] leading-[1.5] text-ink-secondary flex-1 min-w-0 break-words">{item.original}</span>
                        <span className="shrink-0 text-right">
                          <span className="font-dm text-[13px] font-medium tabular-nums text-ink-primary">
                            {selectedPrice == null ? "Not priced" : `AED ${selectedPrice.toFixed(2)}`}
                          </span>
                          <span className="block font-dm text-[10px] tracking-[0.06em] uppercase text-ink-muted tabular">
                            {item.unit ? `${item.unit} · est.` : "No compatible unit"}
                          </span>
                        </span>
                      </div>
                      {prices && (
                        <button
                          type="button"
                          data-testid={testIds.comparePricesBtn}
                          aria-expanded={isHovered}
                          aria-controls={comparisonId}
                          onClick={() => onHoverItem(isHovered ? null : item.id)}
                          className="mt-2 font-dm text-[10px] tracking-[0.06em] uppercase text-ink-secondary underline underline-offset-2"
                        >
                          {isHovered ? "Hide market prices" : "Compare market prices"}
                        </button>
                      )}
                      {prices && (
                        <div id={comparisonId} data-testid={testIds.priceComparison} hidden={!isHovered} className={`mt-2.5 grid grid-cols-4 gap-1.5 ${isHovered ? "" : "hidden"}`}>
                          {marketOrder.map((mk) => {
                            const productPrice = prices[mk];
                            const isCheapest = productPrice === cheapestPrice;
                            const isSelected = mk === selectedMarket;

                            return (
                              <div key={mk} className={`rounded-[10px] border px-2 py-1.5 ${isSelected ? "bg-rim border-ink-primary/30" : "bg-card border-rim"}`}>
                                <div className="flex items-center gap-1">
                                  <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{ background: marketPrices[mk].color }}>
                                    {marketPrices[mk].logo}
                                  </span>
                                  <span className="font-dm text-[9px] tracking-[0.06em] uppercase text-ink-muted truncate">{marketPrices[mk].name.split(" ")[0]}</span>
                                </div>
                                <div className={`font-dm text-[11px] tabular-nums mt-1 ${isCheapest ? "text-emerald-300" : "text-ink-secondary"} ${isSelected ? "font-medium" : ""}`}>
                                  AED {productPrice.toFixed(2)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {!item.prices && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="font-dm text-[10px] tracking-[0.06em] uppercase text-ink-muted">
                            No comparable market price for this quantity.
                          </span>
                        </div>
                      )}
                    </div>
                    <button data-testid={testIds.itemRemoveBtn} onClick={() => onRemoveItem(item)} className="font-dm text-[11px] tracking-[0.08em] uppercase text-ink-muted hover:text-ink-primary md:opacity-0 md:group-hover:opacity-100 transition shrink-0 active:scale-[0.98] self-start mt-0.5">
                      remove
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="p-4 bg-card flex items-center justify-between">
              <span className="font-dm text-[11px] font-medium tracking-[0.12em] uppercase text-ink-secondary">Estimated ingredient cost at {marketPrices[selectedMarket].name}</span>
              <span className="font-newsreader italic text-[18px] text-ink-primary tabular-nums">AED {selectedTotal.toFixed(2)}</span>
            </div>
          </div>
        )}

        {pricedItems.length > 0 && (
          <>
            <a data-testid={testIds.shopAtLink} href={marketPrices[selectedMarket].url} target="_blank" rel="noopener noreferrer" className="mt-3 w-full h-[44px] rounded-full bg-ink-primary text-page font-dm text-[11px] font-medium tracking-[0.12em] uppercase flex items-center justify-center gap-2 hover:bg-ink-cta transition active:scale-[0.98] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
              Shop this list at {marketPrices[selectedMarket].name} <span className="text-[12px]">↗</span>
            </a>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {marketOrder.filter((mk) => mk !== selectedMarket).slice(0, 3).map((mk) => (
                <a key={mk} href={marketPrices[mk].url} target="_blank" rel="noopener noreferrer" className="h-[36px] rounded-full bg-page border border-rim font-dm text-[10px] font-medium tracking-[0.08em] uppercase text-ink-secondary hover:border-rim-hover hover:text-ink-primary flex items-center justify-center gap-1.5 transition active:scale-[0.98]">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white" style={{ background: marketPrices[mk].color }}>
                    {marketPrices[mk].logo}
                  </span>
                  {marketPrices[mk].name} ↗
                </a>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5 justify-center">
              {marketOrder.map((mk) => {
                const market = marketPrices[mk];
                return (
                  <a key={`foot-${mk}`} href={market.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-page border border-rim px-2.5 py-1 font-dm text-[9px] tracking-[0.06em] uppercase text-ink-muted hover:text-ink-secondary hover:border-rim-hover transition">
                    <span className="w-3 h-3 rounded-full flex items-center justify-center text-[6px] text-white" style={{ background: market.color }}>
                      {market.logo}
                    </span>
                    {market.name} ↗
                  </a>
                );
              })}
            </div>
            <button data-testid={testIds.clearListBtn} onClick={onClearList} className="mt-2 w-full h-[40px] sm:h-9 rounded-full bg-card border border-rim font-dm text-[11px] font-medium tracking-[0.12em] uppercase text-ink-secondary hover:bg-rim transition active:scale-[0.98]">
              Clear list
            </button>
          </>
        )}

        <div className="mt-3 mx-1 rounded-[14px] bg-page border border-rim/60 px-4 py-3">
          <div className="font-dm text-[10px] font-medium tracking-[0.12em] uppercase text-ink-muted mb-1.5">Price estimate basis</div>
          <div className="font-dm text-[11px] leading-[1.6] text-ink-secondary">
            Static estimate based on Dubai market data from Sep 2026; prices are not live or retailer-verified. Example references: chicken breast Carrefour ~42 AED/kg, Géant 45 AED/kg, Spinneys 59.25 AED; feta Spinneys 135 AED/kg, Géant 90 AED.
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="inline-flex rounded-full bg-card border border-rim px-2.5 py-1 font-dm text-[9px] tracking-[0.06em] uppercase text-ink-muted">Carrefour UAE</span>
            <span className="inline-flex rounded-full bg-card border border-rim px-2.5 py-1 font-dm text-[9px] tracking-[0.06em] uppercase text-ink-muted">LuLu Hyper</span>
            <span className="inline-flex rounded-full bg-card border border-rim px-2.5 py-1 font-dm text-[9px] tracking-[0.06em] uppercase text-ink-muted">Spinneys</span>
            <span className="inline-flex rounded-full bg-card border border-rim px-2.5 py-1 font-dm text-[9px] tracking-[0.06em] uppercase text-ink-muted">Géant UAE</span>
          </div>
        </div>
      </div>

      <div className="m-3 mt-2 rounded-[18px] bg-page border border-rim p-5 sm:p-6 min-w-0">
        <div className="font-newsreader italic text-[12px] text-ink-secondary mb-4 tracking-[-0.01em] break-words">Prep logic · soft notes</div>
        <div className="space-y-4">
          {[
            { n: "01", title: "Batch grains Sunday", body: "Freekeh, quinoa, couscous hold 4 days in linen cloth." },
            { n: "02", title: "Proteins that travel", body: "Harissa & tikka better day 2 — flavor softens." },
            { n: "03", title: "Keep crunch separate", body: "Nuts, crackers, leaves last minute for texture." },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex gap-3 sm:gap-3.5 min-w-0">
              <span className="w-6 h-6 rounded-full bg-card border border-rim flex items-center justify-center font-newsreader text-[11px] text-ink-muted italic tabular shrink-0">{n}</span>
              <div className="min-w-0">
                <div className="font-dm text-[12px] font-medium text-ink-primary tracking-[-0.01em] break-words">{title}</div>
                <div className="font-dm text-[11px] text-ink-secondary mt-1 leading-[1.6] break-words">{body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
