import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#persist()
        })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search) {
        let data = this.#database[table] ?? []

        console.log('search', search)

        if (search) {
            data = data.filter(row => {
                console.log(Object.entries(search))
                return Object.entries(search).some(([key, value]) => {

                    console.log('row', row[key])
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }

        return data
    }

    insert(table, data) {
        const date = new Date()
        data.created_at = date
        data.updated_At = null
        data.completed_at = null


        if (Array.isArray(this.#database[table])) {

            this.#database[table].push(data)

        } else {

            this.#database[table] = [data]
        }

        this.#persist();
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }


    }

    update(table, id, data) {
        const date = new Date()
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        function verifyInvalideAtribute(object) {
            for (let key in object) {
                if (object[key] === null | object[key] === undefined) {
                    delete object[key]
                }
            }
        }

        verifyInvalideAtribute(data)
        data.updated_At = date

        try {
            if (rowIndex > -1) {
                this.#database[table][rowIndex] = { ...this.#database[table][rowIndex], ...data }
                this.#persist()
            } else {
                throw new Error("Id não encontrado")
            }
        } catch (error) {

            throw new Error(error.message)
        }
    }


    completeTask(table, id) {
        const date = new Date()
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        
        try {
            if (rowIndex > -1) {
                this.#database[table][rowIndex].completed_at = date
                this.#database[table][rowIndex].updated_At = date
                this.#persist()
            } else {
                throw new Error("Id não encontrado")
            }
        } catch (error) {

            throw new Error(error.message)
        }
    }
}


