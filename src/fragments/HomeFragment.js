
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


import React, { Component } from 'react'
import { Container } from '@material-ui/core';
import ProductView from '../Components/ProductView';
import HorizontalScroller from '../Components/HorizontalScroller';
import BannerSlider from "../Components/BannerSlider";
import GridView from '../Components/GridView';
import { LoadCategories } from '../Components/Reducer/CategoryAction';

export class HomeFragment extends Component{
    constructor(props){
        super(props)
        this.state = {
                value : 0,
        };
    }
    handleChange = (event, newValue) => {
        this.setState({
            value:newValue
        })
      };
    
    componentDidMount(){


      if(this.props.categories==null){
        this.props.LoadCategories()
      }
    }


    render(){
        return (
          <Container maxWidth="md" fixed>
            <AppBar position="static" color="white">
            <Tabs
                  value={this.state.value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  <Tab icon= {<CategoryTab /> }/>
                {this.props.categories?
                this.props.categories.map(category=>(

                   <Tab icon={
                   <CategoryTab 
                    icon ={category.icon} 
                   title = {category.categoryName} 
                   />
                  }
                  />

                )): null}
                  
                </Tabs>
            </AppBar>
            <BannerSlider Images = {[{image:"fdfs"}]}/>
           <HorizontalScroller/>
           <StripAdView/>
           <GridView/>
          </Container>

          );
    }
}

export const CategoryTab = ({icon,title}) => {
    return (
    <Box textAlign="center"> 
      {
        icon !== "null"?(
          <img src={icon} style={{height: "30px",width: "30px"}} />
        ) :(
          <Home/>
        )

      };
        
        <Typography variant = "body2" textAlign ="center">
        </Typography>
    </Box>
    );
};

const mapStatetoProps = (state) =>{ 
  return{
    categories : state.categories
  }
}

const mapDispatchToProps = (dispatch) => {
   return  {
     LoadCategories :() => dispatch(LoadCategories()),
   }
}

export default connect(mapStatetoProps,mapDisPatchToProps)(HomeFragment);



