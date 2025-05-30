import { z } from "zod";
import { formatHeader } from "@/shared/lib/utils.ts";
import type { User } from "@/entities/user/types.ts";

export type InputType = "text" | "number" | "email" | "select" | "date";

export type FormFieldSchemaConfig = {
  key: string;
  label: string;
  inputType: InputType;
  zodSchema: z.ZodTypeAny;
  defaultValue?: string | number | Date;
  options?: { value: string; label: string }[];
  placeholder?: string;
};

const EXCLUDED_FORM_FIELDS = [
  "user_id",
  "profile_created_date",
  "last_login_date",
  "posts_count",
];

export const getFieldConfig = (
  key: string,
  sampleValue: unknown,
): FormFieldSchemaConfig | null => {
  if (EXCLUDED_FORM_FIELDS.includes(key)) {
    return null;
  }

  const label = formatHeader(key);

  if (
    key.endsWith("_name") ||
    key === "interests" ||
    key === "country" ||
    key === "city" ||
    key === "job_title"
  ) {
    return {
      key,
      label,
      inputType: "text",
      zodSchema: z
        .string({ required_error: `${label} is required.` })
        .min(1, `${label} is required.`)
        .max(80, `${label} must be 80 characters or less.`),
      placeholder: `Enter ${label.toLowerCase()}`,
      defaultValue: "",
    };
  }

  if (key === "email") {
    return {
      key,
      label,
      inputType: "email",
      zodSchema: z
        .string({ required_error: `${label} is required.` })
        .email({ message: `${label} must be a valid email.` })
        .min(1, `${label} is required.`),
      placeholder: `Enter ${label.toLowerCase()}`,
    };
  }

  if (key === "age" || key.endsWith("_count")) {
    return {
      key,
      label,
      inputType: "number",
      zodSchema: z.coerce
        .number({
          required_error: `${label} is required.`,
          invalid_type_error: `${label} must be a number.`,
        })
        .int({ message: `${label} must be an integer.` })
        .positive({ message: `${label} must be a positive number.` }),
      placeholder: `Enter ${label.toLowerCase()}`,
      defaultValue: "",
    };
  }

  if (key === "gender") {
    return {
      key,
      label,
      inputType: "select",
      zodSchema: z
        .string({ required_error: `${label} is required.` })
        .min(1, `${label} is required.`),
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
      ],
      placeholder: `Select ${label.toLowerCase()}`,
      defaultValue: "",
    };
  }

  if (key === "relationship_status") {
    return {
      key,
      label,
      inputType: "select",
      zodSchema: z
        .string({ required_error: `${label} is required.` })
        .min(1, `${label} is required.`),
      options: [
        { value: "Married", label: "Married" },
        { value: "Engaged", label: "Engaged" },
        { value: "In a relationship", label: "In a relationship" },
        { value: "Single", label: "Single" },
      ],
      placeholder: `Select ${label.toLowerCase()}`,
      defaultValue: "",
    };
  }

  if (key === "education_level") {
    return {
      key,
      label,
      inputType: "select",
      zodSchema: z
        .string({ required_error: `${label} is required.` })
        .min(1, `${label} is required.`),
      options: [
        { value: "High School Diploma", label: "High School Diploma" },
        { value: "Associate's Degree", label: "Associate's Degree" },
        { value: "Bachelor's Degree", label: "Bachelor's Degree" },
        { value: "Doctorate", label: "Doctorate" },
        { value: "Master's Degree", label: "Master's Degree" },
      ],
      placeholder: `Select ${label.toLowerCase()}`,
      defaultValue: "",
    };
  }

  if (
    typeof sampleValue === "string" ||
    typeof sampleValue === "number" ||
    sampleValue === undefined
  ) {
    return {
      key,
      label,
      inputType: "text",
      zodSchema: z
        .string({ required_error: `${label} is required.` })
        .min(1, `${label} is required.`)
        .max(80, `${label} must be 80 characters or less.`),
      placeholder: `Enter ${label.toLowerCase()}`,
      defaultValue: "",
    };
  }

  console.warn(`Could not determine form config for key: ${key}`);
  return null;
};

export const generateFormFieldConfigs = (
  sampleData?: Partial<User>,
): FormFieldSchemaConfig[] => {
  if (!sampleData) return [];

  return Object.keys(sampleData)
    .map((key) => getFieldConfig(key, sampleData[key]))
    .filter((config) => config !== null);
};

export const generateFormSchema = (
  fieldConfigs: FormFieldSchemaConfig[],
): z.ZodObject<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  "strip",
  z.ZodTypeAny,
  { [x: string]: unknown },
  { [x: string]: unknown }
> => {
  const shape: Record<string, z.ZodTypeAny> = {};
  fieldConfigs.forEach((field) => {
    shape[field.key] = field.zodSchema;
  });
  return z.object(shape);
};

export const generateDefaultValues = (
  fieldConfigs: FormFieldSchemaConfig[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> => {
  const defaultValues: Record<string, unknown> = {};
  fieldConfigs.forEach((field) => {
    defaultValues[field.key] = field.defaultValue ?? "";
  });
  return defaultValues;
};
