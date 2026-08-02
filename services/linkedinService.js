export const publishInstagramPostService = async (
  imageUrl,
  caption
) => {
  // Step 1 : Create Media Container
  const createContainer = await axios.post(
    `${BASE_URL}/${process.env.IG_USER_ID}/media`,
    null,
    {
      params: {
        image_url: imageUrl,
        caption,
        access_token: process.env.IG_ACCESS_TOKEN,
      },
    }
  );

  // Step 2 : Publish
  const publish = await axios.post(
    `${BASE_URL}/${process.env.IG_USER_ID}/media_publish`,
    null,
    {
      params: {
        creation_id: createContainer.data.id,
        access_token: process.env.IG_ACCESS_TOKEN,
      },
    }
  );

  return publish.data;
};