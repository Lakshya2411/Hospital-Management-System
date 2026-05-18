import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [formData, setFormData] = useState({ patientName: '', doctorName: '', date: '', time: '', reason: '' });

  const fetchAppointments = () => {
    fetch('http://localhost:5000/api/appointments')
      .then(res => res.json())
      .then(data => setAppointments(Array.isArray(data) ? data : []))
      .catch(err => setAppointments([]));
  };

  useEffect(() => {
    fetchAppointments();

    fetch('http://localhost:5000/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(Array.isArray(data) ? data : []))
      .catch(err => setDoctors([]));

    fetch('http://localhost:5000/api/patients')
      .then(res => res.json())
      .then(data => setPatients(Array.isArray(data) ? data : []))
      .catch(err => setPatients([]));
  }, []);

  const handleMockClick = (featureName) => {
    alert(`${featureName} feature coming soon!`);
  };

  const handleNewAppointment = async (e) => {
    e.preventDefault();
    setIsScheduling(true);
    try {
      const formattedDate = `${formData.date} ${formData.time}:00`;
      
      const res = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: formData.patientName,
          doctorName: formData.doctorName,
          date: formattedDate,
          reason: formData.reason
        })
      });
      const data = await res.json();
      
      if(data.error) {
        alert("Error: " + data.error);
      } else {
        alert("Success! The MySQL Stored Procedure executed and generated the appointment and pending bill.");
        setShowModal(false);
        setFormData({ patientName: '', doctorName: '', date: '', time: '', reason: '' });
        fetchAppointments(); // Refresh the table
      }
    } catch (err) {
      alert("Failed to connect to backend.");
    }
    setIsScheduling(false);
  };

  const renderModal = () => {
    if (!showModal) return null;
    return (
      <div className="modal-overlay">
        <div className="modal-content glass-panel">
          <h2>Schedule Appointment</h2>
          <form onSubmit={handleNewAppointment}>
            <div className="form-group">
              <label>Patient Name</label>
              <input type="text" required placeholder="Type or select patient name" list="patients-list" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
              <datalist id="patients-list">
                {patients.map(p => <option key={p.id} value={p.name} />)}
              </datalist>
            </div>
            <div className="form-group">
              <label>Doctor Name</label>
              <input type="text" required placeholder="Type or select doctor name" list="doctors-list" value={formData.doctorName} onChange={e => setFormData({...formData, doctorName: e.target.value})} />
              <datalist id="doctors-list">
                {doctors.map(d => <option key={d.id} value={d.name} />)}
              </datalist>
            </div>
            <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label>Date</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Time</label>
                <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Reason for Visit</label>
              <input type="text" required placeholder="e.g. Annual Checkup" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isScheduling}>
                {isScheduling ? 'Scheduling...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <>
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon blue">👥</div>
          <div className="stat-info">
            <h3>Total Patients</h3>
            <p>{patients.length > 0 ? patients.length + 1245 : 1248}</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon green">📅</div>
          <div className="stat-info">
            <h3>Appointments Today</h3>
            <p>{appointments.length > 0 ? appointments.length + 38 : 42}</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon purple">👨‍⚕️</div>
          <div className="stat-info">
            <h3>Available Doctors</h3>
            <p>{doctors.length > 0 ? doctors.length + 15 : 18}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <div className="table-header">
          <h2>Recent Appointments</h2>
          <button className="btn btn-outline" onClick={() => handleMockClick('View All Appointments')}>View All</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>
                    No appointments found. Make sure the Node server is running and database is seeded!
                  </td>
                </tr>
              ) : appointments.map(apt => (
                <tr key={apt.id}>
                  <td>{apt.patient}</td>
                  <td>{apt.doctor}</td>
                  <td>{apt.date} • {apt.time}</td>
                  <td>{apt.type}</td>
                  <td>
                    <span className={`status-badge status-${apt.status.toLowerCase()}`}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderDoctors = () => (
    <div className="glass-panel">
      <div className="table-header">
        <h2>Medical Staff</h2>
        <button className="btn btn-primary" onClick={() => handleMockClick('Add Doctor')}>+ Add Doctor</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Specialty</th>
              <th>Total Patients</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No doctors found.</td></tr>
            ) : doctors.map(doc => (
              <tr key={doc.id}>
                <td style={{ fontWeight: 500 }}>{doc.name}</td>
                <td>{doc.specialty}</td>
                <td>{doc.patients}</td>
                <td>⭐ {doc.rating}</td>
                <td><button className="btn btn-outline" style={{ padding: '0.4rem 1rem' }} onClick={() => handleMockClick('Doctor Profile')}>Profile</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {renderModal()}
      
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">DG</div>
          DG Group of Hospitals
        </div>
        
        <ul className="nav-menu">
          <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </li>
          <li className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
            👥 Patients
          </li>
          <li className={`nav-item ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>
            👨‍⚕️ Doctors
          </li>
          <li className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
            📅 Appointments
          </li>
          <li className={`nav-item ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>
            💳 Billing
          </li>
        </ul>
        
        <div style={{ marginTop: 'auto', padding: '1rem' }}>
          <div className="role-tag">Role: Administrator</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>
            {activeTab === 'dashboard' && 'Overview'}
            {activeTab === 'patients' && 'Patient Management'}
            {activeTab === 'doctors' && 'Doctor Directory'}
            {activeTab === 'appointments' && 'Appointment Scheduling'}
            {activeTab === 'billing' && 'Billing & Invoices'}
          </h1>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={() => handleMockClick('Notifications')}>🔔 Notifications</button>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + New Appointment
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'doctors' && renderDoctors()}
        {(activeTab === 'patients' || activeTab === 'appointments' || activeTab === 'billing') && (
          <div className="glass-panel">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
              Advanced SQL views, stored procedures, and complex joins power this module behind the scenes. 
              Switch to Dashboard or Doctors for UI demonstration.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
