export const MENUITEMS = [

    {
    menutitle: "General",
    menucontent: "Dashboards,Widgets",
    Items: [
      {
        title: "Dashboard",
        icon: "home",
        type: "sub",
        badge: "badge badge-light-primary",
        badgetxt: "1",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/dashboard/default`, title: "Default", type: "link" },
        ]
      },
    ],
  },

  {
    menutitle: "Suivi des Projet",
    menucontent: "Ready to use Apps",
    Items: [
      {
        title: "Project",
        icon: "project",
        type: "sub",
        badge: "badge badge-light-secondary",
        badgetxt: "",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/app/project/project-list`, type: "link", title: "Project-List" },
          { path: `${process.env.PUBLIC_URL}/feicom/projets`,      title: "Projets",      type: "link" },
        ],
      },
    ],
  },

  {
    menutitle: "Gestion FEICOM",
    menucontent: "Tables FEICOM",
    Items: [
      {
        title: "FEICOM",
        icon: "home",          // Choisis une icône principale pour le groupe
        type: "sub",
        badge: "badge badge-light-success", // (optionnel)
        badgetxt: "9",                     // (nombre de tables)
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