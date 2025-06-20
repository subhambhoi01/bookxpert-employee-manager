import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { createEmployee, updateEmployee } from '../services/api';

const EmployeeForm = ({ selectedEmployee, onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    designation: '',
    dateOfJoin: '',
    dateOfBirth: '',
    salary: '',
    gender: '',
    stateId: ''
  });

  const [states, setStates] = useState([]);

  useEffect(() => {
    if (selectedEmployee) {
      setForm({
        name: selectedEmployee.name,
        designation: selectedEmployee.designation,
        dateOfJoin: selectedEmployee.dateOfJoin,
        dateOfBirth: selectedEmployee.dateOfBirth,
        salary: selectedEmployee.salary,
        gender: selectedEmployee.gender,
        stateId: selectedEmployee.stateId
      });
    }
  }, [selectedEmployee]);

  useEffect(() => {
    axios.get('https://localhost:7019/api/State')
      .then(res => setStates(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedEmployee) {
      await updateEmployee(selectedEmployee.id, form);
    } else {
      await createEmployee(form);
    }
    setForm({
      name: '',
      designation: '',
      dateOfJoin: '',
      dateOfBirth: '',
      salary: '',
      gender: '',
      stateId: ''
    });
    onSuccess();
  };

  return (
    <div className="container mt-4">
      <h2>{selectedEmployee ? 'Edit' : 'Add'} Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input className="form-control" placeholder="Name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <input className="form-control" placeholder="Designation" name="designation" value={form.designation} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <input type="date" className="form-control" name="dateOfJoin" value={form.dateOfJoin} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <input type="date" className="form-control" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <input type="number" className="form-control" placeholder="Salary" name="salary" value={form.salary} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <select className="form-select" name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <div className="mb-2">
          <select className="form-select" name="stateId" value={form.stateId} onChange={handleChange} required>
            <option value="">Select State</option>
            {states.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" type="submit">
          {selectedEmployee ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
