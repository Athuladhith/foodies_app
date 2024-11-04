// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import MainLayout from '../restaurant/Mainlayout';
// // import io from 'socket.io-client';
// // import {
// //   Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions
// // } from '@mui/material';
// // import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
// // import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'; // Tailwind classes for table
// // const socket = io('http://localhost:5000')

// // interface Order {
// //   id: string;
// //   foodItems: { foodItemName: string; quantity: number }[];
// //   totalAmount: number;
// //   deliveryAddress: string;
// //   paymentMethod: string;
// //   orderStatus: 'pending' | 'picked' | 'delivered';
// // }

// // const DeliveryBoyHome: React.FC = () => {
// //   const [orders, setOrders] = useState<Order[]>([]);
// //   const[order,setorder]=useState('')
// //   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
// //   const [openDialog, setOpenDialog] = useState(false);
  
// //   const deliveryBoyId = localStorage.getItem('deliveryBoyId');
  
// //   useEffect(() => {
// //     // Fetch orders for the delivery boy
// //     const fetchOrders = async () => {
// //       try {
// //         const response = await axios.get(`http://localhost:5000/api/delivery/orders/${deliveryBoyId}`);
// //         const fetchedOrders = response.data.map((order: any) => ({
// //           id: order._id,
// //           foodItems: order.foodItems.map((item: any) => ({
// //             foodItemName: item.foodItem.name,
// //             quantity: item.quantity,
// //           })),
// //           totalAmount: order.totalAmount,
// //           deliveryAddress: order.address,
// //           paymentMethod: order.paymentMethod,
// //           orderStatus: order.orderStatus, // Assuming backend sends correct status
// //         }));
// //         setOrders(fetchedOrders);
// //       } catch (error) {
// //         console.error('Error fetching orders:', error);
// //       }
// //     };
// //     socket.on('order confermation',(neworder)=>{
// // setorder(neworder);
// // console.log(neworder,'delivery boy notification ')
// //     })
// //     fetchOrders();
// //   }, [deliveryBoyId]);
// //   socket.on('order confermation',(neworder)=>{
// //     setorder(neworder);
// //     console.log(neworder,'delivery boy notification ')
// //         })
  
// //   const handlePickedUp = (orderId: string) => {
// //     setOrders(orders.map(order =>
// //       order.id === orderId ? { ...order, orderStatus: 'picked' } : order
// //     ));
// //   };

// //   const handleDelivered = (orderId: string) => {
// //     setOrders(orders.map(order =>
// //       order.id === orderId ? { ...order, orderStatus: 'delivered' } : order
// //     ));
// //   };

// //   const handleViewDetails = (order: Order) => {
// //     setSelectedOrder(order);
// //     setOpenDialog(true);
// //   };

// //   const handleCloseDialog = () => {
// //     setOpenDialog(false);
// //     setSelectedOrder(null);
// //   };

// //   return (
// //     <MainLayout>
// //       <div className="p-6 bg-gray-100">
// //         <Typography variant="h4" className="text-center mb-4">
// //           Delivery Boy Orders
// //         </Typography>
        
// //         <div className="overflow-x-auto">
// //           <Table className="min-w-full bg-white shadow-md rounded-lg">
// //             <Thead>
// //               <Tr>
// //                 <Th>Food Items</Th>
// //                 <Th>Total Amount</Th>
// //                 <Th>Delivery Address</Th>
// //                 <Th>Status</Th>
// //                 <Th>Actions</Th>
// //               </Tr>
// //             </Thead>
// //             <Tbody>
// //               {orders.map((order) => (
// //                 <Tr key={order.id}>
// //                   <Td>
// //                     {order.foodItems.map((item) => (
// //                       <div key={item.foodItemName}>
// //                         {item.foodItemName} (x{item.quantity})
// //                       </div>
// //                     ))}
// //                   </Td>
// //                   <Td>${order.totalAmount}</Td>
// //                   <Td>{order.deliveryAddress}</Td>
// //                   <Td>
// //                     <Typography className={`${
// //                       order.orderStatus === 'pending' ? 'text-orange-500' : 
// //                       order.orderStatus === 'picked' ? 'text-blue-500' : 
// //                       'text-green-500'
// //                     }`}>
// //                       {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
// //                     </Typography>
// //                   </Td>
// //                   <Td>
// //                     {order.orderStatus === 'pending' && (
// //                       <Button variant="contained" color="primary" className="mr-2" onClick={() => handlePickedUp(order.id)}>
// //                         Picked Up
// //                       </Button>
// //                     )}
// //                     {order.orderStatus === 'picked' && (
// //                       <Button variant="contained" color="success" className="mr-2" onClick={() => handleDelivered(order.id)}>
// //                         Delivered
// //                       </Button>
// //                     )}
// //                     <Button variant="outlined" onClick={() => handleViewDetails(order)} className="ml-2">
// //                       View Details
// //                     </Button>
// //                   </Td>
// //                 </Tr>
// //               ))}
// //             </Tbody>
// //           </Table>
// //         </div>

// //         {/* Dialog for viewing order details */}
// //         {selectedOrder && (
// //           <Dialog open={openDialog} onClose={handleCloseDialog}>
// //             <DialogTitle>Order Details</DialogTitle>
// //             <DialogContent>
// //               <Typography variant="body1"><strong>Food Items:</strong></Typography>
// //               {selectedOrder.foodItems.map(item => (
// //                 <Typography key={item.foodItemName} variant="body2">{item.foodItemName} (x{item.quantity})</Typography>
// //               ))}
// //               <Typography variant="body1"><strong>Total Amount:</strong> ${selectedOrder.totalAmount}</Typography>
// //               <Typography variant="body1"><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</Typography>
// //               <Typography variant="body1"><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</Typography>
// //               <Typography variant="body1"><strong>Status:</strong> {selectedOrder.orderStatus}</Typography>
// //             </DialogContent>
// //             <DialogActions>
// //               <Button onClick={handleCloseDialog}>Close</Button>
// //             </DialogActions>
// //           </Dialog>
// //         )}
// //       </div>
// //     </MainLayout>
// //   );
// // };

// // export default DeliveryBoyHome;

// ////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import MainLayout from './Mainlayout';
import jwt_decode from 'jwt-decode';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../store';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

import { io } from 'socket.io-client';
import axios from 'axios';
const socket = io('http://localhost:5000');

interface DecodedToken {
  deliveryPersonId: string;
}

// interface OrderDetails {
//   orderId?: string;
 
//   // Add any other expected properties here
// }
interface OrderDetails {
  _id: string;
  address: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  orderId:string;
}

const DeliveryPersonHome: React.FC = () => {
  const [deliveryPersonId, setDeliveryPersonId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([
    " "
  ]);
  const [orderDetails, setOrderDetails] =  useState<OrderDetails[]>([]);
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error,  } = useSelector((state: RootState) => state.deliveryboy);

  // console.log(deliveryPerson, "delivery person info");
  console.log(isAuthenticated, "is authenticated");

  const token = localStorage.getItem('deliveryPersonToken');
  const userid = localStorage.getItem('userId');
  console.log(userid, "User ID");

  // Function to parse JWT token and extract delivery person ID
  function parseJwt(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as DecodedToken;
    } catch (error) {
      console.error('Failed to parse token:', error);
      return null;
    }
  }

  const newToken = token ? parseJwt(token) : null;

  useEffect(() => {
    if (newToken) {
      setDeliveryPersonId(newToken.deliveryPersonId);
    }
  }, [newToken]);

  useEffect(()=>{
    const FetchdeliverOrders=async()=>{
      try {
      
        const response= await axios.get(`http://localhost:5000/api/deliveryperson/deliveryorder/${notifications}`)
        console.log(response.data.data,"delivery sta")
        setOrderDetails(response.data.data)

        const Orders=response.data.data
        
      } catch (error) {
        console.error('error occurder while fetching',error)
      }

    }
   
   FetchdeliverOrders()
  },[notifications])

 

  useEffect(() => {
    // Listen to the 'delivery' event and handle incoming data
    socket.on('delivery', (orderId: OrderDetails) => {
      if (orderId) {
        console.log("Order details received on delivery event:", orderId.orderId);
        setNotifications(orderId.orderId as any)

        // Check if orderdetails has expected properties
        if (typeof orderId === 'object' && orderId.orderId) {
          console.log(`Order ID: ${orderId.orderId}`);
          // Here, you can update the notifications or other state based on received order details
        } else {
          console.warn("Received order details, but structure is unexpected:", orderId);
        }
      } else {
        console.error("No order details received from 'delivery' event");
      }
    });
    console.log(orderDetails,'orderssssssssssssssssss')

    // Clean up the socket listener on component unmount
    return () => {
      socket.off('delivery');
    };
  }, []);
  console.log(orderDetails,'order from socketio')

  return (
    <MainLayout>
    <Typography variant="h4" gutterBottom>
      Delivery Orders
    </Typography>
    
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Payment Status</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Order Status</TableCell>
            <TableCell>Order Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {Object.values(orderDetails).map((order: OrderDetails) => (
      <TableRow key={order._id}>
        <TableCell>{order._id}</TableCell>
        <TableCell>{order.address}</TableCell>
        <TableCell>{order.paymentMethod}</TableCell>
        <TableCell>{order.paymentStatus}</TableCell>
        <TableCell>${order.totalAmount}</TableCell>
        <TableCell>{order.orderStatus}</TableCell>
        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
      </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </MainLayout>
  );
};

export default DeliveryPersonHome;
    


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// import React, { useState, useEffect } from 'react';
// import MainLayout from './Mainlayout';
// import jwt_decode from 'jwt-decode';
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from '../../store';

// import { io } from 'socket.io-client';
// import axios from 'axios';
// import { TableContainer, Typography } from '@mui/material';
// const socket = io('http://localhost:5000');

// interface DecodedToken {
//   deliveryPersonId: string;
// }

// // interface OrderDetails {
// //   orderId?: string;
 
// //   // Add any other expected properties here
// // }
// // interface OrderDetails {
// //   orderId?: string;
// //   name?: string;
// //   address?: string;
// //   paymentMethod?: string;
// //   amount?: number;
// // }

// interface OrderDetails {
//   id: string;
//   user:string;
//   foodItems: { foodItemName: string; quantity: number }[];
//   totalAmount: number;
//   deliveryAddress: {
//     street: string;
//     city: string;
//     state: string;
//     postalCode: string;
//     country: string;
//   };
//   paymentMethod: string;
//   orderStatus: 'pending' | 'accepted' | 'rejected';
// }


// const DeliveryPersonHome: React.FC = () => {
//   const [deliveryPersonId, setDeliveryPersonId] = useState<string | null>(null);
//   const [notifications, setNotifications] = useState<string[]>([
//     " "
//   ]);
//   const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);
//   const dispatch = useDispatch();
//   const { isAuthenticated, loading, error,  } = useSelector((state: RootState) => state.deliveryboy);

//   // console.log(deliveryPerson, "delivery person info");
//   console.log(isAuthenticated, "is authenticated");

//   const token = localStorage.getItem('deliveryPersonToken');
//   const userid = localStorage.getItem('userId');
//   console.log(userid, "User ID");

//   // Function to parse JWT token and extract delivery person ID
//   function parseJwt(token: string): DecodedToken | null {
//     try {
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const jsonPayload = decodeURIComponent(
//         window.atob(base64)
//           .split('')
//           .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//           .join('')
//       );
//       return JSON.parse(jsonPayload) as DecodedToken;
//     } catch (error) {
//       console.error('Failed to parse token:', error);
//       return null;
//     }
//   }

//   const newToken = token ? parseJwt(token) : null;

//   useEffect(() => {
//     if (newToken) {
//       setDeliveryPersonId(newToken.deliveryPersonId);
//     }
//   }, [newToken]);

//  useEffect(() => {
//   const fetchOrderDetails = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/deliveryperson/deliveryorder/${notifications}`);
//       console.log("API response data:", response.data); // Check the structure here
//       const fetchedOrders = response.data.map((order: any) => ({
//         id: order._id,
//         user:order.user,
//         foodItems: order.foodItems.map((item: any) => ({
//           foodItemName: item.foodItem.name,
//           quantity: item.quantity,
//         })),
//         totalAmount: order.totalAmount,
//         deliveryAddress: order.address,
//         paymentMethod: order.paymentMethod,
//         orderStatus: "pending",
//       }));
     
//       setOrderDetails(fetchedOrders);
      

     
//     } catch (error) {
//       console.error("Error fetching delivery order:", error);
//     }
//   };

//   fetchOrderDetails();
// }, [notifications]);
//   useEffect(() => {
//     // Listen to the 'delivery' event and handle incoming data
//     socket.on('delivery', (order: OrderDetails) => {
//       setOrderDetails(prevOrders => [order, ...prevOrders])
     
//       }
//     );

//     // Clean up the socket listener on component unmount
//     return () => {
//       socket.off('delivery');
//     };
//   }, []);

// console.log(orderDetails,"stae")


//   return (
//     <MainLayout>
//       <div>
//         <h2>Order Details</h2>
//         <h2>Order Details</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Order ID</th>
//             <th>Food Items</th>
//             <th>Total Amount</th>
//             <th>Delivery Address</th>
//             <th>Payment Method</th>
//             <th>Order Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orderDetails.map((order) => (
//             <tr key={order.id}>
//               <td>{order.id}</td>
//               <td>
//                 {/* {order.order.foodorders.map((order.order, index) => (
//                   <div key={index}>
//                     <strong>{order.order.foodorderName}</strong> (Qty: {order.order.quantity})
//                   </div>
//                 ))} */}
//               </td>
//               <td>${order.order.totalAmount}</td>
//               {/* {order.order.deliveryAddress.map((item)=>{
//                 <td>{item.city}</td>
//               })} */}
//               <td>{order.order.paymentMethod}</td>
//               <td>{order.order.orderStatus}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//     </MainLayout>
//   );
// };

// export default DeliveryPersonHome;
