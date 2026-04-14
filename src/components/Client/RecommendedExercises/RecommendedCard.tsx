import { Card, Button } from "@heroui/react";
import { Lightbulb } from "lucide-react";

export function RecommendedCard() {
  return (
    <Card className="w-[600px] bg-[#ECECFA] border-2 border-[#D1D2FA]">
      <Card.Header>
        <div className="w-10 h-10 rounded-[12px] bg-[#d9d8f6] flex items-center justify-center mb-4">
          <Lightbulb className="w-5 h-5 text-[#5b5ce9] stroke-[1.8]" />
        </div>

        <Card.Title className="text-lg mb-2">
          Workout Recommendations
        </Card.Title>
        <Card.Description className="mb-2">
          Get personalized workout plans based on your goals and experience
          level
        </Card.Description>
      </Card.Header>
      <Card.Footer>
        <Button className="bg-indigo-500 w-full rounded-lg">
          Discover Plans
        </Button>
      </Card.Footer>
    </Card>
  );
}
