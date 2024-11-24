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
      return filteredByQuery;
    }
  }, [data, filterQuery, filterByType]);

  // Apply sorting
  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    if (filtered) {
      if (sortBy === "name_asc") {
        return filtered.sort((a, b) => {
          const aValue = a.system_name;
          const bValue = b.system_name;

          return aValue.localeCompare(bValue);
        });
      }
      if (sortBy === "name_desc") {
        return filtered.sort((a, b) => {
          const aValue = a.system_name;
          const bValue = b.system_name;

          return bValue.localeCompare(aValue);
        });
      }

      if (sortBy === "hdd_asc") {
        return filtered.sort((a, b) => {
          return Number(a.hdd_capacity) > Number(b.hdd_capacity) ? 1 : -1;
        });
      }

      if (sortBy === "hdd_desc") {
        return filtered.sort((a, b) => {
          return Number(a.hdd_capacity) < Number(b.hdd_capacity) ? 1 : -1;
        });
      }
    }
  }, [filtered, sortBy]);

  return {
    filteredData: sorted,
  };
}

export default useFilterAndSort;
