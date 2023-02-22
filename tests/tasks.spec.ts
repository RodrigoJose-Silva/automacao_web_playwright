import { test, expect } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'


test('Deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
    const task: TaskModel = {
        name: 'Task automated - Ler um livro de TypeScript',
        is_done: false
    }

    await deleteTaskByHelper(request, task.name)
    await page.goto('http://localhost:3000')

    const inputTaskName = page.locator('#newTask')
    await inputTaskName.fill(task.name)

    const submitNewTask = page.locator('button[type=submit]')
    await submitNewTask.click()

    const target = page.locator(`css=.task-item p >> text=${task.name}`)
    await expect(target).toBeVisible
})

test('Não deve permitir cadastro de tarefa duplicada', async ({ page, request }) => {
    const task: TaskModel = {
        name: 'Task automated - Ler um livro de JavaScript',
        is_done: false
    }
    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    await page.goto('http://localhost:3000')

    const inputTaskName = page.locator('#newTask')
    await inputTaskName.fill(task.name)

    const submitNewTask = page.locator('button[type=submit]')
    await submitNewTask.click()

    const target = page.locator('#swal2-html-container')
    await expect(target).toHaveText('Task already exists!')
})