import Ajv from "ajv";

export const schemaValidator = (schema, data) => {
    let ajv = new Ajv();
    let validate = ajv.compile(schema);
    let valid = validate(data);
    if (!valid) {
        console.log(validate.errors);
        return false;
    } else {
        return true;
    }
}