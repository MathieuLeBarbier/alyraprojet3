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
import { useState, useEffect } from "react";
import { useContract } from "@/contexts/useContract";

function AddProposalDialog() {
  const [open, setOpen] = useState(false);
  
  const [newProposal, setNewProposal] = useState("");
  const { addProposal, isPending, isConfirming, isSuccess, error, hash } = useContract();

  useEffect(() => {
    if (isSuccess) {
      setNewProposal("");
      setOpen(false);
    }
  }, [isSuccess]);

  const handle = async () => {
    // TODO: Add error handling
    await addProposal(newProposal);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          + Add Proposal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Proposal</DialogTitle>
          <DialogDescription>
            Enter the proposal you want to add to the poll
          </DialogDescription>
        </DialogHeader>
        <Input
          id="proposal"
          placeholder="Describe the proposal"
          value={newProposal}
          onChange={(e) => setNewProposal(e.target.value)}
          disabled={isPending || isConfirming}
        />
        {error && <p className="text-red-500">{error.message}</p>}
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={() => handle()} 
            disabled={isPending || isConfirming || newProposal.trim() === ""}
            className="w-full bg-[var(--accent-secondary)] text-secondary"
          >
            {isPending && "Adding..."}
            {isConfirming && "Confirming..."}
            {!isPending && !isConfirming && "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddProposalDialog;