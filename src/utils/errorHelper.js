function handleError(err, errFields) {
  const errObject = errFields.reduce((obj, key) => ({ ...obj, [key]: "" }), {});
  errFields.forEach((field) => {
    if (err.search(field) !== -1) {
      errObject[field] = err;
    }
  });

  return errObject;
}

export { handleError };
