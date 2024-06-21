const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};
/* ***************************
 *  Build inventory by item detail view
 * ************************** */
const inv_Item = {};
inv_Item.buildByItemId = async function (req, res, next) {
  const inv_id = req.params.inv_Id;
  const data = await invModel.getInventoryByItemId(inv_id);
  const grid = await utilities.buildItemView(data);
  let nav = await utilities.getNav();
  const item = data[0].inv_make;
  console.log(item);
  res.render("./inventory/items", {
    title: item + " Details",
    nav,
    grid,
  });
};

module.exports = invCont;
module.exports = inv_Item;
