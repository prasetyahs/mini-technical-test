import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

interface ApiResponse<T> {
    data: T;
    status: boolean;
    message: string;
}

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Fetch ToDos
    const fetchTodos = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch semua data dulu, filtering akan dilakukan di client side
            const response = await axios.get<ApiResponse<Todo[]>>(`${API_BASE_URL}/todos`);
            if (response.data.status) {
                setTodos(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Gagal mengambil data dari server');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodoTitle.trim()) return;

        setLoading(true);
        try {
            const response = await axios.post<ApiResponse<Todo>>(`${API_BASE_URL}/todos`, {
                title: newTodoTitle,
            });

            if (response.data.status) {
                setTodos((prev) => [...prev, response.data.data]);
                setNewTodoTitle('');
            } else {
                setError(response.data.message);
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Gagal menambahkan data';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTodo = async (id: string) => {
        // Optimistic Update: update UI dulu biar responsif
        const originalTodos = [...todos];
        const updatedTodos = todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        setTodos(updatedTodos);

        try {
            const response = await axios.patch<ApiResponse<Todo>>(`${API_BASE_URL}/todos/${id}`);
            if (!response.data.status) {
                // Revert jika gagal
                setTodos(originalTodos);
                setError(response.data.message);
            }
        } catch (err) {
            setTodos(originalTodos);
            setError('Gagal mengupdate status');
        }
    };

    // Client-side filtering logic
    const filteredTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <h1>Todo App</h1>

            <div className="card">
                {/* Error Alert */}
                {error && <div className="error-alert">{error}</div>}

                {/* Add Todo Form */}
                <form onSubmit={handleAddTodo} className="input-group">
                    <input
                        type="text"
                        placeholder="Tambah todo baru..."
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading}>
                        Add
                    </button>
                </form>

                {/* Search Input */}
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Cari todo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Loading State */}
                {loading && <div className="loading">Loading...</div>}

                {/* Todo Table */}
                {!loading && filteredTodos.length === 0 ? (
                    <p className="empty-state">Tidak ada data todo.</p>
                ) : (
                    <table className="todo-table">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Title</th>
                                <th style={{ width: '100px' }}>Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTodos.map((todo, index) => (
                                <tr key={todo.id} className={todo.completed ? 'completed' : ''}>
                                    <td>{index + 1}</td>
                                    <td>{todo.title}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => handleToggleTodo(todo.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default App;
