export const verifyWebhook = (
  req,
  res
) => {

  if (
    req.query["hub.verify_token"] ===
    process.env.WEBHOOK_VERIFY_TOKEN
  ) {

    return res.send(
      req.query["hub.challenge"]
    );

  }

  res.sendStatus(403);

};

export const receiveWebhook = async (
  req,
  res
) => {

  console.log(req.body);

  res.sendStatus(200);

};