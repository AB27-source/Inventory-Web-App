import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './themes';
import "./index.css";

// Material UI Example Components
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Placeholder components with Material UI
const Home = () => (
  <Container>
    <Typography variant="h2">Home Page</Typography>
    <Button variant="contained" color="primary">Welcome</Button>
  </Container>
);

const Inventory = () => (
  <Container>
    <Typography variant="h2">Inventory Page</Typography>
  </Container>
);

const Login = () => (
  <Container>
    <Typography variant="h2">Login Page</Typography>
  </Container>
);

const NotFound = () => (
  <Container>
    <Typography variant="h2">404 - Not Found</Typography>
  </Container>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
