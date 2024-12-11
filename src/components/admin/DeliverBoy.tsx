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
import MainLayout from './MainLayout';
import { fetchDeliveryPersons, blockUnblockDeliveryboy } from '../../actions/adminAction';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

interface Column {
  id: 'Image' | 'name' | 'email'  | 'address' | 'status' | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: 'Image', label: 'Image', minWidth: 100, align: 'center' },
  { id: 'name', label: 'Name', minWidth: 200, align: 'left' },
  { id: 'email', label: 'Email', minWidth: 250, align: 'left' },
  { id: 'address', label: 'Address', minWidth: 250, align: 'left' },
  { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
  { id: 'action', label: 'Action', minWidth: 150, align: 'center' },
];

interface DeliveryPerson {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  avatar: string;
  isBlocked: boolean;
}

export default function DeliveryPersonTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const { deliveryPersons } = useSelector((state: RootState) => state.admin);

  React.useEffect(() => {
    dispatch(fetchDeliveryPersons());
  }, [dispatch]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleBlockUnblock = (deliveryPersonId: string, isBlocked: boolean) => {
    const newStatus = !isBlocked; 
    console.log(newStatus,"newstatus")
    dispatch(blockUnblockDeliveryboy(deliveryPersonId, newStatus)); 
    window.location.reload();
    
  };
  const handleRegisterClick = () => {
    navigate('/registerdeliveryboy'); 
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
              {deliveryPersons
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((deliveryPerson: DeliveryPerson) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={deliveryPerson._id}>
                    {columns.map((column) => {
                     
                      if (column.id === 'action') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Button
                              variant="contained"
                              color={deliveryPerson.isBlocked ? 'success' : 'error'}
                              onClick={() => handleBlockUnblock(deliveryPerson._id, deliveryPerson.isBlocked)}
                            >
                              {deliveryPerson.isBlocked ? 'Unblock' : 'Block'}
                            </Button>
                          </TableCell>
                        );
                      }
                      if (column.id === 'Image') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <img src={deliveryPerson?.avatar} style={{widows:"75px", height:"75px"}}/>
                           
                          </TableCell>
                        );
                      }
                      const value = column.id === 'status' ? (deliveryPerson.isBlocked ? 'Blocked' : 'Active') : deliveryPerson[column.id as keyof DeliveryPerson];
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
          count={deliveryPersons.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <Button variant="contained" color="primary" onClick={handleRegisterClick}>
            Register Delivery person
          </Button>
        </div>
      </Paper>
    </MainLayout>
  );
}