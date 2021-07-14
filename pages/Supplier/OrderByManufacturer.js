import React, { useState, map } from "react";
import PageHeader from "../../components/PageHeader";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/AccountBalance";
import {
  Paper,
  makeStyles,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import Popup from "../../components/Popup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import supplychain_contract from "../../components/Forms/factory";
import Provider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import InventoryForm from "./InventoryForm";


const headCells = [
  { id: "upc", label: "Item UPC" },
  { id: "material", label: "Raw material " },
  { id: "price", label: "Price" },
  { id: "createdAt", label: "Production Date" },
  { id: "quantity", label: "Quantity" },
  { id: "actions", label: "Actions" },
];

const useStyles = makeStyles({
  root: {
    minWidth: 75,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function RequestsByManufacturer() {
  const classes = useStyles();
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
 
  
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [users, setUsers] = useState([]);
  const [item, setitem] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const { TblPagination, recordsAfterPaging } = useTable(
    headCells,
    users,
    filterFn
  );

  const handleSearch = (e) => {
    e.preventDefault();
    let target = e.target;
    setSeach(target.value);
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.upc.toLowerCase().includes(target.value)
          );
      },
    });
  };
  React.useEffect(() => {
    axios
      .get("http://localhost:5000/user/getallrequests")
      .then((response) => {
        console.log(response);
        setUsers(response.data);
      });
    
  }, []);

const updateuser=async(user,req_id)=>{
  console.log(req_id,user)
  axios
  .put("http://localhost:5000/user/updatemanurequest",{
    quantity:user,
    req_id:req_id
  })
  .then(async(response) => {
    // cant run contract purchaseItemByManufacturer method herr eas this tab is for supplier
    // need to update the manu  sales order tab wih accept delivery button then onclick run the contract method
    

    setUsers(response.data[0]);
  });
}


const openInPopup = (item) => {
  setRecordForEdit(item);
  setOpenPopup(true);
};




const addOrEdit = ([user,req_id], resetForm) => {
  setOpenPopup(false);
  // if(user.id!=0)
  console.log(user.quantitys,req_id);
  updateuser(user.quantitys,req_id)
  // const accounts = "0xebf665bf612b6d7c129d8926627d393e0a6a8199";
    // console.log(web3.eth.getBalance(accounts).then(console.log));
    // const receiept = await supplychain_contract.methods
    //   .purchaseItemByManufacturer(item.upc, item.quantity, item.merchandizer)
    //   .send({
    //     from: accounts,
    //   });

    // console.log(receiept.transactionHash);
  setNotify({
    isOpen: true,
    message: `Submitted Successfully at transaction ID : ${user}`,
    type: "success",
  });
  setRecordForEdit(null);
  resetForm;
};
  return (
    <>
      <PageHeader
        title="New Product"
        subTitle="Adding products for Access"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />

      <Paper style={{ margin: "2px", padding: "2px" }}>
        <Toolbar>
          <Controls.Input
            style={{ width: "50%" }}
            label="Search Users"
            //   className={classes.SerachInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
          />
          <Controls.MainButton
            style={{ position: "absolute", right: "10px" }}
            text="Add New"
            //    className={classes.newButton}
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
            }}
          />
        </Toolbar>
        {recordsAfterPaging().map((item) => (
          <Card className={classes.root} variant="outlined">
            <CardContent key={item.user_id}>
              Manufacturer Name:
              <Typography variant="h5" component="h2">
                {item.user_name}
              </Typography>
              <Typography
                className={classes.title}
                color="textPrimary"
                gutterBottom
              >
                Merchandizer to contact: {item.merchandizer}
              </Typography>
              <Typography variant="body2" component="p">
                Material: {item.material}
              </Typography>
              <Typography variant="body2" component="p">
                UPC: {item.upc}
              </Typography>
              <Typography variant="body2" component="p">
                Quantity Required: {item.quantity}
              </Typography>
              <Typography variant="body2" component="p">
              Status: {item.status}
            </Typography>
              <Typography className={classes.pos} color="textPrimary">
                Description: {item.description}
                <br />
              </Typography>
            </CardContent>
            <Controls.ActionButton
            color="primary"
            onClick={() => {
              openInPopup(item);
            }}
          >
          Check Iventory
            <EditOutlinedIcon fontSize="small" />
          </Controls.ActionButton>
           
          </Card>
        ))}

        <TblPagination />
      </Paper>
      <Popup
      title="User Form"
      openPopup={openPopup}
      setOpenPopup={setOpenPopup}
    >
      <InventoryForm
        addOrEdit={addOrEdit}
        setOpenPopup={setOpenPopup}
        recordForEdit={recordForEdit}
      />
    </Popup>
    <Notification notify={notify} setNotify={setNotify} />
    <ConfirmDialog
      confirmDialog={confirmDialog}
      setConfirmDialog={setConfirmDialog}
    />
    
    </>
  );
}

