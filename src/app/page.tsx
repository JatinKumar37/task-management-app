"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { users } from "./data";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [initialLoad, setInitialLoad] = useState<boolean>(true);
    const [error, setError] = useState("");
    const router = useRouter();

    const [userList, setUserList] = useState(() => {
        const savedUserList = localStorage.getItem("userList");
        return savedUserList ? JSON.parse(savedUserList) : users;
    });
    
    const saveUserList = (newUserList: any) => {
        localStorage.setItem("userList", JSON.stringify(newUserList));
        setUserList(newUserList);
    };
    
    useEffect(() => {
        if (initialLoad) {
            const savedUserList = localStorage.getItem("userList");
            if (!savedUserList) {
                saveUserList(users); 
            }
            setInitialLoad(false); 
        }
    }, [initialLoad]);

    const handleLogin = () => {
        console.log("username", username);
        console.log("password", password);
        const user = userList.find(
            (u: any) => u.username === username && u.password === password
        );
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            router.push("/dashboard");
        } else {
            setError("Invalid credentials!");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
            </Box>
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                    variant="contained"
                    onClick={handleLogin}
                    color="primary"
                    sx={{ px: 4 }}
                >
                    Login
                </Button>
            </Box>
        </Container>
    );
}
