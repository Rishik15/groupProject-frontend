import { Card, Input, Label, Link, TextArea } from "@heroui/react";

export function InfoTab() {
    return (
        <Card className="w-auto rounded-xl border-1 border-[#E8E8EF]">
            <Card.Footer className="flex flex-col items-start gap-4 pt-2 pl-2 pr-2">
                <div className="flex flex-col w-full gap-2">
                    <Label>Full Name</Label>
                    <Input className="bg-gray-100 rounded-md" />
                </div>
                <div className="flex flex-col w-full gap-2">
                    <Label>Email</Label>
                    <Input className="bg-gray-100 rounded-md" />
                </div>

                <div className="grid grid-cols-3 gap-4 w-full gap-2">
                    <div className="flex flex-col gap-2">
                        <Label>Age</Label>
                        <Input className="bg-gray-100 rounded-md" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Weight</Label>
                        <Input className="bg-gray-100 rounded-md" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Height</Label>
                        <Input className="bg-gray-100 rounded-md" />
                    </div>
                </div>
                <div className="flex flex-col w-full gap-2">
                    <Label >Goals</Label>
                    <Input className="bg-gray-100 rounded-md" />
                </div>
                <div className="flex flex-col w-full gap-2">
                    <Label>Bio</Label>
                    <TextArea className="bg-gray-100"/>
                </div>
            </Card.Footer>
        </Card>
    );
}