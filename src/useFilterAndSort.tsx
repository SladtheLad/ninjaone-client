import { useMemo } from "react";
import { Device, FilterType, SortDirection } from "./App";

function useFilterAndSort(
  data: Device[] | undefined,
  filterQuery: string,
  filterByType: FilterType,
  sortBy: SortDirection | null,
) {
  // Apply filtering
  const filtered = useMemo(() => {
    if (!filterQuery && filterByType === "ALL") return data;

    if (data) {
      const filteredByQuery = data.filter((item) => {
        return item.system_name
          .toLowerCase()
          .includes(filterQuery.toLowerCase());
      });
      if (filterByType !== "ALL") {
        const filteredByType = filteredByQuery.filter((item) => {
          return item.type === filterByType;
        });
        return filteredByType;
      }
    }
  }, [data, filterQuery, filterByType]);

  // Apply sorting
  const sorted = useMemo(() => {
    if (!sortBy) return filtered;

    // return [...filtered].sort((a, b) => {
    //   const aValue = a[sortBy];
    //   const bValue = b[sortBy];

    //   if (aValue < bValue) {
    //     return sortOrder === "asc" ? -1 : 1;
    //   } else if (aValue > bValue) {
    //     return sortOrder === "asc" ? 1 : -1;
    //   } else {
    //     return 0;
    //   }
    // });
  }, [filtered, sortBy]);

  console.log({ filtered, sorted, filterQuery, filterByType });

  return {
    filteredData: filtered,
  };
}

export default useFilterAndSort;
