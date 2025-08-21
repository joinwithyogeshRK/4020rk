import { useState, useEffect } from 'react';
import { Check, Plus, Trash2,   } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

type FilterType = 'all' | 'active' | 'completed';

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
    }
    return [];
  });
  
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
  
  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
  };
  
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const updatedTodo = { ...todo, completed: !todo.completed };
        
        // Add animation class to the element
        if (updatedTodo.completed) {
          const element = document.getElementById(`todo-${id}`);
          if (element) {
            element.classList.add('animate-task-complete');
            setTimeout(() => {
              element.classList.remove('animate-task-complete');
            }, 300);
          }
        }
        
        return updatedTodo;
      }
      return todo;
    }));
  };
  
  const deleteTodo = (id: string) => {
    const element = document.getElementById(`todo-${id}`);
    if (element) {
      element.classList.add('animate-task-delete');
      setTimeout(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      }, 300);
    } else {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };
  
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };
  
  return (
    <div className="min-h-screen bg-surface text-surface-foreground">
      <div className="todo-container">
        <div className="todo-header">
          <h1 className="text-2xl font-bold text-primary">Simple Todo</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <div className="todo-input-container">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            className="todo-input"
          />
          <Button 
            onClick={addTodo} 
            className="todo-add-button"
            disabled={newTodo.trim() === ''}
          >
            <Plus className="h-5 w-5 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="todo-filters">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setFilter('all')} 
            className={`todo-filter-button ${filter === 'all' ? 'todo-filter-button-active' : ''}`}
          >
            All
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setFilter('active')} 
            className={`todo-filter-button ${filter === 'active' ? 'todo-filter-button-active' : ''}`}
          >
            Active
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setFilter('completed')} 
            className={`todo-filter-button ${filter === 'completed' ? 'todo-filter-button-active' : ''}`}
          >
            Completed
          </Button>
        </div>
        
        {filteredTodos.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {filter === 'all' 
              ? "You don't have any tasks yet. Add one above!" 
              : filter === 'active' 
                ? "You don't have any active tasks." 
                : "You don't have any completed tasks."}
          </div>
        ) : (
          <div className="todo-list">
            {filteredTodos.map(todo => (
              <div 
                key={todo.id} 
                id={`todo-${todo.id}`}
                className={`todo-item group ${todo.completed ? 'bg-muted/30' : ''}`}
              >
                <div className="flex items-center">
                  <Checkbox
                    id={`checkbox-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="todo-checkbox"
                  />
                </div>
                <label 
                  htmlFor={`checkbox-${todo.id}`}
                  className={`todo-text ${todo.completed ? 'todo-text-completed' : ''}`}
                >
                  {todo.text}
                </label>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteTodo(todo.id)}
                  className="todo-delete-button opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete todo"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {todos.length > 0 && (
          <div className="todo-footer mt-4">
            <span>{activeTodosCount} item{activeTodosCount !== 1 ? 's' : ''} left</span>
            {todos.some(todo => todo.completed) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCompleted}
                className="todo-clear-completed"
              >
                Clear completed
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
