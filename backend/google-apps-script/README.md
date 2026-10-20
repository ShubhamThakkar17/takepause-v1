# Enquiry inbox: Google Sheets and Drive

This turns the site's enquiry form into a free inbox. You don't need a server.

- Each enquiry becomes a **row in a Google Sheet**. A Status column lets you
  track it: New → Replied → Confirmed (advance paid) → Done.
- Any reference photos are saved to **Google Drive**, in one folder per
  enquiry. The row links straight to that folder.
- If you want, you can also get an **email** for each new enquiry.
- Customers don't need a Google account. That matters, because Google Forms'
  own file-upload question makes every customer sign in.

It runs on Google Apps Script under your own Google account, so the Sheet
and the photos belong to you.

## Setup (about 5 minutes)

1. Go to <https://script.google.com>, sign in with the account that should
   own the enquiries (Rutvi's), and click **New project**.
2. Delete the sample code. Paste in everything from [`Code.gs`](./Code.gs).
   Click **Save** and name the project "Take Pause enquiries".
3. *Optional:* to get emails, set `NOTIFY_EMAIL` near the top of the file to
   your address, then save again.
4. Pick **`setup`** in the function dropdown in the toolbar and click **Run**.
   Google will ask for permission to use Sheets, Drive and Gmail. Approve it.
   You may see "Google hasn't verified this app". That's normal for your own
   script: click **Advanced → Go to Take Pause enquiries**.
   - The log prints links to the new **Take Pause — Enquiries** sheet and the
     **Take Pause — Enquiry photos** folder.
5. Click **Deploy → New deployment**. Click the gear icon and choose
   **Web app**, then set:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**

   Click **Deploy** and copy the **Web app URL**. It ends in `/exec`.
6. To check it's live, open the URL in a browser. You should see
   `{"ok":true,"service":"Take Pause enquiries"}`.
7. Give the URL to the website:
   - **Local:** add `VITE_ENQUIRY_ENDPOINT=<the URL>` to `.env.local`.
   - **Hosting (Netlify / Vercel / Cloudflare Pages):** add the same variable
     in the site's environment settings, then redeploy.

The form now shows a **Send enquiry** button and a photo uploader. Send
yourself a test enquiry and check that the row and the photo folder appear.

## Changing the script later

When you edit `Code.gs`, go to **Deploy → Manage deployments**, click the
pencil icon, set **Version: New version** and click **Deploy**. The URL stays
the same. (A *new* deployment would get a new URL.)

## Privacy

- The Sheet and the photo folder are private to your Google account unless
  you share them.
- People's names and phone numbers are stored in the Sheet. Only use them to
  reply to their enquiry, and delete old rows and folders you no longer need.

## Limits

- Up to 3 photos per enquiry. The browser shrinks each one to 1600px before
  uploading, so a typical photo is 200–600 KB.
- Apps Script's free quotas cover far more enquiries than a home bakery gets:
  about 100 notification emails a day on a personal Gmail account, and no
  practical limit on rows.
- A hidden "honeypot" field quietly drops most spam bots. Formula-looking
  text is stored as plain text, so the Sheet can't be tricked into running
  it.
