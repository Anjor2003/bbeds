"use client";

import { Dispatch, FC, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  checkinDate: Date | null;
  setCheckinDate: Dispatch<SetStateAction<Date | null>>;
  checkoutDate: Date | null;
  setCheckoutDate: Dispatch<SetStateAction<Date | null>>;
  setAdults: Dispatch<SetStateAction<number>>;
  setNumberOfChildren: Dispatch<SetStateAction<number>>;
  calcMinCkeckoutDate: () => Date | undefined;
  price: number;
  discount: number;
  adults: number;
  numberOfChildren: number;
  specialNote: string;
  isBooked: boolean;
  handleBookNowClick: () => void;
};

const BookRoomCta: FC<Props> = (props) => {
  const {
    price,
    discount,
    specialNote,
    checkinDate,
    checkoutDate,
    adults,
    numberOfChildren,
    setCheckinDate,
    setCheckoutDate,
    calcMinCkeckoutDate,
    setAdults,
    setNumberOfChildren,
    isBooked,
    handleBookNowClick,
  } = props;
  const discountPrice = price - (price / 100) * discount;

  const calNoDays = () => {
    if (!checkinDate || !checkoutDate) return 0;
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    const noDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return noDays;
  };

  return (
    <div className="px-7 py-6">
      <h3>
        <span
          className={`${discount ? "text-gray-400" : ""} font-bold text-lg`}
        >
          {price} €
        </span>
        {discount ? (
          <span className="font-bold text-lg ml-2">
            | Dto. {discount}%. Ahora
            <span className="text-tertiary-dark ml-2">{discountPrice} €</span>
          </span>
        ) : (
          ""
        )}
      </h3>
      <div className="w-full border-b-2 border-b-secondary my-2" />
      <h4 className="my-8">{specialNote}</h4>
      <div className="flex">
        <div className="w-1/2 px-3">
          <label
            htmlFor="check-in-date"
            className="block text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Check In date
          </label>
          <DatePicker
            selected={checkinDate}
            onChange={(date) => setCheckinDate(date)}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            id="check-in-date"
            className="w-full border border-gray-300 text-black rounded-lg p-2.5 focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="w-1/2 px-3">
          <label
            htmlFor="check-out-date"
            className="block text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Check Out date
          </label>
          <DatePicker
            selected={checkoutDate}
            onChange={(date) => setCheckoutDate(date)}
            disabled={!checkinDate}
            dateFormat="dd/MM/yyyy"
            minDate={calcMinCkeckoutDate()}
            id="check-out-date"
            className="w-full border border-gray-300 text-black rounded-lg p-2 focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="flex mt-4">
        <div className="w-1/2 px-3">
          <label
            htmlFor="adults"
            className="block text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Adultos
          </label>
          <input
            type="number"
            id="adults"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            min={1}
            max={5}
            className="w-full border border-gray-300 text-black rounded-lg p-2.5 focus:outline-none"
          />
        </div>
        <div className="w-1/2 px-3">
          <label
            htmlFor="children"
            className="block text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Niños
          </label>
          <input
            type="number"
            id="children"
            value={numberOfChildren}
            onChange={(e) => setNumberOfChildren(Number(e.target.value))}
            min={0}
            max={3}
            className="w-full border border-gray-300 text-black rounded-lg p-2.5 focus:outline-none"
          />
        </div>
      </div>
      {calNoDays() > 0 ? <p className="mt-5 px-3">
        Precio Total: {discountPrice * calNoDays()} €
      </p>:<></>}
      <button disabled={isBooked} onClick={handleBookNowClick} className="mt-5 btn-primary w-full px-3 disabled:bg-gray-300 disabled:cursor-not-allowed">
        {isBooked ? "Reservado" : "Reservar"}
      </button>
    </div>
  );
};

export default BookRoomCta;
