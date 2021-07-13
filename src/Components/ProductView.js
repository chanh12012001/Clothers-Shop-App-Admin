import React from "react";
import { Box, Typography } from "@material-ui/core";
import { grey, green } from "@material-ui/core/colors";

const ProductView = (props) => {
  return (
    <Box p="18px" bgcolor="white" boxShadow="8px" mx="4px" borderRadius="16px">
      <img
        src={props.item?.image}
        style={{
          height: "120px",
          objectFit: "scale-down",
          width: "120px",
          backgroundColor: grey[50],
        }}
      />
      <Typography variant="subtitle1">{props.item?.title}</Typography>
      <Typography variant="subtitle2">
        <span style={{ color: green.A700 }}>{props.item?.subtitle}</span>
      </Typography>
      <Typography variant="h6">₫{props.item?.price}</Typography>
    </Box>
  );
};

export default ProductView;
