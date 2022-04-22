const baseURL = "https://patlp--backend.herokuapp.com/api/";

const login = (i_email, i_password) => {
  if (!validateAuthForms("in")) return;

  let email = i_email
    ? i_email
    : document.querySelector("input[name=email").value;
  let password = i_password
    ? i_password
    : document.querySelector("input[name=password").value;

  axios
    .post(`${baseURL}users/signin`, {
      email,
      password,
    })
    .then((res) => {
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem(
        "authUser",
        JSON.stringify(parseJwt(res.data.token))
      );
      if (parseJwt(res.data.token).role === "admin") {
        window.location.href = "../dashboard/index.html";
      } else {
        window.location.href = "../pages/posts.html";
      }
    })
    .catch((err) => {
      if (err.response.status === 404) {
        document.getElementById("email_err").innerHTML =
          err.response.data.message;
      }
      if (err.response.status === 401) {
        document.getElementById("pass_err").innerHTML =
          err.response.data.message;
      }
    });
};

const register = () => {
  if (!validateAuthForms("up")) return;

  let name = document.querySelector("input[name=u_name").value;
  let email = document.querySelector("input[name=email").value;
  let password = document.querySelector("input[name=password").value;

  axios
    .post(`${baseURL}users/signup`, {
      name,
      email,
      password,
    })
    .then((res) => login(email, password))
    .catch((err) => console.log(err));
};

const getArticles = async (published, author) => {
  try {
    const articles = await axios.get(
      `${baseURL}articles?author=${author}&published=${published}`
    );
    return articles;
  } catch {
    console.log("An error occured");
  }
};

const getArticle = async (dash) => {
  try {
    const id = new URLSearchParams(window.location.search).get("id");
    const article = await axios.get(`${baseURL}articles/${id}`);

    if (dash) {
      return article;
    }

    document.getElementsByClassName("p-post-title")[0].innerHTML =
      article.data.title;
    document.getElementsByClassName("p-post-content")[0].innerHTML =
      article.data.content;
    document.getElementById("p-image").src = article.data.picture;
    document.getElementsByClassName("p-post-doc")[0].innerHTML =
      article.data.created_at.toString().split("T")[0];

    let comments_res = await axios.get(`${baseURL}articles/${id}/comments`);
    let comments = [...comments_res.data];

    if (comments.length > 0) {
      let comments_div = document.getElementsByClassName("cmts")[0];
      for (let i = 0; i < comments.length; i++) {
        let cmt_container = document.createElement("div");
        cmt_container.className = "cmt";
        let cmt_pic = document.createElement("div");
        cmt_pic.className = "cmt-pic";
        cmt_pic.innerHTML = makeProfile(comments[i].userId.name);
        let cm_div = document.createElement("div");
        cm_div.className = "cmt-cont";
        let cm_h = document.createElement("div");
        cm_h.className = "cmt-h";
        let name_span = document.createElement("span");
        name_span.innerHTML = comments[i].userId.name;
        let date_c = document.createElement("span");
        date_c.className = "date_class";
        date_c.innerHTML = comments[i].created_at.toString().split("T")[0];
        cm_h.appendChild(name_span);
        cm_h.appendChild(date_c);
        let cmt_c = document.createElement("div");
        cmt_c.className = "cmt-c";
        let cmt_c_d1 = document.createElement("div");
        cmt_c_d1.innerHTML = comments[i].comment;
        cmt_c.appendChild(cmt_c_d1);

        cm_div.appendChild(cm_h);
        cm_div.appendChild(cmt_c);
        cmt_container.appendChild(cmt_pic);
        cmt_container.appendChild(cm_div);
        comments_div.appendChild(cmt_container);
      }
    }
  } catch {
    console.log("Error occured");
  }
};

const newArticle = (title, content, url, published) => {
  axios
    .post(
      `${baseURL}articles/new`,
      { title, content, picture: url, published },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    )
    .then((res) => (window.location.href = "../dashboard/index.html"))
    .catch((err) => console.log(err));
};

const updateArticle = (id, title, content, url, published) => {
  let data = {};
  if (title) data.title = title;
  if (content) data.content = content;
  if (url) data.picture = url;
  if (published) data.published = published;
  axios
    .patch(`${baseURL}articles/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
    .then((res) => location.reload())
    .catch((err) => console.log(err));
};

const sendComment = (articleId, comment) => {
  axios
    .post(
      `${baseURL}articles/${articleId}/comment`,
      { comment },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    )
    .then((res) => location.reload())
    .catch((err) => console.log(err));
};

const addLike = (number) => {
  const articleId = new URLSearchParams(window.location.search).get("id");
  axios
    .post(`${baseURL}articles/${articleId}/like`, { number })
    .then(
      (res) =>
        (document.getElementById("rate_msg").innerHTML =
          "We're glad you read our article!")
    )
    .catch((err) => console.log(err));
};

const removeArticle = (id) => {
  if (window.confirm("Sure you want to delete this?")) {
    axios
      .delete(`${baseURL}articles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((res) => location.reload())
      .catch((err) => console.log(err));
  }
};

const getUsers = () => {
  axios
    .get(`${baseURL}users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
    .then((res) => {
      if (res.data.length === 0) return;
      let users = res.data.filter(
        (u) => u.email !== JSON.parse(localStorage.getItem("authUser")).email
      );
      if (users) {
        let d_users = document.getElementById("users");
        for (let i = 0; i < users.length; i++) {
          let d_user = document.createElement("div");
          d_user.className = "user";

          let d_profile = document.createElement("div");
          d_profile.className = "profile";
          d_profile.innerHTML = makeProfile(users[i].name);
          let d_name = document.createElement("div");
          d_name.className = "name";
          d_name.innerHTML = users[i].name;

          d_user.appendChild(d_profile);
          d_user.appendChild(d_name);
          d_users.appendChild(d_user);
        }
      }
    })
    .catch((err) => console.log(err));
};

const getUser = async () => {
  try {
    const user = await axios.get(
      `${baseURL}users/${JSON.parse(localStorage.getItem("authUser")).id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    return user;
  } catch {
    console.log("Error occured");
  }
};

const comparePassword = async (password) => {
  const response = await axios.post(
    `${baseURL}users/compare`,
    { password },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );
  return response;
};

const changeProfile = (data) => {
  axios
    .patch(
      `${baseURL}users/${JSON.parse(localStorage.getItem("authUser")).id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    )
    .then((res) => location.reload())
    .catch((err) => console.log(err));
};

const logout = () => {
  localStorage.clear();
  window.location.href = "../index.html";
};

const parseJwt = (token) => {
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};
