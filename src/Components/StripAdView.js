import React from "react"
import { Box } from "@material-ui/core";

const StripAdView = ({image,background}) => {
    return(
        <Box>
            <img 
              style={{
                  height:"100px", 
                  width:"100%", 
                  background:background,
                  objectFit: "scale-down",
                }} 
                src={image} />
        </Box>
    );
};

export default StripAdView;