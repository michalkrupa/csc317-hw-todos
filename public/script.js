
const displayTodos = async () => {
  const response = await fetch('/todos');
  const todos = await response.json();
  const display = document.getElementById('todoDisplay');
  if (!display) return console.log('Element not found');
  display.innerHTML = JSON.stringify(todos, null, 2);
}

const submitTodos = async () => {
  const nameElem = document.getElementById('todoName');
  const priorityElem = document.getElementById('todoPriority')
  const isFunElem = document.getElementById('todoIsFun');
  const name = nameElem.value;
  const priority = priorityElem.value || 'low';
  const isFun = isFunElem.value || 'true';
  const todo = { name, priority, isFun };
  await fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  }).then((response) => response.json()).then(result =>{ 
    alert(`Todo added: ${JSON.stringify(result)}`);
    [nameElem, priorityElem, isFunElem].forEach((field) => {
      field.value = "";
    });
  });
  displayTodos();
}

const deleteTodos = async () => {
  const deleteBtnElem = document.getElementById('todoIdToDelete');
  const id = deleteBtnElem.value;
  await fetch(
    `/todos/${id}`, { method: 'DELETE' }
  ).then((response) => response.json()).then((result) => {
    alert(result.message);
    deleteBtnElem.value = "";
    displayTodos();
  });
}

document.getElementById('displayTodos').addEventListener('click', displayTodos);
document.getElementById('submitTodo').addEventListener('click', submitTodos);
document.getElementById('deleteTodo').addEventListener('click', deleteTodos);
document.addEventListener("DOMContentLoaded", displayTodos);