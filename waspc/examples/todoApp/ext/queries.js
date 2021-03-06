import HttpError from '@wasp/core/HttpError.js'

export const getTasks = async (args, context) => {
  if (!context.user) {
    throw new HttpError(403)
  }
  console.log('user who made the query: ', context.user)

  const Task = context.entities.Task
  const tasks = await Task.findMany(
    { where: { user: { id: context.user.id } } }
  )
  return tasks
}

export const getTask = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(403)
  }

  const Task = context.entities.Task
  // NOTE(matija): we can't call findOne() with the specific user, so we have to fetch user first
  // and then manually check.
  const task = await Task.findOne({ where: { id }, include: { user: true } })
  if (!task) {
    throw new HttpError(404)
  }
  if (task.user.id !== context.user.id) {
    throw new HttpError(403)
  }

  return task
}
