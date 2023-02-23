import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useReducer } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import { AppWidgetSummary } from '../../sections/@dashboard/app';
import AdminLayout from './AdminLayout';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
function AdminDashboardScreen() {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/summary`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: summary.salesData.map((x) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: 'Sales',
        backgroundColor: 'rgba(162, 222, 208, 1)',
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  };
  return (
    <Layout title="admin">
      <AdminLayout>
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 5 }}>
            Admin Dashboard
          </Typography>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary
                    title="Weekly Sales"
                    total={summary.ordersPrice}
                    icon={'ic:outline-currency-rupee'}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary title="Orders" total={summary.ordersCount} icon={'carbon:order-details'} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary title="Products" total={summary.productsCount} icon={'dashicons:products'} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary title="User" total={summary.usersCount} icon={'mdi:user-group-outline'} />
                </Grid>
              </Grid>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Sales Report
              </Typography>

              <Bar
                options={{
                  legend: { display: true, position: 'right' },
                }}
                data={data}
              />
            </div>
          )}
        </Container>
      </AdminLayout>
    </Layout>
  );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen;
