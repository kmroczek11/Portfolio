import React from "react"
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

interface DialogBoxProps {
  title: string,
  content: string,
  agreeTxt: string,
  disagreeTxt?: string,
  onAgreed?: () => void,
}


const DialogBox = ({ title, content, agreeTxt, disagreeTxt, onAgreed }: DialogBoxProps): JSX.Element => {
  const [open, setOpen] = useState(true);

  const handleAgreed = () => {
    onAgreed && onAgreed();
    setOpen(false);
  }

  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle
        id="alert-dialog-title"
        sx={{ color: '#d4af37', backgroundColor: '#000' }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: '#000' }}>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ color: '#fff', whiteSpace: 'pre-wrap' }}
        >
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: '#000' }}>
        <Button sx={{ color: '#d4af37' }} onClick={handleAgreed} autoFocus>
          {agreeTxt}
        </Button>
        {disagreeTxt && (
          <Button sx={{ color: '#d4af37' }} onClick={handleClose}>
            {disagreeTxt}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
