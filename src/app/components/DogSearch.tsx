import {
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { MultiSelect } from "@/components/ui/multi-select";
import { FetchAPIClient } from "@/lib/FetchClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/lib/store";
import { SortBy } from "@/lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";

export const DogSearch = () => {
  const {
    selectedBreeds,
    ageMin,
    ageMax,
    sortBy,
    sortDirection,
    setSelectedBreeds,
    setAgeMin,
    setAgeMax,
    setSortBy,
    toggleSortDirection,
  } = useSearchStore();
  const { data: dogBreedOptions = [] } = useQuery({
    queryKey: ["dogs", "breeds"],
    queryFn: () =>
      FetchAPIClient.get<undefined, AxiosResponse<string[]>>("dogs/breeds"),
    select: ({ data }) => data.map((value) => ({ value, label: value })),
  });

  return (
    <div className="flex gap-4 flex-wrap">
      <Label>Filter by breed:</Label>
      <MultiSelect
        placeholder="Select breed"
        options={dogBreedOptions}
        onValueChange={setSelectedBreeds}
        selectedValues={selectedBreeds}
      />
      <Label>Sort by:</Label>
      <Select onValueChange={(val) => setSortBy(val as SortBy)} value={sortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="breed">Breed</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="age">Age</SelectItem>
        </SelectContent>
      </Select>

      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortDirection}
              >
                {sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{sortDirection === "asc" ? "Ascending" : "Descending"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex gap-2">
        <Label htmlFor="ageMin">Min Age:</Label>
        <Input
          id="ageMin"
          className="w-20"
          value={ageMin}
          type="number"
          min={0}
          max={20}
          placeholder="0"
          onChange={(e) => setAgeMin(e.target.value as unknown as number)}
        />
      </div>

      <div className="flex gap-2">
        <Label htmlFor="ageMax">Max Age:</Label>
        <Input
          id="ageMax"
          className="w-20"
          value={ageMax}
          type="number"
          min={0}
          max={20}
          placeholder="20"
          onChange={(e) => setAgeMax(e.target.value as unknown as number)}
        />
      </div>
    </div>
  );
};
