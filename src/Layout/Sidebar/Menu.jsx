export const MENUITEMS = [
  {
    menutitle: "General",
    menucontent: "Dashboards,and Widgets",
    Items: [
      {
        path: `${process.env.PUBLIC_URL}/Pages/FeicomPages/HomePage/Page1`,
        icon: "home",
        title: "Dashbaord",
        type: "link",
      },
      {
        title: "Projects",
        icon: "project",
        type: "sub",
        badge: "badge badge-light-primary",
        badgetxt: "2",
        active: false,
        children: [
          {
            path: `${process.env.PUBLIC_URL}/app/project/project-list`,
            icon: "editors",
            title: "Project Grid",
            type: "link",
          },
          {
            path: `${process.env.PUBLIC_URL}/feicom/projets`,
            icon: "editors",
            title: "Project Table",
            type: "link",
          },
        ],
      },

      {
        path: `${process.env.PUBLIC_URL}/app/file-manager`,
        icon: "editors",
        title: "Visit Reports",
        type: "link",
      },
      {
        path: `${process.env.PUBLIC_URL}/Pages/FeicomPages/ProjectPage/SingleProject`,
        icon: "editors",
        title: "Project Detail",
        type: "link",
      },
    ],
  },

    {
    menutitle: "Administration",
    menucontent: "Dashboards,and Widgets",
    Items: [
      
      {
        title: "CRUD Operations",
        icon: "widget",
        type: "sub",
        badge: "badge badge-light-primary",
        badgetxt: "6",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/feicom/departements`, title: "Départements", type: "link" },
          { path: `${process.env.PUBLIC_URL}/feicom/agences`,      title: "Agences",      type: "link" },
          { path: `${process.env.PUBLIC_URL}/feicom/communes`,     title: "Communes",     type: "link" },
          { path: `${process.env.PUBLIC_URL}/feicom/entreprises`,  title: "Entreprises",  type: "link" },
          { path: `${process.env.PUBLIC_URL}/feicom/lots`,         title: "Lots",         type: "link" },
          { path: `${process.env.PUBLIC_URL}/feicom/todos`,        title: "Todos",        type: "link" },
          { path: `${process.env.PUBLIC_URL}/feicom/visites`,      title: "Visites",      type: "link" },
          { path: `${process.env.PUBLIC_URL}/feicom/exercise`,     title:"Exercise",      type: "link" },
          
        ],
      },
    ],
  },
];