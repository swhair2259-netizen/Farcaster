import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for dev. Replace with a proper DB in production.
const store = {
  userAccessToken: null,
  pages: {}, // pageId -> { access_token }
  instagramAccounts: {}, // igUserId -> {}
  xAccessToken: null,
  xUserId: null,
};

const FB_APP_ID = process.env.FB_APP_ID || "YOUR_FB_APP_ID";
const FB_APP_SECRET = process.env.FB_APP_SECRET || "YOUR_FB_APP_SECRET";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5174";

const X_CLIENT_ID = process.env.X_CLIENT_ID || "YOUR_X_CLIENT_ID";
const X_CLIENT_SECRET = process.env.X_CLIENT_SECRET || "YOUR_X_CLIENT_SECRET";
const X_BEARER_TOKEN = process.env.X_BEARER_TOKEN || "YOUR_X_BEARER_TOKEN";

// Start the OAuth flow for Facebook (includes Instagram Graph permissions)
app.get("/auth/facebook", (req, res) => {
  const redirectUri = encodeURIComponent(`${req.protocol}://${req.get("host")}/auth/facebook/callback`);
  const scopes = encodeURIComponent("pages_show_list,pages_read_engagement,pages_read_user_content,instagram_basic");
  const state = "dev_state"; // in prod use a CSRF token per session
  const url = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes}`;
  res.redirect(url);
});

// OAuth callback
app.get("/auth/facebook/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.redirect(`${FRONTEND_URL}/?connected=facebook&error=missing_code`);
  }

  try {
    // Exchange code for user access token
    const tokenRes = await fetch(`https://graph.facebook.com/v17.0/oauth/access_token?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(
      `${req.protocol}://${req.get("host")}/auth/facebook/callback`
    )}&client_secret=${FB_APP_SECRET}&code=${code}`);
    const tokenData = await tokenRes.json();
    if (tokenData.error) throw tokenData.error;

    store.userAccessToken = tokenData.access_token;

    // Get pages the user manages and store page access tokens
    const pagesRes = await fetch(`https://graph.facebook.com/v17.0/me/accounts?access_token=${store.userAccessToken}`);
    const pagesData = await pagesRes.json();
    if (pagesData && pagesData.data) {
      pagesData.data.forEach((p) => {
        store.pages[p.id] = { access_token: p.access_token, name: p.name };
      });
    }

    // Try to map connected Instagram business accounts from pages
    for (const pageId of Object.keys(store.pages)) {
      try {
        const resp = await fetch(`https://graph.facebook.com/v17.0/${pageId}?fields=instagram_business_account&access_token=${store.pages[pageId].access_token}`);
        const body = await resp.json();
        if (body.instagram_business_account && body.instagram_business_account.id) {
          store.instagramAccounts[body.instagram_business_account.id] = { pageId };
        }
      } catch (e) {
        // ignore per-page errors
      }
    }

    return res.redirect(`${FRONTEND_URL}/?connected=facebook`);
  } catch (e) {
    console.error("FB OAuth error", e);
    return res.redirect(`${FRONTEND_URL}/?connected=facebook&error=oauth_failed`);
  }
});

// Return connection status and pages
app.get("/api/facebook/status", (req, res) => {
  res.json({ connected: !!store.userAccessToken, pages: store.pages, instagramAccounts: store.instagramAccounts });
});

// Fetch page feed (requires page access token)
app.get("/api/facebook/:pageId/feed", async (req, res) => {
  const pageId = req.params.pageId;
  const page = store.pages[pageId];
  if (!page) return res.status(404).json({ error: "page_not_connected" });

  try {
    const feedRes = await fetch(`https://graph.facebook.com/v17.0/${pageId}/feed?access_token=${page.access_token}&fields=message,created_time,id,permalink_url`);
    const feed = await feedRes.json();
    res.json(feed);
  } catch (e) {
    res.status(500).json({ error: "failed_fetch", details: String(e) });
  }
});

// Fetch Instagram media for a connected Instagram business account
app.get("/api/instagram/:igUserId/media", async (req, res) => {
  const igUserId = req.params.igUserId;
  // Try to find a page that owns this igUserId
  const linked = store.instagramAccounts[igUserId];
  if (!linked) return res.status(404).json({ error: "ig_not_connected" });

  const page = store.pages[linked.pageId];
  if (!page) return res.status(404).json({ error: "page_not_connected" });

  try {
    const mediaRes = await fetch(`https://graph.facebook.com/v17.0/${igUserId}/media?fields=id,caption,media_url,timestamp,permalink&access_token=${page.access_token}`);
    const media = await mediaRes.json();
    res.json(media);
  } catch (e) {
    res.status(500).json({ error: "failed_fetch", details: String(e) });
  }
});

// X (Twitter) OAuth - Start auth flow
app.get("/auth/twitter", (req, res) => {
  const redirectUri = encodeURIComponent(`${req.protocol}://${req.get("host")}/auth/twitter/callback`);
  const state = "dev_state_twitter"; // in prod use CSRF token
  const url = `https://twitter.com/i/oauth2/authorize?client_id=${X_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=tweet.read%20users.read%20follows.read&state=${state}`;
  res.redirect(url);
});

// X (Twitter) OAuth - Callback
app.get("/auth/twitter/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.redirect(`${FRONTEND_URL}/?connected=twitter&error=missing_code`);
  }

  try {
    const redirectUri = `${req.protocol}://${req.get("host")}/auth/twitter/callback`;
    const tokenRes = await fetch("https://twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${X_CLIENT_ID}:${X_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`,
    });
    const tokenData = await tokenRes.json();
    if (tokenData.error) throw tokenData.error;

    store.xAccessToken = tokenData.access_token;

    // Get user info to store user ID
    try {
      const userRes = await fetch("https://api.twitter.com/2/users/me", {
        headers: { Authorization: `Bearer ${store.xAccessToken}` },
      });
      const userData = await userRes.json();
      if (userData.data && userData.data.id) {
        store.xUserId = userData.data.id;
      }
    } catch (e) {
      console.warn("Failed to fetch X user ID", e);
    }

    return res.redirect(`${FRONTEND_URL}/?connected=twitter`);
  } catch (e) {
    console.error("X OAuth error", e);
    return res.redirect(`${FRONTEND_URL}/?connected=twitter&error=oauth_failed`);
  }
});

// Return X connection status
app.get("/api/twitter/status", (req, res) => {
  res.json({ connected: !!store.xAccessToken, userId: store.xUserId });
});

// Fetch X timeline
app.get("/api/twitter/timeline", async (req, res) => {
  if (!store.xAccessToken || !store.xUserId) {
    return res.status(404).json({ error: "twitter_not_connected" });
  }

  try {
    const timelineRes = await fetch(`https://api.twitter.com/2/users/${store.xUserId}/tweets?max_results=10&tweet.fields=created_at,public_metrics&expansions=author_id`, {
      headers: { Authorization: `Bearer ${store.xAccessToken}` },
    });
    const timeline = await timelineRes.json();
    res.json(timeline);
  } catch (e) {
    res.status(500).json({ error: "failed_fetch", details: String(e) });
  }
});

const PORT = process.env.PORT || 5175;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));

export default app;
