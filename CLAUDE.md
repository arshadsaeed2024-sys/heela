# Heela — Claude Context File

Read this at the start of every session to get up to speed instantly.

## The Project
Heela is a nonprofit helping refugee students in the US navigate college applications. Founded by Arshad Saeed. Static HTML site hosted on Netlify. Full context in memory files at `~/.claude/projects/-Users-arshadsaeed-Desktop-Heela-Setup/memory/`.

## Workflow Rules
- **Every code change:** push to GitHub (`git push origin main`) → Netlify auto-deploys. Never ask Arshad to touch Netlify.
- **Every DB change:** use `supabase db query --linked "SQL"`. Never ask Arshad to touch Supabase dashboard for code/schema changes.
- Arshad does the work at a high level. Claude handles all implementation.

## Key Credentials
- **Supabase URL:** `https://ffoarsbuqrlbpkvaxvha.supabase.co`
- **Supabase anon key:** `sb_publishable_l7lnXsEMcrB0whXR6GCbIw_M4bwwCpe`
- **Supabase CLI:** already linked to project `ffoarsbuqrlbpkvaxvha`
- **GitHub repo:** `arshadsaeed2024-sys/heela` (main branch)
- **Live site:** `https://heela.org`

## Pages
- `/` — Main site (`index.html`)
- `/signup.html` — Student signup
- `/fellow-signup.html` — Fellow application
- `/login.html` — Login (students + fellows)
- `/dashboard.html` — Student portal
- `/messages.html` — Student ↔ Fellow chat

## Database Tables
`waitlist` · `students` · `fellows` · `assignments` · `messages`

## What's Pending
1. Arshad adding Resend DNS records in Squarespace → then paste API key → configure Supabase SMTP
2. Fellow dashboard
3. Admin panel
4. Fix mobile hamburger menu (`.nav-links.show` CSS missing)
5. Wire up Donate button
