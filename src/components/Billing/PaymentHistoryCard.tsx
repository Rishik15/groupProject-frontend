import { Button, Card } from "@heroui/react"
import { FileText, MoveRight } from "lucide-react";

const PaymentHistoryCard = () => {


    return (
        <Card className="w-full border rounded-xl p-5 ">
            <div className="flex gap-2">
                <div className=" flex justify-center items-center bg-gray-100 rounded-lg w-8 h-8" >
                    <FileText />
                </div>

                <p className="my-auto font-bold">
                    Payment History
                </p>
                <Button className="rounded-lg py-3 bg-white text-indigo-500  ml-auto">  View all</Button>

            </div>
            <div className="flex flex-row justify-between text-sm text-gray-500">
                <p>Date</p>
                <p>Description</p>
                <p>Coach</p>
                <p>Amount</p>
                <p>Status</p>
            </div>
            <hr />
            <hr className="mt-auto" />
            <Button className="rounded-lg py-3 bg-white text-indigo-500  mx-auto"> View All Payment History <MoveRight /> </Button>
        </Card>
    );
}

export default PaymentHistoryCard;