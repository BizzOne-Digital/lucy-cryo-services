# Lucy Luxe by Lucy CRYO Services

Website and admin panel for Lucy CRYO Services (home-based medical spa).
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · MongoDB Atlas (Mongoose) · Vercel-ready.

## 1. Setup

```bash
npm install
cp .env.example .env.local
npm run hash-password -- "YourStrongPassword"   # paste the escaped hash into .env.local
npm run dev
```

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string (include the database name) |
| `AUTH_SECRET` | 32+ character random string that signs admin session cookies |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | bcrypt hash. In `.env` files, escape `$` as `\$`. On Vercel, paste the raw hash. |
| `NEXT_PUBLIC_SITE_URL` | Public URL used for the sitemap, canonical URLs and Open Graph |

The first successful login at `/admin/login` creates the admin account in MongoDB.

## 2. Data and seeding

- On the first request with a database connected, the app seeds the 6 services, 3 starter blog posts and 1 promotion. A marker record stops this from running again, so items you delete later are not re-created.
- If MongoDB is missing or unreachable, public pages fall back to the built-in content in `src/lib/defaults.ts`, so no section renders blank.
- Public pages refresh every 60 seconds. Admin saves refresh them immediately.

## 3. Image uploads (serverless-safe)

- `POST /api/upload` (admin only) checks the folder (`products|gallery|pages|misc`), the file type (JPEG/PNG/WEBP/GIF, verified from the file's actual bytes) and the 8MB size limit. It then stores the file in the `StoredUpload` collection.
- `GET /api/uploads/[folder]/[filename]` serves the image with a 1-year immutable cache.
- Content documents store only the URL. After a successful save, an image that was replaced or removed is deleted, but only if nothing else still uses it.
- Legacy `/uploads/...` paths show a placeholder (`resolveImageUrl`).
- Nothing is written to the filesystem.

## 4. Admin

`/admin/dashboard`, `bookings` (bookings and enquiries), `services`, `blogs`, `content` (homepage and page heroes), `promotions`, `gallery`, `uploads`, `settings` (logo, contact details, hours, social links, SEO).

All admin pages and APIs are protected by `src/proxy.ts` and a server-side session check. The session is an HTTP-only signed cookie that lasts 8 hours.

## 5. Deploy (Vercel)

1. Import the repository and add the environment variables above.
2. In MongoDB Atlas → Network Access, allow Vercel (`0.0.0.0/0`, or Vercel's IP ranges if you use Secure Compute).
3. Deploy, log in at `/admin/login`, then upload the official logo under Settings.

## 6. Email notifications (future)

`src/lib/notifications.ts` is called for every new booking and enquiry. Connect an email provider (Resend, SendGrid or Postmark) there. Keep its API key server-only, never in `NEXT_PUBLIC_*`.

## Content compliance

Service text uses wording like "designed to support" and "may help", and includes the line "Results and suitability vary by individual." Before adding credentials, approvals or clinical claims, check that the client has supplied and verified them.
