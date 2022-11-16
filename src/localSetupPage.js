import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import { Button, Grid } from "@mui/material";
import Item from "./item.js";
import { useData } from "./App.js";

export default function LocalSetupPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const { appSettings } = useData();
  const steps = ["Скачивание", "Установка", "Готово"];
  const instructions = [
    appSettings.UserSettings.Setup.Pages[0]["PageTextAddress"],
    appSettings.UserSettings.Setup.Pages[1]["PageText"],
    appSettings.UserSettings.Setup.Pages[2]["PageText"],
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container mt={2}>
        <Grid item xs={12} textAlign="center">
          <Item sx={{ boxShadow: 0 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label} completed={false}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Item>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Item sx={{ boxShadow: 0, mt: 2 }}>
            <iframe
              src={instructions[activeStep]}
              width="500"
              height="220"
              frameBorder="0"
              title="instructions"
            ></iframe>
          </Item>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Item sx={{ boxShadow: 0, mt: 0 }}>
            <Button
              variant="contained"
              size="medium"
              onClick={handleBack}
              sx={{ borderRadius: 0 }}
              disabled={activeStep === 0 ? true : false}
            >
              назад
            </Button>
            <Button
              variant="contained"
              size="medium"
              onClick={handleNext}
              sx={{ borderRadius: 0 }}
              disabled={activeStep === 2 ? true : false}
            >
              далее
            </Button>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
