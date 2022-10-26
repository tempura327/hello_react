import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

function Toast(props){
    return (
        <Snackbar open={props.isShow} autoHideDuration={props.autoHide} onClose={props.onClose}>
            <Alert severity={props.variant}>{props.message}</Alert>
        </Snackbar>
    )
}

Toast.defaultProps = {
    autoHide:3000,
    variant:'error',
    message:'Error'
};

export default Toast;