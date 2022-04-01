function checkNav() {
  let nav_links = document.getElementsByClassName("nav-links")[0];
  if (localStorage.getItem("auth_user")) {
    nav_links.innerHTML = "";
    let a1 = document.createElement("a");
    a1.innerHTML = "Home";
    a1.href = "../index.html";
    let a2 = document.createElement("a");
    a2.innerHTML = "Profile";
    a2.href = "./profile.html";
    let a3 = document.createElement("a");
    a3.innerHTML = "Log out";
    a3.href = "../index.html";
    nav_links.appendChild(a1);
    nav_links.appendChild(a2);
    nav_links.appendChild(a3);
  }
}

/** Profile */
function fillProfile() {
  let user = localStorage.getItem("auth_user");
  if (user) {
    user = JSON.parse(user);
    document.querySelector("input[name=p_name]").value = user.name;
    document.querySelector("input[name=p_email]").value = user.email;
    document.querySelector("input[name=p_password]").value = user.password
      ? user.password
      : "123456";
  }
}

function showPassword() {
  let p_password = document.querySelector("input[name=p_password]");
  if (p_password.type === "text") {
    p_password.type = "password";
  }
  if (p_password.type === "password") p_password.type = "text";
}

function updateProfile() {
  if (!validateAuthForms("profile")) return;

  let users = localStorage.getItem("users");
  if (users) {
    users = JSON.parse(users);
    let u = users.findIndex(
      (u) => u.email === document.querySelector("input[name=p_email]").value
    );
    if (u > -1) {
      let uname = document.querySelector("input[name=p_name]").value;
      let profile = uname[0];
      if (uname.split(" ")[1]) profile = profile.concat(uname.split(" ")[1][0]);
      users[u].name = uname;
      users[u].password = document.querySelector(
        "input[name=p_password]"
      ).value;
      localStorage.setItem("users", JSON.stringify(users));
    }
  }
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
  } else if (val2.length > 1000) {
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

const saveData = () => {
  if (validateBlogForm()) {
    const imgPath = document.querySelector("input[type=file]").files[0];
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string and save to localStorage
        let blog = {
          id: Math.random(1, 10000),
          title: document.querySelector("input[name=a_title]").value,
          image: reader.result,
          content: document.querySelector("textarea[name=a_content").value,
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

    window.location.href = "../dashboard/index.html";
  }
};

const updateBlog = () => {
  if (validateBlogForm("update")) {
    const imgPath = document.querySelector("input[type=file]").files[0];
    const id = new URLSearchParams(window.location.search).get("id");
    let u = blogs.findIndex((x) => x.id === parseFloat(id));
    blogs[u].title = document.querySelector("input[name=a_title]").value;
    blogs[u].content = document.querySelector("textarea[name=a_content").value;

    if (!imgPath) {
      localStorage.setItem("blogs", JSON.stringify(blogs));
    } else {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          blogs[u].image = reader.result;
          localStorage.setItem("blogs", JSON.stringify(blogs));
        },
        false
      );
      if (imgPath) {
        reader.readAsDataURL(imgPath);
      }
    }

    window.location.href = "../dashboard/index.html";
  }
};

const validateAuthForms = (type) => {
  let email =
    type === "profile"
      ? document.querySelector("input[name=p_email").value
      : document.querySelector("input[name=email").value;
  let password =
    type === "profile"
      ? document.querySelector("input[name=p_password").value
      : document.querySelector("input[name=password").value;
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

  if (password.length === 0) {
    document.getElementById("pass_err").innerHTML =
      "Password field can't be empty";
    valid = false;
  } else if (password.length < 6) {
    document.getElementById("pass_err").innerHTML =
      "Password lenght must not be less than 6";
    valid = false;
  } else if (password.length > 30) {
    document.getElementById("pass_err").innerHTML = "Password lenght too long";
    valid = false;
  } else {
    document.getElementById("pass_err").innerHTML = null;
    valid = true;
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

const loginFunc = () => {
  let email = document.querySelector("input[name=email").value;

  if (!validateAuthForms("in")) return;

  let users = localStorage.getItem("users");
  if (users) {
    users = JSON.parse(users);
    let user = users.find((x) => x.email === email);
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
      if (user.role === "admin") {
        window.location.href = "../dashboard/index.html";
      } else {
        window.location.href = "../pages/posts.html";
      }
    } else {
      //add error message
    }
  }
};

const registerFunc = () => {
  if (!validateAuthForms("up")) return;
  let users = localStorage.getItem("users");
  let uname = document.querySelector("input[name=u_name").value;
  let profile = uname[0];
  if (uname.split(" ")[1]) profile = profile.concat(uname.split(" ")[1][0]);
  let user = {
    name: uname,
    email: document.querySelector("input[name=email").value,
    profile,
    password: document.querySelector("input[name=password").value,
  };
  if (users) {
    users = JSON.parse(users);
    users.push(user);
  } else {
    users = [user];
  }
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("auth_user", JSON.stringify(user));
  window.location.href = "../pages/posts.html";
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
    if (!localStorage.getItem("auth_user")) {
      window.location.href = "../pages/register.html";
    } else {
      //add the comment
      let comments = localStorage.getItem("comments");
      if (comments) {
        comments = JSON.parse(comments);
        comments.push({
          id: Math.random(1, 10000),
          user: { ...JSON.parse(localStorage.getItem("auth_user")) },
          comment,
        });
      } else {
        comments = [
          {
            id: Math.random(1, 10000),
            user: { ...JSON.parse(localStorage.getItem("auth_user")) },
            comment,
          },
        ];
      }
      localStorage.setItem("comments", JSON.stringify(comments));
      location.reload();
    }
  }
};

const removeArticle = (id) => {
  if (window.confirm("Sure you want to delete this?")) {
    let blogs = JSON.parse(localStorage.getItem("blogs"));
    blogs = blogs.filter((x) => x.id !== id);
    localStorage.setItem("blogs", JSON.stringify(blogs));
    location.reload();
  }
};

const likeBlog = (num) => {
  const id = new URLSearchParams(window.location.search).get("id");
  let blogs = JSON.parse(localStorage.getItem("blogs"));
  let u = blogs.findIndex((x) => x.id === parseFloat(id));

  if (u > -1) {
    if (blogs[u].likes) {
      blogs[u].likes += num;
    } else {
      blogs[u].likes = num;
    }
    localStorage.setItem("blogs", JSON.stringify(blogs));
  }
};
