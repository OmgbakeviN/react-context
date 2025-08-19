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
            title: "Grid View",
            type: "link",
          },
          {
            path: `${process.env.PUBLIC_URL}/feicom/projets`,
            icon: "editors",
            title: "Table View",
            type: "link",
          },
        ],
      },

      {
        path: `${process.env.PUBLIC_URL}/feicom/visites`,
        icon: "editors",
        title: "Visit Reports",
        type: "link",
      },
      // {
      //   path: `${process.env.PUBLIC_URL}/Pages/FeicomPages/ProjectPage/SingleProject`,
      //   icon: "editors",
      //   title: "Project Detail",
      //   type: "link",
      // },
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
          {
            path: `${process.env.PUBLIC_URL}/feicom/departements`,
            title: "Départements",
            type: "link",
          },
          {
            path: `${process.env.PUBLIC_URL}/feicom/agences`,
            title: "Agences",
            type: "link",
          },
          {
            path: `${process.env.PUBLIC_URL}/feicom/communes`,
            title: "Communes",
            type: "link",
          },
          {
            path: `${process.env.PUBLIC_URL}/feicom/entreprises`,
            title: "Entreprises",
            type: "link",
          },
          {
            path: `${process.env.PUBLIC_URL}/feicom/lots`,
            title: "Lots",
            type: "link",
          },
          {
            path: `${process.env.PUBLIC_URL}/feicom/todos`,
            title: "Todos",
            type: "link",
          },
          {
            path: `${process.env.PUBLIC_URL}/feicom/exercise`,
            title: "Exercise",
            type: "link",
          },
        ],
      },
    ],
  },

  // {
  //   menutitle: "Forms & Table",
  //   menucontent: "Ready to use froms & tables",
  //   Items: [
  //     {
  //       title: "Forms",
  //       icon: "form",
  //       type: "sub",
  //       menutitle: "Forms & Table",
  //       menucontent: "Ready to use froms & tables",
  //       active: false,
  //       children: [
  //         {
  //           title: "Controls",
  //           type: "sub",
  //           children: [
  //             {
  //               title: "Validation",
  //               type: "link",
  //               path: `${process.env.PUBLIC_URL}/forms/controls/validation`,
  //             },
  //             {
  //               title: "Input",
  //               type: "link",
  //               path: `${process.env.PUBLIC_URL}/forms/controls/input`,
  //             },
  //             {
  //               title: "Radio-Checkbox",
  //               type: "link",
  //               path: `${process.env.PUBLIC_URL}/forms/controls/radio-checkbox`,
  //             },
  //             {
  //               title: "Group",
  //               type: "link",
  //               path: `${process.env.PUBLIC_URL}/forms/controls/group`,
  //             },
  //             {
  //               title: "MegaOption",
  //               type: "link",
  //               path: `${process.env.PUBLIC_URL}/forms/controls/megaoption`,
  //             },
  //           ],
  //         },
  //         {
  //           title: "Widget",
  //           type: "sub",
  //           children: [
  //             {
  //               title: "Datepicker",
  //               type: "link",
  //               path: `${process.env.PUBLIC_URL}/forms/widget/datepicker`,
  //             },
  //             {
  //               title: "Datetimepicker",
  //               type: "link",
  //               path: `${process.env.PUBLIC_URL}/forms/widget/datetimepicker`,
  //             },
  //             {
  //               title: "Touchspin",
  //               type: "link",
  //               path: `${process.env.PUBLIC_URL}/forms/widget/touchspin`,
  //             },
  //             {
  //               title: "Select2",
  //               type: "link",
  //               path: `${process.env.PUBLIC_URL}/forms/widget/select2`,
  //             },
  //             {
  //               title: "Switch",
  //               type: "link",
  //               path: `${process.env.PUBLIC_URL}/forms/widget/switch`,
  //             },
  //             {
  //               title: "Typeahead",
  //               type: "link",
  //               path: `${process.env.PUBLIC_URL}/forms/widget/typeahead`,
  //             },
  //             {
  //               title: "Clipboard",
  //               type: "link",
  //               path: `${process.env.PUBLIC_URL}/forms/widget/clipboard`,
  //             },
  //           ],
  //         },
  //         {
  //           title: "Layout",
  //           type: "sub",
  //           children: [
  //             {
  //               path: `${process.env.PUBLIC_URL}/forms/layout/formdefault`,
  //               title: "FormDefault",
  //               type: "link",
  //             },
  //             {
  //               path: `${process.env.PUBLIC_URL}/forms/layout/formwizard`,
  //               title: "FormWizard",
  //               type: "link",
  //             },
  //           ],
  //         },
  //       ],
  //     },

  //     {
  //       title: "Table",
  //       icon: "table",
  //       type: "sub",
  //       children: [
  //         {
  //           title: "ReactstrapTable",
  //           type: "link",
  //           path: `${process.env.PUBLIC_URL}/table/reactstraptable/basictable`,
  //         },
  //         {
  //           title: "DataTable",
  //           path: `${process.env.PUBLIC_URL}/table/datatable`,
  //           type: "link",
  //         },
  //       ],
  //     },
  //   ],
  // },

  // {
  //   menutitle: "Components",
  //   menucontent: "UI Components & Elements",
  //   Items: [
  //     {
  //       title: "Ui-Kits",
  //       icon: "ui-kits",
  //       type: "sub",
  //       active: false,
  //       children: [
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/typography`,
  //           title: "Typography",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/avatar`,
  //           title: "Avatar",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/helper-class`,
  //           title: "Helper-Class",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/grids`,
  //           title: "Grids",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/tag-pills`,
  //           title: "Tag-Pills",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/progress`,
  //           title: "Progress",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/modal`,
  //           title: "Modal",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/alert`,
  //           title: "Alert",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/popover`,
  //           title: "Popover",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/tooltips`,
  //           title: "Tooltips",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/spinner`,
  //           title: "Spinner",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/dropdown`,
  //           title: "Dropdown",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/accordion`,
  //           title: "Accordion",
  //           type: "link",
  //         },
  //         {
  //           title: "Tabs",
  //           type: "sub",
  //           children: [
  //             {
  //               title: "Bootstrap",
  //               type: "link",
  //               path: `${process.env.PUBLIC_URL}/ui-kits/tabs/bootstrap`,
  //             },
  //             {
  //               title: "Line",
  //               type: "link",
  //               path: `${process.env.PUBLIC_URL}/ui-kits/tabs/line`,
  //             },
  //           ],
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/shadow`,
  //           title: "Shadow",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/ui-kits/list`,
  //           title: "List",
  //           type: "link",
  //         },
  //       ],
  //     },

  //     {
  //       title: "Bonus-Ui",
  //       icon: "bonus-kit",
  //       type: "sub",
  //       badge1: true,
  //       active: false,
  //       children: [
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/scrollable`,
  //           title: "Scrollable",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/bootstrap-notify`,
  //           title: "Bootstrap-Notify",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/tree-view`,
  //           title: "Tree View",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/rating`,
  //           title: "Rating",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/dropzone`,
  //           title: "Dropzone",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/tour`,
  //           title: "Tour ",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/sweet-alert`,
  //           title: "Sweet-Alert",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/carousel`,
  //           title: "Carousel",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/ribbons`,
  //           title: "Ribbons",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/pagination`,
  //           title: "Pagination",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/breadcrumb`,
  //           title: "Breadcrumb",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/rangeslider`,
  //           title: "RangeSlider",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/imagecropper`,
  //           title: "ImageCropper",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/stickynotes`,
  //           title: "StickyNotes",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/drag_and_drop`,
  //           title: "Drag_and_Drop",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/image-upload`,
  //           title: "Image-Upload",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/card/basiccards`,
  //           title: "BasicCards",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/card/creativecards`,
  //           title: "CreativeCards",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/card/tabcard`,
  //           title: "TabCard",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/bonus-ui/timelines/timeline1`,
  //           title: "Timeline1",
  //           type: "link",
  //         },
  //       ],
  //     },

  //     {
  //       title: "Icons",
  //       icon: "icons",
  //       path: `${process.env.PUBLIC_URL}/icons/flag_icons`,
  //       type: "sub",
  //       active: false,
  //       bookmark: true,
  //       children: [
  //         {
  //           path: `${process.env.PUBLIC_URL}/icons/flag_icons`,
  //           title: "Flag Icon",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/icons/fontawesome_icon`,
  //           title: "Fontawesome Icon",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/icons/ico_icon`,
  //           title: "Ico Icon",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/icons/themify_icons`,
  //           title: "Themify Icon",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/icons/feather_icons`,
  //           title: "Feather Icon",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/icons/weather_icons`,
  //           title: "Weather Icons",
  //           type: "link",
  //         },
  //       ],
  //     },

  //     {
  //       title: "Buttons",
  //       icon: "button",
  //       type: "sub",
  //       active: false,
  //       children: [
  //         {
  //           path: `${process.env.PUBLIC_URL}/buttons/simplebutton`,
  //           title: "SimpleButton",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/buttons/flat`,
  //           title: "Flat",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/buttons/edge`,
  //           title: "Edge",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/buttons/raised`,
  //           title: "Raised",
  //           type: "link",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/buttons/group`,
  //           title: "Group",
  //           type: "link",
  //         },
  //       ],
  //     },

  //     {
  //       title: "Charts",
  //       icon: "charts",
  //       type: "sub",
  //       active: false,
  //       children: [
  //         {
  //           path: `${process.env.PUBLIC_URL}/charts/apex`,
  //           type: "link",
  //           title: "Apex",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/charts/google`,
  //           type: "link",
  //           title: "Google",
  //         },
  //         {
  //           path: `${process.env.PUBLIC_URL}/charts/chartjs`,
  //           type: "link",
  //           title: "Chartjs",
  //         },
  //       ],
  //     },
  //   ],
  // },
];
