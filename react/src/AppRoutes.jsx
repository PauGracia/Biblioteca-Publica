// AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import BookList from "./components/BookList";
import BookDetails from "./components/BookDetails";
import Login from "./pages/Login";
import CsvUpload from "./components/CsvUpload";


function AppRoutes({ isAuthenticated, onLoginSuccess }) {
  return (<>
  <div className="main">
    <Routes>
      
      <Route path="/book/:id" element={<BookDetails/>} />
      
    </Routes>
    </div>
    </>
  );
}

export default AppRoutes;
