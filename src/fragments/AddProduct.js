import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { Delete, FormatColorFill } from "@material-ui/icons";
import MaterialTable, { MTableEditField, MTableEditRow } from "material-table";
import React, { Component } from "react";
import { tableIcons } from "./ManageCatergoryFragment";
import firebase, { firestore, storageRef } from "../firebase";

class AddProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      images: [],
      COD: false,
      coupon_type: "percentage",
      product_title: { error: "", value: "" },
      price: { error: "", value: "" },
      cutted_price: { error: "", value: "0" },
      free_coupens: { error: "", value: "0" },
      free_coupen_title: { error: "", value: "" },
      validity: { error: "", value: "" },
      body: { error: "", value: "" },
      lower_limit: { error: "", value: "" },
      upper_limit: { error: "", value: "" },
      percentage: { error: "", value: "" },
      discount_amount: { error: "", value: "" },
      max_quantity: { error: "", value: "" },
      offers_applied: { error: "", value: "0" },
      product_description: { error: "", value: "" },
      product_other_details: { error: "", value: "" },
      stock_quantity: { error: "", value: "" },
      tags: { error: "", value: "" },

      columns: [
        {
          title: "Key",
          field: "field",
        },
        { title: "Value", field: "value" },
      ],
      data: [
        //   { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
        //   { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
        // ),
      ],
    };
  }

  renderImageUrl = (item) => {
    try {
      return URL.createObjectURL(item);
    } catch (error) {
      return item;
    }
  };

  removeImage = (index) => {
    let images = this.state.images;

    let image = images[index];
    images.splice(index, 1);
    try {
      if (image.starsWith("https")) {
        this.setState(
          { loading: true }
          //   this.deleteImages([image], 0, () => {
          //     this.setState({
          //       loading: false,
          //       images,
          //     });
          //   })
        );
      }
    } catch (error) {
      this.setState({
        images,
      });
    }
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: { error: "", value: e.target.value },
    });
  };

  uploadImages = (images, index, urls, onCompleted) => {
    const uploadAgain = (images, index, urls, onCompleted) =>
      this.uploadImages(images, index, urls, onCompleted);

    let file = images[index];
    try {
      if (file.starsWith("https")) {
        urls.push(file);
        index++;
        if (index < images.length) {
          uploadAgain(images, index, urls, onCompleted);
        } else {
          onCompleted();
        }
      }
    } catch (error) {
      var ts = String(new Date().getTime()),
        i = 0,
        out = "";
      for (i = 0; i < ts.length; i += 2) {
        out += Number(ts.substr(i, 2)).toString(36);
      }

      let filename = "banner" + out;

      var uploadTask = storageRef
        .child("products/" + filename + ".jpg")
        .put(file);

      uploadTask.on(
        "state_changed",
        function (snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        function (error) {
          // Handle unsuccessful uploads
        },
        function () {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
            urls.push(downloadUrl);
            index++;
            if (index < images.length) {
              uploadAgain(images, index, urls, onCompleted);
            } else {
              onCompleted();
            }
          });
        }
      );
    }
  };

  uploadProduct = (e) => {
    if (this.state.images.length === 0) {
      return;
    }
    if (this.state.useTabLayout && this.state.data.length === 0) {
      return;
    }
    let mandatoryFields = [
      "product_title",
      "price",
      "max_quantity",
      "product_description",
      "product_other_details,",
      "stock_quantity",
      "tags",
    ];
    if (this.state.attachCoupon) {
      let couponsFields = [
        "free_coupen_title",
        "validity",
        "body",
        "lower_limit",
        "upper_limit",
      ];
      if (this.state.coupon_type === "percentage") {
        couponsFields.push("percentage");
      } else {
        couponsFields.push("discount_amount");
      }
      mandatoryFields = [...mandatoryFields, ...couponsFields];
    }

    let uploadSignal = true;

    mandatoryFields.forEach((element) => {
      let field = this.state[element];
      if (field?.value === "") {
        field.error = "Required!";
        uploadSignal = false;
      }
    });

    if (!uploadSignal) {
      this.setState({});
      return;
    }

    let index = 0;
    let urls = [];
    this.setState({
      loading: true,
    });

    this.uploadImages(this.state.images, index, urls, () => {
      let data = {
        added_on: firebase.firestore.Timestamp.fromDate(new Date()),
        no_of_product_images: urls.length,
        product_title: this.state.product_title.value,
        product_price: this.state.price.value,
        product_other_details: this.state.product_other_details.value,
        COD: this.state.COD,
        cutted_price: this.state.cutted_price.value,
        ["max-quantity"]: this.state.max_quantity.value,
        offers_applies: this.state.offers_applied.value,
        stock_quantity: this.state.stock_quantity.value,
        tags: this.state.tags.value.split(","),
      };

      if (this.state.attachCoupon) {
        data["free_coupen_body"] = this.state.body.value;
        data["free_coupen_title"] = this.state.free_coupen_title.value;
        data["free_coupens"] = this.state.free_coupens.value;
        data["lower_limit"] = this.state.lower_limit.value;
        data["upper_limit"] = this.state.upper_limit.value;
        data["validity"] = this.state.validity.value;
        if (this.state.coupon_type === "percentage") {
          data["percentage"] = this.state.percentage.value;
        } else {
          data["amount"] = this.state.discount_amount.value;
        }
      }

      if (this.state.useTabLayout) {
        let sectionCount = 0;
        let index = 0;
        this.state.data.forEach((row) => {
          if (row.field === "title") {
            if (sectionCount > 0) {
              data["spec_title_" + sectionCount + "_total_fields"] = index;
            }
            index = 0;
            sectionCount++;
            data["spec_title_" + sectionCount] = row.value;
          } else {
            index++;
            data["spec_title_" + sectionCount + "_field_" + index + "_name"] =
              row.field;
            data["spec_title_" + sectionCount + "_field_" + index + "_value"] =
              row.value;
          }
        });

        data["total_spec_titles"] = sectionCount;
      }

      urls.forEach((url, index) => {
        data["product_image_" + (index + 1)] = url;
      });

      firestore
        .collection("PRODUCTS")
        .add(data)
        .then(function (doc) {
          let docId = doc.Id;
          for (
            let index = 0;
            index < parseInt(this.state.stock_quantity.value);
            index++
          ) {
            firestore
              .collection("PRODUCTS")
              .doc(docId)
              .collection("QUANTITY")
              .add({ time: firebase.firestore.Timestamp.fromDate(new Date()) })
              .then(function (doc) {
                this.setState({
                  loading: false,
                });
                /////uploaded successfully
              })
              .catch((err) => {
                this.setState({
                  loading: false,
                });
                //error
              });
          }
        })
        .catch((err) => {
          this.setState({
            loading: false,
          });
          //error
        });
    });
  };

  render() {
    console.log(this.state.data);
    return (
      <Box bgcolor="#fff" boxShadow={1} p={4}>
        <Typography variant="h5" gutterBottom>
          Sản phẩm mới
        </Typography>
        <Box display="flex" flexWrap="true">
          {this.state.images.map((item, index) => (
            <Box margin="12px">
              <img
                src={this.renderImageUrl(item)}
                style={{
                  height: "90px",
                  width: "160px",
                  objectFit: "scale-down",
                }}
              />
              <br />
              <IconButton
                aria-label="delete"
                onClick={(e) => this.removeImage(index)}
              >
                <Delete />
              </IconButton>
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
        <br />

        {this.state.images.length < 8 ? (
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary" component="span">
              Thêm Ảnh
            </Button>
          </label>
        ) : null}
        <br />
        <TextField
          fullWidth
          margin="normal"
          label="Tên sản phẩm"
          id="outlined-size-small"
          error={this.state.product_title.error !== ""}
          helperText={this.state.product_title.error}
          defaultValue={this.state.product_title.value}
          onChange={this.onChange}
          name="product_title"
          variant="outlined"
          size="small"
        />

        <br />
        <TextField
          margin="normal"
          onChange={this.onChange}
          name="price"
          label="Giá"
          type="number"
          error={this.state.price.error !== ""}
          helperText={this.state.price.error}
          defaultValue={this.state.price.value}
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <TextField
          margin="normal"
          onChange={this.onChange}
          name="cutted_price"
          style={{ marginLeft: "16px" }}
          label="Giá giảm"
          error={this.state.cutted_price.error !== ""}
          helperText={this.state.cutted_price.error}
          type="number"
          defaultValue={this.state.cutted_price.value}
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <br />
        <TextField
          margin="normal"
          onChange={this.onChange}
          name="free_coupens"
          type="number"
          label="Mã khuyến mãi"
          id="outlined-size-small"
          error={this.state.free_coupens.error !== ""}
          helperText={this.state.free_coupens.error}
          defaultValue={this.state.free_coupens.value}
          variant="outlined"
          size="small"
        />
        <br />
        <FormControlLabel
          control={
            <Switch
              name="attach_coupon"
              color="primary"
              onChange={(e) =>
                this.setState({
                  attachCoupon: e.target.checked,
                })
              }
            />
          }
          label="Đính kèm mã giảm"
        />
        <Box
          border={1}
          p={3}
          borderRadius={8}
          hidden={!this.state.attachCoupon}
        >
          <RadioGroup
            aria-label="gender"
            name="coupon_type"
            onChange={(e) => this.setState({ coupon_type: e.target.value })}
            defaultValue="percentage"
          >
            <FormControlLabel
              value="percentage"
              control={<Radio />}
              label="Giảm giá"
            />
            <FormControlLabel
              value="flat_vnd_off"
              control={<Radio />}
              label="Giảm đồng loạt"
            />
          </RadioGroup>
          <TextField
            margin="normal"
            label="Têm mã KM"
            onChange={this.onChange}
            name="free_coupen_title"
            error={this.state.free_coupen_title.error !== ""}
            helperText={this.state.free_coupen_title.error}
            defaultValue={this.state.free_coupen_title.value}
            id="outlined-size-small"
            variant="outlined"
            size="small"
          />
          <TextField
            margin="normal"
            style={{ marginLeft: "16px" }}
            onChange={this.onChange}
            name="validity"
            type="number"
            label="Hiệu lực đến ngày"
            error={this.state.validity.error !== ""}
            helperText={this.state.validity.error}
            defaultValue={this.state.validity.value}
            id="outlined-size-small"
            variant="outlined"
            size="small"
          />
          <br />
          <TextField
            margin="normal"
            id="outlined-multiline-static"
            label="Nội dung mã KM"
            onChange={this.onChange}
            name="body"
            multiline
            fullWidth
            rows={4}
            error={this.state.body.error !== ""}
            helperText={this.state.body.error}
            defaultValue={this.state.body.value}
            variant="outlined"
          />
          <br />
          <TextField
            margin="normal"
            label="Đơn tối thiểu"
            onChange={this.onChange}
            name="lower_limit"
            type="number"
            error={this.state.lower_limit.error !== ""}
            helperText={this.state.lower_limit.error}
            defaultValue={this.state.lower_limit.value}
            id="outlined-size-small"
            variant="outlined"
            size="small"
          />
          <TextField
            margin="normal"
            style={{ marginLeft: "16px" }}
            label="Đơn tối đa"
            onChange={this.onChange}
            name="upper_limit"
            type="number"
            error={this.state.upper_limit.error !== ""}
            helperText={this.state.upper_limit.error}
            defaultValue={this.state.upper_limit.value}
            id="outlined-size-small"
            variant="outlined"
            size="small"
          />
          {this.state.coupon_type === "percentage" ? (
            <TextField
              margin="normal"
              style={{ marginLeft: "16px" }}
              onChange={this.onChange}
              name="percentage"
              label="% giảm"
              type="number"
              error={this.state.percentage.error !== ""}
              helperText={this.state.percentage.error}
              defaultValue={this.state.percentage.value}
              id="outlined-size-small"
              variant="outlined"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              style={{ marginLeft: "16px" }}
              onChange={this.onChange}
              name="discount_amount"
              label="Số lượng giảm giá"
              type="number"
              error={this.state.discount_amount.error !== ""}
              helperText={this.state.discount_amount.error}
              defaultValue={this.state.discount_amount.value}
              id="outlined-size-small"
              variant="outlined"
              size="small"
            />
          )}
        </Box>
        <br />
        <TextField
          margin="normal"
          label="SL tối đa"
          error={this.state.max_quantity.error !== ""}
          helperText={this.state.max_quantity.error}
          defaultValue={this.state.max_quantity.value}
          onChange={this.onChange}
          name="max_quantity"
          type="number"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <TextField
          margin="normal"
          style={{ marginLeft: "16px" }}
          label="Đã áp dụng"
          onChange={this.onChange}
          type="number"
          error={this.state.offers_applied.error !== ""}
          helperText={this.state.offers_applied.error}
          defaultValue={this.state.offers_applied.value}
          name="offers_applied"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <br />
        <TextField
          margin="normal"
          id="outlined-multiline-static"
          label="Mô tả sản phẩm"
          onChange={this.onChange}
          name="product_description"
          fullWidth
          multiline
          rows={4}
          error={this.state.product_description.error !== ""}
          helperText={this.state.product_description.error}
          defaultValue={this.state.product_description.value}
          variant="outlined"
        />
        <br />
        <FormControlLabel
          control={
            <Switch
              name="use_tab_layout"
              color="primary"
              onChange={(e) =>
                this.setState({
                  useTabLayout: e.target.checked,
                })
              }
            />
          }
          label="Dùng giao diện nhãn"
        />
        {this.state.useTabLayout && (
          <MaterialTable
            icons={tableIcons}
            title="Chi tiết kĩ thuật"
            options={{ search: false, paging: false }}
            columns={this.state.columns}
            data={this.state.data}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  resolve();
                  this.setState((prevState) => {
                    const data = [...prevState.data];
                    data.push(newData);
                    return { ...prevState, data };
                  });
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  resolve();
                  if (oldData) {
                    this.setState((prevState) => {
                      const data = [...prevState.data];
                      data[data.indexOf(oldData)] = newData;
                      return { ...prevState, data };
                    });
                  }
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  resolve();
                  this.setState((prevState) => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                }),
            }}
          />
        )}
        <br />
        <TextField
          margin="normal"
          id="outlined-multiline-static"
          label="Chi tiết khác"
          error={this.state.product_other_details.error !== ""}
          helperText={this.state.product_other_details.error}
          defaultValue={this.state.product_other_details.value}
          onChange={this.onChange}
          name="product_other_details"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
        />
        <br />
        <TextField
          margin="normal"
          label="Kho"
          onChange={this.onChange}
          name="stock_quantity"
          type="number"
          error={this.state.stock_quantity.error !== ""}
          helperText={this.state.stock_quantity.error}
          defaultValue={this.state.stock_quantity.value}
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <br />
        <FormControlLabel
          control={
            <Switch
              name="COD"
              color="primary"
              onChange={(e) =>
                this.setState({
                  COD: e.target.checked,
                })
              }
            />
          }
          label="COD"
        />

        <br />
        <TextField
          margin="normal"
          label="Tags"
          fullWidth
          onChange={this.onChange}
          name="tags"
          id="outlined-size-small"
          variant="outlined"
          size="small"
          error={this.state.tags.error !== ""}
          helperText={this.state.tags.error}
          defaultValue={this.state.tags.value}
        />
        <br />
        <Button
          variant="contained"
          fullWidth
          color="primary"
          component="span"
          onClick={this.uploadProduct}
        >
          Upload
        </Button>
        <Backdrop style={{ zIndex: 1500 }} open={this.state.loading}>
          <CircularProgress color="primary" />
        </Backdrop>
      </Box>
    );
  }
}

export default AddProduct;
