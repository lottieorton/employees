import {
  createAddress,
  deleteAddress,
  updateAddress,
} from "./addresses-service";

describe("addresses service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockAddress = {
    id: 4,
    unitNumber: "30",
    streetAddress: "Park Lane",
    addressLine2: "Leicester Square",
    city: "London",
    stateProvinceRegion: "Mayfair",
    postalCode: "E1 1GB",
    country: "England",
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

  describe("createAddress", () => {
    it("Should return an address on successful creation", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockAddress,
      } as Response);
      // act
      const result = await createAddress(mockFormData);
      // assert
      expect(result).toEqual(mockAddress);
    });

    it("Should throw a FetchError for response status not 201", async () => {
      // arrange
      const mockAddressErrorResponseBody = {
        timestamp: "2026-09-03T07:09:14.240081Z",
        status: 400,
        error: "Bad Request",
        message: "Couldn't create address",
        path: "/addresses",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockAddressErrorResponseBody,
      } as Response);
      // assert
      await expect(createAddress(mockFormData)).rejects.toThrow(
        "Couldn't create address",
      );
    });

    it("Should throw a FetchError with default error msg if not provided for response status not 201", async () => {
      // arrange
      const mockAddressErrorResponseBody = {
        timestamp: "2026-09-03T07:09:14.240081Z",
        status: 400,
        error: "Bad Request",
        path: "/addresses",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockAddressErrorResponseBody,
      } as Response);
      // assert
      await expect(createAddress(mockFormData)).rejects.toThrow(
        "Failed to create address",
      );
    });

    it("Should throw an error on failed create", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection failed"),
      );
      // assert
      await expect(createAddress(mockFormData)).rejects.toThrow(
        "Network connection failed",
      );
    });
  });

  describe("updateAddress", () => {
    it("Should return an address on successful update", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockAddress,
      } as Response);
      // act
      const result = await updateAddress(1, mockFormData);
      // assert
      expect(result).toEqual(mockAddress);
    });

    it("Should throw a FetchError for !response.ok", async () => {
      // arrange
      const mockAddressErrorResponseBody = {
        timestamp: "2026-09-03T07:09:14.240081Z",
        status: 400,
        error: "Bad Request",
        message: "Couldn't update address",
        path: "/addresses/1",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockAddressErrorResponseBody,
      } as Response);
      // assert
      await expect(updateAddress(1, mockFormData)).rejects.toThrow(
        "Couldn't update address",
      );
    });

    it("Should throw a FetchError with default error msg if not provided for unsuccessful update", async () => {
      // arrange
      const mockAddressErrorResponseBody = {
        timestamp: "2026-09-03T07:09:14.240081Z",
        status: 400,
        error: "Bad Request",
        path: "/addresses/1",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockAddressErrorResponseBody,
      } as Response);
      // assert
      await expect(updateAddress(1, mockFormData)).rejects.toThrow(
        "Failed to update address",
      );
    });

    it("Should throw an error on failed update", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection failed"),
      );
      // assert
      await expect(updateAddress(1, mockFormData)).rejects.toThrow(
        "Network connection failed",
      );
    });
  });

  describe("deleteAddress", () => {
    it("Should return true on successful delete", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response);
      // act
      const result = await deleteAddress(1);
      // assert
      expect(result).toEqual(true);
    });

    it("Should throw a FetchError for !response.ok", async () => {
      // arrange
      const mockAddressErrorResponseBody = {
        timestamp: "2026-09-03T07:09:14.240081Z",
        status: 400,
        error: "Bad Request",
        message: "Couldn't delete address",
        path: "/addresses/1",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockAddressErrorResponseBody,
      } as Response);
      // assert
      await expect(deleteAddress(1)).rejects.toThrow("Couldn't delete address");
    });

    it("Should throw a FetchError with default error msg if not provided for failed delete", async () => {
      // arrange
      const mockAddressErrorResponseBody = {
        timestamp: "2026-09-03T07:09:14.240081Z",
        status: 400,
        error: "Bad Request",
        path: "/addresses/1",
      };
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockAddressErrorResponseBody,
      } as Response);
      // assert
      await expect(deleteAddress(1)).rejects.toThrow(
        "Failed to delete address",
      );
    });

    it("Should throw an error on failed delete", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection failed"),
      );
      // assert
      await expect(deleteAddress(1)).rejects.toThrow(
        "Network connection failed",
      );
    });
  });
});
