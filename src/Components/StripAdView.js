import React from "react";
import { Box } from "@material-ui/core";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";

const StripAdView = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <div style={{ backgroundColor: "white", textAlign: "right" }}>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: "20ch",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              props.edit();
              handleClose();
            }}
          >
            Sửa
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.delete();
              handleClose();
            }}
          >
            Xóa
          </MenuItem>
        </Menu>
      </div>
      <img
        style={{
          height: "100px",
          width: "100%",
          background: props.background,
          objectFit: "scale-down",
        }}
        src={props.image}
      />
    </Box>
  );
};

export default StripAdView;
