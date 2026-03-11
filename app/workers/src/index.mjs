const APP_TITLE = "HQ Helper";

function json(data, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data, null, 2), { ...init, headers });
}

function html(body, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  return new Response(body, { ...init, headers });
}

async function checkDatabase(env) {
  try {
    const result = await env.DB.prepare("SELECT 1 AS ok").first();
    return {
      ok: result?.ok === 1,
      detail: "D1 binding responded",
    };
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "Unknown D1 error",
    };
  }
}

function renderHome(env) {
  const hostname = env.APP_HOSTNAME || "HQHelper.savvy-des.com";
  const appEnv = env.APP_ENV || "dev";
  const version = env.APP_VERSION || "bootstrap";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${APP_TITLE}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f1efe7;
        --panel: rgba(255, 252, 244, 0.88);
        --ink: #1f1d1a;
        --muted: #6f675d;
        --accent: #9f3d22;
        --accent-soft: #d98a5f;
        --line: rgba(31, 29, 26, 0.12);
        --shadow: 0 24px 60px rgba(69, 41, 18, 0.18);
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: Georgia, "Times New Roman", serif;
        color: var(--ink);
        background:
          radial-gradient(circle at top, rgba(217, 138, 95, 0.32), transparent 35%),
          linear-gradient(180deg, #f8f4e7 0%, var(--bg) 100%);
      }

      main {
        width: min(960px, calc(100% - 32px));
        margin: 0 auto;
        padding: 56px 0 72px;
      }

      .hero {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 28px;
        box-shadow: var(--shadow);
        overflow: hidden;
      }

      .hero-inner {
        padding: 40px 32px 24px;
        background:
          linear-gradient(135deg, rgba(159, 61, 34, 0.12), transparent 55%),
          linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2));
      }

      .eyebrow {
        display: inline-block;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(159, 61, 34, 0.08);
        color: var(--accent);
        font-size: 12px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      h1 {
        margin: 18px 0 12px;
        font-size: clamp(40px, 7vw, 76px);
        line-height: 0.95;
      }

      p {
        margin: 0;
        color: var(--muted);
        font-size: 18px;
        line-height: 1.6;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        padding: 24px 32px 32px;
      }

      .card {
        padding: 18px;
        border-radius: 18px;
        border: 1px solid var(--line);
        background: rgba(255,255,255,0.72);
      }

      .card strong {
        display: block;
        margin-bottom: 8px;
        font-size: 13px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--accent);
      }

      code {
        font-family: "SFMono-Regular", SFMono-Regular, ui-monospace, monospace;
        font-size: 14px;
        color: var(--ink);
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 24px;
      }

      a.button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 0 16px;
        border-radius: 999px;
        color: white;
        background: linear-gradient(135deg, var(--accent), var(--accent-soft));
        text-decoration: none;
        font-weight: 600;
      }

      a.link {
        color: var(--accent);
        text-decoration: none;
        align-self: center;
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <div class="hero-inner">
          <span class="eyebrow">Cloudflare Workers Fork</span>
          <h1>${APP_TITLE}</h1>
          <p>
            The new Cloudflare-native deployment is now bootstrapped at <code>${hostname}</code>.
            This is the migration foundation: Terraform owns the Worker service, custom domain,
            and D1 database while the Node/Socket.IO stack is being replatformed.
          </p>
          <div class="actions">
            <a class="button" href="/api/health">API Health</a>
            <a class="link" href="/api/meta">View deployment metadata</a>
          </div>
        </div>
        <div class="grid">
          <article class="card">
            <strong>Environment</strong>
            <code>${appEnv}</code>
          </article>
          <article class="card">
            <strong>Version</strong>
            <code>${version}</code>
          </article>
          <article class="card">
            <strong>Database</strong>
            <code>D1 bound as DB</code>
          </article>
          <article class="card">
            <strong>Next</strong>
            <code>Port REST API, then realtime</code>
          </article>
        </div>
      </section>
    </main>
  </body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      const database = await checkDatabase(env);

      return json({
        ok: database.ok,
        service: "hq-helper-worker",
        environment: env.APP_ENV || "dev",
        hostname: env.APP_HOSTNAME || null,
        database,
        checkedAt: new Date().toISOString(),
      });
    }

    if (url.pathname === "/api/meta") {
      return json({
        service: "hq-helper-worker",
        environment: env.APP_ENV || "dev",
        hostname: env.APP_HOSTNAME || null,
        version: env.APP_VERSION || "bootstrap",
        migrationStage: "foundation",
        plannedMilestones: [
          "Terraform-managed Worker and custom domain",
          "D1 schema and repository layer",
          "REST API port",
          "Durable Object realtime port",
          "Frontend migration"
        ]
      });
    }

    return html(renderHome(env));
  }
};
