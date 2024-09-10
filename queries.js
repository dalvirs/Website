import { HttpError } from 'wasp/server'

export const getInventories = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  return context.entities.Inventory.findMany({
    where: { userId: context.user.id },
    include: { items: true }
  })
}

export const getItems = async ({ inventoryId }, context) => {
  if (!context.user) { throw new HttpError(401) }

  const inventory = await context.entities.Inventory.findUnique({
    where: { id: inventoryId },
    select: { userId: true }
  });

  if (!inventory || inventory.userId !== context.user.id) {
    throw new HttpError(403, 'You do not have access to this inventory.');
  }

  return await context.entities.Item.findMany({
    where: { inventoryId }
  });
}
