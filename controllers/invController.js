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
invCont.buildByItemId = async function (req, res, next) {
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
/* ---IMPORTANT NOTES-----
-The rest.rend present or display the selected view from the views folder
in this case ./inventory/management
-Dont forget the await part on the nav variable, if you miss it the nav wont appear on the view
    */
invCont.buildManage = async function (req, res, next){
  let nav = await utilities.getNav();
  res.render("./inventory/management",
      {
          title: "Inventory Management",
          nav,
          errors: null
      }
  )
}
invCont.buildNewClass = async function (req, res, next){
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification",
      {   
          title: "Add Classification",
          nav,
          errors: null
      }
      )
}
invCont.processNewClass = async function(req, res, next){
  const { classification_name } = req.body;
  const result = await invModel.addClassification(classification_name)
  let nav = await utilities.getNav()
  if(result){
      res.status(201).render("./inventory/management", {
          title: "Inventory Management",
          nav,
          errors: null
  })
  }else{
      req.flash("notice", "Sorry, Please entered a valid classification.");
      res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
  });
  }
}
invCont.buildNewVehicle = async function (req, res, next){
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory",
      {
          title: "Add New Vehicle",
          nav,
          classificationList,
          errors: null
      }
  )
}
invCont.processNewVehicle = async function(req, res, next){
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList()
  const { inv_make, inv_model, inv_year, inv_description, inv_thumbnail, inv_image, inv_price, inv_miles, inv_color, classification_id } = req.body
  const result = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_thumbnail, inv_image, inv_price, inv_miles, inv_color, classification_id)
  if(result){
      req.flash("notice", `Congratulations, the ${inv_make} ${inv_model} was successfully added.`)
      res.status(201).render("./inventory/management", {
          title: "Inventory Management",
          nav,
          classificationList,
          errors: null
      })
  }else{
      req.flash("notice", "Sorry, Please entered a valid vehicle information.")
      res.status(501).render("./inventory/add-inventory", {
          title: "Add New Vehicle",
          nav,
          classificationList,
          errors: null
      })
  }
}
module.exports = invCont;
