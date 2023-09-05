let nextTodoId = 0
export const emploee = (text) => ({
  type: 'EMPLOYEE_SUBMIT',
  id: nextTodoId++,
  text
})