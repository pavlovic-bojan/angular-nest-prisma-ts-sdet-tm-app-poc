import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { readFileSync } from "fs";
import path from "path";

const SCHEMAS_DIR = path.resolve(__dirname, "../api/schemas");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

function loadSchema(name: string): ValidateFunction {
  const schemaPath = path.join(SCHEMAS_DIR, `${name}.schema.json`);
  const schema = JSON.parse(readFileSync(schemaPath, "utf-8"));
  return ajv.compile(schema);
}

export const validateUser = loadSchema("user");
export const validateProject = loadSchema("project");
export const validateTask = loadSchema("task");
export const validateLoginResponse = loadSchema("login-response");
export const validateDeleteResponse = loadSchema("delete-response");

export function assertValidSchema(validate: ValidateFunction, data: unknown): void {
  const valid = validate(data);
  if (!valid) {
    throw new Error(
      `Schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`
    );
  }
}
