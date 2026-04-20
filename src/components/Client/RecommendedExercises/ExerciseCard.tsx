import { Card } from "@heroui/react";
import type React from "react";

type ExerciseCardProps = {
    title: string;
    description: string;
    icon: React.ElementType;
    iconBg: string;
    onClick?: () => void;
};

export function ExerciseCard({
    title,
    description,
    icon,
    iconBg,
    onClick,
}: ExerciseCardProps) {
    const IconComponent = icon;

    return (
        <Card
            onClick={onClick}
            className="w-[340px] h-[175px] group cursor-pointer border-2 border-transparent transition-all duration-200 ease-out hover:border-indigo-500 hover:shadow-md"
        >
            <Card.Header className="flex flex-col items-start gap-3">
                <div
                    className={`${iconBg} p-3 rounded-xl m-auto w-fit transition-transform duration-200 ease-out group-hover:scale-110`}
                >
                    <IconComponent className="w-6 h-6" />
                </div>

                <Card.Title className="text-lg m-auto font-semibold">
                    {title}
                </Card.Title>

                <Card.Description className="text-sm m-auto text-default-500 text-center">
                    {description}
                </Card.Description>
            </Card.Header>
        </Card>
    );
}