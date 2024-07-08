import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"


const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: title,
                description: description,
                completed_at: completed_at,
                created_at: created_at,
                updated_at: updated_at
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {

            const { title, description } = req.body

            const task = {
                id: randomUUID(),
                title: title,
                description: description,
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const { id } = req.params

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const { id } = req.params
            const [{ title, description }] = req.body

            try {
                database.update('tasks', id, {
                    title, description
                })

                return res.writeHead(204).end()

            } catch (error) {

                return res.writeHead(404).end(error.message)
            }
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            try {
                database.completeTask('tasks', id)

                return res.writeHead(204).end()

            } catch (error) {

                return res.writeHead(404).end(error.message)
            }

        }
    }

]