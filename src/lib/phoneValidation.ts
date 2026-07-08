export interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  placeholder: string;
  regex: RegExp;
  errorMsg: string;
}

export const COUNTRIES: Country[] = [
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44", placeholder: "7700 900077", regex: /^7\d{9}$/, errorMsg: "UK mobile must be 10 digits starting with 7." },
  { code: "CH", name: "Switzerland",    flag: "🇨🇭", dialCode: "+41", placeholder: "79 123 45 67", regex: /^[1-9]\d{8}$/, errorMsg: "Swiss number must be 9 digits (excluding leading 0)." },
  { code: "US", name: "United States",  flag: "🇺🇸", dialCode: "+1",  placeholder: "201 555 0123", regex: /^[2-9]\d{9}$/, errorMsg: "US number must be 10 digits." },
  { code: "CA", name: "Canada",         flag: "🇨🇦", dialCode: "+1",  placeholder: "613 555 0123", regex: /^[2-9]\d{9}$/, errorMsg: "Canadian number must be 10 digits." },
  { code: "DE", name: "Germany",        flag: "🇩🇪", dialCode: "+49", placeholder: "170 1234567",  regex: /^[1-9]\d{9,11}$/, errorMsg: "German mobile must be 10-12 digits." },
  { code: "FR", name: "France",         flag: "🇫🇷", dialCode: "+33", placeholder: "6 12 34 56 78", regex: /^[67]\d{8}$/, errorMsg: "French mobile must be 9 digits starting with 6 or 7." },
  { code: "BE", name: "Belgium",        flag: "🇧🇪", dialCode: "+32", placeholder: "470 12 34 56", regex: /^[4-9]\d{8}$/, errorMsg: "Belgium mobile must be 9 digits (excluding leading 0)." },
  { code: "IT", name: "Italy",          flag: "🇮🇹", dialCode: "+39", placeholder: "312 345 6789", regex: /^3[1-9]\d{8}$/, errorMsg: "Italian mobile must be 10 digits starting with 3." },
  { code: "ES", name: "Spain",          flag: "🇪🇸", dialCode: "+34", placeholder: "612 34 56 78", regex: /^[67]\d{8}$/, errorMsg: "Spanish mobile must be 9 digits starting with 6 or 7." },
  { code: "NL", name: "Netherlands",    flag: "🇳🇱", dialCode: "+31", placeholder: "6 12345678",   regex: /^6[1-9]\d{7}$/, errorMsg: "Dutch mobile must be 9 digits starting with 6." },
  { code: "AT", name: "Austria",        flag: "🇦🇹", dialCode: "+43", placeholder: "664 1234567",  regex: /^6[1-9]\d{8,9}$/, errorMsg: "Austrian mobile must be 9-10 digits starting with 6." },
  { code: "SE", name: "Sweden",         flag: "🇸🇪", dialCode: "+46", placeholder: "70 123 45 67", regex: /^7[02369]\d{7}$/, errorMsg: "Swedish mobile must be 9 digits starting with 7." },
  { code: "NO", name: "Norway",         flag: "🇳🇴", dialCode: "+47", placeholder: "406 12 345",   regex: /^[49]\d{7}$/, errorMsg: "Norwegian number must be 8 digits." },
  { code: "DK", name: "Denmark",        flag: "🇩🇰", dialCode: "+45", placeholder: "20 12 34 56",  regex: /^[2-9]\d{7}$/, errorMsg: "Danish number must be 8 digits." },
  { code: "FI", name: "Finland",        flag: "🇫🇮", dialCode: "+358", placeholder: "41 2345678", regex: /^[45]\d{8,9}$/, errorMsg: "Finnish mobile must be 9-10 digits." },
  { code: "PL", name: "Poland",         flag: "🇵🇱", dialCode: "+48", placeholder: "512 345 678",  regex: /^[5-9]\d{8}$/, errorMsg: "Polish mobile must be 9 digits." },
  { code: "PT", name: "Portugal",       flag: "🇵🇹", dialCode: "+351", placeholder: "912 345 678", regex: /^9[1236]\d{7}$/, errorMsg: "Portuguese mobile must be 9 digits starting with 9." },
  { code: "IE", name: "Ireland",        flag: "🇮🇪", dialCode: "+353", placeholder: "85 123 4567", regex: /^8[3-9]\d{7}$/, errorMsg: "Irish mobile must be 9 digits starting with 8." },
  { code: "GR", name: "Greece",         flag: "🇬🇷", dialCode: "+30", placeholder: "691 234 5678", regex: /^6[9]\d{8}$/, errorMsg: "Greek mobile must be 10 digits starting with 69." },
  { code: "LU", name: "Luxembourg",     flag: "🇱🇺", dialCode: "+352", placeholder: "621 123 456", regex: /^6[2-9]\d{6,7}$/, errorMsg: "Luxembourg mobile must be 8-9 digits." },
  { code: "MT", name: "Malta",          flag: "🇲🇹", dialCode: "+356", placeholder: "9912 3456",  regex: /^[79]\d{7}$/, errorMsg: "Maltese number must be 8 digits." },
  { code: "CY", name: "Cyprus",         flag: "🇨🇾", dialCode: "+357", placeholder: "96 123456",  regex: /^9[6-9]\d{6}$/, errorMsg: "Cypriot mobile must be 8 digits starting with 96-99." },
  { code: "AE", name: "UAE",            flag: "🇦🇪", dialCode: "+971", placeholder: "50 123 4567", regex: /^5[0-9]\d{7}$/, errorMsg: "UAE mobile must be 9 digits starting with 5." },
  { code: "SA", name: "Saudi Arabia",   flag: "🇸🇦", dialCode: "+966", placeholder: "51 234 5678", regex: /^5[0-9]\d{7}$/, errorMsg: "Saudi mobile must be 9 digits starting with 5." },
  { code: "QA", name: "Qatar",          flag: "🇶🇦", dialCode: "+974", placeholder: "3312 3456",  regex: /^[3-7]\d{7}$/, errorMsg: "Qatar number must be 8 digits." },
  { code: "KW", name: "Kuwait",         flag: "🇰🇼", dialCode: "+965", placeholder: "5012 3456",  regex: /^[569]\d{7}$/, errorMsg: "Kuwait number must be 8 digits." },
  { code: "BH", name: "Bahrain",        flag: "🇧🇭", dialCode: "+973", placeholder: "3600 1234",  regex: /^[369]\d{7}$/, errorMsg: "Bahrain number must be 8 digits." },
  { code: "OM", name: "Oman",           flag: "🇴🇲", dialCode: "+968", placeholder: "9212 3456",  regex: /^[79]\d{7}$/, errorMsg: "Oman mobile must be 8 digits." },
  { code: "TR", name: "Turkey",         flag: "🇹🇷", dialCode: "+90", placeholder: "501 234 5678", regex: /^5[0-9]\d{8}$/, errorMsg: "Turkish mobile must be 10 digits starting with 5." },
  { code: "IL", name: "Israel",         flag: "🇮🇱", dialCode: "+972", placeholder: "50 234 5678", regex: /^5[0-9]\d{7}$/, errorMsg: "Israeli mobile must be 9 digits starting with 5." },
  { code: "IN", name: "India",          flag: "🇮🇳", dialCode: "+91", placeholder: "98765 43210", regex: /^[6-9]\d{9}$/, errorMsg: "Indian number must be 10 digits starting with 6-9." },
  { code: "PK", name: "Pakistan",       flag: "🇵🇰", dialCode: "+92", placeholder: "301 2345678", regex: /^3[0-9]\d{8}$/, errorMsg: "Pakistani mobile must be 10 digits starting with 3." },
  { code: "BD", name: "Bangladesh",     flag: "🇧🇩", dialCode: "+880", placeholder: "1812 345678", regex: /^1[3-9]\d{8}$/, errorMsg: "Bangladeshi mobile must be 10 digits starting with 1." },
  { code: "CN", name: "China",          flag: "🇨🇳", dialCode: "+86", placeholder: "131 2345 6789", regex: /^1[3-9]\d{9}$/, errorMsg: "Chinese mobile must be 11 digits starting with 1." },
  { code: "JP", name: "Japan",          flag: "🇯🇵", dialCode: "+81", placeholder: "90 1234 5678", regex: /^[79]0\d{8}$/, errorMsg: "Japanese mobile must be 10-11 digits." },
  { code: "KR", name: "South Korea",    flag: "🇰🇷", dialCode: "+82", placeholder: "10 1234 5678", regex: /^10\d{8}$/, errorMsg: "South Korean mobile must be 10 digits starting with 10." },
  { code: "SG", name: "Singapore",      flag: "🇸🇬", dialCode: "+65", placeholder: "8123 4567",   regex: /^[89]\d{7}$/, errorMsg: "Singapore number must be 8 digits starting with 8 or 9." },
  { code: "MY", name: "Malaysia",       flag: "🇲🇾", dialCode: "+60", placeholder: "12 345 6789",  regex: /^1[0-9]\d{7,8}$/, errorMsg: "Malaysian mobile must be 9-10 digits starting with 1." },
  { code: "HK", name: "Hong Kong",      flag: "🇭🇰", dialCode: "+852", placeholder: "5123 4567",  regex: /^[5-9]\d{7}$/, errorMsg: "HK number must be 8 digits." },
  { code: "AU", name: "Australia",      flag: "🇦🇺", dialCode: "+61", placeholder: "412 345 678",  regex: /^4\d{8}$/, errorMsg: "Australian mobile must be 9 digits starting with 4." },
  { code: "NZ", name: "New Zealand",    flag: "🇳🇿", dialCode: "+64", placeholder: "21 123 4567",  regex: /^2[0-9]\d{6,8}$/, errorMsg: "NZ mobile must be 8-10 digits starting with 2." },
  { code: "TH", name: "Thailand",       flag: "🇹🇭", dialCode: "+66", placeholder: "81 234 5678",  regex: /^[689]\d{8}$/, errorMsg: "Thai mobile must be 9 digits." },
  { code: "PH", name: "Philippines",    flag: "🇵🇭", dialCode: "+63", placeholder: "917 123 4567", regex: /^9\d{9}$/, errorMsg: "Philippine mobile must be 10 digits starting with 9." },
  { code: "ZA", name: "South Africa",   flag: "🇿🇦", dialCode: "+27", placeholder: "71 123 4567",  regex: /^[678]\d{8}$/, errorMsg: "SA mobile must be 9 digits starting with 6, 7, or 8." },
  { code: "NG", name: "Nigeria",        flag: "🇳🇬", dialCode: "+234", placeholder: "802 123 4567", regex: /^[789][01]\d{8}$/, errorMsg: "Nigerian mobile must be 10 digits." },
  { code: "KE", name: "Kenya",          flag: "🇰🇪", dialCode: "+254", placeholder: "712 345678",  regex: /^[17]\d{8}$/, errorMsg: "Kenyan mobile must be 9 digits." },
  { code: "EG", name: "Egypt",          flag: "🇪🇬", dialCode: "+20", placeholder: "100 123 4567", regex: /^1[0-9]\d{8}$/, errorMsg: "Egyptian mobile must be 10 digits starting with 1." },
  { code: "BR", name: "Brazil",         flag: "🇧🇷", dialCode: "+55", placeholder: "11 91234-5678", regex: /^[1-9]{2}9\d{8}$/, errorMsg: "Brazilian mobile must be 11 digits." },
  { code: "MX", name: "Mexico",         flag: "🇲🇽", dialCode: "+52", placeholder: "55 1234 5678", regex: /^[1-9]\d{9}$/, errorMsg: "Mexican number must be 10 digits." },
  { code: "AR", name: "Argentina",      flag: "🇦🇷", dialCode: "+54", placeholder: "11 2345-6789", regex: /^9[1-9]\d{8}$/, errorMsg: "Argentine mobile must be 10 digits starting with 9." },
  {
    code: "GEN",
    name: "Other",
    flag: "🌐",
    dialCode: "",
    placeholder: "+XX XXXX XXXXXX",
    regex: /^\+?[1-9]\d{6,14}$/,
    errorMsg: "Please enter a valid phone number with dial code (7-15 digits).",
  },
];

export const getCountry = (code: string): Country =>
  COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];

export const validatePhoneNumber = (val: string, countryCode: string): string | undefined => {
  const cleanPhone = val.replace(/\s+/g, "").replace(/[-()]/g, "");
  if (!cleanPhone) return "Please enter a phone number.";

  const country = getCountry(countryCode);

  if (country.code === "GEN") {
    return country.regex.test(cleanPhone) ? undefined : country.errorMsg;
  }

  let national = cleanPhone;
  const dialNoPlus = country.dialCode.replace("+", "");

  if (national.startsWith(country.dialCode)) national = national.slice(country.dialCode.length);
  else if (national.startsWith(dialNoPlus)) national = national.slice(dialNoPlus.length);
  else if (national.startsWith("00" + dialNoPlus)) national = national.slice(("00" + dialNoPlus).length);
  else if (national.startsWith("0")) national = national.slice(1);

  return country.regex.test(national) ? undefined : country.errorMsg;
};

export const formatFullPhoneNumber = (val: string, countryCode: string): string => {
  const clean = val.replace(/\s+/g, "").replace(/[-()]/g, "");
  const country = getCountry(countryCode);
  if (country.code === "GEN" || clean.startsWith("+")) return clean;
  const dialNoPlus = country.dialCode.replace("+", "");
  if (clean.startsWith(country.dialCode)) return clean;
  if (clean.startsWith(dialNoPlus)) return "+" + clean;
  if (clean.startsWith("00" + dialNoPlus)) return "+" + clean.slice(2);
  const national = clean.startsWith("0") ? clean.slice(1) : clean;
  return country.dialCode + national;
};
