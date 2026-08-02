// import axios from "axios";

// export const getFacebookPageProfileService = async () => {
//   const url = `https://graph.facebook.com/${process.env.META_API_VERSION}/${process.env.FB_PAGE_ID}`;

//   const { data } = await axios.get(url, {
//     params: {
//       fields:
//         "id,name,fan_count,followers_count,picture",
//       access_token: process.env.FB_PAGE_ACCESS_TOKEN,
//     },
//   });

//   return data;
// };

// export const getFacebookPagePostsService = async () => {
//   const url = `https://graph.facebook.com/${process.env.META_API_VERSION}/${process.env.FB_PAGE_ID}/posts`;

//   const { data } = await axios.get(url, {
//     params: {
//       fields:
//         "id,message,created_time,permalink_url,full_picture",
//       access_token: process.env.FB_PAGE_ACCESS_TOKEN,
//     },
//   });

//   return data;
// };

// export const publishFacebookPostService = async (
//   imageUrl,
//   caption
// ) => {
//   const { data } = await axios.post(
//     `https://graph.facebook.com/${process.env.META_API_VERSION}/${process.env.FB_PAGE_ID}/photos`,
//     null,
//     {
//       params: {
//         url: imageUrl,
//         caption,
//         access_token:
//           process.env.FB_PAGE_ACCESS_TOKEN,
//       },
//     }
//   );

//   return data;
// };
import axios from "axios";

// ==============================
// Get Facebook Page Profile
// ==============================
export const getFacebookPageProfileService = async (
  pageId,
  accessToken
) => {
  console.log("====== FACEBOOK PROFILE REQUEST ======");
  console.log("Page ID:", pageId);
  console.log("Access Token:", accessToken);
  console.log("======================================");

  const url = `https://graph.facebook.com/${process.env.META_API_VERSION}/${pageId}`;

  const response = await axios.get(url, {
    params: {
      fields: "id,name,fan_count,followers_count,picture",
      access_token: accessToken,
    },
  });

  console.log("====== FACEBOOK PROFILE RESPONSE ======");
  console.log(response.data);
  console.log("=======================================");

  return response.data;
};

// ==============================
// Get Facebook Page Posts
// ==============================
export const getFacebookPagePostsService = async (
  pageId,
  accessToken
) => {
  console.log("====== FACEBOOK POSTS REQUEST ======");
  console.log("Page ID:", pageId);
  console.log("Access Token:", accessToken);
  console.log("====================================");

  const url = `https://graph.facebook.com/${process.env.META_API_VERSION}/${pageId}/posts`;

  const response = await axios.get(url, {
    params: {
      fields:
        "id,message,created_time,permalink_url,full_picture,likes.summary(true),comments.summary(true)",
      access_token: accessToken,
    },
  });

  console.log("====== FACEBOOK POSTS RESPONSE ======");
  console.log(JSON.stringify(response.data, null, 2));
  console.log("=====================================");

  return response.data;
};

// ==============================
// Publish Facebook Post
// ==============================
export const publishFacebookPostService = async (
  pageId,
  accessToken,
  imageUrl,
  caption
) => {
  console.log("====== FACEBOOK PUBLISH REQUEST ======");
  console.log("Page ID:", pageId);
  console.log("Image:", imageUrl);
  console.log("Caption:", caption);
  console.log("======================================");

  const response = await axios.post(
    `https://graph.facebook.com/${process.env.META_API_VERSION}/${pageId}/photos`,
    null,
    {
      params: {
        url: imageUrl,
        caption,
        access_token: accessToken,
      },
    }
  );

  console.log("====== FACEBOOK PUBLISH RESPONSE ======");
  console.log(JSON.stringify(response.data, null, 2));
  console.log("=======================================");

  return response.data;
};

export const syncFacebookProfileService = async (
  pageId,
  accessToken
) => {
  const url = `https://graph.facebook.com/${process.env.META_API_VERSION}/${pageId}`;

  const { data } = await axios.get(url, {
    params: {
      fields:
        "id,name,followers_count,picture",
      access_token: accessToken,
    },
  });

  return data;
};

// ==============================
// Facebook Analytics
// ==============================

export const getFacebookAnalyticsService = async (
  pageId,
  accessToken
) => {
  try {
    // Page Info
    const { data: profile } = await axios.get(
      `https://graph.facebook.com/${process.env.META_API_VERSION}/${pageId}`,
      {
        params: {
          fields: "id,name,followers_count,fan_count",
          access_token: accessToken,
        },
      }
    );

    // Page Posts
    const { data: postsRes } = await axios.get(
      `https://graph.facebook.com/${process.env.META_API_VERSION}/${pageId}/posts`,
      {
        params: {
          fields:
            "id,message,created_time,full_picture,permalink_url,likes.summary(true),comments.summary(true)",
          access_token: accessToken,
        },
      }
    );

    const posts = (postsRes.data || []).map((post) => ({
      id: post.id,
      caption: post.message || "No Caption",
      image: post.full_picture || "",
      platform: "Facebook",
      publishedAt: post.created_time,

      likes: post.likes?.summary?.total_count || 0,
      comments:
        post.comments?.summary?.total_count || 0,

      reach: 0,

      engagement:
        (post.likes?.summary?.total_count || 0) +
        (post.comments?.summary?.total_count || 0),
    }));

    const totalLikes = posts.reduce(
      (sum, p) => sum + p.likes,
      0
    );

    const totalComments = posts.reduce(
      (sum, p) => sum + p.comments,
      0
    );

    const topPosts = [...posts]
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 5);

    return {
      totalPosts: posts.length,
      totalLikes,
      totalComments,
      totalReach: 0,

      followers: profile.followers_count || 0,
      fans: profile.fan_count || 0,

      platformStats: [
        {
          _id: "Facebook",
          total: posts.length,
        },
      ],

      posts,
      topPosts,
    };
  } catch (error) {
    console.log(
      "Facebook Analytics Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};