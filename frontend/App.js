import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);
  const [schoolId, setSchoolId] = useState(1);
  const [name, setName] = useState("");
  
  // Detects Render URL automatically
  const API_URL = process.env.REACT_APP_API_URL ? `https://${process.env.REACT_APP_API_URL}` : "http://localhost:10000";

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/students`, {
        headers: { 'x-school-id': schoolId }
      });
      setStudents(res.data);
    } catch (err) { console.error("Error fetching data", err); }
  };

  const addStudent = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/api/students`, { name }, { headers: { 'x-school-id': schoolId } });
    setName("");
    fetchStudents();
  };

  useEffect(() => { fetchStudents(); }, [schoolId]);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: 'auto' }}>
      <h1>🏫 Universal School Portal</h1>
      <label>Switch School ID: </label>
      <input type="number" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} />
      
      <form onSubmit={addStudent} style={{ margin: '20px 0' }}>
        <input placeholder="Student Name" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Add Student</button>
      </form>

      <div style={{ background: '#eee', padding: '20px', borderRadius: '10px' }}>
        <h3>Roster for School #{schoolId}</h3>
        {students.map(s => <div key={s.id}>• {s.name}</div>)}
      </div>
    </div>
  );
}
export default App;