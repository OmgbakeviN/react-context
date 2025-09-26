// ici on fait le graphique des decomptes et des projets on recois les data en props
import React from "react";
// on  importe recharts
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

// on exporte le composant
export default function MonthlyDecomptes({ data }) {
    return (
            <LineChart width={600} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis datakey="total"/>
                <Tooltip />
                <Legend />
                <Line type="monotone"
                    dataKey="total"
                    stroke="#8884d8" // Couleur de la ligne
                    activeDot={{ r: 8 }}
                    name="Total mensuel" />
            </LineChart>
    );
}
