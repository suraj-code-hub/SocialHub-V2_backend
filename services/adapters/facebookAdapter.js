import {
  publishFacebookPostService,
  getFacebookPagePostsService,
  syncFacebookProfileService,
} from "../facebookService.js";

export const publish = async (
  pageId,
  accessToken,
  image,
  caption
) => {

  return await publishFacebookPostService(
    pageId,
    accessToken,
    image,
    caption
  );

};

export const syncPosts = async (
  pageId,
  accessToken
) => {

  return await getFacebookPagePostsService(
    pageId,
    accessToken
  );

};

export const syncProfile = async (
  pageId,
  accessToken
) => {

  return await syncFacebookProfileService(
    pageId,
    accessToken
  );

};