import React, { Component } from 'react';
import {Container, Box , Typography,TextField,CircularProgress,Button} from "@material-ui/core";
import logo from "../media/logo.png";
import { firebaseAuth, firestore } from "../firebase";
class Login extends Component {

    constructor(props){
        super(props)
        this.state = {
            email:"",
            password:"",
            show_progress:false
        };
        this.handleChange = this.handleChange.bind()
        this.login = this.login.bind()
    }

    handleChange = (e) =>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    login= () =>{
        let valid_data = true;

        this.state.email_error = null;
        this.state.password_error = null;

        if(this.state.email===""){
            this.state.email_error = "Email không được để trống!";
            valid_data=false
        }
        if(this.state.password===""){
            this.state.password_error = "Mật khẩu không được để trống!";
            valid_data=false
        }

        if(valid_data){
            this.state.show_progress=true;
        }

        this.setState({
            update:true
        })

        if(valid_data){
            firestore.collection("USERS")
            .where('email','==',this.state.email)
            .where('IsAdmin','==',true)
            .get()
            .then(querySnapshot=>{
                if(!querySnapshot.empty){
                    firebaseAuth.
                    signInWithEmailAndPassword(
                        this.state.email,
                        this.state.password
                    ).then(res=>{
                        this.props.history.replace('/')
                    }).catch(err=>{
                        if(err.code == 'auth/wrong-password'){
                            this.state.password_error = "Sai mật khẩu. Vui lòng nhập lại!"
                        }
                        this.setState({
                            show_progress:true,
                        })
                    })
                }else{
                    this.state.email_error = "Không trùng khớp"
                    this.setState({
                        show_progress:false,
                    })
                }
            })
        }
    }

    render() {
        return (
            <Container maxWidth="sm">
                <Box 
                    bgcolor="white" 
                    boxShadow="2" 
                    textAlign="center" 
                    borderRadius="15px"
                    p ="24px" 
                    mt="50px"
                >
                    <img src={logo} height="50px"/>
                    <Typography variant="h5" color="textSecondary">ADMIN</Typography>
                    <TextField
                        label="Email"
                        id="filled-size-small"
                        variant="outlined"
                        fullWidth
                        name="email"
                        error={this.state.email_error!=null}
                        helperText={this.state.email_error}
                        onChange={this.handleChange}
                        margin="normal"
                        size="small"
                        color="secondary"
                    />
                    <TextField
                        label="Mật khẩu"
                        id="filled-size-small"
                        type="password"
                        variant="outlined"
                        name="password"
                        error={this.state.password_error!=null}
                        helperText={this.state.password_error}
                        onChange={this.handleChange}
                        fullWidth
                        margin="normal"
                        size="small"
                        color="secondary"
                    />
                    <br/>
                    <br/>
                    {this.state.show_progress?
                    <CircularProgress size={22} thickness={4} color="secondary" />
                    :null
                    }
                    <br/>
                    <br/>
                    <Button 
                        disableElevation 
                        variant="contained" 
                        color="primary" 
                        onClick={this.login}
                        fullWidth
                    >
                            Đăng Nhập
                    </Button>
                </Box>
            </Container>
        );
    }
}

export default Login;
