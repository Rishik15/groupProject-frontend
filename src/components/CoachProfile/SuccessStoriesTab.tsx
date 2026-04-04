import { Card } from "@heroui/react";

export interface SuccessStory {
  id: number;
  author: string;
  result: string;
  text: string;
}

interface SuccessStoriesTabProps {
  stories: SuccessStory[];
}

export default function SuccessStoriesTab({ stories }: SuccessStoriesTabProps) {
  if (stories.length === 0) {
    return <p className="text-sm text-default-400">No success stories yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {stories.map((story) => (
        <Card key={story.id} className="p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{story.author}</span>
            <span className="text-xs font-medium text-primary">{story.result}</span>
          </div>
          <p className="text-sm text-default-500 leading-relaxed">{story.text}</p>
        </Card>
      ))}
    </div>
  );
}