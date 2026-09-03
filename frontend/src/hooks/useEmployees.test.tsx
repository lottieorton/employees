import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "../services/employees-service";
import { type ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  useCreateEmployee,
  useDeleteEmployee,
  useEmployee,
  useEmployees,
  useUpdateEmployee,
} from "./useEmployees";
import type { SearchQuery } from "../interfaces/SearchQuery";
import { deleteAddress } from "../services/addresses-service";

vi.mock("../services/employees-service", () => ({
  getAllEmployees: vi.fn(),
  getEmployeeById: vi.fn(),
  createEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
}));

vi.mock("../services/addresses-service", () => ({
  deleteAddress: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useEmployees hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useEmployees", () => {
    const mockEmployees = [
      {
        id: 1,
        firstName: "Sarah",
        lastName: "Jenkins",
        middleName: "Marie",
        preferredName: "SJ",
        pronouns: "She/Her",
        emailAddress: "sarah.jenkins@example.com",
        phoneNumber: "+61412345678",
        address: {
          id: 4,
          unitNumber: "30",
          streetAddress: "Park Lane",
          addressLine2: "Leicester Square",
          city: "London",
          stateProvinceRegion: "Mayfair",
          postalCode: "E1 1GB",
          country: "England",
        },
        role: {
          id: 1,
          name: "Software Developer",
          seniorityLevel: "Junior",
          department: "Engineering",
        },
        manager: null,
        workSetup: "Onsite",
        employmentType: "Full-Time Permanent",
        startDate: "2021-03-15",
        lastDate: null,
        isCurrentlyEmployed: true,
      },
      {
        id: 2,
        firstName: "Alex",
        lastName: "Rivera",
        middleName: null,
        preferredName: "Al",
        pronouns: "He/Him",
        emailAddress: "alex.rivera@example.com",
        phoneNumber: "+61498765432",
        address: {
          id: 5,
          unitNumber: "86",
          streetAddress: "Wallaby Way",
          addressLine2: "Opera House View Parade",
          city: "Sydney",
          stateProvinceRegion: "Darling Harbour",
          postalCode: "2000",
          country: "Australia",
        },
        role: {
          id: 2,
          name: "Software Developer",
          seniorityLevel: "Mid",
          department: "Engineering",
        },
        manager: {
          id: 4,
          fullName: "Sarah Jenkins",
          role: "Software Developer",
        },
        workSetup: "Hybrid",
        employmentType: "Full-Time Permanent",
        startDate: "2023-08-01",
        lastDate: null,
        isCurrentlyEmployed: true,
      },
    ];

    it("Should return employees on successful getAllEmployees without search", async () => {
      // arrange
      vi.mocked(getAllEmployees).mockResolvedValueOnce(mockEmployees);
      // act
      const { result } = renderHook(() => useEmployees(), {
        wrapper: createWrapper(),
      });
      // assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(getAllEmployees).toHaveBeenCalledOnce();
        expect(result.current.data).toEqual(mockEmployees);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("Should return employees on successful getAllEmployees with search query", async () => {
      // arrange
      const mockSearchQuery = {
        search: "Software Developer",
      };
      vi.mocked(getAllEmployees).mockResolvedValueOnce(mockEmployees);
      // act
      const { result } = renderHook(() => useEmployees(mockSearchQuery), {
        wrapper: createWrapper(),
      });
      // assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(getAllEmployees).toHaveBeenCalledOnce();
        expect(result.current.data).toEqual(mockEmployees);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("Should refetch employees on search query changing", async () => {
      // arrange
      const mockSearchQuery = {
        search: "Software Developer",
      };
      const [mockSearchResult] = mockEmployees;
      vi.mocked(getAllEmployees)
        .mockResolvedValueOnce(mockEmployees)
        .mockResolvedValueOnce([mockSearchResult]);
      // act
      const { result, rerender } = renderHook(
        (searchQuery?: SearchQuery) => useEmployees(searchQuery),
        {
          wrapper: createWrapper(),
        },
      );
      // assert
      await waitFor(() => {
        expect(result.current.data).toEqual(mockEmployees);
        expect(getAllEmployees).toHaveBeenCalledWith(undefined);
      });
      rerender(mockSearchQuery);
      // assert
      await waitFor(() => {
        expect(result.current.data).toEqual([mockSearchResult]);
        expect(getAllEmployees).toHaveBeenCalledTimes(2);
        expect(getAllEmployees).toHaveBeenLastCalledWith({
          search: "Software Developer",
        });
      });
    });

    it("Should return isError when fetching employees errors", async () => {
      // arrange

      vi.mocked(getAllEmployees).mockRejectedValueOnce(
        new Error("Oops something went wrong with fetching employees"),
      );
      // act
      const { result } = renderHook(() => useEmployees(), {
        wrapper: createWrapper(),
      });
      // assert
      expect(result.current.isLoading).toBe(true);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.isError).toBe(true);
        expect(result.current.error?.message).toBe(
          "Oops something went wrong with fetching employees",
        );
        expect(getAllEmployees).toHaveBeenCalledOnce();
        expect(result.current.data).toBe(undefined);
      });
    });
  });

  describe("useEmployee", () => {
    const mockEmployee = {
      id: 1,
      firstName: "Sarah",
      lastName: "Jenkins",
      middleName: "Marie",
      preferredName: "SJ",
      pronouns: "She/Her",
      emailAddress: "sarah.jenkins@example.com",
      phoneNumber: "+61412345678",
      address: {
        id: 4,
        unitNumber: "30",
        streetAddress: "Park Lane",
        addressLine2: "Leicester Square",
        city: "London",
        stateProvinceRegion: "Mayfair",
        postalCode: "E1 1GB",
        country: "England",
      },
      role: {
        id: 1,
        name: "Software Developer",
        seniorityLevel: "Junior",
        department: "Engineering",
      },
      manager: null,
      workSetup: "Onsite",
      employmentType: "Full-Time Permanent",
      startDate: "2021-03-15",
      lastDate: null,
      isCurrentlyEmployed: true,
    };

    const mockEmployee2 = {
      id: 2,
      firstName: "Alex",
      lastName: "Rivera",
      middleName: null,
      preferredName: "Al",
      pronouns: "He/Him",
      emailAddress: "alex.rivera@example.com",
      phoneNumber: "+61498765432",
      address: {
        id: 5,
        unitNumber: "86",
        streetAddress: "Wallaby Way",
        addressLine2: "Opera House View Parade",
        city: "Sydney",
        stateProvinceRegion: "Darling Harbour",
        postalCode: "2000",
        country: "Australia",
      },
      role: {
        id: 2,
        name: "Software Developer",
        seniorityLevel: "Mid",
        department: "Engineering",
      },
      manager: {
        id: 4,
        fullName: "Sarah Jenkins",
        role: "Software Developer",
      },
      workSetup: "Hybrid",
      employmentType: "Full-Time Permanent",
      startDate: "2023-08-01",
      lastDate: null,
      isCurrentlyEmployed: true,
    };

    it("Should return employee on successful getEmployeeById", async () => {
      // arrange
      vi.mocked(getEmployeeById).mockResolvedValueOnce(mockEmployee);
      // act
      const id = "1";
      const { result } = renderHook(() => useEmployee(id), {
        wrapper: createWrapper(),
      });
      // assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(getEmployeeById).toHaveBeenCalledOnce();
        expect(result.current.data).toEqual(mockEmployee);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("Should refetch employee on id changing", async () => {
      // arrange
      vi.mocked(getEmployeeById)
        .mockResolvedValueOnce(mockEmployee)
        .mockResolvedValueOnce(mockEmployee2);
      // act
      const { result, rerender } = renderHook((id: string) => useEmployee(id), {
        wrapper: createWrapper(),
        initialProps: "1",
      });
      // assert
      await waitFor(() => {
        expect(result.current.data).toEqual(mockEmployee);
        expect(getEmployeeById).toHaveBeenCalledWith("1");
      });
      rerender("2");
      // assert
      await waitFor(() => {
        expect(result.current.data).toEqual(mockEmployee2);
        expect(getEmployeeById).toHaveBeenCalledTimes(2);
        expect(getEmployeeById).toHaveBeenLastCalledWith("2");
      });
    });

    it("Should return isError when fetching employee errors", async () => {
      // arrange
      vi.mocked(getEmployeeById).mockRejectedValueOnce(
        new Error("Oops something went wrong with fetching employee"),
      );
      // act
      const { result } = renderHook(() => useEmployee("1"), {
        wrapper: createWrapper(),
      });
      // assert
      expect(result.current.isLoading).toBe(true);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.isError).toBe(true);
        expect(result.current.error?.message).toBe(
          "Oops something went wrong with fetching employee",
        );
        expect(getEmployeeById).toHaveBeenCalledOnce();
        expect(result.current.data).toBe(undefined);
      });
    });
  });

  describe("createEmployee", () => {
    const mockEmployee = {
      id: 1,
      firstName: "Sarah",
      lastName: "Jenkins",
      middleName: "Marie",
      preferredName: "SJ",
      pronouns: "She/Her",
      emailAddress: "sarah.jenkins@example.com",
      phoneNumber: "+61412345678",
      address: {
        id: 4,
        unitNumber: "30",
        streetAddress: "Park Lane",
        addressLine2: "Leicester Square",
        city: "London",
        stateProvinceRegion: "Mayfair",
        postalCode: "E1 1GB",
        country: "England",
      },
      role: {
        id: 1,
        name: "Software Developer",
        seniorityLevel: "Junior",
        department: "Engineering",
      },
      manager: null,
      workSetup: "Onsite",
      employmentType: "Full-Time Permanent",
      startDate: "2021-03-15",
      lastDate: null,
      isCurrentlyEmployed: true,
    };

    const mockFormData = {
      pronouns: "She/Her",
      firstName: "Sarah",
      middleName: "Marie",
      lastName: "Jenkins",
      preferredName: "SJ",
      emailAddress: "sarah.jenkins@example.com",
      phoneNumber: "+61412345678",
      unitNumber: "30",
      streetAddress: "Park Lane",
      addressLine2: "Suite 4",
      city: "Sydney",
      stateProvinceRegion: "NSW",
      postalCode: "2000",
      country: "Australia",
      roleName: "Software Developer",
      seniorityLevel: "Junior",
      department: "Engineering",
      managerId: "1",
      workSetup: "Onsite",
      employmentType: "Full-Time Permanent",
      startDate: "2024-01-15",
      lastDate: "",
      isCurrentlyEmployed: true,
    };

    it("Should return employee on successful createEmployee", async () => {
      // arrange
      vi.mocked(createEmployee).mockResolvedValueOnce(mockEmployee);
      // act
      const { result } = renderHook(() => useCreateEmployee(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      act(() => {
        result.current.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(createEmployee).toHaveBeenCalledOnce();
        expect(createEmployee).toHaveBeenCalledWith(mockFormData);
        expect(result.current.data).toEqual(mockEmployee);
        expect(result.current.isPending).toBe(false);
      });
    });

    it("Should cause getAllEmployees to be called on successful createEmployee", async () => {
      // arrange
      vi.mocked(getAllEmployees)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockEmployee]);
      vi.mocked(createEmployee).mockResolvedValueOnce(mockEmployee);
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useEmployees(),
          mutation: useCreateEmployee(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toEqual([]);
      });
      expect(getAllEmployees).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
        expect(createEmployee).toHaveBeenCalledOnce();
        expect(getAllEmployees).toHaveBeenCalledTimes(2);
        expect(result.current.query.data).toEqual([mockEmployee]);
      });
    });

    it("Should return isError when creating employee errors", async () => {
      // arrange
      vi.mocked(getAllEmployees).mockResolvedValueOnce([mockEmployee]);
      vi.mocked(createEmployee).mockRejectedValueOnce(
        new Error("Could not create employee"),
      );
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useEmployees(),
          mutation: useCreateEmployee(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toEqual([mockEmployee]);
      });
      expect(getAllEmployees).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(false);
        expect(result.current.mutation.isError).toBe(true);
        expect(result.current.mutation.error?.message).toBe(
          "Could not create employee",
        );
        expect(createEmployee).toHaveBeenCalledOnce();
        expect(getAllEmployees).toHaveBeenCalledOnce();
      });
    });
  });

  describe("updateEmployee", () => {
    const mockEmployee = {
      id: 1,
      firstName: "Sarahh",
      lastName: "Jenkins",
      middleName: "Marie",
      preferredName: "SJ",
      pronouns: "She/Her",
      emailAddress: "sarah.jenkins@me.com",
      phoneNumber: "+61412345678",
      address: {
        id: 4,
        unitNumber: "30",
        streetAddress: "Park Lane",
        addressLine2: "Leicester Square",
        city: "London",
        stateProvinceRegion: "Mayfair",
        postalCode: "E1 1GB",
        country: "England",
      },
      role: {
        id: 1,
        name: "Software Developer",
        seniorityLevel: "Junior",
        department: "Engineering",
      },
      manager: null,
      workSetup: "Onsite",
      employmentType: "Full-Time Permanent",
      startDate: "2021-03-15",
      lastDate: null,
      isCurrentlyEmployed: true,
    };

    const mockUpdatedEmployee = {
      id: 1,
      firstName: "Sarah",
      lastName: "Jenkins",
      middleName: "Marie",
      preferredName: "SJ",
      pronouns: "She/Her",
      emailAddress: "sarah.jenkins@example.com",
      phoneNumber: "+61412345678",
      address: {
        id: 4,
        unitNumber: "30",
        streetAddress: "Park Lane",
        addressLine2: "Leicester Square",
        city: "London",
        stateProvinceRegion: "Mayfair",
        postalCode: "E1 1GB",
        country: "England",
      },
      role: {
        id: 1,
        name: "Software Developer",
        seniorityLevel: "Junior",
        department: "Engineering",
      },
      manager: null,
      workSetup: "Onsite",
      employmentType: "Full-Time Permanent",
      startDate: "2021-03-15",
      lastDate: null,
      isCurrentlyEmployed: true,
    };

    const mockFormData = {
      id: 1,
      formData: {
        pronouns: "She/Her",
        firstName: "Sarah",
        middleName: "Marie",
        lastName: "Jenkins",
        preferredName: "SJ",
        emailAddress: "sarah.jenkins@example.com",
        phoneNumber: "+61412345678",
        unitNumber: "30",
        streetAddress: "Park Lane",
        addressLine2: "Suite 4",
        city: "Sydney",
        stateProvinceRegion: "NSW",
        postalCode: "2000",
        country: "Australia",
        roleName: "Software Developer",
        seniorityLevel: "Junior",
        department: "Engineering",
        managerId: "1",
        workSetup: "Onsite",
        employmentType: "Full-Time Permanent",
        startDate: "2024-01-15",
        lastDate: "",
        isCurrentlyEmployed: true,
      },
    };

    it("Should return employee on successful updateEmployee", async () => {
      // arrange
      vi.mocked(updateEmployee).mockResolvedValueOnce(mockUpdatedEmployee);
      // act
      const { result } = renderHook(() => useUpdateEmployee(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      act(() => {
        result.current.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(updateEmployee).toHaveBeenCalledOnce();
        expect(updateEmployee).toHaveBeenCalledWith(
          mockFormData.id,
          mockFormData.formData,
        );
        expect(result.current.data).toEqual(mockUpdatedEmployee);
        expect(result.current.isPending).toBe(false);
      });
    });

    it("Should cause getAllEmployees to be called on successful updateEmployee", async () => {
      // arrange
      vi.mocked(getAllEmployees)
        .mockResolvedValueOnce([mockEmployee])
        .mockResolvedValueOnce([mockUpdatedEmployee]);
      vi.mocked(updateEmployee).mockResolvedValueOnce(mockUpdatedEmployee);
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useEmployees(),
          mutation: useUpdateEmployee(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toEqual([mockEmployee]);
      });
      expect(getAllEmployees).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
        expect(updateEmployee).toHaveBeenCalledOnce();
        expect(getAllEmployees).toHaveBeenCalledTimes(2);
        expect(result.current.query.data).toEqual([mockUpdatedEmployee]);
      });
    });

    it("Should return isError when updating employee errors", async () => {
      // arrange
      vi.mocked(getAllEmployees).mockResolvedValueOnce([mockEmployee]);
      vi.mocked(updateEmployee).mockRejectedValueOnce(
        new Error("Could not update employee"),
      );
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useEmployees(),
          mutation: useUpdateEmployee(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toEqual([mockEmployee]);
      });
      expect(getAllEmployees).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockFormData);
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(false);
        expect(result.current.mutation.isError).toBe(true);
        expect(result.current.mutation.error?.message).toBe(
          "Could not update employee",
        );
        expect(updateEmployee).toHaveBeenCalledOnce();
        expect(getAllEmployees).toHaveBeenCalledOnce();
      });
    });
  });

  describe("updateEmployee", () => {
    const mockEmployee = {
      id: 1,
      firstName: "Sarah",
      lastName: "Jenkins",
      middleName: "Marie",
      preferredName: "SJ",
      pronouns: "She/Her",
      emailAddress: "sarah.jenkins@example.com",
      phoneNumber: "+61412345678",
      address: {
        id: 4,
        unitNumber: "30",
        streetAddress: "Park Lane",
        addressLine2: "Leicester Square",
        city: "London",
        stateProvinceRegion: "Mayfair",
        postalCode: "E1 1GB",
        country: "England",
      },
      role: {
        id: 1,
        name: "Software Developer",
        seniorityLevel: "Junior",
        department: "Engineering",
      },
      manager: null,
      workSetup: "Onsite",
      employmentType: "Full-Time Permanent",
      startDate: "2021-03-15",
      lastDate: null,
      isCurrentlyEmployed: true,
    };

    it("Should return true on successful deleteEmployee with no addressId provided", async () => {
      // arrange
      vi.mocked(deleteEmployee).mockResolvedValueOnce(true);
      // act
      const { result } = renderHook(() => useDeleteEmployee(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      act(() => {
        result.current.mutate({ id: 1 });
      });
      // assert
      await waitFor(() => {
        expect(deleteAddress).not.toHaveBeenCalled();
        expect(result.current.isSuccess).toBe(true);
        expect(deleteEmployee).toHaveBeenCalledOnce();
        expect(deleteEmployee).toHaveBeenCalledWith(1);
        expect(result.current.data).toEqual(true);
        expect(result.current.isPending).toBe(false);
      });
    });

    it("Should return true on successful deleteEmployee and deleteAddress with addressId provided", async () => {
      // arrange
      vi.mocked(deleteEmployee).mockResolvedValueOnce(true);
      vi.mocked(deleteAddress).mockResolvedValueOnce(true);
      // act
      const { result } = renderHook(() => useDeleteEmployee(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      act(() => {
        result.current.mutate({ id: 1, addressId: 2 });
      });
      // assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(deleteAddress).toHaveBeenCalledOnce();
        expect(deleteAddress).toHaveBeenCalledWith(2);
        expect(deleteEmployee).toHaveBeenCalledOnce();
        expect(deleteEmployee).toHaveBeenCalledWith(1);
        expect(result.current.data).toEqual(true);
        expect(result.current.isPending).toBe(false);
      });
    });

    it("Should cause getAllEmployees to be called on successful deleteEmployee", async () => {
      // arrange
      vi.mocked(getAllEmployees)
        .mockResolvedValueOnce([mockEmployee])
        .mockResolvedValueOnce([]);
      vi.mocked(deleteEmployee).mockResolvedValueOnce(true);
      vi.mocked(deleteAddress).mockResolvedValueOnce(true);
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useEmployees(),
          mutation: useDeleteEmployee(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toEqual([mockEmployee]);
      });
      expect(getAllEmployees).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate({ id: 1, addressId: 2 });
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
        expect(deleteEmployee).toHaveBeenCalledOnce();
        expect(getAllEmployees).toHaveBeenCalledTimes(2);
        expect(result.current.query.data).toEqual([]);
      });
    });

    it("Should return isError when deleting employee errors", async () => {
      // arrange
      vi.mocked(getAllEmployees).mockResolvedValueOnce([mockEmployee]);
      vi.mocked(deleteEmployee).mockRejectedValueOnce(
        new Error("Could not delete employee"),
      );
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useEmployees(),
          mutation: useDeleteEmployee(),
        }),
        { wrapper },
      );
      // act
      await waitFor(() => {
        expect(result.current.query.data).toEqual([mockEmployee]);
      });
      expect(getAllEmployees).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate({ id: 1 });
      });
      // assert
      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(false);
        expect(result.current.mutation.isError).toBe(true);
        expect(result.current.mutation.error?.message).toBe(
          "Could not delete employee",
        );
        expect(deleteEmployee).toHaveBeenCalledOnce();
        expect(getAllEmployees).toHaveBeenCalledOnce();
      });
    });
  });
});
