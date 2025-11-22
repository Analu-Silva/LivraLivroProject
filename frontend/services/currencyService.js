import API_BASE_URL from './api';

const BASE_URL = `${API_BASE_URL}/currency`;

export async function convertValue(value, source = "BRL", target = "USD") {
try {
    const url = `${BASE_URL}/${value}/${source}/${target}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Currency API error: ${res.status}`);
    }
    const text = await res.text();
    const parsed = parseFloat(text);
    if (!Number.isNaN(parsed)) {
      const numericValue = Number(value);
      if (parsed <= 1 && numericValue > 1) {
        return numericValue * parsed;
      }
      return parsed;
    }

    try {
      const json = JSON.parse(text);
      const candidate = json?.value ?? json?.converted ?? json?.result ?? json?.amount ?? json?.rate;
      if (candidate !== undefined && !Number.isNaN(Number(candidate))) {
        const numCandidate = Number(candidate);
        const numericValue = Number(value);
        if (numCandidate <= 1 && numericValue > 1) {
          return numericValue * numCandidate;
        }
        return numCandidate;
      }
    } catch (e) {
      // fallthrough
    }

    const numberMatch = (text || '').match(/[-+]?[0-9]*\.?[0-9]+/);
    if (numberMatch) {
      const extracted = Number(numberMatch[0]);
      const numericValue = Number(value);
      console.warn('convertValue: parsed numeric value from response text via regex', { url, status: res.status, extracted: numberMatch[0] });
      if (!Number.isNaN(extracted)) {
        if (extracted <= 1 && numericValue > 1) {
          return numericValue * extracted;
        }
        return extracted;
      }
    }

    console.warn("convertValue: unable to parse response", {
      url,
      status: res.status,
      headers: Object.fromEntries(res.headers ? res.headers.entries() : []),
      bodyPreview: (text || '').substring(0, 1000),
    });

    throw new Error(`Unable to parse currency response (status=${res.status}). Response preview: ${(text||'').substring(0,200)}`);
    } catch (err) {
    console.warn("convertValue error", err);
    throw err;
    }
}

export default { convertValue };
