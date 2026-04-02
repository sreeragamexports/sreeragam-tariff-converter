"use client";

import { useState, useEffect } from "react";

interface Inputs {
  invoiceValue: string;
  tariffIncluded: boolean;
  currentTariffPct: string;
  addCvdPct: string;
  freight: string;
  insurance: string;
  targetTariffPct: string;
}

interface Results {
  preFobValue: number;
  addCvdValue: number;
  preTariffFob: number;
  tariffInUsd: number;
  fob: number;
  newTariffInUsd: number;
  newInvoiceValue: number;
}

function calculate(inputs: Inputs): Results | null {
  const inv = parseFloat(inputs.invoiceValue);
  const freight = parseFloat(inputs.freight) || 0;
  const insurance = parseFloat(inputs.insurance) || 0;
  const addCvdPct = (parseFloat(inputs.addCvdPct) || 0) / 100;
  const currentTariffPct = (parseFloat(inputs.currentTariffPct) || 0) / 100;
  const targetTariffPct = (parseFloat(inputs.targetTariffPct) || 0) / 100;

  if (isNaN(inv) || inv <= 0) return null;

  const preFobValue = inv - freight - insurance;

  let fob: number;
  let addCvdValue: number;
  let preTariffFob: number;
  let tariffInUsd: number;

  if (inputs.tariffIncluded && currentTariffPct > 0) {
    // Tariff is baked into the invoice — back it out
    // preFobValue = FOB * (1 + addCvdPct + currentTariffPct)
    fob = preFobValue / (1 + addCvdPct + currentTariffPct);
    addCvdValue = fob * addCvdPct;
    preTariffFob = preFobValue - addCvdValue;
    tariffInUsd = preTariffFob - fob;
  } else {
    // Tariff not included
    fob = preFobValue / (1 + addCvdPct);
    addCvdValue = fob * addCvdPct;
    preTariffFob = preFobValue;
    tariffInUsd = 0;
  }

  const newTariffInUsd = fob * targetTariffPct;
  const newInvoiceValue = fob + addCvdValue + newTariffInUsd + freight + insurance;

  return { preFobValue, addCvdValue, preTariffFob, tariffInUsd, fob, newTariffInUsd, newInvoiceValue };
}

function fmt(val: number, d = 4) {
  return val.toFixed(d);
}

function Row({
  label,
  value,
  sub,
  color,
  bold,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-start py-2.5">
      <div>
        <p className={`text-sm ${bold ? "font-semibold text-slate-800" : "text-slate-600"}`}>{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <p className={`text-sm font-mono ml-4 shrink-0 ${bold ? "font-bold text-base" : ""} ${color ?? "text-slate-700"}`}>
        {value}
      </p>
    </div>
  );
}

export default function Home() {
  const [inputs, setInputs] = useState<Inputs>({
    invoiceValue: "",
    tariffIncluded: true,
    currentTariffPct: "",
    addCvdPct: "10.0014",
    freight: "",
    insurance: "",
    targetTariffPct: "",
  });

  const [results, setResults] = useState<Results | null>(null);

  useEffect(() => {
    setResults(calculate(inputs));
  }, [inputs]);

  const set = (field: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const inputCls =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-right text-slate-800 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-1">Sreeragam Exports</p>
          <h1 className="text-2xl font-bold text-slate-800">Reciprocal Tariff Converter</h1>
          <p className="mt-1 text-sm text-slate-500">USA Shipments — Convert invoice values between tariff rates</p>
        </div>

        {/* Input Card */}
        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6 mb-5">
          <h2 className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-widest">Inputs</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm text-slate-600 shrink-0 w-48">Invoice Value (USD)</label>
              <input className={inputCls} type="number" placeholder="e.g. 4.7" value={inputs.invoiceValue} onChange={set("invoiceValue")} />
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="text-sm text-slate-600 shrink-0 w-48">Tariff in Invoice?</label>
              <div className="flex gap-2">
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setInputs((p) => ({ ...p, tariffIncluded: opt === "Yes" }))}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      (opt === "Yes") === inputs.tariffIncluded
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {inputs.tariffIncluded && (
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-slate-600 shrink-0 w-48">Current Tariff %</label>
                <div className="relative w-full">
                  <input className={inputCls} type="number" placeholder="e.g. 50" value={inputs.currentTariffPct} onChange={set("currentTariffPct")} />
                  <span className="absolute right-3 top-2 text-slate-400 text-xs">%</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <label className="text-sm text-slate-600 shrink-0 w-48">ADD / CVD++ %</label>
              <div className="relative w-full">
                <input className={inputCls} type="number" placeholder="e.g. 10.0014" value={inputs.addCvdPct} onChange={set("addCvdPct")} />
                <span className="absolute right-3 top-2 text-slate-400 text-xs">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="text-sm text-slate-600 shrink-0 w-48">Freight (USD)</label>
              <input className={inputCls} type="number" placeholder="e.g. 0.10" value={inputs.freight} onChange={set("freight")} />
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="text-sm text-slate-600 shrink-0 w-48">Insurance (USD)</label>
              <input className={inputCls} type="number" placeholder="e.g. 0.000588" value={inputs.insurance} onChange={set("insurance")} />
            </div>

            <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <label className="text-sm font-semibold text-blue-700 shrink-0 w-48">Target Tariff %</label>
              <div className="relative w-full">
                <input
                  className="w-full rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-right text-blue-800 text-sm font-semibold shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="number"
                  placeholder="e.g. 10"
                  value={inputs.targetTariffPct}
                  onChange={set("targetTariffPct")}
                />
                <span className="absolute right-3 top-2 text-blue-400 text-xs">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {results ? (
          <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6">
            <h2 className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-widest">Breakdown</h2>
            <div className="divide-y divide-slate-50">
              <Row label="Pre-FOB Value" value={`$${fmt(results.preFobValue)}`} sub="Invoice − Freight − Insurance" />
              <Row label={`ADD / CVD++ Value (${inputs.addCvdPct || "0"}%)`} value={`$${fmt(results.addCvdValue)}`} />
              <Row label="Pre-Tariff FOB" value={`$${fmt(results.preTariffFob)}`} sub="Pre-FOB − ADD/CVD++" />
              {inputs.tariffIncluded && parseFloat(inputs.currentTariffPct) > 0 && (
                <Row label={`Tariff Stripped (${inputs.currentTariffPct}%)`} value={`−$${fmt(results.tariffInUsd)}`} color="text-red-500" />
              )}
              <Row label="Actual FOB" value={`$${fmt(results.fob)}`} color="text-slate-800" bold />
            </div>

            <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">At Target Tariff ({inputs.targetTariffPct || "0"}%)</p>
              <div className="divide-y divide-slate-50">
                <Row label={`New Tariff in USD`} value={`$${fmt(results.newTariffInUsd)}`} color="text-emerald-600" />
                <Row
                  label="New Invoice Value"
                  value={`$${fmt(results.newInvoiceValue)}`}
                  sub="FOB + ADD/CVD++ + New Tariff + Freight + Insurance"
                  color="text-blue-700"
                  bold
                />
              </div>
            </div>

            {/* Summary bar */}
            <div className="mt-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
              <div>
                <p className="text-xs opacity-70">Original Invoice</p>
                <p className="text-xl font-bold font-mono">${parseFloat(inputs.invoiceValue || "0").toFixed(4)}</p>
                <p className="text-xs opacity-60">{inputs.tariffIncluded ? `With ${inputs.currentTariffPct || "0"}% Tariff` : "No Tariff Included"}</p>
              </div>
              <div className="text-2xl opacity-40">→</div>
              <div className="text-right">
                <p className="text-xs opacity-70">Revised Invoice</p>
                <p className="text-xl font-bold font-mono">${fmt(results.newInvoiceValue)}</p>
                <p className="text-xs opacity-60">With {inputs.targetTariffPct || "0"}% Tariff</p>
              </div>
            </div>

            {results.newInvoiceValue < parseFloat(inputs.invoiceValue || "0") && (
              <p className="mt-3 text-center text-sm text-emerald-600 font-semibold">
                Savings: ${fmt(parseFloat(inputs.invoiceValue || "0") - results.newInvoiceValue)} per unit
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-8 text-center text-slate-400 text-sm">
            Enter an invoice value above to see the breakdown.
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">Sreeragam Exports · {new Date().getFullYear()}</p>
      </div>
    </main>
  );
}
