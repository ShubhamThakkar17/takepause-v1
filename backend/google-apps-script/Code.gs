/**
 * Take Pause — enquiry inbox.
 *
 * Receives enquiries from takepause.in, adds each one as a row in a Google
 * Sheet, saves any reference photos into a Drive folder (one sub-folder per
 * enquiry), and emails a short notification.
 *
 * Setup (about five minutes): see README.md in this folder.
 *  1. Paste this file into a new Apps Script project.
 *  2. Run `setup` once — it creates the Sheet and the Drive folder.
 *  3. Deploy → New deployment → Web app (Execute as: Me, Access: Anyone).
 *  4. Put the /exec URL in the site's VITE_ENQUIRY_ENDPOINT.
 */

/** Where notification emails go. Leave empty to skip emails. */
const NOTIFY_EMAIL = "";

/** Limits that keep the inbox tidy and abuse cheap to ignore. */
const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const MAX_FIELD_LENGTH = 2000;

const HEADERS = [
  "Received",
  "Reference",
  "Status",
  "Name",
  "Phone",
  "Bake",
  "Flavour",
  "Filling",
  "Ganache",
  "Toppings",
  "Preferred date",
  "Quantity",
  "Occasion",
  "Pickup or delivery",
  "Notes",
  "Photos",
  "Photo folder",
  "Page",
];

/** Run once from the editor. Safe to re-run: it reuses what already exists. */
function setup() {
  const props = PropertiesService.getScriptProperties();

  let sheetId = props.getProperty("SHEET_ID");
  if (!sheetId) {
    const ss = SpreadsheetApp.create("Take Pause — Enquiries");
    sheetId = ss.getId();
    props.setProperty("SHEET_ID", sheetId);
  }
  const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
  sheet.setName("Enquiries");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#FFCAD4");
    // A dropdown to track each enquiry through to a confirmed order.
    const statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["New", "Replied", "Confirmed (advance paid)", "Declined", "Done"], true)
      .build();
    sheet.getRange("C2:C").setDataValidation(statusRule);
  }

  let folderId = props.getProperty("FOLDER_ID");
  if (!folderId) {
    const folder = DriveApp.createFolder("Take Pause — Enquiry photos");
    folderId = folder.getId();
    props.setProperty("FOLDER_ID", folderId);
  }

  Logger.log("Sheet:  " + SpreadsheetApp.openById(sheetId).getUrl());
  Logger.log("Folder: " + DriveApp.getFolderById(folderId).getUrl());
  Logger.log("Next: Deploy → New deployment → Web app, then copy the /exec URL.");
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Bots fill in the hidden "website" field; people never see it.
    if (data.website) return json({ ok: true, ref: "TP-0000" });

    const name = clean(data.name);
    const phone = clean(data.phone);
    const date = clean(data.date);
    const quantity = clean(data.quantity);
    if (!name || !phone || !date || !quantity || !clean(data.bakeId)) {
      return json({ ok: false, error: "Some required details are missing. Please check the form." });
    }

    const props = PropertiesService.getScriptProperties();
    const sheetId = props.getProperty("SHEET_ID");
    const folderId = props.getProperty("FOLDER_ID");
    if (!sheetId || !folderId) {
      return json({ ok: false, error: "The enquiry inbox isn't set up yet. Please message us instead." });
    }

    const received = new Date();
    const ref = makeRef(received);

    // Photos first, so the row can link straight to them.
    const photos = Array.isArray(data.photos) ? data.photos.slice(0, MAX_PHOTOS) : [];
    let folderUrl = "";
    if (photos.length) {
      const parent = DriveApp.getFolderById(folderId);
      const stamp = Utilities.formatDate(received, "Asia/Kolkata", "yyyy-MM-dd");
      const folder = parent.createFolder(`${stamp} · ${ref} · ${name}`.slice(0, 120));
      photos.forEach(function (photo, i) {
        const bytes = Utilities.base64Decode(String(photo.data || ""));
        if (!bytes.length || bytes.length > MAX_PHOTO_BYTES) return;
        const type = /^image\//.test(photo.type) ? photo.type : "image/jpeg";
        const fileName = `${i + 1}-${clean(photo.name) || "reference.jpg"}`.slice(0, 100);
        folder.createFile(Utilities.newBlob(bytes, type, fileName));
      });
      folderUrl = folder.getUrl();
    }

    lock.waitLock(10000);
    const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
    sheet.appendRow(
      [
        received,
        ref,
        "New",
        name,
        phone,
        clean(data.bakeName),
        clean(data.flavour),
        clean(data.filling),
        clean(data.ganache),
        clean(data.toppings),
        clean(data.dateReadable) || date,
        quantity,
        clean(data.occasion),
        clean(data.fulfilment),
        clean(data.notes),
        photos.length,
        folderUrl,
        clean(data.page),
      ].map(safeCell),
    );
    lock.releaseLock();

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: `New enquiry ${ref} — ${clean(data.bakeName)} for ${clean(data.dateReadable) || date}`,
        body:
          `${clean(data.summary)}\n\n` +
          (folderUrl ? `Reference photos: ${folderUrl}\n` : "") +
          `All enquiries: ${SpreadsheetApp.openById(sheetId).getUrl()}`,
      });
    }

    return json({ ok: true, ref: ref });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: "Something went wrong on our side. Please try again, or message us instead." });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignored) {}
  }
}

/** Lets you open the /exec URL in a browser to check the deployment is live. */
function doGet() {
  return json({ ok: true, service: "Take Pause enquiries" });
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

function clean(value) {
  return String(value == null ? "" : value)
    .trim()
    .slice(0, MAX_FIELD_LENGTH);
}

/** Stops a value like "=IMPORTXML(...)" being run as a formula in the Sheet. */
function safeCell(value) {
  return typeof value === "string" && /^[=+\-@]/.test(value) ? "'" + value : value;
}

/** A short, readable reference like TP-1020-K7Q2. */
function makeRef(date) {
  const day = Utilities.formatDate(date, "Asia/Kolkata", "MMdd");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  return `TP-${day}-${code}`;
}
