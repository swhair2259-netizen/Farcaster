import { useState, useEffect } from "react";
import "./SocialMediaPage.css";

interface SocialAction {
  [key: string]: {
    liked: boolean;
    followed: boolean;
  };
}

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
}

interface FeedPost {
  id: string;
  message?: string;
  caption?: string;
  created_time?: string;
  timestamp?: string;
  permalink_url?: string;
  media_url?: string;
}

export function SocialMediaPage() {
  const [activeTab, setActiveTab] = useState<"candles" | "dropshipping" | "fundraising" | "wholesale">("candles");
  const [socialActions, setSocialActions] = useState<SocialAction>({
    "candles-facebook": { liked: false, followed: false },
    "candles-instagram": { liked: false, followed: false },
    "candles-twitter": { liked: false, followed: false },
    "dropshipping-facebook": { liked: false, followed: false },
    "dropshipping-instagram": { liked: false, followed: false },
    "dropshipping-twitter": { liked: false, followed: false },
    "fundraising-facebook": { liked: false, followed: false },
    "fundraising-instagram": { liked: false, followed: false },
    "fundraising-twitter": { liked: false, followed: false },
    "wholesale-facebook": { liked: false, followed: false },
    "wholesale-instagram": { liked: false, followed: false },
    "wholesale-twitter": { liked: false, followed: false },
  });

  const [facebookPages, setFacebookPages] = useState<FacebookPage[]>([]);
  const [instagramAccounts, setInstagramAccounts] = useState<Record<string, any>>({});
  const [facebookFeeds, setFacebookFeeds] = useState<Record<string, FeedPost[]>>({});
  const [instagramMedia, setInstagramMedia] = useState<Record<string, FeedPost[]>>({});
  const [twitterTimeline, setTwitterTimeline] = useState<FeedPost[]>([]);
  const [loadingFeeds, setLoadingFeeds] = useState(false);

  const toggleLike = (key: string) => {
    setSocialActions((prev) => ({
      ...prev,
      [key]: { ...prev[key], liked: !prev[key].liked },
    }));
  };

  const toggleFollow = (key: string) => {
    setSocialActions((prev) => ({
      ...prev,
      [key]: { ...prev[key], followed: !prev[key].followed },
    }));
  };

  // Fetch all connected accounts and feeds on mount or when auth params change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected")) {
      fetchConnectedAccounts();
    }
  }, []);

  const fetchConnectedAccounts = async () => {
    setLoadingFeeds(true);
    try {
      // Fetch Facebook status
      const fbStatusRes = await fetch("http://localhost:5175/api/facebook/status");
      if (fbStatusRes.ok) {
        const fbStatus = await fbStatusRes.json();
        if (fbStatus.pages && Object.keys(fbStatus.pages).length > 0) {
          const pages = Object.entries(fbStatus.pages).map(([id, data]: any) => ({
            id,
            name: data.name || "Unknown",
            access_token: data.access_token,
          }));
          setFacebookPages(pages);
          setInstagramAccounts(fbStatus.instagramAccounts || {});

          // Fetch feeds for each page
          for (const page of pages) {
            try {
              const feedRes = await fetch(`http://localhost:5175/api/facebook/${page.id}/feed`);
              if (feedRes.ok) {
                const feed = await feedRes.json();
                setFacebookFeeds((prev) => ({
                  ...prev,
                  [page.id]: feed.data || [],
                }));
              }
            } catch (e) {
              console.warn(`Failed to fetch feed for page ${page.id}`, e);
            }
          }

          // Fetch Instagram media
          for (const [igUserId] of Object.entries(fbStatus.instagramAccounts || {})) {
            try {
              const mediaRes = await fetch(`http://localhost:5175/api/instagram/${igUserId}/media`);
              if (mediaRes.ok) {
                const media = await mediaRes.json();
                setInstagramMedia((prev) => ({
                  ...prev,
                  [igUserId]: media.data || [],
                }));
              }
            } catch (e) {
              console.warn(`Failed to fetch IG media for ${igUserId}`, e);
            }
          }
        }
      }

      // Fetch Twitter status
      const twitterStatusRes = await fetch("http://localhost:5175/api/twitter/status");
      if (twitterStatusRes.ok) {
        const twitterStatus = await twitterStatusRes.json();
        if (twitterStatus.connected) {
          try {
            const timelineRes = await fetch("http://localhost:5175/api/twitter/timeline");
            if (timelineRes.ok) {
              const timeline = await timelineRes.json();
              setTwitterTimeline(timeline.data || []);
            }
          } catch (e) {
            console.warn("Failed to fetch Twitter timeline", e);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to fetch connected accounts", e);
    } finally {
      setLoadingFeeds(false);
    }
  };

  const tabs = [
    { id: "candles", label: "Gem Candles" },
    { id: "dropshipping", label: "Drop Shipping" },
    { id: "fundraising", label: "Fundraising" },
    { id: "wholesale", label: "Wholesale" },
  ];

  const socialPlatforms = [
    { name: "Facebook", icon: "📘", color: "#1877F2" },
    { name: "Instagram", icon: "📷", color: "#E4405F" },
    { name: "X (Twitter)", icon: "𝕏", color: "#000000" },
  ];

  return (
    <div className="social-media-page">
      <h1>Gem Candles Community & Updates</h1>

      <div className="connect-controls">
        <button
          className="connect-button"
          onClick={() => window.open("http://localhost:5175/auth/facebook", "_blank", "noopener")}
        >
          Connect Facebook / Instagram
        </button>
        <button
          className="connect-button"
          onClick={() => window.open("http://localhost:5175/auth/twitter", "_blank", "noopener")}
        >
          Connect X (Twitter)
        </button>
        <button className="connect-button" onClick={fetchConnectedAccounts}>
          Refresh Feeds
        </button>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tab-content">
        <div className="content-header">
          <h2>
            {tabs.find((t) => t.id === activeTab)?.label} - Social Media Feeds
          </h2>
          <p>Follow us on social media for the latest news, updates, and community stories</p>
        </div>

        {loadingFeeds && <div className="loading-message">Loading feeds...</div>}

        <div className="social-feeds">
          {socialPlatforms.map((platform) => {
            const actionKey = `${activeTab}-${platform.name.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")}`;
            const isLiked = socialActions[actionKey]?.liked || false;
            const isFollowed = socialActions[actionKey]?.followed || false;

            let feedData: FeedPost[] = [];
            if (platform.name === "Facebook" && facebookPages.length > 0) {
              feedData = facebookPages.flatMap((page) => facebookFeeds[page.id] || []);
            } else if (platform.name === "Instagram" && Object.keys(instagramAccounts).length > 0) {
              feedData = Object.entries(instagramAccounts).flatMap(([igId]) => instagramMedia[igId] || []);
            } else if (platform.name === "X (Twitter)") {
              feedData = twitterTimeline;
            }

            return (
              <div key={platform.name} className="feed-card">
                <div className="feed-header" style={{ borderTopColor: platform.color }}>
                  <span className="platform-icon">{platform.icon}</span>
                  <h3>{platform.name}</h3>
                </div>
                <div className="feed-content">
                  {feedData.length > 0 ? (
                    <div className="feed-list">
                      {feedData.slice(0, 5).map((post) => (
                        <div key={post.id} className="feed-item">
                          <p className="feed-text">{post.message || post.caption || "Post"}</p>
                          <small className="feed-date">
                            {post.created_time ? new Date(post.created_time).toLocaleDateString() : post.timestamp ? new Date(post.timestamp).toLocaleDateString() : ""}
                          </small>
                          {post.media_url && <img src={post.media_url} alt="post" className="feed-image" />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="feed-placeholder">
                      <p>{platform.name} feed not yet connected</p>
                      <small>Click the Connect button above to authorize {platform.name}</small>
                    </div>
                  )}
                </div>
                <div className="feed-actions">
                  <button
                    className={`action-button like-button ${isLiked ? "active" : ""}`}
                    onClick={() => toggleLike(actionKey)}
                    title="Like this page"
                  >
                    <span className="action-icon">❤️</span>
                    <span className="action-text">{isLiked ? "Liked" : "Like"}</span>
                  </button>
                  <button
                    className={`action-button follow-button ${isFollowed ? "active" : ""}`}
                    onClick={() => toggleFollow(actionKey)}
                    title={`${platform.name === "Instagram" ? "Subscribe" : "Follow"} this account`}
                  >
                    <span className="action-icon">⭐</span>
                    <span className="action-text">
                      {isFollowed
                        ? platform.name === "Instagram"
                          ? "Subscribed"
                          : "Following"
                        : platform.name === "Instagram"
                          ? "Subscribe"
                          : "Follow"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="tab-info">
          {activeTab === "candles" && (
            <div className="info-section">
              <h3>🕯️ Gem Candles</h3>
              <p>
                Discover our premium collection of gem-themed candles. Each candle is handcrafted with natural
                ingredients and stunning crystalline designs. Follow our social channels for new releases, behind-the-scenes content, and customer features.
              </p>
            </div>
          )}
          {activeTab === "dropshipping" && (
            <div className="info-section">
              <h3>📦 Drop Shipping</h3>
              <p>
                Join our drop shipping program and start selling gem candles with no inventory costs. Get exclusive
                access to our catalog, marketing materials, and partner support. Follow our updates for new products and program announcements.
              </p>
            </div>
          )}
          {activeTab === "fundraising" && (
            <div className="info-section">
              <h3>💝 Fundraising</h3>
              <p>
                Perfect for organizations, schools, and nonprofits. Our fundraising program offers high-margin sales opportunities with full support. Connect with us on social media for fundraising success stories and latest offerings.
              </p>
            </div>
          )}
          {activeTab === "wholesale" && (
            <div className="info-section">
              <h3>🏪 Wholesale</h3>
              <p>
                Bulk ordering for retailers and businesses. We offer competitive wholesale pricing and flexible terms.
                Follow our channels for wholesale-exclusive deals, new collections, and industry insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
