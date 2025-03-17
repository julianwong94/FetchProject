import { FetchAPIClient } from "@/lib/FetchClient";
import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Masonry, useInfiniteLoader } from "masonic";
import { useMemo } from "react";
import {
  Dog,
  SearchDogsResponse,
  SearchDogsRequest,
  Location,
  DogWithLocation,
} from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DogCard } from "./DogCard";
import { useSearchStore } from "@/lib/store";

const PAGE_SIZE = 50;

export const DogMasonry = () => {
  const {
    sortBy,
    sortDirection,
    selectedBreeds,
    favorites,
    toggleFavorites,
    ageMin,
    ageMax,
  } = useSearchStore();

  const searchRequest = useMemo(() => {
    const request: SearchDogsRequest = {
      sort: `${sortBy}:${sortDirection}`,
      size: PAGE_SIZE,
      ageMin,
      ageMax,
    };
    if (selectedBreeds.length) {
      request.breeds = selectedBreeds;
    }
    return request;
  }, [selectedBreeds, sortBy, sortDirection, ageMin, ageMax]);

  const { data, fetchNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["dogs", "search", searchRequest],
      queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
        FetchAPIClient.get<
          SearchDogsRequest,
          AxiosResponse<SearchDogsResponse>
        >("dogs/search", { params: { ...searchRequest, from: pageParam } }),
      initialPageParam: undefined,
      getNextPageParam: (currentPage, allPages) =>
        currentPage.data.next ? `${allPages.length * PAGE_SIZE}` : undefined,
    });

  const dogData = useQueries({
    queries:
      data?.pages.map((page) => ({
        queryKey: ["dogs", "data", page.data.resultIds],
        enabled: !!page.data.resultIds?.length,
        queryFn: async () => {
          const dogResults = await FetchAPIClient.post<
            string[],
            AxiosResponse<Dog[]>
          >("dogs", page.data.resultIds);

          const uniqZipCodes = Array.from(
            new Set(dogResults.data.map((res) => res.zip_code))
          );
          const locResults = await FetchAPIClient.post<
            string[],
            AxiosResponse<Location[]>
          >("locations", uniqZipCodes);


          const locMap = Object.fromEntries(
            locResults.data
              .filter((loc) => Boolean(loc))
              .map((data) => [data.zip_code, data])
          );
          return dogResults.data.map((dog) => ({
            ...dog,
            location: locMap[dog.zip_code],
          }));
        },
      })) ?? [],
  });

  const allDogs = useMemo(
    () =>
      dogData.flatMap((res) => res.data).filter(Boolean) as DogWithLocation[],

    [dogData]
  );

  const totalResults = data?.pages[0].data.total;

  const maybeLoadMore = useInfiniteLoader(
    () => {
      fetchNextPage({ cancelRefetch: false });
    },
    {
      isItemLoaded: (index, items) => !!items[index],
      totalItems: totalResults,
    }
  );

  if (isFetching && !isFetchingNextPage) {
    return (
      <Skeleton>
        <div className="h-screen w-full" />
      </Skeleton>
    );
  }

  if (totalResults === 0) {
    return <div> No results found. Please try another search</div>;
  }

  return (
    <div>
      {totalResults !== undefined ? (
        <div className="mb-4">{`${totalResults} results`}</div>
      ) : undefined}
      <Masonry
        items={allDogs}
        columnGutter={16}
        columnWidth={300}
        onRender={maybeLoadMore}
        render={({ data }) => (
          <DogCard
            isFavorite={favorites[data.id]}
            dog={data}
            showAction
            toggleFavorites={toggleFavorites}
          />
        )}
      />
    </div>
  );
};
