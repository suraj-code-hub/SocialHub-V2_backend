// ======================================================
// Recent Posts (Instagram + Facebook)
// ======================================================

export const buildRecentPosts = (
  instagramPosts = [],
  facebookPosts = []
) => {
  const instagram = instagramPosts.map((post) => ({
    _id: post.id,
    caption: post.caption || "Instagram Post",
    image: post.media_url || post.thumbnail_url,
    likes: post.like_count || 0,
    comments: post.comments_count || 0,
    createdAt: post.timestamp,
    platform: "Instagram",
    status: "Published",
  }));

  const facebook = facebookPosts.map((post) => ({
    _id: post.id,
    caption: post.message || "Facebook Post",
    image: post.full_picture,
    likes: post.likes?.summary?.total_count || 0,
    comments: post.comments?.summary?.total_count || 0,
    createdAt: post.created_time,
    platform: "Facebook",
    status: "Published",
  }));

  return [...instagram, ...facebook]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);
};

// ======================================================
// Top Post
// ======================================================

export const buildTopPost = (posts = []) => {
  if (!posts.length) return null;

  return [...posts].sort(
    (a, b) => (b.likes + b.comments) - (a.likes + a.comments)
  )[0];
};

// ======================================================
// Dashboard Stats
// ======================================================

export const buildDashboardStats = (
  instagramProfile,
  facebookProfile,
  reach
) => {
  return [
    {
      title: "Instagram Followers",
      value: instagramProfile.followers_count,
    },
    {
      title: "Instagram Posts",
      value: instagramProfile.media_count,
    },
    {
      title: "Facebook Followers",
      value: facebookProfile.followers_count,
    },
    {
      title: "Reach",
      value: reach,
    },
  ];
};

// ======================================================
// Platform Cards
// ======================================================

export const buildPlatformCards = (
  instagramProfile,
  facebookProfile,
  facebookPosts
) => {
  return [
    {
      name: "Instagram",
      username: instagramProfile.username,
      followers: instagramProfile.followers_count,
      posts: instagramProfile.media_count,
      image: instagramProfile.profile_picture_url,
      connected: true,
    },
    {
      name: "Facebook",
      username: facebookProfile.name,
      followers: facebookProfile.followers_count,
      posts: facebookPosts.data?.length || 0,
      image: facebookProfile.picture?.data?.url,
      connected: true,
    },
  ];
};

// ======================================================
// Engagement
// ======================================================

export const buildEngagement = (
  recentPosts,
  instagramProfile,
  reach
) => {
  const likes = recentPosts.reduce(
    (sum, post) => sum + post.likes,
    0
  );

  const comments = recentPosts.reduce(
    (sum, post) => sum + post.comments,
    0
  );

  const rate =
    instagramProfile.followers_count > 0
      ? (
          ((likes + comments) /
            instagramProfile.followers_count) *
          100
        ).toFixed(2)
      : 0;

  return {
    reach,
    likes,
    comments,
    rate,
  };
};

// ======================================================
// Audience
// ======================================================

export const buildAudience = () => ({
  male: 58,
  female: 42,
  countries: [
    {
      name: "India",
      value: 82,
    },
    {
      name: "Nepal",
      value: 9,
    },
    {
      name: "UAE",
      value: 6,
    },
    {
      name: "Others",
      value: 3,
    },
  ],
});

// ======================================================
// Insights
// ======================================================

export const buildInsights = (
  reach,
  impressions,
  profileViews
) => ({
  reach,
  impressions,
  profileViews,
});

// ======================================================
// Growth Chart
// ======================================================

export const buildGrowthChart = (
  instagramFollowers,
  facebookFollowers,
  history = []
) => {
  if (!history.length) {
    return [
      {
        date: "Today",
        instagram: instagramFollowers,
        facebook: facebookFollowers,
      },
    ];
  }

  return history.map((item) => ({
    date: item.end_time.split("T")[0],
    instagram: item.value,
    facebook: facebookFollowers,
  }));
};