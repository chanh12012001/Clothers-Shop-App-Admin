import React, { Component } from "react";
import { Button, Container, TextField } from "@material-ui/core";
import MaterialTable from "material-table";
import { forwardRef } from "react";

import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { connect } from "react-redux";
import { firestore, storageRef } from "../firebase";
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "../Components/Actions/CategoryAction";
import { Home } from "@material-ui/icons";

export const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

class ManageCatergoryFragment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { title: "Index", field: "index", type: "numeric" },
        {
          title: "Category",
          field: "categoryName",
          editable: "onAdd",
        },
        {
          title: "Icon",
          field: "icon",
          editComponent: (props) =>
            props.value === "null" ? (
              <Home />
            ) : (
              <>
                <input
                  accept="image/*"
                  id="contained-button-file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      this.setState({
                        images: e.target.files[0],
                      });
                      props.onChange(e.target.value);
                      e.target.value = null;
                    }
                  }}
                  hidden
                  name="image"
                  type="file"
                />
                <label htmlFor="contained-button-file">
                  {this.state.image || props.value ? (
                    <img
                      src={
                        this.state.image
                          ? this.renderImageUrl(this.state.image)
                          : props.value
                      }
                      style={{ width: 40, height: 40 }}
                    />
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      Thêm Ảnh
                    </Button>
                  )}
                </label>
              </>
            ),
          render: (rowData) =>
            rowData.icon === "null" ? (
              <Home />
            ) : (
              <img src={rowData.icon} style={{ width: 40, height: 40 }} />
            ),
        },
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

  uploadImage = (onCompleted) => {
    let file = this.state.image;
    try {
      if (file.starsWith("https")) {
        onCompleted(file);
      }
    } catch (error) {
      var ts = String(new Date().getTime()),
        i = 0,
        out = "";
      for (i = 0; i < ts.length; i += 2) {
        out += Number(ts.substr(i, 2)).toString(36);
      }

      let filename = "category" + out;

      var uploadTask = storageRef
        .child("categories/" + filename + ".jpg")
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
            onCompleted(downloadUrl);
          });
        }
      );
    }
  };

  deleteImage = (image, onComplete) => {
    let splited_link = image.split("/");
    let name = splited_link[splited_link.length - 1]
      .split("?")[0]
      .replace("banners%2F", "");

    storageRef
      .child("categories/" + name)
      .delete()
      .then(() => {
        onComplete(true);
      })
      .catch((err) => {
        onComplete(false);
      });
  };

  render() {
    return (
      <div>
        <Container maxWidth="md" fixed>
          <MaterialTable
            icons={tableIcons}
            title="Danh mục"
            options={{ search: false, paging: false }}
            columns={this.state.columns}
            data={this.props.categories}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  if (newData.index && newData.categoryName && newData.icon) {
                    this.uploadImage((url) => {
                      newData["icon"] = url;
                      this.props.addCategory(
                        newData,
                        () => resolve(),
                        (error) => resolve()
                      );
                    });
                  } else {
                    resolve();
                    this.setState({
                      image: null,
                    });
                  }
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  console.log(newData, oldData);
                  if (
                    newData.index === oldData.index &&
                    newData.icon === oldData.icon
                  ) {
                    resolve();
                    this.setState({
                      image: null,
                    });
                  } else if (newData.icon === oldData.icon) {
                    this.props.updateCategory(
                      newData,
                      () => resolve(),
                      (error) => resolve()
                    );
                  } else {
                    this.deleteImage(oldData.icon, (success) => {
                      if (success) {
                        this.uploadImage((url) => {
                          newData["icon"] = url;
                          this.props.update(
                            newData,
                            () => resolve(),
                            (error) => resolve()
                          );
                        });
                      } else {
                        resolve();
                      }
                    });
                  }
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  this.props.deleteCategory(
                    oldData.categoryName,
                    () => resolve(),
                    (error) => resolve()
                  );
                }),
            }}
          />
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.categories,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCategory: (data, onSuccess, onError) =>
      dispatch(addCategory(data, onSuccess, onError)),
    deleteCategory: (name, onSuccess, onError) =>
      dispatch(deleteCategory(name, onSuccess, onError)),
    updateCategory: (data, onSuccess, onError) =>
      dispatch(updateCategory(data, onSuccess, onError)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageCatergoryFragment);
