import EntityTable from "./entity/EntityTable";
import useEntity from "../hooks/useEntity";
import {
  getAllOffers,
  addOffer,
  updateOffer,
  deleteOfferById,
} from "../API/controller/offers";

const OfferController = {
  getAll: getAllOffers,
  add: addOffer,
  update: updateOffer,
  remove: deleteOfferById,
};

function OfferTable() {
  const fields = [
    { name: "start_date", label: "Start Date", type: "date" },
    { name: "end_date", label: "End Date", type: "date" },
    { name: "fuel_level", label: "Fuel Level", type: "number", min: 0, max: 100, step: 0.01 },
    { name: "adress", label: "Adress", type: "text", maxLength: 255 },
    { name: "price", label: "Price", type: "number", min: 0.01, step: 0.01 },
    { name: "description", label: "Description", type: "text", required: false, maxLength: 1000 },
    { name: "vehicule_id", label: "Vehicule ID", type: "number", min: 1, step: 1 },
  ];

  const columns = [
    { key: "offer_id", label: "Offer ID" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "fuel_level", label: "Fuel Level" },
    { key: "adress", label: "Adress" },
    { key: "price", label: "Price" },
    { key: "description", label: "Description" },
    { key: "vehicule_id", label: "Vehicule ID" },
    { key: "edit", label: "Edit" },
  ];

  const hook = useEntity(OfferController);

  return (
    <EntityTable
      title="Offer"
      fields={fields}
      columns={columns}
      hook={hook}
      idField="offer_id"
    />
  );
}

export default OfferTable;
