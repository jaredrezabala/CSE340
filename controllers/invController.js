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
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/management",
      {
          title: "Inventory Management",
          nav,
          classificationList,
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
  let classId = req.params.classification_id
  let classificationList = await utilities.buildClassificationList(classId);
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
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}
/* ***************************
 * Build edit inventory view
 * ************************** */
invCont.modifyItem = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByItemId(inv_id)
  let classificationList = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
  }
/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}
/* ***************************
 *  Build Delete Inventory View
 * ************************** */
invCont.deleteItem = async function(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByItemId(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
  }
/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.itemDeleted = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const deleteResult = await invModel.deleteInventoryItem(inv_id)
  if (deleteResult) {
    req.flash("notice", "Inventory item deleted successfully")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "There was an error deleting the inventory item")
    res.redirect("/delete/:inv_id")
  }
}

module.exports = invCont;
