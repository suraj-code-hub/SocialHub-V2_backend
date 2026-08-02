export const retry = async (
  fn,

  retries = 3
) => {

  while (retries--) {

    try {

      return await fn();

    }

    catch (err) {

      if (!retries) throw err;

    }

  }

};