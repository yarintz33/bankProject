import crypto from "crypto";

const secretKey = crypto.randomBytes(32).toString("hex");
console.log(secretKey); // e.g., 'f4d1c7e87b0c4b1b93e2c8e4a8f7d3d9'

export default secretKey;
