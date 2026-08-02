# RecruitAI Production MVP

A deployable recruiting platform with Supabase authentication/database/storage, coach athlete search, athlete profiles, messaging, recruiting boards, OpenAI recruiting reports and sampled-frame film review, plus Stripe subscriptions.

## 1. Install locally

Install Node.js LTS, then:

```bash
cp .env.example .env.local
npm install
npm run dev
```

## 2. Create Supabase

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial.sql` in the SQL Editor.
3. Copy the project URL and publishable key into `.env.local`.
4. Put the secret key only in `SUPABASE_SECRET_KEY`; never expose it as `NEXT_PUBLIC_*`.
5. In Auth URL Configuration, add `http://localhost:3000` and your final Vercel URL.

## 3. OpenAI

Add `OPENAI_API_KEY`. The browser samples ten frames from a coach-visible video and sends the sampled images to `/api/ai/film-review`. The key stays server-side.

## 4. Stripe

Create Athlete Pro and College recurring prices, add their price IDs, configure a webhook pointing to `/api/stripe/webhook`, and subscribe to `checkout.session.completed`.

## 5. Deploy to Vercel

Push this folder to GitHub, import it into Vercel, add every environment variable, and deploy. Set `NEXT_PUBLIC_SITE_URL` to your production URL.

## Important product limitations

- This is a production foundation, not a complete enterprise Hudl replacement.
- Film review uses sampled frames, not full temporal player tracking.
- Public video storage is convenient for an MVP. For sensitive film, make the bucket private and generate signed URLs.
- Before onboarding minors, add parental consent, moderation, retention rules, terms, privacy disclosures, and legal review.
- Predictive scholarship, injury, character, NIL, or transfer-risk scores are intentionally not included without validated datasets and governance.
