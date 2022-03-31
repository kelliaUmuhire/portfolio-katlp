const validateContactForm = () => {
  let c_form_el = document
    .getElementById("contactForm")
    .getElementsByClassName("talk-i");

  let val1 = c_form_el[0].getElementsByTagName("input")[0].value;
  let val2 = c_form_el[1].getElementsByTagName("textarea")[0].value;

  if (val1.length === 0) {
    c_form_el[0].getElementsByClassName("error-msg")[0].innerHTML =
      "Email can't be empty";
  } else if (!val1.includes("@") || !val1.includes(".")) {
    c_form_el[0].getElementsByClassName("error-msg")[0].innerHTML =
      "Email is not valid";
  } else {
    c_form_el[0].getElementsByClassName("error-msg")[0].innerHTML = null;
  }

  if (val2.length === 0) {
    c_form_el[1].getElementsByClassName("error-msg")[0].innerHTML =
      "Message can't be empty";
  } else if (val2.length < 2 || val2.length > 200) {
    c_form_el[1].getElementsByClassName(
      "error-msg"
    )[0].innerHTML = `Message lenght is too ${
      val2.length < 2 ? "short" : "long"
    }`;
  } else {
    c_form_el[0].getElementsByClassName("error-msg")[1].innerHTML = null;
  }
};
