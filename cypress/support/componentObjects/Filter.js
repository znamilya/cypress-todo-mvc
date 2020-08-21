class Filter {
  constructor(selector) {
    this.selector = selector;
  }

  // LOCATORS
  get() {
    return cy.get(this.selector);
  }

  getItem(item) {
    switch (item) {
      case "all":
        return cy.get('[href="#/"]');
      case "active":
        return cy.get('[href="#/active"]');
      case "completed":
        return cy.get('[href="#/completed"]');
    }
  }

  // COMMANDS
  changeTo(filter) {
    return this.get().find(`[href="#/${filter}"]`).click();
  }
}

export default Filter;
