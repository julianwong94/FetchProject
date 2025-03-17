import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DogCard } from "./DogCard";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Dog, Location } from "@/lib/types";
import { FetchAPIClient } from "@/lib/FetchClient";
import { Loader } from "lucide-react";

export const DogMatchDialog = ({
  isOpen,
  match,
  closeDialog,
}: {
  isOpen: boolean;
  match: string;
  closeDialog: () => void;
}) => {
  const { data: dogData, isLoading } = useQuery({
    queryKey: ["dogs", "data", [match]],
    enabled: !!match,
    queryFn: async () => {
      const resp = await FetchAPIClient.post<string[], AxiosResponse<Dog[]>>(
        "dogs",
        [match]
      );
      const location = await FetchAPIClient.post<
        string[],
        AxiosResponse<Location[]>
      >("locations", [resp.data[0].zip_code]);
      return { ...resp.data[0], location: location.data[0] };
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Match Found!</DialogTitle>
        </DialogHeader>
        {isLoading && (
          <div className="h-24 items-center flex justify-center">
            <Loader />
          </div>
        )}
        {dogData && <DogCard maxImageHeight={300} dog={dogData} />}

        <DialogFooter>
          <DialogClose>
            <Button>Find Another Match</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
