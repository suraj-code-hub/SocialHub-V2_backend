import {
  getInstagramProfileControllerService,
  getInstagramPostsControllerService,
  getInstagramInsightsControllerService,
  instagramLoginService,
  instagramCallbackService,
  getDashboardDataService,
  getGrowthChartService,
  getFacebookProfileDataService,
  syncAccountService,
  updateAccountService,
  getAccountsService
} from "../services/socialService.js";

import asyncHandler from "../middleware/asyncHandler.js";

import {
  successResponse,
  errorResponse,
} from "../utils/apiResponse.js";

import {
  deleteAccountService,
} from "../services/socialService.js";

// import asyncHandler from "../middlewares/asyncHandler.js";



export const getInstagramProfile = async (req, res) => {
  try {
    const profile = await getInstagramProfileControllerService(req.user._id);

    return res.json({
      success: true,
      profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getInstagramInsights = async (req, res) => {
  try {
    const insights = await getInstagramInsightsControllerService(req.user._id);

    return res.json({
      success: true,
      insights,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// export const getDashboardData = async (req, res) => {
//   try {
//     const data = await getDashboardDataService(req.user._id);

//     return res.json({
//       success: true,
//       data,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

export const getGrowthChart = async (req, res) => {
  try {
    const growth = await getGrowthChartService(req.user._id);

    return res.json({
      success: true,
      growth,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const instagramLogin = async (req, res) => {
  try {
    const url = await instagramLoginService(req.user._id);

    return res.json({
      success: true,
      url,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const instagramCallback = async (req, res) => {
  try {
    await instagramCallbackService(req.query.code, req.query.state);

    return res.redirect(
      "http://localhost:5173/accounts?connected=true"
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getRecentPosts = async (req, res) => {
  try {
    const posts = await getRecentPostsService(
      req.params.platform
    );

    res.json({
      success: true,
      posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const reconnectAccount = async (req, res) => {
  try {
    const url = await reconnectAccountService(
      req.params.platform
    );

    res.json({
      success: true,
      url,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// export const getAccounts = asyncHandler(async (req, res) => {

//     const accounts = await getAccountsService(req.user._id);

//     return successResponse(res,{
//         accounts,
//     });

// });

export const getAccounts = asyncHandler(async (req, res) => {
  try {
    console.log("========== GET ACCOUNTS ==========");
    console.log("USER:", req.user);

    const accounts = await getAccountsService(req.user._id);

    console.log("ACCOUNTS:", accounts);

    return successResponse(res, {
      accounts,
    });
  } catch (err) {
    console.error("GET ACCOUNTS ERROR:");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
});

export const getDashboardData = asyncHandler(async (req,res)=>{

    const data = await getDashboardDataService(
        req.user._id
    );

    return successResponse(res,{
        data,
    });

});

export const deleteAccount = asyncHandler(async (req, res) => {
  await deleteAccountService(req.user._id, req.params.id);

  return successResponse(
    res,
    {},
    "Account deleted successfully"
  );
});

import {
  getFacebookPostsDataService,
} from "../services/socialService.js";

export const getFacebookPagePosts = asyncHandler(async (req, res) => {
  const posts = await getFacebookPostsDataService(req.user._id);

  return successResponse(res, {
    posts,
  });
});

export const getFacebookPageProfile = asyncHandler(async (req, res) => {
  const profile = await getFacebookProfileDataService(req.user._id);

  return successResponse(res, {
    profile,
  });
});

export const getInstagramPosts = asyncHandler(async (req, res) => {
  const posts = await getInstagramPostsControllerService(req.user._id);

  return successResponse(res, {
    posts,
  });
});

export const syncAccount = asyncHandler(async (req, res) => {
  const account = await syncAccountService(
    req.user._id,
    req.params.platform
  );

  return successResponse(
    res,
    {
      account,
    },
    "Account synced successfully"
  );
});

export const updateAccount = asyncHandler(async (req, res) => {
  const account = await updateAccountService(
    req.user._id,
    req.params.id,
    req.body
  );

  return successResponse(
    res,
    {
      account,
    },
    "Account updated successfully"
  );
});