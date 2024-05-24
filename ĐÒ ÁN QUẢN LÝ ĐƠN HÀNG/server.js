document.addEventListener('DOMContentLoaded', async () => {
    const orderTableBody = document.querySelector('#orderTable tbody');
    const orderForm = document.getElementById('orderForm');
    const navLinks = document.querySelectorAll('nav a');
  
    const fetchOrders = async (status = 'All') => {
      try {
        const response = await fetch('http://localhost:5000/api/orders');
        const orders = await response.json();
        orderTableBody.innerHTML = ''; // Clear the table body before re-adding orders
  
        orders
          .filter(order => status === 'All' || order.orderStatus === status)
          .forEach(order => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
              <td>${new Date(order.createdAt).toLocaleDateString()}</td>
              <td>${order.customerName}</td>
              <td>${order.totalProducts}</td>
              <td>${order.totalAmount}</td>
              <td>${order.orderStatus}</td>
            `;
  
            orderTableBody.appendChild(row);
          });
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const status = link.getAttribute('data-status');
        fetchOrders(status);
      });
    });
  
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const orderItems = orderForm.orderItems.value.split(',').map(item => {
        const [name, quantity, price] = item.split('-').map(i => i.trim());
        return { name, quantity: parseInt(quantity), price: parseFloat(price) };
      });
  
      const newOrder = {
        customerName: orderForm.customerName.value,
        email: orderForm.email.value,
        phone: orderForm.phone.value,
        address: orderForm.address.value,
        orderItems,
        orderStatus: orderForm.orderStatus.value,
      };
  
      try {
        await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newOrder),
        });
  
        fetchOrders(); 
        orderForm.reset(); 
      } catch (error) {
        console.error('Error adding order:', error);
      }
    });
  
    fetchOrders(); 
  });
  