# Handoff: register the new Xendit account and hook it to staging

Date: 2026-11-14. Repo: `/Users/alwisofwan/workspace/clients/investpropertyirul`, branch `staging` (= feat/gainproperties-sale-auction-focus @ 890bd6c).

## Context
- Client: PT Gemilang Arta Investasi, site gainproperties.id. Scope: sale (booking fee) and auction/cessie (deposit). Investment/crowdfunding are hidden behind feature flags.
- The old Xendit account can no longer be used. Staging and prod both still run its TEST key (`xnd_development_…`). No real Xendit webhook has reached the server in 14+ days.
- The user has logged in to the new account at https://dashboard.xendit.co/lead-qual in the **Dia** browser and enabled Claude in Chrome. Use the Claude in Chrome tools (`mcp__claude-in-chrome__*`; load via ToolSearch "chrome") on the tab that is already open.

## Tasks
1. **Registration (lead-qual / onboarding):** go through the form in Dia.
   - Do NOT invent business data. Ask the user for each unclear field (business type, volume, products, website, etc.). Known: legal entity PT Gemilang Arta Investasi; website https://gainproperties.id; products = property sale booking fee + auction/cessie deposit.
   - Do NOT describe the business as investment, crowdfunding or returns. The old account was likely rejected over OJK-regulated investment content.
   - Do not upload KTP or other documents. The user does that.
   - Stop and confirm before any final "submit" of activation/KYB.
2. **Test Mode → API key:** Settings → Developers → API Keys. Create a secret key with Money-in (Invoice) Write, and Money-out Write if payouts are to be tested.
3. **Test Mode → Webhooks:** Settings → Developers → Webhooks.
   - Invoice paid → `https://stg.gainproperties.id/xendit/webhook`.
   - Disbursement/payout (if shown) → `https://stg.gainproperties.id/xendit/webhook/payout`.
   - Read the Verification Token.
4. **Put the key and token in the staging `.env` only.** Never print them in chat. Pipe them straight from the browser value to the server, or ask the user to paste them on the server.
   - Server: `ssh -i ~/.ssh/id_ed25519_work root@178.16.131.129`, dir `/var/www/gainproperties-staging`.
   - Keys: `XENDIT_SECRET_KEY` (check the exact name in `config/xendit.php`) and `XENDIT_CALLBACK_TOKEN`. Back up `.env` first.
   - Then `sudo -u www-data HOME=/tmp php artisan config:cache`. Always run artisan as www-data.
   - Do NOT touch prod `/var/www/investpropertyirul`.
5. **E2E test on staging.**
   - QA accounts: `qa-bidder-a@example.com` and `qa-bidder-b@example.com`; password in `/root/.gain_stg_qa_pw`.
   - Pay a deposit on an active auction → the Xendit test invoice opens → simulate payment in the dashboard → the webhook arrives (check `grep xendit/webhook /var/log/nginx/access.log`, not curl) → the deposit is PAID and shows in My Bids / Wallet "Deposit tertahan".
   - Also test a booking fee on a sale listing.

## Progress 2026-11-14

Status: tasks 2–5 done on staging (test mode). Task 1 (KYB) is a draft and has NOT been submitted.

### 1. Registration / KYB (draft, not submitted)
- Lead-qual done: business name **Gain Properties**, Indonesia, entity **PT (PMDN)**, no referral code.
- Source documents are in `tmp/`:
  - `NIB GEMILANG ARTA INVESTASI.pdf`
  - `IZIN SERTIFIKAT PT GAIN.pdf`
  - `NPWP PT GEMILANG ARTA INVESTASI-compressed.pdf`
  - `Domisili Gedung_Gemilang Arta Investasi_2026.pdf`
  - `ktp.jpeg`
  - `xendit-regist.md`
  - The PDFs are scans, so read them as images.
- KBLI in the NIB: **62019** (programming) and **68111** (real estate, owned or leased). There is no investment or financial code, and **no auction code**.
- Step 1 "Business Details" is saved with:
  - Legal name: PT Gemilang Arta Investasi
  - NIB: 1603260087846
  - Establishment date: 16/03/2026. This is the NIB issue date, chosen by the user. The akta is not available.
  - Industry: "Real Estate Agents and Managers". In Xendit's dropdown it is grouped with Payment Gateway, P2P lending and Securities.
  - Phone: +62 851-1785-1818. The user chose this number; the NIB lists 0852-7030-2223.
  - Description, sale only (the user dropped auction and cessie): "Gain Properties (gainproperties.id) is an online property marketplace. Buyers pay a booking fee to reserve a property listed for sale."
  - Address: Jl. Boulevard Raya No. 1, Kensington Office Tower Level 15, Kelapa Gading Timur, Kelapa Gading, Jakarta Utara, DKI Jakarta 14240.
  - Proof of Business is **left unchecked on purpose** (see open item 3 below).
- Step 2 "Business Documents" is not done. It needs:
  - Uploads by the user: NIB, NPWP, Akta Pendirian, SK Menkumham. **The Akta and SK Menkumham are not in `tmp/`.**
  - The 16-digit NPWP 1000000008884227 was typed but not saved.
  - The question "Have you ever made changes to your Akta Pendirian?" has no answer yet.
- Steps 3–4 (Stakeholders, Bank account, Review) have not been opened.

### 2–4. API key, webhooks, staging `.env`
- 2FA is now enabled on the Xendit account by the user. Generating a key requires 2FA, and viewing the webhook token requires the account password.
- Secret key (test) permissions:
  - Money-in Write
  - Money-out Write
  - Balance Read
  - Transaction Read
  - The app needs Balance Read and Transaction Read too, for cashout and the admin Xendit pages. A first key without them failed `xendit:check`. **Delete that first key in the dashboard if it still exists.**
- Webhooks are set on the **legacy** webhook page:
  - Invoices paid, with "notify when expired" checked → `https://stg.gainproperties.id/xendit/webhook`. The app handles EXPIRED.
  - Payouts v2 → `https://stg.gainproperties.id/xendit/webhook/payout`. The app calls `/v2/payouts`.
  - The webhook verification token is on that same legacy page. The newer page has no "View Verification Token" button.
- `XENDIT_SECRET_KEY` and `XENDIT_CALLBACK_TOKEN` in the staging `.env` are now the new account's values. Checked:
  - `php artisan xendit:check`: all checks pass.
  - The token's SHA-256 matches the dashboard value.
  - Dashboard "Test and save" returns 200 on both URLs.
- Helper script `plans/xendit-set-stg-env.sh <KEY>` (untracked):
  - Reads the value from the macOS clipboard, validates it, backs up `.env`, writes the value, then runs `config:cache` as www-data and clears the clipboard. It never prints the value.
  - It is hardcoded to staging. Adapt it before using it for prod or live keys.
- Lesson learned: one run wrote the wrong clipboard contents (51 chars) as the token. Verify by **hash comparison** (page value vs clipboard vs `.env`), not by reading a suffix off a screenshot. The bad `.env.bak` was deleted.
- `.env` backups that remain on staging: `.env.bak.20261114082139`, `…082541`, `…082732`. These hold the old account's values and are kept for rollback.
- Prod `/var/www/investpropertyirul` was not touched. It still runs the old account's test key.

### 5. E2E on staging (passed)
- Logged in as `qa-bidder-a`.
- Auction deposit:
  - Auction #15 (BS Kost Bali, cessie), Rp 160,000,000 → invoice `DP-2611-00004-eybm`.
  - Payment simulated on the checkout page → webhook 200 → Payment PAID, AuctionDeposit #4 `paid`.
  - My Bids shows "Deposit Diterima". Wallet "Deposit tertahan" is Rp 210,000,000 across 3 auctions.
- Booking fee:
  - Staging listing #3 (Rumah Minimalis Bro) had `booking_fee_percent` set to **1%** via tinker. All listings had it null.
  - Rp 2,500,000 → invoice `BK-2611-00001-mh4o` → webhook 200 → Payment PAID, SaleBooking #1 `paid`.
- Payment simulation only works on `checkout-staging.xendit.co`. That domain is not allowed in Claude in Chrome, so the user clicked "Simulate payment". The dashboard Invoices page has no simulate button.
- Not tested: payout (Money-out Write) and the refund of a deposit to the Wallet.

### Client testing setup on staging (2026-11-14, after E2E)
- Client test accounts, both verified with role `user`. Their roles were copied from qa-bidder-a through the `user_roles` table; the User model has no `assignRole`.
  - #11 `client-tester-1@example.com`
  - #12 `client-tester-2@example.com`
  - Both share one password, stored in `/root/.gain_stg_client_pw` (mode 600). Never put it in chat or in docs. To copy it to the clipboard:
    `ssh -i ~/.ssh/id_ed25519_work root@178.16.131.129 'tr -d "\n" < /root/.gain_stg_client_pw' | pbcopy`
  - Internal QA accounts `qa-bidder-a/b` are unchanged, and their password is still in `/root/.gain_stg_qa_pw`.
- Why we provide the accounts instead of letting the client register: the staging `.env` has `MAIL_MAILER=log`, so verification emails never arrive. Booking and deposit require a verified account.
- Booking fee enabled on staging listings, via tinker:
  - #1 Kamil Villas, 1% = Rp 7,500,000. Free for the client to book.
  - #3 Rumah Minimalis Bro, 1% = Rp 2,500,000. Already booked by qa-bidder-a, so other users get "sedang dibooking pembeli lain".
  - Listings #2 and #4 still have no booking fee.
- Short test auction **#16**, created via tinker:
  - Property #18 Villa Modern Loft Canggu, type `auction`.
  - Opening bid Rp 500,000,000, increment Rp 10,000,000, deposit 5% (Rp 25,000,000), 7 payment days, anti-sniping off.
  - `date_start` 2026-11-14 15:56 WIB, `date_finish` **2026-11-14 17:57 WIB**. `auctions:tick` runs every minute from `/etc/cron.d/gainproperties-staging`.
  - Purpose: test closing, the winner's settlement invoice, and the loser's deposit going back to the Wallet. None of these has been verified yet.
  - To reopen it or create a new one for the client, change `date_finish` or create a new auction on a property that has no open auction.
- A WhatsApp draft for the client was written in chat and has not been saved anywhere.
  - Content: progress, test link, test accounts (password in a separate message), test steps, missing documents (akta, SK Menkumham, akta changes), and two decisions (auction licence, `/crowdfunding` on prod).
  - The user sends it.

### Open before submitting KYB / going live
1. Upload the Akta Pendirian and SK Menkumham, and answer the "changes to the akta" question.
2. **Auctions vs KYB:**
   - The description says booking fee only, but the app still charges auction deposits through Xendit.
   - The NIB has no auction code. Private auctions usually need a Balai Lelang licence, and cessie can read as financial.
   - Decide with the client: either hide auctions until licensed, or disclose them together with the licence.
3. **Prod still serves `/crowdfunding` (HTTP 200).** Deploy the feature-flag branch to prod, after client approval, before ticking "Live Website" as Proof of Business.
4. Delete the first, under-permissioned secret key in the Xendit dashboard.
5. Live mode later needs its own key, webhooks and token in prod `.env`.

## Rules
- Reply to the user in very concise Indonesian.
- No AI attribution in commits/PRs (no Co-Authored-By, no "Generated with Claude Code").
- Commit/push only when asked. Merge to main / prod only after the client approves staging.
- Staging has no basic auth (noindex only).

## Open after this (not part of this task)
- Emails (outbid / won / cancel / booking), admin notifications and dashboard, "offer to the 2nd bidder" after a default, auto-close of a suspended auction.
- Content: T&C pages for Booking/Auction, Refund Policy, Privacy, Contact + PT address (required before Xendit live review).
- Remove the "bagi hasil" copy from the Wallet.
