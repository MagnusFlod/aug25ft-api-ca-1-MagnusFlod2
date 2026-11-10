// This is the class that gathers all logic for the Todo-operations
class TodoService
{
    constructor(db)
    {
        this.Todo = db.Todo;
    }

    // First operation. CRUD-READ. Options as argument to get correct parameters from the route. For example: getAll({where: { UserId: userId }, include: [CategoryId, StatusId]})
    async getAll(options)
    {
        return this.Todo.findAll(options);
    }

    // Sencond operation. CRUD CREATE. Data as argument to insert for example: {name: "Coock dinner", description: "..", CategoryId: 1, StatusId: 1, UserId: 2}
    async create(data)
    {
        return this.Todo.create(data);
    }

    // Third operation. CRUD UPDATE. In this service-file we dont need the final method 'DELETE'. Because a Todo is 'soft-deleted' which also uses the update-method
    // data and options as arguments. Data to insert the parameter that we want to change. F.ex: { name: "New name" }. Options on which row the data is changed
    // For example: { where: { id: todoId, UserId } }. Name parameter is changed WHERE todoId and userId = F.ex 1 and 2
    async update(data, options)
    {
        return this.Todo.update(data, options);
    }
}

module.exports = TodoService;