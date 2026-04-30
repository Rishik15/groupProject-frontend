import { Button, Label, Modal } from "@heroui/react";
import { Trash2 } from "lucide-react";

export function AccountDeletion() {
  const deleteHandler = async () => {
    const res = await fetch("http://localhost:8080/auth/delete", {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to delete account");
    }
    window.location.href = "/";
  };
  return (
    <Modal>
      <Button className="rounded-md bg-transparent border border-red-300"       data-testid="delete-account">
        <Trash2 className="text-red-500" />
        <p className="text-red-500">Delete Account</p>
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="rounded-lg">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Label className="text-xl font-bold">Delete account?</Label>
              <p className="text-gray-400 text-sm">
                This action cannot be undone. Your account and all data will be
                permanently deleted.
              </p>
              <div className="flex w-full justify-end gap-2">
                <Button className="rounded-lg bg-white text-black border border-black">
                  Cancel
                </Button>
                <Button
                  className="rounded-lg bg-[#E5484D] text-white"
                  onClick={deleteHandler}
                  data-testid="delete-confirm"
                >
                  Delete
                </Button>
              </div>
            </Modal.Header>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
