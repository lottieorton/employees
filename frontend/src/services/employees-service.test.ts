import { FetchError } from "../errors/errors";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "./employees-service";

describe("employees service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  describe("getAllEmployees", () => {
    it("Should return an array of employees on successful fetch with no search query", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockEmployees,
      } as Response);
      // act
      const result = await getAllEmployees();
      // assert
      expect(result).toEqual(mockEmployees);
      expect(fetch).toHaveBeenCalledWith("http://localhost:8080/employees");
    });

    it("Should return an array of employees on successful fetch with search query", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockEmployees,
      } as Response);
      const mockSearchQuery = { search: "Software Developer" };
      // act
      const result = await getAllEmployees(mockSearchQuery);
      // assert
      expect(result).toEqual(mockEmployees);
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/employees?search=Software+Developer",
      );
    });

    it("Should throw a FetchError for !response.ok", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => {},
      } as Response);
      // assert
      await expect(getAllEmployees()).rejects.toThrow(FetchError);
    });

    it("Should throw an error on failed fetch", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection failed"),
      );
      // assert
      await expect(getAllEmployees()).rejects.toThrow(
        "Network connection failed",
      );
    });
  });

  describe("getEmployeeById", () => {
    it("Should return an employee on successful fetch", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockEmployee,
      } as Response);
      // act
      const result = await getEmployeeById("1");
      // assert
      expect(result).toEqual(mockEmployee);
      expect(fetch).toHaveBeenCalledWith("http://localhost:8080/employees/1");
    });

    it("Should throw and error if no id provided", async () => {
      // assert
      await expect(getEmployeeById).rejects.toThrow("Invalid employee ID");
      expect(fetch).not.toHaveBeenCalled();
    });

    it("Should throw a FetchError for !response.ok", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => {},
      } as Response);
      // assert
      await expect(getEmployeeById("100")).rejects.toThrow(FetchError);
    });

    it("Should throw an error on failed fetch", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection failed"),
      );
      // assert
      await expect(getEmployeeById("1")).rejects.toThrow(
        "Network connection failed",
      );
    });
  });

  describe("createEmployee", () => {
    it("Should return an employee on successful creation", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockEmployee,
      } as Response);
      // act
      const result = await createEmployee(mockFormData);
      // assert
      expect(result).toEqual(mockEmployee);
    });

    it("Should throw a FetchError for response status not 201", async () => {
      // arrange
      const mockEmployeeErrorResponseBody = {
        timestamp: "2026-09-03T07:09:14.240081Z",
        status: 400,
        error: "Bad Request",
        message: "Couldn't create employee",
        path: "/employees",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockEmployeeErrorResponseBody,
      } as Response);
      // assert
      await expect(createEmployee(mockFormData)).rejects.toThrow(
        "Couldn't create employee",
      );
    });

    it("Should throw a FetchError with default error msg if not provided for response status not 201", async () => {
      // arrange
      const mockEmployeeErrorResponseBody = {
        timestamp: "2026-09-03T07:09:14.240081Z",
        status: 400,
        error: "Bad Request",
        path: "/employees",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockEmployeeErrorResponseBody,
      } as Response);
      // assert
      await expect(createEmployee(mockFormData)).rejects.toThrow(
        "Failed to create employee",
      );
    });

    it("Should throw an error on failed create", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection failed"),
      );
      // assert
      await expect(createEmployee(mockFormData)).rejects.toThrow(
        "Network connection failed",
      );
    });
  });

  describe("updateEmployee", () => {
    it("Should return an employee on successful update", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockEmployee,
      } as Response);
      // act
      const result = await updateEmployee(1, mockFormData);
      // assert
      expect(result).toEqual(mockEmployee);
    });

    it("Should throw a FetchError for !response.ok", async () => {
      // arrange
      const mockEmployeeErrorResponseBody = {
        timestamp: "2026-09-03T07:09:14.240081Z",
        status: 400,
        error: "Bad Request",
        message: "Couldn't update employee",
        path: "/employees/1",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockEmployeeErrorResponseBody,
      } as Response);
      // assert
      await expect(updateEmployee(1, mockFormData)).rejects.toThrow(
        "Couldn't update employee",
      );
    });

    it("Should throw a FetchError with default error msg if not provided for !response.ok", async () => {
      // arrange
      const mockEmployeeErrorResponseBody = {
        timestamp: "2026-09-03T07:09:14.240081Z",
        status: 400,
        error: "Bad Request",
        path: "/employees/1",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockEmployeeErrorResponseBody,
      } as Response);
      // assert
      await expect(updateEmployee(1, mockFormData)).rejects.toThrow(
        "Failed to update employee",
      );
    });

    it("Should throw an error on failed update", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection failed"),
      );
      // assert
      await expect(updateEmployee(1, mockFormData)).rejects.toThrow(
        "Network connection failed",
      );
    });
  });

  describe("deleteEmployee", () => {
    it("Should return true on a successful delete", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response);
      // act
      const result = await deleteEmployee(1);
      // assert
      expect(result).toEqual(true);
    });

    it("Should throw a FetchError for !response.ok", async () => {
      // arrange
      const mockEmployeeErrorResponseBody = {
        timestamp: "2026-09-03T07:09:14.240081Z",
        status: 400,
        error: "Bad Request",
        message: "Couldn't find employee with id 1",
        path: "/employees/1",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockEmployeeErrorResponseBody,
      } as Response);
      // assert
      await expect(deleteEmployee(1)).rejects.toThrow(
        "Couldn't find employee with id 1",
      );
    });

    it("Should throw a FetchError with default error msg if not provided for !response.ok", async () => {
      // arrange
      const mockEmployeeErrorResponseBody = {
        timestamp: "2026-09-03T07:09:14.240081Z",
        status: 400,
        error: "Bad Request",
        path: "/employees/1",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockEmployeeErrorResponseBody,
      } as Response);
      // assert
      await expect(deleteEmployee(1)).rejects.toThrow(
        "Failed to delete employee",
      );
    });

    it("Should throw an error on failed delete", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection failed"),
      );
      // assert
      await expect(deleteEmployee(1)).rejects.toThrow(
        "Network connection failed",
      );
    });
  });
});
