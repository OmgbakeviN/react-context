// ProjectTabs.jsx
import React from "react";
import { Card, CardHeader, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

/**
 * Conteneur des onglets. Ne rend que la structure "tabs + content".
 * Les contenus concrets viennent du parent via props.children par tabId.
 * Props:
 *  - active: string ("resume" | "financement" | "visites" | "fichiers" | "lots")
 *  - setActive: fn(tabId) => void
 *  - panes: { [tabId]: ReactNode } // ex: { resume: <ProjectResume .../>, visites: <ProjectVisitsTable .../> }
 */
const ProjectTabs = ({ active, setActive, panes }) => {
  const labels = [
    { id: "resume", label: "Résumé" },
    { id: "financement", label: "Financement" },
    { id: "visites", label: "Visites" },
    { id: "fichiers", label: "Pièces jointes" },
    { id: "lots", label: "Lots" },
  ];

  return (
    <Card className="shadow-sm mt-3">
      <CardHeader className="bg-white">
        <Nav tabs pills>
          {labels.map((t) => (
            <NavItem key={t.id}>
              <NavLink
                className={active === t.id ? "active" : ""}
                onClick={() => setActive(t.id)}
              >
                {t.label}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </CardHeader>

      <CardBody>
        <TabContent activeTab={active}>
          {labels.map((t) => (
            <TabPane tabId={t.id} key={t.id}>
              {panes?.[t.id] ?? null}
            </TabPane>
          ))}
        </TabContent>
      </CardBody>
    </Card>
  );
};

export default ProjectTabs;
