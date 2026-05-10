import { useEffect, useState } from "react";
import type { SuccessStory } from "./Types";

type Props = {
  story: SuccessStory;
  onClose: () => void;
};

const SuccessStoryImageViewer = ({ story, onClose }: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const label = `${story.name}'s Transformation`;
  const description = `${story.result} with Coach ${story.coachName}`;

  useEffect(() => {
    setImageLoaded(false);

    const image = new window.Image();

    image.onload = () => {
      setImageLoaded(true);
    };

    image.onerror = () => {
      setImageLoaded(true);
    };

    image.src = story.imageUrl;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [story.imageUrl]);

  if (!imageLoaded) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-6"
      onClick={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          event.key === "Escape" ||
          event.key === "Enter" ||
          event.key === " "
        ) {
          onClose();
        }
      }}
    >
      <div
        className="flex max-h-full max-w-4xl flex-col items-center gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-sm font-medium text-white">{label}</div>

          <div className="mt-1 text-xs text-white/75">{description}</div>
        </div>

        <img
          src={story.imageUrl}
          alt={`${story.name} before and after transformation`}
          className="max-h-[65vh] max-w-[75vw] object-contain"
        />

        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#0F0F14] shadow-sm hover:bg-indigo-500 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessStoryImageViewer;
