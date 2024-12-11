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
import { fetchUsers, blockUnblockUser } from '../../actions/adminAction';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';

interface Column {
  id: 'image'|'name' | 'email' | 'phoneNumber' | 'status' | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';

}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170, align: 'left' },
  { id: 'email', label: 'Email', minWidth: 200, align: 'left' },
  { id: 'phoneNumber', label: 'Phone', minWidth: 150, align: 'left' },
  { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
  { id: 'action', label: 'Action', minWidth: 150, align: 'center' },
  { id: 'image', label: 'Image', minWidth: 150, align: 'center' }
];

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isBlocked: boolean;
  avatar:string;
}
export default function UserTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch<AppDispatch>();

  const { users } = useSelector((state: RootState) => state.admin);
  console.log(users,"use selecter")

  React.useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleBlockUnblock = (userId: string, isBlocked: boolean) => {
    const newStatus = !isBlocked; 
    dispatch(blockUnblockUser(userId, newStatus)); 
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
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user: User) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={user._id}>
                    {columns.map((column) => {
                      console.log(column, "ccc")
                      if (column.id === 'action') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Button
                              variant="contained"
                              color={user.isBlocked ? 'success' : 'error'}
                              onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                            >
                              {user.isBlocked ? 'Unblock' : 'Block'}
                            </Button>
                            
                          </TableCell>
                        );
                      }
                      if (column.id === 'image') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <img src={user?.avatar} style={{width: "75px", height: "75px"}}></img>
                            
                          </TableCell>
                        );
                      }
                      const value = column.id === 'status' ? (user.isBlocked ? 'Blocked' : 'Active') : user[column.id as keyof User];
                      console.log(user, "üuuu")
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
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </MainLayout>
  );
}