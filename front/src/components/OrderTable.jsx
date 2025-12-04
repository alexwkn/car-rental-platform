import EntityTable from "./entity/EntityTable";
import useEntity from "../hooks/useEntity";
import * as OrderController from "../API/controller/orders";

function OrderTable() {
  const fields = [
    { name: "order_date", label: "Order Date", type: "date" },
    { name: "date_of_return", label: "Date of Return", type: "date" },
    { name: "fuel_level_return", label: "Fuel Level Return", type: "number" },
    { name: "payment_status", label: "Payment Status", type: "text" },
    { name: "offer_id", label: "Offer ID", type: "number" },
    { name: "customer_id", label: "Customer ID", type: "number" },
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
