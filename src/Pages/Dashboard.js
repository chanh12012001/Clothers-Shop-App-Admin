import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  Home,
  Category,
  Store,
  Settings,
  PowerSettingsNew,
  LocalMall,
} from "@material-ui/icons";
import logo from "../media/logo.png";
import HomeFragment from "../fragments/HomeFragment";
import ManageCatergoryFragment from "../fragments/ManageCatergoryFragment";
import { setfragment } from "react";
import AddProduct from "../fragments/AddProduct";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function ClippedDrawer() {
  const classes = useStyles();
  const [fragment, setfragment] = useState("HOME");

  const loadFragment = () => {
    switch (fragment) {
      case "HOME":
        return <HomeFragment />;
      case "MANAGE_CATEGORY":
        return <ManageCatergoryFragment />;
      case "ADD_PRODUCT":
        return <AddProduct />;
      default:
        break;
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            <img src={logo} height="50px" style={{ marginRight: "16px" }} />
            <Typography variant="h4" display="inline">
              My Clothes Shop App Admin
            </Typography>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button onClick={(e) => setfragment("HOME")}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Trang chủ" />
            </ListItem>
            <ListItem button onClick={(e) => setfragment("MANAGE_CATEGORY")}>
              <ListItemIcon>
                <Category />
              </ListItemIcon>
              <ListItemText primary="Danh mục" />
            </ListItem>
            <ListItem button onClick={(e) => setfragment("ADD_PRODUCT")}>
              <ListItemIcon>
                <LocalMall />
              </ListItemIcon>
              <ListItemText primary="Sản phẩm" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Store />
              </ListItemIcon>
              <ListItemText primary="Đơn hàng" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Cài đặt" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemIcon>
                <PowerSettingsNew />
              </ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </ListItem>
          </List>
          <Divider />
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {loadFragment()}
      </main>
    </div>
  );
}
