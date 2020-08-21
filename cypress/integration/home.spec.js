import { createTodo } from "../support/utils";
import HomePage from "../support/pageObjects/Home";
import Todo from "../support/componentObjects/Todo";

const { _ } = Cypress;

describe("Visit page", () => {
  it("No todos", () => {
    const page = new HomePage();

    page.mockTodos([]);
    page.visit();

    page.getTodos().should("have.length", 0);
    page.getMain().should("not.exist");
    page.getFooter().should("not.exist");
  });

  it("One active todo", () => {
    const page = new HomePage();

    page.mockTodos([createTodo()]);
    page.visit();

    page.getTodos().should("have.length", 1);
    page.getLeftTodosCounter().should("have.text", "1 item left");
  });

  it("Visit all", () => {
    const page = new HomePage();

    page.mockTodos([createTodo({ completed: false }), createTodo({ completed: true })]);
    page.visit();

    page.getTodos().should("have.length", 2);
    page.filter.getItem("all").should("have.class", "selected");
  });

  it("Visit active", () => {
    const page = new HomePage();

    page.mockTodos([createTodo({ completed: false }), createTodo({ completed: true })]);
    page.visit("active");

    page.getTodos().should("have.length", 1);
    page.filter.getItem("active").should("have.class", "selected");
  });

  it("Visit active", () => {
    const page = new HomePage();

    page.mockTodos([createTodo({ completed: false }), createTodo({ completed: true })]);
    page.visit("completed");

    page.getTodos().should("have.length", 1);
    page.filter.getItem("completed").should("have.class", "selected");
  });
});

it("Add new todo", () => {
  const page = new HomePage();
  const { newTodoInput } = page;
  const todoTitle1 = "Buy bread";
  const todoTitle2 = "Buy milk";

  page.mockTodos([]);
  page.visit();

  newTodoInput.get().type(`${todoTitle1}{enter}`).should("have.value", "");

  page.getTodoByIndex(0).as("firstTodo");

  const firstTodo = new Todo("@firstTodo");

  firstTodo.getTitle().should("have.text", todoTitle1);
  firstTodo.getCompleteCheckbox().should("not.be.checked");
  page.getLeftTodosCounter().should("have.text", "1 item left");

  newTodoInput.get().type(`${todoTitle2}{enter}`);
  newTodoInput.get().should("have.value", "");

  page.getTodoByIndex(1).as("secondTodo");

  const secondTodo = new Todo("@secondTodo");

  secondTodo.getTitle().should("have.text", todoTitle2);
  secondTodo.getCompleteCheckbox().should("not.be.checked");
  page.getLeftTodosCounter().should("have.text", "2 items left");
});

it("Complete and uncomplete todo", () => {
  const page = new HomePage();

  page.mockTodos([createTodo({ completed: false })]);

  page.visit();
  page.getTodoByIndex(0).as("firstTodo");

  const todo = new Todo("@firstTodo");

  // Complete Todo
  todo.toggleComplete();

  todo.get().should("have.class", "completed");
  todo.getCompleteCheckbox().should("be.checked");
  page.getLeftTodosCounter().should("have.text", "0 items left");
  page.getClearCompleted().should("exist");

  // Uncomplete todo
  todo.toggleComplete();

  todo.get().should("not.have.class", "completed");
  todo.getCompleteCheckbox().should("not.be.checked");
  page.getLeftTodosCounter().should("have.text", "1 item left");
  page.getClearCompleted().should("not.exist");
});

it("Edit active todo", () => {
  const page = new HomePage();
  const newTitle = "New title";

  page.mockTodos([createTodo({ title: "Old title", completed: false })]);

  page.visit();
  page.getTodoByIndex(0).as("firstTodo");

  const todo = new Todo("@firstTodo");

  todo.editTitle(newTitle);
  todo.getTitle().should("have.text", newTitle);
});

it("Edit completed todo", () => {
  const page = new HomePage();
  const newTitle = "New title";

  page.mockTodos([createTodo({ title: "Old title", completed: true })]);

  page.visit();
  page.getTodoByIndex(0).as("firstTodo");

  const todo = new Todo("@firstTodo");

  todo.editTitle(newTitle);
  todo.getTitle().should("have.text", newTitle);

  // Check that after editing the title the todo is still completed
  todo.get().should("have.class", "completed");
  todo.getCompleteCheckbox().should("be.checked");
});

it("Remove todo", () => {
  const page = new HomePage();

  page.mockTodos([createTodo()]);
  page.visit();

  page.getTodoByIndex(0).as("firstTodo");

  const todo = new Todo("@firstTodo");

  todo.remove();

  page.getTodos().should("have.length", 0);
});

describe("Toggle all", () => {
  it("All active", () => {
    const page = new HomePage();

    page.mockTodos([createTodo({ completed: false }), createTodo({ completed: false })]);
    page.visit();

    page.toggleAll();

    page.getTodos().then(($todos) => {
      _.each($todos, (_, i) => {
        page.getTodoByIndex(i).as(`todo-${i}`);

        const todo = new Todo(`@todo-${i}`);

        todo.getCompleteCheckbox().should("be.checked");
      });
    });

    page.toggleAll();

    page.getTodos().then(($todos) => {
      _.each($todos, (_, i) => {
        page.getTodoByIndex(i).as(`todo-${i}`);

        const todo = new Todo(`@todo-${i}`);

        todo.getCompleteCheckbox().should("not.be.checked");
      });
    });
  });

  it("A few active, a few completed", () => {
    const page = new HomePage();

    page.mockTodos([
      createTodo({ completed: false }),
      createTodo({ completed: false }),
      createTodo({ completed: true }),
    ]);
    page.visit();

    page.toggleAll();

    page.getTodos().then(($todos) => {
      _.each($todos, (_, i) => {
        page.getTodoByIndex(i).as(`todo-${i}`);

        const todo = new Todo(`@todo-${i}`);

        todo.getCompleteCheckbox().should("be.checked");
      });
    });

    page.toggleAll();

    page.getTodos().then(($todos) => {
      _.each($todos, (_, i) => {
        page.getTodoByIndex(i).as(`todo-${i}`);

        const todo = new Todo(`@todo-${i}`);

        todo.getCompleteCheckbox().should("not.be.checked");
      });
    });
  });
});

describe("Clear completed", () => {
  it("All completed", () => {
    const page = new HomePage();

    page.mockTodos([
      createTodo({ completed: true }),
      createTodo({ completed: true }),
      createTodo({ completed: true }),
    ]);
    page.visit();

    page.clearCompleted();

    page.getTodos().should("have.length", 0);
    page.getMain().should("not.exist");
    page.getFooter().should("not.exist");
  });

  it("A few active, a few completed", () => {
    const page = new HomePage();

    page.mockTodos([
      createTodo({ completed: true }),
      createTodo({ completed: false }),
      createTodo({ completed: true }),
    ]);
    page.visit();

    page.clearCompleted();

    page.getTodos().should("have.length", 1);
    page.getMain().should("exist");
    page.getFooter().should("exist");
  });
});

describe("Change filter", () => {
  it("All active", () => {
    const page = new HomePage();

    page.mockTodos([createTodo({ completed: false }), createTodo({ completed: false })]);
    page.visit();

    page.getTodos().should("have.length", 2);

    page.filter.changeTo("active");
    cy.url().should("contains", "#/active");
    page.getTodos().should("have.length", 2);

    page.filter.changeTo("completed");
    cy.url().should("contains", "#/completed");
    page.getTodos().should("have.length", 0);
  });

  it("A few active, a few completed", () => {
    const page = new HomePage();

    page.mockTodos([createTodo({ completed: false }), createTodo({ completed: true })]);
    page.visit();

    page.getTodos().should("have.length", 2);

    page.filter.changeTo("active");
    cy.url().should("contains", "#/active");
    page.getTodos().should("have.length", 1);

    page.filter.changeTo("completed");
    cy.url().should("contains", "#/completed");
    page.getTodos().should("have.length", 1);
  });
});
