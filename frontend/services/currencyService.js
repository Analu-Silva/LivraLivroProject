const BASE_URL = "http://localhost:8765/currency";

export async function convertValue(value, source = "BRL", target = "USD") {
try {
    const url = `${BASE_URL}/${value}/${source}/${target}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Currency API error: ${res.status}`);
    }
    const text = await res.text();
    // API might return plain number or JSON. Try to parse float.
    const parsed = parseFloat(text);
    if (Number.isNaN(parsed)) {
      // try JSON
        const json = await res.json();
      // assume json has { value: x } or similar
    if (json && (json.value || json.converted || json.result)) {
        return parseFloat(json.value || json.converted || json.result);
        }
        throw new Error("Unable to parse currency response");
    }
    return parsed;
    } catch (err) {
    console.warn("convertValue error", err);
    throw err;
    }
}

export default { convertValue };
