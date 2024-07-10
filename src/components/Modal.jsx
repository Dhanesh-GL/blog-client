import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function AlertDialog({ agree, open, setOpen }) {
  const handleClose1 = () => {
    setOpen(false);
    agree();
  };
  const handleClose2 = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <HiOutlineExclamationCircle className="custom-icon" />
            Are you sure you want to delete this comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display:'flex', justifyContent:'center'}}>
          <Button variant="contained" onClick={handleClose1}>
            Yes, I'm sure
          </Button>
          <Button variant="contained" onClick={handleClose2} autoFocus>
            No, cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
