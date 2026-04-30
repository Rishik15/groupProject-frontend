import { Button, Label, Modal } from "@heroui/react";
import { Trash2 } from "lucide-react";
import api from "@/services/api";

export function AccountDeletion() {
  const deleteHandler = async () => {
    try {
      await api.delete("/auth/delete");
      window.location.href = "/";
    } catch (err: any) {
      throw new Error(err?.response?.data?.error || "Failed to delete account");
    }
  };

  return (
    <Modal>
      <Button className="rounded-md bg-transparent border border-red-300">
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
                  onPress={deleteHandler}
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
