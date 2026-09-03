import { FetchError } from "../errors/errors";
import { getAllRoles } from "./roles-service";

describe("roles service", () => {
  describe("getAllRoles", () => {
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
      {
        id: 4,
        name: "Designer",
        seniorityLevel: "Senior",
        department: "Design",
      },
    ];

    it("Should return an array of roles on successful fetch", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockRoles,
      } as Response);
      // act
      const result = await getAllRoles();
      // assert
      expect(result).toEqual(mockRoles);
      expect(fetch).toHaveBeenCalledWith("http://localhost:8080/roles");
    });

    it("Should throw a FetchError for !response.ok", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => {},
      } as Response);
      // assert
      await expect(getAllRoles()).rejects.toThrow(FetchError);
    });

    it("Should throw an error on failed fetch", async () => {
      // arrange
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection failed"),
      );
      // assert
      await expect(getAllRoles()).rejects.toThrow("Network connection failed");
    });
  });
});
