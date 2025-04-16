const fs = require('node:fs/promises');

// Leer todos las tareas
async function getStoredTodos() {
    const rawFileContent = await fs.readFile('todos.json', { encoding: 'utf-8' });
    const data = JSON.parse(rawFileContent);
    return data.todos ?? [];
}

// Escribir una nueva tarea
function storeTodos(todo) {
    return fs.writeFile('todos.json', JSON.stringify({ todos: todo || [] }));
}

exports.getStoredTodos = getStoredTodos;
exports.storeTodos = storeTodos;