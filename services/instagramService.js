import axios from "axios";

const BASE_URL = "https://graph.facebook.com/v23.0";

// Instagram Profile

export const getInstagramProfileService = async (instagramId, accessToken) => {
  const url = `https://graph.facebook.com/${process.env.META_API_VERSION}/${instagramId}`;

  const { data } = await axios.get(url, {
    params: {
      fields:
        "id,username,followers_count,follows_count,media_count,profile_picture_url",
      access_token: accessToken,
    },
  });

  return data;
};

// Instagram Posts
export const getInstagramPostsService = async (instagramId, accessToken) => {
  const url = `https://graph.facebook.com/${process.env.META_API_VERSION}/${instagramId}/media`;

  const { data } = await axios.get(url, {
    params: {
      fields:
        "id,caption,media_type,media_url,thumbnail_url,timestamp,permalink,like_count,comments_count",
      access_token: accessToken,
    },
  });

  return data;
};

// Instagram Insights
export const getInstagramInsightsService = async (
  instagramId,
  accessToken
) => {
  console.log("Instagram Insights API Called");
  console.log("Metric = reach");
  const url = `https://graph.facebook.com/${process.env.META_API_VERSION}/${instagramId}/insights`;

  const { data } = await axios.get(url, {
    params: {
      metric: "reach",
      period: "day",
      access_token: accessToken,
    },
  });

  return data;
};

export const getAccessTokenService = async (code) => {
  try {
    const response = await axios.get(
      "https://graph.facebook.com/v23.0/oauth/access_token",
      {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
          code,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error.message);

    throw error;
  }
};

export const getFacebookPagesService = async (accessToken) => {
  try {
    const response = await axios.get(
      "https://graph.facebook.com/v23.0/me/accounts",
      {
        params: {
          access_token: accessToken,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw error;
  }
};

// ==============================
// Publish Instagram Post
// ==============================

export const publishInstagramPostService = async (
  instagramId,
  accessToken,
  imageUrl,
  caption,
) => {
  try {
    // Step 1: Create Media Container
    const container = await axios.post(
      `${BASE_URL}/${instagramId}/media`,
      null,
      {
        params: {
          image_url: imageUrl,
          caption,
          access_token: accessToken,
        },
      },
    );

    // Step 2: Publish Media Container
    const publish = await axios.post(
      `${BASE_URL}/${instagramId}/media_publish`,
      null,
      {
        params: {
          creation_id: container.data.id,
          access_token: accessToken,
        },
      },
    );

    return publish.data;
  } catch (error) {
    console.log(
      "Instagram Publish Error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ======================================
// Get Instagram Business Account
// ======================================

export const getInstagramBusinessAccountService = async (
  pageId,
  pageAccessToken,
) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${pageId}`, {
      params: {
        fields: "instagram_business_account{id,username,profile_picture_url}",
        access_token: pageAccessToken,
      },
    });

    return data.instagram_business_account;
  } catch (error) {
    console.log(error.response?.data || error.message);

    throw error;
  }
};

// ======================================
// Exchange Short-lived Token -> Long-lived Token
// ======================================

export const getLongLivedTokenService = async (shortToken) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/oauth/access_token`, {
      params: {
        grant_type: "fb_exchange_token",
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        fb_exchange_token: shortToken,
      },
    });

    return data;
  } catch (error) {
    console.log(error.response?.data || error.message);

    throw error;
  }
};

export const getInstagramFollowerHistoryService = async (
  instagramId,
  accessToken
) => {
  const { data } = await axios.get(
    `https://graph.facebook.com/${process.env.META_API_VERSION}/${instagramId}/insights`,
    {
      params: {
        metric: "follower_count",
        period: "day",
        since: Math.floor(
          (Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000
        ),
        until: Math.floor(Date.now() / 1000),
        access_token: accessToken,
      },
    }
  );

  return data;
};

export const syncInstagramProfileService = async (
  instagramId,
  accessToken
) => {
  const url = `https://graph.facebook.com/${process.env.META_API_VERSION}/${instagramId}`;

  const { data } = await axios.get(url, {
    params: {
      fields:
        "id,username,followers_count,follows_count,media_count,profile_picture_url",
      access_token: accessToken,
    },
  });

  return data;
};