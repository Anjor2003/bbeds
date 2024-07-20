import { getRoom } from "@/libs/apis";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";


const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
})
type RequesrData = {
  checkinDate: string
  checkoutDate: string
  adults: number
  children: number
  numberOfDays: number
  hotelRoomSlug: string
}

export async function POST(req: Request, res: Response) {
  const { adults, checkinDate, checkoutDate, hotelRoomSlug, children, numberOfDays }: RequesrData = await req.json()

  if (!adults || !checkinDate || !checkoutDate || !hotelRoomSlug || !numberOfDays) {
    {
      return new NextResponse("Por favor todos los campos son necesarios", { status: 400 })
    }
  }
  const origin = req.headers.get("origin")
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse("Debe estar autenticado", { status: 401 })
  }
  const userId = session.user.id
  const formattedcheckoutDate = checkoutDate.split('T')[0]
  const formattedcheckinDate = checkinDate.split('T')[0]
  try {
    
    const room = await getRoom(hotelRoomSlug)
    const discountPrice = room.price - ((room.price /100) * room.discount)
    const totalPrice = discountPrice * numberOfDays
    // Creamos pago en Stripe
    const stripeSession = await stripe.checkout.sessions.create({
       mode: "payment",
       line_items: [
         {
          quantity: 1,
          price_data: {
            currency: "eur",
            product_data: {
              name: room.name,
              images: room.images.map(image => image.url),
            },
            unit_amount: parseInt((totalPrice * 100).toString()),
          },
         },
       ],
       payment_method_types : ["card"],
       success_url: `${origin}/users/${userId}`,
       metadata: {
         adults,
         checkinDate: formattedcheckinDate,
         checkoutDate: formattedcheckoutDate,
         children,
         hotelRoom: room._id,
         numberOfDays,
         user: userId, 
         discount: room.discount,
         totalPrice
       },
      //  cancel_url: `${origin}/?canceled=true`,
      //  customer_email: session.user.email
    })


    return NextResponse.json(stripeSession, {
      status: 200,
      statusText:"Session de pago creada",
    })
  } catch (error) {
     console.log('El pago ha fallado', error)
    return new NextResponse("El pago ha fallado", { status: 500 })
  }
}