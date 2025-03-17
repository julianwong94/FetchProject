import { DogMasonry } from "../components/DogMasonry";
import { DogSearch } from "../components/DogSearch";
import { DogActions } from "../components/DogActions";

export const DogMatchPage = () => {
  return (
    <div className="w-full h-full px-8 flex flex-col gap-4">
      <div className="w-full flex gap-4 flex-wrap sticky top-12 border-b bg-background justify-between z-20 py-4">
        <DogSearch />
        <DogActions />
      </div>

      <div className="p-4">
        <DogMasonry />
      </div>
    </div>
  );
};
