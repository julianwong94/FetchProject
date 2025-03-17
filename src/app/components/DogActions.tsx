import { Button } from "@/components/ui/button";
import { FetchAPIClient } from "@/lib/FetchClient";
import { useSearchStore } from "@/lib/store";
import { pluralize } from "@/lib/utils";
import { AxiosResponse } from "axios";
import { Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { DogMatchDialog } from "./DogMatchDiaolog";

export const DogActions = () => {
  const { favorites, clearFavorites, setMatch, match } = useSearchStore();

  const numFavorites = Object.values(favorites).length;

  const { mutate: findMatch, isPending } = useMutation({
    mutationFn: () =>
      FetchAPIClient.post<string[], AxiosResponse<{ match: string }>>(
        "dogs/match",
        Object.keys(favorites)
      ),
    onSuccess: ({ data: { match } }) => {
      setMatch(match);
    },
  });

  return (
    <div>
      {match && (
        <DogMatchDialog isOpen match={match} closeDialog={() => setMatch("")} />
      )}
      {numFavorites ? (
        <div className="flex gap-4">
          <div className="p-2">
            {numFavorites} {pluralize(numFavorites, "favorite", "s")}
          </div>
          <Button variant="outline" onClick={clearFavorites}>
            Clear favorites
          </Button>
          <Button onClick={() => findMatch()}>
            {isPending ? <Loader /> : "Find a match"}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
