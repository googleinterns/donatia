/**
 * TODO: GET all categories from database
 * @return JSON of all category entry information 
 */
function getAllCategories() {
    var allCategories = [
        {
            "ID": "clothing",
            "name": "Clothing",
        }, {
            "ID": "food",
            "name": "Food",
        }, {
            "ID": "house-supplies",
            "name": "Household Supplies",
        }
    ]
    return allCategories;
}

/**
 * TODO: GET an organizations accepted cagtegories from database
 * @param {string} organizationID ID of organization requesting categories
 */
function getAllAcceptedCategories(organizationID) {
    var allAcceptedCategories = [
        {
            "ID": "org-name-clothes",
            "instructions": ["instruction 1","instruction 2","instruction 3"],
            "quality": ["check 1","check 2","check 3"],
        },
        {
            "ID": "org-name-food",
            "instructions": ["instruction 1","instruction 2","instruction 3"],
            "quality": ["check 1","check 2","check 3"],
        },
    ]
    return allAcceptedCategories;
}


window.onload = async function() {
    let categoriesTemplate = document.getElementById('categories-template').innerHTML;
    const renderCategories = Handlebars.compile(categoriesTemplate);
    const allCategories = await this.getAllCategories();
    document.getElementById('categories').innerHTML = renderCategories({categoryList: allCategories});
}