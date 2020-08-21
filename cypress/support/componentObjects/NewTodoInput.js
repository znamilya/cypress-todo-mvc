class NewTodoInput {
  constructor(selector) {
    this.selector = selector;
  }

  // LOCATORS
  get() {
    return cy.get(this.selector);
  }
}

export default NewTodoInput;
