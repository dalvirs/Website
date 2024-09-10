import { HttpError } from 'wasp/server'

export const createInventory = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const newInventory = await context.entities.Inventory.create({
    data: {
      name: args.name,
      userId: context.user.id
    }
  });

  return newInventory;
}

export const addItem = async ({ inventoryId, name, quantity }, context) => {
  if (!context.user) { throw new HttpError(401) }
  const inventory = await context.entities.Inventory.findUnique({
    where: { id: inventoryId }
  });
  if (inventory.userId !== context.user.id) { throw new HttpError(403) }
  return context.entities.Item.create({
    data: {
      name,
      quantity,
      inventoryId
    }
  });
}

export const updateItemQuantity = async ({ itemId, newQuantity }, context) => {
  if (!context.user) { throw new HttpError(401) }

  const item = await context.entities.Item.findUnique({
    where: { id: itemId }
  });
  if (!item) { throw new HttpError(404, 'Item not found') }

  const inventory = await context.entities.Inventory.findUnique({
    where: { id: item.inventoryId }
  });
  if (inventory.userId !== context.user.id) { throw new HttpError(403) }

  return context.entities.Item.update({
    where: { id: itemId },
    data: { quantity: newQuantity }
  });
}
