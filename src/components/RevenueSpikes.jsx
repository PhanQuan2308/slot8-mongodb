import { Card, CardContent, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

// Đăng ký các thành phần bắt buộc của Chart.js
Chart.register(...registerables);

function RevenueSpikes() {
  const [spikes, setSpikes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/revenue-spikes')
      .then(response => setSpikes(response.data))
      .catch(error => setError(error.message));
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (spikes.length === 0) return <p>No revenue spikes found.</p>;

  return (
    <div style={{ backgroundColor: '#121212', color: '#ffffff', padding: '10px' }}>
      <Typography variant="h4" component="h1" gutterBottom style={{ marginBottom: '20px' }}>
        Revenue Spikes: December 2023
      </Typography>
      <Grid container spacing={2}>
        {spikes.map((spike, index) => {
          const maxRevenue = Math.max(...spike.weeklyData.map(d => d.totalRevenue));
          const minRevenue = Math.min(...spike.weeklyData.map(d => d.totalRevenue));
          const maxDifference = maxRevenue - minRevenue;
  
          return (
            <Grid item xs={12} key={index}>
              <Card style={{ backgroundColor: '#1e1e1e', color: '#ffffff', marginBottom: '20px', padding: '10px' }}>
                <CardContent>
                  <Typography variant="h6" component="h2" style={{ marginBottom: '10px' }}>
                    {spike.product_id}
                  </Typography>
                  <Typography variant="body1" component="p" style={{ marginBottom: '20px' }}>
                    Maximum Revenue Difference: ${maxDifference.toFixed(2)}
                  </Typography>
                  <div style={{ height: '300px' }}>
                    <Line
                      data={{
                        labels: spike.weeklyData.map(d => `Week ${d.week}`),
                        datasets: [
                          {
                            label: 'Total Revenue',
                            data: spike.weeklyData.map(d => d.totalRevenue),
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            fill: true,
                            tension: 0.1,
                          },
                        ],
                      }}
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
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
  
}  

export default RevenueSpikes;
