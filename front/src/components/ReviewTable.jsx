import EntityTable from "./entity/EntityTable";
import useEntity from "../hooks/useEntity";
import {
  getAllReviews,
  addReview,
  updateReview,
  deleteReview,
} from "../API/controller/reviews";

const ReviewController = {
  getAll: getAllReviews,
  add: addReview,
  update: updateReview,
  remove: deleteReview,
};

function ReviewTable() {
  const fields = [
    { name: "rating", label: "Rating", type: "number", min: 1, max: 5, step: 1 },
    { name: "comment", label: "Comment", type: "text", required: false, maxLength: 1000 },
    { name: "review_date", label: "Review Date", type: "date", required: false },
    { name: "customer_id", label: "Customer ID", type: "number", min: 1, step: 1 },
    { name: "renter_id", label: "Renter ID", type: "number", min: 1, step: 1 },
    { name: "order_id", label: "Order ID", type: "number", min: 1, step: 1 },
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
