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

module.exports = validate