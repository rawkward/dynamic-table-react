import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  FormFieldSchemaConfig,
  InputType as CustomInputType,
} from "../form-config.ts";
import { generateFormSchema, generateDefaultValues } from "../form-config.ts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/components/Form/form";
import { Input } from "@/shared/ui/components/Input/input";
import { Button } from "@/shared/ui/components/Button/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/components/Select/select";
import {
  createUser,
  type CreateUserPayload,
} from "@/features/users-form/api/create-user.ts";
import {endpoint} from "@/shared/api/config.ts";

type CreateUserFormProps = {
  fieldConfigs: FormFieldSchemaConfig[];
  onFormSubmitSuccess?: () => void;
}

export const CreateUserForm = ({
  fieldConfigs,
  onFormSubmitSuccess,
}: CreateUserFormProps) => {
  const queryClient = useQueryClient();

  const formSchema = generateFormSchema(fieldConfigs);
  type FormValues = z.infer<typeof formSchema>;
  const defaultValues = generateDefaultValues(fieldConfigs);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      form.reset();
      onFormSubmitSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to create user:", error.message);
    },
  });

  const getInputValue = (value: unknown): string | number => {
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    return "";
  };

  const onSubmit = (values: FormValues) => {
    const currentDate = new Date().toISOString();

    const payload: CreateUserPayload = {
      ...values,
      profile_created_date: currentDate,
      last_login_date: currentDate,
      posts_count: 0,
    } as CreateUserPayload;

    createUserMutation.mutate(payload);
  };

  if (!fieldConfigs.length) {
    return <p>Form configuration is not available. Cannot render form.</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
          {fieldConfigs.map((config) => (
            <FormField
              key={config.key}
              control={form.control}
              name={config.key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{config.label}</FormLabel>
                  {config.inputType === "select" ? (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value as string}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={config.placeholder} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {config.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <FormControl>
                      <Input
                        type={config.inputType as CustomInputType}
                        placeholder={config.placeholder}
                        {...field}
                        value={getInputValue(field.value)}
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button
          type="submit"
          disabled={createUserMutation.isPending || form.formState.isSubmitting}
          className="w-full"
        >
          {createUserMutation.isPending ? "Submitting..." : "Create User"}
        </Button>
      </form>
    </Form>
  );
};
