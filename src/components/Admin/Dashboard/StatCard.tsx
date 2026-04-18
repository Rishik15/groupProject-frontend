import { Card } from "@heroui/react";
import type { LucideIcon } from "lucide-react";

export type AdminStatTone = "default" | "success" | "warning" | "danger";

export interface StatCardData {
    id: string;
    title: string;
    value: string | number;
    helperText: string;
    icon: LucideIcon;
    tone?: AdminStatTone;
}

type StatCardProps = StatCardData;

const toneClasses: Record<AdminStatTone, string> = {
    default: "text-[#72728A]",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
};

const StatCard = ({
    title,
    value,
    helperText,
    icon: Icon,
    tone = "default",
}: StatCardProps) => {
    return (
        <Card className="h-[90px] min-w-[215px] flex-1 overflow-hidden rounded-xl border border-border bg-card text-card-foreground">
            <div className="flex h-full items-center gap-3 px-[15px] pt-[15px] pb-[22.5px]">
                <div className="flex shrink-0 items-center justify-center rounded-xl bg-primary/8 p-2.5">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-[11.25px] leading-[13.5px] text-[#72728A]">
                        {title}
                    </p>

                    <p className="mt-0.5 text-[16.875px] font-semibold leading-[20.25px] text-[#0F0F14]">
                        {value}
                    </p>

                    <p
                        className={`mt-0.5 text-[11.25px] leading-[13.5px] ${toneClasses[tone]}`}
                    >
                        {helperText}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default StatCard;