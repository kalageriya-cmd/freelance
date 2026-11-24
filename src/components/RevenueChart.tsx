import { useState } from 'react';
import { formatCurrency } from '../utils/formatters';

interface RevenuePoint {
  month: string;
  collected: number;
  pending: number;
  hours: number;
}

interface RevenueChartProps {
  data: RevenuePoint[];
  monthlyTarget: number;
}

export function RevenueChart({ data, monthlyTarget }: RevenueChartProps) {
  const [mode, setMode] = useState<'revenue' | 'hours'>('revenue');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(data.length - 1);

  const maxRevenue = Math.max(
    monthlyTarget * 1.08,
    ...data.map((d) => d.collected + d.pending)
  );
  const maxHours = Math.max(200, ...data.map((d) => d.hours));

  const activePoint = hoveredIdx !== null ? data[hoveredIdx] : data[data.length - 1];

  return (
    <section className="elevation-1 rounded-3xl p-5 sm:p-6 flex flex-col justify-between h-full">
      {/* Header & Mode Switch */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E8EAF2]">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
            {mode === 'revenue'
              ? 'Revenue & Cashflow Trajectory'
              : 'Billable Utilization Cadence'}
          </p>
          <div className="flex items-baseline gap-3 mt-1.5">
            <h2 className="mono-metric text-2xl font-semibold text-[#151B2C]">
              {mode === 'revenue'
                ? formatCurrency(activePoint.collected + activePoint.pending)
                : `${activePoint.hours} hrs`}
            </h2>
            <span className="text-xs font-medium text-[#8A90A5] tnum">
              {activePoint.month} 2026
              {mode === 'revenue' &&
                ` · ${formatCurrency(activePoint.collected)} collected`}
            </span>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Chart metric view"
          className="inline-flex items-center p-1 rounded-lg bg-[#F0F2F8] border border-[#E8EAF2]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'revenue'}
            onClick={() => setMode('revenue')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              mode === 'revenue'
                ? 'bg-[#FFFFFF] text-[#151B2C] shadow-xs'
                : 'text-[#46464D] hover:text-[#151B2C]'
            }`}
          >
            Revenue
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'hours'}
            onClick={() => setMode('hours')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              mode === 'hours'
                ? 'bg-[#FFFFFF] text-[#151B2C] shadow-xs'
                : 'text-[#46464D] hover:text-[#151B2C]'
            }`}
          >
            Hours
          </button>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="relative pt-6 pb-2">
        {/* Target dashed rule when in revenue mode */}
        {mode === 'revenue' && (
          <div
            className="absolute left-0 right-0 border-t border-dashed border-[#6C63FF]/45 pointer-events-none flex justify-end"
            style={{
              top: `${24 + (1 - monthlyTarget / maxRevenue) * 188}px`,
            }}
          >
            <span className="text-[10.5px] font-medium text-[#4D41DF] bg-[#FFFFFF] px-1.5 -mt-2.5 tnum">
              Target {formatCurrency(monthlyTarget)}
            </span>
          </div>
        )}

        <div className="grid grid-cols-6 gap-3 sm:gap-5 items-end h-[212px]">
          {data.map((point, idx) => {
            const isHovered = hoveredIdx === idx;
            if (mode === 'revenue') {
              const total = point.collected + point.pending;
              const totalPct = Math.max(8, (total / maxRevenue) * 100);
              const collectedPct = (point.collected / total) * 100;
              const pendingPct = 100 - collectedPct;

              return (
                <button
                  key={point.month}
                  type="button"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onFocus={() => setHoveredIdx(idx)}
                  className="group flex flex-col items-center h-full justify-end focus:outline-none"
                >
                  <div className="w-full max-w-[44px] h-[180px] flex flex-col justify-end">
                    <div
                      className={`w-full rounded-t-lg overflow-hidden flex flex-col justify-end transition-opacity ${
                        isHovered ? 'opacity-100 ring-2 ring-[#6C63FF]/30' : 'opacity-90 group-hover:opacity-100'
                      }`}
                      style={{ height: `${totalPct}%` }}
                    >
                      {point.pending > 0 && (
                        <div
                          className="w-full bg-[#DCE2F9]"
                          style={{ height: `${pendingPct}%` }}
                        />
                      )}
                      <div
                        className={`w-full transition-colors ${
                          isHovered ? 'bg-[#6C63FF]' : 'bg-[#252B48]'
                        }`}
                        style={{ height: `${collectedPct}%` }}
                      />
                    </div>
                  </div>
                  <span
                    className={`mt-2.5 text-xs font-medium ${
                      isHovered ? 'text-[#101632] font-semibold' : 'text-[#8A90A5]'
                    }`}
                  >
                    {point.month}
                  </span>
                </button>
              );
            }

            const hrsPct = Math.max(10, (point.hours / maxHours) * 100);
            return (
              <button
                key={point.month}
                type="button"
                onMouseEnter={() => setHoveredIdx(idx)}
                onFocus={() => setHoveredIdx(idx)}
                className="group flex flex-col items-center h-full justify-end focus:outline-none"
              >
                <div className="w-full max-w-[44px] h-[180px] flex flex-col justify-end">
                  <div
                    className={`w-full rounded-t-lg transition-colors ${
                      isHovered
                        ? 'bg-[#6C63FF] ring-2 ring-[#6C63FF]/30'
                        : 'bg-[#252B48]/85 group-hover:bg-[#6C63FF]'
                    }`}
                    style={{ height: `${hrsPct}%` }}
                  />
                </div>
                <span
                  className={`mt-2.5 text-xs font-medium ${
                    isHovered ? 'text-[#101632] font-semibold' : 'text-[#8A90A5]'
                  }`}
                >
                  {point.month}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E8EAF2] text-xs text-[#46464D]">
        {mode === 'revenue' ? (
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-xs bg-[#252B48]" />
              <span>Collected</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-xs bg-[#DCE2F9]" />
              <span>Pending Remittance</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-xs bg-[#6C63FF]" />
              <span>Focused Period</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-xs bg-[#252B48]" />
              <span>Billable Hours Logged</span>
            </span>
          </div>
        )}
        <span className="text-[#8A90A5] tnum">
          6-Month Total: {formatCurrency(data.reduce((s, d) => s + d.collected, 0))}
        </span>
      </div>
    </section>
  );
}
