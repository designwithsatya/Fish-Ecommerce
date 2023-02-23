import PropTypes from 'prop-types';
import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import { Container } from '@mui/material';

CheckoutWizard.propTypes = {
  activeStep: PropTypes.number,
};

const steps = ['Login', 'Address', 'Payment', 'Order'];

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <Container>
      <Box sx={{ width: '100%', mb: 5 }}>
        <Stepper alternativeLabel activeStep={activeStep}>
          {steps.map((step) => (
            <Step key={step}>
              <StepButton color="inherit">{step}</StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Container>
  );
}
