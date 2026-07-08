
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
  description: string;
  outlineYourCase?: string;
  countryCode?: string;
}

export async function submitToCRM(leadData: CRMLeadData) {
  const crmEndpoint =
    process.env.CRM_ENDPOINT || "https://inwo.crmcore.me/api/lead_management/api/affiliates";
  const crmToken = process.env.CRM_TOKEN || "AFF_1_92cbc1bc76284e19b711bab22587d75f";

  const { first_name, last_name } = parseName(leadData.name);
  const countryCode = leadData.countryCode || "CH";
  const formattedPhone = formatPhoneForCRM(leadData.phone, countryCode);

  const payload = {
    country_name: countryCode.toLowerCase(),
    description: leadData.description,
    phone: formattedPhone,
    email: leadData.email,
    first_name: first_name,
    last_name: last_name,
    custom_fields: {
      Source_ID: "website",
      How_Much_Invested: "0",
      Outline_Your_Case: leadData.outlineYourCase || "",
    },
  };

  console.log(`[CRM Submission] Payload:`, JSON.stringify(payload));

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
