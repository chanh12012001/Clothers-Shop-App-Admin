import React, { Component } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
  Container,
  Avatar,
  Fab,
  Dialog,
  Toolbar,
  Slide,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Backdrop,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from "@material-ui/core";
import BannerSlider from "../Components/BannerSlider";
import ProductView from "../Components/ProductView";
import HorizontalScroller from "../Components/HorizontalScroller";
import StripAdView from "../Components/StripAdView";
import GridView from "../Components/GridView";
import { loadCategories } from "../Components/Actions/CategoryAction";
import { Home, Add, Close, Delete, FormatColorFill, Search} from "@material-ui/icons";
import { connect } from "react-redux";
import {  loadCategoryPage } from "../Components/Actions/categoryPageActions";
import { firestore, storageRef } from "../firebase";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export class HomeFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      value: 0,
      Page: "HOME",
      addDialog: false,
      images: [],
      colors: [],
      selectedProducts: [],
      positionError: "",
      layout_titleError: "",
      snackbar: "",
      layout_bg:"#ffffff",
      view_type: 0,
    };
  }

  handleChange = (event, newValue) => {
    this.setState({
      value: newValue,
    });
  };

  loadLastestProducts = () => {
    firestore
    .collection("PRODUCTS")
    .orderBy("added_on","desc")
    .limit(8)
    .get()
    .then((querySnapshot) => {
        let productlist = [];
        if(!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                let data = {
                  id:doc.id,
                  image:doc.data().product_image_1,
                  title:doc.data().product_title,
                  price:doc.data().product_price,
                }
                productlist.push(data);
            });
        }
        this.setState({
          productlist
        })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  searchProducts = () => {

    if(!this.state.search){
      this.loadLastestProducts();
      return;
    }

    this.setState({
      search: true
    })

    let keywords = this.state.search.split(" ");

    firestore
    .collection("PRODUCTS")
    .where('tags','array-contains-any', keywords)
    .get()
    .then((querySnapshot) => {

        let productlist = [];
        if(!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                let data = {
                  id:doc.id,
                  image:doc.data().product_image_1,
                  title:doc.data().product_title,
                  price:doc.data().product_price,
                }
                productlist.push(data);
            });
        }
        this.setState({
          productlist,
          searching:false
        })
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        
        searching:false
      })
    });
  }

  componentDidMount() {
    if (this.props.categories === null) {
      this.props.loadCategories(
        () => {
          this.props.loadPage(
            "HOME",
            () => {
              this.setState({ loading: false });
            },
            () => {
              this.setState({ loading: false });
              ///error
            }
          );
        },
        () => {
          this.setState({ loading: false });
          //error
        }
      );
    }
  }

  onFieldChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  removeImage = (index) => {
    let images = this.state.images;
    let colors = this.state.colors;

    images.splice(index, 1);
    colors.splice(index, 1);

    this.setState({ images, colors });
  };

  uploadProductSection = () => {
    this.setState({
      loading: true
    });
    let data = {
      view_type: this.state.view_type,
      layout_title:this.state.layout_title,
      index: parseInt(this.state.position),
      layout_background: this.state.layout_bg,
      products: this.state.selectedProducts
    }
  
    const onComplete = () => {
      let sections = this.props.categoryPages[this.state.Page];
      sections.push(data);
      sections.sort((a,b)=>a.index - b.index);
    
      this.props.addSection(this.state.Page,sections);

      this.setState({
        position : null,
        images : [],
        view_type : 0,
        colors : [],
        loading: false,
        addDialog: false,
        layout_title: null,
        layout_background: null,
      })
    };
    firestore
    .collection("CATEGORIES")
    .doc(this.state.Page)
    .collection("TOP_DEALS")
    .doc().set(data)
    .then( function(){
      onComplete();
    }).catch(err=>{
      this.setState({
        loading: false
      })
    })
  }

  save = () =>{
    this.setState({
      positionError:"",
      layout_titleError:"",
    })
    if(!this.state.position){
      this.setState({
        positionError:"Vui lòng điền vào!"
      })
      return
    }
    switch(this.state.view_type){
      
      case 0:
        if(this.state.images.length < 3){
          this.setState({
            snackbar:"Cần tối thiểu 3 ảnh"
          })
          return ;
        }
            let index = 0;
            let urls = [];
            this.setState({
              loading: true
            })
            this.uploadImages(this.state.images,index,urls,()=>{
              let data = {
                view_type:0,
                no_of_banners:urls.length,
                index: parseInt(this.state.position),
              }
              for (let x = 0; x < urls.length; x++) {
                data["banner_"+(x+1)] = urls[x]
                data["banner_"+(x+1)+"_background"] = this.state.colors[x]
              }
              const onComplete = () => {
                let sections = this.props.categoryPages[this.state.Page];
                sections.push(data);
                sections.sort((a,b)=>a.index - b.index);
               
                this.props.addSection(this.state.Page,sections);

                this.setState({
                  position : null,
                  images : [],
                  view_type : 0,
                  colors : [],
                  loading: false,
                  addDialog: false,
                  layout_title: null,
                  layout_background: null,
                })
              };
              firestore
              .collection("CATEGORIES")
              .doc(this.state.Page)
              .collection("TOP_DEALS")
              .doc().set(data)
              .then( function(){
                onComplete();
              }).catch(err=>{
                this.setState({
                  loading: false
                })
              })
            });
        
        break;
      case 1:
        if(this.state.images.length < 1){
          this.setState({
            snackbar:"Hình ảnh không được để trống"
          })
          return ;
        }

            let index2 = 0;
            let urls2 = [];
            this.setState({
              loading: true
            })
            this.uploadImages([this.state.images[0]],index2,urls2,()=>{
              let data = {
                view_type:1,
                strip_ad_banner:urls2[0],
                index: parseInt(this.state.position),
                background: this.state.colors[0]
              }
            
              const onComplete = () => {
                let sections = this.props.categoryPages[this.state.Page];
                sections.push(data);
                sections.sort((a,b)=>a.index - b.index);
              
                this.props.addSection(this.state.Page,sections);

                this.setState({
                  position : null,
                  images : [],
                  view_type : 0,
                  colors : [],
                  loading: false,
                  addDialog: false,
                  layout_title: null,
                  layout_background: null,
                })
              };
              firestore
              .collection("CATEGORIES")
              .doc(this.state.Page)
              .collection("TOP_DEALS")
              .doc().set(data)
              .then( function(){
                onComplete();
              }).catch(err=>{
                this.setState({
                  loading: false
                })
              })
            });

          break;
      case 2:
        if(!this.state.layout_title){
          this.setState({
            layout_titleError:"Tiêu đề không được trống", 
          })
          return;
        }
          if(this.state.selectedProducts.length < 1){
            this.setState({
              snackbar:"Hãy chọn ít nhất 1 sản phẩm"
            })
            return;
          }
            this.uploadProductSection();
        break;
      case 3:
        if(!this.state.layout_title){
          this.setState({
            layout_titleError:"Tiêu đề không được trống"
          })
          return;
        }
          if(this.state.selectedProducts.length < 4){
            this.setState({
              snackbar:"Hãy chọn ít nhất 4 sản phẩm"
            })
            return;
          }
          this.uploadProductSection()
        break;
      default:
    }


  };

  uploadImages = (images , index,urls,onCompleted) => {
    const uploadAgain = (images , index,urls, onCompleted) => 
          this.uploadImages(images , index,urls, onCompleted);  
    let file = images[index]
      var ts = String( (new Date()).getTime()),
      i = 0,
      out = '';
      for(i = 0 ; i < ts.length; i += 2){
        out += Number(ts.substr(i,2)).toString(36);
      }
      let filename =  'banner' + out;
    

          var uploadTask = storageRef.child("banners/" + filename + ".jpg").put(file);

            uploadTask.on('state_changed', 
        (snapshot) => {
                   var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          
        }, 
        (error) => {
          // Handle unsuccessful uploads
        }, 
        function () {
          
          uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl)=>{
            urls.push(downloadUrl);
            index++;
            if(index< images.length){
             uploadAgain(images , index,urls, onCompleted);
            }else{
              onCompleted();
            }
          });
        }
      );
  }

  render() {
    return (
      <div>
        <Container maxWidth="md" fixed>
          <AppBar position="static" color="white">
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {this.props.categories
                ? this.props.categories.map((category) => (
                    <Tab
                      icon={
                        <CategoryTab
                          icon={category.icon}
                          title={category.categoryName}
                        />
                      }
                      onClick={(e) => {
                        if (
                          this.props.categoryPages[
                            category.categoryName.toUpperCase()
                          ]
                        ) {
                          this.setState({
                            Page: category.categoryName.toUpperCase(),
                          });
                        } else {
                          this.setState({ loading: true });
                          this.props.loadPage(
                            category.categoryName.toUpperCase(),
                            () => {
                              this.setState({
                                loading: false,
                                Page: category.categoryName.toUpperCase(),
                              });
                            },
                            () => {
                              this.setState({ loading: false });
                              ///error
                            }
                          );
                        }
                      }}
                    />
                  ))
                : null}
            </Tabs>
          </AppBar>

          {this.props.categoryPages
            ? this.props.categoryPages[this.state.Pages].map((item, index) => {
                switch (item.view_type) {
                  case 0:
                    let banners = [];
                    for (
                      let index = 1;
                      index < item.no_of_banners + 1;
                      index++
                    ) {
                      const banner = item["banner_" + index];
                      const background =
                        item["banner_" + index + "_background"];
                      banners.push({ banner, background });
                    }
                    return <BannerSlider Images={banners} />;
                  case 1:
                    return (
                      <StripAdView
                        image={item.strip_ad_banner}
                        background={item.background}
                      />
                    );
                  case 2:
                        let productsData = []

                        if(!item.loaded){

                            item.products.forEach((id,index) => {
                                firestore
                                .collection("PRODUCTS")
                                .doc(id)
                                .get()
                                .then(document=>{
                                  if(document.exists){
                                    let productData = {
                                      id:id,
                                      title:document.data()['product_title'],
                                      subtitle:"",
                                      image:document.data()['product_image_1'],
                                      price:document.data()['product_price'],
                                    }
                                    productsData.push(productData)
                                    if(index === item.products.length - 1){
                                      item.products = productsData
                                      item['loaded'] = true
                                      this.setState({})
                                    }
                                  }
                                }).catch(err=>{
                                  //err
                                })
                            });
                          
                          }
                          return (
                            <HorizontalScroller
                              products={item.products}
                              title={item.layout_title}
                              background={item.layout_background}
                            />
                          );
                  case 3:
                    let gridsData = []

                    if(!item.loaded){

                        item.products.forEach((id,index) => {
                          if(index < 4){
                            firestore
                            .collection("PRODUCTS")
                            .doc(id)
                            .get()
                            .then(document=>{
                              if(document.exists){
                                let productData = {
                                  id:id,
                                  title:document.data()['product_title'],
                                  subtitle:"",
                                  image:document.data()['product_image_1'],
                                  price:document.data()['product_price'],
                                }
                                gridsData.push(productData)
                                if(index === 3){
                                  item.products = gridsData
                                  item['loaded'] = true
                                  this.setState({})
                                }
                              }
                            }).catch(err=>{
                              //err
                            })
                          }
                        });
                      
                      }
                          
                    return (
                      <GridView
                        products={item.products}
                        title={item.layout_title}
                        background={item.layout_background}
                      />
                    );
                  default:
                    break;
                }
              })
            : null}
          <Fab
            color="primary"
            aria-label="add"
            onClick={(e) => this.setState({ addDialog: true })}
            style={{ position: "fixed", bottom: "50px", right: "50px" }}
          >
            <Add />
          </Fab>
        </Container>
        <Dialog
          fullScreen
          open={this.state.addDialog}
          onClose={(e) =>
            this.setState({
              addDialog: false,
            })
          }
          TransitionComponent={Transition}
        >
          <AppBar>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={(e) =>
                  this.setState({
                    addDialog: false,
                  })
                }
                aria-label="close"
              >
                <Close />
              </IconButton>
              <Typography variant="h6">Thêm lựa chọn</Typography>
              <Button
                autoFocus
                color="inherit"
                style={{ position: "absolute", right: 0 }}
                onClick={(e) => 
                  this.save()
                }
              >
                save
              </Button>
            </Toolbar>
          </AppBar>
          <Toolbar />
          <Box padding="18px">
            <FormControl>
              <InputLabel id="demo-simple-select-label">
                Hiển thị dưới dạng
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                onChange={e=> {
                  console.log(this.state.images);
                  this.onFieldChange(e);
                  this.setState({
                    color:[],
                    images:[],
                    selectedProducts:[],
                  })
                }}
                name="view_type"
                dafaultValue={0}
              >
                <MenuItem value={0}>BANNER SLIDER</MenuItem>
                <MenuItem value={1}>STRIP AD</MenuItem>
                <MenuItem value={2}>HORIZONTAL SCROLLER</MenuItem>
                <MenuItem value={3}>GRID VIEW</MenuItem>
              </Select>
              <br/>
              <TextField
                label="Vị trí"
                id="outlined-size-small"
                variant="outlined"
                type="number"
                name="position"
                size="small"
                error = {this.state.positionError !== ""}
                helperText={this.state.positionError}
                onChange={this.onFieldChange}
                margin="dense"
              />
              </FormControl>
              <br/>
              <Box display="flex" flexWrap="true">
                {this.state.images.map((item, index) => (
                  <Box margin="12px">
                    <img
                      src={URL.createObjectURL(item)}
                      style={{
                        height: "90px",
                        width:
                          this.state.view_type === 0
                            ? "160px"
                            : this.state.view_type === 1
                            ? "210px"
                            : 0,
                        objectFit: "scale-down",
                        backgroundColor: this.state.colors[index],
                      }}
                    />
                    <br />
                    <input
                      id={"contained-button-" + index}
                      type="color"
                      hidden
                      onChange={(e) => {
                        let colors = this.state.colors;
                        colors[index] = e.target.value;
                        this.setState({
                          colors,
                        });
                      }}
                      defaultValue="#000000"
                    />
                    <IconButton
                      aria-label="delete"
                      onClick={(e) => this.removeImage(index)}
                    >
                      <Delete />
                    </IconButton>
                    <label htmlFor={"contained-button-" + index}>
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                      >
                        <FormatColorFill />
                      </IconButton>
                    </label>
                  </Box>
                ))}
              </Box>
              <input
                accept="image/*"
                id="contained-button-file"
                onChange={(e) => {
                  
                  if (e.target.files && e.target.files[0]) {
                    let images = this.state.images;
                    images.push(e.target.files[0]);
                    this.state.colors.push("#ffffff");
                    this.setState({
                      images,
                    });
                    e.target.value = null;
                  }
                }}
                hidden
                name="images"
                type="file"
              />
              <br/>
              {this.state.view_type === 0 && this.state.images.length < 8 ? (
                <label htmlFor="contained-button-file">
                  <Button variant="contained" color="primary" component="span">
                    Thêm Ảnh
                  </Button>
                </label>
              ) : null}
              {this.state.view_type === 1 && this.state.images.length < 1 ? (
                <label htmlFor="contained-button-file">
                  <Button variant="contained" color="primary" component="span">
                    Thêm Ảnh
                  </Button>
                </label>
              ) : null}
              <br/>
              {(this.state.view_type === 2 || this.state.view_type === 3) &&
               (<div>
              <Box style={{ 
                backgroundColor: this.state.layout_bg
                }}>
                <TextField id="filled-basic" 
                label="Tiêu đề"
                 style = {{width:"100%"}} 
                 onChange={this.onFieldChange}
                variant="standard" 
                name="layout_title"
                error = {this.state.layout_titleError !== ""}
                helperText={this.state.layout_titleError}
                />
              </Box>
              <input
                id={"contained-button-title"}
                type="color"
                hidden
                onChange={this.onFieldChange}
                name="layout_bg"
                defaultValue="#ffffff"
              />
              <label htmlFor={"contained-button-title"}>
                <Button
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  Tùy chỉnh màu nền
                </Button>
              </label>
              <h4>Sản phẩm được chọn: {this.state.selectedProducts.length}</h4>
              <Box display="flex">
              <TextField 
              name="search" 
              style={{flexGrow:1}}
              onChange={this.onFieldChange}
              label="Tìm kiếm" 
              variant="outlined" 
              size="small"
              />
              <Button variant = "contained" color="primary" onClick={(e)=>this.searchProducts()}>
                Tìm
              </Button>
              </Box>
              <br/>
              {this.state.searching ?
              <Box display="flex" justifyContent="center" bgcolor="#00000010">
                <CircularProgress />
              </Box>:
              <Box display="flex" flexWrap="true" bgcolor="#00000010">
                {this.state.productlist === undefined ? 
                this.loadLastestProducts():
                this.state.productlist.map((item,index) => 
                  <FormControlLabel
                    control={<Checkbox 
                      onChange={e => {
                        if(e.target.checked){
                          this.state.selectedProducts.push(item.id)
                        }else{
                          let posi = this.state.selectedProducts.indexOf(item.id);
                          this.state.selectedProducts.splice(posi,1);
                        }
                        this.setState({});
                      }}
                    />}
                    label={<ProductView item={item}/>}
                    labelPlacement="bottom"
                  />
                )}
              </Box>
              }
              </div>
               )}
         </Box>
        </Dialog>
        <Backdrop style={{ zIndex: 1500 }} open={this.state.loading}>
          <CircularProgress color="primary" />
        </Backdrop>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            open={this.state.snackbar!==""}
            autoHideDuration={1000}
            onClose={e => this.setState({
              snackbar:""
            })}
            message={this.state.snackbar}
            
          />
      </div>
    );
  }
}

export const CategoryTab = ({ icon, title }) => {
  return (
    <Box textAlign="center">
      {icon !== "null" ? (
        <img src={icon} style={{ height: "30px", width: "30px" }} />
      ) : (
        <Home />
      )}
      <Typography variant="body2" textAlign="center">
        {title}
      </Typography>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    categories: state.categories,
    categoryPages: state.categoryPages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadCategories: (onSuccess, onError) =>
      dispatch(loadCategories(onSuccess, onError)),
    loadPage: (category, onSuccess, onError) =>
      dispatch(loadCategoryPage(category, onSuccess, onError)),
    addSection:(page,list) => dispatch({ type: "LOAD_PAGE",  payload: list, category:page })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFragment);
