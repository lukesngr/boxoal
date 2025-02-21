import TextField from '@mui/material/TextField';
import { useState } from 'react';
import '../../styles/signin.scss';
import {InputAdornment, FormControl, IconButton, Stack, Dialog, DialogTitle, DialogContent, DialogContentText} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { signIn } from 'aws-amplify/auth';

export default function SignInCard() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);

    async function login(e){
        e.preventDefault();
        if(username !="" && password != ""){
            try {
                const result = await signIn({username, password});
                console.log(result);
            } catch (error) {
                setErrorMessage(error.message);
                setShowError(true);
            }
        }else if(username == ""){
            document.querySelector('#usernameInput').reportValidity();
        }else if(password == ""){
            document.querySelector('#passwordInput').reportValidity();
        }
    }

    return (
    <>
        <Dialog
            open={showError}
            onClose={() => setShowError(false)}
        >
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {errorMessage}
                </DialogContentText>
            </DialogContent>
        </Dialog>
        <div id="signInCard">
            <h1>Sign In</h1>
            <form onSubmit={login}>
                <Stack spacing={1}>
                    <TextField 
                        sx={{backgroundColor: 'white'}} 
                        required={true} 
                        value={username}
                        id="usernameInput" 
                        onChange={(e) => setUsername(e.target.value)} 
                        label="Username" 
                        variant="standard" />
                    <FormControl sx={{ m: 1, backgroundColor: 'white' }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                        <Input
                            required={true}
                            id="passwordInput"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label={
                                    showPassword ? 'hide the password' : 'display the password'
                                }
                                onClick={() => setShowPassword(!showPassword)}
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                    <Button sx={{borderRadius: '10px', color: 'white'}} variant="contained" type="submit" onClick={login}>Sign In</Button>
                    <div className='alternateActions'>
                        <button className='forgetPasswordButton'>Forget Password</button>
                        <button className='createAccountText'>Create Account</button>
                    </div>
                </Stack>
            </form>
        </div>
    </>)
}