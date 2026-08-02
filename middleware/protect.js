const authHeader = req.headers.authorization;

console.log("Authorization:", authHeader);

const token = authHeader?.startsWith("Bearer ")
  ? authHeader.split(" ")[1]
  : null;

console.log("Token:", token);