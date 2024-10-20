import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { ChatbotUIContext } from "@/context/context"
import { updateChat } from "@/db/chats"
import { Tables } from "@/supabase/types"
import { IconStar, IconStarFilled } from "@tabler/icons-react"
import { FC, useContext, useRef, useState } from "react"

interface FavoriteChatProps {
  chat: Tables<"chats">
}

export const FavoriteChat: FC<FavoriteChatProps> = ({ chat }) => {
  const { setChats, folders } = useContext(ChatbotUIContext)

  const favoriteFolder = folders.find(folder => folder.name === "Favorite")
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [showFavoriteDialog, setShowFavoriteDialog] = useState(false)
  const [isFavorite, setIsFavorite] = useState(
    chat.folder_id === favoriteFolder?.id
  )

  const updateFolder = async (chatId: string, folderId: string | null) => {
    const updatedChat = await updateChat(chatId, {
      folder_id: folderId
    })

    setChats(prevChats =>
      prevChats.map(c => (c.id === updatedChat.id ? updatedChat : c))
    )

    return updatedChat
  }

  const handleToggleFavorite = async () => {
    if (!favoriteFolder?.id) return

    const updatedChat = await updateFolder(
      chat.id,
      isFavorite ? null : favoriteFolder.id
    )

    setIsFavorite(updatedChat.folder_id === favoriteFolder.id)
    setShowFavoriteDialog(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      buttonRef.current?.click()
    }
  }

  return (
    <Dialog open={showFavoriteDialog} onOpenChange={setShowFavoriteDialog}>
      <DialogTrigger asChild>
        {isFavorite ? (
          <IconStarFilled className="hover:opacity-50" size={18} />
        ) : (
          <IconStar className="hover:opacity-50" size={18} />
        )}
      </DialogTrigger>

      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </DialogTitle>

          <DialogDescription>
            {isFavorite
              ? "Are you sure you want to remove this chat from your favorites?"
              : "Are you sure you want to add this chat to your favorites?"}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowFavoriteDialog(false)}>
            Cancel
          </Button>

          <Button ref={buttonRef} onClick={handleToggleFavorite}>
            {isFavorite ? "Remove" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
