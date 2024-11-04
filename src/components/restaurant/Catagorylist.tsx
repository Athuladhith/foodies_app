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
import MainLayout from './Mainlayout';
import { fetchCategories,deletecatagory } from '../../actions/RestaurantAction'; // Replace with actual action
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

interface Column {
  id: 'name' | 'description' | 'avatar' | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 200, align: 'left' },
  { id: 'description', label: 'Description', minWidth: 250, align: 'left' },
  { id: 'avatar', label: 'Image', minWidth: 150, align: 'center' },
  { id: 'action', label: 'Action', minWidth: 150, align: 'center' },
];

interface Category {
  _id: string;
  name: string;
  description: string;
  avatar: string;
}

export default function CategoryTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { category } = useSelector((state: RootState) => state.restaurant); 

  React.useEffect(() => {
    dispatch(fetchCategories()); 
  }, [dispatch]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRegisterClick = () => {
    navigate('/addCategory'); 
  };

  const handleRemovecatagory = (id: string) => {
    dispatch(deletecatagory(id)); 
    window.location.reload();
  };

  return (
    <MainLayout>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
  {Array.isArray(category) && category.length > 0 ? (
    category
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((category: Category) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={category._id}>
          {columns.map((column) => {
            if (column.id === 'action') {
              return (
                <TableCell key={column.id} align={column.align}>
                  <Button variant="contained" color="error"
                    onClick={() => handleRemovecatagory(category._id)}>
                    Delete
                  </Button>
                </TableCell>
              );
            } else if (column.id === 'avatar') {
              return (
                <TableCell key={column.id} align={column.align}>
                  <img
                    src={`data:image/jpeg;base64,${category.avatar}`}
                    alt={category.name}
                    style={{ width: '100px', height: 'auto' }}
                  />
                </TableCell>
              );
            }
            const value = category[column.id as keyof Category];
            return (
              <TableCell key={column.id} align={column.align}>
                {value}
              </TableCell>
            );
          })}
        </TableRow>
      ))
  ) : (
    <TableRow>
      <TableCell colSpan={columns.length} align="center">
        No categories found.
      </TableCell>
    </TableRow>
  )}
</TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={category.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <Button variant="contained" color="primary" onClick={handleRegisterClick}>
            Add Category
          </Button>
        </div>
      </Paper>
      </MainLayout>
   
  );
}
