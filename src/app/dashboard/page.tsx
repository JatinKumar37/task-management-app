'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box,
  Avatar,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Header from '../components/header';

interface Task {
  id: number;
  title: string;
  assignedTo: string | null;
  status: 'Pending' | 'In Progress' | 'Completed';
}

const initialTasks: Task[] = [];

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);

  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      router.replace('/login');
    }
    const storedUsers = localStorage.getItem('userList');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, [router]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.replace('/login');
  };

  const handleCreateTask = () => {
    const newTask: Task = {
      id: tasks?.length + 1,
      title: newTaskTitle,
      assignedTo: newTaskAssignee || null,
      status: 'Pending',
    };
    setTasks((prev) => [...prev, newTask]);
    setOpenDialog(false);
    setNewTaskTitle('');
    setNewTaskAssignee('');
  };

  const handleDeleteTask = (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
    if (isConfirmed) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setOpenDialog(true);
    setNewTaskTitle(task.title);
    setNewTaskAssignee(task.assignedTo || '');

    console.log("task.assignedTo", task.assignedTo)
  };

  const handleUpdateTask = () => {
    if (currentTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === currentTask.id
            ? { ...task, title: newTaskTitle, assignedTo: newTaskAssignee || null }
            : task
        )
      );
    }
    setOpenDialog(false);
    setCurrentTask(null);
    setNewTaskTitle('');
    setNewTaskAssignee('');
  };

  return (
    <>
      <Header />

      <Container>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Create New Task
          </Button>
        </Box>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task ID</TableCell>
                <TableCell>Task Name</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.assignedTo || 'Unassigned'}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    <IconButton color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleEditTask(task)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              
              {tasks && tasks?.length===0 &&
                
                <TableRow>
                  
                  <TableCell align='center' colSpan={5}>No data found...</TableCell>
                </TableRow>
            }

            </TableBody>
          </Table>
        </Paper>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{currentTask ? 'Edit Task' : 'Create New Task' } {newTaskAssignee}</DialogTitle>
          <DialogContent>
            <TextField
              label="Task Name"
              fullWidth
              margin="normal"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <Select
              label="Assigned To"
              fullWidth
              value={newTaskAssignee}
              onChange={(e) => setNewTaskAssignee(e.target.value)}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.username}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={currentTask ? handleUpdateTask : handleCreateTask}
              color="primary"
              variant="contained"
            >
              {currentTask ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
