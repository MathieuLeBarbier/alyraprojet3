import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function AddVoterDialog() {
  const [newVoterAddress, setNewVoterAddress] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddVoter = () => {
    console.log(newVoterAddress);
    setNewVoterAddress("");
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" >
          + Add Voter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Voter</DialogTitle>
          <DialogDescription>
            Enter the address
          </DialogDescription>
        </DialogHeader>
        <Input
          id="address"
          placeholder="0x..."
          value={newVoterAddress}
          onChange={(e) => setNewVoterAddress(e.target.value)}
        />
        <DialogFooter>
          <Button type="submit" 
            onClick={handleAddVoter} 
            disabled={newVoterAddress.trim() === ""}
            className="w-full bg-[var(--accent-secondary)] text-secondary"
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddVoterDialog;