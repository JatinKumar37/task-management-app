"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { users } from "./../data";
import Header from "../components/header";

interface User {
    id: number;
    username: string;
    password: string | null;
    role: string;
}


export default function Users() {

    const [openDialog, setOpenDialog] = useState(false);
    const [currentTask, setCurrentTask] = useState<User | null>(null);
    const [newTaskTitle, setNewTaskTitle] = useState<string>("");
    const [newTaskAssignee, setNewTaskAssignee] = useState<string>("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();

    const [users1, setUsers1] = useState(() => {
        const savedUserList = localStorage.getItem("userList");
        return JSON.parse(savedUserList as any);
    });

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (!loggedInUser) {
            router.replace("/login");
        }
    }, [router]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.replace("/login");
    };

    const saveUserList = (newUserList: any) => {
        localStorage.setItem("userList", JSON.stringify(newUserList));
        setUsers1(newUserList);
    };

    const handleCreateTask = () => {
        const newUser: User = {
            id: users1?.length ? users1.length + 1 : 1,
            username: newTaskTitle,
            password: newTaskAssignee || null,
            role: "Employee", 
        };
        const updatedUserList = [...users1, newUser];
        saveUserList(updatedUserList); 
        setOpenDialog(false);
        setNewTaskTitle("");
        setNewTaskAssignee("");
    };

    const handleDeleteTask = (id: number) => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );
        if (isConfirmed) {
            setUsers1((prev: any) =>
                prev.filter((task: any) => task.id !== id)
            );
        }
    };

    const handleEditTask = (User: User) => {
        setCurrentTask(User);
        setOpenDialog(true);
        setNewTaskTitle(User.username);
        setNewTaskAssignee(User.password || "");
    };

    const handleUpdateTask = () => {
        if (currentTask) {
            const updatedUserList = users1.map((user: User) =>
                user.id === currentTask.id
                    ? {
                          ...user,
                          username: newTaskTitle,
                          password: newTaskAssignee || null,
                      }
                    : user
            );
            saveUserList(updatedUserList); 
            setOpenDialog(false);
            setCurrentTask(null);
            setNewTaskTitle("");
            setNewTaskAssignee("");
        }
    };


    return (
        <>
            
            <Header />

            <Container>
                <Typography variant="h4" gutterBottom>
                    Users
                </Typography>

                <Box sx={{ textAlign: "right", mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenDialog(true)}
                    >
                        Create New User
                    </Button>
                </Box>

                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User ID</TableCell>
                                <TableCell>User Name</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { users1 && users1.map((User: any) => (
                                <TableRow key={User.id}>
                                    <TableCell>{User.id}</TableCell>
                                    <TableCell>{User.username}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary">
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => handleEditTask(User)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() =>
                                                handleDeleteTask(User.id)
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>
                        {currentTask ? "Edit Task" : "Create New User"}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            label="User Name"
                            fullWidth
                            margin="normal"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            fullWidth
                            margin="normal"
                            value={newTaskAssignee}
                            onChange={(e) => setNewTaskAssignee(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setOpenDialog(false)}
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={
                                currentTask
                                    ? handleUpdateTask
                                    : handleCreateTask
                            }
                            color="primary"
                            variant="contained"
                        >
                            {currentTask ? "Update" : "Create"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
}
