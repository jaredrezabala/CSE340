const utilities = require("../utilities")
const invModel = require("../models/inventory-model")

const mngtCont = {}
/* ---IMPORTANT NOTES-----
-The rest.rend present or display the selected view from the views folder
in this case ./inventory/management
-Dont forget the await part on the nav variable, if you miss it the nav wont appear on the view
    */
mngtCont.buildManage = async function (req, res, next){
    let nav = await utilities.getNav();
    res.render("inventory/management",
        {
            title: "Inventory Management",
            nav,
            errors: null
        }
    )
}
mngtCont.buildNewClass = async function (req, res, next){
    let nav = await utilities.getNav();
    res.render("inventory/add-classification",
        {   
            title: "Add Classification",
            nav,
            errors: null
        }
        )
}
mngtCont.processNewClass = async function(req, res, next){
    const { classification_name } = req.body;
    const result = await invModel.addClassification(classification_name)
    let nav = await utilities.getNav()
    if(result){
        res.status(201).render("inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null
    })
    }else{
        req.flash("notice", "Sorry, Please entered a valid classification.");
        res.status(501).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
    });
    }
}
mngtCont.buildNewVehicle = async function (req, res, next){
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory",
        {
            title: "Add New Vehicle",
            nav,
            classificationList,
            errors: null
        }
    )
}
mngtCont.processNewVehicle = async function(req, res, next){
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList()
    const { inv_make, inv_model, inv_year, inv_description, inv_thumbnail, inv_image, inv_price, inv_miles, inv_color, classification_id } = req.body
    const result = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_thumbnail, inv_image, inv_price, inv_miles, inv_color, classification_id)
    if(result){
        req.flash("notice", `Congratulations, the ${inv_make} ${inv_model} was successfully added.`)
        res.status(201).render("inventory/management", {
            title: "Inventory Management",
            nav,
            classificationList,
            errors: null
        })
    }else{
        req.flash("notice", "Sorry, Please entered a valid vehicle information.")
        res.status(501).render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            classificationList,
            errors: null
        })
    }
}
module.exports = mngtCont