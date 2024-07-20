"use client";

import {
  Chart as chartJS,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Booking } from "@/models/booking";
import { FC } from "react";
import { Bar } from "react-chartjs-2";
chartJS.register(Tooltip, CategoryScale, LinearScale, BarElement);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};
const Chart: FC<{ userBookings: Booking[] }> = ({ userBookings }) => {
  const labels = userBookings.map(booking => booking.hotelRoom.name)
  const amountSpent = userBookings.map(booking => booking.totalPrice)

  return (
    <Bar
      options={options}
      data={{
        labels,
        datasets: [
          {
            label: "Amount Spent",
            data: amountSpent,
            borderWidth: 1,
            backgroundColor: "rgba(252, 186, 3, 0.5)",
            hoverBackgroundColor: "rgba(252, 186, 3, 1)",
          },
        ],
      }}
    />
  );
};

export default Chart;
