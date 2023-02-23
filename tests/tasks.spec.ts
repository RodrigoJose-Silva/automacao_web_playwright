import { test, expect } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks'
import data from './fixtures/tasks.json'

test.describe('Cadastro', () => {
    test('Deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
        const task = data.success as TaskModel

        await deleteTaskByHelper(request, task.name)
        const tasksPage: TasksPage = new TasksPage(page)
        await tasksPage.goHomePage()
        await tasksPage.create(task)
        await tasksPage.shouldHaveText(task.name)
    })

    test('Não deve permitir cadastro de tarefa duplicada', async ({ page, request }) => {
        const task = data.duplicate as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        const tasksPage: TasksPage = new TasksPage(page)
        await tasksPage.goHomePage()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')
    })

    test('Campo obrigaório', async ({ page }) => {
        const task = data.required as TaskModel

        const tasksPage: TasksPage = new TasksPage(page)
        await tasksPage.goHomePage()
        await tasksPage.create(task)

        const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMessage).toEqual('This is a required field')
    })
})

test.describe('Atualização', () => {
    test('Deve concluir uma tarefa', async ({ page, request }) => {
        const task = data.update as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        const tasksPage: TasksPage = new TasksPage(page)
        await tasksPage.goHomePage()
        await tasksPage.toggle(task.name)

        await tasksPage.shouldBeDone(task.name)
    })  
})

test.describe('Exclusão', () => {
    test('Deve excluir uma tarefa', async ({ page, request }) => {
        const task = data.update as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        const tasksPage: TasksPage = new TasksPage(page)
        await tasksPage.goHomePage()
        await tasksPage.remove(task.name)

        await tasksPage.shouldNotExist(task.name)
    })  
})