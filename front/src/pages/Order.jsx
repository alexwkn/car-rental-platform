import OrderTable from "../components/OrderTable";
import BackOfficeLayout from "../layout/BackOfficeLayout";

const Order = () => {
  return (
    <>
      <BackOfficeLayout>
        <OrderTable />
      </BackOfficeLayout>
    </>
  );
};

export default Order;
