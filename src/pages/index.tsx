import { CreateTodoForm } from '@/client/components/CreateTodoForm'
import { TodoList } from '@/client/components/TodoList'
import { useState } from 'react'
import * as Tab from '@radix-ui/react-tabs'

/**
 * QUESTION 6:
 * -----------
 * Implement quick filter/tab feature so that we can quickly find todos with
 * different statuses ("pending", "completed", or both). The UI should look like
 * the design on Figma.
 *
 * NOTE:
 *  - For this question, you must use RadixUI Tabs component. Its Documentation
 *  is linked below.
 *
 * Documentation references:
 *  - https://www.radix-ui.com/docs/primitives/components/tabs
 */

const Index = () => {
  const statusTodos = ['all', 'pending', 'completed']
  const [statusSelected, setStatusSelected] = useState('all')
  return (
    <main className="mx-auto w-[480px] pt-12">
      <div className="rounded-12 bg-white p-8 shadow-sm">
        <h1 className="text-center text-4xl font-extrabold text-gray-900">
          Todo App
        </h1>
        {/* Question 6: Tab feature for quick access to todo list by status
         */}
        <Tab.Root
          className="pt-10"
          value={statusSelected}
          onValueChange={(value: string) => setStatusSelected(value)}
        >
          <Tab.List className="flex items-center gap-x-2">
            {statusTodos.map((status, i) => (
              <Tab.Trigger
                className={`rounded-full border px-6 py-3 text-center text-sm font-bold capitalize leading-5 ${
                  statusSelected === status
                    ? 'border-gray-700 bg-gray-700 text-white'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
                key={i}
                value={status}
              >
                {status}
              </Tab.Trigger>
            ))}
          </Tab.List>
        </Tab.Root>
        <div className="pt-10">
          <TodoList status={statusSelected} />
        </div>

        <div className="pt-10">
          <CreateTodoForm />
        </div>
      </div>
    </main>
  )
}

export default Index
