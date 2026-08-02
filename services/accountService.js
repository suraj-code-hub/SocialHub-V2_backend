import Account from "../models/Account.js";

// Add Account
export const addAccountService = async (userId, data) => {
  const account = await Account.create({
    user: userId,
    ...data,
  });

  return account;
};

// Get All Accounts
export const getAccountsService = async (userId) => {
  return await Account.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
};

// Get Single Account
export const getAccountByIdService = async (
  userId,
  accountId
) => {
  return await Account.findOne({
    _id: accountId,
    user: userId,
  });
};

// Update Account
export const updateAccountService = async (
  userId,
  accountId,
  data
) => {
  return await Account.findOneAndUpdate(
    {
      _id: accountId,
      user: userId,
    },
    data,
    {
      // new: true,
      returnDocument: "after"
    }
  );
};

// Delete Account
export const deleteAccountService = async (
  userId,
  accountId
) => {
  return await Account.findOneAndDelete({
    _id: accountId,
    user: userId,
  });
};