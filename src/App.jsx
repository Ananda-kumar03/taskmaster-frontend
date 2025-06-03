// frontend/src/App.js

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

import axios from 'axios';
import ConfirmDialog from './components/ConfirmDialog';
import { toast, ToastContainer } from 'react-toastify';
 // Assuming you have a CSS file for basic styles
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes, Navigate,useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // Assuming you have react-datepicker installed
import 'react-datepicker/dist/react-datepicker.css';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import Login from './components/Login'; // Adjust path as needed

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

import Register from './components/Register';
import './components/styles.css' // Assuming you have a CSS file for basic styles
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus, faTrash,faArchive, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from './components/Navbar';
import HowToUse from './components/HowtoUse';
import Feedback from './components/FeedbackForm';
import ProfilePage from './components/ProfilePage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import ResendVerification from './components/ResendVerification';
import UpdateProfile from './components/UpdateProfile';
import Reflection from './components/Reflection';
import LandingPage from './components/LandingPage';

// ===================================================================================================
// SortableItem Component - MODIFIED for main task checkbox enabling alert & Recurrence Display/Edit
// ===================================================================================================
const SortableItem = ({
    id,
    todo,
    getPriorityColor,
    displayDate,
    startEdit,
    deleteTodo,
    toggleComplete,
    editingId,
    editText,
    handleEditChange,
    togglePin,
    editPriority,
    archiveTodo,
    handleEditPriorityChange,
    editDueDate,
    handleEditDueDateChange,
    editingTagsInput,
    setEditingTagsInput,
    editReminderTime,
    handleEditReminderTimeChange,
    editDescription,
    handleEditDescriptionChange,
    saveEdit,
    setEditingId,
    expandedDescriptionId,
    setExpandedDescriptionId,
    // PROPS FOR SUBTASKS
    editSubtasks,
    handleEditSubtaskTextChange,
    handleEditSubtaskToggle,
    handleAddEditSubtask,
    handleRemoveSubtask,
    editingNewSubtaskText,
    setEditingNewSubtaskText,
    toggleSubtaskCompleteDirectly,
    isMainTodoCheckboxDisabled,
    // NEW PROPS FOR RECURRENCE
    editRecurrence,
    setEditRecurrence,
    editRecurrenceDetails,
    setEditRecurrenceDetails,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id });

    const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  userSelect: 'none',
  padding: '8px',
  margin: '4px 0',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  opacity: todo.isArchived ? 0.6 : 1,
  cursor: editingId === todo._id ? 'default' : 'grab',
};


    const formatDateTimeForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const isDescriptionExpanded = expandedDescriptionId === todo._id;

    // Calculate subtask progress for display
    const completedSubtasksCount = todo.subtasks ? todo.subtasks.filter(st => st.completed).length : 0;
    const totalSubtasksCount = todo.subtasks ? todo.subtasks.length : 0;

    return (
        <li ref={setNodeRef} style={style} className="todo-card">
            {/* Top row for drag handle, checkbox, text, and buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                <div
                    {...listeners}
                    style={{
                        cursor: editingId === todo._id ? 'default' : 'grab',
                        padding: '5px',
                        marginRight: '5px',
                        color: '#888',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: editingId === todo._id ? 'transparent' : '#eee',
                        borderRadius: '3px'
                    }}
                    onMouseDown={(e) => {
                        if (editingId === todo._id) {
                            e.stopPropagation();
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faBars} />
                </div>

                {/* Main Task Checkbox */}
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => {
                        if (!isMainTodoCheckboxDisabled) {
                            toggleComplete(todo);
                        }
                        e.stopPropagation();
                    }}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        if (isMainTodoCheckboxDisabled) {
                            alert("Please complete all subtasks before marking the main task as complete.");
                            e.preventDefault();
                        }
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isMainTodoCheckboxDisabled) {
                            e.preventDefault();
                        }
                    }}
                    style={{
                        marginRight: '5px',
                        cursor: isMainTodoCheckboxDisabled ? 'not-allowed' : 'pointer',
                        opacity: isMainTodoCheckboxDisabled ? 0.5 : 1,
                    }}
                />

                <span style={{ color: getPriorityColor(todo.priority), fontWeight: 'bold' }}>
                    [{todo.priority.charAt(0)}]
                </span>

                {editingId === todo._id ? (
                    <>
                        <input
                            value={editText}
                            onChange={handleEditChange}
                            placeholder="Edit text"
                            style={{ flexGrow: 1, padding: '5px', border: '1px solid #ccc', borderRadius: '3px' }}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <select
                            value={editPriority}
                            onChange={handleEditPriorityChange}
                            style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '3px' }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <input
                            type="date"
                            value={editDueDate}
                            onChange={handleEditDueDateChange}
                            style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '3px' }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <input
                            type="text"
                            value={editingTagsInput}
                            onChange={e => setEditingTagsInput(e.target.value)}
                            placeholder="Edit tags (comma-separated)"
                            style={{ flexGrow: 1, padding: '5px', border: '1px solid #ccc', borderRadius: '3px' }}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <input
                            type="datetime-local"
                            value={formatDateTimeForInput(editReminderTime)}
                            onChange={handleEditReminderTimeChange}
                            style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '3px' }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        />
                        {/* NEW: Recurrence editing fields */}
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center', marginTop: '5px', width: '100%' }}>
                            <label style={{  fontSize: '0.9em' }}>Recurrence:</label>
                            <select
                                value={editRecurrence}
                                onChange={e => {
                                    setEditRecurrence(e.target.value);
                                    setEditRecurrenceDetails({}); // Clear details when type changes
                                }}
                                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '90px' }}
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <option value="none">None</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>

                            {editRecurrence === 'weekly' && (
                                <select
                                    value={editRecurrenceDetails.dayOfWeek !== undefined ? editRecurrenceDetails.dayOfWeek : ''}
                                    onChange={e => setEditRecurrenceDetails({ ...editRecurrenceDetails, dayOfWeek: parseInt(e.target.value) })}
                                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <option value="">Select Day</option>
                                    <option value="1">Monday</option>
                                    <option value="2">Tuesday</option>
                                    <option value="3">Wednesday</option>
                                    <option value="4">Thursday</option>
                                    <option value="5">Friday</option>
                                    <option value="6">Saturday</option>
                                    <option value="0">Sunday</option>
                                </select>
                            )}

                            {editRecurrence === 'monthly' && (
                                <input
                                    type="number"
                                    value={editRecurrenceDetails.dayOfMonth || ''}
                                    onChange={e => setEditRecurrenceDetails({ ...editRecurrenceDetails, dayOfMonth: parseInt(e.target.value) })}
                                    placeholder="Day (1-31)"
                                    min="1"
                                    max="31"
                                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '100px' }}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    onKeyUp={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            )}
                             {editRecurrence === 'yearly' && (
                                <>
                                    <select
                                        value={editRecurrenceDetails.month !== undefined ? editRecurrenceDetails.month : ''}
                                        onChange={(e) => {
                                            setEditRecurrenceDetails({ ...editRecurrenceDetails, month: parseInt(e.target.value) });
                                            e.stopPropagation();
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '3px' }}
                                    >
                                        <option value="">Select Month</option>
                                        {[...Array(12).keys()].map(i => (
                                            <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={editRecurrenceDetails.dayOfMonth || ''}
                                        onChange={(e) => {
                                            setEditRecurrenceDetails({ ...editRecurrenceDetails, dayOfMonth: parseInt(e.target.value) });
                                            e.stopPropagation();
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                        placeholder="Day (1-31)"
                                        min="1"
                                        max="31"
                                        style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '3px', width: '100px' }}
                                    />
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => saveEdit(todo._id)}
                            style={{ padding: '8px 12px', borderRadius: '4px', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer' }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEditingId(null)}
                            style={{ padding: '8px 12px', borderRadius: '4px', border: 'none', backgroundColor: '#dc3545', color: 'white', cursor: 'pointer' }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', flexGrow: 1 }}>
                            {todo.text}
                        </span>
                        {todo.dueDate && (
                            <span style={{ fontSize: '0.8em', color: 'gray' }}>
                                Due: {displayDate(todo.dueDate)}
                            </span>
                        )}
                        {todo.tags && todo.tags.length > 0 && (
                            <div style={{ fontSize: '0.8em', color: 'gray' }}>
                                Tags: {todo.tags.join(', ')}
                            </div>
                        )}
                        {todo.reminderTime && (
                            <span style={{ fontSize: '0.8em', color: '#61dafb' }}>
                                Remind: {new Date(todo.reminderTime).toLocaleString()}
                            </span>
                        )}
                        {/* NEW: Display recurrence info */}
{/* NEW: Display recurrence info for SortableItem (Default sort) */}
                                {todo.recurrence && todo.recurrence !== 'none' && (
                                    <div style={{ fontSize: '0.8em', color: '#007bff', marginTop: '5px' }}>
                                        Repeats: {
                                            typeof todo.recurrence === 'object' && todo.recurrence.type
                                                ? todo.recurrence.type // If recurrence is an object with a type
                                                : todo.recurrence      // If recurrence is directly the type string
                                        }
                                        {/* Added optional chaining and Array.isArray checks */}
                                        {/* For Weekly */}
                                        {
                                          (typeof todo.recurrence === 'object' && todo.recurrence.type === 'weekly') ||
                                          (typeof todo.recurrence === 'string' && todo.recurrence === 'weekly')
                                        ? (
                                            Array.isArray(todo.recurrenceDetails?.dayOfWeek) &&
                                            todo.recurrenceDetails.dayOfWeek.length > 0 &&
                                            ` on ${todo.recurrenceDetails.dayOfWeek.map(dayIndex => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex]).join(', ')}`
                                          ) : null
                                        }
                                        
                                        {/* For Monthly */}
                                        {
                                          (typeof todo.recurrence === 'object' && todo.recurrence.type === 'monthly') ||
                                          (typeof todo.recurrence === 'string' && todo.recurrence === 'monthly')
                                        ? (
                                            todo.recurrenceDetails?.dayOfMonth &&
                                            ` on day ${todo.recurrenceDetails.dayOfMonth}`
                                          ) : null
                                        }
                                        
                                        {/* For Yearly */}
                                        {
                                          (typeof todo.recurrence === 'object' && todo.recurrence.type === 'yearly') ||
                                          (typeof todo.recurrence === 'string' && todo.recurrence === 'yearly')
                                        ? (
                                            todo.recurrenceDetails?.month !== undefined && todo.recurrenceDetails?.dayOfMonth !== undefined &&
                                            ` on ${new Date(0, todo.recurrenceDetails.month).toLocaleString('default', { month: 'long' })} ${todo.recurrenceDetails.dayOfMonth}`
                                          ) : null
                                        }
                                    </div>
                                )}

                        <button
                            onClick={() => startEdit(todo)}
                            style={{ padding: '8px 12px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            Edit
                        </button>
                        {todo.isArchived ? (
                            // Show Restore button if archived
                            <button onClick={() => archiveTodo(todo._id, false)} title="Restore Task">
                                <FontAwesomeIcon icon={faBoxOpen} /> Restore
                            </button>
                        ) : (
                            // Show Archive button if not archived
                            <button onClick={() => archiveTodo(todo._id, true)} title="Archive Task">
                                <FontAwesomeIcon icon={faArchive} /> Archive
                            </button>
                        )}
                        <button
  onClick={() => togglePin(todo._id, todo.pinned)}
  style={{
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: 'auto',
    color: todo.pinned ? '#facc15' : '#888'
  }}
  title={todo.pinned ? 'Unpin Task' : 'Pin Task'}
>
  {todo.pinned ? '📌' : '📍'}
</button>

                        <button
                            onClick={ () => deleteTodo(todo._id)}
                            style={{ padding: '8px 12px', borderRadius: '4px', border: 'none', backgroundColor: '#6c757d', color: 'white', cursor: 'pointer' }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            🗑️ Delete
                        </button>
                    </>
                )}
            </div>

            {/* Description area */}
            {editingId === todo._id ? (
                <textarea
                    value={editDescription}
                    onChange={handleEditDescriptionChange}
                    placeholder="Add description..."
                    style={{
                        width: 'calc(100% - 20px)',
                        padding: '10px',
                        marginTop: '5px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        minHeight: '80px',
                        resize: 'vertical'
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                todo.description && todo.description.length > 0 && (
                    <div style={{
                        width: '100%',
                        fontSize: '0.9em',
                        color: '#555',
                        borderTop: '1px solid #eee',
                        paddingTop: '5px',
                        marginTop: '5px'
                    }}>
                        <div style={{
                            maxHeight: isDescriptionExpanded ? 'none' : '40px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: isDescriptionExpanded ? 'normal' : 'pre-wrap',
                            marginBottom: '5px'
                        }}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {todo.description}
                            </ReactMarkdown>
                        </div>
                        {todo.description.length > 50 && (
                            <button
                                onClick={() => setExpandedDescriptionId(isDescriptionExpanded ? null : todo._id)}
                                style={{
                                    fontSize: '0.75em',
                                    padding: '3px 6px',
                                    borderRadius: '3px',
                                    border: 'none',
                                    backgroundColor: '#e0e0e0',
                                    color: '#333',
                                    cursor: 'pointer'
                                }}
                            >
                                {isDescriptionExpanded ? 'Show Less' : 'Show More'}
                            </button>
                        )}
                    </div>
                )
            )}

            {/* Subtasks section */}
            <div style={{ width: '100%', borderTop: '1px solid #eee', paddingTop: '5px', marginTop: '5px' }}>
                {editingId === todo._id ? (
                    // Edit mode for subtasks
                    <>
                        <h4 style={{ margin: '5px 0' }}>Subtasks:</h4>
                        {editSubtasks.map((subtask, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                                <input
                                    type="checkbox"
                                    checked={subtask.completed}
                                    onChange={() => handleEditSubtaskToggle(index)}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <input
                                    type="text"
                                    value={subtask.text}
                                    onChange={(e) => handleEditSubtaskTextChange(index, e.target.value)}
                                    style={{ flexGrow: 1, padding: '3px', border: '1px solid #ddd', borderRadius: '3px' }}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    onKeyUp={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <button
                                    onClick={() => handleRemoveSubtask(index)}
                                    style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: '0 5px' }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        ))}
                        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                            <input
                                type="text"
                                value={editingNewSubtaskText}
                                onChange={(e) => setEditingNewSubtaskText(e.target.value)}
                                placeholder="Add new subtask..."
                                style={{ flexGrow: 1, padding: '5px', border: '1px solid #ccc', borderRadius: '3px' }}
                                onKeyDown={(e) => e.stopPropagation()}
                                onKeyUp={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <button
                                onClick={handleAddEditSubtask}
                                style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#61dafb', color: 'black', cursor: 'pointer' }}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Add
                            </button>
                        </div>
                    </>
                ) : (
                    // Display mode for subtasks
                    totalSubtasksCount > 0 && (
                        <div>
                            <h4 style={{ margin: '5px 0', color: '#666' }}>
                                Subtasks ({completedSubtasksCount}/{totalSubtasksCount}):
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, marginLeft: '10px' }}>
                                {todo.subtasks.map((subtask, index) => (
                                    <li key={index} style={{ marginBottom: '3px', fontSize: '0.9em', display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={subtask.completed}
                                            onChange={() => toggleSubtaskCompleteDirectly(todo._id, index, !subtask.completed)}
                                            style={{ marginRight: '5px' }}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <span style={{ textDecoration: subtask.completed ? 'line-through' : 'none', color: '#444' }}>
                                            {subtask.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                )}
            </div>
        </li>
    );
};


// ===================================================================================================
// App Component (Main Entry Point)
// ===================================================================================================
function App() {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
     const [isDarkMode, setIsDarkMode] = useState(false);
     const [user, setUser] = useState(null);


    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (storedToken && storedUserId) {
            setToken(storedToken);
            setUserId(storedUserId);

             axios.get('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${storedToken}` }
        })
        .then(res => setUser(res.data))
        .catch(err => console.error("Failed to fetch user profile:", err));
        }
        setLoading(false);
    }, []);

  

    const login = async (token, userId) => {
        setToken(token);
        setUserId(userId);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        try {
            const res = await axios.get('http://localhost:5000/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch user profile on login:", err);
        }
    };

    const logout = () => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        toast.info('🚪 Logged out', {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: true,
    theme: 'colored'
  });
    };

    const ProtectedRoute = ({ children }) => {
        return token ? children : <Navigate to="/home" replace />;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    

    const toggleTheme = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            if (newMode) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
            return newMode;
        });
    };

    // Helper component to apply the auth-page-container class conditionally
    const AuthLayout = ({ children }) => {
        const location = useLocation();
        const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

        if (isAuthRoute) {
            return (
                <div className="auth-page-container">
                    {children}
                </div>
            );
        }
        return children;
    };

    return (
        <Router>
            <div className="App">
                 <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
                <Routes>
                    <Route path="/home" element={<LandingPage />} />
   <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/home" />} />
                     <Route path="/login" element={<AuthLayout><Login login={login} /></AuthLayout>} />
                    <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />
  <Route path="/verify-email/:token" element={<VerifyEmail />} />
  <Route path="/resend-verification" element={<ResendVerification />} />
  <Route path="/update-profile" element={<><Navbar logout={logout} user={user}/><UpdateProfile /></>} />
  <Route path="/reflection" element={<><Navbar logout={logout} user={user} /><Reflection /></>} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
    <>
      <Navbar logout={logout} user={user} />
      <TodoList token={token} userId={userId} logout={logout} user={user}/>
    </>
  </ProtectedRoute>
} />
<Route path="/profile" element={<><Navbar logout={logout} user={user}/><ProfilePage /></>} />

<Route path="/how-to-use" element={<><Navbar logout={logout} user={user}/><HowToUse /></>} />
<Route path="/feedback" element={<><Navbar logout={logout} user={user}/><Feedback /></>} />

            </Routes>
              
            </div>
        </Router>
    );
}

// ===================================================================================================
// TodoList Component - MODIFIED for calculating main task checkbox disable state & Recurrence Input
// ===================================================================================================
function TodoList({ token, userId, logout,user }) {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [description, setDescription] = useState('');
    const [subtasks, setSubtasks] = useState([]); // For new todo subtasks
    const [newSubtaskText, setNewSubtaskText] = useState(''); // For adding a subtask to the new todo

    // NEW STATES FOR RECURRENCE (Add New Todo)
    const [recurrence, setRecurrence] = useState('none');
    const [recurrenceDetails, setRecurrenceDetails] = useState({});


    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [editPriority, setEditPriority] = useState('Medium');
    const [editDueDate, setEditDueDate] = useState('');
    const [editingTagsInput, setEditingTagsInput] = useState('');
    const [editReminderTime, setEditReminderTime] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editSubtasks, setEditSubtasks] = useState([]); // For edited todo subtasks
    const [editingNewSubtaskText, setEditingNewSubtaskText] = useState(''); // For adding a subtask during edit

    // NEW STATES FOR RECURRENCE (Edit Todo)
    const [editRecurrence, setEditRecurrence] = useState('none');
    const [editRecurrenceDetails, setEditRecurrenceDetails] = useState({});


    const [filter, setFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [sortOption, setSortOption] = useState('default');
    const [filterTagText, setFilterTagText] = useState('');
    
    const [viewMode, setViewMode] = useState('all');

    const [searchQuery, setSearchQuery] = useState('');

    const scheduledReminders = useRef({});
    const searchDebounceTimeout = useRef(null);
    const tagFilterDebounceTimeout = useRef(null);
    const [expandedDescriptionId, setExpandedDescriptionId] = useState(null);

    // Inside the App component, with your other useState declarations
const [minutes, setMinutes] = useState(25); // Initial Pomodoro work duration
const [seconds, setSeconds] = useState(0);
const [isActive, setIsActive] = useState(false); // To start/pause the timer
const [breakMinutes, setBreakMinutes] = useState(5); // Initial short break duration
const [longBreakMinutes, setLongBreakMinutes] = useState(15); // Initial long break duration
const [pomodoroCount, setPomodoroCount] = useState(0); // To track cycles for long breaks
const [currentPomodoroPhase, setCurrentPomodoroPhase] = useState('work'); // 'work', 'short-break', 'long-break'

// NEW STATE VARIABLES for user-set durations
const [userWorkMinutes, setUserWorkMinutes] = useState(25); // Default 25
const [userBreakMinutes, setUserBreakMinutes] = useState(5);  // Default 5 (short break)
const [userLongBreakMinutes, setUserLongBreakMinutes] = useState(15); // Default 15 (long break)
const [isLoading, setIsLoading] = useState(false);
const [timeString, setTimeString] = useState('');


const motivationalQuotes = [
  "🔥 You're on fire! Keep it up!",
  "🚀 Crushing it! Stay focused.",
  "💪 Great work! Another step forward.",
  "🎯 Goal getter alert!",
  "🌟 You're building something amazing.",
  "📈 That’s progress, not perfection!",
  "🏆 5 down — you're unstoppable!",
];

const hours = new Date().getHours();
const greeting =
  hours < 12
    ? "Good morning"
    : hours < 18
    ? "Good afternoon"
    : "Good evening";

useEffect(() => {
  const updateClock = () => {
    const now = new Date();
    const hours1 = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const updatedTime = `${hours1 % 12 || 12}:${minutes} ${hours1 >= 12 ? 'PM' : 'AM'}`;
    setTimeString(updatedTime);
  };

  updateClock(); // Set once initially
  const intervalId = setInterval(updateClock, 60000); // Update every minute

  return () => clearInterval(intervalId); // Clean up on unmount
}, []);

let greeting1 = '';
let emoji = '';

if (hours < 12) {
  greeting1 = 'Good morning';
  emoji = '☀️';
} else if (hours < 18) {
  greeting1 = 'Good afternoon';
  emoji = '🌤️';
} else {
  greeting1 = 'Good evening';
  emoji = '🌙';
}


const lastMilestoneShown = useRef(0);


const [dashboardData, setDashboardData] = useState({
  weeklyCompletion: [],
  percentOverdue: 0,
});




    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [theme, setTheme] = useState(() => {
  return localStorage.getItem('theme') || 'dark'; // default to dark
});

useEffect(() => {
  document.body.className = theme;
  localStorage.setItem('theme', theme);
}, [theme]);

const toggleTheme = () => {
  setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
};

    // --- Notification Permission and Scheduling Logic ---
    useEffect(() => {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        } else if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    console.log("Notification permission granted.");
                } else {
                    console.log("Notification permission denied.");
                }
            });
        }
    }, []);

    

useEffect(() => {
  const lastShown = localStorage.getItem('dailyToastShown');
  const todayKey = new Date().toISOString().split('T')[0]; // e.g., "2025-05-27"
  if (lastShown === todayKey || todos.length === 0) return;
  console.log("🧪 Today:", todayKey, "Last shown:", lastShown);
    

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight

  let dueToday = 0;
  let overdue = 0;
  let nextPending = null;

  todos.forEach(todo => {
    if (todo.completed || todo.isArchived) return;

    const due = todo.dueDate ? new Date(todo.dueDate) : null;
    if (!due) return;

    const dueAtMidnight = new Date(due);
    dueAtMidnight.setHours(0, 0, 0, 0);

    if (dueAtMidnight.getTime() === today.getTime()) {
      dueToday++;
    } else if (due < today) {
      overdue++;
    }

    if (!nextPending) {
      nextPending = todo.text;
    }
  });

  const quotes = [
  "Make today count! 💪",
  "Let’s get those tasks done! 🚀",
  "One step closer to your goals.",
  "Stay focused, you’ve got this! ✨",
];
const quote = quotes[Math.floor(Math.random() * quotes.length)];

  const message = `📅 Today: ${dueToday} due, ${overdue} overdue` + 
    (nextPending ? `. Next: “${nextPending}”` : '');

  toast.info(`${message} ${quote}`, {
    theme: 'dark',
    position: 'top-center',
    icon: '📌',
  });
  localStorage.setItem('dailyToastShown', todayKey);
}, [todos]);

    // Inside the App component, after your useState declarations
// Inside the TodoList function, update your useEffect hook
useEffect(() => {
    let interval = null;

    if (isActive) {
        interval = setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(interval);

                    // Play a sound if you have one
                    // document.getElementById('timer-end-sound').play();

                    if (currentPomodoroPhase === 'work') {
                        setPomodoroCount(prevCount => prevCount + 1);
                        if ((pomodoroCount + 1) % 4 === 0) { // After 4 work sessions, take a long break
                            setCurrentPomodoroPhase('long-break');
                            setMinutes(userLongBreakMinutes); // Use user-defined long break
                            setSeconds(0);
                        } else {
                            setCurrentPomodoroPhase('short-break');
                            setMinutes(userBreakMinutes); // Use user-defined short break
                            setSeconds(0);
                        }
                    } else { // It was a break phase (short or long)
                        setCurrentPomodoroPhase('work');
                        setMinutes(userWorkMinutes); // Use user-defined work time
                        setSeconds(0);
                    }
                    setIsActive(true); // Automatically start the next phase
                } else {
                    setMinutes(minutes => minutes - 1);
                    setSeconds(59);
                }
            } else {
                setSeconds(seconds => seconds - 1);
            }
        }, 1000);
    } else {
        clearInterval(interval);
    }

    return () => clearInterval(interval);
}, [isActive, minutes, seconds, currentPomodoroPhase, pomodoroCount, userWorkMinutes, userBreakMinutes, userLongBreakMinutes]); // IMPORTANT: Update dependencies!
// Dependencies: Ensure useEffect re-runs when these values change.



// Function to format time for display (e.g., 05:00)
const formatTime = (min, sec) => {
    const formattedMinutes = min < 10 ? `0${min}` : min;
    const formattedSeconds = sec < 10 ? `0${sec}` : sec;
    return `${formattedMinutes}:${formattedSeconds}`;
};

    // Helper to show a single notification
    const showNotification = useCallback((todo) => {
        if (Notification.permission === "granted") {
            new Notification(`To-Do Reminder: ${todo.text}`, {
                body: `Priority: ${todo.priority}${todo.dueDate ? ` | Due: ${new Date(todo.dueDate).toLocaleDateString()}` : ''}`,
                icon: '/path/to/your/icon.png', // Replace with a real icon path
                vibrate: [200, 100, 200]
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }, []);

    // Helper to schedule a single notification
    const scheduleNotification = useCallback((todo) => {
        if (scheduledReminders.current[todo._id]) {
            clearTimeout(scheduledReminders.current[todo._id]);
            delete scheduledReminders.current[todo._id];
        }

        if (!todo.reminderTime || todo.completed) {
            return;
        }

        const reminderDate = new Date(todo.reminderTime);
        const now = new Date();

        if (reminderDate <= now) {
            showNotification(todo);
            return;
        }

        const delay = reminderDate.getTime() - now.getTime();

        if (delay > 2147483647) { // Max delay for setTimeout (approx 24.8 days)
            console.warn(`Reminder for "${todo.text}" is too far in the future (${delay / (1000 * 60 * 60 * 24)} days). Cannot schedule with setTimeout directly.`);
            return;
        }
        if (delay < 0) {
            console.log(`Reminder for "${todo.text}" is in the past, not scheduling.`);
            return;
        }

        scheduledReminders.current[todo._id] = setTimeout(() => {
            showNotification(todo);
            delete scheduledReminders.current[todo._id];
        }, delay);
        console.log(`Scheduled reminder for "${todo.text}" at ${reminderDate.toLocaleString()}`);
    }, [showNotification]);

    // Effect to manage reminders (runs when todos or scheduleNotification changes)
    useEffect(() => {
        Object.values(scheduledReminders.current).forEach(timeoutId => clearTimeout(timeoutId));
        scheduledReminders.current = {};

        todos.forEach(todo => {
            if (!todo.completed && todo.reminderTime) {
                scheduleNotification(todo);
            }
        });

        return () => {
            Object.values(scheduledReminders.current).forEach(timeoutId => clearTimeout(timeoutId));
        };
    }, [todos, scheduleNotification]);


    const fetchTodos = useCallback(async (mode = 'all', currentSearchQuery = '', currentFilter = 'all', currentTagFilter = '', currentDateFilter = 'all') => {
        setIsLoading(true);
    try {
        const token = localStorage.getItem('token'); // Ensure 'token' is accessible here
        if (!token) return;

        let url = 'http://localhost:5000/api/todos';
        // 🚨 CHANGE THIS LINE: Initialize params as a URLSearchParams object
        const params = new URLSearchParams(); 
        
        if (mode === 'my-day') {
            url = 'http://localhost:5000/api/todos/today';
        } else {
            if (currentSearchQuery) {
                params.append('search', currentSearchQuery); // Use append
            }
            if (currentFilter && currentFilter !== 'all' && currentFilter !== 'tag') {
                params.append('filter', currentFilter); // Use append
            }
            if (currentFilter === 'tag' && currentTagFilter) {
                params.append('tag', currentTagFilter); // Use append
            }
            if (currentDateFilter && currentDateFilter !== 'all') {
                params.append('dateFilter', currentDateFilter); // Use append
            }
            if (filter === 'archived') { // Assuming 'filter' state is accessible in this scope
                params.append('archived', 'true');
            } else {
                params.append('archived', 'false'); // Default: Only show non-archived
            }
        }

        const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
            params: params, // Pass the URLSearchParams object
        });
        setTodos(res.data.sort((a, b) => (a.order !== undefined && b.order !== undefined) ? a.order - b.order : 0));


        const stats = getDashboardStats(res.data);
    setDashboardData(stats);
    } catch (error) {
        console.error(`Error fetching ${mode} todos:`, error);
        // Handle unauthorized or token expired
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            // Optionally redirect to login or show message
        }
    } finally {
        setIsLoading(false);
    }
}, [token, filter]); 

// Add 'filter' to the dependency array


// Your useEffect hook remains the same
useEffect(() => {
    if (token) {
        fetchTodos(viewMode, searchQuery, filter, filterTagText, dateFilter);
    }
}, [token, viewMode, searchQuery, filter, filterTagText, dateFilter, fetchTodos]);


    useEffect(() => {
        if (viewMode === 'my-day') {
            setSearchQuery('');
            setFilter('all');
            setFilterTagText('');
            setDateFilter('all');
            setExpandedDescriptionId(null);
        }
    }, [viewMode]);

    


    const handleDragEnd = async (event) => {
    const { active, over } = event;

    // Ensure not dragging a header or dropping onto a header
    if (active.data.current?.type === 'header' || over.data.current?.type === 'header') return;

    if (over && active.id !== over.id) {
        const oldIndex = todos.findIndex(todo => todo._id === active.id);
        const newIndex = todos.findIndex(todo => todo._id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
            console.warn("Dragged or dropped item not found in global todos array. Active ID:", active.id, "Over ID:", over.id);
            return;
        }

        const reorderedGlobalTodos = arrayMove(todos, oldIndex, newIndex);

        const updatedGlobalOrder = reorderedGlobalTodos.map((todo, index) => ({
            ...todo,
            order: index
        }));

        console.log('Current sortOption during drag end:', sortOption);
        setTodos(updatedGlobalOrder); // Update local state immediately for responsiveness

        const newOrderIds = updatedGlobalOrder.map(t => t._id);

        // --- ADD THESE DEBUGGING CONSOLE.LOGS ---
        console.log('Frontend Debug: newOrderIds being sent:', newOrderIds);
        console.log('Frontend Debug: Is newOrderIds an array?', Array.isArray(newOrderIds));
        console.log('Frontend Debug: Length of newOrderIds:', newOrderIds.length);
        // --- END DEBUGGING CONSOLE.LOGS ---

        updateTodoOrder(newOrderIds); // This is where the array is sent
    }
};

    const updateTodoOrder = async (newOrderIds) => {
        try {
            await axios.put(
                'http://localhost:5000/api/todos/reorder',
                { order: newOrderIds },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchTodos(viewMode, searchQuery, filter, filterTagText, dateFilter);
        } catch (error) {
            console.error('Error updating todo order:', error);
            fetchTodos(viewMode, searchQuery, filter, filterTagText, dateFilter); // Re-fetch on error to ensure correct state
        }
    };

    // Inside your App component (e.g., near other useStates and useMemos)
const isDragAndDropEnabled = useMemo(() => {
    // DND should ONLY be enabled when the list is sorted by its custom order
    // and not filtered by specific dates that might implicitly sort the list.
    console.log('DND Check: dateFilter =', dateFilter, ', sortOption =', sortOption);
    const enabled = dateFilter === 'all' && sortOption === 'default';
    console.log('DND Check: isDragAndDropEnabled =', enabled);
    return enabled;
}, [dateFilter, sortOption]);



    const addTodo = async () => {
        try {
            const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            const reminderDate = reminderTime ? new Date(reminderTime).toISOString() : null;

            if (filter !== 'archived') {
                 setTodos(prevTodos => [...prevTodos, response.data]);
            }
            const res = await axios.post(
                'http://localhost:5000/api/todos',
                {
                    text,
                    completed: false,
                    priority,
                    dueDate: dueDate || null,
                    tags: tagsArray,
                    reminderTime: reminderDate,
                    description,
                    subtasks,
                    // NEW: Recurring fields
                    recurrence: recurrence,
                    recurrenceDetails: recurrenceDetails,
                    isArchived: false,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            fetchTodos(viewMode, searchQuery, filter, filterTagText, dateFilter); // Re-fetch to see new todo
            setText('');
            setPriority('Medium');
            setDueDate('');
            setTagsInput('');
            setReminderTime('');
            setDescription('');
            setSubtasks([]);
            setNewSubtaskText('');
            // NEW: Reset recurrence fields
            setRecurrence('none');
            setRecurrenceDetails({});
        } catch (error) {
            console.error('Error adding todo:', error);
            alert(`Failed to add todo: ${error.response?.data?.message || error.message}`);
        }
    };

// Duplicate clearCompletedTodos removed to fix redeclaration error

    const deleteTodo = async (id) => {
        const confirmed = window.confirm('🗑️ Are you sure you want to delete this task?');
  if (!confirmed) return;
        try {
            await axios.delete(`http://localhost:5000/api/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
             toast.success('Task deleted successfully!', {
      icon: '🗑️',
      theme: 'dark',
    });
            fetchTodos(viewMode, searchQuery, filter, filterTagText, dateFilter);
        } catch (error) {
            console.error('Error deleting todo:', error);
            alert(`Failed to delete todo: ${error.response?.data?.message || error.message}`);
        }
    };
const startEdit = (todo) => {
    console.log('--- ACTUAL startEdit function called with todo object:', todo);
    if (!todo || !todo._id) {
        console.error('startEdit received an invalid todo object:', todo);
        return;
    }

    setEditingId(todo._id);
    setEditText(todo.text);
    setEditPriority(todo.priority || 'Medium');
    setEditDueDate(todo.dueDate ? todo.dueDate.substring(0, 10) : '');
    setEditReminderTime(todo.reminderTime ? new Date(todo.reminderTime).toISOString().slice(0, 16) : '');
    setEditDescription(todo.description || '');
    setEditingTagsInput(todo.tags && Array.isArray(todo.tags) ? todo.tags.join(', ') : '');
    setEditSubtasks(todo.subtasks ? [...todo.subtasks] : []);
    setEditingNewSubtaskText('');

    // --- REVISED RECURRENCE HANDLING ---

    // First, determine the recurrence type
    let initialRecurrenceType = 'none';
    if (todo.recurrence) {
        if (typeof todo.recurrence === 'string') {
            initialRecurrenceType = todo.recurrence;
        } else if (typeof todo.recurrence === 'object' && todo.recurrence.type) {
            initialRecurrenceType = todo.recurrence.type;
        }
    }
    setEditRecurrence(initialRecurrenceType);

    // Second, set the recurrence details, ensuring dayOfWeek is an array
    const initialRecurrenceDetails = todo.recurrenceDetails ? { ...todo.recurrenceDetails } : {};

    // *** IMPORTANT FIX FOR WEEKLY RECURRENCE DAYOFWEEK ***
    if (initialRecurrenceDetails.dayOfWeek && !Array.isArray(initialRecurrenceDetails.dayOfWeek)) {
        // If dayOfWeek exists but is not an array (e.g., it's a number from an old save)
        // Convert it to an array or set to empty array if unexpected
        initialRecurrenceDetails.dayOfWeek = [initialRecurrenceDetails.dayOfWeek]; // Assuming it might be a single number
    } else if (!initialRecurrenceDetails.dayOfWeek) {
        // If dayOfWeek is not present at all, initialize it as an empty array for weekly
        initialRecurrenceDetails.dayOfWeek = [];
    }
    // For other recurrence types, ensure dayOfMonth is a number, etc., if needed:
    // if (initialRecurrenceDetails.dayOfMonth && typeof initialRecurrenceDetails.dayOfMonth !== 'number') {
    //     initialRecurrenceDetails.dayOfMonth = parseInt(initialRecurrenceDetails.dayOfMonth);
    // }

    setEditRecurrenceDetails(initialRecurrenceDetails);
};

    const handleEditChange = (e) => setEditText(e.target.value);
    const handleEditPriorityChange = (e) => setEditPriority(e.target.value);
    const handleDueDateChange = (e) => setDueDate(e.target.value);
    const handleEditDueDateChange = (e) => setEditDueDate(e.target.value);
    const handleEditReminderTimeChange = (e) => {
        setEditReminderTime(e.target.value);
    };
    const handleEditDescriptionChange = (e) => setEditDescription(e.target.value);

    // Handlers for Subtasks (adding new todo)
    const handleAddSubtask = () => {
        if (newSubtaskText.trim()) {
            setSubtasks([...subtasks, { text: newSubtaskText.trim(), completed: false }]);
            setNewSubtaskText('');
        }
    };

    // Handlers for Subtasks (editing existing todo)
    const handleEditSubtaskTextChange = (index, newText) => {
        const updatedSubtasks = [...editSubtasks];
        updatedSubtasks[index].text = newText;
        setEditSubtasks(updatedSubtasks);
    };

    const handleEditSubtaskToggle = (index) => {
        const updatedSubtasks = [...editSubtasks];
        updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
        setEditSubtasks(updatedSubtasks);
    };

    const handleAddEditSubtask = () => {
        if (editingNewSubtaskText.trim()) {
            setEditSubtasks([...editSubtasks, { text: editingNewSubtaskText.trim(), completed: false }]);
            setEditingNewSubtaskText('');
        }
    };

    const handleRemoveSubtask = (index) => {
        setEditSubtasks(editSubtasks.filter((_, i) => i !== index));
    };

    // Handler for direct subtask toggling
    const toggleSubtaskCompleteDirectly = async (todoId, subtaskIndex, newCompletedStatus) => {
        try {
            const todoToUpdate = todos.find(todo => todo._id === todoId);
            if (!todoToUpdate) return;

            const updatedSubtasks = todoToUpdate.subtasks ? [...todoToUpdate.subtasks] : [];
            if (subtaskIndex >= 0 && subtaskIndex < updatedSubtasks.length) {
                updatedSubtasks[subtaskIndex] = {
                    ...updatedSubtasks[subtaskIndex],
                    completed: newCompletedStatus
                };

                let newMainTodoCompletedStatus = todoToUpdate.completed;
                // If the main todo was completed, and a subtask is now set to incomplete, then main todo should become incomplete
                if (todoToUpdate.completed && !newCompletedStatus) {
                    newMainTodoCompletedStatus = false;
                }
                // No need to explicitly set to true here; the main checkbox click will handle it.

                await axios.put(
                    `http://localhost:5000/api/todos/${todoId}`,
                    { subtasks: updatedSubtasks, completed: newMainTodoCompletedStatus },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                fetchTodos(viewMode, searchQuery, filter, filterTagText, dateFilter); // Refresh all todos
            }
        } catch (error) {
            console.error('Error toggling subtask completion directly:', error);
            alert(`Failed to update subtask: ${error.response?.data?.message || error.message}`);
        }
    };


    const archiveTodo = async (id, archiveStatus) => {
        try {
            const token = localStorage.getItem('token');
            const todoToUpdate = todos.find(t => t._id === id);
            if (!todoToUpdate) return;

            const updatedTodo = { ...todoToUpdate, isArchived: archiveStatus };

            await axios.put(`http://localhost:5000/api/todos/${id}`, updatedTodo, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Optimistically update the frontend state: remove the task from the current view
            // since its `isArchived` status changed, causing it to fall out of the current filter.
            setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));

            // A more robust approach might be to re-fetch all todos after this action
            // if you want to ensure the list is perfectly in sync with the backend
            // However, `setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));`
            // is often sufficient for a smoother UX.
            // If you want to trigger a full re-fetch:
            // fetchTodos();

        } catch (err) {
            console.error('Error archiving/restoring todo:', err);
        }
    };

    const togglePin = async (id, currentPinStatus) => {
  try {
    await axios.put(`http://localhost:5000/api/todos/${id}`, { pinned: !currentPinStatus }, {
  headers: { Authorization: `Bearer ${token}` }
});

    setTodos(prev =>
      prev.map(todo => todo._id === id ? { ...todo, pinned: !currentPinStatus } : todo)
    );
    toast.success(!currentPinStatus ? '📌 Task pinned!' : '📍 Task unpinned!');
  } catch (err) {
    console.error('Error toggling pin:', err);
  }
};



   const saveEdit = async () => {
    try {
        const tagsArray = editingTagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        const reminderDate = editReminderTime ? new Date(editReminderTime).toISOString() : null;

        const payload = {
            text: editText,
            priority: editPriority,
            dueDate: editDueDate || null,
            tags: tagsArray,
            reminderTime: reminderDate,
            description: editDescription,
            subtasks: editSubtasks,
            recurrence: editRecurrence,
            recurrenceDetails: editRecurrenceDetails,
        };

        console.log('--- Saving todo with ID:', editingId);
        console.log('--- Payload being sent to backend:', JSON.stringify(payload, null, 2)); // <--- ADD THIS LINE

        await axios.put(
            `http://localhost:5000/api/todos/${editingId}`,
            payload, // Use the prepared payload
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        setEditingId(null);
        setEditText('');
        setEditPriority('Medium');
        setEditDueDate('');
        setEditingTagsInput('');
        setEditReminderTime('');
        setEditDescription('');
        setEditSubtasks([]);
        setEditingNewSubtaskText('');
        setEditRecurrence('none');
        setEditRecurrenceDetails({});
        fetchTodos(viewMode, searchQuery, filter, filterTagText, dateFilter);
    } catch (error) {
        console.error('Error updating todo:', error);
        alert(`Failed to save edit: ${error.response?.data?.message || error.message}`);
    }
};

    const toggleComplete = async (todo) => {
        try {
            await axios.put(
                `http://localhost:5000/api/todos/${todo._id}/complete`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            // After marking the task complete
// if (
//   totalCompleted > 0 &&
//   totalCompleted % 5 === 0 &&
//   totalCompleted !== lastMilestoneShown.current
// ) {
//   lastMilestoneShown.current = totalCompleted;
//   const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
//   toast.info(quote, {
//     theme: 'dark',
//     position: 'top-center',
//     icon: '💬',
//   });
// }

            fetchTodos(viewMode, searchQuery, filter, filterTagText, dateFilter);
        } catch (error) {
            console.error('Error updating completion status:', error);
            alert(`Failed to toggle completion: ${error.response?.data?.message || error.message}`);
        }
    };

    const clearCompletedTodos = async () => {
    try {
        // Ensure this is the correct endpoint for clearing ALL completed todos
        // It should NOT include any ID in the URL like /api/todos/completed/someId
        // It should also be a DELETE request.
        await axios.delete('http://localhost:5000/api/todos/completed', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Successfully sent request to clear completed todos."); // Add this for debugging
        fetchTodos(); // Re-fetch all todos to update the UI
    } catch (error) {
        console.error('Error clearing completed todos:', error);
        // Log the full error to see what the Axios response contains if it's not a 500
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
        }
        // Handle error, e.g., show a notification to the user
    }
};

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'red';
            case 'Medium': return 'orange';
            case 'Low': return 'green';
            default: return 'gray';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const displayDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatDateTimeForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (searchDebounceTimeout.current) {
            clearTimeout(searchDebounceTimeout.current);
        }

        searchDebounceTimeout.current = setTimeout(() => {
            fetchTodos(viewMode, value, filter, filterTagText, dateFilter);
        }, 500);
    };

    const handleFilterChange = (e) => {
        const newFilter = e.target.value;
        setFilter(newFilter);
        setFilterTagText('');
        fetchTodos(viewMode, searchQuery, newFilter, '', dateFilter);
    };

    const handleTagFilterChange = (e) => {
        const value = e.target.value;
        setFilterTagText(value);

        if (tagFilterDebounceTimeout.current) {
            clearTimeout(tagFilterDebounceTimeout.current);
        }

        tagFilterDebounceTimeout.current = setTimeout(() => {
            fetchTodos(viewMode, searchQuery, filter, value, dateFilter);
        }, 300);
    };

    const handleDateFilterChange = (e) => {
        const newDateFilter = e.target.value;
        setDateFilter(newDateFilter);
        fetchTodos(viewMode, searchQuery, filter, filterTagText, newDateFilter);
    };

        // Inside the App component, after the useEffect hook
const startTimer = () => {
    setIsActive(true);
    console.log('Start button clicked, isActive set to:', true);
};

const pauseTimer = () => {
    setIsActive(false);
    console.log('Pause button clicked, isActive set to:', false);
};

// Inside the TodoList function, update your resetTimer function
const resetTimer = () => {
    setIsActive(false);
    setCurrentPomodoroPhase('work');
    setMinutes(userWorkMinutes); // Reset to user-defined work time
    setSeconds(0);
    setPomodoroCount(0);
};

    const displayedTodos = useMemo(() => {
    // --- Debugging useMemo State ---
    console.log('--- Debugging useMemo State ---');
    console.log('Current dateFilter value:', dateFilter);
    console.log('-------------------------------');
    // --- End Debugging ---

    let filteredAndSortedTodos = [...todos]; // Start with all todos for filtering

    // Apply search query filter
    if (searchQuery) {
        filteredAndSortedTodos = filteredAndSortedTodos.filter(todo =>
            todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (todo.tags && todo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
            (todo.subtasks && todo.subtasks.some(subtask => subtask.text.toLowerCase().includes(searchQuery.toLowerCase())))
        );
    }

    // Apply global filter (e.g., 'completed', 'incomplete', 'priority-high')
    if (filter === 'completed' && filter !== 'archived') {
        filteredAndSortedTodos = filteredAndSortedTodos.filter(todo => todo.completed);
    } else if (filter === 'incomplete'  && filter !== 'archived') {
        filteredAndSortedTodos = filteredAndSortedTodos.filter(todo => !todo.completed);
    } else if (filter.startsWith('priority-') && filter !== 'archived') {
        const priorityLevel = filter.split('-')[1];
        const capitalizedPriority = priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1);
        filteredAndSortedTodos = filteredAndSortedTodos.filter(todo => todo.priority === capitalizedPriority);
    }

    console.log('displayedTodos useMemo: Current sortOption:', sortOption);

    // Apply sorting *only if not grouping by date*
    // The 'grouped' dateFilter option will have its own internal sorting for each group
    if (dateFilter !== 'grouped') { // Changed 'default' to 'grouped'
        filteredAndSortedTodos.sort((a, b) => {
            switch (sortOption) {
                case 'creation-date-asc':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'creation-date-desc':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'due-date-asc':
                    const dateA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31T23:59:59.999Z'); // Future date for null
                    const dateB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31T23:59:59.999Z');
                    return dateA - dateB;
                case 'due-date-desc':
                    const dateC = a.dueDate ? new Date(a.dueDate) : new Date('1900-01-01T00:00:00.000Z'); // Past date for null
                    const dateD = b.dueDate ? new Date(b.dueDate) : new Date('1900-01-01T00:00:00.000Z');
                    return dateD - dateC;
                case 'priority-asc':
                    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                case 'priority-desc':
                    const priorityOrderDesc = { High: 1, Medium: 2, Low: 3 };
                    return priorityOrderDesc[b.priority] - priorityOrderDesc[a.priority];
                default:
                    // Default sorting (e.g., by 'order' if you have one, or just original order)
                    return (a.order !== undefined && b.order !== undefined) ? a.order - b.order : 0;
            }
        });
    }

    
    // Apply date filter and group if a specific dateFilter is selected
    if (dateFilter && dateFilter !== 'all') { // If a specific date filter is active (excluding 'Any date')
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Start of today

        // Calculate current week (Sunday to Saturday)
        const startOfWeekVal = startOfWeek(now, { weekStartsOn: 0 }); // Sunday as start of week
        const endOfWeekVal = endOfWeek(now, { weekStartsOn: 0 });     // Saturday
        startOfWeekVal.setHours(0, 0, 0, 0); // Ensure exact start of day
        endOfWeekVal.setHours(23, 59, 59, 999); // Ensure exact end of day

        // Calculate current month
        const startOfMonthVal = startOfMonth(now);
        const endOfMonthVal = endOfMonth(now);
        startOfMonthVal.setHours(0, 0, 0, 0); // Ensure exact start of day
        endOfMonthVal.setHours(23, 59, 59, 999); // Ensure exact end of day

        // Calculate end of next 7 days (inclusive of today)
        const endOfNext7Days = new Date(now);
        endOfNext7Days.setDate(now.getDate() + 7);
        endOfNext7Days.setHours(23, 59, 59, 999);

        // --- ALL CATEGORIES FOR GROUPING (Matching frontend options) ---
        const grouped = {
            'Overdue': [],
            'Due Today': [],
            'Due This Week': [],
            'Upcoming (7 Days)': [],
            'Due This Month': [],
            'Other Dates': [] // This will hold tasks that don't fit other date criteria OR are completed
        };

        filteredAndSortedTodos.forEach(todo => {
            if (!todo.dueDate) {
                // Tasks without a due date go directly to 'Other Dates'
                grouped['Other Dates'].push(todo);
                return;
            }
            const todoDueDate = new Date(todo.dueDate);
            todoDueDate.setHours(0, 0, 0, 0); // Normalize todo due date to start of day

            // --- Debugging Todo Due Date (Keep for now) ---
            console.log('--- Debugging Todo Due Date ---');
            console.log('Raw todo.dueDate:', todo.dueDate);
            console.log('Parsed todoDueDate (normalized):', todoDueDate);
            console.log('Current "now" (start of today):', now);
            console.log('startOfWeekVal:', startOfWeekVal);
            console.log('endOfWeekVal:', endOfWeekVal);
            console.log('startOfMonthVal:', startOfMonthVal);
            console.log('endOfMonthVal:', endOfMonthVal);
            console.log('endOfNext7Days:', endOfNext7Days);
            console.log('todo.completed status:', todo.completed);
            console.log('-------------------------------');
            // --- End Debugging ---

            // --- FINALIZED GRANULAR CATEGORIZATION LOGIC (Most specific first) ---
            if (todo.completed) {
                // 1. Completed tasks always go to 'Other Dates'
                grouped['Other Dates'].push(todo);
            }
            else if (todoDueDate < now) {
                // 2. Overdue (incomplete tasks only)
                grouped['Overdue'].push(todo);
            }
            else if (todoDueDate.getTime() === now.getTime()) {
                // 3. Due Today (incomplete, not overdue)
                grouped['Due Today'].push(todo);
            }
            else if (todoDueDate >= startOfWeekVal && todoDueDate <= endOfWeekVal) {
                // 4. Due This Week (incomplete, not today, within current calendar week)
                grouped['Due This Week'].push(todo);
            }
            else if (todoDueDate <= endOfNext7Days) {
                // 5. Upcoming 7 Days (incomplete, not today/this week, but within the next 7 days)
                grouped['Upcoming (7 Days)'].push(todo);
            }
            else if (todoDueDate >= startOfMonthVal && todoDueDate <= endOfMonthVal) {
                // 6. Due This Month (incomplete, not today/this week/upcoming 7 days, but within the current month)
                grouped['Due This Month'].push(todo);
            }
            else {
                // 7. Any other future incomplete task (beyond all above specific ranges)
                grouped['Other Dates'].push(todo);
            }
            // --- END FINALIZED GRANULAR CATEGORIZATION LOGIC ---
        });

        // --- Debugging Grouped Object Contents After ForEach (Keep for now) ---
        console.log('--- Debugging Grouped Object Contents After ForEach ---');
        console.log('Contents of grouped object:', grouped);
        console.log('-----------------------------------------------------');
        // --- End Debugging ---

        let finalDisplayed = [];
        const addHeaderAndTodos = (headerName, todosArray) => {
            // Sort todos within each group for consistent display
            todosArray.sort((a, b) => {
                const dateA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31T23:59:59.999Z');
                const dateB = b.dueDate ? new Date(b.dueDate) : new Date('1900-01-01T00:00:00.000Z');
                return dateA - dateB; // Sort by due date ascending within groups
            });

            if (todosArray.length > 0) {
                finalDisplayed.push({ id: `header-${headerName}`, type: 'header', name: headerName });
                finalDisplayed = finalDisplayed.concat(todosArray);
            }
        };

        // Populate finalDisplayed based on the selected dateFilter
        // *** IMPORTANT: Ensure your frontend UI sets dateFilter to these EXACT strings ***
        if (dateFilter === 'overdue') {
            addHeaderAndTodos('Overdue', grouped['Overdue']);
        } else if (dateFilter === 'today') {
            addHeaderAndTodos('Due Today', grouped['Due Today']);
        } else if (dateFilter === 'due-this-week') { // Frontend should pass 'due-this-week'
            addHeaderAndTodos('Due This Week', grouped['Due This Week']);
        } else if (dateFilter === 'upcoming-7-days') {
            addHeaderAndTodos('Upcoming (7 Days)', grouped['Upcoming (7 Days)']);
        } else if (dateFilter === 'due-this-month') { // Frontend should pass 'due-this-month'
            addHeaderAndTodos('Due This Month', grouped['Due This Month']);
        } else if (dateFilter === 'other-dates') { // Frontend should pass 'other-dates' for 'Any Other'
            addHeaderAndTodos('Any Other', grouped['Other Dates']);
        } else if (dateFilter === 'grouped') { // This is for a "Grouped View All" if you have one
            // Display all groups with headers in a logical order
            addHeaderAndTodos('Overdue', grouped['Overdue']);
            addHeaderAndTodos('Due Today', grouped['Due Today']);
            addHeaderAndTodos('Due This Week', grouped['Due This Week']);
            addHeaderAndTodos('Upcoming (7 Days)', grouped['Upcoming (7 Days)']);
            addHeaderAndTodos('Due This Month', grouped['Due This Month']);
            addHeaderAndTodos('Any Other', grouped['Other Dates']);
        }

        // Sort pinned to top if not grouped by date
filteredAndSortedTodos.sort((a, b) => {
  if (a.pinned && !b.pinned) return -1;
  if (!a.pinned && b.pinned) return 1;
  return 0;
});

        return finalDisplayed;

    }

    // If no dateFilter or dateFilter is 'all' (meaning 'Any date' selected),
    // just return the original filtered and sorted todos directly without grouping.
    return filteredAndSortedTodos;
}, [todos, sortOption, searchQuery, filter, filterTagText, dateFilter]); // Keep 'filter' in dependency array

const clearAllFilters = () => {
  console.log("🧹 clearAllFilters called");

  const filterWasSet = filter !== 'all';
  const dateFilterWasSet = !!dateFilter; // true if not empty or null

  setFilter('all');
  setDateFilter('');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (filterWasSet && dateFilterWasSet) {
    toast.success('🧼 All filters cleared!', {
      theme: 'dark',
      position: 'top-center',
      autoClose: 2000,
    });
  } else if (filterWasSet) {
    toast.success('🧹 View filter cleared!', {
      theme: 'dark',
      position: 'top-center',
      autoClose: 2000,
    });
  } else if (dateFilterWasSet) {
    toast.success('📅 Date filter cleared!', {
      theme: 'dark',
      position: 'top-center',
      autoClose: 2000,
    });
  } else {
    toast.info('No filters were active.', {
      theme: 'dark',
      position: 'top-center',
      autoClose: 2000,
    });
  }
};



const getEmptyMessage = () => {
  if (filter === 'archived') return 'No archived tasks found.';
  if (filter === 'completed') return 'No completed tasks yet!';
  if (filter === 'incomplete') return 'You have no incomplete tasks!';
  if (filter?.startsWith('priority-')) return `No ${filter.split('-')[1]} priority tasks found.`;

  // Date filters only apply when filter is 'all'
  if ((filter === 'all' || !filter) && dateFilter === 'today') return 'Nothing due today!';
  if ((filter === 'all' || !filter) && dateFilter === 'overdue') return 'No overdue tasks — great job staying on track!';
  if ((filter === 'all' || !filter) && dateFilter === 'due-this-week') return 'No tasks due this week.';
  if ((filter === 'all' || !filter) && dateFilter === 'upcoming-7-days') return 'No upcoming tasks in the next 7 days.';
  if ((filter === 'all' || !filter) && dateFilter === 'due-this-month') return 'No tasks due this month.';
  if ((filter === 'all' || !filter) && dateFilter === 'other-dates') return 'No tasks with other due dates.';

  return 'No tasks match your current filters.';
};


// Example (inside useEffect or fetchTodos)
const getDashboardStats = (todos) => {
  const today = new Date();
  const last7 = [...Array(7)].map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().slice(0, 10); // YYYY-MM-DD
    return { date: key, completed: 0 };
  }).reverse();

  let overdueCount = 0;
  let totalCount = todos.length;

  todos.forEach(todo => {
    if (todo.completed && todo.completedAt) {
      const dateKey = new Date(todo.completedAt).toISOString().slice(0, 10);
      const day = last7.find(d => d.date === dateKey);
      if (day) day.completed += 1;
    }

    if (
      !todo.completed &&
      todo.dueDate &&
      new Date(todo.dueDate) < today
    ) {
      overdueCount++;
    }
  });

  const percentOverdue = totalCount === 0 ? 0 : Math.round((overdueCount / totalCount) * 100);

  return {
    weeklyCompletion: last7,
    percentOverdue,
  };
};


console.log('🧪 filter value:', filter);
console.log('🧪 dateFilter value:', dateFilter);

    console.log('🧪 displayedTodos length:', displayedTodos.length);
    const realTodos = displayedTodos.filter(item => item.type !== 'header');

    return (
        <div className={theme} style={{ minHeight: '100vh', padding: '20px' }}>
            {/* <ToastContainer
    position="top-center"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
  /> */}
            {isLoading ? (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p style={{ marginLeft: '10px' }}>Loading tasks...</p>
      </div>
    ) : (
      <>
      {user && (
  <div className="greeting-banner" style={{ textAlign: 'center', padding: '10px 0', fontSize: '1.2rem' }}>
    <h2>{greeting1}, {user.firstName}! {emoji} It's {timeString}</h2>
  </div>
)}


        <h1>To-Do List</h1>
            

            {/* View Mode Buttons */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => setViewMode('all')}
                    style={{
                        padding: '10px 15px',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: viewMode === 'all' ? '#007bff' : '#6c757d',
                        color: 'white'
                    }}
                >
                    All Todos
                </button>
                <button
                    onClick={() => setViewMode('my-day')}
                    style={{
                        padding: '10px 15px',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: viewMode === 'my-day' ? '#007bff' : '#6c757d',
                        color: 'white'
                    }}
                >
                    My Day
                </button>
                <button
  onClick={() => {
    setFilter('completed');
    setDateFilter(''); // optional: clear date filter when showing completed
  }}
  style={{
    backgroundColor: filter === 'completed' ? '#61dafb' : '#444',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    marginRight: '10px',
    cursor: 'pointer'
  }}
>
  ✅ Completed
</button>

<button onClick={toggleTheme} style={{
  background: 'none',
  color: theme === 'dark' ? '#fff' : '#222',
  border: '1px solid #888',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  marginLeft: 'auto'
}}>
  {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
</button>


            </div>



            {/* Search Input */}
            {viewMode === 'all' && (
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search todos by text, tag or description..."
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flexGrow: 1 }}
                    />
                </div>
            )}

<div style={{  padding: '20px', borderRadius: '10px', marginTop: '20px',color: theme === 'dark' ? '#fff' : '#111'
 }}>
  <h2>📈 Productivity Dashboard</h2>

  <div style={{ marginTop: '20px', height: 300 }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={dashboardData.weeklyCompletion}>
        <CartesianGrid stroke="#444" />
        <XAxis dataKey="date"  stroke={theme === 'dark' ? '#aaa' : '#333'} />
        <YAxis stroke={theme === 'dark' ? '#aaa' : '#333'} />
        <Tooltip
  content={({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const { completed, total } = payload[0].payload;

      return (
        <div
          style={{
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
            color: theme === 'dark' ? '#f0f0f0' : '#000000',
            padding: '10px',
            borderRadius: '8px',
            border: theme === 'dark' ? '1px solid #444' : '1px solid #ccc',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            fontSize: '14px',
          }}
        >
          <div>📅 <strong>{label}</strong></div>
          <div>✅ Completed: <strong>{completed}</strong></div>
          {/* <div>🧮 Total Tasks: <strong>{total}</strong></div> */}
        </div>
      );
    }
    return null;
  }}
/>

        <Line type="monotone" dataKey="completed" stroke="#61dafb" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <p style={{ marginTop: '10px' }}>
    ⚠️ <strong>{dashboardData.percentOverdue}%</strong> of your tasks are overdue.
  </p>
</div>


            {/* Add New Todo Section */}
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', flexWrap: 'wrap', border: '1px solid #555', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: theme === 'dark' ? '#fff' : '#000' }}>Add New Todo</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Todo text"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flexGrow: 1 }}
                    />
                    <input
                        type="text"
                        value={tagsInput}
                        onChange={e => setTagsInput(e.target.value)}
                        placeholder="Tags (comma-separated)"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <select
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    
                    <input
                        type="date"
                        value={dueDate}
                        onChange={handleDueDateChange}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <input
                        type="datetime-local"
                        value={formatDateTimeForInput(reminderTime)}
                        onChange={e => setReminderTime(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        title="Set a reminder date and time"
                    />
                </div>
                {/* NEW: Add Recurrence selection for new todos */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px' }}>
                    <label style={{ color: theme === 'dark' ? '#fff' : '#000' }}>Recurrence:</label>
                    <select
                        value={recurrence}
                        onChange={e => {
                            setRecurrence(e.target.value);
                            setRecurrenceDetails({}); // Clear details when type changes
                        }}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minWidth: '100px' }}
                    >
                        <option value="none">None</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>

                    {recurrence === 'weekly' && (
                        <select
                            value={recurrenceDetails.dayOfWeek !== undefined ? recurrenceDetails.dayOfWeek : ''}
                            onChange={e => setRecurrenceDetails({ ...recurrenceDetails, dayOfWeek: parseInt(e.target.value) })}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                            <option value="">Select Day</option>
                            <option value="1">Monday</option>
                            <option value="2">Tuesday</option>
                            <option value="3">Wednesday</option>
                            <option value="4">Thursday</option>
                            <option value="5">Friday</option>
                            <option value="6">Saturday</option>
                            <option value="0">Sunday</option>
                        </select>
                    )}

                    {recurrence === 'monthly' && (
                        <input
                            type="number"
                            value={recurrenceDetails.dayOfMonth || ''}
                            onChange={e => setRecurrenceDetails({ ...recurrenceDetails, dayOfMonth: parseInt(e.target.value) })}
                            placeholder="Day of Month (1-31)"
                            min="1"
                            max="31"
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '150px' }}
                        />
                    )}
                    {recurrence === 'yearly' && (
                        <>
                            <select
                                value={recurrenceDetails.month !== undefined ? recurrenceDetails.month : ''}
                                onChange={(e) => setRecurrenceDetails({ ...recurrenceDetails, month: parseInt(e.target.value) })}
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            >
                                <option value="">Select Month</option>
                                {[...Array(12).keys()].map(i => (
                                    <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={recurrenceDetails.dayOfMonth || ''}
                                onChange={(e) => setRecurrenceDetails({ ...recurrenceDetails, dayOfMonth: parseInt(e.target.value) })}
                                placeholder="Day of Month (1-31)"
                                min="1"
                                max="31"
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '150px' }}
                            />
                        </>
                    )}
                </div>

                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Add a detailed description/notes (Markdown supported)..."
                    rows="3"
                    style={{
                        width: 'calc(100% - 16px)',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        resize: 'vertical'
                    }}
                />
                {/* Subtask input for adding new todo */}
                <div style={{ display: 'flex', gap: '5px', marginTop: '10px', borderTop: '1px solid #444', paddingTop: '10px' }}>
                    <input
                        type="text"
                        value={newSubtaskText}
                        onChange={(e) => setNewSubtaskText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubtask(); }}
                        placeholder="Add a subtask..."
                        style={{ flexGrow: 1, padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <button
                        onClick={handleAddSubtask}
                        style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#61dafb', color: 'black', cursor: 'pointer' }}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add Subtask
                    </button>
                </div>
                {subtasks.length > 0 && (
                    <div style={{ marginTop: '5px', marginLeft: '10px' }}>
                        <h4 style={{ margin: '5px 0', color: '#ccc' }}>Current Subtasks:</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {subtasks.map((subtask, index) => (
                                <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                                    <span style={{ marginRight: '5px', color: '#bbb' }}>{subtask.text}</span>
                                    <button
                                        onClick={() => setSubtasks(subtasks.filter((_, i) => i !== index))}
                                        style={{ background: 'none', border: 'none', color: '#f44336', cursor: 'pointer', padding: '0 5px' }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <button
                    onClick={addTodo}
                    style={{ padding: '10px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', marginTop: '15px' }}
                >
                    Add Todo
                </button>
            </div>
<div style={{
    textAlign: 'center',
    margin: '20px 0',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    // backgroundColor: '#f9f9f9'
}}>
    <h3 style={{ color: currentPomodoroPhase === 'work' ? '#28a745' : '#ffc107' }}>
        {currentPomodoroPhase === 'work' ? 'Work Time' :
         currentPomodoroPhase === 'short-break' ? 'Short Break' : 'Long Break'}
    </h3>
    <div style={{ fontSize: '3em', fontWeight: 'bold', margin: '10px 0', color: theme === 'dark' ? '#fff' : '#000' }}>

        {formatTime(minutes, seconds)}
    </div>

     {/* NEW: Input fields for setting durations */}
    <div style={{ marginBottom: '15px' }}>
        <label style={{ marginRight: '10px', color: theme === 'dark' ? '#fff' : '#000' }}>
            Work (min):
            <input
                type="number"
                min="1"
                value={userWorkMinutes}
                onChange={(e) => setUserWorkMinutes(parseInt(e.target.value) || 0)}
                disabled={isActive} // Disable inputs when timer is running
                style={{ width: '60px', marginLeft: '5px' }}
            />
        </label>
        <label style={{ marginRight: '10px', color: theme === 'dark' ? '#fff' : '#000' }}>
            Short Break (min):
            <input
                type="number"
                min="1"
                value={userBreakMinutes}
                onChange={(e) => setUserBreakMinutes(parseInt(e.target.value) || 0)}
                disabled={isActive}
                style={{ width: '60px', marginLeft: '5px' }}
            />
        </label>
        <label style={{ marginRight: '10px',color: theme === 'dark' ? '#fff' : '#000' }}>
            Long Break (min):
            <input
                type="number"
                min="1"
                value={userLongBreakMinutes}
                onChange={(e) => setUserLongBreakMinutes(parseInt(e.target.value) || 0)}
                disabled={isActive}
                style={{ width: '60px', marginLeft: '5px' }}
            />
        </label>
    </div>

    <div style={{ marginBottom: '10px', color: theme === 'dark' ? '#fff' : '#000' }}>
        Pomodoros completed: {pomodoroCount}
    </div>
    <div>
        <button onClick={startTimer} disabled={isActive} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Start
        </button>
        <button onClick={pauseTimer} disabled={!isActive} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Pause
        </button>
        <button onClick={resetTimer} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Reset
        </button>
    </div>
</div>

{/* Optional: Add an audio element for timer end sound */}
{/* <audio id="timer-end-sound" src="/path/to/your/notification-sound.mp3"></audio> */}
{/* Make sure you have a sound file in your public directory or serve it correctly */}


            {/* Filter and Sort Section */}
            {viewMode === 'all' && (
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    <label style={{ color: theme === 'dark' ? '#fff' : '#000' }}>Filter: </label>
                    <select
                        value={filter}
                        onChange={handleFilterChange}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="all">All (Non-Archived)</option>
                        <option value="completed">Completed</option>
                        <option value="incomplete">Incomplete</option>
                        <option value="priority-high">High Priority</option>
                        <option value="priority-medium">Medium Priority</option>
                        <option value="priority-low">Low Priority</option>
                        <option value="tag">Filter by Tag</option>
                        <option value="archived">Archived</option>
                    </select>

                    {filter === 'tag' && (
                        <input
                            type="text"
                            placeholder="Enter tag to filter"
                            value={filterTagText}
                            onChange={handleTagFilterChange}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                    )}

                    <label style={{ marginLeft: '20px', color: theme === 'dark' ? '#fff' : '#000' }}>Due Date: </label>
                     <select
        id="dateFilter"
        value={dateFilter} // Binds the dropdown's value to your dateFilter state
        onChange={(e) => setDateFilter(e.target.value)} // Updates the state when an option is selected
        className="date-filter-dropdown" // Add a class for styling if needed
    >
        <option value="all">Any date</option>
        <option value="overdue">Overdue</option>
        <option value="today">Today</option>
        <option value="due-this-week">This Week</option>
        <option value="upcoming-7-days">Upcoming 7 Days</option>
        <option value="due-this-month">This Month</option>
        <option value="other-dates">Any Other</option>
        {/* If you want a "Grouped View" that shows all categories: */}
        {/* <option value="grouped">Grouped View</option> */}
    </select>


                    <label style={{ marginLeft: '20px', color: theme === 'dark' ? '#eee' : '#000' }}>Sort By: </label>
                    <select
                        value={sortOption}
                        onChange={e => setSortOption(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="creation-date-asc">Creation Date (Asc)</option>
                        <option value="creation-date-desc">Creation Date (Desc)</option>
                        <option value="due-date-asc">Due Date (Asc)</option>
                        <option value="due-date-desc">Due Date (Desc)</option>
                        <option value="priority-asc">Priority (Asc)</option>
                        <option value="priority-desc">Priority (Desc)</option>
                    </select>
                </div>
            )}


            <button
                onClick={clearCompletedTodos}
                style={{ marginBottom: '20px', padding: '10px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer', backgroundColor: '#f44336', color: 'white' }}
            >
                Clear Completed
            </button>

            {/* Dnd-Kit Context for Drag and Drop */}
            
                {isDragAndDropEnabled ? (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}   
            >
                {!isLoading && realTodos.length === 0 ? (
  <p style={{
  color: '#ccc',
  fontSize: '18px',
  marginTop: '40px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px'
}}>
  <span style={{ fontSize: '48px' }}>📭</span>
  {getEmptyMessage()}
 
  <button onClick={clearAllFilters} style={{
  backgroundColor: '#61dafb',
  color: '#000',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '10px'
}}>
  Clear Filters
</button>
{/* <button onClick={() => toast.success('Test Toast! 🎉', { theme: 'dark' })}>
  Show Test Toast
</button> */}




</p>

) : (
                <SortableContext
                
                    id="todos"
                    // IMPORTANT: SortableContext items should only be the sortable todos.
                    // Filter out headers if they exist in displayedTodos before mapping their IDs.
                    items={displayedTodos.filter(item => item.type !== 'header').map(item => item._id)}
                >
                   
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        
                        {displayedTodos.map((item) => {
                            if (item.type === 'header') {
                                return (
                                    <li key={item.id} style={{
                                        marginTop: '20px',
                                        marginBottom: '10px',
                                        fontSize: '1.2em',
                                        fontWeight: 'bold',
                                        color: '#61dafb',
                                        borderBottom: '1px solid #61dafb',
                                        paddingBottom: '5px'
                                    }}>
                                        {item.name}
                                    </li>
                                );
                            } else {
                                // Render SortableItem for actual todo items when DND is enabled
                                // Ensure all necessary props are passed to SortableItem
                                const hasSubtasks = item.subtasks && item.subtasks.length > 0;
                                const hasUncompletedSubtasks = hasSubtasks && item.subtasks.some(subtask => !subtask.completed);
                                const isMainTodoCheckboxDisabled = hasUncompletedSubtasks;

                                return (
                                    <SortableItem
                                        key={item._id}
                                        id={item._id}
                                        todo={item}
                                        getPriorityColor={getPriorityColor}
                                        displayDate={displayDate}
                                        startEdit={startEdit}
                                        deleteTodo={deleteTodo}
                                        toggleComplete={toggleComplete}
                                        editingId={editingId}
                                        togglePin={togglePin}
                                        editText={editText}
                                        handleEditChange={handleEditChange}
                                        editPriority={editPriority}
                                        handleEditPriorityChange={handleEditPriorityChange}
                                        editDueDate={editDueDate}
                                        handleEditDueDateChange={handleEditDueDateChange}
                                        editingTagsInput={editingTagsInput}
                                        setEditingTagsInput={setEditingTagsInput}
                                        editReminderTime={editReminderTime}
                                        handleEditReminderTimeChange={handleEditReminderTimeChange}
                                        editDescription={editDescription}
                                        handleEditDescriptionChange={handleEditDescriptionChange}
                                        setEditingId={setEditingId}
                                        expandedDescriptionId={expandedDescriptionId}
                                        setExpandedDescriptionId={setExpandedDescriptionId}
                                        editSubtasks={editSubtasks}
                                        handleEditSubtaskTextChange={handleEditSubtaskTextChange}
                                        handleEditSubtaskToggle={handleEditSubtaskToggle}
                                        handleAddEditSubtask={handleAddEditSubtask}
                                        archiveTodo={archiveTodo}
                                        handleRemoveSubtask={handleRemoveSubtask}
                                        editingNewSubtaskText={editingNewSubtaskText}
                                        setEditingNewSubtaskText={setEditingNewSubtaskText}
                                        saveEdit={saveEdit}
                                        toggleSubtaskCompleteDirectly={toggleSubtaskCompleteDirectly}
                                        isMainTodoCheckboxDisabled={isMainTodoCheckboxDisabled}
                                        editRecurrence={editRecurrence}
                                        setEditRecurrence={setEditRecurrence}
                                        editRecurrenceDetails={editRecurrenceDetails}
                                        setEditRecurrenceDetails={setEditRecurrenceDetails}
                                        // Add any other props you might be passing
                                    />
                                );
                            }
                        })}
                    </ul>

                </SortableContext>
)}
            </DndContext>
            
        // ... (Your code for isDragAndDropEnabled ? (...) before the else block) ...

        // ... (Your code before the else block) ...

        // ... (Your code before the else block) ...

        ) : (
            // ELSE: Dnd is NOT enabled (dateFilter not 'all' OR sortOption not 'default')
            // Render the list normally, WITHOUT DndContext and SortableContext.
            // This block MUST replicate all visual and functional aspects of a todo item
            // that are present in the SortableItem, especially editing.
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {displayedTodos.map((item) => {
                    if (item.type === 'header') {
                        return (
                            <li key={item.id} style={{
                                marginTop: '20px',
                                marginBottom: '10px',
                                fontSize: '1.2em',
                                fontWeight: 'bold',
                                color: '#61dafb',
                                borderBottom: '1px solid #61dafb',
                                paddingBottom: '5px'
                            }}>
                                <h3>{item.name}</h3>
                            </li>
                        );
                    } else {
                        const isEditing = editingId === item._id;
                        const hasSubtasks = item.subtasks && item.subtasks.length > 0;
                        const hasUncompletedSubtasks = hasSubtasks && item.subtasks.some(subtask => !subtask.completed);
                        const isMainTodoCheckboxDisabled = hasUncompletedSubtasks;

                        console.log(`Rendering todo ${item._id}: isEditing=${isEditing}, current editingId=${editingId}`); // Debugging log

                        return (
                            <li key={item._id} className="todo-card" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                padding: '10px',
                                borderBottom: '1px solid #eee',
                                // backgroundColor: '#fff',
                                // color: '#333',
                                marginBottom: '5px',
                                borderRadius: '5px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            }}>
                                {isEditing ? (
                                    // Render edit form
                                    <div style={{ width: '100%'  }}>
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={handleEditChange}
                                            style={{ width: 'calc(100% - 20px)', padding: '8px', marginBottom: '5px' }}
                                        />
                                        <select
                                            value={editPriority}
                                            onChange={handleEditPriorityChange}
                                            style={{ padding: '8px', marginBottom: '5px', width: '100%' }}
                                        >
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                        <input
                                            type="date"
                                            value={editDueDate}
                                            onChange={handleEditDueDateChange}
                                            style={{ padding: '8px', marginBottom: '5px', width: '100%' }}
                                        />
                                        <input
                                            type="datetime-local"
                                            value={editReminderTime}
                                            onChange={handleEditReminderTimeChange}
                                            style={{ padding: '8px', marginBottom: '5px', width: '100%' }}
                                        />
                                        <textarea
                                            value={editDescription}
                                            onChange={handleEditDescriptionChange}
                                            placeholder="Description"
                                            rows="3"
                                            style={{ width: 'calc(100% - 20px)', padding: '8px', marginBottom: '5px' }}
                                        ></textarea>

                                        {/* Tags Input */}
                                        <input
                                            type="text"
                                            value={editingTagsInput}
                                            onChange={(e) => setEditingTagsInput(e.target.value)}
                                            placeholder="Add tags (comma-separated)"
                                            style={{ width: 'calc(100% - 20px)', padding: '8px', marginBottom: '5px' }}
                                        />

                                        {/* Subtasks Section */}
                                        <div style={{ width: '100%', marginBottom: '10px', border: '1px solid #eee', padding: '10px', borderRadius: '5px' }}>
                                            <h4>Subtasks</h4>
                                            {editSubtasks.map((subtask, index) => (
                                                <div key={subtask._id || index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={subtask.completed}
                                                        onChange={() => handleEditSubtaskToggle(index)}
                                                        style={{ marginRight: '5px' }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={subtask.text}
                                                        onChange={(e) => handleEditSubtaskTextChange(index, e.target.value)}
                                                        style={{ flexGrow: 1, padding: '5px', marginRight: '5px' }}
                                                    />
                                                    <button onClick={() => handleRemoveSubtask(index)} style={{ padding: '5px 8px', fontSize: '0.8em' }}>Remove</button>
                                                </div>
                                            ))}
                                            <div style={{ display: 'flex', marginTop: '10px' }}>
                                                <input
                                                    type="text"
                                                    value={editingNewSubtaskText}
                                                    onChange={(e) => setEditingNewSubtaskText(e.target.value)}
                                                    placeholder="New subtask"
                                                    style={{ flexGrow: 1, padding: '8px', marginRight: '5px' }}
                                                />
                                                <button onClick={handleAddEditSubtask} style={{ padding: '8px 12px' }}>Add Subtask</button>
                                            </div>
                                        </div>

                                        {/* Recurrence Section */}
                                        <div style={{ width: '100%', marginBottom: '10px', border: '1px solid #eee', padding: '10px', borderRadius: '5px' }}>
                                            <h4>Recurrence</h4>
                                            <select
                                                value={editRecurrence}
                                                onChange={(e) => {
                                                    const newRecurrenceType = e.target.value;
                                                    setEditRecurrence(newRecurrenceType);
                                                    // Reset details if recurrence type changes to none, or set defaults for new type
                                                    if (newRecurrenceType === 'none') {
                                                        setEditRecurrenceDetails({});
                                                    } else if (newRecurrenceType === 'weekly') {
                                                        setEditRecurrenceDetails(prev => ({ ...prev, dayOfWeek: prev.dayOfWeek || [] }));
                                                    } else if (newRecurrenceType === 'monthly') {
                                                        setEditRecurrenceDetails(prev => ({ ...prev, dayOfMonth: prev.dayOfMonth || 1 })); // Default to 1st of month
                                                    }
                                                    // Add other types if needed
                                                }}
                                                style={{ padding: '8px', marginBottom: '5px', width: '100%' }}
                                            >
                                                <option value="none">None</option>
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                                <option value="yearly">Yearly</option>
                                            </select>

                                            {/* Conditional recurrence details based on type */}
                                            {editRecurrence === 'weekly' && (
        <div style={{ marginTop: '10px' }}>
            <label>Repeat on:</label>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <label key={day} style={{ marginLeft: '10px' }}>
                    <input
                        type="checkbox"
                        // --- FIX APPLIED HERE ---
                        checked={Array.isArray(editRecurrenceDetails.dayOfWeek) && editRecurrenceDetails.dayOfWeek.includes(index)}
                        // --- END FIX ---
                        onChange={(e) => {
                            const currentDays = Array.isArray(editRecurrenceDetails.dayOfWeek) ? editRecurrenceDetails.dayOfWeek : []; // Defensive check
                            const newDays = e.target.checked
                                ? [...currentDays, index].sort((a,b) => a-b)
                                : currentDays.filter(d => d !== index);
                            setEditRecurrenceDetails(prev => ({ ...prev, dayOfWeek: newDays }));
                        }}
                    />
                    {day}
                </label>
            ))}
        </div>
    )}
                                            {editRecurrence === 'monthly' && (
                                                <div style={{ marginTop: '10px' }}>
                                                    <label>Repeat on day of month:</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="31"
                                                        value={editRecurrenceDetails?.dayOfMonth || ''}
                                                        onChange={(e) => setEditRecurrenceDetails(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) || undefined }))}
                                                        style={{ marginLeft: '5px', padding: '5px', width: '80px' }}
                                                    />
                                                </div>
                                            )}
                                            {/* You can add more specific inputs for other recurrence types (e.g., yearly) */}
                                            {editRecurrence === 'yearly' && (
                                                <div style={{ marginTop: '10px' }}>
                                                    <label>Repeat on:</label>
                                                    <select
                                                        value={editRecurrenceDetails?.month !== undefined ? editRecurrenceDetails.month : ''}
                                                        onChange={(e) => setEditRecurrenceDetails(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                                                        style={{ marginLeft: '5px', padding: '5px', width: '120px' }}
                                                    >
                                                        <option value="">Select Month</option>
                                                        {Array.from({ length: 12 }, (_, i) => i).map(monthIndex => (
                                                            <option key={monthIndex} value={monthIndex}>
                                                                {new Date(0, monthIndex).toLocaleString('default', { month: 'long' })}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <label style={{ marginLeft: '10px' }}>Day:</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="31"
                                                        value={editRecurrenceDetails?.dayOfMonth || ''}
                                                        onChange={(e) => setEditRecurrenceDetails(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) || undefined }))}
                                                        style={{ marginLeft: '5px', padding: '5px', width: '80px' }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <button onClick={saveEdit} style={{ marginRight: '10px', padding: '8px 12px' }}>Save</button>
                                            <button onClick={() => setEditingId(null)} style={{ padding: '8px 12px' }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    // Render display mode (this part remains largely the same)
                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <input
                                            type="checkbox"
                                            checked={item.completed}
                                            onChange={() => {
                                                console.log('Main task checkbox clicked. Item ID:', item);
                                                toggleComplete(item);
                                            }}
                                            disabled={isMainTodoCheckboxDisabled}
                                        />
                                        <span
                                            style={{
                                                textDecoration: item.completed ? 'line-through' : 'none',
                                                color: getPriorityColor(item.priority),
                                                marginLeft: '10px',
                                                flexGrow: 1
                                            }}
                                        >
                                            {item.text}
                                            {item.dueDate && (
                                                <span style={{ fontSize: '0.8em', marginLeft: '10px', color: '#888' }}>
                                                    {' '} - Due: {displayDate(item.dueDate)}
                                                </span>
                                            )}
                                            {item.reminderTime && (
                                                <span style={{ fontSize: '0.8em', marginLeft: '10px', color: '#888' }}>
                                                    {' '} - Reminder: {new Date(item.reminderTime).toLocaleString()}
                                                </span>
                                            )}
                                            {item.description && (
                                                <div style={{ fontSize: '0.9em', color: '#555', marginTop: '5px' }}>
                                                    {item.description}
                                                </div>
                                            )}
                                            {item.tags && item.tags.length > 0 && (
                                                <div style={{ fontSize: '0.8em', color: '#777', marginTop: '5px' }}>
                                                    Tags: {item.tags.join(', ')}
                                                </div>
                                            )}
                                            {item.subtasks && item.subtasks.length > 0 && (
                                                <div style={{ fontSize: '0.9em', color: '#555', marginTop: '5px' }}>
                                                    Subtasks:
                                                    <ul>
                                                        {item.subtasks.map((subtask) => (
                                                            <li key={subtask._id || subtask.text}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={subtask.completed}
                                                                    onChange={() => toggleSubtaskCompleteDirectly(item._id, subtask._id)}
                                                                />
                                                                <span style={{ textDecoration: subtask.completed ? 'line-through' : 'none' }}>
                                                                    {subtask.text}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {/* NEW: Display recurrence info for non-DND path */}
                                    {item.recurrence && item.recurrence !== 'none' && (
                                        <div style={{ fontSize: '0.8em', color: '#007bff', marginTop: '5px' }}>
                                            Repeats: {
                                                typeof item.recurrence === 'object' && item.recurrence.type
                                                    ? item.recurrence.type // If recurrence is an object with a type
                                                    : item.recurrence      // If recurrence is directly the type string
                                            }
                                            {/* Added optional chaining and Array.isArray checks */}
                                            {/* For Weekly */}
                                            {
                                            (typeof item.recurrence === 'object' && item.recurrence.type === 'weekly') ||
                                            (typeof item.recurrence === 'string' && item.recurrence === 'weekly')
                                            ? (
                                                Array.isArray(item.recurrenceDetails?.dayOfWeek) &&
                                                item.recurrenceDetails.dayOfWeek.length > 0 &&
                                                ` on ${item.recurrenceDetails.dayOfWeek.map(dayIndex => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex]).join(', ')}`
                                            ) : null
                                            }
                                            
                                            {/* For Monthly */}
                                            {
                                            (typeof item.recurrence === 'object' && item.recurrence.type === 'monthly') ||
                                            (typeof item.recurrence === 'string' && item.recurrence === 'monthly')
                                            ? (
                                                item.recurrenceDetails?.dayOfMonth &&
                                                ` on day ${item.recurrenceDetails.dayOfMonth}`
                                            ) : null
                                            }
                                            
                                            {/* For Yearly */}
                                            {
                                            (typeof item.recurrence === 'object' && item.recurrence.type === 'yearly') ||
                                            (typeof item.recurrence === 'string' && item.recurrence === 'yearly')
                                            ? (
                                                item.recurrenceDetails?.month !== undefined && item.recurrenceDetails?.dayOfMonth !== undefined &&
                                                ` on ${new Date(0, item.recurrenceDetails.month).toLocaleString('default', { month: 'long' })} ${item.recurrenceDetails.dayOfMonth}`
                                            ) : null
                                            }
                                        </div>
                                    )}
                                        </span>
                                        <div style={{ marginLeft: 'auto' }}>
                                            <button
                                                onClick={() => {
                                                    console.log('Edit button clicked for ID:', item._id);
                                                    startEdit(item);
                                                }}
                                                style={{ marginRight: '5px', padding: '8px 12px' }}
                                            >
                                                Edit
                                            </button>
                                            <button onClick={() => deleteTodo(item._id)} style={{ padding: '8px 12px' }}>Delete</button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        );
                    }
                })}
            </ul>
        )}
        </>
    )}
    </div>
        );
    }

    export default App;