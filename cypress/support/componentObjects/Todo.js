class Todo {
  constructor(alias) {
    this.alias = alias;
  }

  get() {
    return cy.get(this.alias);
  }

  // LOCATORS
  getTitle() {
    return this.get().find("label");
  }

  getTitleInput() {
    return this.get().find(".edit");
  }

  getRemoveIcon() {
    return this.get().find(".destroy");
  }

  getCompleteCheckbox() {
    return this.get().find(".toggle");
  }

  // COMMANDS
  toggleComplete() {
    return this.getCompleteCheckbox().click();
  }

  editTitle(newTitle = "") {
    this.getTitle().dblclick();

    return this.getTitleInput().clear().type(`${newTitle}{enter}`);
  }

  remove() {
    return this.getRemoveIcon().click({ force: true });
  }
}

export default Todo;
