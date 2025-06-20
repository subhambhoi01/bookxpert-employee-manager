import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';


function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccess = () => {
    setSelectedEmployee(null);
    setRefresh(!refresh); // trigger re-fetch
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">📋 Bookxpert - Employee Manager</h1>
      <EmployeeForm selectedEmployee={selectedEmployee} onSuccess={handleSuccess} />
      <EmployeeTable key={refresh} onEdit={handleEdit} />
    </div>
  );
}

export default App;
