import EntityTable from "./entity/EntityTable";
import useEntity from "../hooks/useEntity";
import * as ReviewController from "../API/controller/reviews";

function ReviewTable() {
  const fields = [
    { name: "rating", label: "Rating", type: "number" },
    { name: "comment", label: "Comment", type: "text" },
    { name: "review_date", label: "Review Date", type: "date" },
    { name: "customer_id", label: "Customer ID", type: "number" },
    { name: "renter_id", label: "Renter ID", type: "number" },
    { name: "order_id", label: "Order ID", type: "number" },
  ];

  const columns = [
    { key: "review_id", label: "Review ID" },
    { key: "rating", label: "Rating" },
    { key: "comment", label: "Comment" },
    { key: "review_date", label: "Review Date" },
    { key: "customer_id", label: "Customer ID" },
    { key: "renter_id", label: "Renter ID" },
    { key: "order_id", label: "Order ID" },
    { key: "edit", label: "Edit" },
  ];

  const hook = useEntity(ReviewController);

  return (
    <EntityTable
      title="Review"
      fields={fields}
      columns={columns}
      hook={hook}
      idField="review_id"
    />
  );
}

export default ReviewTable;
