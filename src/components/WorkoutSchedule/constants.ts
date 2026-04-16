export const ROW_HEIGHT = 88;
export const HOURS = Array.from({ length: 24 }, (_, index) => index);

export const EVENT_STYLES: Record<
    string,
    { background: string; border: string; text: string; pill: string }
> = {
    strength: {
        background: "#8E51FF1A",
        border: "#8E51FF40",
        text: "#8E51FF",
        pill: "#8E51FF26",
    },
    cardio: {
        background: "#00A6F41A",
        border: "#00A6F440",
        text: "#00A6F4",
        pill: "#00A6F426",
    },
    yoga: {
        background: "#00BC7D1A",
        border: "#00BC7D40",
        text: "#00BC7D",
        pill: "#00BC7D26",
    },
    rest: {
        background: "#90A1B91A",
        border: "#90A1B940",
        text: "#90A1B9",
        pill: "#90A1B926",
    },
    nutrition: {
        background: "#FE9A001A",
        border: "#FE9A0040",
        text: "#FE9A00",
        pill: "#FE9A0026",
    },
    other: {
        background: "#F6339A1A",
        border: "#F6339A40",
        text: "#F6339A",
        pill: "#F6339A26",
    },
};
