import EntityTable from "./entity/EntityTable";
import useEntity from "../hooks/useEntity";
import {
  getAllOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} from "../API/controller/orders";
const OrderController = {
  getAll: getAllOrders,
  add: addOrder,
  update: updateOrder,
  remove: deleteOrder,
};

function OrderTable() {
  const fields = [
    { name: "order_date", label: "Order Date", type: "date", required: false },
    { name: "date_of_return", label: "Date of Return", type: "date" },
    { name: "fuel_level_return", label: "Fuel Level Return", type: "number", min: 0, max: 999.99, step: 0.01 },
    { name: "payment_status", label: "Payment Status", type: "select",
  options: [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
  ] },
    { name: "offer_id", label: "Offer ID", type: "number", min: 1, step: 1 },
    { name: "customer_id", label: "Customer ID", type: "number", min: 1, step: 1 },
  ];

  const columns = [
    { key: "order_id", label: "Order ID" },
    { key: "order_date", label: "Order Date" },
    { key: "date_of_return", label: "Date of Return" },
    { key: "fuel_level_return", label: "Fuel Level Return" },
    { key: "payment_status", label: "Payment Status" },
    { key: "offer_id", label: "Offer ID" },
    { key: "customer_id", label: "Customer ID" },
    { key: "edit", label: "Edit" },
  ];

  const hook = useEntity(OrderController);

  return (
    <EntityTable
      title="Order"
      fields={fields}
      columns={columns}
      hook={hook}
      idField="order_id"
    />
  );
}

export default OrderTable;
