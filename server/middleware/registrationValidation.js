function registerValidation(req, res, next) {
  console.log("registerValidation");
  const { firstName, lastName, email, plainPass } = req.body;
  if (
    validateEmail(res, email) &&
    validatePassword(res, plainPass) &&
    allLetter(res, firstName) &&
    allLetter(res, lastName)
  ) {
    next();
  } else {
    console.log("didn't pass validation");
  }
}

function validateEmail(res, email) {
  if (
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  ) {
    return true;
  }
  console.log("bad email format");
  res.status(400).send("bad email format");
}

const validatePassword = (res, pass) => {
  let regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
  if (regex.test(pass)) {
    return true;
  }
  console.log("bad password format");
  res.status(400).send("bad password format");
  return false;
};

function allLetter(res, name) {
  var letters = /^[A-Za-z]+$/;
  if (name.match(letters)) {
    return true;
  }
  console.log("bad name/lastName format");
  res.status(400).send("bad name/lastName format");
  return false;
}

export default registerValidation;
