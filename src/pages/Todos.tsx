import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export default function Todos() {
  const [todos, setTodos] = useState<any[]>([])

  useEffect(() => {
    async function getTodos() {
      const { data: todos } = await supabase.from('todos').select()

      if (todos) {
        setTodos(todos)
      }
    }

    getTodos()
  }, [])

  return (
    <div className="max-w-xl mx-auto py-6">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Todos
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Live data retrieved from your Supabase table.
        </p>
      </div>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 px-5 py-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-700/60 transition-colors"
          >
            <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-purple-600 dark:bg-purple-400"></span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">
              {todo.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
