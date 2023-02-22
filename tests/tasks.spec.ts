import { test } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks'


test('Deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
    const task: TaskModel = {
        name: 'Task automated - Ler um livro de TypeScript',
        is_done: false
    }

    await deleteTaskByHelper(request, task.name)
    const tasksPage: TasksPage = new TasksPage(page)
    await tasksPage.goHomePage()
    await tasksPage.create(task)
    await tasksPage.shouldHaveText(task.name)
})

test('Não deve permitir cadastro de tarefa duplicada', async ({ page, request }) => {
    const task: TaskModel = {
        name: 'Task automated - Ler um livro de JavaScript',
        is_done: false
    }

    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    const tasksPage: TasksPage = new TasksPage(page)
    await tasksPage.goHomePage()
    await tasksPage.create(task)
    await tasksPage.alertHaveText('Task already exists!')
})