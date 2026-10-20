import { bakes, type Bake } from "@/config/menu";
import { brand, contact, enquiry, links } from "@/config/site";

export type EnquiryDetails = {
  name: string;
  phone: string;
  bakeId: string;
  flavour: string;
  filling: string;
  ganache: string;
  toppings: string[];
  date: string;
  quantity: string;
  occasion: string;
  fulfilment: string;
  notes: string;
};

export type Photo = { id: string; file: File; preview: string };

/**
 * How an enquiry leaves the site, in order of preference:
 *  - "sheet":     saved to the Google Sheet (photos to Drive) via Apps Script
 *  - "whatsapp":  opens WhatsApp with the message written out
 *  - "instagram": copies the message and opens an Instagram DM
 *  - null:        nothing configured — the form explains instead of failing
 */
export type Channel = "sheet" | "whatsapp" | "instagram";

export function primaryChannel(): Channel | null {
  if (enquiry.endpoint) return "sheet";
  if (contact.whatsapp) return "whatsapp";
  if (links.instagramDm) return "instagram";
  return null;
}

export const NOT_SURE = "not-sure";

export function findBake(id: string): Bake | undefined {
  return bakes.find((b) => b.id === id);
}

export function bakeLabel(details: Pick<EnquiryDetails, "bakeId">) {
  if (details.bakeId === NOT_SURE)
    return "Not sure yet — would like suggestions";
  return findBake(details.bakeId)?.name ?? details.bakeId;
}

/** Today + n days as yyyy-mm-dd in the visitor's own timezone. */
export function isoDateFromToday(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function readableDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** The enquiry as plain text, for WhatsApp, Instagram or the Sheet's summary. */
export function composeMessage(
  details: EnquiryDetails,
  photoCount = 0,
  ref?: string,
) {
  const lines: [string, string][] = [
    ["Bake", bakeLabel(details)],
    ["Flavour", details.flavour],
    ["Filling", details.filling],
    ["Ganache", details.ganache],
    ["Toppings", details.toppings.join(", ")],
    ["Preferred date", readableDate(details.date)],
    ["Quantity", details.quantity],
    ["Occasion", details.occasion],
    ["Pickup or delivery", details.fulfilment],
    ["Notes", details.notes],
    ["Name", details.name],
    ["Phone", details.phone],
  ];

  const body = lines
    .filter(([, value]) => value && value.trim())
    .map(([label, value]) => `• ${label}: ${value.trim()}`)
    .join("\n");

  const intro = ref
    ? `Hi ${brand.name}! Following up on my enquiry (ref ${ref}).`
    : `Hi ${brand.name}! I'd like to enquire about an order.`;
  const photos = photoCount
    ? `\n\nI have ${photoCount} reference photo${photoCount > 1 ? "s" : ""} to share.`
    : "";

  return `${intro}\n\n${body}${photos}\n\nCould you let me know if this is possible?`;
}

export function whatsappLink(message: string) {
  if (!contact.whatsapp) return null;
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

type EncodedPhoto = { name: string; type: string; data: string };

const readAsBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

/**
 * Shrinks a photo to a sensible upload size. Phone photos are often 5–10 MB;
 * 1600px JPEGs keep all the detail a baker needs at a fraction of that.
 */
async function encodePhoto(file: File): Promise<EncodedPhoto> {
  const base = file.name.replace(/\.[^.]+$/, "") || "reference";
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      enquiry.photoMaxEdge / Math.max(bitmap.width, bitmap.height),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No canvas");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob) throw new Error("Encode failed");
    return {
      name: `${base}.jpg`,
      type: "image/jpeg",
      data: await readAsBase64(blob),
    };
  } catch {
    // Formats the browser can't draw (some HEIC files) are sent as they are,
    // as long as they're small enough to upload.
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(
        `We couldn't process "${file.name}". Please try a JPG or PNG.`,
      );
    }
    return {
      name: file.name,
      type: file.type || "application/octet-stream",
      data: await readAsBase64(file),
    };
  }
}

/**
 * Sends the enquiry to the Apps Script web app. `text/plain` keeps it a
 * "simple" request, which Apps Script accepts cross-origin without a preflight.
 */
export async function submitToSheet(
  details: EnquiryDetails,
  photos: Photo[],
  honeypot: string,
) {
  if (!enquiry.endpoint)
    throw new Error("The enquiry form isn't connected yet.");

  const encoded = await Promise.all(photos.map((p) => encodePhoto(p.file)));
  const payload = {
    ...details,
    toppings: details.toppings.join(", "),
    bakeName: bakeLabel(details),
    dateReadable: readableDate(details.date),
    summary: composeMessage(details, photos.length),
    photos: encoded,
    page: window.location.href,
    website: honeypot,
  };

  let response: Response;
  try {
    response = await fetch(enquiry.endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "We couldn't reach our enquiry inbox. Please check your connection and try again.",
    );
  }

  const result = (await response.json().catch(() => null)) as {
    ok?: boolean;
    ref?: string;
    error?: string;
  } | null;
  if (!response.ok || !result?.ok) {
    throw new Error(
      result?.error ||
        "Something went wrong while sending your enquiry. Please try again.",
    );
  }
  return { ref: result.ref ?? null };
}
