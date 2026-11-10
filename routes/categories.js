var express = require('express');
var router = express.Router();
const isAuth = require('../middleware/middleware');
const db = require('../models');
const { Op } = require('sequelize');
const jsend = require('jsend');
router.use(jsend.middleware);

// This file sums up CRUD for categories

// CRUD-READ. This route returns or READS all categories for one specific user
router.get('/', isAuth, async (req, res) =>
{

    // #swagger.tags = ['Categories']
    // #swagger.description = 'Returns all categories for a specific user'

    // Acquiring the specific userId
    const userId = req.user.id;

    // Finding all of the categories
    const categories = await db.Category.findAll
    ({
        // On the specific user
        where: { UserId: userId }
    });

    return res.jsend.success
    ({
        result: categories
    });
}); // Done testing!

// CRUD-CREATE. Here we CREATE a new category via this route
router.post('/', isAuth, async (req, res) =>
{
    // We need userId because Category has a foreign key (UserId) that is referencing the User
    const userId = req.user.id;

    // Making a name-field
    const { name } = req.body;

    // If the name is not provided, we return an error
    if(!name)
    {
        return res.jsend.fail
        ({
            name: "Name is required"
        });
    }

    // The creation is happening here
    const category = await db.Category.create
    ({
        name: name,

        UserId: userId
    });


    return res.jsend.success
    ({
        result: category
    });

}); // Done testing!

// CRUD-UPDATE. This time, the route UPDATES a category with a selected id
router.put('/:id', isAuth, async (req, res) =>
{
    const userId = req.user.id;

    // We need the id of the category that is going to be updated
    const categoryId = req.params.id;

    // Acquiring the name-field from the body. The name is what's going to be changed
    const { name } = req.body;

    // If no name is provided, an error occours
    if(!name)
    {
        return res.jsend.fail
        ({
            name: "Name is required"
        });
    }
    
    // The change/update of the category happens here
    const updatedCategory = await db.Category.update
    (
        {
            // Updating the specific category that belongs to the logged-in user
            name
        },
        {
            where:
            {
                id: categoryId,
                UserId: userId
            }
        }
    );

    return res.jsend.success
    ({
        result: updatedCategory
    });
}); // Done testing!

// Finally the last CRUD-letter. DELETE. This route deletes a category with a selceted id if it's NOT being currently used by a Todo
router.delete('/:id', isAuth, async (req, res) =>
{

    const categoryId = req.params.id;

    const userId = req.user.id;

    // Checking if any Todo (for this user) is using this category
    const found = await db.Todo.findOne
    ({
        where: { CategoryId: categoryId }
    });

    // If the Todo is actually found, the result is an error or failure. We cannot delete the category if it's used by a Todo
    if(found)
    {
        return res.jsend.fail
        ({
            result: "Cannot delete a category that is curreuntly in use by a Todo"
        });
    }
    // If the category is not used by any Todo, we can delete the category
    else
    {

        await db.Category.destroy
        ({
            where:
            {
                id: categoryId,
                UserId: userId
            }
        });

        return res.jsend.success
        ({
            result: "Category is deleted"
        });
    }

}); // Done testing!

module.exports = router;