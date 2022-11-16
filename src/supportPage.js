import React from "react";
import { Box, Grid, Typography, Button, TextField } from "@mui/material";
import Item from "./item.js";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import { useData } from "./App.js";

export default function SupportPage() {
  const { appSettings } = useData();

  return (
    <Box mt={2} ml={2} mr={2}>
      <Grid container spacing={0} mt={1}>
        <Grid item xs={1}>
          <Item sx={{ boxShadow: 0 }}>
            <CallIcon />
          </Item>
        </Grid>
        <Grid item xs={7}>
          <Item sx={{ boxShadow: 0 }}>
            <Typography variant="body1">
              {appSettings.UserSettings.Help.tel}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={1}>
          <Item sx={{ boxShadow: 0 }}>
            <EmailIcon />
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item sx={{ boxShadow: 0 }}>
            <Typography variant="body1">
              {appSettings.UserSettings.Help.email}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={1}>
          <Item sx={{ boxShadow: 0 }}>
            <LanguageIcon />
          </Item>
        </Grid>
        <Grid item xs={11}>
          <Item sx={{ boxShadow: 0 }}>
            <Typography variant="body1">
              {appSettings.UserSettings.Help.site}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item sx={{ boxShadow: 0 }}>
            <Box sx={{ height: 230, maxWidth: 510 }}>
              <TextField
                multiline
                rows={9}
                id="outlined-required"
                label="Сообщение в поддержку"
                defaultValue=" "
                sx={{ width: 480 }}
              ></TextField>
            </Box>
          </Item>
        </Grid>
        <Grid item xs={9}>
          <Item sx={{ boxShadow: 0 }}></Item>
        </Grid>
        <Grid item xs={3}>
          <Item sx={{ boxShadow: 0 }}>
            <Button
              variant="contained"
              size="medium"
              fullWidth={true}
              sx={{ borderRadius: 0 }}
            >
              отправить
            </Button>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
