import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function predictMentalHealth(formData) {
  const response = await axios.post(`${API_URL}/predict`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 15000,
  });

  return response.data;
}

/** Turns any thrown error into { message, details? } that is safe to show in the UI. */
export function describeError(err) {
  if (!axios.isAxiosError(err)) {
    return { message: err?.message || "Something unexpected went wrong. Please try again." };
  }

  if (err.response) {
    const { status, data } = err.response;
    if (status === 422 && Array.isArray(data?.detail)) {
      return {
        message: "The prediction service rejected some of the values.",
        details: data.detail.map((d) => ({
          field: Array.isArray(d.loc) ? d.loc.filter((p) => p !== "body").join(".") : "request",
          message: d.msg || "Invalid value",
        })),
      };
    }
    return { message: "The prediction service returned an error. Please try again in a moment." };
  }

  if (err.code === "ECONNABORTED") {
    return { message: "The prediction service took too long to respond. Please try again." };
  }

  // No response at all: server down, wrong URL, or the browser blocked it (CORS).
  return {
    message:
      "Can't reach the prediction service. Check that FastAPI is running on port 8000 and that its CORS settings allow http://localhost:5173.",
  };
}
