import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { DogWithLocation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

export const DogCard = ({
  isFavorite = false,
  dog,
  showAction = false,
  toggleFavorites,
  maxImageHeight,
}: {
  isFavorite?: boolean;
  dog: DogWithLocation;
  showAction?: boolean;
  maxImageHeight?: number;
  toggleFavorites?: (id: string) => void;
}) => (
  <Card className={cn("pt-0", isFavorite ? "bg-blue-200" : "")}>
    <img
      className={cn(
        "rounded-t-lg m",
        maxImageHeight ? `max-h-[${maxImageHeight}px]` : ""
      )}
      alt={dog.name}
      src={dog.img}
    />
    <CardTitle className="ml-4"> {dog.name}</CardTitle>
    <CardDescription className="p-4">
      <div>
        <b>Breed:</b> {dog.breed}
      </div>
      <div>
        <b>Age:</b> {dog.age}
      </div>
      <div>
        <b>Location: </b>
        {dog.location
          ? `${dog.location.city} ${dog.location.state}, ${dog.location.zip_code}`
          : dog.zip_code}
      </div>
    </CardDescription>
    {showAction && (
      <CardAction>
        <div className="ml-4">
          <Button
            variant={isFavorite ? "ghost" : "ghost"}
            onClick={() => toggleFavorites?.(dog.id)}
          >
            <Heart fill={isFavorite ? "red" : "white"} />
          </Button>
        </div>
      </CardAction>
    )}
  </Card>
);
