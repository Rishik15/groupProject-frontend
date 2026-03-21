import React, { useState } from "react";
import { Button, Modal, Label, TextArea, TextField } from "@heroui/react";

type WellnessData = {
    user_id: number;
    mood_score: number;
    notes: string;
};

const WellnessCheck = () => {
    const [userId] = useState<number>(1);
    const [moodScore, setMoodScore] = useState<number>(3);
    const [notes, setNotes] = useState<string>("");

    const sendWellness = async (): Promise<void> => {
        const payload: WellnessData = {
            user_id: userId,
            mood_score: moodScore,
            notes: notes,
        };

        try {
            const res = await fetch("http://localhost:8080/client/mental-survey", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Modal>
            <Button variant="secondary">Wellness Survey</Button>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-[420px]">
                        <Modal.CloseTrigger />

                        <Modal.Header>
                            <Modal.Heading>Mental Wellness</Modal.Heading>
                        </Modal.Header>

                        <Modal.Body>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    sendWellness();
                                }}
                                className="px-1 space-y-5">

                                <div>
                                    <Label className="mb-3 block">Mood Score (1–10)</Label>

                                    <div className="grid grid-cols-5 gap-2">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setMoodScore(num)}
                                                className={`h-11 rounded-xl border font-medium transition ${moodScore === num
                                                    ? "bg-indigo-500 text-white border-indigo-500"
                                                    : "bg-white text-black border-gray-200 hover:border-indigo-400"
                                                    }`}>
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <TextField className="w-full">
                                    <Label>Note</Label>
                                    <TextArea
                                        placeholder="Feeling good..."
                                        rows={4}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </TextField>

                                <Button
                                    type="submit"
                                    className="w-full bg-indigo-500 hover:bg-indigo-400 text-white">
                                    Submit Survey
                                </Button>
                            </form>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
};

export default WellnessCheck;