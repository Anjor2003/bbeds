import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createBooking, updatedHotelRoom } from "@/libs/apis";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log(body, sig, endpointSecret);

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) return;

    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (error: any) {
    console.log(error);
    return new NextResponse("Webhook Error", { status: 400 });
  }
  console.log(event);
  

  // load our event
  switch (event.type) {
    case "checkout.session.completed":
      const endpoint = event.data.object;
      const {
        metadata = null, // Add a default value of null
        ...rest
      } = endpoint;

      if (metadata) {
        const {
          adults,
          checkinDate,
          checkoutDate,
          children,
          hotelRoom,
          numberOfDays,
          user,
          discount,
          totalPrice,
        } = metadata;

        // Crear Reserva

      await createBooking({
        adults: Number(adults),
        checkinDate,
        checkoutDate,
        children: Number(children),
        hotelRoom,
        numberOfDays: Number(numberOfDays),
        discount: Number(discount),
        totalPrice: Number(totalPrice),
        user,
      });

      // Axtualizamos Habitacion y Disponibilidad
      await updatedHotelRoom(hotelRoom);
  
      return new NextResponse("Booking successful", {
        status: 200,
        statusText: "Booking successful",
      });
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return new NextResponse("Event Received", {
    status: 200,
    statusText: "Event Received",
  });
}

