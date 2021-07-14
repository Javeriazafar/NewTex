import React, { useState, map } from "react";
import PageHeader from "../../components/PageHeader";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/AccountBalance";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import {  Search } from "@material-ui/icons";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../components/Popup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";

const headCells = [
  { id: "Supplier", label: "Supplier" },

  { id: "upc", label: "UPC" },
  { id: "merchandizer", label: "Merchandizer" },
  
  { id: "description", label: "Description" },
  { id: "order", label: "Order Date" },
  { id: "quantity", label: "Quantity" },
  { id: "status", label: "Status" },

  //{id:'date', label: 'Date'},
  { id: "actions", label: "Actions" },
];

export default function SSOform() {
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [search, setSeach] = useState("");

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [userList, setUserList] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [users, setUsers] = useState([]);
 
  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    headCells,
    users,
    filterFn
  );

  const handleSearch = (e) => {
    e.preventDefault();
    let target = e.target;
    setSeach(target.value);
    // console.log(search)
    // users.map((i)=>{
    //     if(i.user_name==search){
    //         console.log (i.user_id)
    //     }})
    //         let  holder = users.filter(item=>item.user_name.toLowerCase().includes(search.toLowerCase()))
    //   setholder(holder)
    //   console.log(holder)

    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.user_name.toLowerCase().includes(target.value)
          );
      },
    });
  };
 
// function to acceptdelivery and use contract method
// const accounts = "0xebf665bf612b6d7c129d8926627d393e0a6a8199";
    // //console.log(web3.eth.getBalance(accounts).then(console.log));
    // const receiept = await supplychain_contract.methods
    //   .purchaseItemByManufacturer(response.data[0].upc, user, response.data[0].merchandizer)
    //   .send({
    //     from: accounts,
    //   });

    // console.log(receiept.transactionHash);
  React.useEffect(() => {
    axios.get("http://localhost:5000/user/getMSO").then((response) => {
      console.log(response);
      setUsers(response.data);
    });
  }, []);

  const addOrEdit = (user, resetForm) => {
    setOpenPopup(false);
    // if(user.id!=0)
    //    {updateUser();}
    setNotify({
      isOpen: true,
      message: `Submitted Successfully at transaction ID : ${user}`,
      type: "success",
    });
    setRecordForEdit(null);
    resetForm;
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const onDelete = (user_id) => {
    console.log(user_id);
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    axios.delete(`http://localhost:5000/users/deleteitem/${user_id}`).then((response) => {
      setUsers(
        users.filter((val) => {
          return val.user_id !== user_id;
        })
      );
    });
    setNotify({
      isOpen: true,
      message: "Deleted Successfully",
      type: "error",
    });
  };

  return (
    <>
      <PageHeader
        title="New User"
        subTitle="Adding users for Access"
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

        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPaging().map((item) => (
              <TableRow key={item.mso_id}>
                <TableCell>{item.user_name}</TableCell>
                <TableCell>{item.upc}</TableCell>
                <TableCell>{item.merchandizer}</TableCell>
                <TableCell>{item.descript}</TableCell>
                <TableCell>{item.SOCreatedAt}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.status}</TableCell>

                {/* <TableCell>{item.date}</TableCell> */}
                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      openInPopup(item);
                    }}
                  >
                    Order Pending
                  </Controls.ActionButton>
                  <Controls.ActionButton
                    color="secondary"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: "Are you sure to delete this record?",
                        subTitle: "You can't undo this operation",
                        onConfirm: () => {
                          onDelete(item.user_id);
                        },
                      });
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </Controls.ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup
        title="User Form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}

