import { Card, Input, Label, Link, TextArea } from "@heroui/react";

export function InfoTab() {
    return (
        <Card className="w-auto">
            <Card.Footer className="flex flex-col items-start">
                <div className="flex flex-col">
                    <Label>Full Name</Label>
                    <Input></Input>
                </div>
                <div className="flex flex-col">
                    <Label>Email</Label>
                    <Input/>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <Label>Age</Label>
                        <Input />
                    </div>

                    <div className="flex flex-col">
                        <Label>Weight</Label>
                        <Input />
                    </div>

                    <div className="flex flex-col">
                        <Label>Height</Label>
                        <Input />
                    </div>
                </div>
                <div className="flex flex-col">
                    <Label>Goals</Label>
                    <Input/>
                </div>
                <div className="flex flex-col">
                    <Label>Bio</Label>
                    <TextArea></TextArea>
                </div>
            </Card.Footer>
        </Card>
    );
}