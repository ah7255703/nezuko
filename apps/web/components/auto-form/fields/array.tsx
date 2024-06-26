import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { beautifyObjectName } from "../utils";
import AutoFormObject from "./object";

function isZodArray(
  item: z.ZodArray<any> | z.ZodDefault<any>,
): item is z.ZodArray<any> {
  return item instanceof z.ZodArray;
}

function isZodDefault(
  item: z.ZodArray<any> | z.ZodDefault<any>,
): item is z.ZodDefault<any> {
  return item instanceof z.ZodDefault;
}

export default function AutoFormArray({
  name,
  item,
  form,
  path = [],
  fieldConfig,
}: {
  name: string;
  item: z.ZodArray<any> | z.ZodDefault<any>;
  form: ReturnType<typeof useForm>;
  path?: string[];
  fieldConfig?: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  });
  const title = item._def.description ?? beautifyObjectName(name);

  const itemDefType = isZodArray(item)
    ? item._def.type
    : isZodDefault(item)
      ? item._def.innerType._def.type
      : null;

  return (
    <AccordionItem value={name} className="border-none">
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        {fields.map((_field, index) => {
          const key = _field.id;
          return (
            <div className="mt-4 flex flex-col" key={`${key}`}>
              <AutoFormObject
                schema={itemDefType as z.ZodObject<any, any>}
                form={form}
                fieldConfig={fieldConfig}
                path={[...path, index.toString()]}
              />
              <div className="my-4 flex justify-end">
                <Button
                  variant="destructive"
                  size="xicon"
                  type="button"
                  onClick={() => remove(index)}
                >
                  <Trash className="size-4" />
                </Button>
              </div>

              <Separator />
            </div>
          );
        })}
        <Button
          type="button"
          variant="secondary"
          onClick={() => append({})}
          className="mt-4 flex items-center"
          size='xicon'
        >
          <Plus size={16} />
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}
