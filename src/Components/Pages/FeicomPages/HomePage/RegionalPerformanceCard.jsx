import React from "react";
import { Card, CardBody, CardTitle, Progress } from "reactstrap";

const clampPct = (n) => Math.min(100, Math.max(0, Number(n) || 0));
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-CM", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(amount);

// Displays KPIs for a single region using Reactstrap v9
const RegionalPerformanceCard = ({ regionData }) => {
  const {
    id,
    name,
    totalProjects,
    onTrackPercentage,
    delayedPercentage,
    averageCompletionRate,
    provisionalAcceptances,
    finalAcceptances,
    totalBudget,
    totalDisbursed,
  } = regionData;

  const completion = clampPct(averageCompletionRate);
  const onTrack = clampPct(onTrackPercentage);
  const delayed = clampPct(delayedPercentage);

  return (
    <Card className="h-100 shadow-sm border-0 position-relative">
      <CardBody>
        <CardTitle tag="h5" className="mb-3 pb-2 border-bottom">
          {name}
        </CardTitle>

        {/* Total Projects */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted small">Total Projects</span>
          <span className="fw-semibold text-primary fs-5">{totalProjects}</span>
        </div>

        {/* Avg. Completion */}
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted small">Avg. Completion</span>
            <span className="fw-semibold text-primary">{completion}%</span>
          </div>
          <Progress value={completion} className="bg-light" />
        </div>

        {/* On Track */}
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted small">On Track</span>
            <span className="fw-semibold text-success">{onTrack}%</span>
          </div>
          <Progress value={onTrack} color="success" className="bg-light" />
        </div>

        {/* Delayed */}
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted small">Delayed</span>
            <span className="fw-semibold text-danger">{delayed}%</span>
          </div>
          <Progress value={delayed} color="danger" className="bg-light" />
        </div>

        {/* Acceptances */}
        <div className="pt-2 mt-2 border-top">
          <div className="d-flex justify-content-between">
            <span className="text-muted small">Provisional Acceptances</span>
            <span className="fw-semibold text-warning">
              {provisionalAcceptances}
            </span>
          </div>
          <div className="d-flex justify-content-between mt-1">
            <span className="text-muted small">Final Acceptances</span>
            <span className="fw-semibold text-info">{finalAcceptances}</span>
          </div>
        </div>

        {/* Financials */}
        <div className="pt-2 mt-2 border-top">
          <div className="d-flex justify-content-between">
            <span className="text-muted small">Total Budget</span>
            <span className="fw-semibold">{formatCurrency(totalBudget)}</span>
          </div>
          <div className="d-flex justify-content-between mt-1">
            <span className="text-muted small">Total Disbursed</span>
            <span className="fw-semibold">{formatCurrency(totalDisbursed)}</span>
          </div>
        </div>

        {/* Make the whole card clickable */}
        <a
          href={`#/reports/region/${id}`}
          className="stretched-link text-decoration-none"
          aria-label={`View details for ${name}`}
        />
      </CardBody>
    </Card>
  );
};

export default RegionalPerformanceCard;
