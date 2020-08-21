import faker from "faker";

export const setToLocalStorage = (key) => (value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const createTodo = (data = {}) => {
  return {
    id: faker.random.uuid(),
    title: faker.random.words(3),
    completed: false,
    ...data,
  };
};
