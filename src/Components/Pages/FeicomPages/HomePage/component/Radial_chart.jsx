import React from 'react';
import PropTypes from 'prop-types';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

const RadialChart = ({ 
  data, 
  dataKey = 'value',
  nameKey = 'name',
  colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'],
  innerRadius = 30,
  outerRadius = 90,
  startAngle = 180,
  endAngle = 0,
  showTooltip = true,
  showLegend = true,
  showLabel = true,
  height = 300,
  title,
  unit = ''
}) => {
  
  // Formater les données si nécessaire
  const formattedData = Array.isArray(data) ? data.map((item, index) => ({
    ...item,
    fill: item.color || colors[index % colors.length]
  })) : [];

  // Si données vides
  if (!formattedData || formattedData.length === 0) {
    return (
      <div style={{ 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px dashed #dee2e6'
      }}>
        <p className="text-muted">Aucune donnée disponible</p>
      </div>
    );
  }

  // Calcul du total pour le centre
  const totalValue = formattedData.reduce((sum, item) => sum + (item[dataKey] || 0), 0);

  // Formateur de tooltip personnalisé
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: dataItem.fill }}>
            {dataItem[nameKey] || 'Item'}
          </p>
          <p style={{ margin: '5px 0 0 0' }}>
            {`${dataKey}: `}
            <strong>
              {dataItem[dataKey]} {unit}
            </strong>
          </p>
          {formattedData.length > 1 && (
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
              {`${((dataItem[dataKey] / totalValue) * 100).toFixed(1)}% du total`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Étiquette pour le centre
  const renderCenterLabel = () => {
    if (!showLabel) return null;
    
    return (
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          fill: '#333'
        }}
      >
        {totalValue.toLocaleString()}
      </text>
    );
  };

  return (
    <div style={{ width: '100%', height }}>
      {title && (
        <div style={{ 
          marginBottom: '15px', 
          textAlign: 'center',
          padding: '10px 0'
        }}>
          <h5 style={{ margin: 0, fontWeight: '600', color: '#333' }}>
            {title}
          </h5>
          {formattedData.length > 1 && (
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
              Total: {totalValue.toLocaleString()} {unit}
            </p>
          )}
        </div>
      )}
      
      <ResponsiveContainer width="100%" height="80%">
        <RadialBarChart
          innerRadius={`${innerRadius}%`}
          outerRadius={`${outerRadius}%`}
          barSize={formattedData.length > 5 ? 10 : 15}
          data={formattedData}
          startAngle={startAngle}
          endAngle={endAngle}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, totalValue]}
            angleAxisId={0}
            tick={false}
          />
          
          <RadialBar
            minAngle={15}
            background={{ fill: '#f0f0f0' }}
            dataKey={dataKey}
            angleAxisId={0}
            isAnimationActive={true}
            animationDuration={1500}
            label={showLabel ? {
              position: 'insideStart',
              fill: '#fff',
              fontSize: 12,
              fontWeight: 'bold'
            } : false}
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </RadialBar>
          
          {showTooltip && (
            <Tooltip content={<CustomTooltip />} />
          )}
          
          {showLegend && formattedData.length > 1 && (
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
              iconSize={10}
              formatter={(value, entry) => {
                const item = formattedData.find(d => d[nameKey] === value);
                return (
                  <span style={{ color: item?.fill || '#666', fontSize: '12px' }}>
                    {value}: {item?.[dataKey]} {unit}
                  </span>
                );
              }}
            />
          )}
        </RadialBarChart>
      </ResponsiveContainer>
      
      {/* Afficher le total au centre */}
      {showLabel && formattedData.length === 1 && (
        <div style={{ 
          position: 'relative', 
          textAlign: 'center',
          marginTop: '-40%'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'white',
            padding: '10px 20px',
            borderRadius: '50%',
            border: '2px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: formattedData[0].fill }}>
              {totalValue.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              {unit}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

RadialChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string
    })
  ).isRequired,
  dataKey: PropTypes.string,
  nameKey: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  showTooltip: PropTypes.bool,
  showLegend: PropTypes.bool,
  showLabel: PropTypes.bool,
  height: PropTypes.number,
  title: PropTypes.string,
  unit: PropTypes.string
};

RadialChart.defaultProps = {
  data: [],
  dataKey: 'value',
  nameKey: 'name',
  colors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4', '#45B7D1'],
  innerRadius: 30,
  outerRadius: 90,
  startAngle: 180,
  endAngle: 0,
  showTooltip: true,
  showLegend: true,
  showLabel: true,
  height: 300,
  title: '',
  unit: ''
};

export default RadialChart;