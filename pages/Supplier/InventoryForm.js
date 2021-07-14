import React, { useState, map } from "react";
import PageHeader from "../../components/PageHeader";
import TextField from "@material-ui/core/TextField";
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
import { useForm, Form } from "../../components/useForm";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";


const headCells = [
  { id: "upc", label: "UPC" },

  { id: "quantity", label: "Quantity" },
  { id: "quantitys", label: "Deliver Quantity" },
  { id: "location", label: "Location" },
  //{id:'date', label: 'Date'},
  { id: "description", label: "Requirement" },

  { id: "action", label: "Action" },
];

export default function InventoryForm(props) {
  console.log(props);
  const { addOrEdit, setOpenPopup, recordForEdit } = props;
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const initialFValues = {
    quantitys: "",
  };
  const [search, setSeach] = useState("");
  const [users, setUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("quantity" in fieldValues)
      temp.quantitys = fieldValues.quantitys ? "" : "This field is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

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

  React.useEffect(() => {

    setUsers([recordForEdit]);

    console.log(recordForEdit);
  }, []);

  const acceptOrder = async (item) => {
    console.log(item.upc);
    axios
      .get("http://localhost:5000/user/acceptorder", {
        params: {
          upc: item.upc,
          quantity: values.quantitys,
          material: item.material,
          description: item.description,
          merchandizer: item.merchandizer,
          muser_id: item.user_id,
          req_id : item.req_id
          //pass user id of supplier currently logged in
        },
      })
      .then((response) => {
        console.log(response);
        addOrEdit([values,item.req_id],resetForm);
      });
    
    // const accounts = "0xebf665bf612b6d7c129d8926627d393e0a6a8199";
    // console.log(web3.eth.getBalance(accounts).then(console.log));
    // const receiept = await supplychain_contract.methods
    //   .purchaseItemByManufacturer(item.upc, item.quantity, item.merchandizer)
    //   .send({
    //     from: accounts,
    //   });

    // console.log(receiept.transactionHash);

    setOpenPopup(false);
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
              <TableRow key={item.user_id}>
                <TableCell>{item.upc}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <TextField
                    id="standard-number"
                    name="quantitys"
                    type="number"
                    value={values.quantitys}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.description}</TableCell>

                {/* <TableCell>{item.date}</TableCell> */}
                <TableCell>
                  <Controls.ActionButton
                    label="Action"
                    color="primary"
                    onClick={() => acceptOrder(item)}
                  >
                    Create Delivery
                  </Controls.ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
    </>
  );
}
