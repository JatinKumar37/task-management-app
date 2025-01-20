// data.js
export const roles = ['Admin', 'Manager', 'Employee'];

export const users = [
  { id: 1, username: 'admin', password: 'admin', role: 'Admin' },
  { id: 2, username: 'manager', password: 'manager', role: 'Manager' },
  { id: 3, username: 'employee', password: 'employee', role: 'Employee' },
];

export let tasks = [
  { id: 1, title: 'Task 1', status: 'Pending', assignedTo: 'Employee' },
  { id: 2, title: 'Task 2', status: 'In Progress', assignedTo: 'Employee' },
];

// Utility function to update tasks
export const updateTasks = (newTasks) => {
  tasks = newTasks;
};
