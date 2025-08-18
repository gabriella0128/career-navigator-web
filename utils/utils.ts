type IsoDateString = `${number}-${number}-${number}`;
type IsoDateTimeString =
  `${number}-${number}-${number}T${number}:${number}:${number}`;

interface YMD {
  year: number;
  month: number;
  day: number;
}

const two = (n: number) => String(n).padStart(2, "0");

// 로컬 타임존 기준으로 'YYYY-MM-DD' 추출
const datePartLocal = (d: Date): IsoDateString => {
  const yyyy = d.getFullYear();
  const mm = two(d.getMonth() + 1);
  const dd = two(d.getDate());
  return `${yyyy}-${mm}-${dd}` as IsoDateString;
};

// 'YYYY-MM-DD' → 'YYYY-MM-DDT00:00:00'
const atMidnight = (datePart: IsoDateString): IsoDateTimeString =>
  `${datePart}T00:00:00` as IsoDateTimeString;

const isYMD = (v: unknown): v is YMD =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as { year?: unknown }).year === "number" &&
  typeof (v as { month?: unknown }).month === "number" &&
  typeof (v as { day?: unknown }).day === "number";

export const toIsoDate = (val: unknown): IsoDateTimeString | "" => {
  if (val == null || val === "") return "";

  // 이미 'YYYY-MM-DD'면 자정 붙여서 반환
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
    return atMidnight(val as IsoDateString);
  }

  // 'YYYY-MM-DDTHH:mm:ss...' 같이 날짜+시간 문자열이면 날짜부분만 추출 후 자정으로
  if (typeof val === "string") {
    const m = val.match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return atMidnight(m[1] as IsoDateString);
    const d = new Date(val);
    return isNaN(d.getTime()) ? "" : atMidnight(datePartLocal(d));
  }

  // 타임스탬프
  if (typeof val === "number") {
    const d = new Date(val);
    return isNaN(d.getTime()) ? "" : atMidnight(datePartLocal(d));
  }

  // Date 객체
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? "" : atMidnight(datePartLocal(val));
  }

  // {year, month(1~12), day}
  if (isYMD(val)) {
    const part =
      `${val.year}-${two(val.month)}-${two(val.day)}` as IsoDateString;
    return atMidnight(part);
  }

  return "";
};
