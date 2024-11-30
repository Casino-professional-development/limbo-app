import { useContext, useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import FundContext from "../context/FundContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import snackbar from "../hooks/snackbar";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

let autoFlag = false;

const Header = () => {
  const { fund, userId, setFund, depositFlag, autobetFlag } =
    useContext(FundContext);

  const [open, setOpen] = useState(false);
  const [dialogOpen, setdialogOpen] = useState(false);
  const dialoghandleClose = () => setdialogOpen(false);

  const Refund = () => {
    setFund(0);
    dialoghandleClose();
    toast.success("Refun Successed!");
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/api/game/save-game`, {
        fund,
        userId,
      })
      .then((res) => {
        document.location.href = "http://annie.ihk.vipnps.vip/iGaming-web/#/";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (depositFlag) {
      setOpen(true);
    }
  }, [depositFlag]);

  useEffect(() => {
    autoFlag = autobetFlag;
  }, [autobetFlag]);

  return (
    <Stack className="header">
      <Container>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          className="box"
          gap={2}
          py={2}
        >
          <Stack>
            <Button
              variant="contained"
              className="refund"
              onClick={() => {
                if (autoFlag) {
                  snackbar("Please stop the autobet!", "error");
                } else {
                  setdialogOpen(true);
                }
              }}
            >
              Reback
            </Button>
          </Stack>
          <Stack direction="column" textAlign="end" className="userInfo">
            <Typography component={"span"} variant={"body2"} className="text-color">ID: {userId}</Typography>
            <Typography component={"span"} variant={"body2"}>
              {fund/100} <span className="text-color">₹</span>
            </Typography>
          </Stack>
        </Stack>
      </Container>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ color: "red", fontWeight: "900" }}
          >
            Not Enough Funds!
          </Typography>
          <Stack gap={2}>
            <Typography component={"span"} variant={"body2"} id="modal-modal-description" sx={{ mt: 2 }}>
              Please deposit funds to play the game!
            </Typography>
            <Button
              href="http://annie.ihk.vipnps.vip/iGaming-web/#/pages/recharge/recharge"
              variant="contained"
              className="refund"
              target="_blank"
            >
              Deposit
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Dialog
        open={dialogOpen}
        onClose={dialoghandleClose}
        aria-labelledby="responsive-dialog-title"
        className="dialog-refund"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Confirm to refund!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you click the "Agree", you will be returned to the homepage!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={dialoghandleClose} className="refund">
            Disagree
          </Button>
          <Button onClick={Refund} autoFocus className="refund">
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Header;
