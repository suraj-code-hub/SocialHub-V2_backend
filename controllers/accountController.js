import {
  addAccountService,
  getAccountsService,
  getAccountByIdService,
  updateAccountService,
  deleteAccountService,
} from "../services/accountService.js";

// Add Account
export const addAccount = async (req, res) => {
  try {
    const account = await addAccountService(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Account connected successfully",
      data: account,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Accounts
export const getAccounts = async (req, res) => {
  try {
    const accounts = await getAccountsService(req.user.id);

    res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Account
export const getAccountById = async (req, res) => {
  try {
    const account = await getAccountByIdService(
      req.user.id,
      req.params.id
    );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Account
export const updateAccount = async (req, res) => {
  try {
    const account = await updateAccountService(
      req.user.id,
      req.params.id,
      req.body
    );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: account,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Account
export const deleteAccount = async (req, res) => {
  try {
    const account = await deleteAccountService(
      req.user.id,
      req.params.id
    );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};