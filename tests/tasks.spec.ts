import { test, expect } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks'
import data from './fixtures/tasks.json'

let tasksPage: TasksPage

test.beforeEach(({ page }) => {
    tasksPage = new TasksPage(page)
})

test.describe('Cadastro', () => {
    test('Deve poder cadastrar uma nova tarefa', async ({ request }) => {
        const task = data.success as TaskModel

        await deleteTaskByHelper(request, task.name)

        await tasksPage.goHomePage()
        await tasksPage.create(task)
        await tasksPage.shouldHaveText(task.name)
    })

    test('Não deve permitir cadastro de tarefa duplicada', async ({ request }) => {
        const task = data.duplicate as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await tasksPage.goHomePage()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')
    })

    test('Campo obrigaório', async () => {
        const task = data.required as TaskModel

        await tasksPage.goHomePage()
        await tasksPage.create(task)

        const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMessage).toEqual('This is a required field')
    })
})

test.describe('Atualização', () => {
    test('Deve concluir uma tarefa', async ({ request }) => {
        const task = data.update as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await tasksPage.goHomePage()
        await tasksPage.toggle(task.name)

        await tasksPage.shouldBeDone(task.name)
    })
})

test.describe('Exclusão', () => {
    test('Deve excluir uma tarefa', async ({ request }) => {
        const task = data.update as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await tasksPage.goHomePage()
        await tasksPage.remove(task.name)

        await tasksPage.shouldNotExist(task.name)
    })
})