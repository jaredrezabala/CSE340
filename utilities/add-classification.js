const pool = require("../database/");

async function getNav() {
  try {
    const data = await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
    let nav = '<ul>';
    data.rows.forEach(row => {
      nav += `<li><a href="/inv/type/${row.classification_id}">${row.classification_name}</a></li>`;
    });
    nav += '</ul>';
    return nav;
  } catch (error) {
    console.error("getNav error " + error);
  }
}

module.exports = {
  getNav
};
