import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChatbotUIContext } from "@/context/context"
import { updateFolder } from "@/db/folders"
import { Tables } from "@/supabase/types"
import { IconEdit } from "@tabler/icons-react"
import { FC, useContext, useRef, useState } from "react"

interface UpdateFolderProps {
  folder: Tables<"folders">
}

export const UpdateFolder: FC<UpdateFolderProps> = ({ folder }) => {
  const { setFolders } = useContext(ChatbotUIContext)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [showFolderDialog, setShowFolderDialog] = useState(false)
  const [name, setName] = useState(folder.name)
  const [error, setError] = useState("")

  // Check if the folder is editable
  const isEditable = folder.name !== "Favorite"

  const handleUpdateFolder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (name.trim() === "Favorite") {
      setError("Folder name 'Favorite' is reserved.")
      return
    }

    const updatedFolder = await updateFolder(folder.id, {
      name
    })
    setFolders(prevState =>
      prevState.map(c => (c.id === folder.id ? updatedFolder : c))
    )

    setShowFolderDialog(false)
    setError("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      buttonRef.current?.click()
    }
  }

  return (
    <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
      {isEditable && (
        <DialogTrigger asChild>
          <IconEdit className="hover:opacity-50" size={18} />
        </DialogTrigger>
      )}

      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Edit Folder</DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          <Label>Name</Label>

          <Input
            value={name}
            onChange={e => {
              setName(e.target.value)
              setError("")
            }}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowFolderDialog(false)}>
            Cancel
          </Button>

          <Button ref={buttonRef} onClick={handleUpdateFolder}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
