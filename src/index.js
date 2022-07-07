const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const db = require("./config/db");
const route = require("./routers");
const SortMiddleware = require("./app/middleware/SortMiddleware");

const app = express();
const port = 3000;

// Connect to mongoose
db.connect();

// view url folder public
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "resources","public")));

// override method http request (get, post ,put,patch,delete...)
app.use(methodOverride("_method"));

// available req.body
app.use(bodyParser.urlencoded({ extended: true }));

// show req.body
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Custom middleware
app.use(SortMiddleware);

app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
      sortable: (filed, sort) => {
        const sortType = filed === sort.column ? sort.type : "default";
        const icons = {
          default: "fa-solid fa-sort",
          asc: "fa-solid fa-arrow-up-short-wide",
          desc: "fa-solid fa-arrow-down-wide-short",
        };
        const types = {
          default: "desc",
          asc: "desc",
          desc: "asc",
        };
        const icon = icons[sortType];
        const type = types[sortType];

        return `<a href="?_sort&column=${filed}&type=${type}"><i class="${icon}"></i></a>`;
      },
    },
  })
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "resources/views"));
app.use(morgan("combined"));

// router // phai đứng dưới đường dẫn public không thì k render vào đc
route(app);

app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}`)
);
