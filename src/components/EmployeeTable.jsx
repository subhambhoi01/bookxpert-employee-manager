import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const EmployeeTable = ({ onEdit }) => {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedIds, setSelectedIds] = useState([]);

  const pageSize = 5;

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const result = employees.filter(emp =>
      emp.name.toLowerCase().includes(lower) ||
      emp.designation.toLowerCase().includes(lower) ||
      emp.gender.toLowerCase().includes(lower) ||
      emp.stateName.toLowerCase().includes(lower)
    );
    setFiltered(result);
    setCurrentPage(1);
  }, [employees, searchTerm]);

  const loadEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      await deleteEmployee(id);
      loadEmployees();
    }
  };

  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(order);
    setFiltered([...filtered].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      return order === 'asc'
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    }));
  };

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Name", "Designation", "DOJ", "DOB", "Salary", "Gender", "State"]],
      body: paginated.map(emp => [
        emp.name,
        emp.designation,
        emp.dateOfJoin,
        emp.dateOfBirth,
        emp.salary,
        emp.gender,
        emp.stateName
      ])
    });
    doc.save('employees.pdf');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Employee List</h2>
        <div>
          <input
            type="text"
            placeholder="Search"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th></th>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name</th>
            <th onClick={() => handleSort('designation')} style={{ cursor: 'pointer' }}>Designation</th>
            <th>Date of Join</th>
            <th>Date of Birth</th>
            <th>Salary</th>
            <th>Gender</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(emp => (
            <tr key={emp.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(emp.id)}
                  onChange={() => toggleSelect(emp.id)}
                />
              </td>
              <td>{emp.name}</td>
              <td>{emp.designation}</td>
              <td>{emp.dateOfJoin}</td>
              <td>{emp.dateOfBirth}</td>
              <td>{emp.salary}</td>
              <td>{emp.gender}</td>
              <td>{emp.stateName}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(emp)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between">
        <div>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-light'} me-1`} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>

        <div>
          <button className="btn btn-outline-secondary btn-sm" onClick={exportPDF}>Export PDF</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
