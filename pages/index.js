import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForms.js";
import TodoCounter from "../components/TodoCounter.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopupEl = document.querySelector("#add-todo-popup");
const addTodoForm = document.forms["add-todo-form"];
const addTodoCloseBtn = addTodoPopupEl.querySelector(".popup__close");
const todosList = document.querySelector(".todos__list");
const todoCounter = new TodoCounter(initialTodos, ".counter__text");

const generateTodo = (data) => {
  const todo = new Todo(data, "#todo-template", {
    onUpdateCompleted: (taskCompleted) =>
      todoCounter.updateCompleted(taskCompleted),
    onUpdateTotal: (taskAdded) => todoCounter.updateTotal(taskAdded),
  });
  return todo.getView();
};

const section = new Section({
  items: initialTodos,
  renderer: (item) => {
    const todoEl = generateTodo(item);
    section.addItem(todoEl);
  },
  containerSelector: ".todos__list",
});
section.renderItems();

const newTodoValidator = new FormValidator(validationConfig, addTodoForm);
newTodoValidator.enableValidation();

const renderTodo = (item) => {
  const todo = generateTodo(item);
  todosList.append(todo);
  todoCounter.updateTotal(true);
};

const addTodoPopup = new PopupWithForm({
  popupSelector: "#add-todo-popup",
  handleFormSubmit: (inputValues) => {
    const { name, date } = inputValues;

    const dateObject = new Date(date);
    dateObject.setMinutes(
      dateObject.getMinutes() + dateObject.getTimezoneOffset()
    );

    const id = uuidv4();
    const values = { name, date: dateObject, id };
    renderTodo(values);
    addTodoPopup.close();
    addTodoForm.reset();
    newTodoValidator.resetValidation();
  },
});
addTodoPopup.setEventListeners();

addTodoButton.addEventListener("click", () => {
  addTodoPopup.open();
});

addTodoCloseBtn.addEventListener("click", () => {
  addTodoPopup.close();
  addTodoForm.reset();
  newTodoValidator.resetValidation();
});
