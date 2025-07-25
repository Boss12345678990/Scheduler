import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { use, useEffect, useState } from 'react';
import EmployeeSetupPage from './pages/EmpolyeeSetupPage/EmpolyeeSetupPage';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<EmployeeSetupPage/>} />
        <Route path="/calendar" element={<CalendarPage/>} />
      </Routes>
    </Router>
  );
}

export default App;