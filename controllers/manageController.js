const utilities = require("../utilities")

const mngtCont = {}
/* ---IMPORTANT NOTES-----
-The rest.rend present or display the selected view from the views folder
in this case ./inventory/management
-Dont forget the await part on the nav variable, if you miss it the nav wont appear on the view
    */
mngtCont.buildManage = async function (req, res, next){
    let nav = await utilities.getNav();
    res.render("./inventory/management",
        {
            title: "Inventory Management",
            nav,
            errors: null
        }
    )
}
mngtCont.buildNewClass = async function (req, res, next){
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification",
        {   
            title: "Add Classification",
            nav,
            errors: null
        }
        )
}
mngtCont.buildNewVehicle = async function (req, res, next){
    let nav = await utilities.getNav();
    res.render("./inventory/add-inventory",
        {
            title: "Add New Vehicle",
            nav,
            errors: null
        }
    )
}
module.exports = mngtCont