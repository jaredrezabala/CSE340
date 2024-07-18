const utilities = require(".");
const { body, validationResult } = require("express-validator");

const validate = {}

validate.newClassRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Classification Name is required")
        .isAlphanumeric()
        .withMessage("Classification name must contain only alphanumeric characters.")
    ]
} 
validate.checkNewClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification",{
            errors,
            title: "Add Classification",
            nav,
            classification_name
        })
        return;
    }
    next();
}
validate.newVehiclesRules = () =>{
    return [
        body('inv_make')
        .trim()
        .notEmpty()
        .withMessage('Make is required')
        .isAlphanumeric()
        .withMessage('Make must contain only alphanumeric characters.'),
      body('inv_model')
        .trim()
        .notEmpty()
        .withMessage('Model is required')
        .isAlphanumeric()
        .withMessage('Model must contain only alphanumeric characters.'),
      body('inv_description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
      body('inv_image')
        .trim()
        .notEmpty()
        .withMessage('Image Path is required'),
      body('inv_thumbnail')
        .trim()
        .notEmpty()
        .withMessage('Thumbnail is required'),
      body('inv_price')
        .trim()
        .notEmpty()
        .withMessage('Price is required')
        .isDecimal({ decimal_digits: '1,2' })
        .withMessage('Please enter a valid price (e.g., 100 or 100.00)'),
      body('inv_year')
        .trim()
        .notEmpty()
        .withMessage('Year is required')
        .isLength({ min: 4, max: 4 })
        .withMessage('Please enter a valid 4-digit year (e.g., 2024)'),
      body('inv_miles')
        .trim()
        .notEmpty()
        .withMessage('Miles are required')
        .isInt()
        .withMessage('Please enter digits only for miles'),
      body('inv_color')
        .trim()
        .notEmpty()
        .withMessage('Color is required'),
      body('classification_id')
        .notEmpty()
        .withMessage('Classification is required')
    ]
}
validate.checkNewVehicleData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      let classificationList = await utilities.buildClassificationList(req.body.classification_id);
      return res.render('inventory/add-inventory', {
        errors,
        title: 'Add New Vehicle',
        nav,
        classificationList,
      });
    }
    next();
  };

  validate.checkUpdateData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      let classificationList = await utilities.buildClassificationList(req.body.classification_id);
      return res.render('inventory/edit-inventory', {
        errors,
        title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
        nav,
        classificationList,
        inv_id: req.body.inv_id,
        inv_make: req.body.inv_make,
        inv_model: req.body.inv_model,
        inv_year: req.body.inv_year,
        inv_description: req.body.inv_description,
        inv_image: req.body.inv_image,
        inv_thumbnail: req.body.inv_thumbnail,
        inv_price: req.body.inv_price,
        inv_miles: req.body.inv_miles,
        inv_color: req.body.inv_color,
        classification_id: req.body.classification_id
      });
    }
    next();
  };
module.exports = validate