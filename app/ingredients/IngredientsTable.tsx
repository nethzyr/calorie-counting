"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type SelectIngredient } from "@/server/db/schema"
import IngredientDialog from "./IngredientDialog"
import { api } from "@/trpc/react"

type variant = "default" | "add" | "remove"

export default function IngredientsTable({
  ingredients,
  variant = "default",
  onAdd,
  onRemove,
}: {
  ingredients: SelectIngredient[]
  variant?: variant
  onAdd?: (ingredient: SelectIngredient) => void
  onRemove?: (ingredient: SelectIngredient) => void
}) {
  const utils = api.useUtils()
  const deleteIngredient = api.ingredient.delete.useMutation({
    onSuccess: async () => {
      await utils.ingredient.search.invalidate()
    },
  })

  return (
    <Table className="text-left">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Calories</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ingredients.map((ingredient) => (
          <TableRow key={ingredient.id}>
            <TableCell>{ingredient.id}</TableCell>
            <TableCell>{ingredient.name}</TableCell>
            <TableCell>{ingredient.calories?.toString()}</TableCell>
            <TableCell className="flex gap-4">
              <IngredientDialog ingredient={ingredient} />
              {variant === "default" && (
                <Button
                  variant="destructive"
                  disabled={deleteIngredient.isLoading}
                  onClick={() => {
                    deleteIngredient.mutate({ id: ingredient.id })
                  }}
                >
                  Delete
                </Button>
              )}
              {variant === "add" && (
                <Button
                  onClick={() => {
                    onAdd?.(ingredient)
                  }}
                >
                  Add
                </Button>
              )}
              {variant === "remove" && (
                <Button
                  onClick={() => {
                    onRemove?.(ingredient)
                  }}
                >
                  Remove
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
