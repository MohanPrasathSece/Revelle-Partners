import process from "process";

const DIAL_CODES: Record<string, string> = {
  CH: "41",
  US: "1",
  GB: "44",
  DE: "49",
  IN: "91",
  FR: "33",
  BE: "32",
  IT: "39",
  ES: "34",
  NL: "31",
  AT: "43",
  SE: "46"
};

export function formatPhoneForCRM(phoneInput: string, countryCode: string = "CH"): string {
  let phone = (phoneInput || "").replace(/[^\d+]/g, "").trim();
  const upperCountry = countryCode.toUpperCase();
  const code = DIAL_CODES[upperCountry] || "41";

  if (phone) {
    if (phone.startsWith("+")) {
      phone = "00" + phone.slice(1);
    }

    if (phone.startsWith(code) && !phone.startsWith("00" + code)) {
      phone = "00" + phone;
    }

    if (phone.startsWith("0") && !phone.startsWith("00")) {
      phone = "00" + code + phone.slice(1);
    }

    if (!phone.startsWith("00")) {
      phone = "00" + code + phone;
    }
  } else {
    phone = "0000000000";
  }

  return phone;
}

export function parseName(fullName: string): { first_name: string; last_name: string } {
  const [first_name, ...lastNameParts] = (fullName || "Unknown").trim().split(" ");
  const last_name = lastNameParts.join(" ") || "Lead";
  return { first_name, last_name };
}

export interface CRMLeadData {
  name: string;
  email: string;
  phone: string;
  number?: string;
  description?: string;
  outlineYourCase?: string;
  countryCode?: string;
}

export async function submitToCRM(leadData: CRMLeadData) {
  const crmEndpoint =
    process.env.CRM_ENDPOINT || "https://api.myinvesttrade.com/api/lead_management/api/affiliates";
  const crmToken = process.env.CRM_TOKEN || "AFF_1_697ac63e6f88cac9f990b1a5c4beaefd";

  const { first_name, last_name } = parseName(leadData.name);
  const countryCode = leadData.countryCode || "CH";
  
  let finalPhone = (leadData.number || leadData.phone || "").replace(/[^0-9+]/g, '');
  if (finalPhone && finalPhone.startsWith('+')) {
      finalPhone = '00' + finalPhone.slice(1);
  } else {
      finalPhone = formatPhoneForCRM(finalPhone, countryCode);
  }
  let countryName = leadData.countryCode ? leadData.countryCode.toLowerCase() : "ch";

  const payload = {
    first_name,
    last_name,
    email: leadData.email,
    phone: finalPhone,
    country: countryName,
    description: leadData.description || leadData.outlineYourCase || "New Lead",
    password: "Password123!"
  };

  // Bypass SSL certificate errors for this specific CRM API (UNABLE_TO_VERIFY_LEAF_SIGNATURE)
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const response = await fetch(crmEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${crmToken}`,
      "x-token": crmToken,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`CRM API request failed: ${response.status} - ${errorText}`);
  }

  return await response.json();
}
