// ProjectLots.jsx
import React from "react";
import { Card, CardBody, Button } from "reactstrap";
import Lots from "../../Todo_lots/lots";

/**
 * Onglet "Lots"
 * Props:
 *  - lots: []
 *  - projectId: number
 *  - onAdd: fn() => void     // ouvre modal ajout (géré par parent)
 *  - onChanged: fn() => void // rappel après PUT/DELETE pour recharger
 */
const ProjectLots = ({ lots = [], projectId, onAdd, onChanged }) => {
  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-end mb-3">
          <Button color="primary" size="sm" onClick={onAdd}>+ Ajouter un lot</Button>
        </div>
        <Lots lots={lots} projectId={projectId} onChanged={onChanged} />
      </CardBody>
    </Card>
  );
};

export default ProjectLots;
