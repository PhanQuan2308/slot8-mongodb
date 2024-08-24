import { Card, CardContent, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

function LoyalCustomers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/loyal-customers')
      .then(response => {
        console.log("Data from API:", response.data);
        setCustomers(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError(error.message);
      });
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (customers.length === 0) return <p>No loyal customers found.</p>;

  const lineChartData = (customer) => ({
    labels: [...Array(12)].map((_, i) => `Month ${i + 1}`),
    datasets: [
      {
        label: `Total Spent for ${customer.customer_id}`,
        data: customer.monthlyData.map(m => m.totalSpent),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: true,
        tension: 0.1,
      },
    ],
  });

  return (
    <div style={{ backgroundColor: '#121212', color: '#ffffff', padding: '10px' }}>
      <Typography variant="h4" component="h1" gutterBottom style={{ marginBottom: '20px' }}>
        Loyal Customer Behavior: 2023
      </Typography>
      <Grid container spacing={2}>
        {customers.map((customer, index) => (
          <Grid item xs={12} key={index}>
            <Card style={{ backgroundColor: '#1e1e1e', color: '#ffffff', marginBottom: '20px', padding: '10px' }}>
              <CardContent>
                <Typography variant="h6" component="h2">
                  Customer ID: {customer.customer_id}
                </Typography>
                <Typography variant="body1" component="p" style={{ marginBottom: '10px' }}>
                  Total Spent: ${customer.totalSpent.toFixed(2)}
                </Typography>
                <div style={{ height: '300px', marginBottom: '20px' }}>
                  <Line
                    data={lineChartData(customer)}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { color: '#ffffff' },
                        },
                        x: {
                          ticks: { color: '#ffffff' },
                        },
                      },
                      plugins: {
                        legend: {
                          labels: { color: '#ffffff' },
                        },
                      },
                    }}
                    height={300}
                  />
                </div>
                <table style={{ width: '100%', marginTop: '10px', color: '#ffffff', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ffffff', padding: '20px', textAlign: 'center' }}>
                      <th style={{ padding: '10px' }}>Month</th>
                      <th style={{ padding: '10px' }}>Total Spent</th>
                      <th style={{ padding: '10px' }}>Favorite Product</th>
                      <th style={{ padding: '10px' }}>Favorite Day</th>
                      <th style={{ padding: '10px' }}>Favorite Hour</th>
                      <th style={{ padding: '10px' }}> Quantity </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.monthlyData.map((month, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #ffffff', padding: '20px', textAlign: 'center' }}>
                        <td style={{ padding: '10px', textAlign: 'center' }}>Month {i + 1}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>${month.totalSpent.toFixed(2)}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>{month.favoriteProduct.join(', ')}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>{month.favoriteDay}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>{month.favoriteHour}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>{month.totalQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default LoyalCustomers;
