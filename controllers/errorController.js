const errorController = {};

errorController.createIntentionalError = async function (req, res, next) {
  try {
    const error = new Error("This is an intentional error.");
    error.status = 500;
    throw error;
  } catch (err) {
    next(err);
  }
};

module.exports = errorController;
