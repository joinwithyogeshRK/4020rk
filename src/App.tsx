import { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import TodoApp from './components/TodoApp';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="todo-theme">
      <TodoApp />
    </ThemeProvider>
  );
}

export default App;
