import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  User, 
  Users, 
  Award, 
  Settings, 
  LogOut, 
  QrCode,
  CheckCircle,
  Plus,
  Minus,
  ArrowLeft
} from 'lucide-react';

// In a real app, this would come from a backend database
const INITIAL_STUDENTS = [
  { id: 'STU-001', name: 'Alice Smith', points: 15, avatar: 'A' },
  { id: 'STU-002', name: 'Bob Jones', points: 8, avatar: 'B' },
  { id: 'STU-003', name: 'Charlie Brown', points: 22, avatar: 'C' },
  { id: 'STU-004', name: 'Diana Prince', points: 30, avatar: 'D' },
  { id: 'STU-005', name: 'Evan Hansen', points: 5, avatar: 'E' },
];

export default function TeachingAidApp() {
  // --- State Management ---
  // Tracks whether the user is logged in as 'teacher' or 'student' (or null)
  const [userRole, setUserRole] = useState(null); 
  
  // Current active view within the app
  const [currentView, setCurrentView] = useState('login'); 
  
  // The database of students
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  
  // State for the Teacher's Scanning flow
  const [isScanning, setIsScanning] = useState(false);
  const [scannedStudentId, setScannedStudentId] = useState(null);
  const [showPointOptions, setShowPointOptions] = useState(false);
  
  // State for Student View (mocking a logged-in student)
  const [currentStudentId, setCurrentStudentId] = useState('STU-001');

  // Handles simulated login
  const handleLogin = (role) => {
    setUserRole(role);
    setCurrentView(role === 'teacher' ? 'dashboard' : 'student-dashboard');
  };

  // Handles simulated logout
  const handleLogout = () => {
    setUserRole(null);
    setCurrentView('login');
    setIsScanning(false);
    setShowPointOptions(false);
    setScannedStudentId(null);
  };

  // Simulates scanning a QR code (in a real app, this would use a camera library)
  const simulateScan = (studentId) => {
    setIsScanning(false);
    setScannedStudentId(studentId);
    setShowPointOptions(true);
  };

  // Handles adding points to the scanned student
  const handleAddPoints = (pointsToAdd) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === scannedStudentId 
          ? { ...student, points: student.points + pointsToAdd }
          : student
      )
    );
    // Reset scanner state after awarding points
    setShowPointOptions(false);
    setScannedStudentId(null);
    // Optional: show a quick success toast here in a full app
  };

  const LoginScreen = () => (
    <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6 space-y-8">
      <div className="text-center">
        <div className="bg-indigo-600 p-4 rounded-full inline-block mb-4 shadow-lg">
          <Award className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">ClassPoints</h1>
        <p className="text-slate-500 mt-2">Engage, Reward, Succeed</p>
      </div>
      
      <div className="w-full max-w-sm space-y-4">
        <button 
          onClick={() => handleLogin('teacher')}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md transition duration-200 flex items-center justify-center space-x-3"
        >
          <Users className="w-5 h-5" />
          <span>Login as Teacher</span>
        </button>
        
        <button 
          onClick={() => handleLogin('student')}
          className="w-full bg-white hover:bg-slate-100 text-slate-700 font-semibold py-4 px-6 rounded-xl shadow border border-slate-200 transition duration-200 flex items-center justify-center space-x-3"
        >
          <User className="w-5 h-5" />
          <span>Login as Student</span>
        </button>
      </div>
    </div>
  );

  const TeacherDashboard = () => (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md flex justify-between items-center z-10">
        <h2 className="text-xl font-bold flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Teacher Dashboard
        </h2>
        <button onClick={handleLogout} className="p-2 hover:bg-indigo-700 rounded-full transition">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4">
        {isScanning ? (
          /* Scanner View */
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <h3 className="text-xl font-semibold text-slate-800">Scan Student QR</h3>
            
            {/* Simulated Camera Viewfinder */}
            <div className="relative w-72 h-72 bg-black rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border-4 border-slate-800">
              <div className="absolute inset-0 border-2 border-indigo-500/50 m-8 rounded-lg animate-pulse"></div>
              <Camera className="w-16 h-16 text-slate-600 mb-4" />
              <p className="absolute bottom-4 text-slate-400 text-sm font-mono">CAMERA ACTIVE</p>
            </div>

            {/* Mock buttons to simulate scanning different students */}
            <div className="w-full max-w-sm mt-6">
              <p className="text-sm text-slate-500 mb-2 text-center">Simulator: Click to "scan" a student</p>
              <div className="grid grid-cols-2 gap-2">
                {students.slice(0, 4).map(s => (
                  <button 
                    key={s.id}
                    onClick={() => simulateScan(s.id)}
                    className="bg-white border border-slate-200 p-2 rounded-lg text-sm font-medium hover:bg-indigo-50 hover:border-indigo-200 transition"
                  >
                    Scan {s.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setIsScanning(false)}
              className="mt-8 text-slate-500 hover:text-slate-700 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Cancel Scan
            </button>
          </div>
        ) : showPointOptions ? (
          /* Point Assignment View */
          <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-300">
            {(() => {
              const student = students.find(s => s.id === scannedStudentId);
              return (
                <>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-indigo-500 shadow-lg">
                      <span className="text-4xl font-bold text-indigo-600">{student?.avatar}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{student?.name}</h3>
                    <p className="text-slate-500 font-mono text-sm">{student?.id}</p>
                    <p className="mt-2 inline-block bg-slate-200 px-3 py-1 rounded-full text-sm font-semibold text-slate-700">
                      Current Points: {student?.points}
                    </p>
                  </div>

                  <div className="w-full max-w-sm space-y-5 overflow-y-auto pb-4">
                    
                    <div className="space-y-3">
                      <p className="text-center text-emerald-600 font-bold text-sm uppercase tracking-wider mb-2">Award Points</p>
                      
                      <button 
                        onClick={() => handleAddPoints(5)}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-sm transition flex justify-between items-center px-6 transform hover:scale-[1.02]"
                      >
                        <span>Congratulations!</span>
                        <span className="flex items-center text-lg">+5 <Plus className="w-5 h-5 ml-1 opacity-50"/></span>
                      </button>
                      
                      <button 
                        onClick={() => handleAddPoints(3)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-sm transition flex justify-between items-center px-6 transform hover:scale-[1.02]"
                      >
                        <span>Keep it Up!</span>
                        <span className="flex items-center text-lg">+3 <Plus className="w-5 h-5 ml-1 opacity-50"/></span>
                      </button>
                      
                      <button 
                        onClick={() => handleAddPoints(2)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-sm transition flex justify-between items-center px-6 transform hover:scale-[1.02]"
                      >
                        <span>Nice try!</span>
                        <span className="flex items-center text-lg">+2 <Plus className="w-5 h-5 ml-1 opacity-50"/></span>
                      </button>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-200">
                      <p className="text-center text-rose-600 font-bold text-sm uppercase tracking-wider mb-2">Deductions</p>
                      
                      <button 
                        onClick={() => handleAddPoints(-1)}
                        className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold py-3 rounded-xl shadow-sm transition flex justify-between items-center px-6 transform hover:scale-[1.02]"
                      >
                        <span>Warning</span>
                        <span className="flex items-center text-lg">-1 <Minus className="w-5 h-5 ml-1 opacity-50"/></span>
                      </button>

                      <button 
                        onClick={() => handleAddPoints(-3)}
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-sm transition flex justify-between items-center px-6 transform hover:scale-[1.02]"
                      >
                        <span>Off Task</span>
                        <span className="flex items-center text-lg">-3 <Minus className="w-5 h-5 ml-1 opacity-50"/></span>
                      </button>
                      
                      <button 
                        onClick={() => handleAddPoints(-5)}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-sm transition flex justify-between items-center px-6 transform hover:scale-[1.02]"
                      >
                        <span>Disruptive</span>
                        <span className="flex items-center text-lg">-5 <Minus className="w-5 h-5 ml-1 opacity-50"/></span>
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setShowPointOptions(false);
                      setScannedStudentId(null);
                    }}
                    className="mt-4 text-slate-500 hover:text-slate-700 flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Cancel
                  </button>
                </>
              )
            })()}
          </div>
        ) : (
          /* Default Dashboard View (Class Roster) */
          <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Class Roster</h3>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">
                {students.length} Students
              </span>
            </div>
            
            <div className="space-y-3">
              {/* Sort students by points descending for a leaderboard feel */}
              {[...students].sort((a, b) => b.points - a.points).map((student, index) => (
                <div key={student.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 border border-slate-200">
                      {student.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{student.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">{student.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-indigo-600">{student.points}</span>
                    <span className="text-xs text-slate-500">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button for Scanning (only show if not already scanning/awarding) */}
      {!isScanning && !showPointOptions && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
          <button 
            onClick={() => setIsScanning(true)}
            className="pointer-events-auto bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl shadow-indigo-200 transition transform hover:-translate-y-1 flex items-center space-x-2"
          >
            <Camera className="w-6 h-6" />
            <span className="font-bold px-2">Scan QR</span>
          </button>
        </div>
      )}
    </div>
  );

  const StudentDashboard = () => {
    // Get the current simulated student
    const student = students.find(s => s.id === currentStudentId);

    return (
      <div className="flex flex-col h-full bg-slate-50">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center z-10 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            My Dashboard
          </h2>
          <button onClick={handleLogout} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center space-y-8">
          {/* Profile & Points Summary */}
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg border border-slate-100 p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-indigo-600">{student?.avatar}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{student?.name}</h3>
            
            <div className="mt-8 bg-indigo-50 w-full rounded-2xl p-6 border border-indigo-100">
              <p className="text-slate-500 text-sm font-medium mb-1">Total Points</p>
              <div className="flex justify-center items-end space-x-2">
                <span className="text-5xl font-extrabold text-indigo-700">{student?.points}</span>
                <span className="text-lg text-indigo-400 font-bold mb-1">pts</span>
              </div>
            </div>
          </div>

          {/* Student QR Code */}
          <div className="w-full max-w-sm flex flex-col items-center">
            <p className="text-slate-500 font-medium mb-4 text-center">Show this to your teacher to get points</p>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
              {/* Fake QR Code visualization */}
              <div className="w-48 h-48 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center p-2 relative">
                 <QrCode className="w-full h-full text-slate-800" strokeWidth={1} />
                 {/* Decorative elements to make it look slightly more like a complex code */}
                 <div className="absolute top-4 left-4 w-6 h-6 bg-slate-800"></div>
                 <div className="absolute top-4 right-4 w-6 h-6 bg-slate-800"></div>
                 <div className="absolute bottom-4 left-4 w-6 h-6 bg-slate-800"></div>
              </div>
              <p className="mt-4 font-mono text-slate-500 tracking-wider bg-slate-100 px-3 py-1 rounded">{student?.id}</p>
            </div>
          </div>

          {/* Student Selector (For demo purposes only) */}
          <div className="w-full max-w-sm mt-8 border-t border-slate-200 pt-6">
            <p className="text-xs text-slate-400 text-center mb-2">Demo tool: Switch student view</p>
            <select 
              value={currentStudentId}
              onChange={(e) => setCurrentStudentId(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-700"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </main>
      </div>
    );
  };

  // Mobile app shell container
  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[400px] h-[800px] max-h-screen bg-white shadow-2xl overflow-hidden relative rounded-[2rem] border-8 border-slate-800">
        
        {/* Render views based on state */}
        {currentView === 'login' && <LoginScreen />}
        {currentView === 'dashboard' && <TeacherDashboard />}
        {currentView === 'student-dashboard' && <StudentDashboard />}
        
        {/* Fake mobile device notch */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50 pointer-events-none">
          <div className="w-32 h-6 bg-slate-800 rounded-b-xl"></div>
        </div>
      </div>
    </div>
  );
}