export const dropdownOptions = [
  { value: "search", text: "Search by..." },
  { value: "firstName", text: "First Name" },
  { value: "lastName", text: "Last Name" },
  { value: "emailAddress", text: "Email Address" },
  { value: "roleName", text: "Role" },
] as const;

export type SearchFields = (typeof dropdownOptions)[number]["value"];

export type SearchQuery = {
  // Pagination
  unpaged?: boolean;
  page?: number;
  size?: number;
} & {
  [K in SearchFields]?: string;
};

export const isSearchField = (key: string): key is SearchFields => {
  return dropdownOptions.some((option) => option.value === key);
};
