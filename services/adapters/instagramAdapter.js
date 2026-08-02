import {
  publishInstagramPostService,
  getInstagramPostsService,
  syncInstagramProfileService,
} from "../instagramService.js";

export const publish = async (
  socialId,
  accessToken,
  image,
  caption
) => {

  return await publishInstagramPostService(
    socialId,
    accessToken,
    image,
    caption
  );

};

export const syncPosts = async (
  socialId,
  accessToken
) => {

  return await getInstagramPostsService(
    socialId,
    accessToken
  );

};

export const syncProfile = async (
  socialId,
  accessToken
) => {

  return await syncInstagramProfileService(
    socialId,
    accessToken
  );

};