import React from "react";
import { Box, Typography } from '@material-ui/core';
import ProductView from "./ProductView";

const HorizontalScroller = props => {
    return (
        <Box style={{background:props.background}} p="16px">
            <Typography variant="h5">{props.title}</Typography >
            <Box display="flex" overflow="auto">
              {props.products.map((item, index) => (
                <ProductView item={item} />
              ))}                   
            </Box>
        </Box>
    );
};

export default HorizontalScroller;