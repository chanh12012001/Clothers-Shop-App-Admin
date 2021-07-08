import React from "react";
import { Box,Typography } from "@material-ui/core";
import ProductView from "./ProductView";

const GridView = (props) => {
    return (
      <Box 
        width="400px" 
        style={{ background: props.background }} 
        p="16px" 
        mx="auto"
      >
        <Typography variant="h5">{props.title}</Typography>
        <Box display="flex" p="16px" justifyContent="center">
            <ProductView item={props.products[0]} />
            <ProductView item={props.products[1]} />
        </Box>
        <Box display="flex" p="16px" justifyContent="center">
            <ProductView item={props.products[2]} />
            <ProductView item={props.products[3]} />
        </Box>
      </Box>
    );
};

export default GridView;