import type { SVGProps } from 'react'

import * as Checkbox from '@radix-ui/react-checkbox'

import { api } from '@/utils/client/api'

import { useAutoAnimate } from '@formkit/auto-animate/react'

/**
 * QUESTION 3:
 * -----------
 * A todo has 2 statuses: "pending" and "completed"
 *  - "pending" state is represented by an unchecked checkbox
 *  - "completed" state is represented by a checked checkbox, darker background,
 *    and a line-through text
 *
 * We have 2 backend apis:
 *  - (1) `api.todo.getAll`       -> a query to get all todos
 *  - (2) `api.todoStatus.update` -> a mutation to update a todo's status
 *
 * Example usage for (1) is right below inside the TodoList component. For (2),
 * you can find similar usage (`api.todo.create`) in src/client/components/CreateTodoForm.tsx
 *
 * If you use VSCode as your editor , you should have intellisense for the apis'
 * input. If not, you can find their signatures in:
 *  - (1) src/server/api/routers/todo-router.ts
 *  - (2) src/server/api/routers/todo-status-router.ts
 *
 * Your tasks are:
 *  - Use TRPC to connect the todos' statuses to the backend apis
 *  - Style each todo item to reflect its status base on the design on Figma
 *
 * Documentation references:
 *  - https://trpc.io/docs/client/react/useQuery
 *  - https://trpc.io/docs/client/react/useMutation
 *
 *
 *
 *
 *
 * QUESTION 4:
 * -----------
 * Implement UI to delete a todo. The UI should look like the design on Figma
 *
 * The backend api to delete a todo is `api.todo.delete`. You can find the api
 * signature in src/server/api/routers/todo-router.ts
 *
 * NOTES:
 *  - Use the XMarkIcon component below for the delete icon button. Note that
 *  the icon button should be accessible
 *  - deleted todo should be removed from the UI without page refresh
 *
 * Documentation references:
 *  - https://www.sarasoueidan.com/blog/accessible-icon-buttons
 *
 *
 *
 *
 *
 * QUESTION 5:
 * -----------
 * Animate your todo list using @formkit/auto-animate package
 *
 * Documentation references:
 *  - https://auto-animate.formkit.com
 */

// Create type props for todo list
type TodoListProps = {
  status: string
}

export const TodoList = (props: TodoListProps) => {
  // Question 5: Animate your todo list using @formkit/auto-animate package
  const [list] = useAutoAnimate()

  const { data: todos = [] } = api.todo.getAll.useQuery({
    statuses:
      (props.status === 'all' && ['completed', 'pending']) ||
      ([props.status] as Array<'pending' | 'completed'>),
  })

  const statusContext = api.useContext()

  // Question 3: Update todo's status
  const { mutate: updateTodoStatus, isLoading: isUpdatingTodo } =
    api.todoStatus.update.useMutation({
      onSuccess: () => {
        statusContext.todo.getAll.refetch()
      },
    })

  // Question 4: Delete todo item
  const { mutate: deleteTodoItem, isLoading: isDeletingTodo } =
    api.todo.delete.useMutation({
      onSuccess: () => {
        statusContext.todo.getAll.refetch()
      },
    })

  // Question 3 + Question 4: Generic function to handle both status update and to-do deletion
  const handleTodoAction = (
    actionType: 'update' | 'delete',
    todoId: number,
    checked?: boolean | string
  ) => {
    if (
      (actionType === 'update' && !isUpdatingTodo) ||
      (actionType === 'delete' && !isDeletingTodo)
    ) {
      if (actionType === 'update') {
        const status = checked ? 'completed' : 'pending'
        updateTodoStatus({
          todoId,
          status,
        })
      } else if (actionType === 'delete') {
        deleteTodoItem({ id: todoId })
      }
    }
  }

  // Question 3: handleTodoAction function to update todo of state
  const handleChangeTodoStatus = (
    checked: boolean | string,
    todoId: number
  ) => {
    handleTodoAction('update', todoId, checked)
  }

  // Question 4: handleTodoAction function to delete todo item
  const handleDeleteTodoItem = (id: number) => {
    handleTodoAction('delete', id)
  }
  return (
    <ul className="grid grid-cols-1 gap-y-3" ref={list}>
      {todos.map((todo) => (
        <li key={todo.id}>
          <div
            className={`flex items-center justify-between rounded-12 border border-gray-200 px-4 py-3 shadow-sm	 ${
              todo.status === 'completed' && 'bg-grey-50'
            }`}
          >
            <div className="check-icon-section flex">
              <Checkbox.Root
                id={String(todo.id)}
                className=" flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
                checked={todo.status === 'completed'}
                onCheckedChange={(isChecked) =>
                  handleChangeTodoStatus(isChecked, todo.id)
                }
              >
                <Checkbox.Indicator>
                  <CheckIcon className="h-4 w-4 text-white" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label
                className={`block pl-3 font-medium text-gray-700 ${
                  todo.status === 'completed'
                    ? 'text-gray-500 line-through'
                    : ''
                }`}
                htmlFor={String(todo.id)}
              >
                {todo.body}
              </label>
            </div>
            <div className="remove-button-section">
              <button
                className="p-1"
                onClick={() => handleDeleteTodoItem(todo.id)}
              >
                <XMarkIcon className="h-7 w-7 text-gray-700" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
// Quesion 4: XMarkIcon and CheckIcon
const XMarkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
}
