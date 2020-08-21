import { setToLocalStorage } from "../utils";
import NewTodoInput from "../componentObjects/NewTodoInput";
import Filter from "../componentObjects/Filter";

class Home {
  constructor() {
    this.url = "http://todomvc.com/examples/react/#/";

    this.updateTodosStorage = setToLocalStorage("react-todos");
    this.newTodoInput = new NewTodoInput(".new-todo");
    this.filter = new Filter(".filters");
  }

  visit(hash = "") {
    cy.visit(`${this.url}${hash}`);
  }

  mockTodos(todos = []) {
    this.updateTodosStorage(todos);
  }

  // LOCATORS
  getMain() {
    return cy.get(".main");
  }

  getFooter() {
    return cy.get(".footer");
  }

  getTodos() {
    return cy.get(".todo-list > li");
  }

  getTodoByIndex(index) {
    return this.getTodos().eq(index);
  }

  getLeftTodosCounter() {
    return cy.get(".todo-count");
  }

  getClearCompleted() {
    return cy.get(".clear-completed");
  }

  getToggleAll() {
    return cy.get('label[for="toggle-all"]');
  }

  // COMMANDS
  toggleAll() {
    this.getToggleAll().click();
  }

  clearCompleted() {
    this.getClearCompleted().click();
  }

  changeFilter(filter) {}
}

export default Home;
