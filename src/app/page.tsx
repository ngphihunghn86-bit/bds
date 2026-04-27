"use client";

import { useMemo, useState } from "react";
import { calculateAllScenarios, ScenarioResult, UnitInput } from "../../lib/calculate";

const sampleData: Record<string, UnitInput> = {
  "Park Residence": {
    maCan: "PR-12A-08",
    phanKhu: "Park Residence",
    dienTich: 72,
    giaNiemYet: 4500000000,
    chietKhauPhanTram: 8,
    vonTuCo: 1500000000,
    tyLeVayPhanTram: 50,
    laiSuatNamPhanTram: 10.5,
    thoiGianAnHanThang: 18,
    giaThueKyVongThang: 22000000,
    giaBanLaiKyVong: 5200000000,
  },
  "Flora Avenue": {
    maCan: "FA-09B-15",
    phanKhu: "Flora Avenue",
    dienTich: 58,
    giaNiemYet: 3200000000,
    chietKhauPhanTram: 6,
    vonTuCo: 1100000000,
    tyLeVayPhanTram: 50,
    laiSuatNamPhanTram: 10,
    thoiGianAnHanThang: 12,
    giaThueKyVongThang: 17000000,
    giaBanLaiKyVong: 3700000000,
  },
};

const fieldLabels: { key: keyof UnitInput; label: string; unit?: string }[] = [
  { key: "maCan", label: "Mã căn" },
  { key: "phanKhu", label: "Phân khu" },
  { key: "dienTich", label: "Diện tích", unit: "m²" },
  { key: "giaNiemYet", label: "Giá niêm yết", unit: "₫" },
  { key: "chietKhauPhanTram", label: "Chiết khấu", unit: "%" },
  { key: "vonTuCo", label: "Vốn tự có", unit: "₫" },
  { key: "tyLeVayPhanTram", label: "Tỷ lệ vay mặc định", unit: "%" },
  { key: "laiSuatNamPhanTram", label: "Lãi suất năm", unit: "%" },
  { key: "thoiGianAnHanThang", label: "Ân hạn", unit: "tháng" },
  { key: "giaThueKyVongThang", label: "Giá thuê kỳ vọng/tháng", unit: "₫" },
  { key: "giaBanLaiKyVong", label: "Giá bán lại kỳ vọng", unit: "₫" },
];

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("vi-VN");

function formatMetric(label: string, value: number | string) {
  return `${label}: ${typeof value === "number" ? money.format(value) : value}`;
}

function buildZaloMessage(input: UnitInput, result: ScenarioResult) {
  return [
    `📌 Tư vấn căn ${input.maCan} - ${input.phanKhu}`,
    `Diện tích: ${number.format(input.dienTich)}m²`,
    `Kịch bản: ${result.title}`,
    formatMetric("Giá sau chiết khấu", result.giaSauChietKhau),
    formatMetric("Số tiền vay", result.soTienVay),
    formatMetric("Vốn cần ban đầu", result.soTienCanCoBanDau),
    formatMetric("Thiếu vốn so với vốn tự có", result.thieuVon),
    formatMetric("Dòng tiền sau cho thuê/tháng", result.dongTienSauChoThue),
    formatMetric("Lợi nhuận kỳ vọng", result.loiNhuanKyVong),
    `ROI dự kiến: ${result.roiDuKien.toFixed(1)}%`,
    `Kết luận: ${result.ketLuan}`,
    `Gợi ý sale: ${result.goiY}`,
  ].join("\n");
}

export default function Page() {
  const [form, setForm] = useState<UnitInput>(sampleData["Park Residence"]);
  const [pickedScenario, setPickedScenario] = useState<ScenarioResult | null>(null);
  const [copied, setCopied] = useState(false);

  const scenarios = useMemo(() => calculateAllScenarios(form), [form]);

  const handleInput = (key: keyof UnitInput, value: string) => {
    setForm((prev) => {
      const isText = key === "maCan" || key === "phanKhu";
      return {
        ...prev,
        [key]: isText ? value : Number(value) || 0,
      };
    });
  };

  const copyZalo = async () => {
    const selected = pickedScenario ?? scenarios[0];
    const message = buildZaloMessage(form, selected);
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md p-4">
      <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
        <h1 className="text-lg font-bold text-brand-700">Công cụ bóc căn Sun Urban City</h1>
        <p className="text-sm text-slate-600">MVP mobile-first cho sale tư vấn nhanh hiệu quả tài chính.</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(sampleData).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setForm(sampleData[name])}
              className="rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700"
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 space-y-3 rounded-2xl bg-white p-4 shadow-sm">
        {fieldLabels.map((field) => {
          const value = form[field.key];
          const isText = field.key === "maCan" || field.key === "phanKhu";
          return (
            <label key={field.key} className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                {field.label} {field.unit ? `(${field.unit})` : ""}
              </span>
              <input
                type={isText ? "text" : "number"}
                inputMode={isText ? "text" : "decimal"}
                value={value}
                onChange={(event) => handleInput(field.key, event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </label>
          );
        })}
      </section>

      <section className="mt-4 space-y-3">
        {scenarios.map((item) => (
          <button
            key={item.key}
            type="button"
            className="w-full rounded-2xl bg-white p-4 text-left shadow-sm"
            onClick={() => setPickedScenario(item)}
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold">{item.title}</h2>
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  item.ketLuan === "Phù hợp"
                    ? "bg-emerald-100 text-emerald-700"
                    : item.ketLuan === "Cần cân nhắc"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-rose-100 text-rose-700"
                }`}
              >
                {item.ketLuan}
              </span>
            </div>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>Giá sau chiết khấu: {money.format(item.giaSauChietKhau)}</li>
              <li>Số tiền vay: {money.format(item.soTienVay)}</li>
              <li>Tiền cần ban đầu: {money.format(item.soTienCanCoBanDau)}</li>
              <li>Lãi vay/tháng: {money.format(item.laiVayHangThang)}</li>
              <li>Thiếu vốn so với vốn tự có: {money.format(item.thieuVon)}</li>
              <li>Dòng tiền sau cho thuê: {money.format(item.dongTienSauChoThue)}</li>
              <li>Lợi nhuận kỳ vọng: {money.format(item.loiNhuanKyVong)}</li>
              <li>ROI dự kiến: {item.roiDuKien.toFixed(1)}%</li>
            </ul>
            <p className="mt-2 rounded-lg bg-slate-50 p-2 text-sm text-slate-700">{item.goiY}</p>
          </button>
        ))}
      </section>

      <button
        type="button"
        className="sticky bottom-4 mt-4 w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg active:bg-brand-700"
        onClick={copyZalo}
      >
        {copied ? "Đã copy nội dung tư vấn ✅" : "Copy nội dung tư vấn Zalo"}
      </button>
    </main>
  );
}
