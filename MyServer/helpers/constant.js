const ROLE = {
  ADMIN: "ADMIN",
  CONTRIBUTOR: "CONTRIBUTOR",
  USER: "USER",
};

const PERMISSIONS = [
  {
    role: ROLE.ADMIN,
    resources: [
      {
        path: "/apis/users/",
        methods: "*",
      },
      {
        path: "/apis/books/",
        methods: "*",
      },
      {
        path: "/apis/users/:id",
        methods: "*",
      },
      {
        path: "/apis/books/:id",
        methods: "*",
      },
    ],
  },
  {
    role: ROLE.CONTRIBUTOR,
    resources: [
      { 
        path: "/apis/books/",
        methods: "*",
      },
      {
        path: "/apis/books/:id",
        methods: "*",
      },
    ],
  },
];


module.exports = {
    PERMISSIONS,
    ROLE
};
