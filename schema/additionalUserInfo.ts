import { z } from "zod";

export const additionalUserInfoSecondPart = z.object({
  useCase: z.enum(["WORK", "STUDY", "PERSONAL_USE"], {
    required_error: "You need to select a use case.",
  }),
});

export type AdditionalUserInfoSecondPart = z.infer<
  typeof additionalUserInfoSecondPart
>;
