import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getItemById, getUserItems } from "@/services/item.service"
import { TradeProposalForm } from "./trade-proposal-form"

export default async function ProponerTruequePage(props: {
  params: Promise<{ itemId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const { itemId } = await props.params
  const requestedItem = await getItemById(itemId)

  if (!requestedItem || requestedItem.status !== "AVAILABLE") {
    notFound()
  }

  // Don't allow proposing a trade on your own item
  if (requestedItem.userId === session.user.id) {
    redirect(`/item/${itemId}`)
  }

  // Get the current user's available items
  const userItems = await getUserItems(session.user.id, "AVAILABLE")

  return (
    <TradeProposalForm
      requestedItem={{
        id: requestedItem.id,
        title: requestedItem.title,
        images: requestedItem.images,
        category: requestedItem.category,
        condition: requestedItem.condition,
        user: {
          id: requestedItem.user.id,
          name: requestedItem.user.name,
        },
      }}
      userItems={userItems.map((item) => ({
        id: item.id,
        title: item.title,
        images: item.images,
        category: item.category,
        condition: item.condition,
      }))}
    />
  )
}
