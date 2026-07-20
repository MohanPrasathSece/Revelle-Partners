export interface Country {
  code: string;    // ISO 2-letter
  name: string;
  dial: string;    // e.g. "+44"
  flag: string;    // emoji flag
  localLen: number | [number, number]; // exact digits OR [min, max]
  placeholder: string; // local number example
}

export const COUNTRIES: Country[] = [
  // ── Europe ──────────────────────────────────────────────────
  { code: "IE", name: "Ireland",          dial: "+353", flag: "🇮🇪", localLen: 9, placeholder: "87 123 4567" },
  { code: "GB", name: "United Kingdom",   dial: "+44",  flag: "🇬🇧", localLen: 10, placeholder: "7911 123456" },
  { code: "DE", name: "Germany",          dial: "+49",  flag: "🇩🇪", localLen: [10, 11], placeholder: "30 12345678" },
  { code: "FR", name: "France",           dial: "+33",  flag: "🇫🇷", localLen: 9,  placeholder: "6 12 34 56 78" },
  { code: "ES", name: "Spain",            dial: "+34",  flag: "🇪🇸", localLen: 9,  placeholder: "612 345 678" },
  { code: "IT", name: "Italy",            dial: "+39",  flag: "🇮🇹", localLen: [9, 10], placeholder: "312 345 6789" },
  { code: "NL", name: "Netherlands",      dial: "+31",  flag: "🇳🇱", localLen: 9,  placeholder: "6 12345678" },
  { code: "BE", name: "Belgium",          dial: "+32",  flag: "🇧🇪", localLen: 9,  placeholder: "470 12 34 56" },
  { code: "CH", name: "Switzerland",      dial: "+41",  flag: "🇨🇭", localLen: 9,  placeholder: "76 123 45 67" },
  { code: "AT", name: "Austria",          dial: "+43",  flag: "🇦🇹", localLen: [7, 13], placeholder: "664 1234567" },
  { code: "SE", name: "Sweden",           dial: "+46",  flag: "🇸🇪", localLen: 9,  placeholder: "70 123 45 67" },
  { code: "NO", name: "Norway",           dial: "+47",  flag: "🇳🇴", localLen: 8,  placeholder: "406 12 345" },
  { code: "DK", name: "Denmark",          dial: "+45",  flag: "🇩🇰", localLen: 8,  placeholder: "20 12 34 56" },
  { code: "FI", name: "Finland",          dial: "+358", flag: "🇫🇮", localLen: [9, 10], placeholder: "41 2345678" },
  { code: "PL", name: "Poland",           dial: "+48",  flag: "🇵🇱", localLen: 9,  placeholder: "512 345 678" },
  { code: "PT", name: "Portugal",         dial: "+351", flag: "🇵🇹", localLen: 9,  placeholder: "912 345 678" },
  { code: "IE", name: "Ireland",          dial: "+353", flag: "🇮🇪", localLen: 9,  placeholder: "85 123 4567" },
  { code: "LU", name: "Luxembourg",       dial: "+352", flag: "🇱🇺", localLen: [8, 9], placeholder: "621 123 456" },
  { code: "MT", name: "Malta",            dial: "+356", flag: "🇲🇹", localLen: 8,  placeholder: "9912 3456" },
  { code: "CY", name: "Cyprus",           dial: "+357", flag: "🇨🇾", localLen: 8,  placeholder: "96 123456" },
  { code: "GR", name: "Greece",           dial: "+30",  flag: "🇬🇷", localLen: 10, placeholder: "691 234 5678" },
  // ── Americas ─────────────────────────────────────────────────
  { code: "US", name: "United States",    dial: "+1",   flag: "🇺🇸", localLen: 10, placeholder: "555 012 3456" },
  { code: "CA", name: "Canada",           dial: "+1",   flag: "🇨🇦", localLen: 10, placeholder: "613 555 0123" },
  { code: "MX", name: "Mexico",           dial: "+52",  flag: "🇲🇽", localLen: 10, placeholder: "55 1234 5678" },
  { code: "BR", name: "Brazil",           dial: "+55",  flag: "🇧🇷", localLen: 11, placeholder: "11 91234-5678" },
  { code: "AR", name: "Argentina",        dial: "+54",  flag: "🇦🇷", localLen: 10, placeholder: "11 2345-6789" },
  // ── Middle East ───────────────────────────────────────────────
  { code: "AE", name: "UAE",              dial: "+971", flag: "🇦🇪", localLen: 9,  placeholder: "50 123 4567" },
  { code: "SA", name: "Saudi Arabia",     dial: "+966", flag: "🇸🇦", localLen: 9,  placeholder: "51 234 5678" },
  { code: "QA", name: "Qatar",            dial: "+974", flag: "🇶🇦", localLen: 8,  placeholder: "3312 3456" },
  { code: "KW", name: "Kuwait",           dial: "+965", flag: "🇰🇼", localLen: 8,  placeholder: "5012 3456" },
  { code: "BH", name: "Bahrain",          dial: "+973", flag: "🇧🇭", localLen: 8,  placeholder: "3600 1234" },
  { code: "OM", name: "Oman",             dial: "+968", flag: "🇴🇲", localLen: 8,  placeholder: "9212 3456" },
  { code: "TR", name: "Turkey",           dial: "+90",  flag: "🇹🇷", localLen: 10, placeholder: "501 234 5678" },
  { code: "IL", name: "Israel",           dial: "+972", flag: "🇮🇱", localLen: 9,  placeholder: "50 234 5678" },
  // ── Asia Pacific ──────────────────────────────────────────────
  { code: "IN", name: "India",            dial: "+91",  flag: "🇮🇳", localLen: 10, placeholder: "98765 43210" },
  { code: "PK", name: "Pakistan",         dial: "+92",  flag: "🇵🇰", localLen: 10, placeholder: "301 2345678" },
  { code: "BD", name: "Bangladesh",       dial: "+880", flag: "🇧🇩", localLen: 10, placeholder: "1812 345678" },
  { code: "CN", name: "China",            dial: "+86",  flag: "🇨🇳", localLen: 11, placeholder: "131 2345 6789" },
  { code: "JP", name: "Japan",            dial: "+81",  flag: "🇯🇵", localLen: [10, 11], placeholder: "90 1234 5678" },
  { code: "KR", name: "South Korea",      dial: "+82",  flag: "🇰🇷", localLen: 10, placeholder: "10 1234 5678" },
  { code: "SG", name: "Singapore",        dial: "+65",  flag: "🇸🇬", localLen: 8,  placeholder: "8123 4567" },
  { code: "MY", name: "Malaysia",         dial: "+60",  flag: "🇲🇾", localLen: [9, 10], placeholder: "12 345 6789" },
  { code: "HK", name: "Hong Kong",        dial: "+852", flag: "🇭🇰", localLen: 8,  placeholder: "5123 4567" },
  { code: "AU", name: "Australia",        dial: "+61",  flag: "🇦🇺", localLen: 9,  placeholder: "412 345 678" },
  { code: "NZ", name: "New Zealand",      dial: "+64",  flag: "🇳🇿", localLen: [8, 9], placeholder: "21 123 4567" },
  { code: "TH", name: "Thailand",         dial: "+66",  flag: "🇹🇭", localLen: 9,  placeholder: "81 234 5678" },
  { code: "ID", name: "Indonesia",        dial: "+62",  flag: "🇮🇩", localLen: [9, 12], placeholder: "812 3456 7890" },
  { code: "PH", name: "Philippines",      dial: "+63",  flag: "🇵🇭", localLen: 10, placeholder: "917 123 4567" },
  // ── Africa ───────────────────────────────────────────────────
  { code: "ZA", name: "South Africa",     dial: "+27",  flag: "🇿🇦", localLen: 9,  placeholder: "71 123 4567" },
  { code: "NG", name: "Nigeria",          dial: "+234", flag: "🇳🇬", localLen: 10, placeholder: "802 123 4567" },
  { code: "KE", name: "Kenya",            dial: "+254", flag: "🇰🇪", localLen: 9,  placeholder: "712 345678" },
  { code: "GH", name: "Ghana",            dial: "+233", flag: "🇬🇭", localLen: 9,  placeholder: "23 123 4567" },
  { code: "EG", name: "Egypt",            dial: "+20",  flag: "🇪🇬", localLen: 10, placeholder: "100 123 4567" },
  { code: "MA", name: "Morocco",          dial: "+212", flag: "🇲🇦", localLen: 9,  placeholder: "61 234 5678" },
];

export function validateLocalPhone(local: string, country: Country): string {
  const digits = local.replace(/\D/g, "");
  if (!digits) return "Phone number is required.";
  const len = country.localLen;
  if (typeof len === "number") {
    if (digits.length !== len)
      return `${country.name} numbers must be exactly ${len} digits.`;
  } else {
    const [min, max] = len;
    if (digits.length < min || digits.length > max)
      return `${country.name} numbers must be ${min}-${max} digits.`;
  }
  return "";
}
