import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import MainLayout from './Mainlayout';
import { fetchFoodItem, deleteitem } from '../../actions/RestaurantAction';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

interface Column {
  id: 'name' | 'description' | 'price' | 'quantity' | 'image' | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 150, align: 'left' },
  { id: 'description', label: 'Description', minWidth: 250, align: 'left' },
  { id: 'price', label: 'Price', minWidth: 100, align: 'right' },
  { id: 'quantity', label: 'Quantity', minWidth: 100, align: 'right' },
  { id: 'image', label: 'Image', minWidth: 150, align: 'center' },
  { id: 'action', label: 'Action', minWidth: 150, align: 'center' },
];

interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export default function FoodItemTable() {
  const [searchName, setSearchName] = React.useState<string>('');
  const [searchCategory, setSearchCategory] = React.useState<string>('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [selectedFoodItemId, setSelectedFoodItemId] = React.useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { foodItem,loading } = useSelector((state: RootState) => state.restaurant);

  // Fetch food items on component mount or search change
  React.useEffect(() => {
    dispatch(fetchFoodItem(searchName, searchCategory));
  }, [dispatch, searchName, searchCategory]);

  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };

  const handleSearchCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCategory(event.target.value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddFoodItemClick = () => {
    navigate('/addFoodItem');
  };

  const handleDeleteClick = (id: string) => {
    setSelectedFoodItemId(id);
    setOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFoodItemId) {
      dispatch(deleteitem(selectedFoodItemId));
      window.location.reload();
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <MainLayout>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {/* Search Inputs */}
        <Grid container spacing={2} sx={{ padding: '16px' }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Search by Name"
              variant="outlined"
              value={searchName}
              onChange={handleSearchNameChange}
            />
          </Grid>
        </Grid>

        {/* Loader */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            {/* Table Content */}
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(foodItem) &&
                    foodItem.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((foodItem: FoodItem) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={foodItem._id}>
                        {columns.map((column) => {
                          if (column.id === 'action') {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => navigate(`/editfooditem/${foodItem._id}`)}
                                  sx={{ marginRight: 1 }}
                                >
                                  Edit
                                </Button>
                                <Button variant="contained" color="error" onClick={() => handleDeleteClick(foodItem._id)}>
                                  Delete
                                </Button>
                              </TableCell>
                            );
                          } else if (column.id === 'image') {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <img
                                  src={`data:image/jpeg;base64,${foodItem.image}`}
                                  alt={foodItem.name}
                                  style={{ width: '100px', height: 'auto' }}
                                />
                              </TableCell>
                            );
                          }
                          const value = foodItem[column.id as keyof FoodItem];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={Array.isArray(foodItem) ? foodItem.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <Button variant="contained" color="primary" onClick={handleAddFoodItemClick}>
            Add Food Item
          </Button>
        </div>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete this food item?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
