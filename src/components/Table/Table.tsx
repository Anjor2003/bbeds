"use client";
import { Dispatch, FC, SetStateAction } from "react";
import { useRouter } from "next/navigation";

import { Booking } from "@/models/booking";

type Props = {
  bookingDetails: Booking[];
  setRoomId: Dispatch<SetStateAction<string | null>>;
  toggleRatingModal: () => void;
};

const Table: FC<Props> = ({ bookingDetails, setRoomId, toggleRatingModal }) => {
  const router = useRouter();
  return (
    <div className="overflow-x-auto max-w-[440px] rounded-lg mx-auto md:max-w-full shadow-md sm:shadow-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Roon Name</th>
            <th className="px-6 py-3">Unit Price</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Discount</th>
            <th className="px-6 py-3">No. Days Booked</th>
            <th className="px-6 py-3">Days Left</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {bookingDetails.map((booking) => (
            <tr
              key={booking._id}
              className="bg-white border-b hover:bg-gray-50"
            >
              <th
                onClick={() =>
                  router.push(`/rooms/${booking.hotelRoom.slug.current}`)
                }
                className="px-6 py-4 underline text-blue-600 cursor-pointer font-medium whitespace-nowrap"
              >
                {booking.hotelRoom.name}
              </th>
              <td className="px-6 py-4 text-center">
                {booking.hotelRoom.price}
              </td>
              <td className="px-6 py-4 text-center">{booking.totalPrice}</td>
              <td className="px-6 py-4 text-center">{booking.discount}</td>
              <td className="px-6 py-4 text-center">{booking.numberOfDays}</td>
              <td className="px-6 py-4 text-center">0</td>
              <td className="px-6 py-4 ">
                <button
                  onClick={() => {
                    setRoomId(booking.hotelRoom._id);
                    toggleRatingModal();
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  Rate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
