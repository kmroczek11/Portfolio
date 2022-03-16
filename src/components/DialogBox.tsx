import { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

interface DialogBoxProps {
    title: string,
    content: string,
    agreeTxt: string,
    classes: any,
    disagreeTxt?: string,
    onAgreed?: () => void,
}

const styles = {
    container: {
        background: '#000',
        zIndex: 1
    },
    text: {
        color: '#fff'
    },
    button: {
        color: '#d4af37'
    }
};

const DialogBox = ({ title, content, agreeTxt, classes, disagreeTxt, onAgreed, }: DialogBoxProps): JSX.Element => {
    const [open, setOpen] = useState<boolean>(true);

    const handleAgreed = () => {
        onAgreed && onAgreed();
        setOpen(false);
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle className={`${classes.container} ${classes.text}`} id='alert-dialog-title'>{title}</DialogTitle>
            <DialogContent className={classes.container}>
                <DialogContentText
                    className={classes.text}
                    id='alert-dialog-description'
                    style={{ whiteSpace: 'pre-wrap' }}
                >
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions className={classes.container}>
                <Button className={classes.button} onClick={handleAgreed} autoFocus>
                    {agreeTxt}
                </Button>
                {
                    disagreeTxt &&
                    <Button className={classes.button} onClick={handleClose}>
                        {disagreeTxt}
                    </Button>
                }
            </DialogActions>
        </Dialog>
    );
}

export default withStyles(styles)(DialogBox);
