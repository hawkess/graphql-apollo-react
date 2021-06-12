function handleError(err) {
  const errFields = ["name", "user", "password"];
  const errObject = { name: "", user: "", password: "" };
  errFields.forEach((field) => {
    if (err.search(field) !== -1) {
      errObject[field] = err;
    }
  });

  return errObject;
}

export { handleError };
