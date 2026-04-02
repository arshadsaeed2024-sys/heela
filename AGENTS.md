# Heela_Setup — agent and maintainer notes

## Repository

- Static HTML. Netlify publishes the repo root per `netlify.toml` (`publish = "."`).
- **GitHub repo:** [github.com/nolimitwaiz/heela](https://github.com/nolimitwaiz/heela) — GitHub Pages URL: [nolimitwaiz.github.io/heela/](https://nolimitwaiz.github.io/heela/).
- Remote `origin` should point at that repo. If it is missing, run:

   ```bash
   git remote add origin https://github.com/nolimitwaiz/heela.git
   git push -u origin main
   ```

## Connect Netlify (Git — recommended)

1. Ensure this folder is pushed to the repo above (resolve any “remote has commits” case with `git pull origin main --rebase` if needed).
2. From this folder (if you still need to push):

   ```bash
   git push -u origin main
   ```

3. In [Netlify](https://app.netlify.com): **Add new site → Import an existing project**, choose your Git provider and repository.
4. Build settings:
   - **Build command**: leave empty (static site).
   - **Publish directory**: `.` (or rely on `netlify.toml` if Netlify reads it from the repo).

## Connect Netlify (CLI — optional)

Install the CLI, then authenticate and link this directory once:

```bash
npm install -g netlify-cli
netlify login
cd ~/Desktop/Heela_Setup
netlify init
```

Use `netlify deploy` for draft deploys or `netlify deploy --prod` for production when not using Git-based deploys.

## Cursor / agent

- Project rules live in `.cursor/rules/`.
- Approve **network** and **git_write** (or **all**) when the agent needs to install tools, push, or run Netlify CLI.
