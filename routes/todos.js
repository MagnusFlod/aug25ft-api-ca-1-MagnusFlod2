var express = require('express');
var router = express.Router();
const jsend = require('jsend');
const isAuth = require('../middleware/middleware');
const db = require('../models');
const { Op } = require('sequelize');
const TodoService = require('../services/TodoService');
const todoService = new TodoService(db);

router.use(jsend.middleware);

/* Return all the logged in users todo's with the category associated with each todo and
status that is not the deleted status */
router.get('/', isAuth, async (req, res) =>
{

	// #swagger.tags = ['Todos']
	// #swagger.description = 'Get all todos for the logged in user'

	// Getting the logged-in user's ID from the JWT token
	const userId = req.user.id;

	// Acquiring all todo's from the database
	const todos = await todoService.getAll
	({
		// A user has many todos. The UserId in Todo is a foreign key referencing the User
		where: { UserId: userId },

		// Including the category and status that the todo belongs to. Todo belongs to both category and status
		include:
		[
			{
				model: db.Category
			},
			{
				// Get the todo's status
				model: db.Status,
				where:
				{
					status:
					{
						// Excluding the todo's that have status: Deleted
						[Op.ne]: 'Deleted'
					}
				}
			}
		]
	});

	// Returning the result in jsend format
	return res.jsend.success
	({
		result: todos
	});
}); // Done testing!

// Return all the users todos including todos with a deleted status
router.get('/all', isAuth, async (req, res) =>
{
	// Acquiring logged in users
	const userId = req.user.id;

	// Acquiring all todos
	const todos = await todoService.getAll
	({
		// All todos that belong to the logged-in user
		where: { UserId: userId },

		// Also including the category and status that the todo belongs to
		include:
		[
			{
				model: db.Category
			},
			{
				model: db.Status
			}
		]
	});

	return res.jsend.success
	({
		result: todos
	});
}); // Done testing!

// Return all the todos with the deleted status
router.get('/deleted', isAuth, async (req, res) =>
{

	const userId = req.user.id;

	const todos = await todoService.getAll
	({
		where: { UserId: userId },

		include:
		[
			{
				model: db.Category
			},
			{
				model: db.Status,
				where:
				{
					// This time, all todo's with the deleted status are included
					status: 'Deleted'
				}
			}
		]
	});

	return res.jsend.success
	({
		result: todos
	});
}); // Done testing!

// Add a new todo with their category for the logged in user
router.post('/', isAuth, async (req, res) =>
{
	// #swagger.tags = ['Todos']
	// #swagger.description = "Posts a new todo that is linked to the logged in user"
	/* #swagger.parameters['body'] =
	{
    in: 'body',
    description: 'Create new todo',
    required: true,
		schema:
		{
			name: "Cook dinner",
			description: "Mix ingredients and fry",
			CategoryId: 1,
			StatusId: 2
		}
	}
*/

	const userId = req.user.id;

	// Acquiring the fields that are necessary to create a new 'todo'. It needs to include the CategoryId, StatusId and UserId because it has foreign keys that refers to the 3
	const { name, description, CategoryId, StatusId } = req.body;

	// The todo is created. A new row is added to the table in the database
	const todo = await todoService.create
	({
		name: name,
		description: description,
		CategoryId: CategoryId,
		StatusId: StatusId,
		UserId: userId
	});

	return res.jsend.success
	({
		result: todo
	});
}); // Done testing!

// Return all the statuses from the database
router.get('/statuses', async (req, res) =>
{
	// Acquiring all statuses
	const statuses = await db.Status.findAll();

	return res.jsend.success
	({
		result: statuses
	});
}); // Done testing!

// Change/update a specific todo for logged in user
router.put('/:id', isAuth, async (req, res) =>
{
	// Aqcuiring the logged in user
	const userId = req.user.id;

	// Acquiring the id of the specific todo
	const todoId = req.params.id;

	// Getting the correct fields from the body
	const { name, description, CategoryId, StatusId } = req.body;

	// The todo is updated by either name, description, category or status. Or all fields are updated
	const updatedTodo = await todoService.update
	(
		{
			name,
			description,
			CategoryId,
			StatusId
		},
		{
			// This block ensures that only the specific todo belonging to the logged-in user is updated
			where:
			{
				id: todoId,
				UserId: userId
			}
		}
	);

	return res.jsend.success
	({
		result: updatedTodo
	});
}); // Done testing!

// Delete a specific todo for the logged in user
router.delete('/:id', isAuth, async (req, res) =>
{

	// #swagger.tags = ['Todos']
	// #swagger.description = 'Soft deletes a Todo or updates the status to deleted'

	// Finding the user-id for the specific todo
	const userId = req.user.id;

	// Finding the todo-id
	const todoId = req.params.id;

	// Finding the status entry where status = 'Deleted'
	const deletedStatus = await db.Status.findOne
	({
		where: { status: 'Deleted' }
	});

	// Since this is a soft delete, we must use 'update' NOT 'destroy', to mark the todo-status as deleted. Changing the data and not actually deleting it
	await todoService.update
	(
		{
			// Updating the status to the deleted-status that we acquired in 'const deletedStatus'
			StatusId: deletedStatus.id
		},
		{
			// Ensures that only the specific todo belonging to the user, is updated to deleted status
			where:
			{
				id: todoId,
				UserId: userId
			}
		}
	);

	return res.jsend.success
	({
		result: "Todo is deleted"
	});
}); // Done testing!

module.exports = router;