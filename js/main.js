function checkNav() {
  let nav_links = document.getElementsByClassName("nav-links")[0];
  if (localStorage.getItem("authToken")) {
    nav_links.innerHTML = "";
    let a1 = document.createElement("a");
    a1.innerHTML = "Home";
    a1.href = "../index.html";
    let a2 = document.createElement("a");
    a2.innerHTML = "Profile";
    a2.href = "./profile.html";
    let a3 = document.createElement("a");
    a3.innerHTML = "Log out";
    // a3.href = "../index.html";
    a3.addEventListener("click", () => logout());
    a3.style.cursor = "pointer";
    nav_links.appendChild(a1);
    nav_links.appendChild(a2);
    nav_links.appendChild(a3);
  }
}

/** Profile */
function fillProfile() {
  getUser().then((res) => {
    document.querySelector("input[name=p_name]").value = res.data.name;
    document.querySelector("input[name=p_email]").value = res.data.email;
    // document.querySelector("input[name=p_password]").value = res.data.password
    //   ? res.data.password
    //   : "123456";
    if (res.data.role === "admin") {
      document.getElementById("home_link").href = "../dashboard/index.html";
    }
  });
}

function showPassword(c_name) {
  let p_password = document.querySelector(`input[name=${c_name}]`);
  if (p_password.type === "text") {
    p_password.type = "password";
  } else p_password.type = "text";
  // if (p_password.type === "password") p_password.type = "text";
}

function updateProfile() {
  if (!validateAuthForms("profile")) return;

  let opass = document.querySelector("input[name=old_p_password]").value;
  let npass = document.querySelector("input[name=p_password]").value;
  let name = document.querySelector("input[name=p_name]").value;

  if (opass && npass) {
    comparePassword(opass)
      .then((res) => {
        if ((res.data.message = "ok")) changeProfile({ password: npass, name });
      })
      .catch(
        (err) =>
          (document.getElementById("old_password_error").innerHTML =
            err.response.data.message)
      );
  } else changeProfile({ name });
}
/****/

const validateContactForm = () => {
  let c_form_el = document
    .getElementById("contactForm")
    .getElementsByClassName("talk-i");

  let val1 = c_form_el[0].getElementsByTagName("input")[0].value;
  let val2 = c_form_el[1].getElementsByTagName("textarea")[0].value;

  if (val1.length === 0) {
    c_form_el[0].getElementsByClassName("error-msg")[0].innerHTML =
      "Email field can't be empty";
  } else if (!val1.includes("@") || !val1.includes(".")) {
    c_form_el[0].getElementsByClassName("error-msg")[0].innerHTML =
      "Email is not valid";
  } else {
    c_form_el[0].getElementsByClassName("error-msg")[0].innerHTML = null;
  }

  if (val2.length === 0) {
    c_form_el[1].getElementsByClassName("error-msg")[0].innerHTML =
      "Message field can't be empty";
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

const validateBlogForm = (type) => {
  let val1 = document.querySelector("input[name=a_title]").value;
  let val2 = document.querySelector("textarea[name=a_content]").value;
  let img_div = document.getElementById("photoName");

  let r_val = false;

  if (val1.length === 0) {
    document.getElementById("a_title_error").innerHTML =
      "Name field can't be empty";
  } else if (val1.length > 100) {
    document.getElementById("a_title_error").innerHTML =
      "Name lenght is too long";
  } else {
    document.getElementById("a_title_error").innerHTML = null;
    r_val = true;
  }

  if (val2.length === 0) {
    document.getElementById("a_content_error").innerHTML =
      "Content field can't be empty";
  } else if (val2.length > 30000) {
    document.getElementById("a_content_error").innerHTML =
      "Content lenght is too long";
  } else {
    document.getElementById("a_content_error").innerHTML = null;
    r_val = true;
  }

  if (type !== "update") {
    if (!document.querySelector("input[name=custom_img]").files[0]) {
      img_div.style.color = "rgb(255, 146, 146)";
      img_div.innerHTML = "Picture field is required";
    } else {
      img_div.style.color = "#ededed";
    }
  }
  return r_val;
};

const validateAuthForms = (type) => {
  let email =
    type === "profile"
      ? document.querySelector("input[name=p_email").value
      : document.querySelector("input[name=email").value;
  let password =
    type !== "profile"
      ? document.querySelector("input[name=password").value
      : null;
  let valid = true;

  if (email.length === 0) {
    document.getElementById("email_err").innerHTML =
      "Email field can't be empty";
    valid = false;
  } else if (!email.includes("@") || !email.includes(".")) {
    document.getElementById("email_err").innerHTML = "Email is not valid";
    valid = false;
  } else {
    document.getElementById("email_err").innerHTML = null;
    valid = true;
  }

  if (type !== "profile") {
    if (password.length === 0) {
      document.getElementById("pass_err").innerHTML =
        "Password field can't be empty";
      valid = false;
    } else if (password.length < 6) {
      document.getElementById("pass_err").innerHTML =
        "Password lenght must not be less than 6";
      valid = false;
    } else if (password.length > 30) {
      document.getElementById("pass_err").innerHTML =
        "Password lenght too long";
      valid = false;
    } else {
      document.getElementById("pass_err").innerHTML = null;
      valid = true;
    }
  }

  if (type === "up" || type === "profile") {
    let name =
      type === "profile"
        ? document.querySelector("input[name=p_name").value
        : document.querySelector("input[name=u_name").value;
    if (name.length === 0) {
      document.getElementById("name_err").innerHTML =
        "Name field can't be empty";
      valid = false;
    } else if (name.length < 3) {
      document.getElementById("name_err").innerHTML =
        "Name lenght must not be less than 3";
      valid = false;
    } else if (name.length > 50) {
      document.getElementById("name_err").innerHTML = "name lenght too long";
      valid = false;
    } else {
      document.getElementById("name_err").innerHTML = null;
      valid = true;
    }
  }

  return valid;
};

const addComment = () => {
  let comment = document.querySelector("textarea[name=comment]").value;
  if (comment.length === 0) {
    document.getElementById("comment_err").innerHTML =
      "Comment field can't be empty";
  } else if (comment.length < 2) {
    document.getElementById("comment_err").innerHTML = "Comment is too short";
  } else if (comment.length > 300) {
    document.getElementById("comment_err").innerHTML = "Comment is too long";
  } else {
    document.getElementById("comment_err").innerHTML = null;
    if (!localStorage.getItem("authToken")) {
      window.location.href = "../pages/login.html";
    } else {
      let articleId = new URLSearchParams(window.location.search).get("id");
      sendComment(articleId, comment);
    }
  }
};

const saveData = () => {
  if (validateBlogForm()) {
    let imgPath = document.querySelector("input[type=file]").files[0];
    let body = new FormData();
    body.set("key", "298034d3800cbebc036e919c320a1f11");
    body.append("image", imgPath);

    axios({
      method: "post",
      url: "https://api.imgbb.com/1/upload",
      data: body,
    })
      .then((res) => {
        let url = res.data.data.display_url;
        let title = document.querySelector("input[name=a_title]").value;
        let content = document.querySelector("textarea[name=a_content]").value;

        newArticle(
          title,
          content,
          url,
          document.querySelector("input[name=isPublished]").checked
        );
      })
      .catch((err) => console.log(err));
  }
};

const updateBlog = () => {
  if (validateBlogForm("update")) {
    const imgPath = document.querySelector("input[type=file]").files[0];
    const id = new URLSearchParams(window.location.search).get("id");

    let title = document.querySelector("input[name=a_title]").value;
    let content = document.querySelector("textarea[name=a_content").value;
    let published = document.querySelector("input[name=isPublished]").checked;

    if (!imgPath) {
      updateArticle(id, title, content, null, published);
    } else {
      let body = new FormData();
      body.set("key", "298034d3800cbebc036e919c320a1f11");
      body.append("image", imgPath);
      axios({
        method: "post",
        url: "https://api.imgbb.com/1/upload",
        data: body,
      })
        .then((res) => {
          updateArticle(
            id,
            title,
            content,
            res.data.data.display_url,
            published
          );
        })
        .catch((err) => console.log(err));
    }
  }
};

const makeProfile = (name) =>
  name.split(" ")[1] ? name[0].concat(name.split(" ")[1][0]) : name[0];
