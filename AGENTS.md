# Heela_Setup — agent and maintainer notes

## Repository

- Static HTML. Netlify publishes the repo root per `netlify.toml` (`publish = "."`).
- Git is initialized with an initial commit. **You still need** a remote and push (see below).

## Connect Netlify (Git — recommended)

1. Create a new empty repository on GitHub, GitLab, or Bitbucket (do not add a README if you want a clean history, or pull/rebase after).
2. From this folder:

   ```bash
   git remote add origin <YOUR_REPO_GIT_URL>
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
cd /path/to/Heela_Setup
netlify init
```

Use `netlify deploy` for draft deploys or `netlify deploy --prod` for production when not using Git-based deploys.

## Cursor / agent

- Project rules live in `.cursor/rules/`.
- Approve **network** and **git_write** (or **all**) when the agent needs to install tools, push, or run Netlify CLI.
