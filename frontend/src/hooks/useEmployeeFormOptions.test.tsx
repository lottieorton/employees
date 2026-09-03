import { renderHook, waitFor } from "@testing-library/react";
import { getEmployeeFormEnums } from "../services/employees-service";
import { getAllRoles } from "../services/roles-service";
import { useEmployeeFormOptions } from "./useEmployeeFormOptions";
import { useEmployees } from "./useEmployees";
import { useForm } from "react-hook-form";
import type { FormValues } from "../schemas/employeeSchema";

vi.mock("../services/roles-service");
vi.mock("../services/employees-service");
vi.mock("./useEmployees");

describe("useEmployeeFormOptions", () => {
  const mockRoles = [
    {
      id: 1,
      name: "Software Developer",
      seniorityLevel: "Junior",
      department: "Engineering",
    },
    {
      id: 2,
      name: "Tester",
      seniorityLevel: "Junior",
      department: "Engineering",
    },
    {
      id: 3,
      name: "Software Developer",
      seniorityLevel: "Mid",
      department: "Engineering",
    },
    { id: 4, name: "Designer", seniorityLevel: "Senior", department: "Design" },
  ];
  const mockFormOptions = {
    employmentType: [
      { label: "Full-Time Permanent", value: "Full-Time" },
      { label: "Part-Time Permanent", value: "Part-Time" },
      { label: "Contractor", value: "Contractor" },
    ],
    pronouns: [
      { label: "He/Him", value: "He/Him" },
      { label: "She/Her", value: "She/Her" },
      { label: "They/Them", value: "They/Them" },
    ],
    workSetup: [
      { label: "Onsite", value: "Onsite" },
      { label: "Hybrid", value: "Hybrid" },
      { label: "Remote", value: "Remote" },
    ],
  };
  const employees = [
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

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getAllRoles).mockResolvedValue(mockRoles);
    vi.mocked(getEmployeeFormEnums).mockResolvedValue(mockFormOptions);
    vi.mocked(useEmployees).mockReturnValue({
      data: employees,
      isFetching: false,
      isError: false,
    } as any);
  });

  it("Should fetch roles on mounting of the component and return on successful fetch", async () => {
    const { result } = renderHook(() => {
      const { control } = useForm<FormValues>();
      return useEmployeeFormOptions(control, undefined);
    });
    // assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasError).toBe(false);
    expect(getAllRoles).toHaveBeenCalledOnce();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    const uniqueRoleNames = result.current.getUniqueOptions("name");
    expect(uniqueRoleNames).toEqual([
      { label: "Software Developer", value: "Software Developer" },
      { label: "Tester", value: "Tester" },
      { label: "Designer", value: "Designer" },
    ]);
    const uniqueDepartments = result.current.getUniqueOptions("department");
    expect(uniqueDepartments).toEqual([
      { label: "Engineering", value: "Engineering" },
      { label: "Design", value: "Design" },
    ]);
    const uniqueSeniority = result.current.getUniqueOptions("seniorityLevel");
    expect(uniqueSeniority).toEqual([
      { label: "Junior", value: "Junior" },
      { label: "Mid", value: "Mid" },
      { label: "Senior", value: "Senior" },
    ]);
    expect(result.current.hasError).toBe(false);
  });

  it("Should return an error when error fetching roles", async () => {
    vi.mocked(getAllRoles).mockRejectedValue(new Error("Error fetching roles"));

    const { result } = renderHook(() => {
      const { control } = useForm<FormValues>();
      return useEmployeeFormOptions(control, undefined);
    });
    // assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasError).toBe(false);
    expect(getAllRoles).toHaveBeenCalledOnce();

    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
    const uniqueRoleNames = result.current.getUniqueOptions("name");
    expect(uniqueRoleNames).toEqual([]);
    const uniqueDepartments = result.current.getUniqueOptions("department");
    expect(uniqueDepartments).toEqual([]);
    const uniqueSeniority = result.current.getUniqueOptions("seniorityLevel");
    expect(uniqueSeniority).toEqual([]);
  });

  it("Should fetch form enums on mounting of the component and return on successful fetch", async () => {
    const { result } = renderHook(() => {
      const { control } = useForm<FormValues>();
      return useEmployeeFormOptions(control, undefined);
    });
    // assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasError).toBe(false);
    expect(getEmployeeFormEnums).toHaveBeenCalledOnce();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.formOptions).toEqual({
      employmentType: [
        { label: "Full-Time Permanent", value: "Full-Time Permanent" },
        { label: "Part-Time Permanent", value: "Part-Time Permanent" },
        { label: "Contractor", value: "Contractor" },
      ],
      pronouns: [
        { label: "He/Him", value: "He/Him" },
        { label: "She/Her", value: "She/Her" },
        { label: "They/Them", value: "They/Them" },
      ],
      workSetup: [
        { label: "Onsite", value: "Onsite" },
        { label: "Hybrid", value: "Hybrid" },
        { label: "Remote", value: "Remote" },
      ],
    });
    expect(result.current.hasError).toBe(false);
  });

  it("Should return an error and blank form options when error fetching form enums", async () => {
    vi.mocked(getEmployeeFormEnums).mockRejectedValue(
      new Error("Error fetching roles"),
    );

    const { result } = renderHook(() => {
      const { control } = useForm<FormValues>();
      return useEmployeeFormOptions(control, undefined);
    });
    // assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasError).toBe(false);
    expect(getEmployeeFormEnums).toHaveBeenCalledOnce();

    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.formOptions).toEqual({
      pronouns: [],
      workSetup: [],
      employmentType: [],
    });
  });

  it("Should return employees when manager options called", async () => {
    const { result } = renderHook(() => {
      const { control } = useForm<FormValues>();
      return useEmployeeFormOptions(control, undefined);
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    // assert
    expect(useEmployees).toHaveBeenCalled();
    expect(result.current.managerOptions).toHaveLength(2);
    expect(result.current.managerOptions).toEqual([
      {
        label: "Sarah Jenkins (Software Developer)",
        value: 1,
      },
      {
        label: "Alex Rivera (Software Developer)",
        value: 2,
      },
    ]);
  });

  it("Should return no employees when no employees returned from fetch", async () => {
    // arrange
    vi.mocked(useEmployees).mockReturnValue({
      data: [],
      isFetching: false,
      isError: false,
    } as any);
    const { result } = renderHook(() => {
      const { control } = useForm<FormValues>();
      return useEmployeeFormOptions(control, undefined);
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    // assert
    expect(result.current.managerOptions).toEqual([]);
  });

  it("Should filter employee if provided to manager options", async () => {
    // arrange
    const { result } = renderHook(() => {
      const { control } = useForm<FormValues>();
      return useEmployeeFormOptions(control, employees[0]);
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    // assert
    expect(result.current.managerOptions).toHaveLength(1);
    expect(result.current.managerOptions).toEqual([
      {
        label: "Alex Rivera (Software Developer)",
        value: 2,
      },
    ]);
  });

  it("Should return loading when employees fetch is loading", async () => {
    // arrange
    vi.mocked(useEmployees).mockReturnValue({
      data: [],
      isFetching: true,
      isError: false,
    } as any);
    const { result } = renderHook(() => {
      const { control } = useForm<FormValues>();
      return useEmployeeFormOptions(control, undefined);
    });
    // assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
  });

  it("Should return error when employees fetch errors", async () => {
    // arrange
    vi.mocked(useEmployees).mockReturnValue({
      data: [],
      isFetching: false,
      isError: true,
    } as any);
    const { result } = renderHook(() => {
      const { control } = useForm<FormValues>();
      return useEmployeeFormOptions(control, undefined);
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    // assert
    expect(result.current.managerOptions).toEqual([]);
    expect(result.current.hasError).toBe(true);
  });

  it("Should filter the roles based on the other selected role fields", async () => {
    const { result } = renderHook(() => {
      const { control } = useForm<FormValues>({
        defaultValues: {
          roleName: "Software Developer",
          seniorityLevel: "Junior",
          department: "Engineering",
        },
      });
      return useEmployeeFormOptions(control, undefined);
    });
    // assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    const filteredRoleNames = result.current.getUniqueOptions("name");
    expect(filteredRoleNames).toEqual([
      { label: "Software Developer", value: "Software Developer" },
      { label: "Tester", value: "Tester" },
    ]);
    const filteredDepartments = result.current.getUniqueOptions("department");
    expect(filteredDepartments).toEqual([
      { label: "Engineering", value: "Engineering" },
    ]);
    const uniqueSeniority = result.current.getUniqueOptions("seniorityLevel");
    expect(uniqueSeniority).toEqual([
      { label: "Junior", value: "Junior" },
      { label: "Mid", value: "Mid" },
    ]);
  });

  it("Should return id of selected role when all fields provided", async () => {
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
    const { result } = renderHook(() => {
      const { control } = useForm<FormValues>({
        defaultValues: {
          roleName: "Software Developer",
          seniorityLevel: "Junior",
          department: "Engineering",
        },
      });
      return useEmployeeFormOptions(control, undefined);
    });
    // assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    const roleId = result.current.getSelectedRoleId(mockFormData);
    expect(roleId).toBe(1);
  });

  it("Should return undefined when no role available with applied fields", async () => {
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
      roleName: "Designer",
      seniorityLevel: "Mid",
      department: "Engineering",
      managerId: "1",
      workSetup: "Onsite",
      employmentType: "Full-Time Permanent",
      startDate: "2024-01-15",
      lastDate: "",
      isCurrentlyEmployed: true,
    };
    const { result } = renderHook(() => {
      const { control } = useForm<FormValues>({
        defaultValues: {
          roleName: "Developer",
          seniorityLevel: "Junior",
          department: "Engineering",
        },
      });
      return useEmployeeFormOptions(control, undefined);
    });
    // assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    const roleId = result.current.getSelectedRoleId(mockFormData);
    expect(roleId).toBe(undefined);
  });
});
