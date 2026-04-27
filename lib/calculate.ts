export type Advisory = "Phù hợp" | "Cần cân nhắc" | "Rủi ro cao";

export type ScenarioKey = "no-loan" | "loan-50" | "loan-70";

export interface UnitInput {
  maCan: string;
  phanKhu: string;
  dienTich: number;
  giaNiemYet: number;
  chietKhauPhanTram: number;
  vonTuCo: number;
  tyLeVayPhanTram: number;
  laiSuatNamPhanTram: number;
  thoiGianAnHanThang: number;
  giaThueKyVongThang: number;
  giaBanLaiKyVong: number;
}

export interface ScenarioResult {
  key: ScenarioKey;
  title: string;
  tyLeVayPhanTram: number;
  giaSauChietKhau: number;
  soTienVay: number;
  soTienCanCoBanDau: number;
  laiVayHangThang: number;
  dongTienSauChoThue: number;
  loiNhuanKyVong: number;
  roiDuKien: number;
  thieuVon: number;
  ketLuan: Advisory;
  goiY: string;
}

const SCENARIOS: Record<ScenarioKey, { title: string; loanRate: number }> = {
  "no-loan": { title: "Không vay", loanRate: 0 },
  "loan-50": { title: "Vay nhẹ 50%", loanRate: 50 },
  "loan-70": { title: "Vay tối đa 70%", loanRate: 70 },
};

const toPercent = (value: number) => value / 100;

const getAdvisory = (roi: number, cashflow: number, thieuVon: number): Advisory => {
  if (thieuVon <= 0 && roi >= 15 && cashflow >= 0) return "Phù hợp";
  if (thieuVon <= 200000000 && roi >= 8 && cashflow >= -5000000) return "Cần cân nhắc";
  return "Rủi ro cao";
};

const getAdviceLine = (advisory: Advisory): string => {
  if (advisory === "Phù hợp") {
    return "Căn này có biên lợi nhuận tốt, dễ tư vấn khách chốt nhanh.";
  }
  if (advisory === "Cần cân nhắc") {
    return "Tiềm năng có nhưng cần theo dõi thêm tiến độ, thanh khoản và khẩu vị vay của khách.";
  }
  return "Áp lực tài chính cao, nên điều chỉnh kỳ vọng giá bán lại hoặc giảm tỷ lệ vay.";
};

export function calculateScenario(input: UnitInput, key: ScenarioKey): ScenarioResult {
  const scenario = SCENARIOS[key];
  const priceAfterDiscount = input.giaNiemYet * (1 - toPercent(input.chietKhauPhanTram));
  const loanAmount = priceAfterDiscount * toPercent(scenario.loanRate);
  const equityNeeded = priceAfterDiscount - loanAmount;
  const monthlyInterest = (loanAmount * toPercent(input.laiSuatNamPhanTram)) / 12;
  const monthlyCashflow = input.giaThueKyVongThang - monthlyInterest;
  const expectedProfit = input.giaBanLaiKyVong - priceAfterDiscount;
  const roi = equityNeeded > 0 ? (expectedProfit / equityNeeded) * 100 : 0;
  const thieuVon = Math.max(equityNeeded - input.vonTuCo, 0);
  const ketLuan = getAdvisory(roi, monthlyCashflow, thieuVon);

  return {
    key,
    title: scenario.title,
    tyLeVayPhanTram: scenario.loanRate,
    giaSauChietKhau: priceAfterDiscount,
    soTienVay: loanAmount,
    soTienCanCoBanDau: equityNeeded,
    laiVayHangThang: monthlyInterest,
    dongTienSauChoThue: monthlyCashflow,
    loiNhuanKyVong: expectedProfit,
    roiDuKien: roi,
    thieuVon,
    ketLuan,
    goiY: getAdviceLine(ketLuan),
  };
}

export function calculateAllScenarios(input: UnitInput): ScenarioResult[] {
  return (Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => calculateScenario(input, key));
}
