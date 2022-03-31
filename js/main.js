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

const validateBlogForm = () => {
  let val1 = document.querySelector("input[name=a_title]").value;
  let val2 = document.querySelector("textarea[name=a_content]").value;

  let r_val = true;

  if (val1.length === 0) {
    document.getElementById("a_title_error").innerHTML = "Name can't be empty";
    r_val = false;
  } else if (val1.length > 100) {
    document.getElementById("a_title_error").innerHTML =
      "Name lenght is too long";
    r_val = false;
  } else {
    document.getElementById("a_title_error").innerHTML = null;
  }

  if (val2.length === 0) {
    document.getElementById("a_content_error").innerHTML =
      "Content can't be empty";
    r_val = false;
  } else if (val2.length > 1000) {
    document.getElementById("a_content_error").innerHTML =
      "Content lenght is too long";
    r_val = false;
  } else {
    document.getElementById("a_content_error").innerHTML = null;
  }

  //validate pic

  return r_val;
};

const saveData = () => {
  if (validateBlogForm()) {
    const imgPath = document.querySelector("input[type=file]").files[0];
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string and save to localStorage
        let blog = {
          title: document.querySelector("input[name=a_title]").value,
          image: reader.result,
          content: document.querySelector("textarea[name=a_content"),
        };
        let blogs = localStorage.getItem("blogs");
        if (!blogs) {
          blogs = [blog];
        } else {
          blogs = JSON.parse(blogs);
          blogs.push(blog);
        }
        localStorage.setItem("blogs", JSON.stringify(blogs));
      },
      false
    );
    if (imgPath) {
      reader.readAsDataURL(imgPath);
    }
  }
};
